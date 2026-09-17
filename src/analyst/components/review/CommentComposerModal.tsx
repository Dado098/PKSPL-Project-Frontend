import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface CommentComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionName?: string;
  pinCoordinates?: { x: number; y: number };
  onSubmit: (content: string, section?: string, coords?: { x: number; y: number }) => void;
}

export const CommentComposerModal: React.FC<CommentComposerModalProps> = ({
  isOpen,
  onClose,
  sectionName = 'Umum',
  pinCoordinates,
  onSubmit
}) => {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), sectionName, pinCoordinates);
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Tambah Catatan Review
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Bagian: <strong className="text-slate-700">{sectionName}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Catatan Telaah / Koreksi:
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan temuan telaah mutu, koreksi formula, validasi harga unit, atau permintaan penjelasan rujukan..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
              autoFocus
            />
          </div>

          {pinCoordinates && (
            <div className="text-[11px] text-slate-400 font-mono">
              Lokasi Marker Pin: {pinCoordinates.x}% X, {pinCoordinates.y}% Y
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Catatan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
