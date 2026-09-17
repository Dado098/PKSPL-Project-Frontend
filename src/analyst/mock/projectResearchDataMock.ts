import { ProjectResearchFullData, LandCoverItem } from '../types/researchData';

// Koordinat riil Teluk Benoa, Badung & Denpasar, Bali
export const BENOA_LAND_COVERS: LandCoverItem[] = [
  {
    id: 'poly-1',
    code: 'TL-MG-01',
    name: 'Mangrove Barat (Hutan Lindung Prapat Benoa)',
    type: 'mangrove',
    areaHa: 79.86,
    center: [-8.745, 115.205],
    coordinates: [
      [-8.738, 115.198],
      [-8.735, 115.210],
      [-8.745, 115.215],
      [-8.756, 115.210],
      [-8.754, 115.199],
      [-8.745, 115.195]
    ],
    indexCode: 'IDX-001',
    totalValue: 25799677785,
    status: 'verified'
  },
  {
    id: 'poly-2',
    code: 'TL-MG-02',
    name: 'Mangrove Timur (Estuari Suwung)',
    type: 'mangrove',
    areaHa: 62.40,
    center: [-8.748, 115.228],
    coordinates: [
      [-8.740, 115.222],
      [-8.738, 115.234],
      [-8.752, 115.238],
      [-8.758, 115.228],
      [-8.750, 115.220]
    ],
    indexCode: 'IDX-002',
    totalValue: 19523593355,
    status: 'verified'
  },
  {
    id: 'poly-3',
    code: 'TL-MG-03',
    name: 'Zona Restorasi Pesisir Selatan Teluk Benoa',
    type: 'mangrove',
    areaHa: 45.20,
    center: [-8.755, 115.215],
    coordinates: [
      [-8.750, 115.210],
      [-8.748, 115.220],
      [-8.758, 115.222],
      [-8.762, 115.214],
      [-8.758, 115.208]
    ],
    indexCode: 'IDX-003',
    totalValue: 13400000000,
    status: 'verified'
  }
];

export const MOCK_PROJECT_RESEARCH_BENOA: ProjectResearchFullData = {
  projectId: 'PKS-994KY1',
  projectCode: 'PKS-994KY1',
  projectName: 'Revitalisasi Mangrove Teluk Benoa',
  lead: 'Dr. Ir. Retno Wulandari, M.Si.',
  location: 'Kabupaten Badung & Kota Denpasar, Bali',
  ecosystem: 'Ekosistem Mangrove & Estuari Pesisir',
  grandTev: 58723271140,
  tevPerHa: 313257608,
  spatial: {
    hasShp: true,
    crs: 'EPSG:4326 (WGS 84)',
    format: 'ESRI Shapefile (Polygon Geometry)',
    polygonCount: 3,
    layerCount: 4,
    totalAreaHa: 187.46,
    boundingBox: '115.195° E - 115.238° E, -8.762° S - -8.735° S',
    shpFileName: 'SHP_TelukBenoa_Mangrove_2026_Rev3.zip',
    uploadDate: '12 September 2026'
  },
  landCovers: BENOA_LAND_COVERS,
  masterSpecies: [
    {
      id: 'msp-01',
      localName: 'Bakau Minyak',
      scientificName: 'Rhizophora apiculata',
      category: 'flora',
      densityStandard: '3.200 pohon/ha',
      unit: 'batang/m³',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-02',
      localName: 'Api-api Putih',
      scientificName: 'Avicennia marina',
      category: 'flora',
      densityStandard: '2.800 pohon/ha',
      unit: 'batang/m³',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-03',
      localName: 'Cemara Laut',
      scientificName: 'Casuarina equisetifolia',
      category: 'flora',
      densityStandard: '1.400 pohon/ha',
      unit: 'batang/m³',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-04',
      localName: 'Kepiting Bakau',
      scientificName: 'Scylla serrata',
      category: 'fauna',
      densityStandard: '450 kg/ha/tahun',
      unit: 'kg/tahun',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-05',
      localName: 'Ikan Bandeng Alami',
      scientificName: 'Chanos chanos',
      category: 'fauna',
      densityStandard: '320 kg/ha/tahun',
      unit: 'kg/tahun',
      status: 'Terdaftar PKSPL'
    }
  ],
  valuationRows: [
    {
      id: 'vrow-01',
      serviceId: 'provisioning',
      methodName: 'Market Price (Harga Pasar)',
      functionAsset: 'Kayu Bakau & Biomassa Kayu Komersial',
      quantity: 45,
      unit: 'm³/ha',
      unitPrice: 2850000,
      areaHa: 79.86,
      totalValue: 10242045000,
      referenceSource: 'Survei Pasar Kayu Lokal Bali & BPS Badung 2025'
    },
    {
      id: 'vrow-02',
      serviceId: 'provisioning',
      methodName: 'Market Price (Harga Pasar)',
      functionAsset: 'Tangkapan Kepiting Bakau & Ikan Estuari',
      quantity: 520,
      unit: 'kg/ha/th',
      unitPrice: 125000,
      areaHa: 142.26,
      totalValue: 9246900000,
      referenceSource: 'Catatan TPI Kedonganan & Nelayan Teluk Benoa'
    },
    {
      id: 'vrow-03',
      serviceId: 'provisioning',
      methodName: 'Effect on Production',
      functionAsset: 'Input Bibit & Benih Tambak Silvofishery',
      quantity: 12000,
      unit: 'ekor/ha',
      unitPrice: 1500,
      areaHa: 187.46,
      totalValue: 4015710450,
      referenceSource: 'Laporan Dinas Kelautan & Perikanan Provinsi Bali'
    },
    {
      id: 'vrow-04',
      serviceId: 'regulating',
      methodName: 'Replacement Cost',
      functionAsset: 'Pencegahan Erosi Pantai & Konstruksi Seawall Alternatif',
      quantity: 4.8,
      unit: 'km pantai',
      unitPrice: 2500000000,
      areaHa: 187.46,
      totalValue: 12000000000,
      referenceSource: 'Buku Pedoman Standar PU SDA Bina Marga Pesisir'
    },
    {
      id: 'vrow-05',
      serviceId: 'regulating',
      methodName: 'Carbon Storage (Blue Carbon)',
      functionAsset: 'Sekuestrasi Karbon Biru Biomassa dan Sedimen Mangrove',
      quantity: 180,
      unit: 'ton C/ha',
      unitPrice: 184800,
      areaHa: 187.46,
      totalValue: 6235120000,
      referenceSource: 'IPCC Wetland Supplement & Regulasi Nilai Ekonomi Karbon RI'
    },
    {
      id: 'vrow-06',
      serviceId: 'supporting',
      methodName: 'Nursery Ground Valuation',
      functionAsset: 'Daerah Asuhan & Pemijahan Biota Laut Karamba dan Pesisir',
      quantity: 380,
      unit: 'kg asuhan/ha',
      unitPrice: 95000,
      areaHa: 187.46,
      totalValue: 6767306000,
      referenceSource: 'Studi Ekologi Pesisir PKSPL IPB University'
    },
    {
      id: 'vrow-07',
      serviceId: 'supporting',
      methodName: 'Biodiversity Value',
      functionAsset: 'Keanekaragaman Hayati Burung Migran & Flora Endemik Mangrove',
      quantity: 1,
      unit: 'indeks paket',
      unitPrice: 14312106,
      areaHa: 187.46,
      totalValue: 2682904690,
      referenceSource: 'Balai Konservasi Sumber Daya Alam (BKSDA) Bali'
    },
    {
      id: 'vrow-08',
      serviceId: 'cultural',
      methodName: 'Travel Cost Method (TCM)',
      functionAsset: 'Ekowisata Boardwalk Mangrove & Wisata Edukasi Pesisir',
      quantity: 48500,
      unit: 'kunjungan/th',
      unitPrice: 155325,
      areaHa: 187.46,
      totalValue: 7533285000,
      referenceSource: 'Kuesioner Wisatawan Tahura Ngurah Rai 2025'
    }
  ],
  calculations: [
    {
      serviceId: 'provisioning',
      serviceName: 'Provisioning Services (Jasa Penyediaan)',
      method: 'Market Price & Effect on Production',
      subtotalNominal: 23504655450,
      contributionPct: 40.03
    },
    {
      serviceId: 'regulating',
      serviceName: 'Regulating Services (Jasa Pengaturan)',
      method: 'Replacement Cost & Carbon Storage',
      subtotalNominal: 18235120000,
      contributionPct: 31.05
    },
    {
      serviceId: 'supporting',
      serviceName: 'Supporting Services (Jasa Pendukung)',
      method: 'Nursery Ground & Biodiversity Preservation',
      subtotalNominal: 9450210690,
      contributionPct: 16.09
    },
    {
      serviceId: 'cultural',
      serviceName: 'Cultural Services (Jasa Kultural / Wisata)',
      method: 'Travel Cost Method (TCM)',
      subtotalNominal: 7533285000,
      contributionPct: 12.83
    }
  ],
  historicalTimeline: [
    {
      id: 'hist-2018',
      year: 2018,
      studyTitle: 'Kajian Daya Dukung Teluk Benoa Pra-Pembangunan Jalan Tol',
      institution: 'PKSPL IPB University',
      areaHa: 210.50,
      tev: 42150000000,
      tevPerHa: 200237529,
      isCurrent: false
    },
    {
      id: 'hist-2022',
      year: 2022,
      studyTitle: 'Pemetaan Valuasi Pesisir Bali Selatan Pasca Revitalisasi Tahura',
      institution: 'Universitas Udayana & KLHK',
      areaHa: 195.00,
      tev: 49800000000,
      tevPerHa: 255384615,
      isCurrent: false
    },
    {
      id: 'hist-2026',
      year: 2026,
      studyTitle: 'Revitalisasi Mangrove Teluk Benoa (Penelitian Ini)',
      institution: 'PKSPL IPB (PKS-994KY1)',
      areaHa: 187.46,
      tev: 58723271140,
      tevPerHa: 313257608,
      isCurrent: true
    }
  ]
};

export const getProjectResearchData = (projectId: string): ProjectResearchFullData => {
  if (projectId.toUpperCase().includes('MG7731')) {
    // Muara Gembong (tanpa SHP) untuk menguji empty state data spasial
    return {
      ...MOCK_PROJECT_RESEARCH_BENOA,
      projectId: 'PKS-MG7731',
      projectCode: 'PKS-MG7731',
      projectName: 'Penilaian Jasa Ekosistem Hutan Mangrove Muara Gembong',
      lead: 'Siti Nurhaliza, S.Pi., M.Si.',
      location: 'Kecamatan Muara Gembong, Kabupaten Bekasi, Jawa Barat',
      spatial: {
        hasShp: false,
        crs: '-',
        format: 'Tidak ada data shapefile',
        polygonCount: 0,
        layerCount: 0,
        totalAreaHa: 124.50,
        boundingBox: '-'
      },
      landCovers: []
    };
  }

  // Default kembalikan data riset Teluk Benoa
  return {
    ...MOCK_PROJECT_RESEARCH_BENOA,
    projectId: projectId || 'PKS-994KY1',
    projectCode: projectId || 'PKS-994KY1'
  };
};
