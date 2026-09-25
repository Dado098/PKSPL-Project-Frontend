import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AttentionProject } from '../../types/analystDashboard';
import { StatusBadge } from '../common/StatusBadge';
import {
  AlertCircle,
  Eye,
  ArrowRight,
  User,
  Clock,
  Layers
} from 'lucide-react';

interface AttentionProjectsTableProps {
  projects: AttentionProject[];
}

export const AttentionProjectsTable: React.FC<AttentionProjectsTableProps> = ({ projects }) => {
  const navigate = useNavigate();

  // Sorting otomatis: Prioritaskan SIAP_REVIEW di paling atas
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.status === 'SIAP_REVIEW' && b.status !== 'SIAP_REVIEW') return -1;
    if (a.status !== 'SIAP_REVIEW' && b.status === 'SIAP_REVIEW') return 1;
    return 0;
  });

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">Semua Proyek Selesai Ditangani</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Tidak ada antrean proyek yang mendesak atau membutuhkan tindakan saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
      {/* Section Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Proyek Membutuhkan Perhatian
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-full">
              {sortedProjects.filter(p => p.status === 'SIAP_REVIEW').length} Antrean Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar proyek prioritas yang menunggu review atau verifikasi perbaikan
          </p>
        </div>

        <button
          onClick={() => navigate('/analyst/projects')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>Lihat Semua Proyek</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Responsive Table with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Kode Proyek</th>
              <th className="py-3 px-4 min-w-[220px]">Nama Penelitian</th>
              <th className="py-3 px-4 min-w-[180px]">Peneliti</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 min-w-[140px]">Terakhir Diperbarui</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {sortedProjects.map((proj) => {
              const isUrgent = proj.status === 'SIAP_REVIEW';

              return (
                <tr
                  key={proj.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isUrgent ? 'bg-blue-50/20' : ''
                  }`}
                >
                  {/* Kode Proyek */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {isUrgent && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" title="Prioritas Tinggi" />
                      )}
                      <span>{proj.code}</span>
                    </div>
                  </td>

                  {/* Nama Penelitian */}
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div className="truncate max-w-xs md:max-w-md" title={proj.name}>
                      {proj.name}
                    </div>
                    {proj.attentionReason && (
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs md:max-w-md">
                        {proj.attentionReason}
                      </div>
                    )}
                  </td>

                  {/* Peneliti */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="truncate max-w-[160px]" title={proj.lead}>
                        {proj.lead}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={proj.status} size="sm" />
                    {proj.status === 'DALAM_REVIEW' && (
                      <div className="text-[10px] text-purple-700 font-semibold mt-1 truncate max-w-[150px]" title={proj.reviewedBy || 'Dr. Benny Nababan'}>
                        Oleh: {proj.reviewedBy || 'Dr. Benny Nababan'}
                      </div>
                    )}
                    {proj.status === 'REVISI' && (
                      <div className="text-[10px] text-rose-700 font-semibold mt-1 truncate max-w-[150px]" title={proj.reviewedBy || 'Dr. Benny Nababan'}>
                        Revisi: {proj.reviewedBy || 'Dr. Benny Nababan'}
                      </div>
                    )}
                  </td>

                  {/* Terakhir Diperbarui */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{proj.relativeTime}</span>
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {proj.actionRequired === 'Review' ? (
                      <button
                        onClick={() => navigate(`/analyst/projects/${proj.id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/analyst/projects/${proj.id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
