import React, { useState, useEffect, useCallback } from 'react';
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
      }
    } catch (err) {
      console.error('Gagal memuat data diskusi:', err);
    } finally {
      setIsLoading(false);
    }
  }, [researcherId, searchParams]);

  useEffect(() => {
    loadData();
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

  // 3. Handler pilih percakapan
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileChat(true);
  };

  // 4. Handler mulai percakapan baru dengan Peneliti
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

  // 5. Handler kirim pesan baru
  const handleSendMessage = async (
    text: string,
    projectContext?: ProjectContext,
    attachments?: ChatAttachment[]
  ) => {
    if (!selectedConversationId) return;

    try {
      setIsSending(true);
      const senderName = user?.name || 'Analyst PKSPL';

      const sentMessage = await discussionService.sendMessage(
        {
          conversationId: selectedConversationId,
          text,
          projectContext,
          attachments
        },
        senderName
      );

      // Tambahkan ke messages lokal
      setMessages((prev) => [...prev, sentMessage]);

      // Ambil kembali daftar percakapan agar yang terbaru langsung pindah ke urutan teratas
      const updatedConvs = await discussionService.getConversations();
      setConversations(updatedConvs);
    } catch (err) {
      console.error('Gagal mengirim pesan:', err);
    } finally {
      setIsSending(false);
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
    <div className="h-[calc(100vh-6.5rem)] min-h-[580px] bg-white rounded-2xl border border-slate-200 shadow-xs flex overflow-hidden">
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
          />
        ) : (
          <ChatEmptyState
            researchers={allResearchers}
            onSelectResearcher={handleStartNewChat}
          />
        )}
      </div>
    </div>
  );
};

export default AnalystDiscussionPage;
