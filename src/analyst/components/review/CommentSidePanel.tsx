import React, { useState } from 'react';
import { ReviewComment } from '../../types/annotation';
import {
  MessageSquare,
  CheckCircle2,
  RotateCcw,
  Trash2,
  X,
  Send,
  User,
  Clock,
  Filter
} from 'lucide-react';

interface CommentSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  comments: ReviewComment[];
  selectedCommentId?: string;
  onToggleResolve?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onAddReply?: (commentId: string, replyText: string) => void;
  onSelectCommentItem?: (comment: ReviewComment) => void;
  readOnly?: boolean;
}

export const CommentSidePanel: React.FC<CommentSidePanelProps> = ({
  isOpen,
  onClose,
  comments,
  selectedCommentId,
  onToggleResolve = () => {},
  onDeleteComment = () => {},
  onAddReply = () => {},
  onSelectCommentItem = () => {},
  readOnly = false
}) => {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredComments = comments.filter((c) => {
    if (filter === 'open') return c.status === 'open';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const handleSendReply = (commentId: string) => {
    const text = replyTextMap[commentId]?.trim();
    if (!text) return;
    onAddReply(commentId, text);
    setReplyTextMap(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyBox(null);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col font-sans select-none">
      {/* Header */}
      <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Catatan & Komentar Review
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {comments.filter(c => c.status === 'open').length} Belum Selesai • {comments.length} Total
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 border-b border-slate-100 flex items-center gap-1 bg-white">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Semua ({comments.length})
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            filter === 'open'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Perlu Tindakan ({comments.filter(c => c.status === 'open').length})
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            filter === 'resolved'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Selesai ({comments.filter(c => c.status === 'resolved').length})
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Tidak ada catatan komentar pada filter ini.</p>
          </div>
        ) : (
          filteredComments.map((comment, idx) => {
            const isSelected = selectedCommentId === comment.id;
            const isResolved = comment.status === 'resolved';

            return (
              <div
                key={comment.id}
                onClick={() => onSelectCommentItem(comment)}
                className={`pt-3 first:pt-0 space-y-2.5 rounded-lg p-2 transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-50/50 ring-1 ring-blue-300' : 'hover:bg-slate-50'
                }`}
              >
                {/* Author & Section Tag */}
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      {comment.author}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                      {comment.section || 'Umum'}
                    </span>
                  </div>

                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-semibold border ${
                    isResolved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {isResolved ? 'Selesai' : 'Perlu Diperiksa'}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
                  {comment.content}
                </p>

                {/* Timestamp & Action Toolbar */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{comment.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleResolve(comment.id);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded font-semibold transition-colors ${
                        isResolved
                          ? 'text-slate-600 hover:bg-slate-200'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {isResolved ? <RotateCcw className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>{isResolved ? 'Buka Kembali' : 'Tandai Selesai'}</span>
                    </button>

                    {!readOnly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteComment(comment.id);
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50"
                        title="Hapus Komentar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Replies List */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-slate-200 space-y-2 mt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <strong className="text-slate-800">{reply.author}</strong>
                          <span>{reply.timestamp}</span>
                        </div>
                        <p className="text-slate-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Composer Box */}
                {activeReplyBox === comment.id ? (
                  <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Tulis balasan penjelasan..."
                        value={replyTextMap[comment.id] || ''}
                        onChange={(e) => setReplyTextMap(prev => ({ ...prev, [comment.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply(comment.id)}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSendReply(comment.id)}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        title="Kirim Balasan"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveReplyBox(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 px-1"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReplyBox(comment.id);
                      }}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>Balas Komentar Ini</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
