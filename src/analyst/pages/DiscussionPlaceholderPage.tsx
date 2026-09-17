import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Info, Users, Clock } from 'lucide-react';

export const DiscussionPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Forum Diskusi & Chat Review
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kanal komunikasi langsung per proyek antara Analyst dan Peneliti.
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

      {/* Info Callout */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-purple-900 leading-relaxed">
          <h4 className="font-bold text-sm text-purple-950 mb-0.5">
            Kanal Diskusi Terpadu (Fase Pengembangan)
          </h4>
          <p className="text-purple-800/90">
            Sistem chat kontekstual per proyek valuasi ekonomi antara <strong>Analyst</strong> dan <strong>Peneliti</strong> beserta integrasi thread review akan diimplementasikan pada fase berikutnya sesuai batasan task.
          </p>
        </div>
      </div>

      {/* Empty State Showcase */}
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Belum Ada Thread Diskusi Aktif
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          Kanal diskusi otomatis terbentuk ketika Analyst memberikan catatan telaah atau perbaikan pada suatu proyek penelitian.
        </p>
        <button
          onClick={() => navigate('/analyst/projects')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
        >
          Lihat Proyek untuk Direview
        </button>
      </div>
    </div>
  );
};
