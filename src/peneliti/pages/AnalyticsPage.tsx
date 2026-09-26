import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { formatIDR, formatNumber } from '../utils/formatter';
import { getHistoricalStudiesForArea } from '../mock/historicalAnalyticsMock';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { EcosystemServiceId } from '../types/valuation';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  TrendingDown,
  Filter,
  Layers,
  ArrowRight,
  Calculator,
  History,
  Calendar,
  Sparkles,
  Info,
  Scale,
  CheckCircle2,
  MapPin,
  Package,
  Wind,
  Leaf,
  Music,
  TableProperties,
  ChevronDown,
  Hash
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,

} from 'recharts';

// ─── Konstanta jasa ekosistem ───────────────────────────────────────────────
const SERVICE_META = {
  provisioning: {
    id: 'provisioning' as EcosystemServiceId,
    code: 'A',
    label: 'Provisioning Services',
    short: 'Provisioning',
    desc: 'Hasil panen komoditas & biomassa vegetasi',
    color: '#0e7490',
    bgClass: 'bg-cyan-50/70',
    borderClass: 'border-cyan-200/80',
    textClass: 'text-cyan-900',
    labelClass: 'text-cyan-800',
    icon: Package,
  },
  regulating: {
    id: 'regulating' as EcosystemServiceId,
    code: 'B',
    label: 'Regulating Services',
    short: 'Regulating',
    desc: 'Pencegah abrasi, seawall & serapan karbon biru',
    color: '#2563eb',
    bgClass: 'bg-blue-50/70',
    borderClass: 'border-blue-200/80',
    textClass: 'text-blue-900',
    labelClass: 'text-blue-800',
    icon: Wind,
  },
  supporting: {
    id: 'supporting' as EcosystemServiceId,
    code: 'C',
    label: 'Supporting Services',
    short: 'Supporting',
    desc: 'Habitat asuhan biota & nursery ground',
    color: '#7c3aed',
    bgClass: 'bg-purple-50/70',
    borderClass: 'border-purple-200/80',
    textClass: 'text-purple-900',
    labelClass: 'text-purple-800',
    icon: Leaf,
  },
  cultural: {
    id: 'cultural' as EcosystemServiceId,
    code: 'D',
    label: 'Cultural Services',
    short: 'Cultural',
    desc: 'Ekowisata pesisir & edukasi konservasi',
    color: '#d97706',
    bgClass: 'bg-amber-50/70',
    borderClass: 'border-amber-200/80',
    textClass: 'text-amber-900',
    labelClass: 'text-amber-800',
    icon: Music,
  },
} as const;

const SERVICE_IDS = ['provisioning', 'regulating', 'supporting', 'cultural'] as EcosystemServiceId[];

// ─── Formatter tooltip recharts ─────────────────────────────────────────────
const tooltipIDR = (val: any) => [formatIDR(Number(val)), 'Nilai'];

// ────────────────────────────────────────────────────────────────────────────
const AnalyticsPageContent: React.FC = () => {
  const params = useParams<{ projectId?: string }>();
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    getProjectLandCovers,
    getProjectIndices,
    getAreaConfig,
  } = useProject();
  const { getServiceSubtotal, getGrandTotalForArea, getRows } = useSpreadsheet();
  const navigate = useNavigate();

  // ── Route sync ─────────────────────────────────────────────────────────
  const routeProjId = params.projectId || activeProjectId;
  const currentProject =
    projects.find(p => p.id === routeProjId || p.code === routeProjId) || activeProject;
  const effectiveProjId = currentProject?.id || routeProjId || 'PKS-994KY1';

  useEffect(() => {
    if (params.projectId && params.projectId !== activeProjectId) {
      const found = projects.find(p => p.id === params.projectId || p.code === params.projectId);
      if (found) setActiveProjectId(found.id);
    }
  }, [params.projectId, activeProjectId, projects, setActiveProjectId]);

  // ── Data Spasial ───────────────────────────────────────────────────────
  const allLandCovers = (getProjectLandCovers ? getProjectLandCovers(effectiveProjId) : []) || [];
  const allIndices    = (getProjectIndices   ? getProjectIndices(effectiveProjId)    : []) || [];

  // ── Filter State ───────────────────────────────────────────────────────
  const [filterIndexId,     setFilterIndexId]     = useState<string>('ALL');
  const [filterLandCoverId, setFilterLandCoverId] = useState<string>('ALL');
  const [filterService,     setFilterService]     = useState<string>('ALL');

  // Reset tutupan lahan ketika indeks berubah
  useEffect(() => {
    setFilterLandCoverId('ALL');
  }, [filterIndexId]);

  // Reset ketika proyek berubah
  useEffect(() => {
    setFilterIndexId('ALL');
    setFilterLandCoverId('ALL');
    setFilterService('ALL');
  }, [effectiveProjId]);

  // ── Tutupan lahan sesuai indeks yang dipilih ────────────────────────────
  const landCoversInSelectedIndex = useMemo(() => {
    if (filterIndexId === 'ALL') return allLandCovers;
    const idx = allIndices.find(i => i.id === filterIndexId);
    if (!idx) return allLandCovers;
    // cocokkan via indexId pada polygon
    const matched = allLandCovers.filter(
      lc => lc.indexId === filterIndexId || lc.indexCode === idx.code
    );
    return matched.length > 0 ? matched : allLandCovers;
  }, [filterIndexId, allLandCovers, allIndices]);

  // ── Tutupan lahan relevan (setelah filter tutupan lahan) ───────────────
  const relevantLandCovers = useMemo(() => {
    if (filterLandCoverId === 'ALL') return landCoversInSelectedIndex;
    return landCoversInSelectedIndex.filter(lc => lc.id === filterLandCoverId);
  }, [filterLandCoverId, landCoversInSelectedIndex]);

  const totalAreaHa = relevantLandCovers.reduce((s, lc) => s + (Number(lc.areaHa) || 0), 0);

  // ── Subtotal per jasa (memakai konfigurasi metode per area) ─────────────
  const getSubtotalForService = (sId: EcosystemServiceId): number =>
    relevantLandCovers.reduce((sum, lc) => {
      const cfg = getAreaConfig ? getAreaConfig(lc.id) : null;
      if (cfg?.activeServices && !cfg.activeServices[sId]) return sum;
      if (Array.isArray(lc.activeServices) && !lc.activeServices.includes(sId)) return sum;
      const m   = cfg?.selectedMethods?.[sId] || '';
      const sub = getServiceSubtotal(
        effectiveProjId, lc.id, sId, m,
        sId === 'provisioning' ? (cfg?.biota || 'flora') : 'none'
      );
      if (sub > 0) return sum + sub;
      if (Array.isArray(lc.serviceDetails)) {
        const det = lc.serviceDetails.find(d => d.serviceId === sId);
        if (det && det.value > 0) return sum + det.value;
      }
      return sum + (sub || 0);
    }, 0);

  const provTotal = Math.max(0, getSubtotalForService('provisioning'));
  const regTotal  = Math.max(0, getSubtotalForService('regulating'));
  const suppTotal = Math.max(0, getSubtotalForService('supporting'));
  const cultTotal = Math.max(0, getSubtotalForService('cultural'));
  const totalTEV  = provTotal + regTotal + suppTotal + cultTotal;
  const tevPerHa  = totalAreaHa > 0 ? Math.round(totalTEV / totalAreaHa) : 0;

  // ── Kontribusi 4 Jasa ──────────────────────────────────────────────────
  const serviceContributions = SERVICE_IDS.map(sId => {
    const meta  = SERVICE_META[sId];
    const nominal = sId === 'provisioning' ? provTotal
                  : sId === 'regulating'   ? regTotal
                  : sId === 'supporting'   ? suppTotal
                  : cultTotal;
    return {
      ...meta,
      nominal,
      percentage: totalTEV > 0 ? (nominal / totalTEV) * 100 : 0,
    };
  });

  const sortedServices  = [...serviceContributions].sort((a, b) => b.nominal - a.nominal);
  const highestService  = sortedServices[0]?.nominal > 0
    ? sortedServices[0]
    : { label: 'Belum Ada', percentage: 0, nominal: 0, code: '-', short: '-' };

  // ── Data chart perbandingan jasa (bisa di-filter per jasa) ─────────────
  const allServicesBarData = serviceContributions.map(s => ({
    id: s.id, name: s.short, nominal: s.nominal, fill: s.color,
  }));
  const serviceComparisonData = filterService === 'ALL'
    ? allServicesBarData
    : allServicesBarData.filter(s => s.id === filterService);

  // ── Data chart per area tutupan lahan ──────────────────────────────────
  const areaData = allLandCovers.map(lc => {
    const cfg   = getAreaConfig ? getAreaConfig(lc.id) : null;
    let   total = 0;
    if (cfg?.activeServices && cfg?.selectedMethods) {
      total = getGrandTotalForArea(effectiveProjId, lc.id, cfg.activeServices, cfg.selectedMethods, 'flora');
    }
    if (!total && lc.totalValue) total = lc.totalValue;
    return { name: lc.name || 'Area', luas: lc.areaHa || 0, total: Math.max(0, total) };
  });

  const filteredAreaData = filterLandCoverId === 'ALL'
    ? (filterIndexId === 'ALL' ? areaData : areaData.filter(a =>
        landCoversInSelectedIndex.some(lc => lc.name === a.name)
      ))
    : areaData.filter(a =>
        relevantLandCovers.some(lc => lc.name === a.name)
      );

  // ── Ringkasan data input dari alur CalculationPage ────────────────────
  const inputSummary = useMemo(() => {
    return relevantLandCovers.flatMap(lc => {
      const cfg = getAreaConfig ? getAreaConfig(lc.id) : null;
      return SERVICE_IDS.map(sId => {
        const meta    = SERVICE_META[sId];
        const isActive = cfg?.activeServices?.[sId] ?? true;
        const method  = cfg?.selectedMethods?.[sId] || '';
        const biota   = sId === 'provisioning' ? (cfg?.biota || 'flora') : 'none';
        const rows    = getRows(effectiveProjId, lc.id, sId, method, biota);
        const items   = rows
          .filter(r => (r.totalNilai || 0) > 0)
          .map(r => ({
            label : r.item || r.komoditas || r.area || r.fungsiPendukung || r.namaAktivitas || `Baris ${r.no}`,
            value : Number(r.totalNilai) || 0,
          }));
        const subtotal = items.reduce((s, i) => s + i.value, 0);
        return {
          lcId      : lc.id,
          lcName    : lc.name,
          lcAreaHa  : lc.areaHa,
          serviceId : sId,
          serviceMeta: meta,
          method,
          isActive,
          itemCount : items.length,
          items     : items.slice(0, 5),
          hasMore   : items.length > 5,
          subtotal,
        };
      }).filter(d => d.isActive);
    });
  }, [relevantLandCovers, effectiveProjId, getAreaConfig, getRows]);

  // Kelompokkan per jasa untuk tampilan ringkasan
  const inputByService = useMemo(() => {
    return SERVICE_IDS.reduce((acc, sId) => {
      acc[sId] = inputSummary.filter(d => d.serviceId === sId);
      return acc;
    }, {} as Record<EcosystemServiceId, typeof inputSummary>);
  }, [inputSummary]);

  // ── Radar chart data (kontribusi per jasa per area) ────────────────────
  // ── Data Nilai per Metode Valuasi dikelompokkan berdasarkan Jasa Ekosistem ──
  const methodByServiceData = useMemo(() => {
    const list: {
      methodKey: string;
      methodName: string;
      serviceId: EcosystemServiceId;
      serviceCode: string;
      serviceName: string;
      nominal: number;
      fill: string;
      areaCount: number;
    }[] = [];

    const map = new Map<string, {
      methodKey: string;
      methodName: string;
      serviceId: EcosystemServiceId;
      serviceCode: string;
      serviceName: string;
      nominal: number;
      fill: string;
      areas: Set<string>;
    }>();

    relevantLandCovers.forEach(lc => {
      const cfg = getAreaConfig ? getAreaConfig(lc.id) : null;
      SERVICE_IDS.forEach(sId => {
        if (filterService !== 'ALL' && filterService !== sId) return;
        if (cfg?.activeServices && !cfg.activeServices[sId]) return;
        if (Array.isArray(lc.activeServices) && !lc.activeServices.includes(sId)) return;

        const m = cfg?.selectedMethods?.[sId] || 'standard';
        const biota = sId === 'provisioning' ? (cfg?.biota || 'flora') : 'none';
        const sub = getServiceSubtotal(effectiveProjId, lc.id, sId, m, biota);

        // Format method display label
        let displayMethod = m
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        if (m === 'tcm') displayMethod = 'Travel Cost Method (TCM)';
        if (m === 'market-price') displayMethod = `Market Price (${biota === 'fauna' ? 'Fauna' : 'Flora'})`;
        if (m === 'effect-production') displayMethod = 'Effect on Production (EOP)';
        if (m === 'replacement-cost') displayMethod = 'Replacement Cost';
        if (m === 'nursery-ground') displayMethod = 'Nursery Ground';

        const key = `${sId}_${m}_${biota}`;
        if (!map.has(key)) {
          map.set(key, {
            methodKey: key,
            methodName: displayMethod,
            serviceId: sId,
            serviceCode: SERVICE_META[sId].code,
            serviceName: SERVICE_META[sId].short,
            nominal: 0,
            fill: SERVICE_META[sId].color,
            areas: new Set(),
          });
        }

        const entry = map.get(key)!;
        entry.nominal += Math.max(0, sub);
        entry.areas.add(lc.name);
      });
    });

    map.forEach(item => {
      if (item.nominal > 0 || relevantLandCovers.length > 0) {
        list.push({
          methodKey: item.methodKey,
          methodName: item.methodName,
          serviceId: item.serviceId,
          serviceCode: item.serviceCode,
          serviceName: item.serviceName,
          nominal: item.nominal,
          fill: item.fill,
          areaCount: item.areas.size,
        });
      }
    });

    return list.sort((a, b) => a.serviceCode.localeCompare(b.serviceCode) || b.nominal - a.nominal);
  }, [relevantLandCovers, getAreaConfig, filterService, effectiveProjId, getServiceSubtotal]);

  // ── Analitik historis ──────────────────────────────────────────────────
  const targetArea = filterLandCoverId === 'ALL'
    ? (allLandCovers.find(l => l.id === 'poly-1') || allLandCovers[0] || null)
    : allLandCovers.find(l => l.id === filterLandCoverId) || null;

  const historicalStudies = targetArea
    ? getHistoricalStudiesForArea(targetArea.id, targetArea.name, targetArea.code)
    : [];
  const hasHistory = historicalStudies.length > 0;

  const combinedTimeline = hasHistory ? [
    ...historicalStudies.map(s => ({
      id: s.id, year: s.year, studyTitle: s.studyTitle, areaName: s.areaName,
      areaHa: s.areaHa, tev: s.tev, tevPerHa: s.tevPerHa,
      services: s.servicesBreakdown, source: s.institution, isCurrent: false,
    })),
    {
      id: 'CURRENT-2026', year: 2026,
      studyTitle: currentProject?.name || 'Penelitian Saat Ini',
      areaName: targetArea?.name || '-', areaHa: targetArea?.areaHa || totalAreaHa,
      tev: totalTEV, tevPerHa,
      services: { provisioning: provTotal, regulating: regTotal, supporting: suppTotal, cultural: cultTotal },
      source: `PKSPL IPB (${currentProject?.code || effectiveProjId})`,
      isCurrent: true,
    },
  ].sort((a, b) => a.year - b.year) : [];

  const previousStudy = combinedTimeline.length >= 2 ? combinedTimeline[combinedTimeline.length - 2] : null;
  const currentStudy  = combinedTimeline.length > 0  ? combinedTimeline[combinedTimeline.length - 1] : null;
  const tevDiffPct    = (currentStudy && previousStudy && previousStudy.tev > 0)
    ? ((currentStudy.tev - previousStudy.tev) / previousStudy.tev) * 100 : 0;
  const tevDiffNominal     = (currentStudy && previousStudy) ? currentStudy.tev - previousStudy.tev : 0;
  const tevPerHaDiffPct    = (currentStudy && previousStudy && previousStudy.tevPerHa > 0)
    ? ((currentStudy.tevPerHa - previousStudy.tevPerHa) / previousStudy.tevPerHa) * 100 : 0;
  const tevPerHaDiffNominal = (currentStudy && previousStudy) ? currentStudy.tevPerHa - previousStudy.tevPerHa : 0;

  const historicalTevTrendData = combinedTimeline.map(s => ({
    year: String(s.year),
    tevMiliar    : Number((s.tev / 1e9).toFixed(2)),
    tevPerHaJuta : Number((s.tevPerHa / 1e6).toFixed(2)),
    title: s.studyTitle, isCurrent: s.isCurrent,
  }));

  const historicalServiceComparisonData = combinedTimeline.map(s => ({
    year: String(s.year),
    Provisioning: Number(((s.services?.provisioning || 0) / 1e9).toFixed(2)),
    Regulating  : Number(((s.services?.regulating   || 0) / 1e9).toFixed(2)),
    Supporting  : Number(((s.services?.supporting   || 0) / 1e9).toFixed(2)),
    Cultural    : Number(((s.services?.cultural     || 0) / 1e9).toFixed(2)),
  }));

  // ── Guard flags ────────────────────────────────────────────────────────
  const hasAnyValue            = totalTEV > 0;
  const hasServiceComparison   = serviceComparisonData.some(s => s.nominal > 0);
  const hasAreaData            = filteredAreaData.some(a => a.total > 0);
  const hasContributionData    = hasAnyValue && serviceContributions.some(s => s.nominal > 0);
  const hasMethodData          = methodByServiceData.some(m => m.nominal > 0);
  const hasInputSummaryData    = inputSummary.some(d => d.itemCount > 0);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-content-fade-in">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Tahap 08</span><span>•</span>
            <span className="text-blue-600">Visualisasi Eksekutif</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Analitik Valuasi Ekonomi</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Visualisasi distribusi nilai 4 jasa ekosistem, ringkasan data input, dan perbandingan antar periode.
          </p>
        </div>
        <button
          onClick={() => navigate(`/peneliti/projects/${effectiveProjId}/review`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <span>Lanjut ke Review & Laporan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── FILTER BAR ─────────────────────────────────────────────────── */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filter Analitik:</span>
          </div>

          {/* Filter Indeks */}
          <div className="flex items-center gap-1.5">
            <Hash className="w-3 h-3 text-slate-400" />
            <span className="text-slate-500">Indeks:</span>
            <select
              value={filterIndexId}
              onChange={e => setFilterIndexId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Indeks ({allIndices.length})</option>
              {allIndices.map(idx => (
                <option key={idx.id} value={idx.id}>
                  [{idx.code}] {idx.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tutupan Lahan */}
          <div className="flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-slate-400" />
            <span className="text-slate-500">Tutupan Lahan:</span>
            <select
              value={filterLandCoverId}
              onChange={e => setFilterLandCoverId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua ({landCoversInSelectedIndex.length})</option>
              {landCoversInSelectedIndex.map(lc => (
                <option key={lc.id} value={lc.id}>{lc.name} ({formatNumber(lc.areaHa, 2)} Ha)</option>
              ))}
            </select>
          </div>

          {/* Filter Jasa */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Jasa:</span>
            <select
              value={filterService}
              onChange={e => setFilterService(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Jasa (4 Kategori)</option>
              <option value="provisioning">A. Provisioning</option>
              <option value="regulating">B. Regulating</option>
              <option value="supporting">C. Supporting</option>
              <option value="cultural">D. Cultural</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Tersinkronisasi otomatis dari spreadsheet input</span>
        </div>
      </div>

      {/* ── KPI CARDS: 4 Jasa + 1 TEV ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {serviceContributions.map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`p-4 rounded-lg border ${s.bgClass} ${s.borderClass} shadow-2xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:brightness-105 cursor-default group`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${s.labelClass}`}>
                  {s.code}. {s.short}
                </span>
                <Icon className={`w-4 h-4 ${s.labelClass} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`} />
              </div>
              <div className={`text-base font-bold font-mono mt-1.5 ${s.textClass} transition-colors`}>
                {formatIDR(s.nominal)}
              </div>
              <div className={`text-[10px] mt-1 ${s.labelClass} font-medium`}>
                {totalTEV > 0 ? formatNumber(s.percentage, 1) : 0}% dari TEV
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight truncate" title={s.desc}>
                {s.desc}
              </div>
            </div>
          );
        })}

        {/* TEV card */}
        <div className="p-4 rounded-lg border border-blue-400 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm lg:col-span-1 col-span-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:brightness-110 cursor-default group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-100">Total TEV</span>
            <Calculator className="w-4 h-4 text-blue-100 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
          </div>
          <div className="text-base font-bold font-mono mt-1.5 text-white tracking-tight">
            {formatIDR(totalTEV)}
          </div>
          <div className="text-[10px] text-blue-100 mt-1 font-medium">
            Agregasi A + B + C + D
          </div>
          <div className="text-[10px] text-blue-200 mt-0.5">
            {formatIDR(tevPerHa)}/Ha · {formatNumber(totalAreaHa, 2)} Ha
          </div>
        </div>
      </div>

      {/* ── CHARTS GRID: Komposisi & Perbandingan ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Donut komposisi 4 jasa */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600 transition-transform duration-300 hover:rotate-45" />
              <span>1. Komposisi 4 Jasa Ekosistem terhadap TEV</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">100% TEV</span>
          </div>

          <div className="h-56 w-full">
            {hasContributionData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceContributions}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    paddingAngle={3} dataKey="nominal"
                    animationDuration={900}
                    animationEasing="ease-out"
                  >
                    {serviceContributions.map((s, i) => (
                      <Cell key={i} fill={s.color} className="transition-all duration-300 hover:opacity-85 cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipIDR} />
                  <Legend
                    verticalAlign="bottom" height={36} iconType="circle"
                    formatter={val => <span className="text-xs text-slate-600 font-medium">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                <PieIcon className="w-8 h-8 text-slate-300 stroke-1" />
                <span>Belum ada nilai ekonomi</span>
              </div>
            )}
          </div>

          {/* Legend breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
            {serviceContributions.map(s => (
              <div key={s.id} className="p-2 bg-slate-50 rounded border border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300 transition-all duration-200 flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: s.color }} />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{s.code}. {s.short}</div>
                  <div className="font-mono text-slate-500 text-[10px]">{formatIDR(s.nominal)}</div>
                </div>
                <div className="ml-auto font-bold text-slate-900 shrink-0">{formatNumber(s.percentage, 1)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Distribusi Nilai per Metode Valuasi (Dikelompokkan Berdasarkan Service) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600 transition-transform duration-300 hover:rotate-12" />
              <span>2. Nilai per Metode Valuasi (Berdasarkan Jasa)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Miliar Rupiah</span>
          </div>

          <div className="h-56 w-full">
            {hasMethodData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={methodByServiceData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
                >
                  <XAxis
                    dataKey="methodName"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tickFormatter={v => `${(v / 1e9).toFixed(0)} M`}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      formatIDR(Number(val)),
                      `${item.payload.serviceCode}. ${item.payload.serviceName}`,
                    ]}
                    labelFormatter={(label) => `Metode: ${label}`}
                  />
                  <Bar dataKey="nominal" radius={[4, 4, 0, 0]} animationDuration={1000} animationEasing="ease-out">
                    {methodByServiceData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} className="transition-all duration-300 hover:opacity-85 cursor-pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                <Calculator className="w-8 h-8 text-slate-300 stroke-1" />
                <span>Belum ada nominal per metode valuasi</span>
              </div>
            )}
          </div>

          {/* Breakdown metode per service */}
          <div className="pt-2 border-t border-slate-100 mt-auto">
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              {SERVICE_IDS.map(sId => {
                const meta = SERVICE_META[sId];
                const count = methodByServiceData.filter(m => m.serviceId === sId).length;
                if (count === 0) return null;
                return (
                  <span
                    key={sId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium border transition-all duration-200 hover:scale-105 cursor-default"
                    style={{
                      borderColor: `${meta.color}40`,
                      backgroundColor: `${meta.color}10`,
                      color: meta.color,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    <span>{meta.code}. {meta.short} ({count} metode)</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── CHART 3: Distribusi per area ──────────────────────────────── */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 transition-transform duration-300 hover:scale-110" />
            <span>3. Distribusi Nilai Ekonomi per Area Tutupan Lahan</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Komparasi Antar Poligon</span>
        </div>

        <div className="h-64 w-full">
          {hasAreaData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredAreaData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
                <XAxis type="number" tickFormatter={v => `${(v / 1e9).toFixed(0)} M`} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={130} />
                <Tooltip formatter={tooltipIDR} />
                <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} animationDuration={1000} animationEasing="ease-out" className="transition-all duration-300 hover:opacity-85" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <Layers className="w-8 h-8 text-slate-300 stroke-1" />
              <span>Belum ada data nilai tutupan lahan</span>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION: RINGKASAN DATA INPUT ─────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-200/60">
                Data Input Penelitian
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TableProperties className="w-5 h-5 text-emerald-600" />
                <span>Ringkasan Objek yang Diinput per Jasa &amp; Metode</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rekap data yang telah dimasukkan pada CalculationPage — setiap jasa, metode, dan item yang digunakan.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2 self-start sm:self-auto">
            <span className="font-semibold text-slate-700">Area:</span>
            <span>{filterLandCoverId === 'ALL' ? (filterIndexId === 'ALL' ? 'Seluruh Area' : `Indeks terpilih`) : relevantLandCovers[0]?.name} ({formatNumber(totalAreaHa, 2)} Ha)</span>
          </div>
        </div>

        {hasInputSummaryData ? (
          <div className="space-y-4">
            {SERVICE_IDS.map(sId => {
              const meta    = SERVICE_META[sId];
              const entries = inputByService[sId] || [];
              if (entries.length === 0) return null;
              const Icon = meta.icon;
              const totalItems = entries.reduce((s, e) => s + e.itemCount, 0);
              const totalVal   = entries.reduce((s, e) => s + e.subtotal, 0);

              return (
                <div key={sId} className={`rounded-lg border ${meta.borderClass} overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300`}>
                  {/* Header jasa */}
                  <div className={`px-4 py-2.5 flex items-center justify-between ${meta.bgClass} transition-colors`}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${meta.labelClass} transition-transform duration-300 hover:rotate-6 hover:scale-110`} />
                      <span className={`font-bold text-sm ${meta.textClass}`}>
                        {meta.code}. {meta.label}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${meta.labelClass} bg-white/60 border ${meta.borderClass}`}>
                        {totalItems} item
                      </span>
                    </div>
                    <span className={`font-mono font-bold text-sm ${meta.textClass}`}>
                      {formatIDR(totalVal)}
                    </span>
                  </div>

                  {/* Per land cover */}
                  <div className="divide-y divide-slate-100">
                    {entries.map((entry, eIdx) => (
                      <div key={eIdx} className="px-4 py-3 bg-white">
                        <div className="flex items-center justify-between mb-2 text-xs">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-700">{entry.lcName}</span>
                            <span className="text-slate-400">{formatNumber(entry.lcAreaHa, 2)} Ha</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                              Metode: {entry.method || '—'}
                            </span>
                            <span className="font-mono font-bold text-slate-800 text-xs">
                              {formatIDR(entry.subtotal)}
                            </span>
                          </div>
                        </div>

                        {entry.itemCount > 0 ? (
                          <div className="space-y-1">
                            {entry.items.map((item, iIdx) => (
                              <div
                                key={iIdx}
                                className="flex items-center justify-between text-[11px] bg-slate-50 hover:bg-slate-100/90 rounded px-2.5 py-1.5 transition-all duration-200 hover:translate-x-1"
                              >
                                <span className="text-slate-700 font-medium truncate max-w-[60%]" title={item.label}>
                                  {iIdx + 1}. {item.label}
                                </span>
                                <span className="font-mono text-slate-800 font-semibold shrink-0">
                                  {formatIDR(item.value)}
                                </span>
                              </div>
                            ))}
                            {entry.hasMore && (
                              <div className="text-[10px] text-slate-400 text-center pt-1">
                                + {entry.items.length > 5 ? '…' : ''} (tampilkan di CalculationPage)
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">Belum ada data input untuk area ini.</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-xs">
            <TableProperties className="w-10 h-10 mx-auto mb-2 stroke-1 text-slate-300" />
            <p>Belum ada data input yang terdeteksi dari CalculationPage.</p>
            <p className="mt-1">Masukkan data pada tahap Perhitungan untuk melihat ringkasan di sini.</p>
          </div>
        )}

        {/* Info box */}
        <div className="p-2.5 bg-blue-50/80 rounded border border-blue-200/60 text-[11px] text-blue-800 flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <span>
            TEV = Provisioning ({formatNumber(totalTEV > 0 ? (provTotal / totalTEV) * 100 : 0, 1)}%)
            + Regulating ({formatNumber(totalTEV > 0 ? (regTotal / totalTEV) * 100 : 0, 1)}%)
            + Supporting ({formatNumber(totalTEV > 0 ? (suppTotal / totalTEV) * 100 : 0, 1)}%)
            + Cultural ({formatNumber(totalTEV > 0 ? (cultTotal / totalTEV) * 100 : 0, 1)}%)
            = <strong>{formatIDR(totalTEV)}</strong>.
            Dihitung langsung dari hasil input spreadsheet valuasi per area tutupan lahan.
          </span>
        </div>
      </div>

      {/* ── SECTION: INDIKATOR NILAI EKONOMI ──────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-200/60">
              Indikator Utama
            </span>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>Indikator Nilai Ekonomi</span>
            </h2>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2">
            <span className="font-semibold text-slate-700">Area Terhitung:</span>
            <span>{filterLandCoverId === 'ALL' ? 'Seluruh Area' : relevantLandCovers[0]?.name} ({formatNumber(totalAreaHa, 2)} Ha)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TEV/Ha */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/30 p-4 rounded-lg border border-emerald-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Nilai Ekonomi per Ha</span>
              <Scale className="w-4 h-4 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <div className="text-xl font-bold text-emerald-950 font-mono mt-1.5">
              {formatIDR(tevPerHa)} <span className="text-xs font-semibold text-emerald-700">/ Ha</span>
            </div>
            <p className="text-[11px] text-emerald-700/90 mt-1 leading-snug">
              Total Economic Value dibanding luas ({formatNumber(totalAreaHa, 2)} Ha)
            </p>
          </div>

          {/* Jasa dominan */}
          <div className="bg-gradient-to-br from-cyan-50/70 to-blue-50/30 p-4 rounded-lg border border-cyan-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider">Jasa Dominan</span>
              <Sparkles className="w-4 h-4 text-cyan-600 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            </div>
            <div className="text-xl font-bold text-cyan-950 font-mono mt-1.5">
              {formatNumber(highestService.percentage, 1)}%
            </div>
            <p className="text-[11px] text-cyan-700/90 mt-1 leading-snug">
              Dipimpin oleh <strong>{highestService.label || highestService.short}</strong>{' '}
              ({formatIDR(highestService.nominal)})
            </p>
          </div>

          {/* Distribusi jasa */}
          <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/30 p-4 rounded-lg border border-purple-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Distribusi Jasa</span>
              <PieIcon className="w-4 h-4 text-purple-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45" />
            </div>
            <div className="mt-2 space-y-1">
              {serviceContributions.map(s => (
                <div key={s.id} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600 truncate flex-1">{s.short}</span>
                  <div className="h-1.5 rounded-full flex-1 bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-700 w-8 text-right shrink-0">
                    {formatNumber(s.percentage, 0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: ANALITIK HISTORIS ─────────────────────────────────── */}
      {!hasHistory ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Belum Ada Riwayat Penelitian</h3>
          <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto mt-1.5 leading-relaxed">
            Belum ditemukan penelitian sebelumnya pada area ini ({targetArea?.name || 'Area Baru'}).
            Perbandingan antar tahun tersedia otomatis setelah ada data historis terverifikasi.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 mt-4 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Indikator nilai ekonomi tetap dihitung berdasarkan data penelitian aktif ({formatNumber(totalAreaHa, 2)} Ha).</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-200/60">
                  Time-Series Multi-Tahun
                </span>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  <span>Perbandingan Historis: {targetArea?.name}</span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Evolusi Total Economic Value lintas periode survei pada tutupan lahan yang sama.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lokasi: <strong>{targetArea?.name} ({targetArea?.code || 'TL-MG-01'})</strong></span>
            </div>
          </div>

          {/* KPI perubahan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Perubahan TEV</span>
                {tevDiffPct >= 0
                  ? <TrendingUp className="w-4 h-4 text-emerald-600" />
                  : <TrendingDown className="w-4 h-4 text-rose-600" />}
              </div>
              <div className={`text-2xl font-bold font-mono mt-1 ${tevDiffPct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {tevDiffPct >= 0 ? '+' : ''}{formatNumber(tevDiffPct, 2)}%
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                {tevDiffNominal >= 0 ? '+' : ''}{formatIDR(tevDiffNominal)} vs survei {previousStudy?.year}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pertumbuhan / Ha</span>
                {tevPerHaDiffPct >= 0
                  ? <TrendingUp className="w-4 h-4 text-emerald-600" />
                  : <TrendingDown className="w-4 h-4 text-rose-600" />}
              </div>
              <div className={`text-2xl font-bold font-mono mt-1 ${tevPerHaDiffPct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {tevPerHaDiffPct >= 0 ? '+' : ''}{formatNumber(tevPerHaDiffPct, 2)}%
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                {tevPerHaDiffNominal >= 0 ? '+' : ''}{formatIDR(tevPerHaDiffNominal)}/Ha vs {previousStudy?.year}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Periode Penelitian</span>
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {combinedTimeline.length} Periode
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Tahun: {combinedTimeline.map(s => s.year).join(', ')}
              </div>
            </div>
          </div>

          {/* Tabel rekam jejak */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex justify-between">
              <span>Rekam Jejak Penelitian Lokasi</span>
              <span className="text-slate-500 font-normal lowercase">terurut berdasarkan tahun</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3 w-20 text-center">Tahun</th>
                    <th className="py-2.5 px-3">Judul Penelitian</th>
                    <th className="py-2.5 px-3 w-32">Area</th>
                    <th className="py-2.5 px-3 w-24 text-right">Luas</th>
                    <th className="py-2.5 px-3 text-right">Total TEV</th>
                    <th className="py-2.5 px-3 text-right">Nilai / Ha</th>
                    <th className="py-2.5 px-3">Sumber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {combinedTimeline.map(study => (
                    <tr key={study.id} className={`hover:bg-slate-50/80 transition-colors ${study.isCurrent ? 'bg-blue-50/60 font-semibold' : ''}`}>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 font-mono">{study.year}</td>
                      <td className="py-2.5 px-3 text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{study.studyTitle}</span>
                          {study.isCurrent && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold uppercase shadow-2xs">Saat Ini</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{study.areaName}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">{formatNumber(study.areaHa, 2)} Ha</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatIDR(study.tev)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-semibold">{formatIDR(study.tevPerHa)}/Ha</td>
                      <td className="py-2.5 px-3 text-slate-500 truncate max-w-[200px]" title={study.source}>{study.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Time-series charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Perkembangan Total Economic Value</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Miliar Rp</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalTevTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => `${v} M`} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: any) => [`Rp ${formatNumber(val, 2)} Miliar`, 'TEV']}
                      labelFormatter={l => `Tahun Survei ${l}`}
                    />
                    <Line type="monotone" dataKey="tevMiliar" stroke="#2563eb" strokeWidth={3}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      dot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="p-2.5 bg-blue-50/70 rounded text-xs text-blue-800 border border-blue-200/60 mt-auto">
                TEV meningkat dari <strong>Rp 18,00 M (2022)</strong> menjadi <strong>{formatIDR(totalTEV)} (2026)</strong>.
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600 transition-transform duration-300 hover:rotate-12" />
                  <span>Perkembangan Nilai per Ha</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Juta Rp / Ha</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalTevTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => `${v} jt`} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: any) => [`Rp ${formatNumber(val, 2)} Juta/Ha`, 'Intensitas']}
                      labelFormatter={l => `Tahun Survei ${l}`}
                    />
                    <Line type="monotone" dataKey="tevPerHaJuta" stroke="#059669" strokeWidth={3}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      dot={{ r: 6, fill: '#047857', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="p-2.5 bg-emerald-50/70 rounded text-xs text-emerald-800 border border-emerald-200/60 mt-auto">
                Intensitas per hektare meningkat dari <strong>Rp 225,00 jt/Ha</strong> menjadi <strong>{formatIDR(tevPerHa)}/Ha</strong>.
              </div>
            </div>
          </div>

          {/* Grouped bar historis per jasa */}
          <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:scale-110" />
                <span>Perubahan Komposisi Jasa Ekosistem Antar Tahun</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Miliar Rp per Jasa</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalServiceComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${v} M`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [`Rp ${formatNumber(v, 2)} Miliar`, '']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Bar dataKey="Provisioning" fill="#0e7490" radius={[3, 3, 0, 0]} animationDuration={1000} animationEasing="ease-out" />
                  <Bar dataKey="Regulating"   fill="#2563eb" radius={[3, 3, 0, 0]} animationDuration={1000} animationEasing="ease-out" />
                  <Bar dataKey="Supporting"   fill="#7c3aed" radius={[3, 3, 0, 0]} animationDuration={1000} animationEasing="ease-out" />
                  <Bar dataKey="Cultural"     fill="#d97706" radius={[3, 3, 0, 0]} animationDuration={1000} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── NEXT STEP BANNER ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Tahap Selanjutnya • Langkah 09</div>
          <div className="text-sm font-semibold text-white mt-0.5">Evaluasi Kelayakan & Pengajuan Laporan ke Analyst</div>
          <p className="text-xs text-slate-300 mt-1">
            Lakukan pengecekan checklist kepatuhan, ekspor PDF/Excel, dan ajukan ke Analyst untuk validasi akhir.
          </p>
        </div>
        <button
          onClick={() => navigate(`/peneliti/projects/${effectiveProjId}/review`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <span>Lanjut ke 09 Review & Laporan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AnalyticsPage: React.FC = () => (
  <ErrorBoundary
    fallbackTitle="Terjadi masalah saat memuat Analitik & Visualisasi."
    fallbackMessage="Komponen analitik mengalami kendala render. Silakan coba muat ulang halaman atau pilih proyek lain."
  >
    <AnalyticsPageContent />
  </ErrorBoundary>
);

export default AnalyticsPage;
