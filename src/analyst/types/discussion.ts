/**
 * Tipe Data Diskusi / Chat 1-on-1 Analyst PKSPL
 * Dirancang modular dan siap dihubungkan ke backend Laravel (REST / WebSocket Reverb).
 */

export interface ProjectContext {
  projectCode: string;
  projectName: string;
}

export interface ChatAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'doc' | 'image' | 'sheet' | 'spatial';
  url?: string;
  file?: File;
}

/**
 * Entitas Peneliti (Role: PENELITI)
 * Catatan: Data demo simulasi untuk keperluan antarmuka frontend.
 */
export interface ResearcherUser {
  id: string;
  name: string;
  academicTitle: string;
  specialization: string;
  email: string;
  institution: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastSeen: string;
  associatedProjects: Array<{
    code: string;
    name: string;
  }>;
}

/**
 * Pesan obrolan individu (1-on-1)
 */
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'Analyst' | 'Peneliti' | 'Admin';
  senderName: string;
  text: string;
  timestamp: string; // Format tampilan 'HH:mm'
  createdAt: string; // ISO string untuk pengurutan
  isRead: boolean;
  status?: 'sent' | 'delivered' | 'read';
  isEdited?: boolean;
  isDeleted?: boolean;
  isOutgoing?: boolean;
  projectContext?: ProjectContext;
  attachments?: ChatAttachment[];
}

/**
 * Thread percakapan antara Analyst dan satu Peneliti
 */
export interface Conversation {
  id: string;
  researcherId: string;
  researcher: ResearcherUser;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string; // ISO string
}

/**
 * Payload pengiriman pesan baru dari Analyst
 */
export interface SendMessagePayload {
  conversationId: string;
  text: string;
  projectContext?: ProjectContext;
  attachments?: ChatAttachment[];
}
