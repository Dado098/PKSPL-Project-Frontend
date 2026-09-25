export type ProjectStatus = 
  | 'DRAFT' 
  | 'DIKERJAKAN' 
  | 'SIAP_REVIEW' 
  | 'DALAM_REVIEW' 
  | 'MENUNGGU_ANALYST' 
  | 'PERLU_PERBAIKAN' 
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
  reviewedBy?: string;
  reviewers?: string[];
  reviewedAt?: string;
  analystComment?: string;
  hasShp?: boolean;
}

export type WorkflowStepId = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08';

export interface WorkflowStep {
  id: WorkflowStepId;
  title: string;
  path: string;
  status: 'completed' | 'current' | 'pending';
}
