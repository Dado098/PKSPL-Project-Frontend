import { apiClient } from './api';
import { AnalystDashboardData, AnalystUser, AttentionProject, ProjectStatusDistribution } from '../types/analystDashboard';
import { ProjectStatus } from '../types/project';
import {
  DEFAULT_ANALYST_USER,
  getMockAnalystDashboardData,
  MOCK_ATTENTION_PROJECTS,
  generateDynamicReviewTrend,
  MOCK_RECENT_ACTIVITIES
} from '../mock/analystDashboardMock';

export interface DashboardServiceOptions {
  simulateDelayMs?: number;
  simulateError?: boolean;
  simulateEmpty?: boolean;
}

export interface ProjectQueryParams {
  search?: string;
  status?: string;
  per_page?: number;
  page?: number;
}

export interface ProjectsResponse {
  data: AttentionProject[];
  total: number;
  waitingReviewCount: number;
}

class AnalystDashboardService {
  /**
   * Helper untuk mentransformasikan raw project dari database/API ke model AttentionProject UI
   */
  mapToAttentionProject(item: any): AttentionProject {
    const rawStatus = item.raw_status || item.status || 'Proses';
    let normalizedStatus: ProjectStatus = 'SIAP_REVIEW';

    const s = String(rawStatus).toUpperCase();
    if (s === 'PROSES' || s === 'SIAP_REVIEW' || s === 'SUBMITTED') {
      normalizedStatus = 'SIAP_REVIEW';
    } else if (s === 'DALAM_REVIEW' || s === 'REVIEW' || s === 'IN_REVIEW') {
      normalizedStatus = 'DALAM_REVIEW';
    } else if (s === 'NEED REVISION' || s === 'REVISI' || s === 'NEEDS_REVISION') {
      normalizedStatus = 'REVISI';
    } else if (s === 'SELESAI' || s === 'COMPLETED' || s === 'APPROVED') {
      normalizedStatus = 'SELESAI';
    } else if (s === 'DRAFT') {
      normalizedStatus = 'DRAFT' as any;
    } else {
      normalizedStatus = item.status || 'SIAP_REVIEW';
    }

    const code = item.code || item.kode_proyek || (item.id_proyek ? `PRJ-${String(item.id_proyek).padStart(3, '0')}` : `PRJ-${item.id}`);
    const name = item.name || item.nama_proyek || 'Proyek Penelitian Valuasi';
    const lead = item.lead || item.peneliti || item.user?.nama || item.user?.name || 'Bima Saputra';
    
    // Format lokasi
    let location = item.location;
    if (!location) {
      const kab = item.kabupaten_kota?.nama_kabupaten_kota;
      const prov = item.provinsi?.nama_provinsi;
      if (kab && prov) location = `${kab}, ${prov}`;
      else if (kab) location = kab;
      else if (prov) location = prov;
      else location = 'Kawasan Pesisir Indonesia';
    }

    return {
      id: String(item.code || item.id_proyek || item.id),
      code,
      name,
      lead,
      ecosystem: item.ecosystem || item.ekosistem || 'Ekosistem Pesisir & Laut',
      location,
      status: normalizedStatus,
      updatedAt: item.updatedAt || (item.updated_at ? String(item.updated_at).replace('T', ' ').substring(0, 16) : '2026-09-23 08:00'),
      relativeTime: item.relativeTime || 'Baru saja diperbarui',
      actionRequired: (normalizedStatus === 'SIAP_REVIEW' || normalizedStatus === 'DALAM_REVIEW') ? 'Review' : 'Lihat',
      attentionReason: item.attentionReason || (
        normalizedStatus === 'SIAP_REVIEW' ? 'Pengajuan baru dari Peneliti, menunggu review awal' :
        normalizedStatus === 'DALAM_REVIEW' ? 'Sedang dalam proses telaah dan validasi formulasi' :
        normalizedStatus === 'REVISI' ? 'Menunggu perbaikan dokumen dari Peneliti' :
        normalizedStatus === 'SELESAI' ? 'Telaah telah disetujui dan selesai diverifikasi' :
        'Draft proyek penelitian'
      ),
      statusDescription: item.statusDescription || `Status: ${normalizedStatus}`,
      hasShp: Boolean(item.hasShp || item.shapefile_files || item.geometry)
    };
  }

  /**
   * Mengambil daftar proyek riil dari database melalui endpoint /api/v1/proyek
   */
  async getProjects(params: ProjectQueryParams = {}): Promise<ProjectsResponse> {
    try {
      const queryParams: Record<string, string | number> = {
        per_page: params.per_page || 50,
      };

      if (params.search && params.search.trim() !== '') {
        queryParams.search = params.search.trim();
      }

      if (params.status && params.status !== 'Semua Status' && params.status !== 'ALL') {
        queryParams.status = params.status;
      }

      const res = await apiClient.get<any>('/proyek', queryParams);
      const rawList: any[] = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      const totalCount = res?.meta?.total || rawList.length;

      const mapped = rawList.map((item: any) => this.mapToAttentionProject(item));
      const waitingCount = mapped.filter(p => p.status === 'SIAP_REVIEW').length;

      return {
        data: mapped,
        total: totalCount,
        waitingReviewCount: waitingCount
      };
    } catch (err) {
      console.warn('Gagal memuat proyek dari database, menggunakan fallback data:', err);
      // Fallback ke data mock jika API belum terhubung atau sesi unauthenticated
      let filtered = [...MOCK_ATTENTION_PROJECTS];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.lead.toLowerCase().includes(q) ||
          p.ecosystem.toLowerCase().includes(q)
        );
      }
      if (params.status && params.status !== 'Semua Status' && params.status !== 'ALL') {
        filtered = filtered.filter(p => p.status === params.status);
      }
      return {
        data: filtered,
        total: filtered.length,
        waitingReviewCount: filtered.filter(p => p.status === 'SIAP_REVIEW').length
      };
    }
  }

  /**
   * Mengambil detail proyek berdasarkan ID numerik atau Kode Proyek (misal: 'PRJ-001' atau '1')
   */
  async getProjectById(idOrCode: string): Promise<AttentionProject | null> {
    if (!idOrCode) return null;
    try {
      const res = await apiClient.get<any>(`/proyek/${idOrCode}`);
      const raw = res?.data || res;
      if (raw && (raw.id || raw.id_proyek || raw.kode_proyek)) {
        return this.mapToAttentionProject(raw);
      }
    } catch (err) {
      console.warn(`Gagal memuat detail proyek ${idOrCode} dari database:`, err);
    }

    // Fallback pencarian di mock
    const found = MOCK_ATTENTION_PROJECTS.find(
      p => p.id.toLowerCase() === idOrCode.toLowerCase() || p.code.toLowerCase() === idOrCode.toLowerCase()
    );
    return found || null;
  }

  /**
   * Mengambil data terpadu untuk Dashboard Analyst.
   * Mengintegrasikan data proyek riil dari database PostgreSQL.
   */
  async getDashboardSummary(options: DashboardServiceOptions = {}): Promise<AnalystDashboardData> {
    const { simulateDelayMs = 200, simulateError = false, simulateEmpty = false } = options;

    if (simulateDelayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, simulateDelayMs));
    }

    if (simulateError) {
      throw new Error('Gagal memuat data dashboard. Koneksi server terputus atau sesi tidak valid.');
    }

    if (simulateEmpty) {
      return {
        stats: {
          totalProjects: 0,
          waitingReview: 0,
          inReview: 0,
          needsRevision: 0,
          completed: 0,
          waitingResponse: 0,
        },
        statusDistribution: [],
        reviewTrend: [],
        reviewOutcomes: [],
        attentionProjects: [],
        recentActivities: []
      };
    }

    try {
      // Ambil seluruh proyek riil dari database PostgreSQL
      const projectRes = await this.getProjects({ per_page: 50 });
      const projects = projectRes.data;

      if (projects.length > 0) {
        // Hitung statistik dinamis langsung dari database
        const totalProjects = projectRes.total || projects.length;
        const waitingReview = projects.filter(p => p.status === 'SIAP_REVIEW').length;
        const inReview = projects.filter(p => p.status === 'DALAM_REVIEW').length;
        const needsRevision = projects.filter(p => p.status === 'REVISI').length;
        const completed = projects.filter(p => p.status === 'SELESAI').length;
        const draftCount = projects.filter(p => (p.status as any) === 'DRAFT').length;

        // Distribusi Status dinamis
        const statusDistribution: ProjectStatusDistribution[] = [
          {
            status: 'SIAP_REVIEW',
            label: 'Siap Review',
            count: waitingReview,
            percentage: totalProjects > 0 ? Math.round((waitingReview / totalProjects) * 100) : 0,
            color: '#3b82f6'
          },
          {
            status: 'DALAM_REVIEW',
            label: 'Dalam Review',
            count: inReview,
            percentage: totalProjects > 0 ? Math.round((inReview / totalProjects) * 100) : 0,
            color: '#8b5cf6'
          },
          {
            status: 'REVISI',
            label: 'Revisi',
            count: needsRevision,
            percentage: totalProjects > 0 ? Math.round((needsRevision / totalProjects) * 100) : 0,
            color: '#f59e0b'
          },
          {
            status: 'SELESAI',
            label: 'Selesai',
            count: completed,
            percentage: totalProjects > 0 ? Math.round((completed / totalProjects) * 100) : 0,
            color: '#10b981'
          },
          {
            status: 'DRAFT',
            label: 'Draft',
            count: draftCount,
            percentage: totalProjects > 0 ? Math.round((draftCount / totalProjects) * 100) : 0,
            color: '#94a3b8'
          }
        ];

        return {
          stats: {
            totalProjects,
            waitingReview,
            inReview,
            needsRevision,
            completed,
            waitingResponse: needsRevision
          },
          statusDistribution,
          reviewTrend: generateDynamicReviewTrend(),
          reviewOutcomes: [
            { outcome: 'SELESAI', label: 'Selesai / Disetujui', count: completed, color: '#10b981' },
            { outcome: 'REVISI', label: 'Perlu Revisi', count: needsRevision, color: '#f59e0b' },
            { outcome: 'DALAM_REVIEW', label: 'Dalam Proses Review', count: inReview, color: '#8b5cf6' }
          ],
          // Proyek yang membutuhkan perhatian reviewer
          attentionProjects: projects.slice(0, 8),
          recentActivities: MOCK_RECENT_ACTIVITIES
        };
      }
    } catch (err) {
      console.warn('Gagal memuat statistik dinamis dari backend, menggunakan mock:', err);
    }

    return getMockAnalystDashboardData();
  }

  /**
   * Mengambil data profil user Analyst yang sedang terautentikasi.
   */
  async getAuthenticatedUser(): Promise<AnalystUser> {
    try {
      const res = await apiClient.get<any>('/auth/me');
      if (res && res.data) {
        return {
          id: String(res.data.id || res.data.id_user),
          name: res.data.name || res.data.nama || DEFAULT_ANALYST_USER.name,
          email: res.data.email || DEFAULT_ANALYST_USER.email,
          role: res.data.role?.nama_role || res.data.role || 'Analyst PKSPL',
          avatar: res.data.avatar
        };
      }
    } catch {
      // Jika unauthenticated atau token tidak tersedia
    }

    return DEFAULT_ANALYST_USER;
  }
}

export const analystDashboardService = new AnalystDashboardService();
