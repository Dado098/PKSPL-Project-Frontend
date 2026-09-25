import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ValuationCategoryData } from '../../types/valuation';
import { ValuationTable } from './ValuationTable';

interface ValuationAccordionProps {
  data: ValuationCategoryData;
  isOpen: boolean;
  onToggle: () => void;
}

export const ValuationAccordion: React.FC<ValuationAccordionProps> = ({
  data,
  isOpen,
  onToggle
}) => {
  const formatIDR = (val?: number | null) => `Rp ${(Number(val) || 0).toLocaleString('id-ID')}`;

  // Theme styling berdasarkan kategori A, B, C, D
  const getThemeStyles = () => {
    switch (data.code) {
      case 'A':
        return {
          cardBorder: 'border-sky-300',
          badgeBg: 'bg-sky-600 text-white',
          headerBg: 'bg-sky-50/40 hover:bg-sky-50/70',
          titleColor: 'text-sky-950',
          activeRing: 'ring-1 ring-sky-200'
        };
      case 'B':
        return {
          cardBorder: 'border-blue-300',
          badgeBg: 'bg-blue-600 text-white',
          headerBg: 'bg-blue-50/40 hover:bg-blue-50/70',
          titleColor: 'text-blue-950',
          activeRing: 'ring-1 ring-blue-200'
        };
      case 'C':
        return {
          cardBorder: 'border-purple-300',
          badgeBg: 'bg-purple-600 text-white',
          headerBg: 'bg-purple-50/40 hover:bg-purple-50/70',
          titleColor: 'text-purple-950',
          activeRing: 'ring-1 ring-purple-200'
        };
      case 'D':
      default:
        return {
          cardBorder: 'border-amber-300',
          badgeBg: 'bg-amber-600 text-white',
          headerBg: 'bg-amber-50/40 hover:bg-amber-50/70',
          titleColor: 'text-amber-950',
          activeRing: 'ring-1 ring-amber-200'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      className={`bg-white rounded-xl border ${theme.cardBorder} overflow-hidden shadow-2xs transition-all ${
        isOpen ? theme.activeRing : ''
      }`}
    >
      {/* Header Card (Clickable) */}
      <div
        onClick={onToggle}
        className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none transition-colors ${theme.headerBg}`}
      >
        {/* Left: Badge + Title + Subtitle */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg ${theme.badgeBg} font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs mt-0.5`}
          >
            {data.code}
          </div>
          <div className="truncate">
            <h4 className={`text-sm sm:text-base font-bold ${theme.titleColor} truncate`}>
              {data.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Metode: <span className="font-semibold text-slate-700">{data.method}</span> •{' '}
              <span className="text-slate-600">{data.dataCount} baris data</span>
            </p>
          </div>
        </div>

        {/* Right: Total Value + Toggle Button */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60">
          <div className="text-left md:text-right">
            <div className="text-xs text-slate-400 font-medium md:hidden">Subtotal Nilai:</div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-900">
              {formatIDR(data.totalValue)}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <span>{isOpen ? 'Tutup Data Valuasi' : 'Buka Data Valuasi'}</span>
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Accordion Body: Table Details */}
      {isOpen && (
        <div className="border-t border-slate-200">
          <ValuationTable category={data.category} rows={data.rows} />
        </div>
      )}
    </div>
  );
};
