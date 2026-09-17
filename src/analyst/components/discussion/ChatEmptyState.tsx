import React from 'react';
import { MessageSquare, ShieldCheck, UserCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { ResearcherUser } from '../../types/discussion';

interface ChatEmptyStateProps {
  researchers: ResearcherUser[];
  onSelectResearcher: (researcherId: string) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  researchers,
  onSelectResearcher
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-slate-50/50">
      <div className="max-w-md flex flex-col items-center">
        {/* Animated Icon Badge */}
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs ring-2 ring-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-2">
          Ruang Diskusi Langsung Peneliti & Analyst
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Kanal komunikasi <em>one-to-one</em> layaknya aplikasi pesan instan internal PKSPL. Gunakan ruang ini untuk konsultasi metodologi valuasi, klarifikasi batas zonasi data spasial, atau tindak lanjut catatan telaah secara langsung dengan Peneliti.
        </p>

        {/* Quick Suggestion Peneliti */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs text-left">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Mulai Percakapan Cepat:
            </span>
          </div>

          <div className="space-y-2">
            {researchers.slice(0, 3).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectResearcher(r.id)}
                className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 flex items-center justify-between group transition-all text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                      {r.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {r.specialization}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white shrink-0 ml-2 transition-colors">
                  Buka Chat
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400">
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Seluruh interaksi obrolan tersimpan aman dan terintegrasi dengan akun Anda.</span>
        </div>
      </div>
    </div>
  );
};
