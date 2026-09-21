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
import { INITIAL_ANALYST_FEEDBACK } from '../mock/analystReviewMock';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { createProyek, deleteProyek, getProyekList } from '../../services/projectService';
import { createIndexApi, createLandCoverApi, deleteLandCoverApi, getIndexesApi, updateIndexApi, updateLandCoverApi } from '../../services/indexService';

import { AreaServiceConfig, EcosystemServiceId } from '../types/valuation';

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
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
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
  'PKS-994KY1': INITIAL_LAND_COVERS,
  'PKS-KKPRIV': [],
  'PKS-UW8J6F': NUSA_PENIDA_LAND_COVERS,
};

const INITIAL_PROJECT_INDICES: Record<string, IndexItem[]> = {
  'PKS-994KY1': INITIAL_INDEX_LIST,
  'PKS-KKPRIV': [],
  'PKS-UW8J6F': NUSA_PENIDA_INDEX_LIST,
};

const INITIAL_PROJECT_LAYERS: Record<string, MapLayer[]> = {
  'PKS-994KY1': INITIAL_MAP_LAYERS,
  'PKS-KKPRIV': [],
  'PKS-UW8J6F': NUSA_PENIDA_MAP_LAYERS,
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const toProjectStatus = (status: string | undefined): ProjectStatus => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'proses') return 'DIKERJAKAN';
  if (normalized === 'submitted') return 'MENUNGGU_ANALYST';
  if (normalized === 'need revision') return 'PERLU_PERBAIKAN';
  if (normalized === 'selesai' || normalized === 'approved' || normalized === 'published') return 'SELESAI';
  return 'DRAFT';
};

const fromApiProject = (project: any, fallbackLead = 'Peneliti Utama'): Project => ({
  id: String(project.id_proyek ?? project.id ?? project.kode_proyek),
  code: project.kode_proyek || String(project.id_proyek ?? ''),
  name: project.nama_proyek || '',
  description: project.deskripsi || '',
  status: toProjectStatus(project.status),
  lead: project.user?.nama || fallbackLead,
  location: project.alamat_lengkap || project.kabupaten_kota?.nama || project.provinsi?.nama || '-',
  ecosystem: project.ekosistem || 'Ekosistem Pesisir',
  year: Number(project.tahun || new Date().getFullYear()),
  createdAt: project.created_at || '',
  updatedAt: project.updated_at || '',
  hasShp: Boolean(project.shapefile_files && Object.keys(project.shapefile_files).length),
});

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
      const mappedIndexes: IndexItem[] = apiIndexes.map((index: any) => {
        const landCover = index.jenis_tutupan_lahan?.[0];
        return {
          id: String(index.id_index), code: index.kode_index, name: index.nama_index,
          landCoverType: landCover?.kategori || 'Lainnya', landCoverName: landCover?.nama_tutupan_lahan || index.nama_index,
          areaHa: Number(index.luas) || 0, unit: index.satuan_luas || 'ha', description: index.deskripsi || '',
          status: 'Draft', spatialStatus: 'unconnected', createdAt: index.created_at, updatedAt: index.updated_at,
        };
      });
      const mappedLandCovers: LandCoverPolygon[] = apiIndexes.flatMap((index: any) =>
        (index.jenis_tutupan_lahan || []).map((landCover: any) => ({
          id: String(landCover.id_jenis_tutupan_lahan), code: `${index.kode_index}-${landCover.id_jenis_tutupan_lahan}`,
          name: landCover.nama_tutupan_lahan,
          type: (landCover.kategori || 'lainnya').toLowerCase().replaceAll(' ', '_') as LandCoverPolygon['type'],
          areaHa: Number(landCover.luas) || 0, coordinates: [], center: [0, 0], indexId: String(index.id_index),
          indexCode: index.kode_index, indexName: index.nama_index, activeServices: [], serviceDetails: [], totalValue: 0,
        }))
      );
      setProjectIndices((prev) => ({ ...prev, [activeProjectId]: mappedIndexes }));
      setProjectLandCovers((prev) => ({
        ...prev,
        [activeProjectId]: [...mappedLandCovers, ...(prev[activeProjectId] || []).filter((landCover) => landCover.coordinates.length > 0)],
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
    return projectLandCovers[projectId] || [];
  };

  const getProjectIndices = (projectId: string): IndexItem[] => {
    return projectIndices[projectId] || [];
  };

  const getProjectLayers = (projectId: string): MapLayer[] => {
    return projectLayers[projectId] || [];
  };

  const landCovers = projectLandCovers[activeProjectId] || [];
  const indices = projectIndices[activeProjectId] || [];
  const layers = projectLayers[activeProjectId] || [];

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

  const updateProjectStatus = (id: string, status: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id || p.code === id) {
        return {
          ...p,
          status,
          updatedAt: 'Baru saja',
          submittedAt: status === 'MENUNGGU_ANALYST' ? new Date().toISOString().split('T')[0] : p.submittedAt
        };
      }
      return p;
    }));
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

  const simulateAnalystRejection = () => {
    updateProjectStatus(activeProjectId, 'PERLU_PERBAIKAN');
    setAnalystFeedback({
      ...INITIAL_ANALYST_FEEDBACK,
      projectId: activeProjectId,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
  };

  const resolveFeedback = () => {
    setAnalystFeedback(null);
    updateProjectStatus(activeProjectId, 'SIAP_REVIEW');
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
