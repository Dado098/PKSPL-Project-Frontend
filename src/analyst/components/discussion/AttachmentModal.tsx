import React, { useState } from 'react';
import { X, Paperclip, FileText, Image, Table, MapPin, Check } from 'lucide-react';
import { ChatAttachment } from '../../types/discussion';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAttachment: (attachment: ChatAttachment) => void;
}

const DEMO_PRESET_ATTACHMENTS: ChatAttachment[] = [
  {
    id: 'att-pdf-1',
    fileName: 'Catatan_Telaah_Metodologi_Mangrove.pdf',
    fileSize: '1.4 MB',
    fileType: 'pdf'
  },
  {
    id: 'att-shp-1',
    fileName: 'Peta_Zonasi_Konservasi_Revisi.geojson',
    fileSize: '3.8 MB',
    fileType: 'spatial'
  },
  {
    id: 'att-xlsx-1',
    fileName: 'Tabel_Perhitungan_WTP_Responden.xlsx',
    fileSize: '820 KB',
    fileType: 'sheet'
  },
  {
    id: 'att-img-1',
    fileName: 'Dokumentasi_GroundCheck_Benoa.jpg',
    fileSize: '2.1 MB',
    fileType: 'image'
  }
];

export const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isOpen,
  onClose,
  onSelectAttachment
}) => {
  const [selectedItem, setSelectedItem] = useState<ChatAttachment | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedItem) {
      onSelectAttachment(selectedItem);
      setSelectedItem(null);
      onClose();
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'spatial':
        return <MapPin className="w-5 h-5 text-indigo-600" />;
      case 'sheet':
        return <Table className="w-5 h-5 text-emerald-600" />;
      default:
        return <Image className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Paperclip className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Lampirkan Dokumen / Data</h3>
              <p className="text-[11px] text-slate-500">Pilih berkas pendukung telaah valuasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-5 pt-4">
          <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold">Simulasi Dokumen Pendukung:</span> Pilih salah satu sampel dokumen telaah di bawah ini untuk disematkan ke dalam pesan obrolan.
          </div>
        </div>

        {/* Attachment Options */}
        <div className="p-5 space-y-2.5 max-h-64 overflow-y-auto">
          {DEMO_PRESET_ATTACHMENTS.map((att) => {
            const isSelected = selectedItem?.id === att.id;
            return (
              <div
                key={att.id}
                onClick={() => setSelectedItem(att)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {getFileIcon(att.fileType)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 truncate" title={att.fileName}>
                      {att.fileName}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {att.fileSize} • Berkas Telaah
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-3">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!selectedItem}
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors"
          >
            Sematkan Berkas
          </button>
        </div>
      </div>
    </div>
  );
};
