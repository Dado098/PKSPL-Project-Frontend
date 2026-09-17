import React from 'react';

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 w-24 bg-slate-200 rounded"></div>
      <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
    </div>
    <div className="h-8 w-16 bg-slate-300 rounded mb-2"></div>
    <div className="h-3 w-32 bg-slate-200 rounded"></div>
  </div>
);

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-72' }) => (
  <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs animate-pulse flex flex-col ${height}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 w-36 bg-slate-200 rounded"></div>
      <div className="h-4 w-20 bg-slate-100 rounded"></div>
    </div>
    <div className="flex-1 bg-slate-100 rounded-lg flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border-4 border-slate-200 border-t-slate-300 animate-spin"></div>
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 w-48 bg-slate-200 rounded"></div>
      <div className="h-4 w-24 bg-slate-100 rounded"></div>
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center px-4 justify-between">
          <div className="h-4 w-20 bg-slate-200 rounded"></div>
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-16 bg-slate-200 rounded"></div>
          <div className="h-6 w-16 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const FeedSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs animate-pulse">
    <div className="h-5 w-36 bg-slate-200 rounded mb-4"></div>
    <div className="space-y-4">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
