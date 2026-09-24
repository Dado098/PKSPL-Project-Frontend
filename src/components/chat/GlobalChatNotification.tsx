import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getEcho } from '../../lib/echo';
import { playNotificationSound } from '../../lib/notificationSound';

interface ActiveChatToast {
  id: string; // message id
  senderId: string;
  senderName: string;
  senderRole?: string;
  conversationId: string;
  text: string;
  timestamp: string;
}

export const GlobalChatNotification: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeToast, setActiveToast] = useState<ActiveChatToast | null>(null);
  const processedMessageIdsRef = useRef<Set<string>>(new Set());
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentUserId = user?.id || (user as any)?.id_user;
  const currentUserRole = (user as any)?.role?.nama_role || (user as any)?.role || '';

  useEffect(() => {
    if (!currentUserId || isNaN(Number(currentUserId))) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`user.${currentUserId}`);

    channel.listen('.ChatMessageSent', (event: any) => {
      if (!event?.message) return;

      const rawMsg = event.message;
      const msgId = String(rawMsg.id || rawMsg.id_message || '');
      const senderId = String(rawMsg.sender_id || rawMsg.senderId || rawMsg.id_sender || '');
      const conversationId = String(event.conversation_id || rawMsg.conversation_id || rawMsg.conversationId || '');
      const senderName = rawMsg.sender_name || rawMsg.senderName || rawMsg.sender?.nama || rawMsg.sender?.name || 'Pengguna';
      const senderRole = rawMsg.sender_role || rawMsg.senderRole || rawMsg.sender?.role?.nama_role || '';
      const text = rawMsg.message || rawMsg.text || (rawMsg.attachments?.length ? '📎 Mengirim berkas lampiran' : 'Mengirim pesan');

      // 1. Abaikan pesan milik diri sendiri
      if (senderId && String(senderId) === String(currentUserId)) {
        return;
      }

      // 2. Proteksi Deduplikasi Event (Pastikan 1 pesan tidak berbunyi / muncul popup 2x)
      if (msgId) {
        if (processedMessageIdsRef.current.has(msgId)) {
          return;
        }
        processedMessageIdsRef.current.add(msgId);
        // Batasi ukuran set agar memori tetap optimal
        if (processedMessageIdsRef.current.size > 150) {
          const firstAdded = processedMessageIdsRef.current.values().next().value;
          if (firstAdded) processedMessageIdsRef.current.delete(firstAdded);
        }
      }

      // 3. Supresi Cerdas: Jangan bunyikan sound / tampilkan popup jika user sedang aktif membuka percakapan yang sama
      const path = window.location.pathname;
      const search = window.location.search;
      const isViewingMessages =
        path.includes('/messages') ||
        path.includes('/discussions') ||
        path.includes('/pesan');

      const isCurrentConversationActive =
        isViewingMessages &&
        document.visibilityState === 'visible' &&
        (search.includes(senderId) || path.includes(senderId) || search.includes(conversationId) || path.includes(conversationId));

      if (isCurrentConversationActive) {
        // User sedang membuka chat yang sama: jangan spam popup & sound
        return;
      }

      // 4. Putar Suara Denting Notifikasi
      playNotificationSound();

      // 5. Tampilkan Popup Toast Notifikasi
      setActiveToast({
        id: msgId,
        senderId,
        senderName,
        senderRole,
        conversationId,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      // Atur timer otomatis tertutup setelah 7 detik
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      dismissTimerRef.current = setTimeout(() => {
        setActiveToast(null);
      }, 7000);
    });

    return () => {
      channel.stopListening('.ChatMessageSent');
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [currentUserId]);

  // Tutup popup toast saat berpindah halaman secara manual
  useEffect(() => {
    setActiveToast(null);
  }, [location.pathname]);

  if (!activeToast) return null;

  const handleOpenChat = () => {
    const roleNormalized = String(currentUserRole).toLowerCase();
    let targetUrl = '/analyst/messages';

    if (roleNormalized.includes('admin')) {
      targetUrl = `/admin/messages?user=${activeToast.senderId}`;
    } else if (roleNormalized.includes('peneliti')) {
      targetUrl = `/peneliti/messages?user=${activeToast.senderId}`;
    } else {
      // Default Analyst
      targetUrl = `/analyst/messages?user=${activeToast.senderId}`;
    }

    setActiveToast(null);
    navigate(targetUrl);
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-200/80 p-4 flex flex-col gap-2.5 backdrop-blur-md bg-white/95">
        {/* Toast Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                Pesan Baru
              </span>
              <span className="text-[10px] text-slate-400">
                {activeToast.timestamp}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sender & Message Preview */}
        <div className="px-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-semibold text-slate-800 truncate">
              {activeToast.senderName}
            </span>
            {activeToast.senderRole && (
              <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-600">
                {activeToast.senderRole}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            "{activeToast.text}"
          </p>
        </div>

        {/* Action Button: Buka Pesan */}
        <button
          onClick={handleOpenChat}
          className="mt-1 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-blue-500/20 cursor-pointer"
        >
          <span>Buka Pesan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default GlobalChatNotification;
