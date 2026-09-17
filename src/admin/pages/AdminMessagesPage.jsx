import React, { useState } from 'react';
import { INITIAL_CONVERSATIONS } from '../mock/chatMock';
import { ConversationListPanel } from '../components/chat/ConversationListPanel';
import { ChatWindowPanel } from '../components/chat/ChatWindowPanel';
import { EmptyChatState } from '../components/chat/EmptyChatState';
import { useAuth } from '../../contexts/AuthContext';

export const AdminMessagesPage = () => {
  const { user } = useAuth();
  const currentUserName = user?.nama || 'Super Admin';

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);

  // Set default active conversation: first one on desktop, null on mobile
  const [activeConversationId, setActiveConversationId] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      return INITIAL_CONVERSATIONS[0]?.id || null;
    }
    return null;
  });

  // Current active conversation object
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  // Handle selecting a conversation
  const handleSelectConversation = (id) => {
    setActiveConversationId(id);

    // Clear unread count when opened
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Format current time HH:MM
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Handle sending a new message
  const handleSendMessage = (text, attachment) => {
    if (!activeConversationId) return;

    const timeStr = getCurrentTime();
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'superadmin',
      senderName: currentUserName,
      text,
      timestamp: timeStr,
      isOutgoing: true,
      status: 'read',
      attachment,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessageSnippet: text || (attachment ? `📎 ${attachment.name}` : ''),
            lastMessageTime: timeStr,
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    // Simulated reply from the recipient for interactive demo delight
    if (
      text.toLowerCase().includes('cek') ||
      text.toLowerCase().includes('terima') ||
      text.toLowerCase().includes('verifikasi') ||
      text.toLowerCase().includes('halo')
    ) {
      const activeUser = activeConversation?.userName;
      const targetId = activeConversationId;

      setTimeout(() => {
        const replyTime = getCurrentTime();
        const incomingReply = {
          id: `reply-${Date.now()}`,
          senderId: targetId,
          senderName: activeUser || 'Peneliti',
          text: `Siap ${currentUserName}, terima kasih banyak atas arahan dan verifikasinya.`,
          timestamp: replyTime,
          isOutgoing: false,
        };

        setConversations((currentList) =>
          currentList.map((conv) => {
            if (conv.id === targetId) {
              return {
                ...conv,
                lastMessageSnippet: incomingReply.text,
                lastMessageTime: replyTime,
                messages: [...conv.messages, incomingReply],
              };
            }
            return conv;
          })
        );
      }, 1500);
    }
  };

  // Handle creating a new conversation
  const handleNewConversation = (name, role, initialMsg) => {
    const timeStr = getCurrentTime();
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

    const newConvId = `conv-${Date.now()}`;
    const newConv = {
      id: newConvId,
      userId: `usr-${Date.now()}`,
      userName: name,
      userRole: role,
      userAvatarBg: role === 'Analyst' ? 'from-amber-600 to-rose-600' : 'from-blue-600 to-indigo-600',
      userInitials: initials,
      isOnline: true,
      unreadCount: 0,
      lastMessageSnippet: initialMsg,
      lastMessageTime: timeStr,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'superadmin',
          senderName: currentUserName,
          text: initialMsg,
          timestamp: timeStr,
          isOutgoing: true,
          status: 'read',
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-white">
      {/* Left Sidebar: Conversation List */}
      <div
        className={`
          w-full md:w-80 lg:w-96 shrink-0 h-full flex flex-col border-r border-slate-200 transition-all duration-200
          ${activeConversationId ? 'hidden md:flex' : 'flex'}
        `}
      >
        <ConversationListPanel
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
        />
      </div>

      {/* Right Canvas: Chat Window or Empty State */}
      <div
        className={`
          flex-1 h-full flex flex-col min-w-0 bg-slate-50 transition-all duration-200
          ${!activeConversationId ? 'hidden md:flex' : 'flex'}
        `}
      >
        {activeConversation ? (
          <ChatWindowPanel
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            onBackMobile={() => setActiveConversationId(null)}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
