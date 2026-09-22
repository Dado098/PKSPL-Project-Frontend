import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  Users,
  X,
  Plus,
  Circle,
  FolderKanban,
  CheckCheck
} from 'lucide-react';
import { Conversation, ResearcherUser } from '../../types/discussion';

interface ChatResearcherListProps {
  conversations: Conversation[];
  allResearchers: ResearcherUser[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onStartNewChat: (researcherId: string) => void;
}

export const ChatResearcherList: React.FC<ChatResearcherListProps> = ({
  conversations,
  allResearchers,
  selectedConversationId,
  onSelectConversation,
  onStartNewChat
}) => {
  const [activeTab, setActiveTab] = useState<'conversations' | 'all'>('conversations');
  const [searchQuery, setSearchQuery] = useState('');

  // Hitung total unread messages
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // Peneliti yang belum memiliki thread obrolan aktif
  const existingResearcherIds = new Set(conversations.map((c) => c.researcherId));
  const researchersWithoutChat = allResearchers.filter(
    (r) => !existingResearcherIds.has(r.id)
  );

  // Filter conversations berdasarkan search query
  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (c.researcher?.name || '').toLowerCase().includes(q);
    const specMatch = (c.researcher?.specialization || '').toLowerCase().includes(q);
    const messageMatch = c.lastMessage?.text.toLowerCase().includes(q) || false;
    const projectMatch = c.lastMessage?.projectContext?.projectCode.toLowerCase().includes(q) || false;
    return nameMatch || specMatch || messageMatch || projectMatch;
  });

  // Filter all researchers berdasarkan search query
  const filteredAllResearchers = allResearchers.filter((r) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = r.name.toLowerCase().includes(q);
    const specMatch = r.specialization.toLowerCase().includes(q);
    const instMatch = r.institution.toLowerCase().includes(q);
    return nameMatch || specMatch || instMatch;
  });

  // Peneliti baru yang cocok dengan search (untuk section 'Peneliti Lainnya' saat mencari)
  const filteredNewResearchers = researchersWithoutChat.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.specialization.toLowerCase().includes(q) ||
      r.institution.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 select-none">
      {/* 1. Header & Title */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Diskusi Peneliti
            </h2>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                {totalUnread} baru
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            1-on-1 Chat
          </span>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari peneliti, topik, atau kata kunci..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tab Switcher (Percakapan vs Semua Peneliti) */}
        {!searchQuery && (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl mt-3 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('conversations')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'conversations'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Percakapan</span>
              <span className="text-[10px] bg-slate-200/70 px-1.5 py-0.2 rounded-full">
                {conversations.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Semua Peneliti</span>
              <span className="text-[10px] bg-slate-200/70 px-1.5 py-0.2 rounded-full">
                {allResearchers.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Daftar List Konten */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {/* Mode Pencarian Aktif */}
        {searchQuery ? (
          <div className="p-2 space-y-4">
            {/* Hasil dari Percakapan Aktif */}
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Percakapan Aktif ({filteredConversations.length})
              </div>
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => renderConversationItem(conv))
              ) : (
                <div className="px-3 py-2 text-xs text-slate-400 italic">
                  Tidak ada percakapan aktif yang sesuai.
                </div>
              )}
            </div>

            {/* Hasil dari Peneliti Lainnya */}
            {filteredNewResearchers.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Peneliti Terdaftar Lainnya ({filteredNewResearchers.length})
                </div>
                {filteredNewResearchers.map((res) => renderNewResearcherItem(res))}
              </div>
            )}

            {filteredConversations.length === 0 && filteredNewResearchers.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-xs text-slate-500">
                  Tidak ditemukan hasil untuk <span className="font-semibold">"{searchQuery}"</span>
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'conversations' ? (
          /* Tab 1: Percakapan Aktif (Urutan aktivitas terbaru di atas) */
          conversations.length > 0 ? (
            <div className="p-1.5 space-y-1">
              {conversations.map((conv) => renderConversationItem(conv))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-700">Belum ada percakapan</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Pilih tab "Semua Peneliti" untuk memulai percakapan baru.
              </p>
            </div>
          )
        ) : (
          /* Tab 2: Direktori Seluruh Peneliti */
          <div className="p-1.5 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Seluruh Pengguna Role Peneliti ({allResearchers.length})
            </div>
            {filteredAllResearchers.map((res) => {
              const hasConv = existingResearcherIds.has(res.id);
              const matchedConv = conversations.find((c) => c.researcherId === res.id);
              return renderDirectoryResearcherItem(res, hasConv, matchedConv);
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Helper render item percakapan aktif
  function renderConversationItem(conv: Conversation) {
    const isSelected = selectedConversationId === conv.id;
    const res = conv.researcher;
    const lastMsg = conv.lastMessage;

    return (
      <div
        key={conv.id}
        onClick={() => onSelectConversation(conv.id)}
        className={`w-full p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
          isSelected
            ? 'bg-blue-50 border border-blue-200/80 shadow-2xs'
            : 'hover:bg-slate-50 border border-transparent'
        }`}
      >
        {/* Avatar with status indicator */}
        <div className="relative shrink-0 mt-0.5">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
            {(res?.name || 'P').charAt(0).toUpperCase()}
          </div>
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
              res?.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h4
              className={`text-xs font-bold truncate ${
                isSelected ? 'text-blue-950' : 'text-slate-800'
              }`}
              title={res?.name || 'Peneliti'}
            >
              {res?.name || 'Peneliti'}
            </h4>
            {lastMsg && (
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                {lastMsg.timestamp}
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 truncate mb-1">
            {res?.specialization || ''}
          </div>

          {/* Last Message Snippet */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-slate-600 truncate flex-1 leading-tight">
              {lastMsg ? (
                <>
                  {lastMsg.senderRole === 'Analyst' && (
                    <span className="text-blue-600 font-medium mr-1">Anda:</span>
                  )}
                  {lastMsg.text || (lastMsg.attachments?.length ? '📎 Mengirim lampiran' : '')}
                </>
              ) : (
                <span className="italic text-slate-400">Belum ada pesan</span>
              )}
            </p>

            {/* Unread Badge */}
            {conv.unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shrink-0 shadow-2xs">
                {conv.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Helper render item peneliti yang belum memiliki obrolan (pada hasil pencarian)
  function renderNewResearcherItem(res: ResearcherUser) {
    return (
      <div
        key={res.id}
        onClick={() => onStartNewChat(res.id)}
        className="w-full p-2.5 rounded-xl border border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 flex items-center justify-between gap-2 cursor-pointer transition-all mb-1.5"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
            {(res?.name || 'P').charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-slate-800 truncate">{res?.name || 'Peneliti'}</div>
            <div className="text-[10px] text-slate-400 truncate">{res?.specialization || ''}</div>
          </div>
        </div>
        <button
          type="button"
          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-[10px] font-semibold flex items-center gap-1 transition-colors shrink-0"
        >
          <Plus className="w-3 h-3" />
          <span>Chat</span>
        </button>
      </div>
    );
  }

  // Helper render item pada Tab Direktori Seluruh Peneliti
  function renderDirectoryResearcherItem(
    res: ResearcherUser,
    hasConv: boolean,
    matchedConv?: Conversation
  ) {
    return (
      <div
        key={res.id}
        onClick={() => {
          if (hasConv && matchedConv) {
            onSelectConversation(matchedConv.id);
          } else {
            onStartNewChat(res.id);
          }
        }}
        className="w-full p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer transition-all"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
              {(res?.name || 'P').charAt(0).toUpperCase()}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                res?.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>

          <div className="truncate">
            <div className="text-xs font-bold text-slate-800 truncate">{res?.name || 'Peneliti'}</div>
            <div className="text-[10px] text-slate-500 truncate">{res?.academicTitle || ''}</div>
            <div className="text-[10px] text-slate-400 truncate">{res?.specialization || ''}</div>
          </div>
        </div>

        <div className="shrink-0">
          {hasConv ? (
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
              Buka Chat
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Mulai Chat
            </span>
          )}
        </div>
      </div>
    );
  }
};
