/**
 * Tipe Data Struktur Section 05: Data Valuasi - Seluruh Tabel Penelitian
 * Dikelompokkan ke dalam 4 Kelompok Jasa Ekosistem (A, B, C, D)
 */

export type ServiceCategoryKey = 'provisioning' | 'regulating' | 'supporting' | 'cultural';

export interface BaseValuationRow {
  no: number;
  totalValue: number;
  referenceSource: string;
}

/**
 * Baris Data untuk Kategori A: Provisioning Services (Jasa Penyediaan)
 * Metode: Market Price Method & Effect on Production
 */
export interface ProvisioningRow extends BaseValuationRow {
  commodity: string; // JENIS KOMODITAS / BIOTA
  productivity: number | string; // PRODUKTIVITAS
  unit: string; // SATUAN
  unitPrice: number; // HARGA / UNIT
  quantityVolume: number | string; // JUMLAH / VOLUME
  areaHa: number; // LUAS (HA)
}

/**
 * Baris Data untuk Kategori B: Regulating Services (Jasa Pengaturan)
 * Metode: Replacement Cost / Carbon Storage
 */
export interface RegulatingRow extends BaseValuationRow {
  functionAsset: string; // FUNGSI / ASET PENGATURAN
  parameterUnit: string; // SATUAN / PARAMETER
  unitPrice: number; // BIAYA / HARGA UNIT
}

/**
 * Baris Data untuk Kategori C: Supporting Services (Jasa Pendukung)
 * Metode: Habitat & Nursery Ground
 */
export interface SupportingRow extends BaseValuationRow {
  habitatFunction: string; // FUNGSI / JENIS HABITAT PENDUKUNG
  parameter: string; // PARAMETER / INDEKS BIOMASSA
  unitPrice: number; // BIAYA / NILAI UNIT
}

/**
 * Baris Data untuk Kategori D: Cultural Services (Jasa Budaya & Rekreasi)
 * Metode: Travel Cost Method (TCM)
 */
export interface CulturalRow extends BaseValuationRow {
  attraction: string; // ATRAKSI / OBJEK REKREASI PESISIR
  parameter: string; // PARAMETER / PENGUNJUNG
  travelCostWtp: number; // BIAYA PERJALANAN / WTP
}

export interface ValuationCategoryData<T = any> {
  category: ServiceCategoryKey;
  code: 'A' | 'B' | 'C' | 'D';
  title: string;
  method: string;
  totalValue: number;
  dataCount: number;
  rows: T[];
}

export interface AreaOption {
  id: string;
  code: string;
  name: string;
  areaHa: number;
  indexCode: string;
}

export interface AreaValuationData {
  areaId: string;
  areaCode: string;
  areaName: string;
  areaHa: number;
  categories: {
    provisioning: ValuationCategoryData<ProvisioningRow>;
    regulating: ValuationCategoryData<RegulatingRow>;
    supporting: ValuationCategoryData<SupportingRow>;
    cultural: ValuationCategoryData<CulturalRow>;
  };
}
