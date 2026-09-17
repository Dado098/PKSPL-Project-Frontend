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
  Scale
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
  const formatIDR = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  // Chart data for Analitik & Visualisasi
  const compositionData = data.calculations.map((c, i) => ({
    name: c.serviceName.split(' ')[0],
    value: c.subtotalNominal,
    color: PIE_COLORS[i % PIE_COLORS.length]
  }));

  const serviceBarData = data.calculations.map((c) => ({
    name: c.serviceName.split(' ')[0],
    subtotal: Number((c.subtotalNominal / 1e9).toFixed(2)),
    percentage: c.contributionPct
  }));

  const historicalLineData = data.historicalTimeline.map((h) => ({
    year: String(h.year),
    tevMiliar: Number((h.tev / 1e9).toFixed(2)),
    tevPerHaJuta: Number((h.tevPerHa / 1e6).toFixed(2)),
    isCurrent: h.isCurrent
  }));

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
      <ValuationSection onOpenSectionComment={onOpenSectionComment} />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donut Chart: Komposisi Nilai */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Komposisi Nilai Guna (Direct vs Indirect)</h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip formatter={(val) => [formatIDR(Number(val)), 'Subtotal']} />
                  <Pie
                    data={compositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {compositionData.map((e, idx) => (
                      <Cell key={idx} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px] pt-2 border-t border-slate-200/80">
              {compositionData.map((e) => (
                <div key={e.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                  <span className="text-slate-600 font-medium">{e.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart: Nilai per Jasa Ekosistem */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Nilai per Kategori Jasa Ekosistem (Miliar Rp)</h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip formatter={(val) => [`Rp ${val} Miliar`, 'Nilai']} />
                  <Bar dataKey="subtotal" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-200/80">
              Jasa Penyediaan & Pengaturan mencakup lebih dari 71% total nilai.
            </div>
          </div>
        </div>

        {/* Line Chart: Riwayat Perkembangan TEV */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Riwayat Perkembangan Valuasi Lokasi Penelitian</h4>
              <p className="text-[11px] text-slate-500">Perbandingan hasil studi tahun 2018, 2022, dan penelitian saat ini (2026)</p>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              Tren Positif
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalLineData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
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
