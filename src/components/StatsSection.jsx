import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { getLandingStatistics } from '../services/statisticsService';

const fallbackData = [
  { name: 'Jan', projects: 0, count: 0 },
  { name: 'Feb', projects: 0, count: 0 },
  { name: 'Mar', projects: 0, count: 0 },
  { name: 'Apr', projects: 0, count: 0 },
  { name: 'Mei', projects: 0, count: 0 },
  { name: 'Jun', projects: 0, count: 0 },
  { name: 'Jul', projects: 0, count: 0 },
  { name: 'Agu', projects: 0, count: 0 },
  { name: 'Sep', projects: 0, count: 0 },
  { name: 'Okt', projects: 0, count: 0 },
  { name: 'Nov', projects: 0, count: 0 },
  { name: 'Des', projects: 0, count: 0 }
];

const StatsSection = () => {
  const { t } = useTranslation(['landing', 'common']);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getLandingStatistics();
        if (isMounted && data) {
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load landing statistics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => { isMounted = false; };
  }, []);

  const chartData = stats?.monthly_projects?.length ? stats.monthly_projects : fallbackData;
  const totalProjects = stats?.total_projects ?? 0;
  const totalResearchers = stats?.total_researchers ?? 0;

  return (
    <section id="stats" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metric Cards Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('stats.totalProjects')}</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? <span className="text-slate-300 animate-pulse">...</span> : totalProjects}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('stats.totalResearchers')}</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? <span className="text-slate-300 animate-pulse">...</span> : totalResearchers}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('stats.draftStatus')}</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loading ? <span className="text-slate-300 animate-pulse">...</span> : (stats?.project_statuses?.Draft ?? 0)}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div>
            <img 
              src="/images/mangrove-forest.jpg" 
              alt="Mangrove Forest" 
              className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600">{t('stats.chartTitle')}</span>
                {loading && <span className="text-xs text-blue-600 font-medium animate-pulse">{t('stats.chartLoading')}</span>}
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`${value} Proyek`, t('stats.projectsUnit')]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projects" 
                      stroke="#1d4ed8" 
                      strokeWidth={3}
                      dot={{ fill: '#1d4ed8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mt-6">
                {t('stats.title')}
              </h2>
              <p className="text-slate-600 leading-relaxed mt-3">
                {t('stats.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
