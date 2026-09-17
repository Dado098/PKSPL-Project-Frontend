import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { ProjectStatusDistribution } from '../../types/analystDashboard';
import { PieChart as PieIcon } from 'lucide-react';

interface StatusDonutChartProps {
  data: ProjectStatusDistribution[];
  totalProjects: number;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ data, totalProjects }) => {
  if (!data || data.length === 0 || totalProjects === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col items-center justify-center min-h-[340px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <PieIcon className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700 mb-1">Status Proyek</h4>
        <p className="text-xs text-slate-400 text-center max-w-xs">
          Belum ada data distribusi status proyek yang tercatat.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as ProjectStatusDistribution;
      return (
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
          <div className="text-slate-600 mt-1 font-mono">
            {item.count} Proyek ({item.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            Status Proyek
          </h3>
          <p className="text-[11px] text-slate-500">
            Distribusi seluruh proyek penelitian
          </p>
        </div>
        <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {totalProjects} Total
        </span>
      </div>

      {/* Donut Chart with Center Text */}
      <div className="relative h-56 w-full my-auto flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-800 font-mono">
            {totalProjects}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Proyek
          </span>
        </div>
      </div>

      {/* Legend List with Count & Percentage */}
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between gap-1.5 p-1 rounded hover:bg-slate-50">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 text-[11px] truncate font-medium">
                {item.label}
              </span>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-800 shrink-0">
              <span className="font-semibold">{item.count}</span>
              <span className="text-slate-400 ml-1">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
