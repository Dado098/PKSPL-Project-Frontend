import React from 'react';
import { ToolMode } from '../../types/annotation';
import {
  MousePointer,
  MessageSquarePlus,
  PenTool,
  Highlighter,
  Square,
  Circle as CircleIcon,
  ArrowUpRight,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

interface ReviewToolbarProps {
  activeTool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  strokeWidth: number;
  onSelectStrokeWidth: (width: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  commentsCount: number;
  openCommentsCount: number;
  isCommentPanelOpen: boolean;
  onToggleCommentPanel: () => void;
}

const COLOR_PALETTE = [
  { name: 'Merah (Kritis)', value: '#ef4444' },
  { name: 'Oranye / Amber (Perhatian)', value: '#f59e0b' },
  { name: 'Biru (Catatan)', value: '#3b82f6' },
  { name: 'Ungu (Metodologi)', value: '#8b5cf6' },
  { name: 'Hijau (Valid)', value: '#10b981' }
];

export const ReviewToolbar: React.FC<ReviewToolbarProps> = ({
  activeTool,
  onSelectTool,
  selectedColor,
  onSelectColor,
  strokeWidth,
  onSelectStrokeWidth,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearAll,
  commentsCount,
  openCommentsCount,
  isCommentPanelOpen,
  onToggleCommentPanel
}) => {
  const tools = [
    { id: 'select' as ToolMode, label: 'Pilih / Jelajah', icon: MousePointer },
    { id: 'comment' as ToolMode, label: 'Beri Pin Komentar', icon: MessageSquarePlus },
    { id: 'pen' as ToolMode, label: 'Pen / Coret', icon: PenTool },
    { id: 'highlight' as ToolMode, label: 'Highlight', icon: Highlighter },
    { id: 'rectangle' as ToolMode, label: 'Kotak', icon: Square },
    { id: 'circle' as ToolMode, label: 'Lingkaran', icon: CircleIcon },
    { id: 'arrow' as ToolMode, label: 'Panah', icon: ArrowUpRight },
    { id: 'text' as ToolMode, label: 'Teks Catatan', icon: Type },
    { id: 'eraser' as ToolMode, label: 'Penghapus', icon: Eraser },
  ];

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-2 px-3 sm:px-6 transition-all select-none">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
        {/* Left: Tools Group */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden lg:inline">
            Review Tools:
          </span>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {tools.map((t) => {
              const Icon = t.icon;
              const isActive = activeTool === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTool(t.id)}
                  title={t.label}
                  className={`p-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden xl:inline text-[11px]">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle: Color & Width Pickers */}
        <div className="flex items-center gap-2 shrink-0 border-l border-r border-slate-200 px-2 sm:px-3 mx-1">
          {/* Color palette */}
          <div className="flex items-center gap-1">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.value}
                onClick={() => onSelectColor(c.value)}
                title={c.name}
                className={`w-5 h-5 rounded-full transition-transform ${
                  selectedColor === c.value ? 'scale-125 ring-2 ring-blue-500 ring-offset-1' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          {/* Stroke Width Picker */}
          <div className="flex items-center gap-1 ml-1 bg-slate-100 p-0.5 rounded border border-slate-200">
            {[2, 4, 8].map((w) => (
              <button
                key={w}
                onClick={() => onSelectStrokeWidth(w)}
                title={`Ketebalan: ${w}px`}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                  strokeWidth === w ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>
        </div>

        {/* Right: Undo, Redo, Clear & Comment Panel Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClearAll}
            title="Hapus seluruh anotasi"
            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors mr-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Toggle Comments Side Panel */}
          <button
            onClick={onToggleCommentPanel}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isCommentPanelOpen
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Komentar</span>
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {openCommentsCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
