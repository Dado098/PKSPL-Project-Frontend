import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Map,
  Compass,
  Database,
  Layers,
  Coins,
  Calculator,
  BarChart3,
  FileText,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  FolderKanban,
  User,
  MapPin,
  Clock
} from 'lucide-react';
import { StatusBadge } from './common/StatusBadge';
import { formatIDR, formatNumber } from '../utils/formatter';

export const ProjectModulesModal = ({ isOpen, onClose, project }) => {
  const navigate = useNavigate();

  if (!isOpen || !project) return null;

  const effectiveId = project.id || project.code || 'PRJ-001';
  const effectiveCode = project.code || project.kode_proyek || effectiveId;

  const modules = [
    {
      step: '01',
      title: 'Peta & Spasial GIS',
      description: 'Pemetaan batas wilayah, layer spasial, poligon tutupan lahan, dan berkas SHP/GeoJSON.',
      path: `/peneliti/projects/${effectiveId}/maps`,
      icon: Map,
      color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400',
      badge: 'Spasial GIS'
    },
    {
      step: '02',
      title: 'Indeks Kawasan',
      description: 'Pengelolaan indeks kawasan pesisir, keterhubungan poligon tutupan lahan, dan luas area.',
      path: `/peneliti/projects/${effectiveId}/index`,
      icon: Compass,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200 hover:border-cyan-400',
      badge: 'Zonasi'
    },
    {
      step: '03',
      title: 'Data Master',
      description: 'Penyusunan data referensi biofisik tutupan lahan, kerapatan vegetasi, dan faktor konversi.',
      path: `/peneliti/projects/${effectiveId}/data-master`,
      icon: Database,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:border-indigo-400',
      badge: 'Biofisik'
    },
    {
      step: '04',
      title: 'Jasa & Metode Valuasi',
      description: 'Identifikasi 4 dimensi jasa ekosistem (CICES) dan penetapan metode valuasi ekonomi.',
      path: `/peneliti/projects/${effectiveId}/services-methods`,
      icon: Layers,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      badge: 'CICES'
    },
    {
      step: '05',
      title: 'Input Data Valuasi',
      description: 'Pengisian parameter harga pasar, survei biaya perjalanan (TCM), dan kesediaan membayar (CVM).',
      path: `/peneliti/projects/${effectiveId}/valuation-data`,
      icon: Coins,
      color: 'text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-400',
      badge: 'Survei'
    },
    {
      step: '06',
      title: 'Perhitungan (TEV)',
      description: 'Kalkulasi matriks Total Economic Value: Direct, Indirect, Option, Existence, dan Bequest Use Value.',
      path: `/peneliti/projects/${effectiveId}/calculation`,
      icon: Calculator,
      color: 'text-violet-600 bg-violet-50 border-violet-200 hover:border-violet-400',
      badge: 'Kalkulasi'
    },
    {
      step: '07',
      title: 'Analitik & Visualisasi',
      description: 'Grafik interaktif distribusi nilai valuasi, kontribusi jasa ekosistem, dan ringkasan eksekutif.',
      path: `/peneliti/projects/${effectiveId}/analytics`,
      icon: BarChart3,
      color: 'text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-400',
      badge: 'Visualisasi'
    },
    {
      step: '08',
      title: 'Review & Laporan',
      description: 'Lembar validasi dokumen akhir, telaah komprehensif, pencetakan dokumen resmi, dan ekspor PDF.',
      path: `/peneliti/projects/${effectiveId}/review`,
      icon: FileText,
      color: 'text-teal-600 bg-teal-50 border-teal-200 hover:border-teal-400',
      badge: 'Laporan'
    },
    {
      step: '09',
      title: 'Pusat Pesan & Diskusi',
      description: 'Thread obrolan real-time antara Peneliti Utama dan Tim Quality Analyst terkait telaah data.',
      path: `/peneliti/projects/${effectiveId}/messages`,
      icon: MessageSquare,
      color: 'text-sky-600 bg-sky-50 border-sky-200 hover:border-sky-400',
      badge: 'Chat'
    },
    {
      step: 'QA',
      title: 'Lembar Review Quality Analyst',
      description: 'Workspace telaah mutu khusus analis untuk verifikasi layer spasial, catatan revisi, dan validasi final.',
      path: `/analyst/projects/${effectiveCode || effectiveId}`,
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-200 hover:border-purple-400',
      badge: 'Khusus Analyst'
    }
  ];

  const handleLaunchModule = (path) => {
    try {
      localStorage.setItem('pkspl_active_project_id', String(project.id));
      localStorage.setItem('pkspl_active_project_code', String(effectiveCode));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('pkspl_active_project_changed', {
            detail: { id: project.id, code: effectiveCode }
          })
        );
      }
    } catch {
      // ignore
    }

    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  {effectiveCode}
                </span>
                <StatusBadge status={project.status} size="sm" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1 leading-snug">
                {project.name}
              </h2>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-300 mt-1.5">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>{project.lead || 'Peneliti PKSPL'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[200px]">{project.location || 'Indonesia'}</span>
                </span>
                <span className="font-semibold text-white bg-slate-800/80 px-2 py-0.5 rounded">
                  Luas: {formatNumber(project.areaHa || 100)} Ha
                </span>
                <span className="font-bold text-emerald-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  TEV: {formatIDR(project.totalTev || 0)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader / Instructions */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span>Pilih modul alur kerja penelitian untuk membuka atau menelaah data proyek:</span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">10 Modul Tersedia</span>
        </div>

        {/* Modules Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.step}
                onClick={() => handleLaunchModule(m.path)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 bg-white hover:bg-slate-50/80 shadow-2xs hover:shadow-sm ${m.color.split(' ')[2]}`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold font-mono text-slate-400">{m.step}</span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                        {m.title}
                      </h4>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-blue-600 group-hover:text-blue-700">
                    <span className="flex items-center gap-1">
                      <span>Buka Modul</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            Akses Administrator &bull; Data tersinkronisasi otomatis dengan database proyek
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModulesModal;
