import { AnnotationItem, ReviewComment } from '../types/annotation';
import { ProjectStatus } from '../types/project';

const INITIAL_COMMENTS: Record<string, ReviewComment[]> = {
  'PKS-994KY1': [
    {
      id: 'comm-01',
      projectId: 'PKS-994KY1',
      section: '05. DATA VALUASI',
      x: 35,
      y: 42,
      author: 'Analyst PKSPL',
      authorRole: 'Quality Analyst',
      timestamp: '15 September 2026 • 14:45',
      content: 'Parameter harga unit kayu bakau (Rp 2.850.000/m³) mohon dicek silang dengan survei terbaru Dinas Kehutanan Provinsi Bali.',
      status: 'open',
      replies: [
        {
          id: 'rep-01',
          author: 'Dr. Ir. Retno Wulandari, M.Si.',
          authorRole: 'Peneliti Utama',
          content: 'Siap, kami sudah melampirkan faktur survei pasar Badung pada sheet pendukung.',
          timestamp: '15 September 2026 • 15:10'
        }
      ]
    },
    {
      id: 'comm-02',
      projectId: 'PKS-994KY1',
      section: '06. PERHITUNGAN',
      x: 60,
      y: 65,
      author: 'Analyst PKSPL',
      authorRole: 'Quality Analyst',
      timestamp: '15 September 2026 • 14:50',
      content: 'Formula Replacement Cost untuk konstruksi seawall sudah sesuai panduan teknis.',
      status: 'resolved',
      replies: []
    }
  ]
};

const INITIAL_ANNOTATIONS: Record<string, AnnotationItem[]> = {
  'PKS-994KY1': [
    {
      id: 'anno-01',
      projectId: 'PKS-994KY1',
      type: 'rectangle',
      color: '#ef4444',
      strokeWidth: 2.5,
      x: 180,
      y: 1120,
      width: 480,
      height: 60,
      section: '05. DATA VALUASI',
      commentId: 'comm-01',
      createdAt: '2026-09-15 14:45'
    }
  ]
};

export const annotationService = {
  getAnnotations(projectId: string): AnnotationItem[] {
    try {
      const stored = localStorage.getItem(`pkspl_annotations_${projectId}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return INITIAL_ANNOTATIONS[projectId] || [];
  },

  saveAnnotations(projectId: string, items: AnnotationItem[]): void {
    try {
      localStorage.setItem(`pkspl_annotations_${projectId}`, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save annotations to localStorage:', e);
    }
  },

  getComments(projectId: string): ReviewComment[] {
    try {
      const stored = localStorage.getItem(`pkspl_comments_${projectId}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return INITIAL_COMMENTS[projectId] || [];
  },

  saveComments(projectId: string, comments: ReviewComment[]): void {
    try {
      localStorage.setItem(`pkspl_comments_${projectId}`, JSON.stringify(comments));
    } catch (e) {
      console.warn('Failed to save comments to localStorage:', e);
    }
  },

  getProjectStatus(projectId: string, defaultStatus: ProjectStatus = 'SIAP_REVIEW'): ProjectStatus {
    try {
      const stored = localStorage.getItem(`pkspl_status_${projectId}`);
      if (stored) return stored as ProjectStatus;
    } catch {
      // Fallback
    }
    return defaultStatus;
  },

  updateProjectStatus(projectId: string, status: ProjectStatus, notes?: string): void {
    try {
      localStorage.setItem(`pkspl_status_${projectId}`, status);
      if (notes) {
        localStorage.setItem(`pkspl_status_notes_${projectId}`, notes);
      }
    } catch (e) {
      console.warn('Failed to save status to localStorage:', e);
    }
  }
};
