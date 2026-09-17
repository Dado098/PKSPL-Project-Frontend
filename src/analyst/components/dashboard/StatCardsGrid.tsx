import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Clock,
  FileSearch,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  ArrowUpRight
} from 'lucide-react';
import { AnalystDashboardStats } from '../../types/analystDashboard';

interface StatCardsGridProps {
  stats: AnalystDashboardStats;
}

export const StatCardsGrid: React.FC<StatCardsGridProps> = ({ stats }) => {
  const navigate = useNavigate();

  const cards = [
    {
      id: 'total',
      label: 'Total Proyek',
      value: stats.totalProjects,
      description: 'Seluruh proyek penelitian dalam sistem',
      icon: FolderKanban,
      color: 'blue',
      borderColor: 'border-slate-200 hover:border-blue-300',
      iconBg: 'bg-slate-100 text-slate-700',
      filter: 'all'
    },
    {
      id: 'waitingReview',
      label: 'Menunggu Review',
      value: stats.waitingReview,
      description: 'Status SIAP_REVIEW perlu ditinjau',
      icon: Clock,
      color: 'blue',
      borderColor: 'border-blue-200 hover:border-blue-400 bg-blue-50/20',
      iconBg: 'bg-blue-100 text-blue-700',
      badgeText: 'Prioritas Tindakan',
      filter: 'SIAP_REVIEW'
    },
    {
      id: 'inReview',
      label: 'Dalam Review',
      value: stats.inReview,
      description: 'Status DALAM_REVIEW sedang ditelaah',
      icon: FileSearch,
      color: 'purple',
      borderColor: 'border-purple-200 hover:border-purple-400 bg-purple-50/20',
      iconBg: 'bg-purple-100 text-purple-700',
      filter: 'DALAM_REVIEW'
    },
    {
      id: 'needsRevision',
      label: 'Perlu Revisi',
      value: stats.needsRevision,
      description: 'Status REVISI dikembalikan ke Peneliti',
      icon: AlertCircle,
      color: 'amber',
      borderColor: 'border-amber-200 hover:border-amber-400 bg-amber-50/20',
      iconBg: 'bg-amber-100 text-amber-800',
      filter: 'REVISI'
    },
    {
      id: 'completed',
      label: 'Selesai',
      value: stats.completed,
      description: 'Status SELESAI lolos validasi penuh',
      icon: CheckCircle2,
      color: 'emerald',
      borderColor: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20',
      iconBg: 'bg-emerald-100 text-emerald-700',
      filter: 'SELESAI'
    },
    {
      id: 'waitingResponse',
      label: 'Menunggu Respons',
      value: stats.waitingResponse,
      description: 'Menunggu perbaikan data dari Peneliti',
      icon: Hourglass,
      color: 'indigo',
      borderColor: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/20',
      iconBg: 'bg-indigo-100 text-indigo-700',
      filter: 'WAITING_RESPONSE'
    },
  ];

  const handleCardClick = (filter: string) => {
    navigate(`/analyst/projects?status=${filter}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.filter)}
            className={`bg-white rounded-xl border p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group ${card.borderColor}`}
          >
            <div>
              {/* Header: Label & Icon */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-600 truncate" title={card.label}>
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Main Number */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
                  {card.value}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">proyek</span>
              </div>
            </div>

            {/* Footer / Context Note */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate" title={card.description}>
                {card.description}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-1 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
