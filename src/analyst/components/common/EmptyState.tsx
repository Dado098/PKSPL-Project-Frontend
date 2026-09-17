import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Belum Ada Data Proyek',
  description = 'Saat ini belum ada data proyek penelitian yang siap dipantau atau direview.',
  actionText,
  onAction
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 md:p-12 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <FolderOpen className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
