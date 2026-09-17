/**
 * Service Abstraction untuk Fitur Diskusi / Chat 1-on-1 Analyst PKSPL
 * 
 * ARSITEKTUR:
 * Komponen UI hanya berinteraksi dengan discussionService ini.
 * Saat ini service menggunakan mock data + localStorage sebagai persistence
 * simulasi/demo development.
 * 
 * Di masa mendatang, implementasi di bawah ini dapat diganti dengan:
 * Frontend Analyst -> Laravel REST API / GraphQL -> Database -> Laravel Reverb (WebSocket)
 * tanpa mengubah struktur atau kode pada UI Component.
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

const STORAGE_KEYS = {
  CONVERSATIONS: 'pkspl_demo_chat_conversations',
  MESSAGES_PREFIX: 'pkspl_demo_chat_messages_',
  ALL_RESEARCHERS: 'pkspl_demo_all_researchers'
};

class DiscussionService {
  /**
   * Mengambil daftar seluruh percakapan yang sudah pernah dibuat.
   * Diurutkan dari yang memiliki aktivitas/pesan terbaru di paling atas.
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (stored) {
        const parsed: Conversation[] = JSON.parse(stored);
        return this.sortConversations(parsed);
      }
    } catch (e) {
      console.warn('Gagal membaca conversations dari localStorage:', e);
    }

    // Seed awal dari DEMO data
    const initial = [...DEMO_INITIAL_CONVERSATIONS];
    this.saveConversations(initial);
    return this.sortConversations(initial);
  }

  /**
   * Mengambil daftar seluruh Peneliti (termasuk yang belum pernah diajak chat)
   */
  async getAllResearchers(): Promise<ResearcherUser[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ALL_RESEARCHERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Gagal membaca all researchers dari localStorage:', e);
    }

    // Fallback ke data demo
    return [...DEMO_ALL_RESEARCHERS];
  }

  /**
   * Mengambil detail Peneliti berdasarkan ID
   */
  async getResearcherById(id: string): Promise<ResearcherUser | undefined> {
    const researchers = await this.getAllResearchers();
    return researchers.find(r => r.id === id);
  }

  /**
   * Mengambil riwayat pesan percakapan tertentu
   */
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`Gagal membaca messages ${conversationId} dari localStorage:`, e);
    }

    // Fallback ke data demo awal jika ada
    const initialMessages = DEMO_INITIAL_MESSAGES[conversationId] || [];
    this.saveMessages(conversationId, initialMessages);
    return [...initialMessages];
  }

  /**
   * Mengirim pesan baru dari Analyst ke Peneliti (1-on-1)
   */
  async sendMessage(
    payload: SendMessagePayload,
    senderName: string = 'Analyst PKSPL'
  ): Promise<ChatMessage> {
    const { conversationId, text, projectContext, attachments } = payload;
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      senderId: 'analyst',
      senderRole: 'Analyst',
      senderName,
      text: text.trim(),
      timestamp: timeString,
      createdAt: now.toISOString(),
      isRead: true, // Pesan yang dikirim sendiri sudah dibaca
      projectContext,
      attachments
    };

    // 1. Simpan pesan ke riwayat obrolan
    const currentMessages = await this.getMessages(conversationId);
    const updatedMessages = [...currentMessages, newMessage];
    this.saveMessages(conversationId, updatedMessages);

    // 2. Perbarui Conversation (lastMessage, updatedAt)
    const conversations = await this.getConversations();
    let convIndex = conversations.findIndex(c => c.id === conversationId);

    if (convIndex !== -1) {
      conversations[convIndex] = {
        ...conversations[convIndex],
        lastMessage: newMessage,
        updatedAt: now.toISOString()
      };
    } else {
      // Jika percakapan baru pertama kali mengirim pesan
      // Cari researcher terkait
      const allResearchers = await this.getAllResearchers();
      const matchedResearcher = allResearchers.find(r => conversationId.includes(r.id.replace('peneliti-', '')));
      if (matchedResearcher) {
        conversations.push({
          id: conversationId,
          researcherId: matchedResearcher.id,
          researcher: matchedResearcher,
          lastMessage: newMessage,
          unreadCount: 0,
          updatedAt: now.toISOString()
        });
      }
    }

    this.saveConversations(conversations);
    return newMessage;
  }

  /**
   * Membuka atau membuat thread percakapan baru dengan seorang Peneliti
   */
  async getOrCreateConversation(researcherId: string): Promise<Conversation> {
    const conversations = await this.getConversations();
    const existing = conversations.find(c => c.researcherId === researcherId);

    if (existing) {
      return existing;
    }

    // Buat thread percakapan baru yang belum memiliki riwayat
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

    const updated = [newConv, ...conversations];
    this.saveConversations(updated);
    return newConv;
  }

  /**
   * Menandai seluruh pesan dalam percakapan sebagai telah dibaca
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    // 1. Perbarui messages
    const messages = await this.getMessages(conversationId);
    let changed = false;
    const updatedMessages = messages.map(m => {
      if (!m.isRead && m.senderRole === 'Peneliti') {
        changed = true;
        return { ...m, isRead: true };
      }
      return m;
    });

    if (changed) {
      this.saveMessages(conversationId, updatedMessages);
    }

    // 2. Set unreadCount = 0 pada conversation
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
   * Menghitung total pesan belum dibaca di semua percakapan
   */
  async getTotalUnreadCount(): Promise<number> {
    const conversations = await this.getConversations();
    return conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
  }

  // --- Helper Internal ---

  private sortConversations(conversations: Conversation[]): Conversation[] {
    return [...conversations].sort((a, b) => {
      const timeA = new Date(a.updatedAt).getTime();
      const timeB = new Date(b.updatedAt).getTime();
      return timeB - timeA; // Pesan terbaru di atas
    });
  }

  private saveConversations(conversations: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Gagal menyimpan conversations ke localStorage:', e);
    }
  }

  private saveMessages(conversationId: string, messages: ChatMessage[]): void {
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`,
        JSON.stringify(messages)
      );
    } catch (e) {
      console.warn(`Gagal menyimpan messages ${conversationId} ke localStorage:`, e);
    }
  }
}

export const discussionService = new DiscussionService();
export default discussionService;
