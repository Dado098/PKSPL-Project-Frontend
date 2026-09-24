import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  Paperclip,
  FolderKanban,
  X,
  FileText,
  MapPin,
  Table,
  Image,
  ChevronDown,
  Sparkles,
  Search,
  Plus,
  Check,
} from 'lucide-react';
import { ResearcherUser, ProjectContext, ChatAttachment } from '../../types/discussion';
import { AttachmentModal } from './AttachmentModal';
import { getProyekList } from '../../../services/projectService';

interface ChatInputComposerProps {
  researcher: ResearcherUser;
  onSendMessage: (text: string, projectContext?: ProjectContext, attachments?: ChatAttachment[]) => void;
  disabled?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

export const ChatInputComposer: React.FC<ChatInputComposerProps> = ({
  researcher,
  onSendMessage,
  disabled = false,
  onTyping,
}) => {
  const [text, setText] = useState('');
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectContext | null>(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [systemProjects, setSystemProjects] = useState<Array<{ code: string; name: string }>>([]);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load all system projects to allow searching any project code
  useEffect(() => {
    let isMounted = true;
    getProyekList()
      .then((data: any) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : data?.data || [];
        const formatted = list.map((p: any) => ({
          code: p.kode_proyek || `PRJ-${String(p.id_proyek).padStart(3, '0')}`,
          name: p.nama_proyek || 'Proyek Tanpa Nama',
        }));
        setSystemProjects(formatted);
      })
      .catch((err) => {
        console.warn('[ChatInputComposer] Gagal memuat proyek sistem:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle outside click to close project dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    if (isProjectDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProjectDropdownOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isProjectDropdownOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    } else {
      setProjectSearchQuery('');
    }
  }, [isProjectDropdownOpen]);

  // Filtered projects based on search query
  const filteredProjects = useMemo(() => {
    const query = projectSearchQuery.trim().toLowerCase();
    const researcherProjects = researcher.associatedProjects || [];

    const combinedMap = new Map<string, { code: string; name: string; isResearcherProject: boolean }>();

    // 1. Prioritize researcher's own projects
    researcherProjects.forEach((p) => {
      if (p.code) {
        combinedMap.set(p.code.toUpperCase(), {
          code: p.code,
          name: p.name,
          isResearcherProject: true,
        });
      }
    });

    // 2. Include all system projects
    systemProjects.forEach((p) => {
      if (p.code && !combinedMap.has(p.code.toUpperCase())) {
        combinedMap.set(p.code.toUpperCase(), {
          code: p.code,
          name: p.name,
          isResearcherProject: false,
        });
      }
    });

    const all = Array.from(combinedMap.values());

    if (!query) {
      return all;
    }

    return all.filter(
      (p) => p.code.toLowerCase().includes(query) || p.name.toLowerCase().includes(query)
    );
  }, [researcher.associatedProjects, systemProjects, projectSearchQuery]);

  // Quick reply suggestions relevant to Analyst
  const quickReplies = [
    'Mohon konfirmasi batas spasial poligon mangrove.',
    'Data valuasi sudah kami telaah, silakan periksa catatannya.',
    'Tolong lengkapi layer SHP tutupan lahan terbaru.',
    'Formula TEV sudah sesuai standar referensi.',
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Cleanup typing timeout on unmount or researcher change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping?.(false);
    };
  }, [researcher.id, onTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    if (onTyping) {
      if (val.trim().length > 0) {
        onTyping(true);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 2500);
      } else {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        onTyping(false);
      }
    }
  };

  const handleSend = () => {
    if ((text.trim() === '' && attachedFiles.length === 0) || disabled) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onTyping?.(false);

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
      {/* Quick Suggestion Pills */}
      <div className="mb-2.5 pb-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-blue-600" />
          Template Cepat:
        </span>
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setText(reply);
              textareaRef.current?.focus();
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
          >
            {reply}
          </button>
        ))}
      </div>

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
          <div className="relative" ref={projectDropdownRef}>
            <button
              type="button"
              onClick={() => setIsProjectDropdownOpen((prev) => !prev)}
              className={`p-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                selectedProject
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Sematkan konteks proyek pada pesan ini"
            >
              <FolderKanban className="w-4 h-4" />
              <ChevronDown className={`w-3 h-3 transition-transform ${isProjectDropdownOpen ? 'rotate-180 text-blue-600' : 'opacity-60'}`} />
            </button>

            {/* Project Dropdown Menu */}
            {isProjectDropdownOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                {/* Header popup */}
                <div className="px-3.5 py-1.5 flex items-center justify-between border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                    Proyek Terkait Peneliti
                  </span>
                  {selectedProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProject(null);
                        setIsProjectDropdownOpen(false);
                      }}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                      title="Hapus konteks proyek yang terpasang"
                    >
                      Lepas Pilihan
                    </button>
                  )}
                </div>

                {/* Search Box Input */}
                <div className="p-2 border-b border-slate-100 bg-slate-50/60">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={projectSearchQuery}
                      onChange={(e) => setProjectSearchQuery(e.target.value)}
                      placeholder="Cari kode proyek (cth: PRJ-001)..."
                      className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {projectSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setProjectSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        title="Hapus kata kunci pencarian"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Daftar Proyek (Scrollable) */}
                <div className="overflow-y-auto max-h-56 divide-y divide-slate-100">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((p) => {
                      const isCurrent = selectedProject?.projectCode === p.code;
                      return (
                        <button
                          key={p.code}
                          type="button"
                          onClick={() => {
                            setSelectedProject({
                              projectCode: p.code,
                              projectName: p.name,
                            });
                            setIsProjectDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                            isCurrent ? 'bg-blue-50/80 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200/80 px-1.5 py-0.2 rounded text-[11px]">
                                {p.code}
                              </span>
                              {p.isResearcherProject && (
                                <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded">
                                  Peneliti
                                </span>
                              )}
                            </div>
                            <div className="truncate text-[11px] text-slate-600">{p.name}</div>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3.5 py-4 text-xs text-slate-400 text-center">
                      Tidak ada proyek yang sesuai dengan &ldquo;{projectSearchQuery}&rdquo;
                    </div>
                  )}
                </div>

                {/* Tombol Sematkan Kode Proyek Kustom / Hasil Pencarian */}
                {projectSearchQuery.trim().length > 0 &&
                  !filteredProjects.some(
                    (p) => p.code.toLowerCase() === projectSearchQuery.trim().toLowerCase()
                  ) && (
                    <div className="p-1.5 bg-slate-50 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          const customCode = projectSearchQuery.trim().toUpperCase();
                          setSelectedProject({
                            projectCode: customCode,
                            projectName: `Proyek ${customCode}`,
                          });
                          setIsProjectDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs bg-white hover:bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">
                          Sematkan kode: <strong className="font-mono font-bold">{projectSearchQuery.trim().toUpperCase()}</strong>
                        </span>
                      </button>
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
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={`Tulis pesan ke ${researcher.name}...`}
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
