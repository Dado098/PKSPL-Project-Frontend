import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAnalyst } from '../context/AnalystContext';
import {
  Conversation,
  ChatMessage,
  ResearcherUser,
  ProjectContext,
  ChatAttachment
} from '../types/discussion';
import { discussionService } from '../services/discussionService';
import { ChatResearcherList } from '../components/discussion/ChatResearcherList';
import { ChatConversationArea } from '../components/discussion/ChatConversationArea';
import { ChatEmptyState } from '../components/discussion/ChatEmptyState';
import { TableSkeleton } from '../components/common/SkeletonLoader';
import { getEcho } from '../../lib/echo';
import { AlertCircle, X } from 'lucide-react';

export const AnalystDiscussionPage: React.FC = () => {
  const { user } = useAnalyst();
  const { researcherId } = useParams<{ researcherId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allResearchers, setAllResearchers] = useState<ResearcherUser[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showMobileChat, setShowMobileChat] = useState<boolean>(false);
  const [pageError, setPageError] = useState<string | null>(null);

  // Real-time Typing Indicator States
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUserName, setTypingUserName] = useState<string>('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset typing on conversation change
  useEffect(() => {
    setIsTyping(false);
    setTypingUserName('');
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [selectedConversationId]);

  // 1. Muat data awal (conversations & allResearchers)
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [convs, researchers] = await Promise.all([
        discussionService.getConversations(),
        discussionService.getAllResearchers()
      ]);
      setConversations(convs);
      setAllResearchers(researchers);

      // Cek apakah ada target researcher dari URL params
      const targetResearcherId = researcherId || searchParams.get('user');
      if (targetResearcherId) {
        const found = convs.find((c) => c.researcherId === targetResearcherId);
        if (found) {
          setSelectedConversationId(found.id);
          setShowMobileChat(true);
        } else {
          // Buat thread baru jika belum ada
          const newConv = await discussionService.getOrCreateConversation(targetResearcherId);
          setConversations(await discussionService.getConversations());
          setSelectedConversationId(newConv.id);
          setShowMobileChat(true);
        }
      } else if (!selectedConversationId && convs.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 768) {
        setSelectedConversationId(convs[0].id);
      }
    } catch (err) {
      console.error('Gagal memuat data diskusi:', err);
    } finally {
      setIsLoading(false);
    }
  }, [researcherId, searchParams]);

  useEffect(() => {
    loadData();
    discussionService.startHeartbeat();
  }, [loadData]);

  // 2. Muat pesan saat selectedConversationId berubah
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const msgs = await discussionService.getMessages(selectedConversationId);
        if (isMounted) {
          setMessages(msgs);
        }
        // Tandai pesan sebagai telah dibaca
        await discussionService.markConversationAsRead(selectedConversationId);
        // Perbarui state unread count lokal
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversationId ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch (err) {
        console.error('Gagal memuat riwayat pesan:', err);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedConversationId]);

  // 3. Realtime WebSocket subscription via Laravel Echo (Reverb)
  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    // Listen on user private channel untuk memperbarui percakapan & unread count
    let userChannel: any = null;
    if (user?.id && !isNaN(Number(user.id))) {
      userChannel = echo.private(`user.${user.id}`);
      userChannel.listen('.ChatMessageSent', async () => {
        try {
          const updatedConvs = await discussionService.getConversations();
          setConversations(updatedConvs);
        } catch (err) {
          // ignore
        }
      });
    }

    // Listen on active conversation channel untuk pesan masuk & indikator mengetik secara instan
    let convChannel: any = null;
    if (selectedConversationId && !isNaN(Number(selectedConversationId))) {
      convChannel = echo.private(`conversation.${selectedConversationId}`);
      convChannel.listen('.ChatMessageSent', (event: any) => {
        if (event?.message) {
          const incoming = discussionService.mapMessage(event.message);
          const isSender = (user?.id && String(incoming.senderId) === String(user.id)) || incoming.senderRole?.toLowerCase() === 'analyst';
          const resolvedIncoming: ChatMessage = {
            ...incoming,
            isOutgoing: incoming.isOutgoing ?? isSender,
          };
          setMessages((prev) => {
            if (prev.some((m) => m.id === resolvedIncoming.id)) return prev;
            return [...prev, resolvedIncoming];
          });
          setIsTyping(false);
          discussionService.markConversationAsRead(selectedConversationId);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === selectedConversationId ? { ...c, unreadCount: 0 } : c
            )
          );
        }
      });

      // Sinyal pengetikan cepat sub-30ms via Client Whisper
      convChannel.listenForWhisper('typing', (event: any) => {
        if (event?.userId && String(event.userId) !== String(user?.id)) {
          if (event.isTyping !== false) {
            setIsTyping(true);
            if (event.userName) setTypingUserName(event.userName);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 3500);
          } else {
            setIsTyping(false);
          }
        }
      });

      // Sinyal pengetikan backend broadcast via UserTyping
      convChannel.listen('.UserTyping', (event: any) => {
        if (event?.userId && String(event.userId) !== String(user?.id)) {
          if (event.isTyping) {
            setIsTyping(true);
            if (event.userName) setTypingUserName(event.userName);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 3500);
          } else {
            setIsTyping(false);
          }
        }
      });

      // Sinyal saat pesan telah dibaca oleh lawan bicara (WhatsApp Blue Checkmarks)
      convChannel.listen('.MessagesRead', (event: any) => {
        setMessages((prev) =>
          prev.map((m) => {
            const isMe = (user?.id && String(m.senderId) === String(user?.id)) || m.senderRole?.toLowerCase() === 'analyst';
            if (isMe) {
              return { ...m, isRead: true, status: 'read' as const };
            }
            return m;
          })
        );
      });

      // Update pesan saat diedit realtime
      convChannel.listen('.ChatMessageUpdated', (event: any) => {
        if (event?.message) {
          const updated = discussionService.mapMessage(event.message);
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, ...updated, isEdited: true } : m))
          );
        }
      });

      // Update pesan saat dihapus realtime
      convChannel.listen('.ChatMessageDeleted', (event: any) => {
        const deletedId = String(event.message_id || event.message?.id || event.message?.id_message);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === deletedId
              ? { ...m, text: 'Pesan telah dihapus', isDeleted: true, attachments: [] }
              : m
          )
        );
      });
    }

    // Presence channel 'online' untuk mendeteksi user aktif realtime
    const presenceChannel = echo.join('online');
    presenceChannel.here((users: any[]) => {
      const onlineIds = new Set(users.map((u) => String(u.id || u.id_user)));
      setConversations((prev) =>
        prev.map((c) => {
          const isOnline = onlineIds.has(String(c.researcherId));
          return {
            ...c,
            researcher: {
              ...c.researcher,
              isOnline,
              lastSeen: isOnline ? 'Online' : c.researcher.lastSeen,
            },
          };
        })
      );
      setAllResearchers((prev) =>
        prev.map((r) => {
          const isOnline = onlineIds.has(String(r.id));
          return {
            ...r,
            isOnline,
            lastSeen: isOnline ? 'Online' : r.lastSeen,
          };
        })
      );
    });

    presenceChannel.joining((u: any) => {
      const uid = String(u.id || u.id_user);
      setConversations((prev) =>
        prev.map((c) => {
          if (String(c.researcherId) === uid) {
            return {
              ...c,
              researcher: {
                ...c.researcher,
                isOnline: true,
                lastSeen: 'Online',
              },
            };
          }
          return c;
        })
      );
      setAllResearchers((prev) =>
        prev.map((r) => {
          if (String(r.id) === uid) {
            return { ...r, isOnline: true, lastSeen: 'Online' };
          }
          return r;
        })
      );
      // Jika lawan bicara yang sedang aktif bergabung, pesan outgoing sent berubah menjadi delivered (ceklis 2 abu-abu)
      setMessages((prev) =>
        prev.map((m) => {
          const isMe = (user?.id && String(m.senderId) === String(user?.id)) || m.senderRole?.toLowerCase() === 'analyst';
          if (isMe && m.status === 'sent') {
            return { ...m, status: 'delivered' as const };
          }
          return m;
        })
      );
    });

    presenceChannel.leaving((u: any) => {
      const uid = String(u.id || u.id_user);
      setConversations((prev) =>
        prev.map((c) => {
          if (String(c.researcherId) === uid) {
            return {
              ...c,
              researcher: {
                ...c.researcher,
                isOnline: false,
                lastSeen: 'Baru saja',
              },
            };
          }
          return c;
        })
      );
      setAllResearchers((prev) =>
        prev.map((r) => {
          if (String(r.id) === uid) {
            return { ...r, isOnline: false, lastSeen: 'Baru saja' };
          }
          return r;
        })
      );
    });

    return () => {
      if (convChannel && selectedConversationId) {
        convChannel.stopListening('.ChatMessageSent');
        convChannel.stopListeningForWhisper('typing');
        convChannel.stopListening('.UserTyping');
        convChannel.stopListening('.MessagesRead');
        convChannel.stopListening('.ChatMessageUpdated');
        convChannel.stopListening('.ChatMessageDeleted');
      }
      if (userChannel && user?.id) {
        userChannel.stopListening('.ChatMessageSent');
      }
      if (presenceChannel) {
        echo.leave('online');
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user?.id, selectedConversationId]);

  // 4. Polling fallback jika WebSocket terputus / reconnect
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        try {
          const convs = await discussionService.getConversations();
          setConversations(convs);

          if (selectedConversationId) {
            const msgs = await discussionService.getMessages(selectedConversationId);
            setMessages(msgs);
          }
        } catch (err) {
          // ignore silent error
        }
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [selectedConversationId]);

  // 5. Handler pilih percakapan
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileChat(true);
  };

  // 6. Handler mulai percakapan baru dengan Peneliti
  const handleStartNewChat = async (resId: string) => {
    try {
      setIsLoading(true);
      const conv = await discussionService.getOrCreateConversation(resId);
      const updatedConvs = await discussionService.getConversations();
      setConversations(updatedConvs);
      setSelectedConversationId(conv.id);
      setShowMobileChat(true);
    } catch (err) {
      console.error('Gagal memulai percakapan baru:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Handler kirim pesan baru (teks dan/atau berkas telaah)
  const handleSendMessage = async (
    text: string,
    projectContext?: ProjectContext,
    attachments?: ChatAttachment[]
  ) => {
    if (!selectedConversationId) return;

    try {
      setIsSending(true);
      setPageError(null);
      const senderName = user?.name || 'Analyst PKSPL';
      const fileToUpload = attachments?.[0]?.file;

      const sentMessage = await discussionService.sendMessage(
        {
          conversationId: selectedConversationId,
          text,
          projectContext,
          attachments
        },
        senderName,
        fileToUpload
      );

      const targetIsOnline = activeResearcher?.isOnline;
      const initialStatus = targetIsOnline ? 'delivered' : 'sent';
      const resolvedMessage: ChatMessage = {
        ...sentMessage,
        isOutgoing: true,
        status: sentMessage.status || initialStatus,
      };

      // Tambahkan ke messages lokal jika belum ada
      setMessages((prev) => {
        if (prev.some((m) => m.id === resolvedMessage.id)) return prev;
        return [...prev, resolvedMessage];
      });

      // Ambil kembali daftar percakapan agar yang terbaru langsung pindah ke urutan teratas
      const updatedConvs = await discussionService.getConversations();
      setConversations(updatedConvs);
    } catch (err: any) {
      console.error('Gagal mengirim pesan:', err);
      setPageError(err.message || 'Gagal mengirim pesan.');
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    if (!selectedConversationId) return;
    try {
      setPageError(null);
      const updated = await discussionService.editMessage(selectedConversationId, messageId, newText);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, text: updated.text, isEdited: true } : m))
      );
    } catch (err: any) {
      console.error('Gagal mengedit pesan:', err);
      setPageError(err.message || 'Gagal menyimpan perubahan pesan. Pastikan Anda memiliki izin.');
      throw err;
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedConversationId) return;
    try {
      setPageError(null);
      await discussionService.deleteMessage(selectedConversationId, messageId);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, text: 'Pesan telah dihapus', isDeleted: true, attachments: [] }
            : m
        )
      );
    } catch (err: any) {
      console.error('Gagal menghapus pesan:', err);
      setPageError(err.message || 'Gagal menghapus pesan. Pastikan Anda memiliki izin.');
      throw err;
    }
  };

  // 6. Temukan percakapan aktif & objek penelitinya
  const activeConversation = conversations.find((c) => c.id === selectedConversationId);
  const activeResearcher = activeConversation?.researcher;

  if (isLoading && conversations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 min-h-[600px] flex flex-col justify-center items-center">
        <div className="w-full max-w-lg space-y-4">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[580px] flex flex-col overflow-hidden">
      {/* Action Error Banner if any */}
      {pageError && (
        <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between shadow-2xs z-20 animate-in fade-in duration-150 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{pageError}</span>
          </div>
          <button
            type="button"
            onClick={() => setPageError(null)}
            className="p-1 text-rose-400 hover:text-rose-700 rounded-md cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex overflow-hidden min-h-0">
      {/* Kolom Kiri: Daftar Peneliti & Percakapan */}
      <div
        className={`w-full md:w-80 lg:w-[380px] shrink-0 h-full ${
          showMobileChat ? 'hidden md:flex flex-col' : 'flex flex-col'
        }`}
      >
        <ChatResearcherList
          conversations={conversations}
          allResearchers={allResearchers}
          selectedConversationId={selectedConversationId || undefined}
          onSelectConversation={handleSelectConversation}
          onStartNewChat={handleStartNewChat}
        />
      </div>

      {/* Kolom Kanan: Area Percakapan Aktif atau Empty State */}
      <div
        className={`flex-1 h-full min-w-0 ${
          !showMobileChat ? 'hidden md:flex flex-col' : 'flex flex-col'
        }`}
      >
        {activeConversation && activeResearcher ? (
          <ChatConversationArea
            conversation={activeConversation}
            messages={messages}
            researcher={activeResearcher}
            onSendMessage={handleSendMessage}
            onBackToList={() => setShowMobileChat(false)}
            isLoading={isSending}
            currentUserId={user?.id}
            isTyping={isTyping}
            typingUserName={typingUserName}
            onTyping={(typing) => {
              if (selectedConversationId) {
                discussionService.sendTyping(selectedConversationId, typing, user?.id);
              }
            }}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        ) : (
          <ChatEmptyState
            researchers={allResearchers}
            onSelectResearcher={handleStartNewChat}
          />
        )}
      </div>
    </div>
  </div>
  );
};

export default AnalystDiscussionPage;
