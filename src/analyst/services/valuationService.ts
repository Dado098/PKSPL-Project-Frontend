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
    code: 'TL-MG-01',
    name: 'Mangrove Barat (Hutan Lindung Prapat Benoa)',
    areaHa: 79.86,
    indexCode: 'IDX-001'
  },
  {
    id: 'poly-2',
    code: 'TL-MG-02',
    name: 'Mangrove Timur (Estuari Suwung)',
    areaHa: 62.40,
    indexCode: 'IDX-002'
  },
  {
    id: 'poly-3',
    code: 'TL-MG-03',
    name: 'Zona Restorasi Pesisir Selatan Teluk Benoa',
    areaHa: 45.20,
    indexCode: 'IDX-003'
  },
  {
    id: 'all',
    code: 'ALL-BENOA',
    name: 'Seluruh Kawasan Penelitian Teluk Benoa',
    areaHa: 187.46,
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

  getValuationByArea(areaId: string, projectId?: string): AreaValuationData {
    let selectedData: AreaValuationData;

    if (areaId === 'poly-2' || areaId === 'IDX-002') {
      selectedData = DATA_MANGROVE_TIMUR;
    } else if (areaId === 'poly-3' || areaId === 'IDX-003') {
      selectedData = DATA_ZONA_RESTORASI;
    } else {
      // Default ke Mangrove Barat (IDX-001) sesuai desain referensi
      selectedData = DATA_MANGROVE_BARAT;
    }

    // Pastikan totalValue per kategori dihitung secara dinamis dari baris data
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
