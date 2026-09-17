import React from 'react';
import { RecentActivity } from '../../types/analystDashboard';
import {
  Send,
  MessageSquare,
  FileCheck2,
  RefreshCw,
  Clock,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-2xs">
        <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Belum ada aktivitas terbaru yang tercatat.</p>
      </div>
    );
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'submission':
        return <Send className="w-3.5 h-3.5 text-blue-600" />;
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-600" />;
      case 'revision':
        return <RefreshCw className="w-3.5 h-3.5 text-amber-600" />;
      case 'approval':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'discussion':
        return <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getActorBadge = (role: RecentActivity['actorRole']) => {
    switch (role) {
      case 'Analyst':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Peneliti':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Aktivitas Terbaru
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Jejak pengajuan, catatan review, dan revisi terkini
          </p>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
          <Clock className="w-3.5 h-3.5" />
          Realtime Feed
        </span>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
        {activities.map((act) => (
          <div key={act.id} className="p-4 hover:bg-slate-50/60 transition-colors flex gap-3 text-xs">
            {/* Type Icon */}
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
              {getActivityIcon(act.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-900">{act.actor}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getActorBadge(act.actorRole)}`}>
                  {act.actorRole}
                </span>
                <span className="text-slate-600">{act.action}</span>
              </div>

              {/* Project Target */}
              <div className="mt-1 flex items-center gap-1.5 text-slate-700">
                <span className="font-mono text-[11px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  {act.projectCode}
                </span>
                <span className="truncate text-slate-800 font-medium" title={act.projectName}>
                  {act.projectName}
                </span>
              </div>

              {/* Timestamp */}
              <div className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{act.relativeTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
