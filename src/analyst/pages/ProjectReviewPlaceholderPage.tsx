import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ClipboardCheck,
  Search,
  Filter,
  ArrowLeft,
  Info,
  Clock,
  Layers,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MOCK_ATTENTION_PROJECTS } from '../mock/analystDashboardMock';

export const ProjectReviewPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'Semua Status';
  const projectCode = searchParams.get('code');

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span
              onClick={() => navigate('/analyst/dashboard')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Review Proyek</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Review Proyek Penelitian
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh proyek penelitian yang diajukan Peneliti untuk proses penjaminan mutu dan telaah valuasi.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyst/dashboard')}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg self-start sm:self-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>

      {/* Info Callout Banner - Fase Berikutnya */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-blue-900 leading-relaxed">
          <h4 className="font-bold text-sm text-blue-950 mb-0.5">
            Halaman Navigasi Terpadu (Fase Pengembangan)
          </h4>
          <p className="text-blue-800/90">
            Fitur <strong>Detail Review Proyek</strong>, visualisasi <strong>Peta Spasial/GIS</strong>, <strong>Tools Anotasi & Coretan</strong>, serta sistem <strong>Komentar Bertingkat</strong> akan diimplementasikan secara penuh pada fase berikutnya sesuai arahan task.
          </p>
          {projectCode && (
            <div className="mt-2 text-blue-900 font-medium">
              Proyek yang dipilih dari Dashboard: <span className="font-mono font-bold bg-blue-100 px-1.5 py-0.5 rounded">{projectCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Bar Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode proyek, judul penelitian, atau nama peneliti..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            defaultValue={projectCode || ''}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Aktif:</span>
            <strong className="text-slate-800">{statusFilter}</strong>
          </div>
        </div>
      </div>

      {/* Placeholder Project Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ATTENTION_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {proj.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">{proj.name}</h3>
              </div>
              <StatusBadge status={proj.status} size="sm" />
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Peneliti:</span>
                <span className="font-medium text-slate-700">{proj.lead}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Ekosistem:</span>
                <span className="font-medium text-slate-700">{proj.ecosystem}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Terakhir Diperbarui:</span>
                <span>{proj.updatedAt}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                {proj.attentionReason}
              </span>
              <button
                onClick={() => navigate(`/analyst/projects/${proj.id}`)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
