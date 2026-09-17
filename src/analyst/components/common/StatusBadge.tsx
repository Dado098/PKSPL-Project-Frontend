import React from 'react';
import { ProjectStatus } from '../../types/project';

interface StatusBadgeProps {
  status: ProjectStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toUpperCase().replace(/\s+/g, '_');

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let dot = 'bg-slate-400';
  let label = status;

  switch (normalized) {
    case 'DRAFT':
      bg = 'bg-slate-100 text-slate-600 border-slate-200';
      dot = 'bg-slate-400';
      label = 'Draft';
      break;
    case 'SIAP_REVIEW':
      bg = 'bg-blue-50 text-blue-700 border-blue-200';
      dot = 'bg-blue-500';
      label = 'Siap Review';
      break;
    case 'DALAM_REVIEW':
    case 'MENUNGGU_ANALYST':
      bg = 'bg-purple-50 text-purple-700 border-purple-200';
      dot = 'bg-purple-500';
      label = 'Dalam Review';
      break;
    case 'REVISI':
    case 'PERLU_PERBAIKAN':
      bg = 'bg-amber-50 text-amber-800 border-amber-200';
      dot = 'bg-amber-500';
      label = 'Revisi';
      break;
    case 'SELESAI':
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dot = 'bg-emerald-500';
      label = 'Selesai';
      break;
    default:
      bg = 'bg-slate-100 text-slate-700 border-slate-200';
      dot = 'bg-slate-400';
      label = status;
  }

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[11px]'
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${bg} ${sizeClasses} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      <span>{label}</span>
    </span>
  );
};
