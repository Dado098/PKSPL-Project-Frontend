import { ProjectResearchFullData, LandCoverItem, MasterSpeciesItem, ValuationRowItem, EcosystemCalculationItem, HistoricalStudyPoint } from '../types/researchData';
import { ALL_PROJECT_LAND_COVERS, getFallbackLandCoversForProject } from '../../peneliti/mock/projectMockRegistry';

// Koordinat riil Teluk Benoa, Badung & Denpasar, Bali
export const BENOA_LAND_COVERS: LandCoverItem[] = [
  {
    id: 'poly-1',
    code: 'TL-MG-04A',
    name: 'Mangrove Lebat (Tahura Ngurah Rai)',
    type: 'mangrove',
    areaHa: 45.20,
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
    totalValue: 24871677785,
    status: 'verified'
  },
  {
    id: 'poly-2',
    code: 'TL-MG-04B',
    name: 'Mangrove Sedang (Estuari Benoa)',
    type: 'mangrove',
    areaHa: 28.50,
    center: [-8.748, 115.228],
    coordinates: [
      [-8.740, 115.222],
      [-8.738, 115.234],
      [-8.752, 115.238],
      [-8.758, 115.228],
      [-8.750, 115.220]
    ],
    indexCode: 'IDX-002',
    totalValue: 24871677785,
    status: 'verified'
  },
  {
    id: 'poly-3',
    code: 'TL-MG-04C',
    name: 'Mangrove Jarang (Sempadan Pesisir)',
    type: 'mangrove',
    areaHa: 15.00,
    center: [-8.755, 115.215],
    coordinates: [
      [-8.750, 115.210],
      [-8.748, 115.220],
      [-8.758, 115.222],
      [-8.762, 115.214],
      [-8.758, 115.208]
    ],
    indexCode: 'IDX-003',
    totalValue: 24871677785,
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
  grandTev: 74615033355,
  tevPerHa: 841206689,
  spatial: {
    hasShp: true,
    crs: 'EPSG:4326 (WGS 84)',
    format: 'ESRI Shapefile (Polygon Geometry)',
    polygonCount: 3,
    layerCount: 4,
    totalAreaHa: 88.70,
    boundingBox: '115.195° E - 115.238° E, -8.762° S - -8.735° S',
    shpFileName: 'SHP_TelukBenoa_Mangrove_2026_Rev3.zip',
    uploadDate: '12 September 2026'
  },
  landCovers: BENOA_LAND_COVERS,
  masterSpecies: [
    {
      id: 'msp-mg-01',
      localName: 'Cemara Laut',
      scientificName: 'Casuarina equisetifolia',
      category: 'flora',
      densityStandard: '33,18 m³/ha',
      unit: 'm³/ha',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-mg-02',
      localName: 'Sengon Laut',
      scientificName: 'Falcataria moluccana',
      category: 'flora',
      densityStandard: '23,93 m³/ha',
      unit: 'm³/ha',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-mg-03',
      localName: 'Jabon Merah',
      scientificName: 'Neolamarckia macrophylla',
      category: 'flora',
      densityStandard: '18,50 m³/ha',
      unit: 'm³/ha',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-mg-04',
      localName: 'Bakau Minyak',
      scientificName: 'Rhizophora apiculata',
      category: 'flora',
      densityStandard: '45,20 m³/ha',
      unit: 'm³/ha',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-mg-05',
      localName: 'Ikan Bandeng Tambak',
      scientificName: 'Chanos chanos',
      category: 'fauna',
      densityStandard: '48.000 kg/th',
      unit: 'kg/tahun',
      status: 'Terdaftar PKSPL'
    },
    {
      id: 'msp-mg-06',
      localName: 'Kepiting Bakau',
      scientificName: 'Scylla serrata',
      category: 'fauna',
      densityStandard: '450 kg/ha/tahun',
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
      subtotalNominal: 59760893745,
      contributionPct: 80.1
    },
    {
      serviceId: 'regulating',
      serviceName: 'Regulating Services (Jasa Pengaturan)',
      method: 'Replacement Cost & Carbon Storage',
      subtotalNominal: 7073597250,
      contributionPct: 9.5
    },
    {
      serviceId: 'supporting',
      serviceName: 'Supporting Services (Jasa Pendukung)',
      method: 'Nursery Ground & Biodiversity Preservation',
      subtotalNominal: 4564542360,
      contributionPct: 6.1
    },
    {
      serviceId: 'cultural',
      serviceName: 'Cultural Services (Jasa Kultural / Wisata)',
      method: 'Travel Cost Method (TCM)',
      subtotalNominal: 3216000000,
      contributionPct: 4.3
    }
  ],
  historicalTimeline: [
    {
      id: 'hist-2018',
      year: 2018,
      studyTitle: 'Kajian Daya Dukung Teluk Benoa Pra-Pembangunan Jalan Tol',
      institution: 'PKSPL IPB University',
      areaHa: 102.00,
      tev: 53722824015,
      tevPerHa: 526694353,
      isCurrent: false
    },
    {
      id: 'hist-2022',
      year: 2022,
      studyTitle: 'Pemetaan Valuasi Pesisir Bali Selatan Pasca Revitalisasi Tahura',
      institution: 'Universitas Udayana & KLHK',
      areaHa: 95.50,
      tev: 63422778351,
      tevPerHa: 664112862,
      isCurrent: false
    },
    {
      id: 'hist-2026',
      year: 2026,
      studyTitle: 'Revitalisasi Mangrove Teluk Benoa (Penelitian Ini)',
      institution: 'PKSPL IPB (PKS-994KY1)',
      areaHa: 88.70,
      tev: 74615033355,
      tevPerHa: 841206689,
      isCurrent: true
    }
  ]
};

const KNOWN_PROJECT_META: Record<string, { code: string; name: string; lead: string; location: string; ecosystem: string }> = {
  'PRJ-001': { code: 'PRJ-001', name: 'Revitalisasi Mangrove Teluk Benoa', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Kawasan Pesisir Teluk Benoa, Badung & Denpasar, Bali', ecosystem: 'Ekosistem Mangrove & Estuari Pesisir' },
  '1': { code: 'PRJ-001', name: 'Revitalisasi Mangrove Teluk Benoa', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Kawasan Pesisir Teluk Benoa, Badung & Denpasar, Bali', ecosystem: 'Ekosistem Mangrove & Estuari Pesisir' },
  'PKS-994KY1': { code: 'PKS-994KY1', name: 'Revitalisasi Mangrove Teluk Benoa', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Kawasan Pesisir Teluk Benoa, Badung & Denpasar, Bali', ecosystem: 'Ekosistem Mangrove & Estuari Pesisir' },

  'PRJ-002': { code: 'PRJ-002', name: 'Kajian Hutan Kota Jakarta', lead: 'Budi Santoso, S.Kel., M.Sc.', location: 'Gelora Bung Karno & Hutan Kota Senayan, Jakarta Pusat', ecosystem: 'Hutan Kota & Urban Wetland' },
  '2': { code: 'PRJ-002', name: 'Kajian Hutan Kota Jakarta', lead: 'Budi Santoso, S.Kel., M.Sc.', location: 'Gelora Bung Karno & Hutan Kota Senayan, Jakarta Pusat', ecosystem: 'Hutan Kota & Urban Wetland' },
  'PKS-KKPRIV': { code: 'PKS-KKPRIV', name: 'Kajian Hutan Kota Jakarta', lead: 'Budi Santoso, S.Kel., M.Sc.', location: 'Gelora Bung Karno & Hutan Kota Senayan, Jakarta Pusat', ecosystem: 'Hutan Kota & Urban Wetland' },

  'PRJ-003': { code: 'PRJ-003', name: 'Pemantauan Terumbu Karang Bali', lead: 'Prof. Dr. Wayan Sudarma, M.Env.', location: 'Zona Terumbu Karang Pantai Pandawa, Badung, Bali', ecosystem: 'Ekosistem Terumbu Karang & Padang Lamun' },
  '3': { code: 'PRJ-003', name: 'Pemantauan Terumbu Karang Bali', lead: 'Prof. Dr. Wayan Sudarma, M.Env.', location: 'Zona Terumbu Karang Pantai Pandawa, Badung, Bali', ecosystem: 'Ekosistem Terumbu Karang & Padang Lamun' },

  'PRJ-004': { code: 'PRJ-004', name: 'Restorasi Karbon Biru Mangrove Teluk Benoa', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Taman Hutan Raya Ngurah Rai & Teluk Benoa, Badung, Bali', ecosystem: 'Ekosistem Mangrove & Estuari Pesisir' },
  '4': { code: 'PRJ-004', name: 'Restorasi Karbon Biru Mangrove Teluk Benoa', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Taman Hutan Raya Ngurah Rai & Teluk Benoa, Badung, Bali', ecosystem: 'Ekosistem Mangrove & Estuari Pesisir' },

  'PRJ-005': { code: 'PRJ-005', name: 'Valuasi Jasa Perlindungan Pesisir Badung', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Pantai Pandawa & Pesisir Selatan Bukit, Badung, Bali', ecosystem: 'Ekosistem Terumbu Karang & Pesisir' },
  '5': { code: 'PRJ-005', name: 'Valuasi Jasa Perlindungan Pesisir Badung', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Pantai Pandawa & Pesisir Selatan Bukit, Badung, Bali', ecosystem: 'Ekosistem Terumbu Karang & Pesisir' },

  'PRJ-006': { code: 'PRJ-006', name: 'Kajian Padang Lamun & Karbon Teluk Banten', lead: 'Dr. Hendra Gunawan, M.Si.', location: 'Teluk Banten, Serang, Banten', ecosystem: 'Padang Lamun & Sedimen Karbon' },
  '6': { code: 'PRJ-006', name: 'Kajian Padang Lamun & Karbon Teluk Banten', lead: 'Dr. Hendra Gunawan, M.Si.', location: 'Teluk Banten, Serang, Banten', ecosystem: 'Padang Lamun & Sedimen Karbon' },

  'PRJ-007': { code: 'PRJ-007', name: 'Valuasi Jasa Daerah Aliran Sungai Citarum Hilir', lead: 'Dr. Ir. Arief Wicaksono, M.T.', location: 'Muara Sungai Citarum, Karawang, Jawa Barat', ecosystem: 'Estuari Riparian & Wetland' },
  '7': { code: 'PRJ-007', name: 'Valuasi Jasa Daerah Aliran Sungai Citarum Hilir', lead: 'Dr. Ir. Arief Wicaksono, M.T.', location: 'Muara Sungai Citarum, Karawang, Jawa Barat', ecosystem: 'Estuari Riparian & Wetland' },

  'PRJ-008': { code: 'PRJ-008', name: 'Valuasi Ekosistem Pesisir Nusa Penida', lead: 'Prof. Dr. Wayan Sudarma, M.Env.', location: 'Kawasan Konservasi Perairan Nusa Penida, Klungkung, Bali', ecosystem: 'Terumbu Karang & Padang Lamun' },
  '8': { code: 'PRJ-008', name: 'Valuasi Ekosistem Pesisir Nusa Penida', lead: 'Prof. Dr. Wayan Sudarma, M.Env.', location: 'Kawasan Konservasi Perairan Nusa Penida, Klungkung, Bali', ecosystem: 'Terumbu Karang & Padang Lamun' },
  'PKS-UW8J6F': { code: 'PKS-UW8J6F', name: 'Valuasi Ekosistem Pesisir Nusa Penida', lead: 'Prof. Dr. Wayan Sudarma, M.Env.', location: 'Kawasan Konservasi Perairan Nusa Penida, Klungkung, Bali', ecosystem: 'Terumbu Karang & Padang Lamun' },

  'PRJ-009': { code: 'PRJ-009', name: 'Valuasi Jasa Hutan Mangrove Muara Gembong', lead: 'Siti Nurhaliza, S.Pi., M.Si.', location: 'Kecamatan Muara Gembong, Kabupaten Bekasi, Jawa Barat', ecosystem: 'Ekosistem Mangrove & Tambak' },
  '9': { code: 'PRJ-009', name: 'Valuasi Jasa Hutan Mangrove Muara Gembong', lead: 'Siti Nurhaliza, S.Pi., M.Si.', location: 'Kecamatan Muara Gembong, Kabupaten Bekasi, Jawa Barat', ecosystem: 'Ekosistem Mangrove & Tambak' },

  'PRJ-010': { code: 'PRJ-010', name: 'Kajian Daya Dukung Wisata Bahari Bunaken', lead: 'Dr. Maria Lumempouw, M.Si.', location: 'Taman Nasional Bunaken, Manado, Sulawesi Utara', ecosystem: 'Taman Nasional Laut & Terumbu Karang' },
  '10': { code: 'PRJ-010', name: 'Kajian Daya Dukung Wisata Bahari Bunaken', lead: 'Dr. Maria Lumempouw, M.Si.', location: 'Taman Nasional Bunaken, Manado, Sulawesi Utara', ecosystem: 'Taman Nasional Laut & Terumbu Karang' },

  'PRJ-ANTAM': { code: 'PRJ-ANTAM', name: 'Valuasi Ekonomi Pesisir & Reklamasi PT Antam', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Kawasan Pesisir Pomalaa, Kolaka, Sulawesi Tenggara', ecosystem: 'Ekosistem Mangrove & Terumbu Karang Karst' },
  '11': { code: 'PRJ-ANTAM', name: 'Valuasi Ekonomi Pesisir & Reklamasi PT Antam', lead: 'Dr. Ir. Retno Wulandari, M.Si.', location: 'Kawasan Pesisir Pomalaa, Kolaka, Sulawesi Tenggara', ecosystem: 'Ekosistem Mangrove & Terumbu Karang Karst' },
};

const getSpeciesForEcosystem = (ecosystem: string): MasterSpeciesItem[] => {
  const eco = (ecosystem || '').toLowerCase();
  if (eco.includes('karang') || eco.includes('reef')) {
    return [
      { id: 'msp-cr-01', localName: 'Karang Meja', scientificName: 'Acropora hyacinthus', category: 'fauna', densityStandard: '42% tutupan koloni', unit: 'tutupan/m²', status: 'Terdaftar PKSPL' },
      { id: 'msp-cr-02', localName: 'Karang Masif', scientificName: 'Porites lutea', category: 'fauna', densityStandard: '28% tutupan koloni', unit: 'tutupan/m²', status: 'Terdaftar PKSPL' },
      { id: 'msp-cr-03', localName: 'Ikan Kerapu Macan', scientificName: 'Epinephelus fuscoguttatus', category: 'fauna', densityStandard: '380 kg/ha/tahun', unit: 'kg/tahun', status: 'Terdaftar PKSPL' },
      { id: 'msp-cr-04', localName: 'Lobster Mutiara', scientificName: 'Panulirus ornatus', category: 'fauna', densityStandard: '120 kg/ha/tahun', unit: 'kg/tahun', status: 'Terdaftar PKSPL' },
      { id: 'msp-cr-05', localName: 'Lamun Sendok', scientificName: 'Halophila ovalis', category: 'flora', densityStandard: '180 tegakan/m²', unit: 'tegakan/m²', status: 'Terdaftar PKSPL' },
    ];
  }
  if (eco.includes('lamun') || eco.includes('seagrass')) {
    return [
      { id: 'msp-lm-01', localName: 'Lamun Enhalus', scientificName: 'Enhalus acoroides', category: 'flora', densityStandard: '250 tegakan/m²', unit: 'tegakan/m²', status: 'Terdaftar PKSPL' },
      { id: 'msp-lm-02', localName: 'Lamun Thalassia', scientificName: 'Thalassia hemprichii', category: 'flora', densityStandard: '420 tegakan/m²', unit: 'tegakan/m²', status: 'Terdaftar PKSPL' },
      { id: 'msp-lm-03', localName: 'Dugong', scientificName: 'Dugong dugon', category: 'fauna', densityStandard: 'Biota Asuhan Terlindungi', unit: 'individu/kawasan', status: 'Satwa Dilindungi' },
      { id: 'msp-lm-04', localName: 'Teripang Pasir', scientificName: 'Holothuria scabra', category: 'fauna', densityStandard: '210 kg/ha/tahun', unit: 'kg/tahun', status: 'Terdaftar PKSPL' },
    ];
  }
  if (eco.includes('hutan kota') || eco.includes('urban')) {
    return [
      { id: 'msp-urb-01', localName: 'Pohon Trembesi', scientificName: 'Samanea saman', category: 'flora', densityStandard: '120 pohon/ha', unit: 'batang/m³', status: 'Terdaftar PKSPL' },
      { id: 'msp-urb-02', localName: 'Mahoni', scientificName: 'Swietenia macrophylla', category: 'flora', densityStandard: '180 pohon/ha', unit: 'batang/m³', status: 'Terdaftar PKSPL' },
      { id: 'msp-urb-03', localName: 'Burung Kutilang', scientificName: 'Pycnonotus aurigaster', category: 'fauna', densityStandard: '45 ekor/ha', unit: 'populasi', status: 'Terdaftar PKSPL' },
    ];
  }
  // Default Mangrove species (Matches the 24 spreadsheet variables calculation)
  return [
    { id: 'msp-mg-01', localName: 'Cemara Laut', scientificName: 'Casuarina equisetifolia', category: 'flora', densityStandard: '33,18 m³/ha', unit: 'm³/ha', status: 'Terdaftar PKSPL' },
    { id: 'msp-mg-02', localName: 'Sengon Laut', scientificName: 'Falcataria moluccana', category: 'flora', densityStandard: '23,93 m³/ha', unit: 'm³/ha', status: 'Terdaftar PKSPL' },
    { id: 'msp-mg-03', localName: 'Jabon Merah', scientificName: 'Neolamarckia macrophylla', category: 'flora', densityStandard: '18,50 m³/ha', unit: 'm³/ha', status: 'Terdaftar PKSPL' },
    { id: 'msp-mg-04', localName: 'Bakau Minyak', scientificName: 'Rhizophora apiculata', category: 'flora', densityStandard: '45,20 m³/ha', unit: 'm³/ha', status: 'Terdaftar PKSPL' },
    { id: 'msp-mg-05', localName: 'Ikan Bandeng Tambak', scientificName: 'Chanos chanos', category: 'fauna', densityStandard: '48.000 kg/th', unit: 'kg/tahun', status: 'Terdaftar PKSPL' },
    { id: 'msp-mg-06', localName: 'Kepiting Bakau', scientificName: 'Scylla serrata', category: 'fauna', densityStandard: '450 kg/ha/tahun', unit: 'kg/tahun', status: 'Terdaftar PKSPL' },
  ];
};

export const getProjectResearchData = (projectId: string): ProjectResearchFullData => {
  const normId = String(projectId || '').trim();

  if (normId.toUpperCase().includes('MG7731')) {
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

  // Lookup metadata
  const meta = KNOWN_PROJECT_META[normId] || {
    code: normId || 'PRJ-001',
    name: 'Penelitian Valuasi Sumber Daya Pesisir',
    lead: 'Dr. Ir. Retno Wulandari, M.Si.',
    location: 'Kawasan Pesisir & Laut Indonesia',
    ecosystem: 'Ekosistem Pesisir & Laut'
  };

  // Lookup polygons
  const sourcePolygons =
    ALL_PROJECT_LAND_COVERS[normId] ||
    ALL_PROJECT_LAND_COVERS[meta.code] ||
    getFallbackLandCoversForProject(meta.code || normId);

  const landCovers: LandCoverItem[] = sourcePolygons.map(p => ({
    id: p.id,
    code: p.code,
    name: p.name,
    type: (p.type || 'mangrove') as LandCoverItem['type'],
    areaHa: p.areaHa || 0,
    center: p.center || [-8.745, 115.205],
    coordinates: p.coordinates || [],
    indexCode: p.indexCode,
    totalValue: p.totalValue || 0,
    status: 'verified' as const
  }));

  // Dynamic calculations from polygons
  let provTotal = 0;
  let regTotal = 0;
  let suppTotal = 0;
  let cultTotal = 0;

  sourcePolygons.forEach(p => {
    if (Array.isArray(p.serviceDetails) && p.serviceDetails.length > 0) {
      p.serviceDetails.forEach(sd => {
        if (sd.serviceId === 'provisioning') provTotal += sd.value;
        if (sd.serviceId === 'regulating') regTotal += sd.value;
        if (sd.serviceId === 'supporting') suppTotal += sd.value;
        if (sd.serviceId === 'cultural') cultTotal += sd.value;
      });
    } else {
      const v = p.totalValue || 0;
      const pVal = Math.round(v * 0.8009);
      const rVal = Math.round(v * 0.0948);
      const sVal = Math.round(v * 0.0612);
      const cVal = Math.max(0, v - pVal - rVal - sVal);
      provTotal += pVal;
      regTotal += rVal;
      suppTotal += sVal;
      cultTotal += cVal;
    }
  });

  const grandTev = provTotal + regTotal + suppTotal + cultTotal;
  const totalAreaHa = Number(sourcePolygons.reduce((sum, p) => sum + (p.areaHa || 0), 0).toFixed(2));
  const tevPerHa = totalAreaHa > 0 ? Math.round(grandTev / totalAreaHa) : 0;

  const calculations: EcosystemCalculationItem[] = [
    {
      serviceId: 'provisioning',
      serviceName: 'Provisioning Services (Jasa Penyediaan)',
      method: 'Market Price & Effect on Production',
      subtotalNominal: provTotal,
      contributionPct: grandTev > 0 ? Number(((provTotal / grandTev) * 100).toFixed(2)) : 25.0
    },
    {
      serviceId: 'regulating',
      serviceName: 'Regulating Services (Jasa Pengaturan)',
      method: meta.ecosystem.toLowerCase().includes('karang') ? 'Breakwater & Wave Attenuation' : 'Replacement Cost & Carbon Storage',
      subtotalNominal: regTotal,
      contributionPct: grandTev > 0 ? Number(((regTotal / grandTev) * 100).toFixed(2)) : 45.0
    },
    {
      serviceId: 'supporting',
      serviceName: 'Supporting Services (Jasa Pendukung)',
      method: 'Nursery Ground & Biodiversity Preservation',
      subtotalNominal: suppTotal,
      contributionPct: grandTev > 0 ? Number(((suppTotal / grandTev) * 100).toFixed(2)) : 15.0
    },
    {
      serviceId: 'cultural',
      serviceName: 'Cultural Services (Jasa Kultural / Wisata)',
      method: 'Travel Cost Method (TCM)',
      subtotalNominal: cultTotal,
      contributionPct: grandTev > 0 ? Number(((cultTotal / grandTev) * 100).toFixed(2)) : 15.0
    }
  ];

  // Dynamic valuation rows
  const valuationRows: ValuationRowItem[] = [
    {
      id: `vrow-${meta.code}-01`,
      serviceId: 'provisioning',
      methodName: 'Market Price (Harga Pasar)',
      functionAsset: meta.ecosystem.toLowerCase().includes('karang') ? 'Hasil Tangkapan Ikan Karang & Kerapu' : 'Biomassa Kayu Bakau & Biota Komersial',
      quantity: 45,
      unit: 'satuan/ha',
      unitPrice: Math.round(provTotal * 0.55 / Math.max(1, totalAreaHa)),
      areaHa: totalAreaHa,
      totalValue: Math.round(provTotal * 0.55),
      referenceSource: 'Survei Pasar Lokal & TPI PKSPL 2026'
    },
    {
      id: `vrow-${meta.code}-02`,
      serviceId: 'provisioning',
      methodName: 'Effect on Production',
      functionAsset: meta.ecosystem.toLowerCase().includes('karang') ? 'Bibit Transplantasi & Benih Biota Karang' : 'Benih Silvofishery & Kepiting Bakau',
      quantity: 520,
      unit: 'kg/ha/th',
      unitPrice: Math.round(provTotal * 0.45 / Math.max(1, totalAreaHa)),
      areaHa: totalAreaHa,
      totalValue: Math.round(provTotal * 0.45),
      referenceSource: 'Dinas Kelautan & Perikanan Daerah'
    },
    {
      id: `vrow-${meta.code}-03`,
      serviceId: 'regulating',
      methodName: meta.ecosystem.toLowerCase().includes('karang') ? 'Breakwater Valuation' : 'Replacement Cost',
      functionAsset: meta.ecosystem.toLowerCase().includes('karang') ? 'Peredam Energi Gelombang & Pemecah Ombak Alami' : 'Pencegahan Erosi Pantai & Tanggul Alami',
      quantity: 4.8,
      unit: 'km pesisir',
      unitPrice: Math.round(regTotal * 0.65 / 4.8),
      areaHa: totalAreaHa,
      totalValue: Math.round(regTotal * 0.65),
      referenceSource: 'Standar Teknis PU Sumber Daya Air Pesisir'
    },
    {
      id: `vrow-${meta.code}-04`,
      serviceId: 'regulating',
      methodName: 'Carbon Storage & Regulation',
      functionAsset: meta.ecosystem.toLowerCase().includes('karang') ? 'Stabilisasi Garis Pantai & Sedimen Pesisir' : 'Sekuestrasi Karbon Biru (Blue Carbon)',
      quantity: 180,
      unit: 'ton/ha',
      unitPrice: Math.round(regTotal * 0.35 / Math.max(1, totalAreaHa)),
      areaHa: totalAreaHa,
      totalValue: Math.round(regTotal * 0.35),
      referenceSource: 'Pedoman IPCC Wetlands & Bappenas'
    },
    {
      id: `vrow-${meta.code}-05`,
      serviceId: 'supporting',
      methodName: 'Nursery Ground Valuation',
      functionAsset: 'Daerah Asuhan, Pemijahan & Rekrutmen Biota Laut',
      quantity: 380,
      unit: 'kg asuhan/ha',
      unitPrice: Math.round(suppTotal * 0.7 / Math.max(1, totalAreaHa)),
      areaHa: totalAreaHa,
      totalValue: Math.round(suppTotal * 0.7),
      referenceSource: 'Studi Ekologi Pesisir PKSPL IPB University'
    },
    {
      id: `vrow-${meta.code}-06`,
      serviceId: 'supporting',
      methodName: 'Biodiversity Value',
      functionAsset: 'Keanekaragaman Hayati Biota & Habitat Penyangga',
      quantity: 1,
      unit: 'indeks paket',
      unitPrice: Math.round(suppTotal * 0.3),
      areaHa: totalAreaHa,
      totalValue: Math.round(suppTotal * 0.3),
      referenceSource: 'Balai Konservasi Sumber Daya Alam'
    },
    {
      id: `vrow-${meta.code}-07`,
      serviceId: 'cultural',
      methodName: 'Travel Cost Method (TCM)',
      functionAsset: 'Rekreasi Bahari, Ekowisata & Wisata Edukasi Pesisir',
      quantity: 48500,
      unit: 'kunjungan/th',
      unitPrice: Math.round(cultTotal / 48500),
      areaHa: totalAreaHa,
      totalValue: cultTotal,
      referenceSource: 'Kuesioner Wisatawan & Tiket Masuk Kawasan'
    }
  ];

  return {
    projectId: normId,
    projectCode: meta.code,
    projectName: meta.name,
    lead: meta.lead,
    location: meta.location,
    ecosystem: meta.ecosystem,
    grandTev,
    tevPerHa,
    spatial: {
      hasShp: true,
      crs: 'EPSG:4326 (WGS 84)',
      format: 'ESRI Shapefile (Polygon Geometry)',
      polygonCount: landCovers.length,
      layerCount: 4,
      totalAreaHa,
      boundingBox: '115.195° E - 115.238° E, -8.762° S - -8.735° S',
      shpFileName: `SHP_${meta.code}_Spatial_2026.zip`,
      uploadDate: '15 September 2026'
    },
    landCovers,
    masterSpecies: getSpeciesForEcosystem(meta.ecosystem),
    valuationRows,
    calculations,
    historicalTimeline: [
      {
        id: `hist-${meta.code}-2018`,
        year: 2018,
        studyTitle: `Kajian Daya Dukung ${meta.name} Tahap I`,
        institution: 'PKSPL IPB University',
        areaHa: Number((totalAreaHa * 1.15).toFixed(2)),
        tev: Math.round(grandTev * 0.72),
        tevPerHa: Math.round((grandTev * 0.72) / (totalAreaHa * 1.15)),
        isCurrent: false
      },
      {
        id: `hist-${meta.code}-2022`,
        year: 2022,
        studyTitle: `Pemetaan Valuasi ${meta.name} Pasca Konservasi`,
        institution: 'Universitas Udayana & KLHK',
        areaHa: Number((totalAreaHa * 1.05).toFixed(2)),
        tev: Math.round(grandTev * 0.85),
        tevPerHa: Math.round((grandTev * 0.85) / (totalAreaHa * 1.05)),
        isCurrent: false
      },
      {
        id: `hist-${meta.code}-2026`,
        year: 2026,
        studyTitle: `${meta.name} (Penelitian Ini)`,
        institution: `PKSPL IPB (${meta.code})`,
        areaHa: totalAreaHa,
        tev: grandTev,
        tevPerHa,
        isCurrent: true
      }
    ]
  };
};

