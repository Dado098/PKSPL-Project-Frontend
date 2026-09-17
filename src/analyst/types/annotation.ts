export type ToolMode = 
  | 'select'
  | 'comment'
  | 'pen'
  | 'highlight'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'text'
  | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export interface AnnotationItem {
  id: string;
  projectId: string;
  analystId?: string;
  type: 'pen' | 'highlight' | 'rectangle' | 'circle' | 'arrow' | 'text';
  color: string;
  strokeWidth: number;
  points?: Point[]; // For pen & highlight
  x?: number;       // For rect, circle, text
  y?: number;
  width?: number;
  height?: number;
  startPoint?: Point; // For arrow
  endPoint?: Point;
  text?: string;    // For text
  section?: string;
  commentId?: string;
  createdAt: string;
}

export interface CommentReply {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
}

export interface ReviewComment {
  id: string;
  projectId: string;
  annotationId?: string;
  section?: string;
  x?: number; // Position percentage (0 to 100) or pixel
  y?: number;
  author: string;
  authorRole: string;
  timestamp: string;
  content: string;
  status: 'open' | 'resolved';
  replies?: CommentReply[];
}
