/**
 * Service Abstraction untuk Fitur Diskusi / Chat 1-on-1 Analyst PKSPL
 * 
 * Terintegrasi langsung dengan Laravel Backend PKSPL:
 * - REST API: /api/v1/conversations, /api/v1/chat/directory, /api/v1/notifications
 * - WebSocket: Laravel Reverb via Laravel Echo
 * - Resilient Local Fallback & Cache untuk kestabilan offline/dev
 */

import {
  Conversation,
  ChatMessage,
  ResearcherUser,
  SendMessagePayload,
  ProjectContext,
  ChatAttachment
} from '../types/discussion';
import {
  DEMO_ALL_RESEARCHERS,
  DEMO_INITIAL_CONVERSATIONS,
  DEMO_INITIAL_MESSAGES
} from '../mock/discussionMock';
import { apiClient } from './api';
import { getEcho } from '../../lib/echo';

export const formatLastSeen = (val: any, isOnline: boolean): string => {
  if (isOnline) return 'Online';
  if (!val) return 'Offline';
  if (val === 'Online' || val === 'online') return 'Online';
  try {
    const date = new Date(val);
    if (isNaN(date.getTime())) return String(val);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    const isToday = now.toDateString() === date.toDateString();
    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    if (isToday) return `Hari ini pukul ${timeStr}`;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.toDateString() === date.toDateString()) return `Kemarin pukul ${timeStr}`;
    return `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })} pukul ${timeStr}`;
  } catch {
    return String(val);
  }
};

const STORAGE_KEYS = {
  CONVERSATIONS: 'pkspl_demo_chat_conversations',
  MESSAGES_PREFIX: 'pkspl_demo_chat_messages_',
  ALL_RESEARCHERS: 'pkspl_demo_all_researchers'
};

class DiscussionService {
  private inMemoryMessageCache = new Map<string, ChatMessage[]>();

  /**
   * Mengambil daftar seluruh percakapan yang dapat diakses oleh user yang sedang login.
   * Terhubung ke GET /api/v1/conversations dengan fallback lokal.
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const res = await apiClient.get<any>('/conversations');
      if (res && Array.isArray(res.data)) {
        const conversations: Conversation[] = res.data.map((item: any) => {
          const resObj = item.researcher || item.otherUser || {};
          const resId = String(item.researcherId || resObj.id || resObj.id_user || '');
          const resName = resObj.name || resObj.nama || item.userName || item.title || 'Pengguna';
          const resRole = resObj.role || item.userRole || 'Peneliti';

          const isOnline = Boolean(item.isOnline ?? resObj.isOnline ?? resObj.is_online);
          const rawLastSeen = resObj.lastSeen || resObj.last_seen_at || resObj.last_seen || item.lastSeen;

          return {
            id: String(item.id || item.id_conversation),
            researcherId: resId,
            researcher: {
              id: resId,
              name: resName,
              academicTitle: resObj.academicTitle || (resRole === 'Peneliti' ? 'Peneliti Valuasi' : resRole),
              specialization: resObj.specialization || (resRole === 'Analyst' ? 'Reviewer & QC' : 'Penelitian Ekosistem'),
              email: resObj.email || '',
              institution: resObj.institution || 'PKSPL IPB University',
              isOnline,
              lastSeen: formatLastSeen(rawLastSeen, isOnline),
              associatedProjects: resObj.associatedProjects || resObj.associated_projects || (item.projectCode ? [{ code: item.projectCode, name: item.projectName }] : []),
            },
            lastMessage: item.lastMessage ? this.mapMessage(item.lastMessage) : undefined,
            unreadCount: item.unreadCount ?? item.unread_count ?? 0,
            updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
          };
        });

        this.saveConversations(conversations);
        return this.sortConversations(conversations);
      }
    } catch (e) {
      console.warn('[DiscussionService] Gagal membaca percakapan dari API backend, menggunakan cache/fallback:', e);
    }

    // Fallback ke cache atau data demo
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (stored) {
        return this.sortConversations(JSON.parse(stored));
      }
    } catch (e) {
      // Ignore
    }

    const initial = [...DEMO_INITIAL_CONVERSATIONS];
    this.saveConversations(initial);
    return this.sortConversations(initial);
  }

  /**
   * Mengambil daftar seluruh Peneliti / Kontak yang dapat diajak chat.
   * Terhubung ke GET /api/v1/chat/directory.
   */
  async getAllResearchers(): Promise<ResearcherUser[]> {
    try {
      const res = await apiClient.get<any>('/chat/directory');
      if (res && Array.isArray(res.data)) {
        const researchers: ResearcherUser[] = res.data.map((u: any) => {
          const isOnline = Boolean(u.isOnline ?? u.is_online);
          const rawLastSeen = u.lastSeen || u.last_seen_at || u.last_seen;
          return {
            id: String(u.id || u.id_user),
            name: u.name || u.nama,
            academicTitle: u.academicTitle || (u.role === 'Peneliti' ? 'Peneliti Valuasi' : u.role),
            specialization: u.specialization || (u.role === 'Analyst' ? 'Reviewer & Quality Control' : 'Penelitian Ekosistem'),
            email: u.email,
            institution: u.institution || 'PKSPL IPB University',
            avatarUrl: u.avatarUrl || undefined,
            isOnline,
            lastSeen: formatLastSeen(rawLastSeen, isOnline),
            associatedProjects: u.associatedProjects || u.associated_projects || [],
          };
        });

        this.saveResearchers(researchers);
        return researchers;
      }
    } catch (e) {
      console.warn('[DiscussionService] Gagal membaca direktori peneliti dari API, fallback ke cache:', e);
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ALL_RESEARCHERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Ignore
    }

    return [...DEMO_ALL_RESEARCHERS];
  }

  /**
   * Mengambil detail Peneliti berdasarkan ID
   */
  async getResearcherById(id: string): Promise<ResearcherUser | undefined> {
    const researchers = await this.getAllResearchers();
    return researchers.find(r => r.id === String(id));
  }

  /**
   * Mengambil riwayat pesan percakapan tertentu.
   * Terhubung ke GET /api/v1/conversations/{id}/messages.
   */
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const res = await apiClient.get<any>(`/conversations/${conversationId}/messages`, { per_page: 50 });
      if (res && Array.isArray(res.data)) {
        const messages: ChatMessage[] = res.data.map((m: any) => this.mapMessage(m));
        this.saveMessages(conversationId, messages);
        return messages;
      }
    } catch (e) {
      console.warn(`[DiscussionService] Gagal membaca pesan percakapan ${conversationId} dari API, fallback:`, e);
    }

    const inMemory = this.inMemoryMessageCache.get(conversationId);
    if (inMemory && inMemory.length > 0) {
      return inMemory;
    }

    const initialMessages = DEMO_INITIAL_MESSAGES[conversationId] || [];
    this.saveMessages(conversationId, initialMessages);
    return [...initialMessages];
  }

  /**
   * Mengirim pesan baru (teks dan/atau berkas lampiran) ke percakapan.
   * Terhubung ke POST /api/v1/conversations/{id}/messages.
   */
  async sendMessage(
    payload: SendMessagePayload,
    senderName: string = 'Analyst PKSPL',
    file?: File
  ): Promise<ChatMessage> {
    const { conversationId, text, projectContext, attachments } = payload;

    try {
      let res: any;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (text) formData.append('message', text);
        if (projectContext?.projectCode) {
          formData.append('project_code', projectContext.projectCode);
        }
        res = await apiClient.upload<any>(`/conversations/${conversationId}/messages`, formData);
      } else {
        const payloadData: any = {
          message: text,
          text: text,
        };
        if (projectContext?.projectCode) {
          payloadData.project_code = projectContext.projectCode;
        }
        res = await apiClient.post<any>(`/conversations/${conversationId}/messages`, payloadData);
      }

      if (res && res.data) {
        const sentMessage = this.mapMessage(res.data);
        const currentMessages = await this.getMessages(conversationId);
        const updated = [...currentMessages.filter(m => m.id !== sentMessage.id), sentMessage];
        this.saveMessages(conversationId, updated);
        return sentMessage;
      }
    } catch (e) {
      console.warn('[DiscussionService] Gagal mengirim pesan ke API, fallback ke penyimpanan lokal:', e);
    }

    // Fallback lokal jika backend tidak merespons
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const fallbackMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      senderId: 'analyst',
      senderRole: 'Analyst',
      senderName,
      text: text.trim(),
      timestamp: timeString,
      createdAt: now.toISOString(),
      isRead: true,
      projectContext,
      attachments
    };

    const currentMessages = await this.getMessages(conversationId);
    const updatedMessages = [...currentMessages, fallbackMessage];
    this.saveMessages(conversationId, updatedMessages);

    return fallbackMessage;
  }

  /**
   * Membuka atau membuat thread percakapan baru dengan seorang Peneliti.
   * Terhubung ke POST /api/v1/conversations.
   */
  async getOrCreateConversation(researcherId: string): Promise<Conversation> {
    const numericStr = String(researcherId).replace(/\D/g, '');
    const numericId = numericStr ? Number(numericStr) : Number(researcherId);

    try {
      if (!isNaN(numericId) && numericId > 0) {
        const res = await apiClient.post<any>('/conversations', {
          recipient_id: numericId,
        });

        if (res && res.data) {
          const item = res.data;
          const conv: Conversation = {
            id: String(item.id || item.id_conversation),
            researcherId: String(item.researcherId || item.otherUser?.id || researcherId),
            researcher: item.researcher || item.otherUser || (await this.getResearcherById(researcherId))!,
            lastMessage: item.lastMessage ? this.mapMessage(item.lastMessage) : undefined,
            unreadCount: 0,
            updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
          };

          const convs = await this.getConversations();
          const filtered = convs.filter(c => c.id !== conv.id);
          this.saveConversations([conv, ...filtered]);
          return conv;
        }
      }
    } catch (e) {
      console.warn('[DiscussionService] Gagal getOrCreateConversation via API, fallback ke lokal:', e);
    }

    // Fallback lokal
    const conversations = await this.getConversations();
    const existing = conversations.find(c => c.researcherId === researcherId || c.id === researcherId);
    if (existing) {
      return existing;
    }

    const researcher = await this.getResearcherById(researcherId);
    if (!researcher) {
      throw new Error(`Peneliti dengan ID ${researcherId} tidak ditemukan.`);
    }

    const newConv: Conversation = {
      id: `conv-${researcherId.replace('peneliti-', '')}`,
      researcherId,
      researcher,
      lastMessage: undefined,
      unreadCount: 0,
      updatedAt: new Date().toISOString()
    };

    this.saveConversations([newConv, ...conversations]);
    return newConv;
  }

  /**
   * Menandai seluruh pesan dalam percakapan sebagai telah dibaca.
   * Terhubung ke POST /api/v1/conversations/{id}/read.
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      await apiClient.post(`/conversations/${conversationId}/read`);
    } catch (e) {
      console.warn(`[DiscussionService] Gagal mark as read di API untuk conversation ${conversationId}:`, e);
    }

    // Perbarui cache lokal
    const conversations = await this.getConversations();
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1 && conversations[convIndex].unreadCount > 0) {
      conversations[convIndex] = {
        ...conversations[convIndex],
        unreadCount: 0
      };
      this.saveConversations(conversations);
    }
  }

  /**
   * Mengirim sinyal indikator sedang mengetik ke percakapan tertentu
   * (Dual-tier: client whisper untuk sub-30ms responsiveness + API call untuk reliabilitas)
   */
  async sendTyping(conversationId: string, isTyping: boolean = true, userId?: string | number): Promise<void> {
    const echo = getEcho();
    if (echo && conversationId && !isNaN(Number(conversationId))) {
      try {
        const channel = echo.private(`conversation.${conversationId}`);
        channel.whisper('typing', {
          conversationId,
          userId,
          isTyping,
        });
      } catch (err) {
        // whisper error ignored
      }
    }

    try {
      await apiClient.post(`/conversations/${conversationId}/typing`, {
        is_typing: isTyping,
      });
    } catch (e) {
      // API error ignored
    }
  }

  /**
   * Mengedit pesan yang dikirim oleh user sendiri.
   * Terhubung ke PUT /api/v1/conversations/{conversation}/messages/{message}.
   */
  async editMessage(conversationId: string, messageId: string, newText: string): Promise<ChatMessage> {
    const trimmed = newText.trim();
    if (!trimmed) {
      throw new Error('Isi pesan tidak boleh kosong');
    }

    try {
      const res = await apiClient.put<any>(`/conversations/${conversationId}/messages/${messageId}`, {
        message: trimmed,
        text: trimmed,
      });

      if (res && res.data) {
        const updated = this.mapMessage(res.data);
        const currentMessages = await this.getMessages(conversationId);
        const next = currentMessages.map((m) => (m.id === updated.id ? updated : m));
        this.saveMessages(conversationId, next);
        return updated;
      }
      throw new Error('Respons tidak valid dari server');
    } catch (e: any) {
      console.error('[DiscussionService] Gagal edit pesan ke API:', e);
      throw e;
    }
  }

  /**
   * Menghapus (soft delete) pesan milik user sendiri.
   * Terhubung ke DELETE /api/v1/conversations/{conversation}/messages/{message}.
   */
  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    try {
      await apiClient.delete(`/conversations/${conversationId}/messages/${messageId}`);

      // Perbarui cache lokal menjadi tombstone
      const currentMessages = await this.getMessages(conversationId);
      const next = currentMessages.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            text: 'Pesan telah dihapus',
            isDeleted: true,
            attachments: undefined,
          };
        }
        return m;
      });
      this.saveMessages(conversationId, next);
    } catch (e: any) {
      console.error('[DiscussionService] Gagal delete pesan ke API:', e);
      throw e;
    }
  }

  /**
   * Menghitung total pesan belum dibaca di semua percakapan
   */
  async getTotalUnreadCount(): Promise<number> {
    const conversations = await this.getConversations();
    return conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
  }

  // --- Helper Transformasi & Cache Internal ---

  public mapMessage(m: any): ChatMessage {
    const isDeleted = Boolean(m.isDeleted ?? m.is_deleted);
    const isEdited = Boolean(m.isEdited ?? m.is_edited);

    const attachments: ChatAttachment[] = Array.isArray(m.attachments)
      ? m.attachments.map((att: any) => ({
          id: String(att.id || att.id_attachment),
          fileName: att.fileName || att.file_name || 'berkas',
          fileSize: att.fileSize || att.file_size || '1 MB',
          fileType: att.fileType || att.file_type || 'doc',
          url: att.url,
        }))
      : [];

    return {
      id: String(m.id || m.id_message),
      conversationId: String(m.conversationId || m.conversation_id),
      senderId: String(m.senderId || m.sender_id),
      senderRole: (m.senderRole || m.sender_role || 'Peneliti') as any,
      senderName: m.senderName || m.sender_name || 'Pengguna',
      text: isDeleted ? 'Pesan telah dihapus' : (m.text || m.message || ''),
      timestamp: m.timestamp || (m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
      createdAt: m.createdAt || m.created_at || new Date().toISOString(),
      isRead: Boolean(m.isRead ?? m.is_read),
      status: (m.status as any) || (Boolean(m.isRead ?? m.is_read) ? 'read' : 'delivered'),
      isEdited,
      isDeleted,
      isOutgoing: Boolean(m.isOutgoing ?? m.is_outgoing),
      projectContext: m.projectContext ? {
        projectCode: m.projectContext.projectCode || m.projectContext.project_code || '',
        projectName: m.projectContext.projectName || m.projectContext.project_name || '',
      } : undefined,
      attachments: isDeleted ? undefined : (attachments.length > 0 ? attachments : undefined),
    };
  }

  private sortConversations(conversations: Conversation[]): Conversation[] {
    return [...conversations].sort((a, b) => {
      const timeA = new Date(a.updatedAt).getTime();
      const timeB = new Date(b.updatedAt).getTime();
      return timeB - timeA;
    });
  }

  private saveConversations(conversations: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {
      // Ignore
    }
  }

  private saveResearchers(researchers: ResearcherUser[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_RESEARCHERS, JSON.stringify(researchers));
    } catch (e) {
      // Ignore
    }
  }

  private heartbeatTimer: any = null;

  public startHeartbeat(): void {
    if (this.heartbeatTimer) return;
    this.heartbeatTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        apiClient.post('/chat/heartbeat').catch(() => {});
      }
    }, 45000);
  }

  private saveMessages(conversationId: string, messages: ChatMessage[]): void {
    this.inMemoryMessageCache.set(conversationId, messages);
    try {
      // Purge any legacy unencrypted plaintext messages from localStorage
      localStorage.removeItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`);
    } catch (e) {
      // Ignore
    }
  }
}

export const discussionService = new DiscussionService();
export default discussionService;