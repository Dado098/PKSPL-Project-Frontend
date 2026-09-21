import { Conversation, ChatMessage, RESEARCHER_INITIAL_CONVERSATIONS } from '../mock/chatMock';

export type ChatEventType =
  | 'MESSAGE_SENT'
  | 'MESSAGE_DELIVERED'
  | 'MESSAGE_READ'
  | 'MESSAGE_RECEIVED'
  | 'TYPING_START'
  | 'TYPING_STOP'
  | 'CONVERSATIONS_UPDATED'
  | 'UNREAD_COUNT_CHANGED'
  | 'USER_STATUS_CHANGED';

export interface ChatEvent {
  type: ChatEventType;
  conversationId?: string;
  message?: ChatMessage;
  userId?: string;
  isOnline?: boolean;
  totalUnread?: number;
  conversations?: Conversation[];
}

type ChatEventListener = (event: ChatEvent) => void;

const STORAGE_KEY = 'pkspl_researcher_conversations_v1';

class ChatService {
  private conversations: Conversation[] = [];
  private listeners: Set<ChatEventListener> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.conversations = [...RESEARCHER_INITIAL_CONVERSATIONS];
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.conversations = JSON.parse(stored);
      } else {
        this.conversations = JSON.parse(JSON.stringify(RESEARCHER_INITIAL_CONVERSATIONS));
        this.save();
      }
    } catch {
      this.conversations = JSON.parse(JSON.stringify(RESEARCHER_INITIAL_CONVERSATIONS));
    }
    this.isInitialized = true;
  }

  private save() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations));
      } catch (e) {
        console.error('Failed to persist conversations to localStorage', e);
      }
    }
  }

  private emit(event: ChatEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Chat listener error', err);
      }
    });
  }

  public subscribe(listener: ChatEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async getConversations(): Promise<Conversation[]> {
    if (!this.isInitialized) {
      this.init();
    }
    // Simulate realistic async network delay on first call
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...this.conversations];
  }

  public getConversationById(id: string): Conversation | undefined {
    return this.conversations.find((c) => c.id === id);
  }

  public getTotalUnreadCount(): number {
    return this.conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
  }

  public markAsRead(convId: string): void {
    let changed = false;
    this.conversations = this.conversations.map((c) => {
      if (c.id === convId && c.unreadCount > 0) {
        changed = true;
        return { ...c, unreadCount: 0 };
      }
      return c;
    });

    if (changed) {
      this.save();
      const totalUnread = this.getTotalUnreadCount();
      this.emit({
        type: 'UNREAD_COUNT_CHANGED',
        conversationId: convId,
        totalUnread,
        conversations: this.conversations,
      });
      this.emit({
        type: 'CONVERSATIONS_UPDATED',
        conversationId: convId,
        conversations: this.conversations,
      });
    }
  }

  private getCurrentTime(): string {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  public async sendMessage(
    conversationId: string,
    text: string,
    attachment?: { name: string; type: 'file' | 'image' | 'shp'; size: string; url?: string }
  ): Promise<ChatMessage> {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) {
      throw new Error(`Percakapan dengan ID ${conversationId} tidak ditemukan.`);
    }

    const timeStr = this.getCurrentTime();
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 1. Optimistic message creation with 'sent' status
    const newMsg: ChatMessage = {
      id: messageId,
      senderId: 'usr-retno',
      senderName: 'Dr. Ir. Retno Wulandari, M.Si.',
      text,
      timestamp: timeStr,
      isOutgoing: true,
      status: 'sent',
      attachment,
    };

    const snippet = text || (attachment ? `📎 ${attachment.name}` : '');

    this.conversations = this.conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessageSnippet: snippet,
          lastMessageTime: timeStr,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    this.save();
    this.emit({
      type: 'MESSAGE_SENT',
      conversationId,
      message: newMsg,
      conversations: this.conversations,
    });

    // 2. Simulate server acknowledgement -> 'delivered'
    setTimeout(() => {
      this.updateMessageStatus(conversationId, messageId, 'delivered');
    }, 600);

    // 3. Simulate recipient reading message -> 'read' (if recipient is online)
    if (conv.isOnline) {
      setTimeout(() => {
        this.updateMessageStatus(conversationId, messageId, 'read');
      }, 1400);

      // 4. Trigger intelligent automatic reply from the recipient
      this.scheduleSimulatedReply(conversationId, conv, text);
    }

    return newMsg;
  }

  private updateMessageStatus(
    conversationId: string,
    messageId: string,
    status: 'delivered' | 'read'
  ) {
    this.conversations = this.conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: c.messages.map((m) => (m.id === messageId ? { ...m, status } : m)),
        };
      }
      return c;
    });
    this.save();
    this.emit({
      type: status === 'delivered' ? 'MESSAGE_DELIVERED' : 'MESSAGE_READ',
      conversationId,
      conversations: this.conversations,
    });
  }

  private scheduleSimulatedReply(conversationId: string, conv: Conversation, triggerText: string) {
    const lower = triggerText.toLowerCase();

    // Typing start indicator after 1s
    setTimeout(() => {
      this.emit({
        type: 'TYPING_START',
        conversationId,
        userId: conv.userId,
      });

      // Typing stop and reply delivery after 2.2s
      setTimeout(() => {
        this.emit({
          type: 'TYPING_STOP',
          conversationId,
          userId: conv.userId,
        });

        let replyContent = '';
        if (conv.userRole === 'SuperAdmin') {
          if (lower.includes('ekspor') || lower.includes('excel') || lower.includes('template')) {
            replyContent = 'Baik Bu Retno, format template 13-sheet sudah kami simpan di repositori master dan diteruskan ke reviewer.';
          } else if (lower.includes('perbaiki') || lower.includes('revisi')) {
            replyContent = 'Terima kasih atas pembaruannya. Status pengajuan di dashboard admin telah diperbarui ke status Dalam Tinjauan.';
          } else {
            replyContent = 'Siap Bu Retno, kami dari sekretariat PKSPL siap memfasilitasi jika ada kendala sistem atau master data.';
          }
        } else {
          // Analyst reply
          if (lower.includes('perbaiki') || lower.includes('revisi') || lower.includes('harga')) {
            replyContent = 'Baik Bu Retno, silakan diperbarui. Parameter harga satuan dan formula di sheet valuasi akan kami telaah ulang.';
          } else if (lower.includes('upload') || lower.includes('template') || lower.includes('data')) {
            replyContent = 'Data valuasi terbaru sudah kami terima. Seluruh unit penilai nursery ground dan seawall akan kami verifikasi.';
          } else if (lower.includes('review') || lower.includes('perhitungan') || lower.includes('tev')) {
            replyContent = 'Kalkulasi TEV sudah masuk daftar review saya Bu Retno. Saya akan kabari hasil validasinya segera.';
          } else if (lower.includes('shp') || lower.includes('gis') || lower.includes('peta')) {
            replyContent = 'File GIS SHP sudah kami cek koordinat poligonnya, batas zonasi sudah tepat dan tidak ada overlap.';
          } else {
            replyContent = 'Terima kasih atas update dan koordinasinya Bu Retno. Mohon pastikan seluruh data pendukung diunggah tepat waktu.';
          }
        }

        const replyTime = this.getCurrentTime();
        const incomingMsg: ChatMessage = {
          id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          senderId: conv.userId,
          senderName: conv.userName,
          text: replyContent,
          timestamp: replyTime,
          isOutgoing: false,
        };

        this.conversations = this.conversations.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessageSnippet: replyContent,
              lastMessageTime: replyTime,
              messages: [...c.messages, incomingMsg],
            };
          }
          return c;
        });

        this.save();
        this.emit({
          type: 'MESSAGE_RECEIVED',
          conversationId,
          message: incomingMsg,
          conversations: this.conversations,
        });
      }, 1500);
    }, 900);
  }

  public async uploadAttachment(
    file: File,
    type: 'file' | 'shp' | 'image',
    onProgress?: (percent: number) => void
  ): Promise<{ name: string; type: 'file' | 'shp' | 'image'; size: string; url?: string }> {
    // 1. File Size Validation (Max 25 MB)
    const MAX_SIZE_BYTES = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`Ukuran file (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimum 25 MB.`);
    }

    // 2. Format / Extension Validation
    const fileName = file.name.toLowerCase();
    if (type === 'file' && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      throw new Error('Format file tidak valid. Harap lampirkan spreadsheet Excel (.xlsx atau .xls).');
    }
    if (type === 'shp' && !fileName.endsWith('.zip')) {
      throw new Error('Format file tidak valid. Harap lampirkan layer GIS dalam arsip ZIP (.zip) yang memuat file .shp, .shx, dan .dbf.');
    }
    if (type === 'image' && !fileName.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) {
      throw new Error('Format gambar tidak valid. Harap lampirkan gambar berekstensi .png, .jpg, .jpeg, atau .webp.');
    }

    // 3. Realistic Upload Progress Simulation
    return new Promise((resolve) => {
      let progress = 0;
      onProgress?.(0);

      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 25) + 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          onProgress?.(100);

          // Calculate human readable size
          const sizeKb = file.size / 1024;
          const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${Math.round(sizeKb)} KB`;

          // Generate object URL for preview if image
          let previewUrl: string | undefined;
          if (type === 'image') {
            try {
              previewUrl = URL.createObjectURL(file);
            } catch {
              previewUrl = undefined;
            }
          }

          resolve({
            name: file.name,
            type,
            size: sizeStr,
            url: previewUrl,
          });
        } else {
          onProgress?.(progress);
        }
      }, 120);
    });
  }

  public createNewConversation(
    name: string,
    role: 'Analyst' | 'SuperAdmin',
    projectCode: string,
    initialMsg: string
  ): Conversation {
    const timeStr = this.getCurrentTime();
    const newId = `rconv-${Date.now()}`;
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const newConv: Conversation = {
      id: newId,
      userId: `usr-${Date.now()}`,
      userName: name,
      userRole: role,
      userAvatarBg: role === 'SuperAdmin' ? 'from-blue-600 to-indigo-600' : 'from-amber-600 to-rose-600',
      userInitials: initials || 'US',
      isOnline: true,
      projectCode: projectCode || 'PKS-994KY1',
      projectName: 'Proyek Valuasi Pesisir & Laut',
      unreadCount: 0,
      lastMessageSnippet: initialMsg,
      lastMessageTime: timeStr,
      messages: [
        {
          id: `rmsg-${Date.now()}`,
          senderId: 'usr-retno',
          senderName: 'Dr. Ir. Retno Wulandari, M.Si.',
          text: initialMsg,
          timestamp: timeStr,
          isOutgoing: true,
          status: 'sent',
        },
      ],
    };

    this.conversations = [newConv, ...this.conversations];
    this.save();

    this.emit({
      type: 'CONVERSATIONS_UPDATED',
      conversationId: newId,
      conversations: this.conversations,
    });

    // Simulate auto-delivery
    setTimeout(() => {
      this.updateMessageStatus(newId, newConv.messages[0].id, 'delivered');
      setTimeout(() => {
        this.updateMessageStatus(newId, newConv.messages[0].id, 'read');
        this.scheduleSimulatedReply(newId, newConv, initialMsg);
      }, 1200);
    }, 500);

    return newConv;
  }

  public triggerIncomingMessageSimulation(targetConvId?: string): void {
    const target = targetConvId
      ? this.conversations.find((c) => c.id === targetConvId)
      : this.conversations.find((c) => c.id !== 'rconv-1') || this.conversations[0];

    if (!target) return;

    const timeStr = this.getCurrentTime();
    const simulatedMsg: ChatMessage = {
      id: `sim-${Date.now()}`,
      senderId: target.userId,
      senderName: target.userName,
      text: `Halo Bu Retno, mohon informasi apakah ada kendala dalam kompilasi data valuasi ${target.projectCode || 'proyek'}?`,
      timestamp: timeStr,
      isOutgoing: false,
    };

    this.conversations = this.conversations.map((c) => {
      if (c.id === target.id) {
        return {
          ...c,
          unreadCount: (c.unreadCount || 0) + 1,
          lastMessageSnippet: simulatedMsg.text,
          lastMessageTime: timeStr,
          messages: [...c.messages, simulatedMsg],
        };
      }
      return c;
    });

    this.save();
    const totalUnread = this.getTotalUnreadCount();

    this.emit({
      type: 'MESSAGE_RECEIVED',
      conversationId: target.id,
      message: simulatedMsg,
      totalUnread,
      conversations: this.conversations,
    });
    this.emit({
      type: 'UNREAD_COUNT_CHANGED',
      conversationId: target.id,
      totalUnread,
      conversations: this.conversations,
    });
    this.emit({
      type: 'CONVERSATIONS_UPDATED',
      conversationId: target.id,
      conversations: this.conversations,
    });
  }

  public resetMockData(): void {
    this.conversations = JSON.parse(JSON.stringify(RESEARCHER_INITIAL_CONVERSATIONS));
    this.save();
    this.emit({
      type: 'CONVERSATIONS_UPDATED',
      conversations: this.conversations,
      totalUnread: this.getTotalUnreadCount(),
    });
  }
}

export const chatService = new ChatService();
