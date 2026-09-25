import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ClipboardCheck,
  Search,
  Filter,
  ArrowLeft,
  Info,
  Clock,
  Layers,
  MapPin,
  ChevronRight,
  User,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { analystDashboardService } from '../services/analystDashboardService';
import { AttentionProject } from '../types/analystDashboard';

export const ProjectReviewPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State parameter query dari URL atau default
  const statusParam = searchParams.get('status') || 'Semua Status';
  const codeParam = searchParams.get('code') || '';

  const [projects, setProjects] = useState<AttentionProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(codeParam);
  const [statusFilter, setStatusFilter] = useState<string>(statusParam);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch data proyek dari backend/database
  const loadProjects = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await analystDashboardService.getProjects({
        search: searchTerm.trim() || undefined,
        status: statusFilter !== 'Semua Status' ? statusFilter : undefined,
        per_page: 50
      });
      setProjects(res.data);
    } catch (err: any) {
      console.error('Gagal mengambil data review proyek:', err);
      setErrorMessage(err?.message || 'Gagal memuat daftar proyek dari database.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchTerm, statusFilter]);

  // Initial load dan trigger saat status filter berubah
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Update query params di URL saat filter berubah
  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    const newParams: Record<string, string> = {};
    if (newStatus !== 'Semua Status') newParams.status = newStatus;
    if (searchTerm) newParams.code = searchTerm;
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setStatusFilter('Semua Status');
    setSearchParams({});
  };

  // Kalkulasi statistik ringkas untuk quick-tabs
  const statsCounts = useMemo(() => {
    const total = projects.length;
    const ready = projects.filter(p => p.status === 'SIAP_REVIEW').length;
    const inReview = projects.filter(p => p.status === 'DALAM_REVIEW').length;
    const revision = projects.filter(p => p.status === 'REVISI').length;
    const completed = projects.filter(p => p.status === 'SELESAI').length;
    return { total, ready, inReview, revision, completed };
  }, [projects]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span
              onClick={() => navigate('/analyst/dashboard')}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Review Proyek</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-blue-600" />
            <span>Daftar Review Proyek Penelitian</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar seluruh proyek penelitian aktif dari Peneliti yang terhubung ke database PostgreSQL untuk telaah valuasi ekonomi dan validasi mutu.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => loadProjects(true)}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors disabled:opacity-60"
            title="Segarkan data dari database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{isRefreshing ? 'Memperbarui...' : 'Segarkan'}</span>
          </button>

          <button
            onClick={() => navigate('/analyst/dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
      </div>

      {/* Info Callout Banner */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-blue-900 leading-relaxed">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <h4 className="font-bold text-sm text-blue-950">
              Workspace Review Analyst Terintegrasi Database
            </h4>
            <span className="bg-blue-200/70 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live Database Connected
            </span>
          </div>
          <p className="text-blue-800/90">
            Data proyek di bawah ini tersinkronisasi langsung dengan tabel <code>proyek</code> dan relasi akun Peneliti di database PostgreSQL. Anda dapat melihat kode proyek, pemilik penelitian, ekosistem, serta membuka workspace review telaah mutu.
          </p>
          {codeParam && (
            <div className="mt-2 text-blue-900 font-medium flex items-center gap-1.5">
              <span>Proyek difilter dari Dashboard:</span>
              <span className="font-mono font-bold bg-blue-100 px-2 py-0.5 rounded text-blue-800 border border-blue-200">
                {codeParam}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => handleStatusFilterChange('Semua Status')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
            statusFilter === 'Semua Status'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Semua Status</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'Semua Status' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {statsCounts.total}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilterChange('SIAP_REVIEW')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
            statusFilter === 'SIAP_REVIEW'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Siap Review</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'SIAP_REVIEW' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700'}`}>
            {statsCounts.ready}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilterChange('DALAM_REVIEW')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
            statusFilter === 'DALAM_REVIEW'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span>Dalam Review</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'DALAM_REVIEW' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-700'}`}>
            {statsCounts.inReview}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilterChange('REVISI')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
            statusFilter === 'REVISI'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Revisi</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'REVISI' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-700'}`}>
            {statsCounts.revision}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilterChange('SELESAI')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
            statusFilter === 'SELESAI'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50/50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Selesai</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'SELESAI' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
            {statsCounts.completed}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode proyek, judul penelitian, nama peneliti..."
            className="w-full pl-9 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setTimeout(() => loadProjects(), 50);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-600 font-medium px-1.5 py-0.5"
            >
              Hapus
            </button>
          )}
        </form>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="SIAP_REVIEW">Siap Review</option>
              <option value="DALAM_REVIEW">Dalam Review</option>
              <option value="REVISI">Revisi</option>
              <option value="SELESAI">Selesai</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'Semua Status') && (
            <button
              onClick={handleResetFilter}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1.5 transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <p className="flex-1">{errorMessage}</p>
          <button
            onClick={() => loadProjects()}
            className="px-2.5 py-1 bg-rose-600 text-white rounded font-semibold text-[11px] hover:bg-rose-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 animate-pulse">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 w-3/4">
                  <div className="w-20 h-5 bg-slate-200 rounded"></div>
                  <div className="w-full h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="w-24 h-6 bg-slate-200 rounded-full"></div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="w-1/2 h-3.5 bg-slate-100 rounded"></div>
                <div className="w-2/3 h-3.5 bg-slate-100 rounded"></div>
                <div className="w-1/3 h-3.5 bg-slate-100 rounded"></div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="w-40 h-5 bg-slate-100 rounded"></div>
                <div className="w-16 h-7 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Tidak ada proyek yang sesuai kriteria
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'Semua Status'
              ? 'Tidak ditemukan proyek yang cocok dengan kata kunci pencarian atau filter status yang dipilih.'
              : 'Belum ada data proyek penelitian yang terdaftar di database untuk saat ini.'}
          </p>
          {(searchTerm || statusFilter !== 'Semua Status') && (
            <button
              onClick={handleResetFilter}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              Tampilkan Semua Proyek
            </button>
          )}
        </div>
      ) : (
        /* Project Cards List - Dinamis dari Database */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Card: Kode Proyek & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-block font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {proj.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {proj.name}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={proj.status} size="sm" />
                  </div>
                </div>

                {/* Metadata Body: Peneliti (Punya Siapa Orangnya), Ekosistem, Lokasi, Terakhir Update */}
                <div className="text-xs space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  {/* Pemilik / Peneliti Proyek */}
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-slate-400 shrink-0">Peneliti:</span>
                    <span className="font-semibold text-slate-900 truncate" title={proj.lead}>
                      {proj.lead}
                    </span>
                  </div>

                  {/* Reviewer jika Status DALAM_REVIEW */}
                  {proj.status === 'DALAM_REVIEW' && (() => {
                    const revList = (proj.reviewers && proj.reviewers.length > 0)
                      ? proj.reviewers
                      : (proj.reviewedBy ? proj.reviewedBy.split(',').map(s => s.trim()).filter(Boolean) : ['Dr. Benny Nababan']);
                    const isMulti = revList.length > 1;

                    return (
                      <div className="flex flex-col gap-1 text-purple-700 bg-purple-50/90 p-2 rounded-lg border border-purple-200 font-medium">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="text-purple-700 text-[11px] font-semibold shrink-0">
                            {isMulti ? `Tim Reviewer (${revList.length} Analis):` : 'Direview oleh:'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 pl-5">
                          {revList.map((r, i) => (
                            <span
                              key={i}
                              className="font-bold text-purple-950 bg-purple-100/90 px-2 py-0.5 rounded text-[11px] border border-purple-200 truncate max-w-full"
                              title={r}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Reviewer jika Status REVISI */}
                  {proj.status === 'REVISI' && (() => {
                    const revList = (proj.reviewers && proj.reviewers.length > 0)
                      ? proj.reviewers
                      : (proj.reviewedBy ? proj.reviewedBy.split(',').map(s => s.trim()).filter(Boolean) : ['Dr. Benny Nababan']);
                    const isMulti = revList.length > 1;

                    return (
                      <div className="flex flex-col gap-1 text-rose-700 bg-rose-50/90 p-2 rounded-lg border border-rose-200 font-medium">
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="text-rose-700 text-[11px] font-semibold shrink-0">
                            {isMulti ? `Pemberi Revisi (${revList.length} Analis):` : 'Direvisi oleh:'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 pl-5">
                          {revList.map((r, i) => (
                            <span
                              key={i}
                              className="font-bold text-rose-950 bg-rose-100/90 px-2 py-0.5 rounded text-[11px] border border-rose-200 truncate max-w-full"
                              title={r}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Ekosistem */}
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-slate-400 shrink-0">Ekosistem:</span>
                    <span className="font-medium text-slate-700 truncate" title={proj.ecosystem}>
                      {proj.ecosystem}
                    </span>
                  </div>

                  {/* Lokasi */}
                  {proj.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-slate-400 shrink-0">Lokasi:</span>
                      <span className="font-medium text-slate-700 truncate" title={proj.location}>
                        {proj.location}
                      </span>
                    </div>
                  )}

                  {/* Terakhir Diperbarui */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-400 shrink-0">Terakhir Diperbarui:</span>
                    <span className="text-slate-600">
                      {proj.updatedAt}
                      {proj.relativeTime && (
                        <span className="text-slate-400 text-[11px] ml-1">({proj.relativeTime})</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Context badge & Review Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded font-medium border border-amber-200 line-clamp-1 max-w-[65%]">
                  {proj.attentionReason}
                </span>

                <button
                  onClick={() => navigate(`/analyst/projects/${proj.code || proj.id}`)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs hover:shadow-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Review</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
