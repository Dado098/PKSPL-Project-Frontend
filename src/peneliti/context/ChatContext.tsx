import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Conversation, ChatMessage } from '../mock/chatMock';
import { chatService, ChatEvent } from '../services/chatService';

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  totalUnreadCount: number;
  isLoading: boolean;
  error: string | null;
  typingMap: Record<string, boolean>; // convId -> is typing
  selectConversation: (id: string | null) => void;
  sendMessage: (
    text: string,
    attachment?: { name: string; type: 'file' | 'image' | 'shp'; size: string; url?: string }
  ) => Promise<void>;
  uploadAttachment: (
    file: File,
    type: 'file' | 'shp' | 'image',
    onProgress?: (percent: number) => void
  ) => Promise<{ name: string; type: 'file' | 'shp' | 'image'; size: string; url?: string }>;
  createNewConversation: (
    name: string,
    role: 'Analyst' | 'SuperAdmin',
    projectCode: string,
    initialMsg: string
  ) => void;
  simulateIncomingMessage: (targetConvId?: string) => void;
  retrySendMessage: (messageId: string) => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    // Default to first conversation on desktop if available
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      return 'rconv-1';
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(() => chatService.getTotalUnreadCount());

  // Load initial conversations from chatService
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    chatService
      .getConversations()
      .then((data) => {
        if (isMounted) {
          setConversations(data);
          setTotalUnreadCount(chatService.getTotalUnreadCount());
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat data percakapan.');
          setIsLoading(false);
        }
      });

    // Subscribe to real-time events from chatService
    const unsubscribe = chatService.subscribe((event: ChatEvent) => {
      if (!isMounted) return;

      if (event.conversations) {
        setConversations(event.conversations);
      }

      if (typeof event.totalUnread === 'number') {
        setTotalUnreadCount(event.totalUnread);
      } else {
        setTotalUnreadCount(chatService.getTotalUnreadCount());
      }

      // Handle typing indicators
      if (event.type === 'TYPING_START' && event.conversationId) {
        setTypingMap((prev) => ({ ...prev, [event.conversationId!]: true }));
      } else if (event.type === 'TYPING_STOP' && event.conversationId) {
        setTypingMap((prev) => ({ ...prev, [event.conversationId!]: false }));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // When active conversation changes, mark as read
  const selectConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
    if (id) {
      chatService.markAsRead(id);
      setTotalUnreadCount(chatService.getTotalUnreadCount());
    }
  }, []);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Send message
  const sendMessage = useCallback(
    async (
      text: string,
      attachment?: { name: string; type: 'file' | 'image' | 'shp'; size: string; url?: string }
    ) => {
      if (!activeConversationId) return;

      try {
        setError(null);
        await chatService.sendMessage(activeConversationId, text, attachment);
      } catch (err: any) {
        setError(err.message || 'Gagal mengirim pesan.');
        throw err;
      }
    },
    [activeConversationId]
  );

  // Upload attachment
  const uploadAttachment = useCallback(
    async (
      file: File,
      type: 'file' | 'shp' | 'image',
      onProgress?: (percent: number) => void
    ) => {
      try {
        setError(null);
        return await chatService.uploadAttachment(file, type, onProgress);
      } catch (err: any) {
        setError(err.message || 'Gagal mengunggah lampiran.');
        throw err;
      }
    },
    []
  );

  // Create new conversation
  const createNewConversation = useCallback(
    (name: string, role: 'Analyst' | 'SuperAdmin', projectCode: string, initialMsg: string) => {
      const newConv = chatService.createNewConversation(name, role, projectCode, initialMsg);
      setActiveConversationId(newConv.id);
      setTotalUnreadCount(chatService.getTotalUnreadCount());
    },
    []
  );

  // Trigger simulated incoming message
  const simulateIncomingMessage = useCallback((targetConvId?: string) => {
    chatService.triggerIncomingMessageSimulation(targetConvId);
  }, []);

  // Retry sending failed message
  const retrySendMessage = useCallback(
    async (messageId: string) => {
      if (!activeConversation) return;
      const failedMsg = activeConversation.messages.find((m) => m.id === messageId);
      if (!failedMsg) return;

      try {
        await chatService.sendMessage(activeConversation.id, failedMsg.text, failedMsg.attachment);
      } catch (err: any) {
        setError(err.message || 'Gagal mengirim ulang pesan.');
      }
    },
    [activeConversation]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        totalUnreadCount,
        isLoading,
        error,
        typingMap,
        selectConversation,
        sendMessage,
        uploadAttachment,
        createNewConversation,
        simulateIncomingMessage,
        retrySendMessage,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
