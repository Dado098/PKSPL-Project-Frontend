import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { ReviewOutcomeDistribution } from '../../types/analystDashboard';
import { BarChart3 } from 'lucide-react';

interface ReviewOutcomeBarChartProps {
  data: ReviewOutcomeDistribution[];
}

export const ReviewOutcomeBarChart: React.FC<ReviewOutcomeBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col items-center justify-center min-h-[340px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700 mb-1">Hasil Review</h4>
        <p className="text-xs text-slate-400 text-center max-w-xs">
          Belum ada data hasil proses telaah yang tercatat.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as ReviewOutcomeDistribution;
      return (
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
          <div className="text-slate-600 mt-1 font-mono font-semibold">
            {item.count} Proyek
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
            Hasil Review
          </h3>
          <p className="text-[11px] text-slate-500">
            Distribusi hasil proses verifikasi & telaah mutu
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            >
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Evaluasi Efektivitas Review</span>
        <span className="font-medium text-slate-700">
          Tingkat persetujuan: <strong className="text-emerald-600 font-bold">50%</strong>
        </span>
      </div>
    </div>
  );
};
