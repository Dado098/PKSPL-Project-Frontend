import { AnnotationItem, ReviewComment } from '../types/annotation';
import { ProjectStatus } from '../types/project';

export interface ProjectRevisionDetails {
  projectId: string;
  projectCode?: string;
  projectName?: string;
  status: 'REVISI';
  reviewer: string;
  reviewers?: string[];
  reason: string;
  timestamp: string;
  comments: ReviewComment[];
  unreadNotification?: boolean;
}

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
  ],
  'PRJ-004': [
    {
      id: 'comm-004-1',
      projectId: 'PRJ-004',
      section: '05. DATA VALUASI',
      x: 35,
      y: 48,
      author: 'Analyst PKSPL',
      authorRole: 'Quality Analyst',
      timestamp: '25 September 2026 • 08:15',
      content: 'Nilai harga pasar komoditas perikanan dan kepiting bakau mohon dicek kembali dengan standar HET regional Bali.',
      status: 'open',
      replies: [
        {
          id: 'rep-004-1',
          author: 'Dr. Ir. Retno Wulandari, M.Si.',
          authorRole: 'Peneliti Utama',
          content: 'Baik, kami telah menyesuaikan tabel referensi dengan data TPI Kedonganan terbaru.',
          timestamp: '25 September 2026 • 08:30'
        }
      ]
    },
    {
      id: 'comm-004-2',
      projectId: 'PRJ-004',
      section: '01. INDEX & AREA TUTUPAN LAHAN',
      x: 52,
      y: 28,
      author: 'Dr. Benny Nababan',
      authorRole: 'Quality Analyst',
      timestamp: '25 September 2026 • 08:18',
      content: 'Luas tutupan mangrove jarang pada sempadan pesisir (15 ha) mohon diverifikasi dengan polygon digitasi GIS.',
      status: 'open',
      replies: []
    },
    {
      id: 'comm-004-3',
      projectId: 'PRJ-004',
      section: '02. DATA SPASIAL',
      x: 68,
      y: 36,
      author: 'Analyst PKSPL',
      authorRole: 'Quality Analyst',
      timestamp: '25 September 2026 • 08:20',
      content: 'Metadata CRS shapefile EPSG:4326 telah terverifikasi, pastikan batas delineasi sempadan terhubung dengan data spasial.',
      status: 'open',
      replies: []
    }
  ],
  '4': [
    {
      id: 'comm-004-1',
      projectId: '4',
      section: '05. DATA VALUASI',
      x: 35,
      y: 48,
      author: 'Analyst PKSPL',
      authorRole: 'Quality Analyst',
      timestamp: '25 September 2026 • 08:15',
      content: 'Nilai harga pasar komoditas perikanan dan kepiting bakau mohon dicek kembali dengan standar HET regional Bali.',
      status: 'open',
      replies: []
    },
    {
      id: 'comm-004-2',
      projectId: '4',
      section: '01. INDEX & AREA TUTUPAN LAHAN',
      x: 52,
      y: 28,
      author: 'Dr. Benny Nababan',
      authorRole: 'Quality Analyst',
      timestamp: '25 September 2026 • 08:18',
      content: 'Luas tutupan mangrove jarang pada sempadan pesisir (15 ha) mohon diverifikasi dengan polygon digitasi GIS.',
      status: 'open',
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
  ],
  'PRJ-004': [
    {
      id: 'anno-004-1',
      projectId: 'PRJ-004',
      type: 'rectangle',
      color: '#ef4444',
      strokeWidth: 2.5,
      x: 120,
      y: 980,
      width: 520,
      height: 70,
      section: '05. DATA VALUASI',
      commentId: 'comm-004-1',
      createdAt: '2026-09-25 08:15'
    },
    {
      id: 'anno-004-2',
      projectId: 'PRJ-004',
      type: 'text_note',
      color: '#e11d48',
      strokeWidth: 2,
      x: 660,
      y: 980,
      textNote: 'Perlu verifikasi standar HET Bali',
      section: '05. DATA VALUASI',
      createdAt: '2026-09-25 08:16'
    }
  ],
  '4': [
    {
      id: 'anno-004-1',
      projectId: '4',
      type: 'rectangle',
      color: '#ef4444',
      strokeWidth: 2.5,
      x: 120,
      y: 980,
      width: 520,
      height: 70,
      section: '05. DATA VALUASI',
      commentId: 'comm-004-1',
      createdAt: '2026-09-25 08:15'
    }
  ]
};

const PROJECT_ALIAS_MAP: Record<string, string[]> = {
  'PRJ-001': ['PRJ-001', '1', 'PKS-994KY1'],
  '1': ['PRJ-001', '1', 'PKS-994KY1'],
  'PKS-994KY1': ['PRJ-001', '1', 'PKS-994KY1'],

  'PRJ-002': ['PRJ-002', '2', 'PKS-KKPRIV'],
  '2': ['PRJ-002', '2', 'PKS-KKPRIV'],
  'PKS-KKPRIV': ['PRJ-002', '2', 'PKS-KKPRIV'],

  'PRJ-003': ['PRJ-003', '3'],
  '3': ['PRJ-003', '3'],

  'PRJ-004': ['PRJ-004', '4'],
  '4': ['PRJ-004', '4'],

  'PRJ-005': ['PRJ-005', '5'],
  '5': ['PRJ-005', '5'],

  'PRJ-006': ['PRJ-006', '6'],
  '6': ['PRJ-006', '6'],

  'PRJ-007': ['PRJ-007', '7'],
  '7': ['PRJ-007', '7'],

  'PRJ-008': ['PRJ-008', '8', 'PKS-UW8J6F'],
  '8': ['PRJ-008', '8', 'PKS-UW8J6F'],
  'PKS-UW8J6F': ['PRJ-008', '8', 'PKS-UW8J6F'],

  'PRJ-009': ['PRJ-009', '9'],
  '9': ['PRJ-009', '9'],

  'PRJ-010': ['PRJ-010', '10'],
  '10': ['PRJ-010', '10'],

  'PRJ-ANTAM': ['PRJ-ANTAM', '11'],
  '11': ['PRJ-ANTAM', '11'],
};

const getProjectAliases = (projectId: string): string[] => {
  const norm = String(projectId || '').trim();
  if (PROJECT_ALIAS_MAP[norm]) {
    return PROJECT_ALIAS_MAP[norm];
  }
  return [norm];
};

export const annotationService = {
  getAnnotations(projectId: string): AnnotationItem[] {
    const aliases = getProjectAliases(projectId);
    try {
      for (const alias of aliases) {
        const stored = localStorage.getItem(`pkspl_annotations_${alias}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {
      // Fallback
    }
    for (const alias of aliases) {
      if (INITIAL_ANNOTATIONS[alias] && INITIAL_ANNOTATIONS[alias].length > 0) {
        return INITIAL_ANNOTATIONS[alias];
      }
    }
    return [];
  },

  saveAnnotations(projectId: string, items: AnnotationItem[]): void {
    try {
      const aliases = getProjectAliases(projectId);
      const json = JSON.stringify(items);
      for (const alias of aliases) {
        localStorage.setItem(`pkspl_annotations_${alias}`, json);
      }
    } catch (e) {
      console.warn('Failed to save annotations to localStorage:', e);
    }
  },

  getComments(projectId: string): ReviewComment[] {
    const aliases = getProjectAliases(projectId);
    try {
      for (const alias of aliases) {
        const stored = localStorage.getItem(`pkspl_comments_${alias}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {
      // Fallback
    }
    for (const alias of aliases) {
      if (INITIAL_COMMENTS[alias] && INITIAL_COMMENTS[alias].length > 0) {
        return INITIAL_COMMENTS[alias];
      }
    }
    return [];
  },

  saveComments(projectId: string, comments: ReviewComment[]): void {
    try {
      const aliases = getProjectAliases(projectId);
      const json = JSON.stringify(comments);
      for (const alias of aliases) {
        localStorage.setItem(`pkspl_comments_${alias}`, json);
      }
    } catch (e) {
      console.warn('Failed to save comments to localStorage:', e);
    }
  },

  addReply(projectId: string, commentId: string, reply: { author: string; authorRole?: string; content: string }): void {
    try {
      const comments = this.getComments(projectId);
      const updated = comments.map(c => {
        if (c.id === commentId) {
          const replies = c.replies || [];
          return {
            ...c,
            replies: [
              ...replies,
              {
                id: `rep-${Date.now()}`,
                author: reply.author,
                authorRole: reply.authorRole || 'Peneliti',
                content: reply.content,
                timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return c;
      });
      this.saveComments(projectId, updated);
    } catch (e) {
      console.warn('Failed to add reply:', e);
    }
  },

  getProjectStatus(projectId: string, defaultStatus: ProjectStatus = 'SIAP_REVIEW'): ProjectStatus {
    const aliases = getProjectAliases(projectId);
    try {
      for (const alias of aliases) {
        const stored = localStorage.getItem(`pkspl_status_${alias}`);
        if (stored) return stored as ProjectStatus;
      }
    } catch {
      // Fallback
    }
    return defaultStatus;
  },

  getProjectReviewers(projectId: string, defaultReviewer?: string): string[] {
    try {
      const storedArray = localStorage.getItem(`pkspl_reviewers_${projectId}`);
      if (storedArray) {
        const parsed = JSON.parse(storedArray);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      const storedStr = localStorage.getItem(`pkspl_reviewer_${projectId}`);
      if (storedStr) {
        const split = storedStr.split(',').map(s => s.trim()).filter(Boolean);
        if (split.length > 0) return split;
      }
    } catch {
      // Fallback
    }
    if (defaultReviewer) {
      return defaultReviewer.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  },

  getProjectReviewer(projectId: string, defaultReviewer?: string): string | null {
    const list = this.getProjectReviewers(projectId, defaultReviewer);
    if (list.length > 0) return list.join(', ');
    return defaultReviewer || null;
  },

  addProjectReviewer(projectId: string, reviewerName: string): string[] {
    if (!reviewerName || !reviewerName.trim()) {
      return this.getProjectReviewers(projectId);
    }

    try {
      const current = this.getProjectReviewers(projectId);
      const incoming = reviewerName.split(',').map(s => s.trim()).filter(Boolean);

      const merged: string[] = [...current];
      for (const inc of incoming) {
        const lower = inc.toLowerCase();
        if (!merged.some(m => m.toLowerCase() === lower)) {
          merged.push(inc);
        }
      }

      localStorage.setItem(`pkspl_reviewers_${projectId}`, JSON.stringify(merged));
      localStorage.setItem(`pkspl_reviewer_${projectId}`, merged.join(', '));
      return merged;
    } catch (e) {
      console.warn('Failed to add project reviewer:', e);
      return [reviewerName.trim()];
    }
  },

  updateProjectStatus(
    projectId: string,
    status: ProjectStatus,
    notes?: string,
    reviewer?: string,
    meta?: { projectCode?: string; projectName?: string }
  ): void {
    try {
      localStorage.setItem(`pkspl_status_${projectId}`, status);
      if (notes !== undefined) {
        localStorage.setItem(`pkspl_status_notes_${projectId}`, notes);
      }

      let reviewersList: string[] = [];
      let combinedReviewer: string | undefined = undefined;

      if (reviewer) {
        reviewersList = this.addProjectReviewer(projectId, reviewer);
        combinedReviewer = reviewersList.join(', ');
      } else {
        reviewersList = this.getProjectReviewers(projectId);
        combinedReviewer = reviewersList.length > 0 ? reviewersList.join(', ') : undefined;
      }

      // Dispatch event to synchronize in-session components across the app
      if (typeof window !== 'undefined') {
        const detail = {
          projectId,
          projectCode: meta?.projectCode || projectId,
          projectName: meta?.projectName,
          status,
          notes,
          reviewer: combinedReviewer,
          reviewers: reviewersList,
          timestamp: Date.now()
        };

        window.dispatchEvent(
          new CustomEvent('pkspl_project_status_changed', {
            detail
          })
        );

        // Cross-tab synchronization via localStorage & BroadcastChannel
        try {
          localStorage.setItem('pkspl_latest_status_change', JSON.stringify(detail));
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('pkspl_status_channel');
            bc.postMessage(detail);
            bc.close();
          }
        } catch {
          // ignore
        }
      }
    } catch (e) {
      console.warn('Failed to save status to localStorage:', e);
    }
  },

  saveRevisionDetails(projectId: string, details: ProjectRevisionDetails): void {
    try {
      let reviewersList: string[] = [];
      if (details.reviewer) {
        reviewersList = this.addProjectReviewer(projectId, details.reviewer);
      } else {
        reviewersList = this.getProjectReviewers(projectId);
      }
      const combinedReviewer = reviewersList.length > 0 ? reviewersList.join(', ') : (details.reviewer || 'Dr. Benny Nababan');

      const enrichedDetails: ProjectRevisionDetails = {
        ...details,
        reviewer: combinedReviewer,
        reviewers: reviewersList.length > 0 ? reviewersList : [combinedReviewer]
      };

      const aliases = getProjectAliases(projectId);
      for (const alias of aliases) {
        localStorage.setItem(`pkspl_revision_details_${alias}`, JSON.stringify(enrichedDetails));
        localStorage.setItem(`pkspl_status_${alias}`, 'REVISI');
        localStorage.setItem(`pkspl_status_notes_${alias}`, details.reason);
        localStorage.setItem(`pkspl_reviewer_${alias}`, combinedReviewer);
      }
      localStorage.setItem('pkspl_latest_revision_notification', JSON.stringify(enrichedDetails));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('pkspl_project_status_changed', {
            detail: {
              projectId,
              status: 'REVISI',
              notes: details.reason,
              reviewer: combinedReviewer,
              reviewers: enrichedDetails.reviewers,
              details: enrichedDetails
            }
          })
        );
        window.dispatchEvent(
          new CustomEvent('pkspl_revision_notification', {
            detail: enrichedDetails
          })
        );
      }
    } catch (e) {
      console.warn('Failed to save revision details to localStorage:', e);
    }
  },

  getRevisionDetails(projectId: string): ProjectRevisionDetails | null {
    const aliases = getProjectAliases(projectId);
    try {
      for (const alias of aliases) {
        const stored = localStorage.getItem(`pkspl_revision_details_${alias}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!parsed.reviewers || parsed.reviewers.length === 0) {
            parsed.reviewers = this.getProjectReviewers(alias, parsed.reviewer);
          }
          return parsed;
        }
      }

      // Fallback reconstruction if project has status REVISI or PERLU_PERBAIKAN
      for (const alias of aliases) {
        const status = localStorage.getItem(`pkspl_status_${alias}`);
        if (status === 'REVISI' || status === 'PERLU_PERBAIKAN') {
          const notes = localStorage.getItem(`pkspl_status_notes_${alias}`) || 'Parameter data penelitian perlu disesuaikan dengan rekomendasi telaah analis.';
          const reviewers = this.getProjectReviewers(alias, 'Dr. Benny Nababan');
          const reviewer = reviewers.join(', ') || 'Dr. Benny Nababan';
          const comments = this.getComments(alias);
          return {
            projectId: alias,
            status: 'REVISI',
            reviewer,
            reviewers,
            reason: notes,
            timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            comments: comments.filter(c => c.status === 'open'),
            unreadNotification: true
          };
        }
      }
    } catch {
      // Fallback
    }
    return null;
  },

  dismissRevisionNotification(projectId: string): void {
    try {
      const readList: string[] = JSON.parse(localStorage.getItem('pkspl_dismissed_revisions') || '[]');
      if (!readList.includes(projectId)) {
        readList.push(projectId);
        localStorage.setItem('pkspl_dismissed_revisions', JSON.stringify(readList));
      }
    } catch (e) {
      console.warn('Failed to dismiss revision notification:', e);
    }
  },

  isRevisionNotificationDismissed(projectId: string): boolean {
    try {
      const readList: string[] = JSON.parse(localStorage.getItem('pkspl_dismissed_revisions') || '[]');
      return readList.includes(projectId);
    } catch {
      return false;
    }
  },

  resolveRevision(projectId: string, researcherNotes?: string): void {
    try {
      this.updateProjectStatus(projectId, 'MENUNGGU_ANALYST', researcherNotes);
      // Remove from dismissed list so next revision can notify again
      const readList: string[] = JSON.parse(localStorage.getItem('pkspl_dismissed_revisions') || '[]');
      const filtered = readList.filter(id => id !== projectId);
      localStorage.setItem('pkspl_dismissed_revisions', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to resolve revision:', e);
    }
  }
};
