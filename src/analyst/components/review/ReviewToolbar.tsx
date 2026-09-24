import React, { useState } from 'react';
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
  ArrowLeftRight,
  Minus,
  Maximize2,
  GripVertical
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dockSide, setDockSide] = useState<'left' | 'right'>(() => {
    try {
      return (localStorage.getItem('pkspl_review_toolbar_dock') as 'left' | 'right') || 'left';
    } catch {
      return 'left';
    }
  });

  const toggleDockSide = () => {
    const nextSide = dockSide === 'left' ? 'right' : 'left';
    setDockSide(nextSide);
    try {
      localStorage.setItem('pkspl_review_toolbar_dock', nextSide);
    } catch {
      // Ignore if localStorage is unavailable
    }
  };

  const tools = [
    { id: 'select' as ToolMode, label: 'Pilih / Jelajah', shortLabel: 'Pilih', icon: MousePointer },
    { id: 'comment' as ToolMode, label: 'Beri Pin Komentar', shortLabel: 'Pin', icon: MessageSquarePlus },
    { id: 'pen' as ToolMode, label: 'Pen / Coret Bebas', shortLabel: 'Pen', icon: PenTool },
    { id: 'highlight' as ToolMode, label: 'Highlight Stabilo', shortLabel: 'Stabilo', icon: Highlighter },
    { id: 'rectangle' as ToolMode, label: 'Kotak / Frame', shortLabel: 'Kotak', icon: Square },
    { id: 'circle' as ToolMode, label: 'Lingkaran / Zona', shortLabel: 'Lingkar', icon: CircleIcon },
    { id: 'arrow' as ToolMode, label: 'Panah Petunjuk', shortLabel: 'Panah', icon: ArrowUpRight },
    { id: 'text' as ToolMode, label: 'Teks Catatan', shortLabel: 'Teks', icon: Type },
    { id: 'eraser' as ToolMode, label: 'Penghapus Elemen', shortLabel: 'Hapus', icon: Eraser },
  ];

  // Dynamic position classes
  const positionClass = dockSide === 'left'
    ? 'left-3 sm:left-4 md:left-[272px]'
    : isCommentPanelOpen
    ? 'right-3 sm:right-[404px]'
    : 'right-3 sm:right-6';

  // If collapsed: render small sleek pill
  if (isCollapsed) {
    return (
      <div className={`fixed top-24 ${positionClass} z-40 transition-all duration-200 select-none animate-in fade-in`}>
        <div
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-full cursor-pointer hover:bg-slate-50 transition-all hover:scale-105 group"
          title="Klik untuk membuka Review Tools"
        >
          <PenTool className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-slate-800">Review Tools</span>
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-slate-300"
            style={{ backgroundColor: selectedColor }}
          />
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Panel Alat Telaah"
      className={`fixed top-24 ${positionClass} z-40 transition-all duration-200 select-none`}
    >
      <div className="w-[124px] bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-2xl p-2 flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150">
        {/* 1. Header Toolbar: Title, Dock Switcher, Minimize */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 px-0.5">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <GripVertical className="w-3 h-3 text-slate-400" />
            <span>Tools</span>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={toggleDockSide}
              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              title={dockSide === 'left' ? 'Pindahkan ke sisi Kanan' : 'Pindahkan ke sisi Kiri'}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Minimize panel tools"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Tool Buttons (2-Column Grid) */}
        <div className="grid grid-cols-2 gap-1">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTool(t.id)}
                title={t.label}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs scale-102 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                } ${t.id === 'eraser' ? 'col-span-2 flex-row gap-1.5 py-1' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] leading-tight mt-0.5 truncate">{t.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Divider */}
        <div className="h-px bg-slate-100 my-0.5" />

        {/* 4. Color Palette */}
        <div className="flex items-center justify-center gap-1.5 py-0.5">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onSelectColor(c.value)}
              title={c.name}
              className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                selectedColor === c.value
                  ? 'scale-125 ring-2 ring-blue-500 ring-offset-1 shadow-2xs'
                  : 'hover:scale-115 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        {/* 5. Stroke Width */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
          {[2, 4, 8].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => onSelectStrokeWidth(w)}
              title={`Ketebalan goresan: ${w}px`}
              className={`py-0.5 rounded text-[9px] font-mono font-bold transition-colors cursor-pointer text-center ${
                strokeWidth === w
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {w}px
            </button>
          ))}
        </div>

        {/* 6. History Actions (Undo, Redo, Clear) */}
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClearAll}
            title="Hapus seluruh coretan anotasi"
            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7. Divider */}
        <div className="h-px bg-slate-100 my-0.5" />

        {/* 8. Toggle Comment Panel Button */}
        <button
          type="button"
          onClick={onToggleCommentPanel}
          title={isCommentPanelOpen ? 'Tutup Panel Komentar' : 'Buka Panel Komentar'}
          className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
            isCommentPanelOpen
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span>Komentar</span>
          {openCommentsCount > 0 && (
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isCommentPanelOpen
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {openCommentsCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
