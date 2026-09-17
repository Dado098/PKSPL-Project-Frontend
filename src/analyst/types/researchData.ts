export interface LandCoverItem {
  id: string;
  code: string;
  name: string;
  type: 'mangrove' | 'lamun' | 'terumbu_karang' | 'perairan' | 'lainnya';
  areaHa: number;
  center: [number, number];
  coordinates: [number, number][];
  indexCode?: string;
  totalValue: number;
  status: 'verified' | 'draft' | 'warning';
}

export interface SpatialMetadata {
  crs: string;
  format: string;
  polygonCount: number;
  layerCount: number;
  totalAreaHa: number;
  boundingBox: string;
  hasShp: boolean;
  shpFileName?: string;
  uploadDate?: string;
}

export interface MasterSpeciesItem {
  id: string;
  localName: string;
  scientificName: string;
  category: 'flora' | 'fauna';
  densityStandard: string;
  unit: string;
  status: string;
}

export interface ValuationRowItem {
  id: string;
  serviceId: 'provisioning' | 'regulating' | 'supporting' | 'cultural';
  methodName: string;
  functionAsset: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  areaHa: number;
  totalValue: number;
  referenceSource: string;
}

export interface EcosystemCalculationItem {
  serviceId: 'provisioning' | 'regulating' | 'supporting' | 'cultural';
  serviceName: string;
  method: string;
  subtotalNominal: number;
  contributionPct: number;
}

export interface HistoricalStudyPoint {
  id: string;
  year: number;
  studyTitle: string;
  institution: string;
  areaHa: number;
  tev: number;
  tevPerHa: number;
  isCurrent?: boolean;
}

export interface ProjectResearchFullData {
  projectId: string;
  projectCode: string;
  projectName: string;
  lead: string;
  location: string;
  ecosystem: string;
  spatial: SpatialMetadata;
  landCovers: LandCoverItem[];
  masterSpecies: MasterSpeciesItem[];
  valuationRows: ValuationRowItem[];
  calculations: EcosystemCalculationItem[];
  grandTev: number;
  tevPerHa: number;
  historicalTimeline: HistoricalStudyPoint[];
}
