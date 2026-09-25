import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  X,
  FileText,
  UserCheck,
  Calendar,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { annotationService, ProjectRevisionDetails } from '../../../analyst/services/annotationService';

export const RevisionNotificationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [revisionDetails, setRevisionDetails] = useState<ProjectRevisionDetails | null>(null);
  const { projects, activeProject, activeProjectId } = useProject();
  const navigate = useNavigate();

  // Listen for real-time revision notification events
  useEffect(() => {
    const handleNotificationEvent = (e: any) => {
      const details = e.detail as ProjectRevisionDetails;
      if (details) {
        setRevisionDetails(details);
        setIsOpen(true);
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'pkspl_latest_revision_notification' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && !annotationService.isRevisionNotificationDismissed(parsed.projectId)) {
            setRevisionDetails(parsed);
            setIsOpen(true);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('pkspl_revision_notification', handleNotificationEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('pkspl_revision_notification', handleNotificationEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Check on mount and when projects change if there is an unacknowledged revision
  useEffect(() => {
    // Check active project first
    const targetProject = projects.find(
      p => p.status === 'REVISI' || p.status === 'PERLU_PERBAIKAN'
    ) || (activeProject && (activeProject.status === 'REVISI' || activeProject.status === 'PERLU_PERBAIKAN') ? activeProject : null);

    if (targetProject) {
      const projId = targetProject.id || targetProject.code;
      if (!annotationService.isRevisionNotificationDismissed(projId)) {
        const stored = annotationService.getRevisionDetails(projId);
        if (stored) {
          setRevisionDetails(stored);
          setIsOpen(true);
        } else {
          setRevisionDetails({
            projectId: projId,
            projectCode: targetProject.code,
            projectName: targetProject.name,
            status: 'REVISI',
            reviewer: targetProject.reviewedBy || 'Dr. Benny Nababan',
            reason: targetProject.analystComment || 'Parameter data penelitian perlu disesuaikan dengan rekomendasi telaah Quality Analyst.',
            timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            comments: annotationService.getComments(projId).filter(c => c.status === 'open'),
            unreadNotification: true
          });
          setIsOpen(true);
        }
      }
    }
  }, [projects, activeProject]);

  if (!isOpen || !revisionDetails) return null;

  const handleClose = () => {
    if (revisionDetails?.projectId) {
      annotationService.dismissRevisionNotification(revisionDetails.projectId);
    }
    setIsOpen(false);
  };

  const handleGoToReview = () => {
    if (revisionDetails?.projectId) {
      annotationService.dismissRevisionNotification(revisionDetails.projectId);
    }
    setIsOpen(false);
    const targetId = revisionDetails.projectId || activeProjectId || 'PKS-994KY1';
    navigate(`/peneliti/projects/${targetId}/review`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header with Crimson Accent */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wide uppercase">
                <AlertTriangle className="w-3 h-3" />
                <span>Perlu Perbaikan</span>
              </div>
              <h2 className="text-base font-bold leading-snug mt-1">
                Pemberitahuan Revisi dari Quality Analyst
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Project Identity */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">Proyek Penelitian</span>
              <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                {revisionDetails.projectCode || revisionDetails.projectId}
              </span>
            </div>
            <div className="font-bold text-slate-900 text-sm leading-tight">
              {revisionDetails.projectName || 'Kajian Valuasi Ekonomi Sumberdaya Pesisir & Laut'}
            </div>
          </div>

          {/* Reviewer Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-purple-50/70 border border-purple-200/80 rounded-xl px-3.5 py-2.5 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {revisionDetails.reviewer.charAt(0) || 'A'}
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-purple-600">
                  {revisionDetails.reviewer.includes(',') ? 'Tim Reviewer Penelaah' : 'Reviewer Penelaah'}
                </div>
                <div className="font-bold text-slate-900 text-xs">{revisionDetails.reviewer}</div>
              </div>
            </div>

            <div className="text-left sm:text-right text-[11px] text-slate-500 font-medium shrink-0">
              <div className="flex items-center gap-1 text-slate-600 sm:justify-end">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{revisionDetails.timestamp}</span>
              </div>
              <span className="text-[10px] text-purple-700 font-semibold">Quality Analyst PKSPL</span>
            </div>
          </div>

          {/* Main Revision Notes Box */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Arahan & Alasan Revisi Analis:
            </label>
            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl text-rose-950 leading-relaxed font-normal shadow-2xs">
              "{revisionDetails.reason}"
            </div>
          </div>

          {/* Points / Attached Comments if available */}
          {revisionDetails.comments && revisionDetails.comments.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 uppercase tracking-wider">
                  Poin-Poin Bagian yang Perlu Dicek ({revisionDetails.comments.length}):
                </span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
                {revisionDetails.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-2 bg-white rounded-lg border border-slate-200/80 text-[11px] leading-relaxed shadow-2xs"
                  >
                    <div className="font-bold text-rose-700 mb-0.5">
                      [{comm.section || 'Umum'}]:
                    </div>
                    <div className="text-slate-700">{comm.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notice Alert */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
            Status proyek ini telah otomatis diperbarui menjadi <strong className="font-bold text-rose-700">Revisi</strong>. Silakan tinjau lembar kerja terkait dan sesuaikan data yang diminta sebelum diajukan kembali.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleGoToReview}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Buka Review & Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
export default RevisionNotificationModal;
