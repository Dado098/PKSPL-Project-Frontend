import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  FolderKanban,
  X,
  FileText,
  MapPin,
  Table,
  Image,
  ChevronDown
} from 'lucide-react';
import { ResearcherUser, ProjectContext, ChatAttachment } from '../../types/discussion';
import { AttachmentModal } from './AttachmentModal';

interface ChatInputComposerProps {
  researcher: ResearcherUser;
  onSendMessage: (text: string, projectContext?: ProjectContext, attachments?: ChatAttachment[]) => void;
  disabled?: boolean;
}

export const ChatInputComposer: React.FC<ChatInputComposerProps> = ({
  researcher,
  onSendMessage,
  disabled = false
}) => {
  const [text, setText] = useState('');
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectContext | null>(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((text.trim() === '' && attachedFiles.length === 0) || disabled) return;

    onSendMessage(
      text,
      selectedProject || undefined,
      attachedFiles.length > 0 ? attachedFiles : undefined
    );

    setText('');
    setAttachedFiles([]);
    setSelectedProject(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectAttachment = (attachment: ChatAttachment) => {
    setAttachedFiles((prev) => [...prev, attachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((a) => a.id !== id));
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-3.5 h-3.5 text-rose-500" />;
      case 'spatial':
        return <MapPin className="w-3.5 h-3.5 text-indigo-500" />;
      case 'sheet':
        return <Table className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Image className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-3 sm:p-4">
      {/* Draft Chips Area (Konteks Proyek & Lampiran Terpilih) */}
      {(selectedProject || attachedFiles.length > 0) && (
        <div className="mb-2.5 flex flex-wrap gap-2 items-center">
          {/* Active Project Context Badge */}
          {selectedProject && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
              <FolderKanban className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-mono font-bold">{selectedProject.projectCode}</span>
              <span className="truncate max-w-[180px]">• {selectedProject.projectName}</span>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-0.5 rounded hover:bg-blue-100 text-blue-500 hover:text-blue-800 ml-1"
                title="Hapus konteks proyek"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Active Attached Files */}
          {attachedFiles.map((att) => (
            <div
              key={att.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium"
            >
              {getAttachmentIcon(att.fileType)}
              <span className="truncate max-w-[160px]">{att.fileName}</span>
              <span className="text-[10px] text-slate-400 font-normal">({att.fileSize})</span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 ml-1"
                title="Hapus lampiran"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Input Row */}
      <div className="flex items-end gap-2">
        {/* Left Action Buttons (Attachment & Project Context) */}
        <div className="flex items-center gap-1 shrink-0 pb-1">
          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => setIsAttachmentModalOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Lampirkan berkas / data telaah"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Project Context Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProjectDropdownOpen((prev) => !prev)}
              className={`p-2 rounded-xl transition-colors flex items-center gap-1 ${
                selectedProject
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Sematkan konteks proyek pada pesan ini"
            >
              <FolderKanban className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Project Dropdown Menu */}
            {isProjectDropdownOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Proyek Terkait Peneliti
                </div>
                {researcher.associatedProjects && researcher.associatedProjects.length > 0 ? (
                  researcher.associatedProjects.map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => {
                        setSelectedProject({
                          projectCode: p.code,
                          projectName: p.name
                        });
                        setIsProjectDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors flex flex-col gap-0.5"
                    >
                      <div className="font-mono font-bold text-blue-600">{p.code}</div>
                      <div className="text-slate-700 truncate">{p.name}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-xs text-slate-500 text-center">
                    Tidak ada proyek aktif terdaftar untuk peneliti ini.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Textarea Input */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={`Tulis pesan diskusi ke ${researcher.name}...`}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white resize-none max-h-32 transition-colors"
          />
        </div>

        {/* Send Button */}
        <div className="shrink-0 pb-1">
          <button
            type="button"
            onClick={handleSend}
            disabled={
              (text.trim() === '' && attachedFiles.length === 0) || disabled
            }
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
            title="Kirim Pesan (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Attachment Modal */}
      <AttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        onSelectAttachment={handleSelectAttachment}
      />
    </div>
  );
};
