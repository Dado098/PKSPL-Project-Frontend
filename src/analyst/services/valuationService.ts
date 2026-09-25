/**
 * Service Adapter untuk Section 05: Data Valuasi
 * Meniru struktur API backend production untuk pengelolaan variabel penelitian
 * per area tutupan lahan dan per kategori jasa ekosistem.
 */

import {
  AreaOption,
  AreaValuationData,
  ProvisioningRow,
  RegulatingRow,
  SupportingRow,
  CulturalRow
} from '../types/valuation';

export const MOCK_VALUATION_AREAS: AreaOption[] = [
  {
    id: 'poly-1',
    code: 'TL-MG-04A',
    name: 'Mangrove Lebat (Tahura Ngurah Rai)',
    areaHa: 45.20,
    indexCode: 'IDX-001'
  },
  {
    id: 'poly-2',
    code: 'TL-MG-04B',
    name: 'Mangrove Sedang (Estuari Benoa)',
    areaHa: 28.50,
    indexCode: 'IDX-002'
  },
  {
    id: 'poly-3',
    code: 'TL-MG-04C',
    name: 'Mangrove Jarang (Sempadan Pesisir)',
    areaHa: 15.00,
    indexCode: 'IDX-003'
  },
  {
    id: 'all',
    code: 'ALL-BENOA',
    name: 'Seluruh Kawasan Penelitian Teluk Benoa',
    areaHa: 88.70,
    indexCode: 'SEMUA-AREA'
  }
];

// Data Valuasi untuk Mangrove Barat (79.86 ha) - IDX-001 sesuai desain referensi
const DATA_MANGROVE_BARAT: AreaValuationData = {
  areaId: 'poly-1',
  areaCode: 'TL-MG-01',
  areaName: 'Mangrove Barat',
  areaHa: 79.86,
  categories: {
    provisioning: {
      category: 'provisioning',
      code: 'A',
      title: 'Provisioning Services (Jasa Penyediaan)',
      method: 'Market Price',
      dataCount: 3,
      totalValue: 6172535700,
      rows: [
        {
          no: 1,
          commodity: 'Rhizophora apiculata (Bakau Minyak)',
          productivity: 45.2,
          unit: 'm³/ha',
          unitPrice: 1710000,
          quantityVolume: 3609.67,
          areaHa: 79.86,
          totalValue: 6172535700,
          referenceSource: 'Data Inventarisasi Tegakan 2024'
        },
        {
          no: 2,
          commodity: '-',
          productivity: -1,
          unit: 'm³/ha',
          unitPrice: 0,
          quantityVolume: '-',
          areaHa: 79.86,
          totalValue: 0,
          referenceSource: 'Survei Lapangan Peneliti'
        },
        {
          no: 3,
          commodity: '-',
          productivity: '-',
          unit: 'm³/ha',
          unitPrice: 0,
          quantityVolume: '-',
          areaHa: 79.86,
          totalValue: 0,
          referenceSource: 'Survei Lapangan Peneliti'
        }
      ]
    },
    regulating: {
      category: 'regulating',
      code: 'B',
      title: 'Regulating Services (Jasa Pengaturan)',
      method: 'Replacement Cost / Carbon',
      dataCount: 1,
      totalValue: 2357865750,
      rows: [
        {
          no: 1,
          functionAsset: 'Tanggul Penahan Gelombang & Abrasi Zona Barat',
          parameterUnit: '480',
          unitPrice: 0,
          totalValue: 2357865750,
          referenceSource: 'Dinas PUPR Provinsi Bali'
        }
      ]
    },
    supporting: {
      category: 'supporting',
      code: 'C',
      title: 'Supporting Services (Jasa Pendukung)',
      method: 'Habitat & Nursery Ground',
      dataCount: 1,
      totalValue: 1521514120,
      rows: [
        {
          no: 1,
          habitatFunction: 'Nursery Ground Benih Udang & Ikan Karamba',
          parameter: '380 kg/ha',
          unitPrice: 50000,
          totalValue: 1521514120,
          referenceSource: 'Balai Riset Perikanan Budidaya & PKSPL IPB'
        }
      ]
    },
    cultural: {
      category: 'cultural',
      code: 'D',
      title: 'Cultural Services (Jasa Budaya & Rekreasi)',
      method: 'Travel Cost Method (TCM)',
      dataCount: 2,
      totalValue: 1072000000,
      rows: [
        {
          no: 1,
          attraction: 'Ekowisata Boardwalk Mangrove Prapat Benoa',
          parameter: '12.500 org/th',
          travelCostWtp: 65000,
          totalValue: 812500000,
          referenceSource: 'Kuesioner Pengunjung & Pengelola Tahura'
        },
        {
          no: 2,
          attraction: 'Wisata Edukasi & Pengamatan Burung Air (Birdwatching)',
          parameter: '3.200 org/th',
          travelCostWtp: 81093.75,
          totalValue: 259500000,
          referenceSource: 'Survei Pengunjung BKSDA Bali'
        }
      ]
    }
  }
};

// Data Valuasi untuk Mangrove Timur (62.40 ha) - IDX-002
const DATA_MANGROVE_TIMUR: AreaValuationData = {
  areaId: 'poly-2',
  areaCode: 'TL-MG-02',
  areaName: 'Mangrove Timur',
  areaHa: 62.40,
  categories: {
    provisioning: {
      category: 'provisioning',
      code: 'A',
      title: 'Provisioning Services (Jasa Penyediaan)',
      method: 'Market Price',
      dataCount: 2,
      totalValue: 4823500000,
      rows: [
        {
          no: 1,
          commodity: 'Avicennia marina (Api-api Putih)',
          productivity: 38.5,
          unit: 'm³/ha',
          unitPrice: 1650000,
          quantityVolume: 2402.40,
          areaHa: 62.40,
          totalValue: 3963960000,
          referenceSource: 'Data Inventarisasi Suwung 2024'
        },
        {
          no: 2,
          commodity: 'Tangkapan Kepiting Bakau Liar',
          productivity: 110.0,
          unit: 'kg/ha',
          unitPrice: 125000,
          quantityVolume: 6864.00,
          areaHa: 62.40,
          totalValue: 859540000,
          referenceSource: 'Catatan Nelayan Suwung 2025'
        }
      ]
    },
    regulating: {
      category: 'regulating',
      code: 'B',
      title: 'Regulating Services (Jasa Pengaturan)',
      method: 'Carbon Storage (Blue Carbon)',
      dataCount: 1,
      totalValue: 1845000000,
      rows: [
        {
          no: 1,
          functionAsset: 'Sekuestrasi Karbon Biru Sedimen Estuari Suwung',
          parameterUnit: '160 ton C/ha',
          unitPrice: 184800,
          totalValue: 1845000000,
          referenceSource: 'Kajian Blue Carbon PKSPL IPB'
        }
      ]
    },
    supporting: {
      category: 'supporting',
      code: 'C',
      title: 'Supporting Services (Jasa Pendukung)',
      method: 'Habitat & Nursery Ground',
      dataCount: 1,
      totalValue: 1189000000,
      rows: [
        {
          no: 1,
          habitatFunction: 'Daerah Pemijahan & Asuhan Ikan Bandeng Alami',
          parameter: '320 kg/ha',
          unitPrice: 59500,
          totalValue: 1189000000,
          referenceSource: 'Dinas Kelautan dan Perikanan Bali'
        }
      ]
    },
    cultural: {
      category: 'cultural',
      code: 'D',
      title: 'Cultural Services (Jasa Budaya & Rekreasi)',
      method: 'Travel Cost Method (TCM)',
      dataCount: 1,
      totalValue: 835000000,
      rows: [
        {
          no: 1,
          attraction: 'Wisata Susur Sungai & Edukasi Mangrove Suwung',
          parameter: '11.000 org/th',
          travelCostWtp: 75909,
          totalValue: 835000000,
          referenceSource: 'Kuesioner Wisata Sungai Suwung'
        }
      ]
    }
  }
};

// Data Valuasi untuk Zona Restorasi (45.20 ha) - IDX-003
const DATA_ZONA_RESTORASI: AreaValuationData = {
  areaId: 'poly-3',
  areaCode: 'TL-MG-03',
  areaName: 'Zona Restorasi Pesisir Selatan',
  areaHa: 45.20,
  categories: {
    provisioning: {
      category: 'provisioning',
      code: 'A',
      title: 'Provisioning Services (Jasa Penyediaan)',
      method: 'Effect on Production',
      dataCount: 1,
      totalValue: 2450000000,
      rows: [
        {
          no: 1,
          commodity: 'Bibit & Propagul Mangrove Siap Tanam',
          productivity: 12000,
          unit: 'batang/ha',
          unitPrice: 4500,
          quantityVolume: 542400,
          areaHa: 45.20,
          totalValue: 2450000000,
          referenceSource: 'Kelompok Tani Hutan Teluk Benoa'
        }
      ]
    },
    regulating: {
      category: 'regulating',
      code: 'B',
      title: 'Regulating Services (Jasa Pengaturan)',
      method: 'Wave Attenuation & Coastal Buffer',
      dataCount: 1,
      totalValue: 1425000000,
      rows: [
        {
          no: 1,
          functionAsset: 'Peredam Gelombang Pasang Surut Pesisir Selatan',
          parameterUnit: '320 m garis pantai',
          unitPrice: 4453125,
          totalValue: 1425000000,
          referenceSource: 'Dinas PU SDA Bali'
        }
      ]
    },
    supporting: {
      category: 'supporting',
      code: 'C',
      title: 'Supporting Services (Jasa Pendukung)',
      method: 'Biodiversity Value',
      dataCount: 1,
      totalValue: 890000000,
      rows: [
        {
          no: 1,
          habitatFunction: 'Konservasi Habitat Burung Pecuk Padi & Kuntul',
          parameter: 'Indeks Keanekaragaman H\' = 2.45',
          unitPrice: 890000000,
          totalValue: 890000000,
          referenceSource: 'BKSDA Bali & FKL'
        }
      ]
    },
    cultural: {
      category: 'cultural',
      code: 'D',
      title: 'Cultural Services (Jasa Budaya & Rekreasi)',
      method: 'Travel Cost Method (TCM)',
      dataCount: 1,
      totalValue: 650000000,
      rows: [
        {
          no: 1,
          attraction: 'Program Adopsi Pohon Mangrove & Edu-Voluntourism',
          parameter: '6.500 volunteer/th',
          travelCostWtp: 100000,
          totalValue: 650000000,
          referenceSource: 'Laporan Yayasan Restorasi Pesisir'
        }
      ]
    }
  }
};

class ValuationService {
  getAvailableAreas(projectId?: string): AreaOption[] {
    return MOCK_VALUATION_AREAS;
  }

  getValuationByArea(areaId: string, projectData?: any): AreaValuationData {
    if (projectData?.landCovers && Array.isArray(projectData.landCovers) && projectData.landCovers.length > 0) {
      const match = projectData.landCovers.find((lc: any) => lc.id === areaId || lc.code === areaId || lc.name === areaId) || projectData.landCovers[0];
      if (match) {
        const areaHa = Number(match.areaHa) || 50;
        const total = Number(match.totalValue) || 24871677785;
        const provDetail = match.serviceDetails?.find((s: any) => s.serviceId === 'provisioning')?.value;
        const regDetail = match.serviceDetails?.find((s: any) => s.serviceId === 'regulating')?.value;
        const suppDetail = match.serviceDetails?.find((s: any) => s.serviceId === 'supporting')?.value;
        const cultDetail = match.serviceDetails?.find((s: any) => s.serviceId === 'cultural')?.value;

        const provVal = provDetail ?? Math.round(total * 0.8009);
        const regVal = regDetail ?? Math.round(total * 0.0948);
        const suppVal = suppDetail ?? Math.round(total * 0.0612);
        const cultVal = cultDetail ?? Math.max(0, total - provVal - regVal - suppVal);

        const isCoral = (projectData.ecosystem || '').toLowerCase().includes('karang');

        return {
          areaId: match.id,
          areaCode: match.code,
          areaName: match.name,
          areaHa: areaHa,
          categories: {
            provisioning: {
              category: 'provisioning',
              code: 'A',
              title: 'Provisioning Services (Jasa Penyediaan)',
              method: 'Market Price',
              dataCount: 2,
              totalValue: provVal,
              rows: [
                {
                  id: `${match.id}-prov-1`,
                  no: 1,
                  commodity: isCoral ? 'Hasil Tangkapan Ikan Karang Konsumsi' : 'Hasil Tangkapan Kepiting & Ikan Estuari',
                  productivity: isCoral ? '380 kg/ha/tahun' : '520 kg/ha/tahun',
                  unit: 'kg/tahun',
                  unitPrice: isCoral ? 85000 : 125000,
                  pricePerUnit: isCoral ? 85000 : 125000,
                  quantityVolume: isCoral ? Math.round(380 * areaHa) : Math.round(520 * areaHa),
                  areaHa: areaHa,
                  totalValue: Math.round(provVal * 0.65),
                  referenceSource: 'Survei Pasar & TPI Daerah 2026',
                  source: 'Survei Pasar & TPI Daerah 2026'
                },
                {
                  id: `${match.id}-prov-2`,
                  no: 2,
                  commodity: isCoral ? 'Bibit Karang & Benih Biota Karang' : 'Biomassa Kayu Bakau & Bibit Silvofishery',
                  productivity: isCoral ? '150 koloni/ha' : '45 m³/ha',
                  unit: isCoral ? 'koloni' : 'm³/ha',
                  unitPrice: isCoral ? 65000 : 2850000,
                  pricePerUnit: isCoral ? 65000 : 2850000,
                  quantityVolume: isCoral ? Math.round(150 * areaHa) : Math.round(45 * areaHa),
                  areaHa: areaHa,
                  totalValue: Math.round(provVal * 0.35),
                  referenceSource: 'Catatan Nelayan Lokal PKSPL',
                  source: 'Catatan Nelayan Lokal PKSPL'
                }
              ]
            },
            regulating: {
              category: 'regulating',
              code: 'B',
              title: 'Regulating Services (Jasa Pengaturan)',
              method: isCoral ? 'Breakwater & Wave Attenuation' : 'Replacement Cost & Carbon Storage',
              dataCount: 2,
              totalValue: regVal,
              rows: [
                {
                  id: `${match.id}-reg-1`,
                  no: 1,
                  functionAsset: isCoral ? 'Breakwater & Wave Attenuation (Peredam Ombak)' : 'Konstruksi Seawall Alternatif (Pencegah Erosi)',
                  assetFunction: isCoral ? 'Breakwater & Wave Attenuation (Peredam Ombak)' : 'Konstruksi Seawall Alternatif (Pencegah Erosi)',
                  parameterUnit: '3.5 km garis pantai',
                  lengthParameter: '3.5 km garis pantai',
                  unitPrice: Math.round(regVal * 0.6 / 3.5),
                  unitCost: Math.round(regVal * 0.6 / 3.5),
                  totalValue: Math.round(regVal * 0.6),
                  referenceSource: 'Pedoman Standar PU SDA Pesisir',
                  source: 'Pedoman Standar PU SDA Pesisir'
                },
                {
                  id: `${match.id}-reg-2`,
                  no: 2,
                  functionAsset: isCoral ? 'Stabilisasi Garis Pantai & Perlindungan Abrasi' : 'Sekuestrasi Karbon Biru (Blue Carbon Storage)',
                  assetFunction: isCoral ? 'Stabilisasi Garis Pantai & Perlindungan Abrasi' : 'Sekuestrasi Karbon Biru (Blue Carbon Storage)',
                  parameterUnit: `${areaHa} ha zona pelindung`,
                  lengthParameter: `${areaHa} ha zona pelindung`,
                  unitPrice: Math.round(regVal * 0.4 / Math.max(1, areaHa)),
                  unitCost: Math.round(regVal * 0.4 / Math.max(1, areaHa)),
                  totalValue: Math.round(regVal * 0.4),
                  referenceSource: 'IPCC Wetland Supplement & Bappenas',
                  source: 'IPCC Wetland Supplement & Bappenas'
                }
              ]
            },
            supporting: {
              category: 'supporting',
              code: 'C',
              title: 'Supporting Services (Jasa Pendukung)',
              method: 'Habitat & Nursery Ground',
              dataCount: 2,
              totalValue: suppVal,
              rows: [
                {
                  id: `${match.id}-supp-1`,
                  no: 1,
                  habitatFunction: 'Daerah Asuhan & Pemijahan (Nursery Ground)',
                  parameter: `${areaHa} ha ekosistem`,
                  ecosystemAreaHa: areaHa,
                  unitPrice: Math.round(suppVal * 0.7 / Math.max(1, areaHa)),
                  recruitmentContribution: Math.round(suppVal * 0.7 / Math.max(1, areaHa)),
                  totalValue: Math.round(suppVal * 0.7),
                  referenceSource: 'Studi Ekologi Pesisir PKSPL IPB',
                  source: 'Studi Ekologi Pesisir PKSPL IPB'
                },
                {
                  id: `${match.id}-supp-2`,
                  no: 2,
                  habitatFunction: 'Keanekaragaman Hayati & Habitat Biota Langka',
                  parameter: `${areaHa} ha zona penyangga`,
                  ecosystemAreaHa: areaHa,
                  unitPrice: Math.round(suppVal * 0.3 / Math.max(1, areaHa)),
                  recruitmentContribution: Math.round(suppVal * 0.3 / Math.max(1, areaHa)),
                  totalValue: Math.round(suppVal * 0.3),
                  referenceSource: 'BKSDA & Tim Peneliti IPB',
                  source: 'BKSDA & Tim Peneliti IPB'
                }
              ]
            },
            cultural: {
              category: 'cultural',
              code: 'D',
              title: 'Cultural Services (Jasa Kultural / Wisata)',
              method: 'Travel Cost Method (TCM)',
              dataCount: 2,
              totalValue: cultVal,
              rows: [
                {
                  id: `${match.id}-cult-1`,
                  no: 1,
                  attraction: isCoral ? 'Wisata Selam & Snorkeling Bahari' : 'Ekowisata Boardwalk & Hutan Mangrove',
                  tourismProgram: isCoral ? 'Wisata Selam & Snorkeling Bahari' : 'Ekowisata Boardwalk & Hutan Mangrove',
                  parameter: '35.000 org/th',
                  respondentCount: 35000,
                  travelCostWtp: Math.round(cultVal * 0.75 / 35000),
                  costPerUnit: Math.round(cultVal * 0.75 / 35000),
                  totalValue: Math.round(cultVal * 0.75),
                  referenceSource: 'Survei Wisatawan Mancanegara & Domestik',
                  source: 'Survei Wisatawan Mancanegara & Domestik'
                },
                {
                  id: `${match.id}-cult-2`,
                  no: 2,
                  attraction: 'Wisata Edukasi Lingkungan & Penelitian Lapangan',
                  tourismProgram: 'Wisata Edukasi Lingkungan & Penelitian Lapangan',
                  parameter: '8.500 org/th',
                  respondentCount: 8500,
                  travelCostWtp: Math.round(cultVal * 0.25 / 8500),
                  costPerUnit: Math.round(cultVal * 0.25 / 8500),
                  totalValue: Math.round(cultVal * 0.25),
                  referenceSource: 'Tiket Masuk & Registrasi Pengunjung',
                  source: 'Tiket Masuk & Registrasi Pengunjung'
                }
              ]
            }
          }
        };
      }
    }

    let selectedData: AreaValuationData;

    if (areaId === 'poly-2' || areaId === 'IDX-002') {
      selectedData = DATA_MANGROVE_TIMUR;
    } else if (areaId === 'poly-3' || areaId === 'IDX-003') {
      selectedData = DATA_ZONA_RESTORASI;
    } else {
      selectedData = DATA_MANGROVE_BARAT;
    }

    const computeTotal = (rows: { totalValue: number }[]) =>
      rows.reduce((sum, r) => sum + (r.totalValue || 0), 0);

    return {
      ...selectedData,
      categories: {
        provisioning: {
          ...selectedData.categories.provisioning,
          totalValue: computeTotal(selectedData.categories.provisioning.rows),
          dataCount: selectedData.categories.provisioning.rows.length
        },
        regulating: {
          ...selectedData.categories.regulating,
          totalValue: computeTotal(selectedData.categories.regulating.rows),
          dataCount: selectedData.categories.regulating.rows.length
        },
        supporting: {
          ...selectedData.categories.supporting,
          totalValue: computeTotal(selectedData.categories.supporting.rows),
          dataCount: selectedData.categories.supporting.rows.length
        },
        cultural: {
          ...selectedData.categories.cultural,
          totalValue: computeTotal(selectedData.categories.cultural.rows),
          dataCount: selectedData.categories.cultural.rows.length
        }
      }
    };
  }
}

export const valuationService = new ValuationService();
export default valuationService;
