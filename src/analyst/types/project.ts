export type ProjectStatus = 
  | 'DRAFT' 
  | 'SIAP_REVIEW' 
  | 'DALAM_REVIEW' 
  | 'REVISI' 
  | 'SELESAI';

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  status: ProjectStatus;
  lead: string;
  location: string;
  ecosystem: string;
  year: number;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  hasShp?: boolean;
  needsAttention?: boolean;
  attentionReason?: string;
}
