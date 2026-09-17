import React, { useState, useEffect } from 'react';
import { ADMIN_PROJECTS_LIST } from '../mock/adminMock';
import { getProyekList } from '../../services/projectService';
import { formatIDR, formatNumber } from '../utils/formatter';
import { StatusBadge } from '../components/common/StatusBadge';
import { FolderKanban, Plus, Search, Eye, Filter, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminProjectsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectsList, setProjectsList] = useState(ADMIN_PROJECTS_LIST);
  const [loading, setLoading] = useState(false);

  // Fetch real projects from API with fallback to mock data
  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const apiData = await getProyekList();
        if (isMounted && Array.isArray(apiData) && apiData.length > 0) {
          const formatted = apiData.map((p) => ({
            id: p.id_proyek || p.id,
            code: p.kode_proyek || p.code || 'PKS-000',
            name: p.nama_proyek || p.name || 'Proyek Valuasi',
            location: p.alamat_lengkap || p.lokasi || p.location || '-',
            ecosystem: p.ekosistem || p.ecosystem || 'Ekosistem Pesisir',
            lead: p.user?.nama || p.lead || 'Peneliti Utama',
            areaHa: Number(p.luas_total_ha || p.areaHa || 100),
            totalTev: Number(p.total_tev || p.totalTev || 0),
            status: p.status ? p.status.toUpperCase().replace(/\s+/g, '_') : 'DIKERJAKAN',
          }));
          setProjectsList(formatted);
        }
      } catch (err) {
        console.warn('API getProyekList fallback to mock:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.lead || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="text-blue-600 font-bold">Super Admin</span>
            <span>•</span>
            <span>Portofolio Riset</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            <span>Manajemen Seluruh Proyek</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Pantau dan kelola seluruh proyek penelitian valuasi ekonomi pesisir & laut di seluruh Indonesia.
          </p>
        </div>

        <button
          onClick={() => navigate('/peneliti/projects')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Proyek Baru</span>
        </button>
      </div>

      {/* Projects Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode, nama proyek, peneliti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'MENUNGGU_ANALYST', 'DIKERJAKAN', 'PERLU_PERBAIKAN', 'SELESAI'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st === 'ALL'
                  ? 'Semua'
                  : st === 'MENUNGGU_ANALYST'
                  ? 'Menunggu Review'
                  : st === 'DIKERJAKAN'
                  ? 'Dikerjakan'
                  : st === 'PERLU_PERBAIKAN'
                  ? 'Revisi'
                  : 'Selesai'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Kode & Nama Proyek</th>
                <th className="py-3 px-4">Lokasi & Ekosistem</th>
                <th className="py-3 px-4">Peneliti Utama</th>
                <th className="py-3 px-4 text-right">Luas (Ha)</th>
                <th className="py-3 px-4 text-right">Nilai TEV (Rp)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada proyek yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="font-mono text-[11px] text-blue-600">{p.code}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{p.ecosystem}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{p.location}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {p.lead}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-700">
                      {formatNumber(p.areaHa)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatIDR(p.totalTev)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => navigate(`/peneliti/projects/${p.id}/maps`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Buka Modul</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Menampilkan {filteredProjects.length} dari {projectsList.length} proyek penelitian</span>
          <span className="font-medium text-slate-600">Sistem Valuasi Ekonomi PKSPL</span>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectsPage;
