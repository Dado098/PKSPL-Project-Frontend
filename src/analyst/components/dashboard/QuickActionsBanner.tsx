import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ListFilter, ArrowRight, ShieldCheck } from 'lucide-react';

interface QuickActionsBannerProps {
  waitingReviewCount: number;
}

export const QuickActionsBanner: React.FC<QuickActionsBannerProps> = ({ waitingReviewCount }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Banner Left Info */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-blue-200">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Workspace Quality Control & Review Analyst</span>
          </h2>
          <p className="text-xs text-blue-150 text-blue-100/80 mt-0.5 max-w-xl">
            Terdapat <strong className="text-white underline">{waitingReviewCount} proyek penelitian</strong> dalam status Siap Review yang menunggu telaah dan verifikasi parameter valuasi ekonomi Anda.
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        <button
          onClick={() => navigate('/analyst/projects?status=SIAP_REVIEW')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Review Proyek ({waitingReviewCount})</span>
        </button>

        <button
          onClick={() => navigate('/analyst/projects')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold transition-colors"
        >
          <ListFilter className="w-4 h-4" />
          <span>Lihat Semua Proyek</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
