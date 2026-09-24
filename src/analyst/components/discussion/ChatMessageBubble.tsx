import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  CheckCheck,
  ExternalLink,
  FileText,
  MapPin,
  Table,
  Image,
  FolderKanban,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Ban,
} from 'lucide-react';
import { ChatMessage, ChatAttachment } from '../../types/discussion';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  researcherName: string;
  currentUserId?: string | number;
  onEdit?: (messageId: string, newText: string) => Promise<void>;
  onDelete?: (messageId: string) => Promise<void>;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  researcherName,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const isMe =
    Boolean(message.isOutgoing) ||
    (Boolean(currentUserId) && String(message.senderId) === String(currentUserId)) ||
    (message.senderRole?.toLowerCase() === 'analyst');

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-chat-menu]')) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing) {
      setEditText(message.text || '');
      setTimeout(() => {
        editInputRef.current?.focus();
        editInputRef.current?.select();
      }, 50);
    }
  }, [isEditing, message.text]);

  const handleStartEdit = () => {
    setMenuOpen(false);
    setIsEditing(true);
    setActionError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(message.text || '');
    setActionError(null);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText.trim() === message.text) {
      setIsEditing(false);
      return;
    }
    if (!onEdit) return;

    try {
      setIsSubmitting(true);
      setActionError(null);
      await onEdit(message.id, editText.trim());
      setIsEditing(false);
    } catch (err: any) {
      console.error('Gagal mengedit pesan:', err);
      setActionError(err.message || 'Gagal mengubah pesan. Pastikan Anda memiliki izin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    try {
      setIsSubmitting(true);
      setActionError(null);
      await onDelete(message.id);
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error('Gagal menghapus pesan:', err);
      setActionError(err.message || 'Gagal menghapus pesan. Pastikan Anda memiliki izin.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const isDeleted = Boolean(message.isDeleted);

  return (
    <>
      <div
        className={`flex items-end gap-2.5 mb-4 group relative ${
          isMe ? 'justify-end' : 'justify-start'
        }`}
      >
        {/* Avatar Peneliti (hanya muncul di sisi kiri pesan lawan bicara) */}
        {!isMe && (
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300 shrink-0 mb-1">
            {(researcherName || 'P').charAt(0).toUpperCase()}
          </div>
        )}

        {/* Action Menu (Three dots) untuk pesan keluar milik sendiri & belum dihapus */}
        {isMe && !isDeleted && !isEditing && (
          <div
            data-chat-menu
            className="relative self-center shrink-0"
            ref={menuRef}
          >
            <button
              type="button"
              data-chat-menu
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
              title="Opsi pesan (Edit / Hapus)"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                data-chat-menu
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-1 z-30 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 text-xs animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  type="button"
                  data-chat-menu
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit();
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  data-chat-menu
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setActionError(null);
                    setShowDeleteModal(true);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] flex flex-col ${
            isMe ? 'items-end' : 'items-start'
          }`}
        >
          {/* Sender Name Label */}
          <div className="text-[10px] font-semibold text-slate-400 mb-1 px-1">
            {isMe ? message.senderName : (researcherName || 'Peneliti')}
          </div>

          {/* Bubble Box */}
          <div
            className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all ${
              isDeleted
                ? isMe
                  ? 'bg-blue-50/70 border border-blue-200 text-blue-900/60 rounded-tr-xs italic'
                  : 'bg-slate-100/80 border border-slate-200 text-slate-500 rounded-tl-xs italic'
                : isMe
                ? 'bg-blue-600 text-white rounded-tr-xs shadow-blue-600/10 shadow-xs'
                : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-2xs'
            }`}
          >
            {/* Inline Edit Form */}
            {isEditing ? (
              <div className="min-w-[220px] sm:min-w-[280px]">
                <textarea
                  ref={editInputRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveEdit();
                    } else if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full p-2 text-xs rounded-lg bg-blue-700/80 text-white placeholder-blue-200 border border-blue-400 focus:outline-hidden focus:ring-2 focus:ring-white resize-none"
                  rows={2}
                />
                {actionError && (
                  <div className="mt-1.5 p-1.5 bg-rose-500/20 border border-rose-300 rounded text-[10px] text-rose-100 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="px-2.5 py-1 text-[11px] font-medium text-blue-100 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSubmitting || !editText.trim()}
                    className="px-3 py-1 text-[11px] font-semibold bg-white text-blue-700 hover:bg-blue-50 rounded-lg shadow-2xs transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Project Context Chip (jika pesan ini berkonteks proyek telaah dan belum dihapus) */}
                {!isDeleted && message.projectContext && (
                  <div
                    onClick={(e) => handleProjectClick(e, message.projectContext!.projectCode)}
                    className={`mb-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      isMe
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

                {/* Pesan telah dihapus */}
                {isDeleted ? (
                  <div className="flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span>Pesan telah dihapus</span>
                  </div>
                ) : (
                  /* Isi Pesan Teks Normal */
                  message.text && (
                    <div className="whitespace-pre-wrap break-words">{message.text}</div>
                  )
                )}

                {/* Lampiran (hanya jika pesan belum dihapus) */}
                {!isDeleted && message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {message.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.url || undefined}
                        target={att.url ? '_blank' : undefined}
                        rel="noreferrer"
                        download={att.fileName}
                        className={`p-2 rounded-lg flex items-center gap-2 text-[11px] transition-colors ${
                          isMe
                            ? 'bg-blue-700/60 hover:bg-blue-700/80 border border-blue-500/40 text-blue-50'
                            : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                        } ${att.url ? 'cursor-pointer' : ''}`}
                      >
                        <div className="w-6 h-6 rounded bg-white flex items-center justify-center shrink-0 shadow-2xs">
                          {getAttachmentIcon(att.fileType)}
                        </div>
                        <div className="truncate flex-1">
                          <div className="font-medium truncate">{att.fileName}</div>
                          <div className="text-[10px] opacity-70">{att.fileSize}</div>
                        </div>
                        {att.url && <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60 ml-auto" />}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Timestamp, (diedit), & Status Icon */}
            {!isEditing && (
              <div
                className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                  isDeleted
                    ? isMe ? 'text-blue-900/40' : 'text-slate-400'
                    : isMe ? 'text-blue-100/90' : 'text-slate-400'
                }`}
              >
                {!isDeleted && message.isEdited && (
                  <span className="text-[9px] opacity-80 mr-0.5 italic">(diedit)</span>
                )}
                <span>{message.timestamp}</span>
                {isMe && !isDeleted && (
                  <span
                    title={
                      message.status === 'read' || message.isRead
                        ? 'Dibaca'
                        : message.status === 'delivered'
                        ? 'Tersampaikan (online)'
                        : 'Terkirim (offline)'
                    }
                  >
                    {message.status === 'read' || message.isRead ? (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-300 stroke-[2.5]" />
                    ) : message.status === 'delivered' ? (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-200/70" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-blue-200/70" />
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hapus pesan?</h3>
                <p className="text-xs text-slate-500">Pesan ini akan dihapus dari percakapan.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 italic line-clamp-2">
              "{message.text || 'Lampiran'}"
            </p>
            {actionError && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                <span>{actionError}</span>
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-2xs disabled:opacity-50"
              >
                {isSubmitting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessageBubble;
