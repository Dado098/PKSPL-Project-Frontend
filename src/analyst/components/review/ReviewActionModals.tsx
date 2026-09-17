import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  Send,
  ShieldAlert,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ReviewComment } from '../../types/annotation';

interface MintaRevisiModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectCode: string;
  comments: ReviewComment[];
  onSubmit: (reason: string, selectedCommentIds: string[]) => void;
}

export const MintaRevisiModal: React.FC<MintaRevisiModalProps> = ({
  isOpen,
  onClose,
  projectName,
  projectCode,
  comments,
  onSubmit
}) => {
  const [reason, setReason] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    comments.filter(c => c.status === 'open').map(c => c.id)
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason.trim(), selectedIds);
    setReason('');
    onClose();
  };

  const toggleSelectComment = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Minta Revisi kepada Peneliti
              </h3>
              <span className="text-[11px] text-amber-800 font-mono">
                {projectCode} — {projectName}
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Alasan & Arahan Revisi: <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan secara spesifik poin-poin yang perlu diperbaiki oleh Peneliti (misal: verifikasi ulang harga unit kayu cemara laut, pengecekan luas polygon tutupan lahan, dsb)..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none"
              autoFocus
            />
          </div>

          {/* Catatan Terkait */}
          {comments.length > 0 && (
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Lampirkan Catatan Komentar Terkait:
              </label>
              <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-lg p-2 bg-slate-50/50">
                {comments.map((c) => {
                  const checked = selectedIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className="flex items-start gap-2 p-1.5 rounded hover:bg-white cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelectComment(c.id)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 mt-0.5"
                      />
                      <div className="text-[11px] leading-tight text-slate-700">
                        <span className="font-semibold text-slate-900 mr-1">[{c.section || 'Umum'}]:</span>
                        <span>{c.content}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
            Status proyek akan otomatis berubah menjadi <strong className="font-bold text-amber-800">REVISI</strong> dan peneliti akan menerima notifikasi temuan telaah ini.
          </div>

          {/* Action Buttons */}
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
              disabled={!reason.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Permintaan Revisi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface TandaiSelesaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectCode: string;
  openCommentsCount: number;
  onConfirm: () => void;
}

export const TandaiSelesaiModal: React.FC<TandaiSelesaiModalProps> = ({
  isOpen,
  onClose,
  projectName,
  projectCode,
  openCommentsCount,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Persetujuan Mutu & Selesaikan Review
              </h3>
              <span className="text-[11px] text-emerald-800 font-mono">
                {projectCode}
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-700 leading-relaxed">
            Apakah Anda yakin ingin menandai penelitian <strong>"{projectName}"</strong> sebagai <strong className="text-emerald-700">SELESAI</strong>?
          </p>

          {openCommentsCount > 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-900 text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Masih terdapat <strong>{openCommentsCount} catatan review yang belum ditandai selesai</strong>. Pastikan temuan tersebut telah diverifikasi bersama Peneliti.
              </span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-emerald-900 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Semua catatan telaah telah terselesaikan. Laporan valuasi ini siap dinyatakan valid dan terbit secara resmi.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tandai Selesai</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
