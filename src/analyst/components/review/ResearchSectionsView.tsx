import React from 'react';
import { ProjectResearchFullData } from '../../types/researchData';
import {
  FolderKanban,
  User,
  MapPin,
  Layers,
  Database,
  SlidersHorizontal,
  TableProperties,
  Calculator,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Globe2,
  TreeDeciduous,
  Scale,
  History,
  Info,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { ValuationSection } from './ValuationSection';

interface ResearchSectionsViewProps {
  data: ProjectResearchFullData;
  onOpenSectionComment: (sectionName: string) => void;
}

const PIE_COLORS = ['#2563eb', '#0ea5e9', '#8b5cf6', '#d97706'];

export const ResearchSectionsView: React.FC<ResearchSectionsViewProps> = ({
  data,
  onOpenSectionComment
}) => {
  const formatIDR = (val?: number | null) => `Rp ${(Number(val) || 0).toLocaleString('id-ID')}`;

  const formatNumber = (num?: number | null, decimals: number = 1) =>
    (Number(num) || 0).toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  // 1. Calculations breakdown
  const provCalc = data.calculations.find(c => c.serviceId === 'provisioning')?.subtotalNominal || 0;
  const regCalc = data.calculations.find(c => c.serviceId === 'regulating')?.subtotalNominal || 0;
  const suppCalc = data.calculations.find(c => c.serviceId === 'supporting')?.subtotalNominal || 0;
  const cultCalc = data.calculations.find(c => c.serviceId === 'cultural')?.subtotalNominal || 0;

  // 2. Direct, Indirect, Supporting values
  const directValue = provCalc + cultCalc; // Provisioning + Cultural
  const indirectValue = regCalc;          // Regulating
  const supportingValue = suppCalc;       // Supporting
  const grandTEV = data.grandTev || (directValue + indirectValue + supportingValue);
  const totalAreaHa = data.spatial?.totalAreaHa || 88.70;
  const tevPerHa = data.tevPerHa || (totalAreaHa > 0 ? Math.round(grandTEV / totalAreaHa) : 841206689);

  // Percentages
  const duvPct = grandTEV > 0 ? Number(((directValue / grandTEV) * 100).toFixed(1)) : 84.4;
  const iuvPct = grandTEV > 0 ? Number(((indirectValue / grandTEV) * 100).toFixed(1)) : 9.5;
  const suvPct = grandTEV > 0 ? Number(((supportingValue / grandTEV) * 100).toFixed(1)) : 6.1;

  // Chart 1: Direct vs Indirect vs Supporting
  const directIndirectData = [
    { name: 'Direct Use Value', value: directValue, color: '#2563eb' },
    { name: 'Indirect Use Value', value: indirectValue, color: '#0ea5e9' },
    { name: 'Supporting Value', value: supportingValue, color: '#8b5cf6' }
  ];

  // Chart 2: 4 Ecosystem Services Bar Chart
  const serviceBarData = [
    { name: 'Provisioning', subtotal: Number((provCalc / 1e9).toFixed(2)), nominal: provCalc, fill: '#0e7490' },
    { name: 'Regulating', subtotal: Number((regCalc / 1e9).toFixed(2)), nominal: regCalc, fill: '#2563eb' },
    { name: 'Supporting', subtotal: Number((suppCalc / 1e9).toFixed(2)), nominal: suppCalc, fill: '#7c3aed' },
    { name: 'Cultural', subtotal: Number((cultCalc / 1e9).toFixed(2)), nominal: cultCalc, fill: '#d97706' }
  ];

  // Chart 3: Distribusi Nilai per Area Tutupan Lahan (Antar Poligon)
  const areaComparisonData = data.landCovers.map(lc => ({
    name: lc.name,
    totalMiliar: Number(((lc.totalValue || 0) / 1e9).toFixed(2)),
    total: lc.totalValue || 0,
    areaHa: lc.areaHa
  }));

  // Indikator 4 Jasa Ekosistem Breakdown
  const serviceContributions = [
    {
      id: 'provisioning',
      code: 'A',
      name: 'Provisioning Services',
      shortName: 'Provisioning',
      nominal: provCalc,
      percentage: grandTEV > 0 ? Number(((provCalc / grandTEV) * 100).toFixed(1)) : 80.1,
      color: '#0e7490',
      description: 'Hasil panen komoditas & biomassa vegetasi'
    },
    {
      id: 'regulating',
      code: 'B',
      name: 'Regulating Services',
      shortName: 'Regulating',
      nominal: regCalc,
      percentage: grandTEV > 0 ? Number(((regCalc / grandTEV) * 100).toFixed(1)) : 9.5,
      color: '#2563eb',
      description: 'Pencegah abrasi, seawall & serapan karbon biru'
    },
    {
      id: 'supporting',
      code: 'C',
      name: 'Supporting Services',
      shortName: 'Supporting',
      nominal: suppCalc,
      percentage: grandTEV > 0 ? Number(((suppCalc / grandTEV) * 100).toFixed(1)) : 6.1,
      color: '#7c3aed',
      description: 'Habitat asuhan biota & nursery ground'
    },
    {
      id: 'cultural',
      code: 'D',
      name: 'Cultural Services',
      shortName: 'Cultural',
      nominal: cultCalc,
      percentage: grandTEV > 0 ? Number(((cultCalc / grandTEV) * 100).toFixed(1)) : 4.3,
      color: '#d97706',
      description: 'Ekowisata pesisir & edukasi konservasi'
    }
  ];

  const highestService = serviceContributions[0];

  // Detailed Component Cards
  const componentCompositions = [
    {
      name: 'Direct Use Value (DUV)',
      value: directValue,
      percentage: duvPct,
      color: '#2563eb',
      description: 'Manfaat langsung: komoditas panen & wisata rekreasi'
    },
    {
      name: 'Indirect Use Value (IUV)',
      value: indirectValue,
      percentage: iuvPct,
      color: '#0ea5e9',
      description: 'Manfaat tidak langsung: perlindungan fisik & stabilitas pesisir'
    },
    {
      name: 'Supporting Value (SUV)',
      value: supportingValue,
      percentage: suvPct,
      color: '#8b5cf6',
      description: 'Fungsi penopang ekologis: asuhan benih & keanekaragaman hayati'
    }
  ];

  // Check if historical studies exist
  const hasHistoricalStudies = data.historicalTimeline && data.historicalTimeline.filter(h => !h.isCurrent).length > 0;

  return (
    <div className="space-y-8 text-slate-800">
      {/* ============================================================== */}
      {/* INFORMASI PROYEK */}
      {/* ============================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
              IP
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Informasi Proyek Penelitian
            </h3>
          </div>
          <button
            onClick={() => onOpenSectionComment('Informasi Proyek')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Beri Catatan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-1">Kode Proyek</span>
            <span className="font-mono font-bold text-blue-700 text-sm">{data.projectCode}</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-1">Peneliti Utama</span>
            <span className="font-semibold text-slate-900">{data.lead}</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-1">Kategori Ekosistem</span>
            <span className="font-semibold text-slate-900">{data.ecosystem}</span>
          </div>
          <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
            <span className="text-slate-400 block mb-1">Lokasi Administratif</span>
            <span className="font-semibold text-slate-900">{data.location}</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 01. INDEX & AREA TUTUPAN LAHAN */}
      {/* ============================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">01</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Index & Area Tutupan Lahan
            </h3>
          </div>
          <button
            onClick={() => onOpenSectionComment('01. INDEX & AREA TUTUPAN LAHAN')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Beri Catatan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Kode Index</th>
                <th className="py-3 px-4">Nama Index & Area</th>
                <th className="py-3 px-4">Tipe Tutupan</th>
                <th className="py-3 px-4 text-right">Luas (Ha)</th>
                <th className="py-3 px-4 text-right">Nilai Ekonomi</th>
                <th className="py-3 px-4 text-center">Status Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.landCovers.map((lc) => (
                <tr key={lc.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{lc.indexCode}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{lc.name}</td>
                  <td className="py-3 px-4 capitalize text-slate-600">{lc.type.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold">{lc.areaHa} ha</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    {formatIDR(lc.totalValue)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Terverifikasi
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 02. DATA SPASIAL */}
      {/* ============================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">02</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Data Spasial & Metadata Geometris
            </h3>
          </div>
          <button
            onClick={() => onOpenSectionComment('02. DATA SPASIAL')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Beri Catatan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Sistem Koordinat Acuan (CRS)</span>
            <span className="font-mono font-bold text-slate-900">{data.spatial.crs}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Format Berkas Sumber</span>
            <span className="font-semibold text-slate-900">{data.spatial.format}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Jumlah Layer Aktif</span>
            <span className="font-bold text-slate-900 font-mono">{data.spatial.layerCount} Layer ({data.spatial.polygonCount} Poligon)</span>
          </div>
          <div className="sm:col-span-2 lg:col-span-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Geographic Bounding Box (BBox)</span>
            <span className="font-mono text-slate-700">{data.spatial.boundingBox}</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 03. DATA MASTER */}
      {/* ============================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">03</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Data Master Spesies & Parameter Standar
            </h3>
          </div>
          <button
            onClick={() => onOpenSectionComment('03. DATA MASTER')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Beri Catatan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Nama Lokal</th>
                <th className="py-3 px-4">Nama Ilmiah (Taksonomi)</th>
                <th className="py-3 px-4">Kategori Biota</th>
                <th className="py-3 px-4">Kepadatan Standar</th>
                <th className="py-3 px-4 text-center">Status Katalog</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.masterSpecies.map((sp) => (
                <tr key={sp.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{sp.localName}</td>
                  <td className="py-3 px-4 italic text-slate-600">{sp.scientificName}</td>
                  <td className="py-3 px-4 uppercase text-slate-500 font-mono text-[11px]">{sp.category}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{sp.densityStandard}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {sp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 04. JASA & METODE */}
      {/* ============================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">04</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Jasa Ekosistem & Metodologi Ilmiah
            </h3>
          </div>
          <button
            onClick={() => onOpenSectionComment('04. JASA & METODE')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Beri Catatan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200 space-y-1">
            <h4 className="font-bold text-sky-950">Provisioning Services (Jasa Penyediaan)</h4>
            <p className="text-sky-800">Metode: <strong>Market Price Method & Effect on Production</strong></p>
            <p className="text-[11px] text-sky-700">Formula: Produktivitas (m³/ha) × Luas (ha) × Harga Pasar Lokal.</p>
          </div>

          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
            <h4 className="font-bold text-blue-950">Regulating Services (Jasa Pengaturan)</h4>
            <p className="text-blue-800">Metode: <strong>Replacement Cost & Carbon Storage Valuation</strong></p>
            <p className="text-[11px] text-blue-700">Formula: Panjang Garis Pantai × Biaya Konstruksi Seawall Alternatif.</p>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
            <h4 className="font-bold text-purple-950">Supporting Services (Jasa Pendukung)</h4>
            <p className="text-purple-800">Metode: <strong>Nursery Ground Valuation & Biodiversity Index</strong></p>
            <p className="text-[11px] text-purple-700">Formula: Stok biomassa asuhan bibit biota × Indeks kontribusi habitat.</p>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-amber-950">Cultural Services (Jasa Kultural / Wisata)</h4>
            <p className="text-amber-800">Metode: <strong>Travel Cost Method (TCM)</strong></p>
            <p className="text-[11px] text-amber-700">Formula: Jumlah Kunjungan/Tahun × Rata-rata Biaya Perjalanan Wisatawan.</p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 05. DATA VALUASI */}
      {/* ============================================================== */}
      <ValuationSection data={data} onOpenSectionComment={onOpenSectionComment} />

      {/* ============================================================== */}
      {/* 06. PERHITUNGAN */}
      {/* ============================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">06</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Perhitungan Agregasi Nilai Ekonomi
            </h3>
          </div>
          <button
            onClick={() => onOpenSectionComment('06. PERHITUNGAN')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Beri Catatan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {data.calculations.map((c) => (
            <div key={c.serviceId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-slate-400 block mb-1 font-semibold">{c.serviceName}</span>
                <span className="text-base sm:text-lg font-bold font-mono text-slate-900 block">
                  {formatIDR(c.subtotalNominal)}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Kontribusi:</span>
                <span className="font-bold font-mono text-blue-700">{c.contributionPct}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 07. REKAPITULASI NILAI EKONOMI */}
      {/* ============================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">07</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Rekapitulasi Nilai Ekonomi (TEV)
            </h3>
          </div>
          <button
            onClick={() => onOpenSectionComment('07. REKAPITULASI NILAI EKONOMI')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Beri Catatan</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Kategori Jasa Ekosistem</th>
                <th className="py-3 px-4">Metodologi Valuasi Terpilih</th>
                <th className="py-3 px-4 text-right">Nilai Nominal (Rp)</th>
                <th className="py-3 px-4 text-right">Kontribusi (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data.calculations.map((c) => (
                <tr key={c.serviceId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{c.serviceName}</td>
                  <td className="py-3 px-4 text-slate-600">{c.method}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{formatIDR(c.subtotalNominal)}</td>
                  <td className="py-3 px-4 text-right font-mono text-blue-700 font-bold">{c.contributionPct}%</td>
                </tr>
              ))}
              <tr className="bg-blue-50/60 font-bold text-slate-900 border-t-2 border-blue-200">
                <td className="py-3.5 px-4 text-sm" colSpan={2}>
                  TOTAL ECONOMIC VALUE (TEV)
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-base text-blue-800">
                  {formatIDR(data.grandTev)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-blue-800">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 08. ANALITIK & VISUALISASI */}
      {/* ============================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">08</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Analitik & Visualisasi Grafik Valuasi
            </h3>
          </div>
          <button
            onClick={() => onOpenSectionComment('08. ANALITIK & VISUALISASI')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Beri Catatan</span>
          </button>
        </div>

        {/* Row 1: Chart 1 (Direct vs Indirect) & Chart 2 (Perbandingan 4 Jasa) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Direct vs Indirect (Donut Pie) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-600" />
                <span>1. Direct Value vs Indirect Value</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Komposisi TEV</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={directIndirectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {directIndirectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => [formatIDR(Number(val)), 'Nilai']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Direct Value</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5">
                  {formatNumber(duvPct, 1)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Indirect Value</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5">
                  {formatNumber(iuvPct, 1)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Supporting</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5">
                  {formatNumber(suvPct, 1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Perbandingan 4 Jasa Ekosistem (Bar Chart) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>2. Perbandingan 4 Jasa Ekosistem</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Dalam Miliar Rupiah</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1e9).toFixed(0)}M`} tick={{ fontSize: 10 }} />
                  <RechartsTooltip formatter={(val) => [formatIDR(Number(val)), 'Nilai']} />
                  <Bar dataKey="nominal" radius={[4, 4, 0, 0]}>
                    {serviceBarData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-2.5 bg-slate-50 rounded text-xs text-slate-500 border border-slate-200/60 mt-auto text-center">
              Jasa Penyediaan dan Pengaturan mendominasi lebih dari <strong>90%</strong> total nilai fungsi ekologis.
            </div>
          </div>
        </div>

        {/* Row 2: Chart 3 (Distribusi Nilai Ekonomi per Area Tutupan Lahan) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>3. Distribusi Nilai Ekonomi per Area Tutupan Lahan</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">Komparasi Antar Poligon</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaComparisonData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${(v / 1e9).toFixed(0)} M`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={180} />
                <RechartsTooltip formatter={(val) => [formatIDR(Number(val)), 'Nilai Valuasi']} />
                <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: Indikator Utama - Indikator Nilai Ekonomi */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-200/60">
                  Indikator Utama
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span>Indikator Nilai Ekonomi</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Rasio intensitas ekonomi per satuan luas dan proporsi kontribusi relatif fungsi ekosistem.
              </p>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2 self-start sm:self-auto">
              <span className="font-semibold text-slate-700">Area Terhitung:</span>
              <span>Seluruh Area ({formatNumber(totalAreaHa, 1)} Ha)</span>
            </div>
          </div>

          {/* 3 Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Nilai Ekonomi per Ha */}
            <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/30 p-4 rounded-lg border border-emerald-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Nilai Ekonomi per Ha
                </span>
                <Scale className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold text-emerald-950 font-mono mt-1.5">
                {formatIDR(tevPerHa)} <span className="text-xs font-semibold text-emerald-700">/ Ha</span>
              </div>
              <p className="text-[11px] text-emerald-700/90 mt-1 leading-snug">
                Total Economic Value dibandingkan luas area ({formatNumber(totalAreaHa, 1)} Ha)
              </p>
            </div>

            {/* Card 2: Kontribusi Jasa Dominan */}
            <div className="bg-gradient-to-br from-cyan-50/70 to-blue-50/30 p-4 rounded-lg border border-cyan-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider">
                  Kontribusi Jasa Dominan
                </span>
                <Sparkles className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-xl font-bold text-cyan-950 font-mono mt-1.5">
                {formatNumber(highestService.percentage, 1)}%
              </div>
              <p className="text-[11px] text-cyan-700/90 mt-1 leading-snug">
                Dipimpin oleh <strong>{highestService.name}</strong> ({formatIDR(highestService.nominal)})
              </p>
            </div>

            {/* Card 3: Rasio Direct vs Indirect */}
            <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/30 p-4 rounded-lg border border-purple-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                  Rasio Direct : Indirect
                </span>
                <PieIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-purple-950 font-mono mt-1.5">
                {formatNumber(duvPct, 1)}% : {formatNumber(iuvPct, 1)}%
              </div>
              <p className="text-[11px] text-purple-700/90 mt-1 leading-snug">
                Pemanfaatan komoditas riil berbanding fungsi pelindung lingkungan
              </p>
            </div>
          </div>

          {/* 2 Detailed Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Visual 1: Kontribusi 4 Jasa Ekosistem (Donut Chart) */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-blue-600" />
                  <span>Kontribusi 4 Jasa Ekosistem terhadap TEV</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono font-medium">100% TEV</span>
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceContributions}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="nominal"
                    >
                      {serviceContributions.map((entry, index) => (
                        <Cell key={`service-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(val) => [formatIDR(Number(val)), 'Subtotal']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Breakdown List */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-xs">
                {serviceContributions.map(s => (
                  <div key={s.id} className="p-2 bg-white rounded border border-slate-200/80">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                      <span className="font-semibold text-slate-800 truncate" title={s.name}>
                        {s.code}. {s.shortName}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1 font-mono">
                      <span className="text-slate-500 text-[10px]">{formatIDR(s.nominal)}</span>
                      <span className="font-bold text-slate-900 text-[11px]">{formatNumber(s.percentage, 1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual 2: Komposisi Direct / Indirect / Supporting Value */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Komposisi Direct, Indirect & Supporting</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono font-medium">Agregasi DUV, IUV & SUV</span>
                </div>

                {/* 100% Proportional Horizontal Bar */}
                <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-200 mb-4 shadow-inner">
                  {componentCompositions.map((c, i) => (
                    <div
                      key={i}
                      style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
                      className="h-full transition-all"
                      title={`${c.name}: ${formatNumber(c.percentage, 1)}% (${formatIDR(c.value)})`}
                    />
                  ))}
                </div>

                {/* Detailed Component Cards */}
                <div className="space-y-2">
                  {componentCompositions.map((comp, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: comp.color }}></div>
                        <div>
                          <div className="font-bold text-xs text-slate-800">{comp.name}</div>
                          <div className="text-[10px] text-slate-500">{comp.description}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {formatNumber(comp.percentage, 1)}%
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {formatIDR(comp.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2 bg-blue-50/80 rounded border border-blue-200/60 text-[10px] text-blue-800 mt-3 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                <span>
                  Total Economic Value (TEV) merupakan akumulasi utuh dari DUV ({formatNumber(duvPct, 1)}%), IUV ({formatNumber(iuvPct, 1)}%), dan SUV ({formatNumber(suvPct, 1)}%).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Riwayat Penelitian (Empty state sesuai Gambar 1 atau chart jika ada riwayat riil) */}
        {hasHistoricalStudies ? (
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Riwayat Perkembangan Valuasi Lokasi Penelitian</h4>
                <p className="text-[11px] text-slate-500">Perbandingan riwayat hasil studi terdahulu dengan penelitian saat ini</p>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                Tren Positif
              </span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.historicalTimeline.map(h => ({ year: String(h.year), tevMiliar: Number((h.tev / 1e9).toFixed(2)) }))} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(val) => [`Rp ${val} Miliar`, 'TEV']} />
                  <Line
                    type="monotone"
                    dataKey="tevMiliar"
                    name="TEV (Miliar Rp)"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <History className="w-6 h-6 stroke-1" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Belum Ada Riwayat Penelitian
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-3">
              Belum ditemukan penelitian sebelumnya pada area ini ({data.landCovers[0]?.name || 'Mangrove Lebat (Tahura Ngurah Rai)'}). Perbandingan antar tahun akan tersedia secara otomatis setelah terdapat data penelitian historis yang terverifikasi.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-slate-200 text-[11px] text-slate-600 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Indikator nilai ekonomi di atas tetap dihitung berdasarkan data penelitian aktif saat ini ({formatNumber(totalAreaHa, 1)} Ha).</span>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* HASIL AKHIR PENELITIAN: TOTAL ECONOMIC VALUE BANNER */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest font-mono text-blue-300 font-semibold">
                Hasil Akhir Penelitian Valuasi Sumberdaya Alam
              </span>
            </div>
            <h2 className="text-sm text-slate-300">TOTAL ECONOMIC VALUE (TEV):</h2>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-white tracking-tight">
              {formatIDR(data.grandTev)}
            </div>
            <p className="text-xs text-slate-300 max-w-xl pt-1">
              Nilai ekonomi per hektar: <strong className="text-white font-mono">{formatIDR(data.tevPerHa)} / ha</strong> pada kawasan seluas <strong className="text-white">{data.spatial.totalAreaHa} ha</strong>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs space-y-2 shrink-0 max-w-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Status Penjaminan Mutu</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Analyst dapat mencatat telaah menggunakan toolbar di atas dan meninjau seluruh parameter sebelum memberikan persetujuan final.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
