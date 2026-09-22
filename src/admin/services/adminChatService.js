import { apiClient } from '../../analyst/services/api';

/**
 * Helper untuk menentukan warna latar gradien avatar berdasarkan role
 */
export const getAvatarBg = (role) => {
  const roleName = typeof role === 'object' ? role?.nama_role : role;
  switch (roleName) {
    case 'Analyst':
      return 'from-amber-600 to-rose-600';
    case 'Peneliti':
      return 'from-blue-600 to-indigo-600';
    case 'Admin':
    case 'Administrator':
      return 'from-purple-600 to-indigo-600';
    default:
      return 'from-slate-600 to-slate-800';
  }
};

/**
 * Helper untuk menghasilkan inisial 2 huruf kapital
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U'
  );
};

/**
 * Helper format waktu ke HH:mm
 */
export const formatTime = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return '';
  }
};

/**
 * Helper format ukuran file manusiawi
 */
export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '';
  const num = Number(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Helper format status terakhir aktif
 */
export const formatLastSeen = (val, isOnline) => {
  if (isOnline) return 'Online';
  if (!val) return 'Offline';
  if (val === 'Online' || val === 'online') return 'Online';
  try {
    const date = new Date(val);
    if (isNaN(date.getTime())) return String(val);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  } catch {
    return String(val);
  }
};

export const adminChatService = {
  /**
   * Mengambil daftar seluruh percakapan yang diikuti Admin dari database
   */
  async getConversations(currentUserId) {
    try {
      const res = await apiClient.get('/conversations');
      if (res && Array.isArray(res.data)) {
        return res.data.map((item) => {
          // Cari lawan bicara (bukan current user)
          const participants = item.participants || [];
          const otherParticipant =
            participants.find(
              (p) => String(p.id_user || p.id) !== String(currentUserId)
            ) ||
            item.otherUser ||
            item.other_user ||
            {};

          const otherUser = otherParticipant.user || otherParticipant;
          const otherUserId = otherUser.id_user || otherUser.id || otherParticipant.id_user;
          const otherUserName = otherUser.nama || otherUser.name || item.title || 'Pengguna PKSPL';
          const otherRole = otherUser.role?.nama_role || otherUser.role || 'User';

          const latestMsg = item.latestMessage || item.latest_message;
          const isOnline = Boolean(otherUser.is_online ?? otherUser.isOnline);

          return {
            id: String(item.id || item.id_conversation),
            userId: String(otherUserId || ''),
            userName: otherUserName,
            userRole: otherRole,
            userAvatarBg: getAvatarBg(otherRole),
            userInitials: getInitials(otherUserName),
            isOnline,
            lastSeen: formatLastSeen(otherUser.last_seen_at || otherUser.last_seen || otherUser.lastSeen, isOnline),
            projectCode: item.proyek?.kode_proyek || '',
            projectName: item.proyek?.nama_proyek || '',
            unreadCount: item.unread_count ?? item.unreadCount ?? 0,
            lastMessageSnippet: latestMsg
              ? latestMsg.message || (latestMsg.attachments?.length > 0 ? `📎 ${latestMsg.attachments[0].file_name}` : '')
              : '',
            lastMessageTime: formatTime(latestMsg?.created_at || item.updated_at),
            messages: [],
          };
        });
      }
    } catch (e) {
      console.warn('[adminChatService] Gagal memuat percakapan dari API:', e);
    }
    return [];
  },

  /**
   * Mengambil direktori pengguna resmi dari database yang dapat dihubungi oleh Admin
   */
  async getDirectoryUsers(searchQuery = '') {
    try {
      const params = searchQuery ? { search: searchQuery } : undefined;
      const res = await apiClient.get('/chat/directory', params);
      if (res && Array.isArray(res.data)) {
        return res.data.map((u) => {
          const isOnline = Boolean(u.isOnline ?? u.is_online);
          const roleName = u.role?.nama_role || u.role || 'User';
          return {
            id: String(u.id || u.id_user),
            nama: u.nama || u.name,
            email: u.email,
            role: roleName,
            isOnline,
            lastSeen: formatLastSeen(u.lastSeen || u.last_seen, isOnline),
            userAvatarBg: getAvatarBg(roleName),
            userInitials: getInitials(u.nama || u.name),
            associatedProjects: u.associatedProjects || u.associated_projects || [],
          };
        });
      }
    } catch (e) {
      console.warn('[adminChatService] Gagal memuat direktori pengguna:', e);
    }
    return [];
  },

  /**
   * Mengambil riwayat pesan percakapan tertentu dari database
   */
  async getMessages(conversationId, currentUserId) {
    try {
      const res = await apiClient.get(`/conversations/${conversationId}/messages`, { per_page: 100 });
      if (res && Array.isArray(res.data)) {
        return res.data.map((m) => {
          const senderId = String(m.sender_id || m.id_sender || m.senderId || '');
          const isOutgoing = currentUserId ? senderId === String(currentUserId) : false;
          const firstAtt = m.attachments?.[0];

          let attachment = null;
          if (firstAtt) {
            attachment = {
              id: firstAtt.id || firstAtt.id_attachment,
              name: firstAtt.file_name || firstAtt.fileName || 'Lampiran',
              size: formatFileSize(firstAtt.file_size || firstAtt.fileSize),
              type: firstAtt.file_type || firstAtt.fileType || 'file',
              url: firstAtt.url,
            };
          }

          return {
            id: String(m.id || m.id_message),
            conversationId: String(m.conversation_id || m.id_conversation || conversationId),
            senderId,
            senderName: m.sender_name || m.senderName || m.sender?.nama || 'Pengguna',
            text: m.message || m.text || '',
            timestamp: formatTime(m.created_at || m.createdAt),
            createdAt: m.created_at || m.createdAt,
            isOutgoing,
            status: m.read_at ? 'read' : 'sent',
            attachment,
          };
        });
      }
    } catch (e) {
      console.warn(`[adminChatService] Gagal memuat riwayat pesan conv #${conversationId}:`, e);
    }
    return [];
  },

  /**
   * Mengirim pesan baru ke percakapan (teks dan/atau berkas lampiran)
   */
  async sendMessage(conversationId, text, file, currentUserId, currentUserName) {
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (text) formData.append('message', text);
        res = await apiClient.upload(`/conversations/${conversationId}/messages`, formData);
      } else {
        res = await apiClient.post(`/conversations/${conversationId}/messages`, {
          message: text,
        });
      }

      if (res && res.data) {
        const m = res.data;
        const firstAtt = m.attachments?.[0];
        let attachment = null;
        if (firstAtt) {
          attachment = {
            id: firstAtt.id || firstAtt.id_attachment,
            name: firstAtt.file_name || firstAtt.fileName || 'Lampiran',
            size: formatFileSize(firstAtt.file_size || firstAtt.fileSize),
            type: firstAtt.file_type || firstAtt.fileType || 'file',
            url: firstAtt.url,
          };
        }

        return {
          id: String(m.id || m.id_message),
          conversationId: String(conversationId),
          senderId: String(currentUserId),
          senderName: currentUserName || 'Administrator',
          text: m.message || text,
          timestamp: formatTime(m.created_at || new Date().toISOString()),
          createdAt: m.created_at || new Date().toISOString(),
          isOutgoing: true,
          status: 'read',
          attachment,
        };
      }
    } catch (e) {
      console.error('[adminChatService] Gagal mengirim pesan ke backend:', e);
      throw e;
    }
  },

  /**
   * Menandai seluruh pesan dalam percakapan sebagai telah dibaca
   */
  async markAsRead(conversationId) {
    try {
      await apiClient.post(`/conversations/${conversationId}/read`);
    } catch (e) {
      console.warn(`[adminChatService] Gagal menandai baca conv #${conversationId}:`, e);
    }
  },

  /**
   * Membuka atau membuat thread percakapan baru dengan seorang pengguna
   */
  async getOrCreateConversation(recipientId, initialMessage = null) {
    try {
      const res = await apiClient.post('/conversations', {
        recipient_id: Number(recipientId),
      });

      if (res && res.data) {
        const conv = res.data;
        const convId = String(conv.id || conv.id_conversation);

        // Jika ada pesan awal, langsung kirimkan ke thread
        if (initialMessage && initialMessage.trim()) {
          try {
            await apiClient.post(`/conversations/${convId}/messages`, {
              message: initialMessage.trim(),
            });
          } catch (err) {
            console.warn('[adminChatService] Gagal mengirim pesan awal:', err);
          }
        }

        return convId;
      }
    } catch (e) {
      console.error('[adminChatService] Gagal membuat/mengambil percakapan:', e);
      throw e;
    }
  },

  /**
   * Mengambil total pesan obrolan yang belum dibaca untuk badge sidebar
   */
  async getTotalUnreadCount() {
    try {
      const res = await apiClient.get('/conversations');
      if (res && Array.isArray(res.data)) {
        return res.data.reduce((acc, c) => acc + Number(c.unread_count || c.unreadCount || 0), 0);
      }
    } catch (e) {
      // ignore
    }
    return 0;
  },
};
