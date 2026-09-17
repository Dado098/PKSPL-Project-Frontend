import { apiClient } from './api';
import { AnalystDashboardData, AnalystUser } from '../types/analystDashboard';
import {
  DEFAULT_ANALYST_USER,
  getMockAnalystDashboardData
} from '../mock/analystDashboardMock';

export interface DashboardServiceOptions {
  simulateDelayMs?: number;
  simulateError?: boolean;
  simulateEmpty?: boolean;
}

class AnalystDashboardService {
  /**
   * Mengambil data terpadu untuk Dashboard Analyst.
   * Menggunakan arsitektur Adapter: Mencoba request ke Backend Laravel (Sanctum),
   * dan otomatis fallback ke mock data yang terstruktur jika API belum tersedia.
   */
  async getDashboardSummary(options: DashboardServiceOptions = {}): Promise<AnalystDashboardData> {
    const { simulateDelayMs = 400, simulateError = false, simulateEmpty = false } = options;

    // Simulasi latency jaringan untuk menguji loading skeleton
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
      // Upaya memanggil endpoint backend Laravel jika tersedia
      const res = await apiClient.get<any>('/analyst/dashboard/summary');
      if (res && res.data) {
        return this.adaptBackendData(res.data);
      }
    } catch {
      // Backend endpoint belum tersedia di Laravel saat ini.
      // Gunakan adapter mock data terstruktur secara aman.
    }

    return getMockAnalystDashboardData();
  }

  /**
   * Mengambil data profil user Analyst yang sedang terautentikasi.
   * Jika auth belum terintegrasi, fallback ke label generik 'Analyst PKSPL'.
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

    // Default label generik sesuai instruksi: 'Analyst PKSPL'
    return DEFAULT_ANALYST_USER;
  }

  /**
   * Adapter untuk memetakan respon backend API masa depan ke format data UI
   */
  private adaptBackendData(raw: any): AnalystDashboardData {
    return {
      stats: {
        totalProjects: raw.total_projects ?? 0,
        waitingReview: raw.waiting_review ?? 0,
        inReview: raw.in_review ?? 0,
        needsRevision: raw.needs_revision ?? 0,
        completed: raw.completed ?? 0,
        waitingResponse: raw.waiting_response ?? 0,
      },
      statusDistribution: raw.status_distribution || [],
      reviewTrend: raw.review_trend || [],
      reviewOutcomes: raw.review_outcomes || [],
      attentionProjects: raw.attention_projects || [],
      recentActivities: raw.recent_activities || []
    };
  }
}

export const analystDashboardService = new AnalystDashboardService();
