import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ReviewTrendPoint } from '../../types/analystDashboard';
import { TrendingUp } from 'lucide-react';

interface ReviewTrendLineChartProps {
  data: ReviewTrendPoint[];
}

export const ReviewTrendLineChart: React.FC<ReviewTrendLineChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col items-center justify-center min-h-[340px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700 mb-1">Tren Review Proyek</h4>
        <p className="text-xs text-slate-400 text-center max-w-xs">
          Belum ada riwayat aktivitas review untuk periode ini.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg shadow-md p-3 text-xs">
          <div className="font-bold text-slate-800 mb-1.5 border-b border-slate-100 pb-1">
            Periode: {label}
          </div>
          <div className="space-y-1 font-mono">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}:
                </span>
                <span className="font-bold text-slate-800">{item.value} Proyek</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Tren Review Proyek
            </h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              Aktivitas Meningkat
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Perkembangan proyek masuk & proyek selesai ditelaah dari waktu ke waktu
          </p>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="period"
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
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="reviewedCount"
              name="Proyek Selesai Direview"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="submittedCount"
              name="Pengajuan Masuk"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#94a3b8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
