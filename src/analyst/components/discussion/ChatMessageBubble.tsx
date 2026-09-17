import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCheck, ExternalLink, FileText, MapPin, Table, Image, FolderKanban } from 'lucide-react';
import { ChatMessage, ChatAttachment } from '../../types/discussion';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  researcherName: string;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  researcherName
}) => {
  const navigate = useNavigate();
  const isAnalyst = message.senderRole === 'Analyst';

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'spatial':
        return <MapPin className="w-4 h-4 text-indigo-500" />;
      case 'sheet':
        return <Table className="w-4 h-4 text-emerald-500" />;
      default:
        return <Image className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleProjectClick = (e: React.MouseEvent, projectCode: string) => {
    e.stopPropagation();
    navigate(`/analyst/projects/${projectCode}`);
  };

  return (
    <div
      className={`flex items-end gap-2.5 mb-4 group ${
        isAnalyst ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Avatar Peneliti (hanya muncul di sisi kiri pesan Peneliti) */}
      {!isAnalyst && (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300 shrink-0 mb-1">
          {researcherName.charAt(0)}
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] flex flex-col ${
          isAnalyst ? 'items-end' : 'items-start'
        }`}
      >
        {/* Sender Name Label */}
        <div className="text-[10px] font-semibold text-slate-400 mb-1 px-1">
          {isAnalyst ? message.senderName : researcherName}
        </div>

        {/* Bubble Box */}
        <div
          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs transition-shadow ${
            isAnalyst
              ? 'bg-blue-600 text-white rounded-tr-xs shadow-blue-600/10'
              : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-2xs'
          }`}
        >
          {/* Project Context Chip (jika pesan ini berkonteks proyek telaah) */}
          {message.projectContext && (
            <div
              onClick={(e) => handleProjectClick(e, message.projectContext!.projectCode)}
              className={`mb-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center justify-between gap-2 cursor-pointer transition-all ${
                isAnalyst
                  ? 'bg-blue-700/80 hover:bg-blue-800 text-blue-100 border border-blue-500/50'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
              }`}
              title="Klik untuk membuka lembar review proyek ini"
            >
              <div className="flex items-center gap-1.5 truncate">
                <FolderKanban className="w-3.5 h-3.5 shrink-0 text-blue-300" />
                <span className="font-mono font-bold">{message.projectContext.projectCode}</span>
                <span className="opacity-70 truncate">• {message.projectContext.projectName}</span>
              </div>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
            </div>
          )}

          {/* Isi Pesan Teks */}
          <div className="whitespace-pre-wrap break-words">{message.text}</div>

          {/* Lampiran (jika ada) */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2.5 space-y-1.5">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className={`p-2 rounded-lg flex items-center gap-2 text-[11px] ${
                    isAnalyst
                      ? 'bg-blue-700/60 border border-blue-500/40 text-blue-50'
                      : 'bg-slate-50 border border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center shrink-0 shadow-2xs">
                    {getAttachmentIcon(att.fileType)}
                  </div>
                  <div className="truncate flex-1">
                    <div className="font-medium truncate">{att.fileName}</div>
                    <div className="text-[10px] opacity-70">{att.fileSize}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timestamp & Status Icon */}
          <div
            className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
              isAnalyst ? 'text-blue-100/90' : 'text-slate-400'
            }`}
          >
            <span>{message.timestamp}</span>
            {isAnalyst && (
              <CheckCheck
                className={`w-3.5 h-3.5 ${
                  message.isRead ? 'text-blue-200' : 'text-blue-300/70'
                }`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
