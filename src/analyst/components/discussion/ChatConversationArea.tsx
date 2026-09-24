import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  Info,
  FolderKanban,
  MessageSquareQuote
} from 'lucide-react';
import {
  Conversation,
  ChatMessage,
  ResearcherUser,
  ProjectContext,
  ChatAttachment
} from '../../types/discussion';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatInputComposer } from './ChatInputComposer';

interface ChatConversationAreaProps {
  conversation: Conversation;
  messages: ChatMessage[];
  researcher: ResearcherUser;
  onSendMessage: (text: string, projectContext?: ProjectContext, attachments?: ChatAttachment[]) => void;
  onBackToList?: () => void; // Untuk tampilan mobile
  isLoading?: boolean;
  currentUserId?: string | number;
  isTyping?: boolean;
  typingUserName?: string;
  onTyping?: (isTyping: boolean) => void;
  onEditMessage?: (messageId: string, newText: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
}

export const ChatConversationArea: React.FC<ChatConversationAreaProps> = ({
  conversation,
  messages,
  researcher,
  onSendMessage,
  onBackToList,
  isLoading = false,
  currentUserId,
  isTyping = false,
  typingUserName,
  onTyping,
  onEditMessage,
  onDeleteMessage,
}) => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbawah saat messages bertambah, conversation berganti, atau sedang mengetik
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, conversation.id, isTyping]);

  const isAdministrator =
    researcher.name.toLowerCase().includes('admin') ||
    researcher.email?.toLowerCase().includes('admin') ||
    researcher.academicTitle?.toLowerCase().includes('admin');
  const activeProject = !isAdministrator ? researcher.associatedProjects?.[0] : null;

  return (
    <div className="h-full flex flex-col bg-slate-50/40 relative">
      {/* 1. Header Percakapan */}
      <div className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Kembali ke daftar pesan"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Avatar with Status Dot */}
          <div className="relative shrink-0">
            <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center border shadow-2xs ${
              isAdministrator
                ? 'bg-purple-100 text-purple-700 border-purple-200'
                : 'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {researcher.name.charAt(0)}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                researcher.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>

          {/* Name & Role Badge / Status */}
          <div className="truncate min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {researcher.name}
              </h2>
              <span className={`hidden sm:inline-block px-2 py-0.2 text-[10px] font-semibold rounded-full border shrink-0 ${
                isAdministrator
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {isAdministrator
                  ? 'Administrator'
                  : (researcher.academicTitle && !researcher.academicTitle.toLowerCase().includes('peneliti utama')
                    ? researcher.academicTitle
                    : 'Peneliti')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  researcher.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className={`truncate ${researcher.isOnline ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                {researcher.isOnline
                  ? 'Online'
                  : researcher.lastSeen
                  ? researcher.lastSeen.toLowerCase().startsWith('terakhir') || researcher.lastSeen.toLowerCase().startsWith('aktif')
                    ? researcher.lastSeen
                    : `Terakhir online ${researcher.lastSeen}`
                  : 'Terakhir online baru saja'}
              </span>
              <span className="opacity-40">•</span>
              <span className="truncate max-w-[200px] text-slate-400 hidden sm:inline">
                {researcher.specialization}
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions: Quick Project Jump Link */}
        {activeProject && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/analyst/projects/${activeProject.code}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-all shadow-2xs"
              title={`Buka lembar review proyek ${activeProject.code}`}
            >
              <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono">{activeProject.code}</span>
              <ExternalLink className="w-3 h-3 opacity-60 hidden sm:inline" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Area Riwayat Pesan (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Banner Percakapan Aman & Internal */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 text-slate-600 text-[10px] font-medium border border-slate-300/50">
            <span>🔒 Kanal Pesan Resmi Internal PKSPL IPB University</span>
          </div>
        </div>

        {/* Jika belum ada pesan sama sekali */}
        {messages.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
              Mulai Percakapan dengan {researcher.name}
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm">
              Belum ada riwayat pesan sebelumnya. Kirim pesan pertama untuk konsultasi telaah valuasi, klarifikasi batas spasial, atau tindak lanjut revisi.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              researcherName={researcher.name}
              currentUserId={currentUserId}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          ))
        )}

        {/* Real-time Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-2 bg-white/95 border border-slate-200 rounded-xl w-fit shadow-2xs animate-in fade-in duration-200">
            <div className="flex gap-1 items-center px-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {typingUserName || researcher.name} sedang mengetik...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Composer Input */}
      <ChatInputComposer
        researcher={researcher}
        onSendMessage={onSendMessage}
        disabled={isLoading}
        onTyping={onTyping}
      />
    </div>
  );
};
