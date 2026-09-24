import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnnotationItem, ReviewComment, ToolMode } from '../types/annotation';
import { ProjectStatus } from '../types/project';
import { annotationService } from '../services/annotationService';
import { getProjectResearchData } from '../mock/projectResearchDataMock';
import { getMockProjectById } from '../mock/analystDashboardMock';
import { analystDashboardService } from '../services/analystDashboardService';
import { AttentionProject } from '../types/analystDashboard';
import { ReviewStatusHeader } from '../components/review/ReviewStatusHeader';
import { ReviewToolbar } from '../components/review/ReviewToolbar';
import { AnnotationOverlay } from '../components/review/AnnotationOverlay';
import { ResearchMapView } from '../components/review/ResearchMapView';
import { ResearchSectionsView } from '../components/review/ResearchSectionsView';
import { CommentSidePanel } from '../components/review/CommentSidePanel';
import { CommentComposerModal } from '../components/review/CommentComposerModal';
import { MintaRevisiModal, TandaiSelesaiModal } from '../components/review/ReviewActionModals';
import { CheckCircle2, Info } from 'lucide-react';

export const AnalystProjectReviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const effectiveId = projectId || 'PRJ-001';
  const initialMeta = getMockProjectById(effectiveId);
  const researchData = getProjectResearchData(effectiveId);

  // Dynamic project metadata dari database
  const [projectMeta, setProjectMeta] = useState<AttentionProject | null>(initialMeta || null);

  // Status Review State
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(() =>
    annotationService.getProjectStatus(effectiveId, initialMeta?.status || 'SIAP_REVIEW')
  );

  // Annotation Tooling State
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [selectedColor, setSelectedColor] = useState<string>('#ef4444');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);

  // Annotations List & Undo/Redo History
  const [annotations, setAnnotations] = useState<AnnotationItem[]>(() =>
    annotationService.getAnnotations(effectiveId)
  );
  const [history, setHistory] = useState<AnnotationItem[][]>([annotations]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Comments State
  const [comments, setComments] = useState<ReviewComment[]>(() =>
    annotationService.getComments(effectiveId)
  );
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState<boolean>(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | undefined>(undefined);

  // Composer Modal State
  const [composerOpen, setComposerOpen] = useState<boolean>(false);
  const [composerSection, setComposerSection] = useState<string>('Umum');
  const [composerCoords, setComposerCoords] = useState<{ x: number; y: number } | undefined>(undefined);

  // Action Modals State
  const [mintaRevisiOpen, setMintaRevisiOpen] = useState<boolean>(false);
  const [tandaiSelesaiOpen, setTandaiSelesaiOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state & fetch project data from database when projectId changes
  useEffect(() => {
    let isMounted = true;

    // Fetch detail dari API backend
    analystDashboardService.getProjectById(effectiveId)
      .then((meta) => {
        if (isMounted && meta) {
          setProjectMeta(meta);
          const savedStatus = annotationService.getProjectStatus(effectiveId, meta.status);
          setProjectStatus(savedStatus);
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat detail proyek dari database:', err);
      });

    const loadedAnnos = annotationService.getAnnotations(effectiveId);
    setAnnotations(loadedAnnos);
    setHistory([loadedAnnos]);
    setHistoryIndex(0);
    setComments(annotationService.getComments(effectiveId));
    setProjectStatus(annotationService.getProjectStatus(effectiveId, initialMeta?.status || 'SIAP_REVIEW'));

    return () => {
      isMounted = false;
    };
  }, [effectiveId]);

  // Gabungkan research data dengan metadata aktual dari database (kode proyek, nama peneliti, ekosistem, lokasi)
  const activeResearchData = useMemo(() => {
    return {
      ...researchData,
      projectCode: projectMeta?.code || researchData.projectCode || effectiveId,
      projectName: projectMeta?.name || researchData.projectName,
      lead: projectMeta?.lead || researchData.lead,
      researcherName: projectMeta?.lead || researchData.researcherName,
      ecosystem: projectMeta?.ecosystem || researchData.ecosystem,
      location: projectMeta?.location || researchData.location
    };
  }, [researchData, projectMeta, effectiveId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Annotation with History Tracking
  const handleAddAnnotation = useCallback((newAnno: AnnotationItem) => {
    setAnnotations(prev => {
      const next = [...prev, newAnno];
      annotationService.saveAnnotations(effectiveId, next);

      // Update Undo/Redo history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      return next;
    });
  }, [effectiveId, history, historyIndex]);

  // Delete single annotation (Eraser tool)
  const handleDeleteAnnotation = useCallback((id: string) => {
    setAnnotations(prev => {
      const next = prev.filter(a => a.id !== id);
      annotationService.saveAnnotations(effectiveId, next);

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      return next;
    });
    showToast('Anotasi berhasil dihapus');
  }, [effectiveId, history, historyIndex]);

  // Undo / Redo / Clear
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      const targetState = history[newIdx];
      setHistoryIndex(newIdx);
      setAnnotations(targetState);
      annotationService.saveAnnotations(effectiveId, targetState);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      const targetState = history[newIdx];
      setHistoryIndex(newIdx);
      setAnnotations(targetState);
      annotationService.saveAnnotations(effectiveId, targetState);
    }
  };

  const handleClearAll = () => {
    if (annotations.length === 0) return;
    setAnnotations([]);
    annotationService.saveAnnotations(effectiveId, []);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    showToast('Seluruh coretan anotasi telah dibersihkan');
  };

  // Comment Operations
  const handleOpenCommentPin = (x: number, y: number) => {
    setComposerCoords({ x, y });
    setComposerSection('Posisi Terpilih');
    setComposerOpen(true);
  };

  const handleOpenSectionComment = (sectionName: string) => {
    setComposerCoords(undefined);
    setComposerSection(sectionName);
    setComposerOpen(true);
  };

  const handleCreateComment = (content: string, section?: string, coords?: { x: number; y: number }) => {
    const newComment: ReviewComment = {
      id: `comm-${Date.now()}`,
      projectId: effectiveId,
      section: section || 'Umum',
      x: coords?.x,
      y: coords?.y,
      author: 'Analyst PKSPL',
      authorRole: 'Quality Analyst',
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      content,
      status: 'open',
      replies: []
    };

    const next = [newComment, ...comments];
    setComments(next);
    annotationService.saveComments(effectiveId, next);
    setIsCommentPanelOpen(true);
    setSelectedCommentId(newComment.id);
    showToast('Catatan review berhasil ditambahkan');
  };

  const handleToggleResolveComment = (commentId: string) => {
    const next = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, status: (c.status === 'open' ? 'resolved' : 'open') as 'open' | 'resolved' };
      }
      return c;
    });
    setComments(next);
    annotationService.saveComments(effectiveId, next);
  };

  const handleDeleteComment = (commentId: string) => {
    const next = comments.filter(c => c.id !== commentId);
    setComments(next);
    annotationService.saveComments(effectiveId, next);
    showToast('Catatan review berhasil dihapus');
  };

  const handleAddReply = (commentId: string, replyText: string) => {
    const next = comments.map(c => {
      if (c.id === commentId) {
        const newReply = {
          id: `rep-${Date.now()}`,
          author: 'Analyst PKSPL',
          authorRole: 'Quality Analyst',
          content: replyText,
          timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
        };
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    });
    setComments(next);
    annotationService.saveComments(effectiveId, next);
    showToast('Balasan catatan terkirim');
  };

  // Review Status Actions
  const handleStartReview = () => {
    setProjectStatus('DALAM_REVIEW');
    annotationService.updateProjectStatus(effectiveId, 'DALAM_REVIEW');
    showToast('Status proyek diperbarui: DALAM REVIEW');
  };

  const handleSubmitRevision = (reason: string, selectedCommentIds: string[]) => {
    setProjectStatus('REVISI');
    annotationService.updateProjectStatus(effectiveId, 'REVISI', reason);
    showToast('Permintaan revisi berhasil dikirimkan ke Peneliti');
  };

  const handleConfirmComplete = () => {
    setProjectStatus('SELESAI');
    annotationService.updateProjectStatus(effectiveId, 'SELESAI');
    showToast('Persetujuan final selesai. Proyek dinyatakan VALID & SELESAI');
  };

  const openComments = comments.filter(c => c.status === 'open').length;
  const resolvedComments = comments.filter(c => c.status === 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 relative font-sans">
      {/* 1. Header Status & Action Toolbar */}
      <ReviewStatusHeader
        projectCode={activeResearchData.projectCode}
        projectName={activeResearchData.projectName}
        lead={activeResearchData.lead}
        status={projectStatus}
        totalComments={comments.length}
        openComments={openComments}
        resolvedComments={resolvedComments}
        totalAnnotations={annotations.length}
        onStartReview={handleStartReview}
        onRequestRevision={() => setMintaRevisiOpen(true)}
        onMarkComplete={() => setTandaiSelesaiOpen(true)}
      />

      {/* 2. Sticky Review Toolbar (Pen, Highlight, Rect, Circle, Arrow, Text, Eraser) */}
      <ReviewToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        strokeWidth={strokeWidth}
        onSelectStrokeWidth={setStrokeWidth}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearAll={handleClearAll}
        commentsCount={comments.length}
        openCommentsCount={openComments}
        isCommentPanelOpen={isCommentPanelOpen}
        onToggleCommentPanel={() => setIsCommentPanelOpen(prev => !prev)}
      />

      {/* 3. Review Workspace Canvas: Content + SVG Annotation Layer Overlay */}
      <div className="relative space-y-6">
        {/* SVG Annotation Layer Over Content */}
        <AnnotationOverlay
          activeTool={activeTool}
          selectedColor={selectedColor}
          strokeWidth={strokeWidth}
          annotations={annotations}
          comments={comments}
          onAddAnnotation={handleAddAnnotation}
          onDeleteAnnotation={handleDeleteAnnotation}
          onOpenCommentPin={handleOpenCommentPin}
          onSelectComment={(c) => {
            setSelectedCommentId(c.id);
            setIsCommentPanelOpen(true);
          }}
        />

        {/* MAP LOKASI PENELITIAN AT THE VERY TOP (Sesuai Syarat Utama) */}
        <section aria-label="Peta Lokasi Penelitian">
          <ResearchMapView
            spatial={activeResearchData.spatial}
            landCovers={activeResearchData.landCovers}
            locationText={activeResearchData.location}
          />
        </section>

        {/* 8 Research Sections View (READ ONLY) */}
        <ResearchSectionsView
          data={activeResearchData}
          onOpenSectionComment={handleOpenSectionComment}
        />
      </div>

      {/* 4. Slide-Over Comment Side Panel */}
      <CommentSidePanel
        isOpen={isCommentPanelOpen}
        onClose={() => setIsCommentPanelOpen(false)}
        comments={comments}
        selectedCommentId={selectedCommentId}
        onToggleResolve={handleToggleResolveComment}
        onDeleteComment={handleDeleteComment}
        onAddReply={handleAddReply}
        onSelectCommentItem={(c) => setSelectedCommentId(c.id)}
      />

      {/* 5. Custom Comment Composer Modal */}
      <CommentComposerModal
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        sectionName={composerSection}
        pinCoordinates={composerCoords}
        onSubmit={handleCreateComment}
      />

      {/* 6. Custom Modal: Minta Revisi */}
      <MintaRevisiModal
        isOpen={mintaRevisiOpen}
        onClose={() => setMintaRevisiOpen(false)}
        projectCode={researchData.projectCode}
        projectName={researchData.projectName}
        comments={comments}
        onSubmit={handleSubmitRevision}
      />

      {/* 7. Custom Modal: Tandai Selesai */}
      <TandaiSelesaiModal
        isOpen={tandaiSelesaiOpen}
        onClose={() => setTandaiSelesaiOpen(false)}
        projectCode={researchData.projectCode}
        projectName={researchData.projectName}
        openCommentsCount={openComments}
        onConfirm={handleConfirmComplete}
      />

      {/* Floating Toast Notification (No Browser Alerts) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
