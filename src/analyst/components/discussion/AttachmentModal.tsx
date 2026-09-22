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

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let fileType: ChatAttachment['fileType'] = 'doc';
    if (ext === 'pdf') fileType = 'pdf';
    else if (['xls', 'xlsx', 'csv'].includes(ext)) fileType = 'sheet';
    else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) fileType = 'image';
    else if (['geojson', 'shp', 'zip'].includes(ext)) fileType = 'spatial';

    const bytes = file.size;
    let fileSize = `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes >= 1048576) {
      fileSize = `${(bytes / 1048576).toFixed(1)} MB`;
    }

    const newAtt: ChatAttachment = {
      id: `att-upload-${Date.now()}`,
      fileName: file.name,
      fileSize,
      fileType,
      file,
    };

    setSelectedItem(newAtt);
  };

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

        {/* Local File Upload Button */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.zip,.geojson,.shp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-white border border-dashed border-blue-400 hover:border-blue-600 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-blue-700 flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Paperclip className="w-4 h-4 text-blue-600" />
            <span>Pilih Berkas dari Komputer Anda...</span>
          </button>
          {selectedItem?.file && (
            <div className="mt-2 text-[11px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center justify-between">
              <span className="truncate">Berkas terpilih: {selectedItem.fileName} ({selectedItem.fileSize})</span>
              <Check className="w-3.5 h-3.5 shrink-0" />
            </div>
          )}
        </div>

        {/* Preset Header */}
        <div className="px-5 pt-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Atau Gunakan Sampel Dokumen Telaah:
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
