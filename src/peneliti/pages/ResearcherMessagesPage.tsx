import React from 'react';
import { useChat } from '../context/ChatContext';
import { ResearcherConversationListPanel } from '../components/chat/ResearcherConversationListPanel';
import { ResearcherChatWindowPanel } from '../components/chat/ResearcherChatWindowPanel';
import { ResearcherEmptyChatState } from '../components/chat/ResearcherEmptyChatState';
import { AlertCircle, X } from 'lucide-react';

export const ResearcherMessagesPage: React.FC = () => {
  const {
    conversations,
    directoryUsers,
    activeConversationId,
    activeConversation,
    isLoading,
    error,
    typingMap,
    selectConversation,
    sendTyping,
    sendMessage,
    uploadAttachment,
    createNewConversation,
    simulateIncomingMessage,
    retrySendMessage,
    editMessage,
    deleteMessage,
    clearError,
  } = useChat();

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col overflow-hidden bg-white">
      {/* Global Error Banner if any */}
      {error && (
        <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-200 text-xs text-rose-800 flex items-center justify-between shadow-2xs z-20">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="p-1 text-rose-400 hover:text-rose-700 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main 2-Panel Chat Canvas */}
      <div className="flex-1 flex w-full overflow-hidden min-h-0">
        {/* ----------------------------------------------------------- */}
        {/* PANEL TENGAH: DAFTAR PERCAKAPAN                             */}
        {/* Sembunyi di mobile jika ada percakapan aktif                */}
        {/* ----------------------------------------------------------- */}
        <div
          className={`
            w-full md:w-80 lg:w-96 shrink-0 h-full flex flex-col border-r border-slate-200
            ${activeConversationId ? 'hidden md:flex' : 'flex'}
          `}
        >
          <ResearcherConversationListPanel
            conversations={conversations}
            directoryUsers={directoryUsers}
            activeConversationId={activeConversationId}
            isLoading={isLoading}
            onSelectConversation={selectConversation}
            onNewConversation={createNewConversation}
            onSimulateIncoming={simulateIncomingMessage}
          />
        </div>

        {/* ----------------------------------------------------------- */}
        {/* PANEL KANAN: JENDELA CHAT AKTIF / EMPTY STATE               */}
        {/* Sembunyi di mobile jika tidak ada percakapan aktif          */}
        {/* ----------------------------------------------------------- */}
        <div
          className={`
            flex-1 h-full flex flex-col min-w-0 bg-slate-50
            ${!activeConversationId ? 'hidden md:flex' : 'flex'}
          `}
        >
          {activeConversation ? (
            <ResearcherChatWindowPanel
              key={activeConversation.id}
              conversation={activeConversation}
              isTyping={Boolean(typingMap[activeConversation.id])}
              onTyping={sendTyping}
              onSendMessage={sendMessage}
              onUploadFile={uploadAttachment}
              onBackMobile={() => selectConversation(null)}
              onRetryMessage={retrySendMessage}
              onEditMessage={editMessage}
              onDeleteMessage={deleteMessage}
            />
          ) : (
            <ResearcherEmptyChatState />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearcherMessagesPage;
