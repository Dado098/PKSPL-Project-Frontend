import { ProjectStatus } from './project';

export interface AnalystDashboardStats {
  totalProjects: number;
  waitingReview: number;    // SIAP_REVIEW
  inReview: number;         // DALAM_REVIEW
  needsRevision: number;    // REVISI
  completed: number;        // SELESAI
  waitingResponse: number;  // Menunggu respons dari Peneliti
}

export interface ProjectStatusDistribution {
  status: ProjectStatus | 'DRAFT';
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ReviewTrendPoint {
  period: string; // Dynamic period, e.g. "Mei 2026", "Jun 2026", "Jul 2026", dll.
  reviewedCount: number;
  submittedCount: number;
}

export interface ReviewOutcomeDistribution {
  outcome: 'SELESAI' | 'REVISI' | 'DALAM_REVIEW';
  label: string;
  count: number;
  color: string;
}

export interface AttentionProject {
  id: string;
  code: string;
  name: string;
  lead: string;
  ecosystem: string;
  location?: string;
  status: ProjectStatus;
  reviewedBy?: string;
  reviewers?: string[];
  reviewedAt?: string;
  updatedAt: string;
  relativeTime: string;
  actionRequired: 'Review' | 'Lihat';
  attentionReason?: string;
  statusDescription?: string;
  hasShp?: boolean;
}

export interface RecentActivity {
  id: string;
  actor: string;
  actorRole: 'Peneliti' | 'Analyst' | 'Sistem';
  action: string;
  projectCode: string;
  projectName: string;
  timestamp: string;
  relativeTime: string;
  type: 'submission' | 'comment' | 'revision' | 'approval' | 'discussion';
}

export interface AnalystDashboardData {
  stats: AnalystDashboardStats;
  statusDistribution: ProjectStatusDistribution[];
  reviewTrend: ReviewTrendPoint[];
  reviewOutcomes: ReviewOutcomeDistribution[];
  attentionProjects: AttentionProject[];
  recentActivities: RecentActivity[];
}

export interface AnalystUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
