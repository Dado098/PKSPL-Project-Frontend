import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Project, ProjectStatus } from '../types/project';
import { LandCoverPolygon, IndexItem, MapLayer } from '../types/spatial';
import { AnalystFeedback } from '../types/review';
import { INITIAL_PROJECTS } from '../mock/initialProjects';
import {
  INITIAL_LAND_COVERS,
  INITIAL_INDEX_LIST,
  INITIAL_MAP_LAYERS,
  JAKARTA_LAND_COVERS,
  JAKARTA_INDEX_LIST,
  JAKARTA_MAP_LAYERS,
  NUSA_PENIDA_LAND_COVERS,
  NUSA_PENIDA_INDEX_LIST,
  NUSA_PENIDA_MAP_LAYERS,
  generateMockPolygonsForProject,
  generateMockIndicesForProject
} from '../mock/spatialData';
import {
  ALL_PROJECT_LAND_COVERS,
  ALL_PROJECT_INDICES,
  ALL_PROJECT_LAYERS,
  getFallbackLandCoversForProject,
  getFallbackIndicesForProject,
  getFallbackLayersForProject
} from '../mock/projectMockRegistry';
import { INITIAL_ANALYST_FEEDBACK } from '../mock/analystReviewMock';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { createProyek, deleteProyek, getProyekList } from '../../services/projectService';
import { createIndexApi, createLandCoverApi, deleteLandCoverApi, getIndexesApi, updateIndexApi, updateLandCoverApi } from '../../services/indexService';
import { annotationService } from '../../analyst/services/annotationService';
import { ReviewComment } from '../../analyst/types/annotation';

import { AreaServiceConfig, EcosystemServiceId } from '../types/valuation';
import { getValuationConfigs, upsertValuationConfigs } from '../services/valuationDataService';

interface ProjectContextType {
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string;
  activeProject: Project | null;
  activeProjectId: string;
  landCovers: LandCoverPolygon[];
  indices: IndexItem[];
  layers: MapLayer[];
  analystFeedback: AnalystFeedback | null;
  areaConfigs: Record<string, AreaServiceConfig>;
  setActiveProjectId: (id: string) => void;
  createProject: (name: string, description: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  updateProjectStatus: (id: string, status: ProjectStatus, notes?: string, reviewer?: string) => void;
  addShpLayer: (name: string, featureCount: number, crs: string, targetProjId?: string) => void;
  setProjectHasShp: (projectId: string, hasShp: boolean) => void;
  getProjectLandCovers: (projectId: string) => LandCoverPolygon[];
  getProjectIndices: (projectId: string) => IndexItem[];
  getProjectLayers: (projectId: string) => MapLayer[];
  updateAreaConfig: (areaId: string, updates: Partial<AreaServiceConfig>) => void;
  getAreaConfig: (areaId: string) => AreaServiceConfig;
  createIndex: (item: Omit<IndexItem, 'id'>) => IndexItem;
  createManualIndex: (item: {
    code: string;
    name: string;
    description: string;
    landCovers: { name: string; areaHa: number; description?: string }[];
  }) => Promise<IndexItem>;
  updateManualIndex: (item: {
    id: string;
    code: string;
    name: string;
    description: string;
    landCovers: { id?: string; name: string; areaHa: number; description?: string }[];
  }) => Promise<void>;
  updateIndex: (id: string, updates: Partial<IndexItem>) => void;
  deleteIndex: (id: string) => void;
  linkPolygonToIndex: (polygonId: string, indexId: string) => void;
  unlinkPolygonFromIndex: (polygonId: string) => void;
  createIndexFromPolygon: (polygonId: string, customCode?: string) => IndexItem;
  simulateAnalystRejection: () => void;
  resolveFeedback: () => void;
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  PROJECTS: 'pkspl_peneliti_projects_v1',
  ACTIVE_ID: 'pkspl_peneliti_active_id_v1',
  PROJECT_LAND_COVERS: 'pkspl_peneliti_proj_landcovers_v2',
  PROJECT_INDICES: 'pkspl_peneliti_proj_indices_v2',
  PROJECT_LAYERS: 'pkspl_peneliti_proj_layers_v2',
  FEEDBACK: 'pkspl_peneliti_feedback_v1',
  AREA_CONFIGS: 'pkspl_peneliti_area_configs_v1',
};

export const DEFAULT_AREA_CONFIG: AreaServiceConfig = {
  activeServices: {
    provisioning: true,
    regulating: true,
    supporting: true,
    cultural: true,
  },
  selectedMethods: {
    provisioning: 'market-price',
    regulating: 'replacement-cost',
    supporting: 'nursery-ground',
    cultural: 'tcm',
  },
  biota: 'flora',
};

const INITIAL_PROJECT_LAND_COVERS: Record<string, LandCoverPolygon[]> = {
  ...ALL_PROJECT_LAND_COVERS,
};

const INITIAL_PROJECT_INDICES: Record<string, IndexItem[]> = {
  ...ALL_PROJECT_INDICES,
};

const INITIAL_PROJECT_LAYERS: Record<string, MapLayer[]> = {
  ...ALL_PROJECT_LAYERS,
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const toProjectStatus = (status: string | undefined): ProjectStatus => {
  const normalized = (status || '').toLowerCase().trim();
  if (normalized === 'proses' || normalized === 'dikerjakan') return 'DIKERJAKAN';
  if (normalized === 'submitted' || normalized === 'siap_review') return 'MENUNGGU_ANALYST';
  if (normalized === 'dalam_review' || normalized === 'review' || normalized === 'in_review') return 'DALAM_REVIEW';
  if (normalized === 'need revision' || normalized === 'revisi' || normalized === 'perlu_perbaikan') return 'REVISI';
  if (normalized === 'selesai' || normalized === 'approved' || normalized === 'published') return 'SELESAI';
  return 'DRAFT';
};

const fromApiProject = (project: any, fallbackLead = 'Peneliti Utama'): Project => {
  const code = project.kode_proyek || (project.id_proyek ? `PRJ-${String(project.id_proyek).padStart(3, '0')}` : String(project.id ?? ''));
  const idKey = String(project.id_proyek ?? project.id ?? code);

  let status = toProjectStatus(project.status || project.raw_status);

  // Reviewer and notes resolution
  let rawReviewers: string[] = [];
  if (Array.isArray(project.reviewers) && project.reviewers.length > 0) {
    rawReviewers.push(...project.reviewers);
  }
  const backendReviewedBy = project.reviewed_by || project.reviewedBy || project.reviewer?.nama || project.reviewer?.name;
  if (backendReviewedBy) {
    rawReviewers.push(...String(backendReviewedBy).split(',').map(s => s.trim()).filter(Boolean));
  }
  const localReviewersCode = annotationService.getProjectReviewers(code);
  if (localReviewersCode.length > 0) rawReviewers.push(...localReviewersCode);
  if (idKey && idKey !== code) {
    const localReviewersId = annotationService.getProjectReviewers(idKey);
    if (localReviewersId.length > 0) rawReviewers.push(...localReviewersId);
  }

  const uniqueReviewers: string[] = [];
  for (const r of rawReviewers) {
    if (!uniqueReviewers.some(u => u.toLowerCase() === r.toLowerCase())) {
      uniqueReviewers.push(r);
    }
  }

  if (uniqueReviewers.length === 0 && (status === 'DALAM_REVIEW' || status === 'REVISI' || status === 'PERLU_PERBAIKAN')) {
    uniqueReviewers.push('Dr. Benny Nababan');
  }

  let reviewedBy = uniqueReviewers.length > 0 ? uniqueReviewers.join(', ') : undefined;
  let analystComment = project.analyst_comment || project.catatan_revisi || project.notes;

  try {
    const localStatus = localStorage.getItem(`pkspl_status_${code}`) || localStorage.getItem(`pkspl_status_${idKey}`);
    if (localStatus) {
      status = toProjectStatus(localStatus);
    }
    const localNotes = localStorage.getItem(`pkspl_status_notes_${code}`) || localStorage.getItem(`pkspl_status_notes_${idKey}`);
    if (localNotes) {
      analystComment = localNotes;
    }
  } catch {
    // Ignore localStorage errors
  }

  return {
    id: idKey,
    code,
    name: project.nama_proyek || project.name || '',
    description: project.deskripsi || project.description || '',
    status,
    reviewedBy,
    reviewers: uniqueReviewers,
    analystComment,
    lead: project.user?.nama || project.lead || fallbackLead,
    location: project.location || project.alamat_lengkap || project.kabupaten_kota?.nama || project.provinsi?.nama || '-',
    ecosystem: project.ecosystem || project.ekosistem || 'Ekosistem Pesisir',
    year: Number(project.tahun || project.year || new Date().getFullYear()),
    createdAt: project.created_at || '',
    updatedAt: project.updated_at || project.updatedAt || '',
    hasShp: Boolean(project.shapefile_files && Object.keys(project.shapefile_files).length),
  };
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(() => {
    const loaded = loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return loaded.map(p => {
      const init = INITIAL_PROJECTS.find(i => i.id === p.id || i.code === p.code);
      return {
        ...p,
        hasShp: p.hasShp !== undefined ? p.hasShp : (init ? init.hasShp : false),
      };
    });
  });
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;
    setProjectsLoading(true);
    setProjectsError('');

    getProyekList({ per_page: 100 })
      .then((data) => {
        if (mounted) {
          setProjects((Array.isArray(data) ? data : []).map((project) => fromApiProject(project, user?.nama)));
        }
      })
      .catch(() => {
        if (mounted) setProjectsError('Daftar proyek gagal dimuat dari server.');
      })
      .finally(() => {
        if (mounted) setProjectsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id_user, user?.nama]);

  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => 
    loadFromStorage<string>(STORAGE_KEYS.ACTIVE_ID, 'PKS-994KY1')
  );

  const [projectLandCovers, setProjectLandCovers] = useState<Record<string, LandCoverPolygon[]>>(() => {
    const loaded = loadFromStorage<Record<string, LandCoverPolygon[]>>(STORAGE_KEYS.PROJECT_LAND_COVERS, INITIAL_PROJECT_LAND_COVERS);
    return {
      ...INITIAL_PROJECT_LAND_COVERS,
      ...loaded,
    };
  });

  const [projectIndices, setProjectIndices] = useState<Record<string, IndexItem[]>>(() => {
    const loaded = loadFromStorage<Record<string, IndexItem[]>>(STORAGE_KEYS.PROJECT_INDICES, INITIAL_PROJECT_INDICES);
    return {
      ...INITIAL_PROJECT_INDICES,
      ...loaded,
    };
  });

  const [projectLayers, setProjectLayers] = useState<Record<string, MapLayer[]>>(() => {
    const loaded = loadFromStorage<Record<string, MapLayer[]>>(STORAGE_KEYS.PROJECT_LAYERS, INITIAL_PROJECT_LAYERS);
    return {
      ...INITIAL_PROJECT_LAYERS,
      ...loaded,
    };
  });

  const [analystFeedback, setAnalystFeedback] = useState<AnalystFeedback | null>(() => 
    loadFromStorage<AnalystFeedback | null>(STORAGE_KEYS.FEEDBACK, INITIAL_ANALYST_FEEDBACK)
  );

  const [areaConfigs, setAreaConfigs] = useState<Record<string, AreaServiceConfig>>(() => 
    loadFromStorage<Record<string, AreaServiceConfig>>(STORAGE_KEYS.AREA_CONFIGS, {
      'poly-1': DEFAULT_AREA_CONFIG,
      'poly-2': DEFAULT_AREA_CONFIG,
      'poly-3': DEFAULT_AREA_CONFIG,
      'poly-4': DEFAULT_AREA_CONFIG,
      'poly-5': DEFAULT_AREA_CONFIG,
    })
  );

  useEffect(() => {
    const projectId = Number(activeProjectId);
    if (!isAuthenticated || !Number.isInteger(projectId) || projectId <= 0) return;

    let mounted = true;
    getIndexesApi({ id_proyek: projectId, per_page: 100 }).then((apiIndexes) => {
      if (!mounted || !Array.isArray(apiIndexes)) return;

      // Get mock registry data to enrich API-fetched polygons with serviceDetails/totalValue
      const found = projects.find(p => p.id === activeProjectId || p.id === String(projectId));
      const projectCode = found?.code || '';
      const mockLandCovers: LandCoverPolygon[] =
        ALL_PROJECT_LAND_COVERS[activeProjectId] ||
        ALL_PROJECT_LAND_COVERS[projectCode] ||
        getFallbackLandCoversForProject(projectCode || activeProjectId);

      const mappedIndexes: IndexItem[] = apiIndexes.map((index: any) => {
        const landCover = index.jenis_tutupan_lahan?.[0];
        const mockIdx = (ALL_PROJECT_INDICES[activeProjectId] || ALL_PROJECT_INDICES[projectCode] || []).find(
          (mi) => mi.code === index.kode_index || mi.name === index.nama_index
        );
        return {
          id: String(index.id_index), code: index.kode_index, name: index.nama_index,
          landCoverType: landCover?.kategori || 'Lainnya', landCoverName: landCover?.nama_tutupan_lahan || index.nama_index,
          landCoverId: mockIdx?.landCoverId,
          polygonId: mockIdx?.polygonId,
          areaHa: Number(index.luas) || 0, unit: index.satuan_luas || 'ha', description: index.deskripsi || '',
          status: mockIdx?.status || 'Draft', spatialStatus: mockIdx?.spatialStatus || 'unconnected',
          createdAt: index.created_at, updatedAt: index.updated_at,
        };
      });
      const mappedLandCovers: LandCoverPolygon[] = apiIndexes.flatMap((index: any) =>
        (index.jenis_tutupan_lahan || []).map((landCover: any) => {
          // Match mock polygon to inherit rich data (serviceDetails, totalValue, etc.)
          const mockPoly = mockLandCovers.find(
            (m) => m.indexCode === index.kode_index ||
                   m.name === landCover.nama_tutupan_lahan ||
                   m.indexName === index.nama_index
          );
          return {
            id: String(landCover.id_jenis_tutupan_lahan),
            code: `${index.kode_index}-${landCover.id_jenis_tutupan_lahan}`,
            name: landCover.nama_tutupan_lahan,
            type: (landCover.kategori || 'lainnya').toLowerCase().replaceAll(' ', '_') as LandCoverPolygon['type'],
            areaHa: Number(landCover.luas) || (mockPoly?.areaHa ?? 0),
            coordinates: mockPoly?.coordinates ?? [],
            center: mockPoly?.center ?? [0, 0],
            indexId: String(index.id_index),
            indexCode: index.kode_index,
            indexName: index.nama_index,
            // Inherit rich valuation data from mock registry
            activeServices: mockPoly?.activeServices ?? [],
            serviceDetails: mockPoly?.serviceDetails ?? [],
            totalValue: mockPoly?.totalValue ?? 0,
          };
        })
      );
      setProjectIndices((prev) => ({ ...prev, [activeProjectId]: mappedIndexes }));
      setProjectLandCovers((prev) => ({
        ...prev,
        [activeProjectId]: [
          ...mappedLandCovers,
          ...(prev[activeProjectId] || []).filter(
            (lc) => lc.coordinates.length > 0 && !mappedLandCovers.find((m) => m.indexCode === lc.indexCode)
          ),
        ],
      }));
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, [activeProjectId, isAuthenticated]);

  // Sync to storage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_ID, activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECT_LAND_COVERS, projectLandCovers);
  }, [projectLandCovers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECT_INDICES, projectIndices);
  }, [projectIndices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROJECT_LAYERS, projectLayers);
  }, [projectLayers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FEEDBACK, analystFeedback);
  }, [analystFeedback]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AREA_CONFIGS, areaConfigs);
  }, [areaConfigs]);

  const activeProject = projects.find(p => p.id === activeProjectId || p.code === activeProjectId) || projects[0] || null;

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
  };

  const getProjectLandCovers = (projectId: string): LandCoverPolygon[] => {
    const stored = (() => {
      if (projectLandCovers[projectId] && projectLandCovers[projectId].length > 0) {
        return projectLandCovers[projectId];
      }
      const found = projects.find(p => p.id === projectId || p.code === projectId);
      if (found) {
        if (found.code && projectLandCovers[found.code] && projectLandCovers[found.code].length > 0) {
          return projectLandCovers[found.code];
        }
        if (found.id && projectLandCovers[found.id] && projectLandCovers[found.id].length > 0) {
          return projectLandCovers[found.id];
        }
      }
      return null;
    })();

    // Determine mock registry data for this project
    const found = projects.find(p => p.id === projectId || p.code === projectId);
    const mockLCs: LandCoverPolygon[] =
      ALL_PROJECT_LAND_COVERS[projectId] ||
      (found?.code ? ALL_PROJECT_LAND_COVERS[found.code] : undefined) ||
      (found?.id ? ALL_PROJECT_LAND_COVERS[found.id] : undefined) ||
      getFallbackLandCoversForProject(found?.code || projectId);

    if (stored && stored.length > 0) {
      // Enrich stored polygons that have empty serviceDetails or stale values from mock registry
      return stored.map((lc) => {
        const mockMatch = mockLCs.find(
          (m) => m.id === lc.id || m.indexCode === lc.indexCode || m.code === lc.code || m.name === lc.name || m.indexName === lc.indexName
        );
        const isStale = lc.totalValue === 35800000000 || lc.totalValue === 15350000000 || lc.totalValue === 7573271140 || lc.totalValue === 58723271140 || !lc.serviceDetails || lc.serviceDetails.length === 0;
        if (mockMatch && (isStale || (mockMatch.totalValue && mockMatch.totalValue !== lc.totalValue))) {
          return {
            ...lc,
            name: mockMatch.name || lc.name,
            code: mockMatch.code || lc.code,
            areaHa: mockMatch.areaHa || lc.areaHa,
            activeServices: mockMatch.activeServices || lc.activeServices,
            serviceDetails: mockMatch.serviceDetails || lc.serviceDetails,
            totalValue: mockMatch.totalValue,
            coordinates: (lc.coordinates && lc.coordinates.length > 0) ? lc.coordinates : mockMatch.coordinates,
            center: (lc.center && (lc.center[0] !== 0 || lc.center[1] !== 0)) ? lc.center : mockMatch.center,
          };
        }
        return lc;
      });
    }

    // No stored data — return mock registry data directly
    return mockLCs;
  };


  const getProjectIndices = (projectId: string): IndexItem[] => {
    if (projectIndices[projectId] && projectIndices[projectId].length > 0) {
      return projectIndices[projectId];
    }
    const found = projects.find(p => p.id === projectId || p.code === projectId);
    if (found) {
      if (found.code && projectIndices[found.code] && projectIndices[found.code].length > 0) {
        return projectIndices[found.code];
      }
      if (found.id && projectIndices[found.id] && projectIndices[found.id].length > 0) {
        return projectIndices[found.id];
      }
    }
    const mockIdx =
      ALL_PROJECT_INDICES[projectId] ||
      (found?.code ? ALL_PROJECT_INDICES[found.code] : undefined) ||
      (found?.id ? ALL_PROJECT_INDICES[found.id] : undefined) ||
      getFallbackIndicesForProject(found?.code || projectId);

    return mockIdx || [];
  };

  const getProjectLayers = (projectId: string): MapLayer[] => {
    if (projectLayers[projectId] && projectLayers[projectId].length > 0) {
      return projectLayers[projectId];
    }
    const found = projects.find(p => p.id === projectId || p.code === projectId);
    if (found) {
      if (found.code && projectLayers[found.code] && projectLayers[found.code].length > 0) {
        return projectLayers[found.code];
      }
      if (found.id && projectLayers[found.id] && projectLayers[found.id].length > 0) {
        return projectLayers[found.id];
      }
    }
    const mockLyr =
      ALL_PROJECT_LAYERS[projectId] ||
      (found?.code ? ALL_PROJECT_LAYERS[found.code] : undefined) ||
      (found?.id ? ALL_PROJECT_LAYERS[found.id] : undefined) ||
      getFallbackLayersForProject(found?.code || projectId);

    return mockLyr || [];
  };

  // Enrich stored land covers with mock registry serviceDetails/totalValue if missing (handles stale localStorage)
  const rawLandCovers = projectLandCovers[activeProjectId] || [];
  const enrichedMockLCs: LandCoverPolygon[] =
    ALL_PROJECT_LAND_COVERS[activeProjectId] ||
    (() => {
      const proj = projects.find(p => p.id === activeProjectId);
      return proj?.code ? (ALL_PROJECT_LAND_COVERS[proj.code] || []) : [];
    })();
  const landCovers: LandCoverPolygon[] = rawLandCovers.length > 0
    ? rawLandCovers.map((lc) => {
        const mockMatch = enrichedMockLCs.find(
          (m) => m.id === lc.id || m.indexCode === lc.indexCode || m.code === lc.code || m.name === lc.name || m.indexName === lc.indexName
        );
        const isStale = lc.totalValue === 35800000000 || lc.totalValue === 15350000000 || lc.totalValue === 7573271140 || lc.totalValue === 58723271140 || !lc.serviceDetails || lc.serviceDetails.length === 0;
        if (mockMatch && (isStale || (mockMatch.totalValue && mockMatch.totalValue !== lc.totalValue))) {
          return {
            ...lc,
            name: mockMatch.name || lc.name,
            code: mockMatch.code || lc.code,
            areaHa: mockMatch.areaHa || lc.areaHa,
            activeServices: mockMatch.activeServices || lc.activeServices,
            serviceDetails: mockMatch.serviceDetails || lc.serviceDetails,
            totalValue: mockMatch.totalValue,
            coordinates: (lc.coordinates && lc.coordinates.length > 0) ? lc.coordinates : mockMatch.coordinates,
            center: (lc.center && (lc.center[0] !== 0 || lc.center[1] !== 0)) ? lc.center : mockMatch.center,
          };
        }
        return lc;
      })
    : enrichedMockLCs;
  const indices = projectIndices[activeProjectId] || [];
  const layers = projectLayers[activeProjectId] || [];

  useEffect(() => {
    const fetchConfigs = async () => {
      const numericAreaIds = landCovers
        .map(lc => lc.id)
        .filter(id => !isNaN(Number(id)) && Number(id) > 0);
        
      for (const areaId of numericAreaIds) {
        try {
          const apiConfigs = await getValuationConfigs(areaId);
          if (apiConfigs && apiConfigs.length > 0) {
            setAreaConfigs(prev => {
              const current = prev[areaId] || DEFAULT_AREA_CONFIG;
              const nextServices = { ...current.activeServices };
              const nextMethods = { ...current.selectedMethods };
              let nextBiota = current.biota;
              
              apiConfigs.forEach(cfg => {
                const sId = cfg.service_id as keyof AreaServiceConfig['activeServices'];
                if (sId) {
                  nextServices[sId] = cfg.is_active;
                  nextMethods[sId] = cfg.method_id;
                  if (sId === 'provisioning' && cfg.biota) {
                    nextBiota = cfg.biota;
                  }
                }
              });
              
              return {
                ...prev,
                [areaId]: {
                  ...current,
                  activeServices: nextServices,
                  selectedMethods: nextMethods,
                  biota: nextBiota
                }
              };
            });
          }
        } catch (e) {
          console.warn('[ValuationData] Error loading configs for area ' + areaId, e);
        }
      }
    };
    if (landCovers && landCovers.length > 0) {
      fetchConfigs();
    }
  }, [landCovers]);



  const getAreaConfig = (areaId: string): AreaServiceConfig => {
    const found = areaConfigs[areaId];
    if (!found) return DEFAULT_AREA_CONFIG;
    return {
      ...DEFAULT_AREA_CONFIG,
      ...found,
      activeServices: {
        ...DEFAULT_AREA_CONFIG.activeServices,
        ...(found.activeServices || {})
      },
      selectedMethods: {
        ...DEFAULT_AREA_CONFIG.selectedMethods,
        ...(found.selectedMethods || {})
      }
    };
  };

  const updateAreaConfig = (areaId: string, updates: Partial<AreaServiceConfig>) => {
    setAreaConfigs(prev => {
      const current = prev[areaId] || DEFAULT_AREA_CONFIG;
      const next = {
        ...current,
        ...updates,
        activeServices: updates.activeServices ? { ...current.activeServices, ...updates.activeServices } : current.activeServices,
        selectedMethods: updates.selectedMethods ? { ...current.selectedMethods, ...updates.selectedMethods } : current.selectedMethods,
      };
      
      // Sync ke backend jika areaId adalah numeric
      if (!isNaN(Number(areaId)) && Number(areaId) > 0) {
        const configsPayload = [
          { service_id: 'provisioning', is_active: next.activeServices.provisioning, method_id: next.selectedMethods.provisioning, biota: next.biota },
          { service_id: 'regulating', is_active: next.activeServices.regulating, method_id: next.selectedMethods.regulating },
          { service_id: 'supporting', is_active: next.activeServices.supporting, method_id: next.selectedMethods.supporting },
          { service_id: 'cultural', is_active: next.activeServices.cultural, method_id: next.selectedMethods.cultural },
        ];
        upsertValuationConfigs(areaId, configsPayload).catch(err => 
          console.warn('[ValuationData] Gagal sync configs ke backend:', err)
        );
      }
      
      return { ...prev, [areaId]: next };
    });
  };

  const createProject = async (name: string, description: string): Promise<Project> => {
    const response = await createProyek({ nama_proyek: name, deskripsi: description });
    const newProj = fromApiProject(response, user?.nama || 'Peneliti Utama (Saya)');

    setProjects(prev => [newProj, ...prev]);
    setActiveProjectIdState(newProj.id);
    setProjectLandCovers(prev => ({ ...prev, [newProj.id]: [] }));
    setProjectIndices(prev => ({ ...prev, [newProj.id]: [] }));
    setProjectLayers(prev => ({ ...prev, [newProj.id]: [] }));
    return newProj;
  };

  const deleteProject = async (id: string): Promise<void> => {
    await deleteProyek(id);
    setProjects(prev => prev.filter(project => project.id !== id && project.code !== id));
    setProjectLandCovers(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setProjectIndices(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setProjectLayers(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeProjectId === id) setActiveProjectIdState('');
  };

  const updateProjectStatus = (id: string, status: ProjectStatus, notes?: string, reviewer?: string) => {
    let updatedReviewers: string[] = [];
    let combinedReviewer: string | undefined = undefined;

    if (reviewer) {
      updatedReviewers = annotationService.addProjectReviewer(id, reviewer);
      combinedReviewer = updatedReviewers.join(', ');
    } else {
      updatedReviewers = annotationService.getProjectReviewers(id);
      combinedReviewer = updatedReviewers.length > 0 ? updatedReviewers.join(', ') : undefined;
    }

    setProjects(prev => prev.map(p => {
      if (p.id === id || p.code === id) {
        return {
          ...p,
          status,
          updatedAt: 'Baru saja',
          submittedAt: status === 'MENUNGGU_ANALYST' ? new Date().toISOString().split('T')[0] : p.submittedAt,
          analystComment: notes !== undefined ? notes : p.analystComment,
          reviewedBy: combinedReviewer || p.reviewedBy,
          reviewers: updatedReviewers.length > 0 ? updatedReviewers : p.reviewers,
        };
      }
      return p;
    }));

    try {
      localStorage.setItem(`pkspl_status_${id}`, status);
      if (notes !== undefined) {
        localStorage.setItem(`pkspl_status_notes_${id}`, notes);
      }
      if (combinedReviewer) {
        localStorage.setItem(`pkspl_reviewer_${id}`, combinedReviewer);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('pkspl_project_status_changed', {
            detail: { projectId: id, status, notes, reviewer: combinedReviewer, reviewers: updatedReviewers }
          })
        );
      }
    } catch (e) {
      console.warn('Failed to save project status to storage:', e);
    }
  };

  const addShpLayer = (name: string, featureCount: number, crs: string, targetProjId?: string) => {
    const projId = targetProjId || activeProjectId;

    let mockPolys: LandCoverPolygon[] = [];
    let mockIdxs: IndexItem[] = [];
    let mockLyrs: MapLayer[] = [];

    if (projId === 'PKS-KKPRIV') {
      mockPolys = JAKARTA_LAND_COVERS;
      mockIdxs = JAKARTA_INDEX_LIST;
      mockLyrs = JAKARTA_MAP_LAYERS;
    } else if (projId === 'PKS-UW8J6F') {
      mockPolys = NUSA_PENIDA_LAND_COVERS;
      mockIdxs = NUSA_PENIDA_INDEX_LIST;
      mockLyrs = NUSA_PENIDA_MAP_LAYERS;
    } else if (projId === 'PKS-994KY1') {
      mockPolys = INITIAL_LAND_COVERS;
      mockIdxs = INITIAL_INDEX_LIST;
      mockLyrs = INITIAL_MAP_LAYERS;
    } else {
      mockPolys = generateMockPolygonsForProject(projId);
      mockIdxs = generateMockIndicesForProject(projId, mockPolys);
      mockLyrs = [
        {
          id: `layer-${Date.now()}`,
          projectId: projId,
          name: name || 'Batas Administrasi & Tutupan Lahan',
          type: 'polygon',
          featureCount: featureCount || mockPolys.length,
          crs: crs || 'WGS 84 / UTM Zone 50S (EPSG:32750)',
          color: '#0ea5e9',
          visible: true,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      ];
    }

    setProjectLayers(prev => ({
      ...prev,
      [projId]: mockLyrs
    }));

    setProjectLandCovers(prev => ({
      ...prev,
      [projId]: mockPolys
    }));

    setProjectIndices(prev => ({
      ...prev,
      [projId]: mockIdxs
    }));

    // Set hasShp to true ONLY on the targeted project
    setProjects(prev => prev.map(p => {
      if (p.id === projId || p.code === projId) {
        return { ...p, hasShp: true, updatedAt: 'Baru saja' };
      }
      return p;
    }));
  };

  const setProjectHasShp = (projectId: string, hasShp: boolean) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId || p.code === projectId) {
        return { ...p, hasShp, updatedAt: 'Baru saja' };
      }
      return p;
    }));
  };

  const createIndex = (item: Omit<IndexItem, 'id'>): IndexItem => {
    const newId = `idx-${Date.now()}`;
    const newItem: IndexItem = {
      ...item,
      id: newId,
      status: item.status || 'Draft',
      spatialStatus: item.polygonId ? 'connected' : 'unconnected',
      unit: item.unit || 'ha',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: [newItem, ...(prev[activeProjectId] || [])]
    }));

    // If linked to polygon, update polygon too
    if (newItem.polygonId) {
      setProjectLandCovers(prev => ({
        ...prev,
        [activeProjectId]: (prev[activeProjectId] || []).map(p => {
          if (p.id === newItem.polygonId) {
            return {
              ...p,
              indexId: newItem.id,
              indexCode: newItem.code,
              indexName: newItem.name
            };
          }
          return p;
        })
      }));
    }

    return newItem;
  };

  const createManualIndex = async (item: {
    code: string;
    name: string;
    description: string;
    landCovers: { name: string; areaHa: number; description?: string }[];
  }): Promise<IndexItem> => {
    const index = await createIndexApi({
      id_proyek: Number(activeProjectId),
      nama_index: item.name,
      kode_index: item.code,
      luas: item.landCovers.reduce((total, landCover) => total + (Number(landCover.areaHa) || 0), 0),
      satuan_luas: 'ha',
      deskripsi: item.description,
    });
    const indexId = String(index.id_index);
    const createdLandCovers = await Promise.all(item.landCovers.map((landCover) =>
      createLandCoverApi({
        id_index: Number(index.id_index),
        nama_tutupan_lahan: landCover.name,
        luas: Number(landCover.areaHa) || 0,
        satuan_luas: 'ha',
        deskripsi: landCover.description || null,
      })
    ));
    const areaHa = item.landCovers.reduce((total, landCover) => total + (Number(landCover.areaHa) || 0), 0);
    const newIndex: IndexItem = {
      id: indexId,
      code: item.code,
      name: item.name,
      landCoverType: 'Lainnya',
      landCoverName: item.landCovers[0]?.name || item.name,
      areaHa,
      unit: 'ha',
      description: item.description,
      status: 'Draft',
      spatialStatus: 'unconnected',
      createdAt: new Date().toISOString(),
    };
    const newAreas: LandCoverPolygon[] = createdLandCovers.map((landCover: any) => ({
      id: String(landCover.id_jenis_tutupan_lahan),
      code: `${item.code}-${landCover.id_jenis_tutupan_lahan}`,
      name: landCover.nama_tutupan_lahan,
      type: (landCover.kategori || 'lainnya').toLowerCase().replaceAll(' ', '_') as LandCoverPolygon['type'],
      areaHa: Number(landCover.luas) || 0,
      coordinates: [],
      center: [0, 0],
      indexId,
      indexCode: item.code,
      indexName: item.name,
      activeServices: [],
      serviceDetails: [],
      totalValue: 0,
    }));
    setProjectIndices(prev => ({ ...prev, [activeProjectId]: [newIndex, ...(prev[activeProjectId] || [])] }));
    setProjectLandCovers(prev => ({ ...prev, [activeProjectId]: [...newAreas, ...(prev[activeProjectId] || [])] }));
    return newIndex;
  };

  const updateManualIndex = async (item: {
    id: string;
    code: string;
    name: string;
    description: string;
    landCovers: { id?: string; name: string; areaHa: number; description?: string }[];
  }): Promise<void> => {
    await updateIndexApi(item.id, {
      nama_index: item.name,
      kode_index: item.code,
      luas: item.landCovers.reduce((total, landCover) => total + (Number(landCover.areaHa) || 0), 0),
      satuan_luas: 'ha',
      deskripsi: item.description,
    });

    const currentLandCovers = (projectLandCovers[activeProjectId] || []).filter((landCover) => landCover.indexId === item.id);
    const nextIds = new Set(item.landCovers.filter((landCover) => landCover.id).map((landCover) => landCover.id));
    const savedLandCovers = await Promise.all([
      ...currentLandCovers.filter((landCover) => !nextIds.has(landCover.id)).map((landCover) => deleteLandCoverApi(landCover.id)),
      ...item.landCovers.map((landCover) => {
        const payload = {
          id_index: Number(item.id),
          nama_tutupan_lahan: landCover.name,
          luas: Number(landCover.areaHa) || 0,
          satuan_luas: 'ha',
          deskripsi: landCover.description || null,
        };
        return landCover.id ? updateLandCoverApi(landCover.id, payload) : createLandCoverApi(payload);
      }),
    ]);

    const updatedIndex = {
      code: item.code,
      name: item.name,
      landCoverType: 'Lainnya',
      landCoverName: item.landCovers[0]?.name || item.name,
      areaHa: item.landCovers.reduce((total, landCover) => total + (Number(landCover.areaHa) || 0), 0),
      description: item.description,
      updatedAt: new Date().toISOString(),
    };
    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map((index) => index.id === item.id ? { ...index, ...updatedIndex } : index),
    }));
    const savedItems = savedLandCovers.filter(Boolean) as any[];
    const updatedAreas: LandCoverPolygon[] = savedItems.map((landCover) => ({
      id: String(landCover.id_jenis_tutupan_lahan),
      code: `${item.code}-${landCover.id_jenis_tutupan_lahan}`,
      name: landCover.nama_tutupan_lahan,
      type: (landCover.kategori || 'lainnya').toLowerCase().replaceAll(' ', '_') as LandCoverPolygon['type'],
      areaHa: Number(landCover.luas) || 0,
      coordinates: [],
      center: [0, 0],
      indexId: item.id,
      indexCode: item.code,
      indexName: item.name,
      activeServices: [],
      serviceDetails: [],
      totalValue: 0,
    }));
    setProjectLandCovers(prev => ({
      ...prev,
      [activeProjectId]: [
        ...updatedAreas,
        ...(prev[activeProjectId] || []).filter((landCover) => landCover.indexId !== item.id),
      ],
    }));
  };

  const updateIndex = (id: string, updates: Partial<IndexItem>) => {
    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(item => {
        if (item.id === id) {
          return { ...item, ...updates, updatedAt: 'Baru saja' };
        }
        return item;
      })
    }));
  };

  const deleteIndex = (id: string) => {
    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).filter(i => i.id !== id)
    }));
    // Unlink any polygon attached to this index
    setProjectLandCovers(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(p => {
        if (p.indexId === id) {
          return {
            ...p,
            indexId: undefined,
            indexCode: undefined,
            indexName: undefined
          };
        }
        return p;
      })
    }));
  };

  const linkPolygonToIndex = (polygonId: string, indexId: string) => {
    const currentIndices = projectIndices[activeProjectId] || [];
    const targetIndex = currentIndices.find(i => i.id === indexId);
    if (!targetIndex) return;

    setProjectLandCovers(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(p => {
        if (p.id === polygonId) {
          return {
            ...p,
            indexId: targetIndex.id,
            indexCode: targetIndex.code,
            indexName: targetIndex.name
          };
        }
        return p;
      })
    }));

    setProjectIndices(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(i => {
        if (i.id === indexId) {
          return {
            ...i,
            spatialStatus: 'connected',
            polygonId: polygonId,
            landCoverId: polygonId,
            updatedAt: 'Baru saja'
          };
        }
        return i;
      })
    }));
  };

  const unlinkPolygonFromIndex = (polygonId: string) => {
    setProjectLandCovers(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(p => {
        if (p.id === polygonId) {
          const oldIndexId = p.indexId;
          if (oldIndexId) {
            setProjectIndices(idxList => ({
              ...idxList,
              [activeProjectId]: (idxList[activeProjectId] || []).map(i => {
                if (i.id === oldIndexId) {
                  return {
                    ...i,
                    spatialStatus: 'unconnected',
                    polygonId: undefined,
                    landCoverId: undefined
                  };
                }
                return i;
              })
            }));
          }
          return {
            ...p,
            indexId: undefined,
            indexCode: undefined,
            indexName: undefined
          };
        }
        return p;
      })
    }));
  };

  const createIndexFromPolygon = (polygonId: string, customCode?: string): IndexItem => {
    const activePolys = projectLandCovers[activeProjectId] || [];
    const activeIdxs = projectIndices[activeProjectId] || [];
    const poly = activePolys.find(p => p.id === polygonId);
    const code = customCode || `IDX-${String(activeIdxs.length + 1).padStart(3, '0')}`;
    const name = poly ? poly.name : `Index ${code}`;
    const type = poly ? (poly.type.charAt(0).toUpperCase() + poly.type.slice(1)) : 'Mangrove';
    const areaHa = poly ? poly.areaHa : 50;

    return createIndex({
      code,
      name,
      landCoverType: type,
      landCoverName: name,
      landCoverId: polygonId,
      polygonId: polygonId,
      areaHa,
      unit: 'ha',
      description: `Index dibuat otomatis dari polygon area spasial ${name}.`,
      status: 'Draft',
      spatialStatus: 'connected',
    });
  };

  const toggleLayerVisibility = (layerId: string) => {
    setProjectLayers(prev => ({
      ...prev,
      [activeProjectId]: (prev[activeProjectId] || []).map(l => l.id === layerId ? { ...l, visible: !l.visible } : l)
    }));
  };

  // Real-time synchronization for project status across components & tabs
  useEffect(() => {
    const handleStatusChanged = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      setProjects(prev => prev.map(p => {
        if (p.id === detail.projectId || p.code === detail.projectId) {
          return {
            ...p,
            status: toProjectStatus(detail.status),
            analystComment: detail.notes !== undefined ? detail.notes : p.analystComment,
            reviewedBy: detail.reviewer || p.reviewedBy,
            updatedAt: 'Baru saja'
          };
        }
        return p;
      }));
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('pkspl_status_') && !e.key.startsWith('pkspl_status_notes_')) {
        const projId = e.key.replace('pkspl_status_', '');
        const newStatus = e.newValue;
        if (newStatus) {
          const notes = localStorage.getItem(`pkspl_status_notes_${projId}`) || undefined;
          const reviewer = localStorage.getItem(`pkspl_reviewer_${projId}`) || undefined;
          setProjects(prev => prev.map(p => {
            if (p.id === projId || p.code === projId) {
              return {
                ...p,
                status: toProjectStatus(newStatus),
                analystComment: notes ?? p.analystComment,
                reviewedBy: reviewer ?? p.reviewedBy,
                updatedAt: 'Baru saja'
              };
            }
            return p;
          }));
        }
      }
    };

    window.addEventListener('pkspl_project_status_changed', handleStatusChanged);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('pkspl_project_status_changed', handleStatusChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const simulateAnalystRejection = () => {
    const reviewer = 'Dr. Benny Nababan';
    const reason = 'Harga unit (Rp 3.231.311) pada Data Valuasi Provisioning Services perlu disesuaikan dengan batas HET Regional Bali 2026 dan verifikasi ulang luas tutupan polygon mangrove.';
    const sampleComments: ReviewComment[] = [
      {
        id: 'comm-rev-01',
        projectId: activeProjectId,
        section: '05. DATA VALUASI',
        author: reviewer,
        authorRole: 'Quality Analyst',
        timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        content: 'Harga unit kayu Cemara Laut (Casuarina equisetifolia) pada metode Market Price melebihi ambang batas acuan pasar lokal Bali (Rp 2.850.000/m³).',
        status: 'open',
        replies: []
      },
      {
        id: 'comm-rev-02',
        projectId: activeProjectId,
        section: '02. MAPS & SPASIAL',
        author: reviewer,
        authorRole: 'Quality Analyst',
        timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        content: 'Periksa kembali delineasi batas polygon tutupan lahan Mangrove Primer pada zona selatan.',
        status: 'open',
        replies: []
      }
    ];

    updateProjectStatus(activeProjectId, 'REVISI', reason, reviewer);
    if (activeProject?.code && activeProject.code !== activeProjectId) {
      updateProjectStatus(activeProject.code, 'REVISI', reason, reviewer);
    }

    setAnalystFeedback({
      ...INITIAL_ANALYST_FEEDBACK,
      projectId: activeProjectId,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });

    annotationService.saveRevisionDetails(activeProjectId, {
      projectId: activeProjectId,
      projectCode: activeProject?.code || activeProjectId,
      projectName: activeProject?.name || 'Kajian Valuasi Ekonomi Terumbu Karang Nusa Penida',
      status: 'REVISI',
      reviewer,
      reason,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      comments: sampleComments,
      unreadNotification: true
    });

    if (activeProject?.code && activeProject.code !== activeProjectId) {
      annotationService.saveRevisionDetails(activeProject.code, {
        projectId: activeProject.code,
        projectCode: activeProject.code,
        projectName: activeProject.name,
        status: 'REVISI',
        reviewer,
        reason,
        timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        comments: sampleComments,
        unreadNotification: true
      });
    }
  };

  const resolveFeedback = () => {
    setAnalystFeedback(null);
    updateProjectStatus(activeProjectId, 'MENUNGGU_ANALYST', 'Telah diperbaiki oleh peneliti dan diajukan ulang ke analis');
    if (activeProject?.code && activeProject.code !== activeProjectId) {
      updateProjectStatus(activeProject.code, 'MENUNGGU_ANALYST', 'Telah diperbaiki oleh peneliti dan diajukan ulang ke analis');
    }
    annotationService.resolveRevision(activeProjectId, 'Telah diperbaiki oleh peneliti dan diajukan ulang ke analis');
  };

  const resetAllData = () => {
    setProjects(INITIAL_PROJECTS);
    setActiveProjectIdState('PKS-994KY1');
    setProjectLandCovers(INITIAL_PROJECT_LAND_COVERS);
    setProjectIndices(INITIAL_PROJECT_INDICES);
    setProjectLayers(INITIAL_PROJECT_LAYERS);
    setAnalystFeedback(INITIAL_ANALYST_FEEDBACK);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        projectsLoading,
        projectsError,
        activeProject,
        activeProjectId,
        landCovers,
        indices,
        layers,
        analystFeedback,
        areaConfigs,
        setActiveProjectId,
        createProject,
        deleteProject,
        updateProjectStatus,
        addShpLayer,
        setProjectHasShp,
        getProjectLandCovers,
        getProjectIndices,
        getProjectLayers,
        toggleLayerVisibility,
        updateAreaConfig,
        getAreaConfig,
        createIndex,
        createManualIndex,
        updateManualIndex,
        updateIndex,
        deleteIndex,
        linkPolygonToIndex,
        unlinkPolygonFromIndex,
        createIndexFromPolygon,
        simulateAnalystRejection,
        resolveFeedback,
        resetAllData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return ctx;
};
