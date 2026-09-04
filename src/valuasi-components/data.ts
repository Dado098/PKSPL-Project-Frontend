export type CategoryKey =
  | "provisioning"
  | "regulating"
  | "supporting"
  | "cultural";

export type ModuleKey = "direct" | "indirect";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  labelId: string;
  color: string;
  tint: string;
  description: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  provisioning: {
    key: "provisioning",
    label: "Provisioning Services",
    labelId: "Jasa Penyediaan",
    color: "var(--provisioning)",
    tint: "#e3f4f8",
    description: "Produk yang dihasilkan langsung oleh ekosistem",
  },
  regulating: {
    key: "regulating",
    label: "Regulating Services",
    labelId: "Jasa Pengaturan",
    color: "var(--regulating)",
    tint: "#e7eefe",
    description: "Manfaat dari pengaturan proses ekosistem",
  },
  supporting: {
    key: "supporting",
    label: "Supporting Services",
    labelId: "Jasa Pendukung",
    color: "var(--supporting)",
    tint: "#efe7fb",
    description: "Fungsi dasar yang menopang jasa lainnya",
  },
  cultural: {
    key: "cultural",
    label: "Cultural Services",
    labelId: "Jasa Budaya",
    color: "var(--cultural)",
    tint: "#fdf0dc",
    description: "Manfaat non-material dari ekosistem",
  },
};

export type DataStatus = "draft" | "review" | "accepted" | "rejected";

export const STATUS: Record<
  DataStatus,
  { label: string; tint: string; color: string; desc: string }
> = {
  draft: {
    label: "Draf",
    tint: "#eef1f5",
    color: "#64748b",
    desc: "Data masih disusun, belum diajukan untuk ditinjau.",
  },
  review: {
    label: "Peninjauan",
    tint: "#fdf0dc",
    color: "#e0910f",
    desc: "Data sedang ditinjau oleh validator.",
  },
  accepted: {
    label: "Accepted",
    tint: "#e6f4ee",
    color: "#22a06b",
    desc: "Data telah diverifikasi dan diterima.",
  },
  rejected: {
    label: "Ditolak",
    tint: "#fdecec",
    color: "#c0392b",
    desc: "Data ditolak dan perlu diperbaiki.",
  },
};

export const STATUS_ORDER: DataStatus[] = [
  "accepted",
  "draft",
  "review",
  "rejected",
];

export type Biota = "flora" | "fauna";

export const BIOTA: Record<Biota, { label: string; tint: string; color: string }> = {
  flora: { label: "Flora", tint: "#e6f4ee", color: "#157a5b" },
  fauna: { label: "Fauna", tint: "#e3f4f8", color: "#0e7490" },
};

export interface ValuationRow {
  id: string;
  category: CategoryKey;
  biota?: Biota;
  method: string;
  item: string;
  location: string;
  quantity: number;
  unit: string;
  price: number;
  cost: number;
  period: string;
  source: string;
  status: DataStatus;
  note?: string;
  value: number;
}

export interface Project {
  name: string;
  group: string;
  code: string;
  year: number;
  location: string;
  ecosystem: string;
  lead: string;
  updated: string;
  rows: ValuationRow[];
}

export function rowValue(quantity: number, price: number, cost: number) {
  return Math.max(0, quantity) * Math.max(0, price - cost);
}

export const INITIAL_PROJECT: Project = {
  name: "Hutan lahan kering primer",
  group: "Ekosistem Mangrove Bali",
  code: "iDX-003",
  year: 2025,
  location: "Kabupaten Badung, Bali",
  ecosystem: "Ekosistem Mangrove Pesisir",
  lead: "Dr. Ir. Retno Wulandari, M.Si.",
  updated: "28 Agustus 2025",
  rows: [
    {
      id: "PRV-001",
      category: "provisioning",
      biota: "fauna",
      method: "Market Price / Nilai Pasar",
      item: "Hasil Perikanan Tangkap (Ikan & Kepiting)",
      location: "Zona Mangrove Utara",
      quantity: 42000,
      unit: "kg/tahun",
      price: 38000,
      cost: 14500,
      period: "2024",
      source: "Dinas Kelautan & Perikanan Badung",
      status: "accepted",
      value: rowValue(42000, 38000, 14500),
    },
    {
      id: "PRV-002",
      category: "provisioning",
      biota: "flora",
      method: "Effect on Production",
      item: "Kayu Bakar & Hasil Non-Kayu",
      location: "Zona Mangrove Selatan",
      quantity: 8600,
      unit: "ikat/tahun",
      price: 12000,
      cost: 4000,
      period: "2024",
      source: "Survei Rumah Tangga 2024",
      status: "accepted",
      value: rowValue(8600, 12000, 4000),
    },
    {
      id: "REG-001",
      category: "regulating",
      method: "Climate / Carbon Storage",
      item: "Penyerapan Karbon (Blue Carbon)",
      location: "Seluruh Kawasan",
      quantity: 3150,
      unit: "tCO₂e/tahun",
      price: 210000,
      cost: 0,
      period: "2024",
      source: "KLHK — Faktor Emisi Nasional",
      status: "accepted",
      value: rowValue(3150, 210000, 0),
    },
    {
      id: "CUL-001",
      category: "cultural",
      method: "TCM",
      item: "Ekowisata Susur Mangrove",
      location: "Dermaga Wisata",
      quantity: 24500,
      unit: "kunjungan/tahun",
      price: 46000,
      cost: 9000,
      period: "2024",
      source: "Pengelola Ekowisata Mangrove",
      status: "review",
      value: rowValue(24500, 46000, 9000),
    },
  ],
};

export interface MethodMeta {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryKey;
  description: string;
  module: ModuleKey[];
}

export const METHODS: MethodMeta[] = [
  {
    id: "market-price",
    name: "Market Price",
    subtitle: "Nilai Pasar",
    category: "provisioning",
    description: "Menilai barang/jasa yang diperdagangkan di pasar berdasarkan harga aktual.",
    module: ["direct"],
  },
  {
    id: "effect-production",
    name: "Effect on Production",
    subtitle: "Efek terhadap Produksi",
    category: "provisioning",
    description: "Mengukur kontribusi ekosistem terhadap output produksi ekonomi.",
    module: ["direct", "indirect"],
  },
  {
    id: "hpm",
    name: "HPM",
    subtitle: "Hedonic Pricing Method",
    category: "regulating",
    description: "Menilai jasa lingkungan melalui selisih harga properti.",
    module: ["indirect"],
  },
  {
    id: "abm",
    name: "ABM",
    subtitle: "Defensive Expenditure",
    category: "regulating",
    description: "Biaya yang dikeluarkan untuk menghindari kerusakan lingkungan.",
    module: ["indirect"],
  },
  {
    id: "carbon",
    name: "Climate / Carbon Storage",
    subtitle: "Penyimpanan Karbon",
    category: "regulating",
    description: "Menilai penyerapan dan penyimpanan karbon oleh ekosistem.",
    module: ["indirect"],
  },
  {
    id: "erosion",
    name: "Erosion Control",
    subtitle: "Pengendalian Erosi",
    category: "regulating",
    description: "Nilai perlindungan tanah dan pencegahan sedimentasi.",
    module: ["indirect"],
  },
  {
    id: "tcm",
    name: "TCM",
    subtitle: "Travel Cost Method",
    category: "cultural",
    description: "Menilai rekreasi berdasarkan biaya perjalanan pengunjung.",
    module: ["direct", "indirect"],
  },
  {
    id: "cvm",
    name: "CVM",
    subtitle: "Contingent Valuation",
    category: "cultural",
    description: "Kesediaan membayar responden melalui survei hipotetis.",
    module: ["indirect"],
  },
  {
    id: "choice",
    name: "Choice Experiment",
    subtitle: "Eksperimen Pilihan",
    category: "cultural",
    description: "Preferensi masyarakat atas atribut jasa ekosistem.",
    module: ["indirect"],
  },
  {
    id: "habitat",
    name: "Habitat / Nursery",
    subtitle: "Nursery Ground Function",
    category: "supporting",
    description: "Nilai fungsi habitat dan tempat pemijahan biota.",
    module: ["indirect"],
  },
];

export function formatIDR(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1e12) return `Rp ${(n / 1e12).toFixed(2)} T`;
    if (Math.abs(n) >= 1e9) return `Rp ${(n / 1e9).toFixed(2)} M`;
    if (Math.abs(n) >= 1e6) return `Rp ${(n / 1e6).toFixed(1)} jt`;
  }
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export function formatNum(n: number): string {
  return n.toLocaleString("id-ID");
}
