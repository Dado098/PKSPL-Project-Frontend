import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectStatus } from '../../types/project';
import { StatusBadge } from '../common/StatusBadge';
import {
  ArrowLeft,
  ChevronRight,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  PenTool,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ReviewStatusHeaderProps {
  projectCode: string;
  projectName: string;
  status: ProjectStatus;
  totalComments: number;
  openComments: number;
  resolvedComments: number;
  totalAnnotations: number;
  onStartReview: () => void;
  onRequestRevision: () => void;
  onMarkComplete: () => void;
}

export const ReviewStatusHeader: React.FC<ReviewStatusHeaderProps> = ({
  projectCode,
  projectName,
  status,
  totalComments,
  openComments,
  resolvedComments,
  totalAnnotations,
  onStartReview,
  onRequestRevision,
  onMarkComplete
}) => {
  return (
    <div className="space-y-4">
      {/* Top Back Link & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Link
          to="/analyst/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Review Proyek</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Link to="/analyst/dashboard" className="hover:text-slate-600">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/analyst/projects" className="hover:text-slate-600">
            Review Proyek
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-mono text-slate-700 font-semibold">{projectCode}</span>
        </div>
      </div>

      {/* Main Review Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Project Title & Code */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Workspace Review & Validasi Mutu
              </span>
              <span className="font-mono text-xs font-bold text-slate-600">
                {projectCode}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {projectName}
            </h1>
            <p className="text-xs text-slate-500">
              Telaah mendalam data penelitian, data spasial GIS, metodologi, dan perhitungan Total Economic Value (TEV).
            </p>
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {status === 'SIAP_REVIEW' && (
              <button
                onClick={onStartReview}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Mulai Review</span>
              </button>
            )}

            {(status === 'DALAM_REVIEW' || status === 'REVISI') && (
              <>
                <button
                  onClick={onRequestRevision}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Minta Revisi</span>
                </button>

                <button
                  onClick={onMarkComplete}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tandai Selesai</span>
                </button>
              </>
            )}

            {status === 'SELESAI' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Review Disetujui & Selesai</span>
              </div>
            )}
          </div>
        </div>

        {/* Review Summary Metrics Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Status Saat Ini:</span>
              <StatusBadge status={status} size="sm" />
            </div>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5 text-slate-600">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Total Catatan: <strong>{totalComments}</strong></span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({openComments} open, {resolvedComments} resolved)
              </span>
            </div>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5 text-slate-600">
              <PenTool className="w-3.5 h-3.5 text-purple-600" />
              <span>Anotasi Coretan: <strong>{totalAnnotations}</strong></span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Mode Telaah: READ ONLY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
