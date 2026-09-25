import {
  AnalystDashboardData,
  AnalystUser,
  AttentionProject,
  ProjectStatusDistribution,
  RecentActivity,
  ReviewOutcomeDistribution,
  ReviewTrendPoint
} from '../types/analystDashboard';

/**
 * Identitas Analyst terstandarisasi.
 * Jika belum ada data login/auth aktif dari backend, menggunakan label generik 'Analyst PKSPL'.
 */
export const DEFAULT_ANALYST_USER: AnalystUser = {
  id: 'usr-analyst-default',
  name: 'Analyst PKSPL',
  email: 'analyst@pkspl.ipb.ac.id',
  role: 'Quality & Validation Analyst',
};

/**
 * Menghasilkan periode bulan dinamis (misal 5 bulan terakhir dari tanggal sistem saat ini)
 * agar chart tidak terpaku pada hardcoded bulan tertentu.
 */
export const generateDynamicReviewTrend = (): ReviewTrendPoint[] => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  const currentDate = new Date();
  const points: ReviewTrendPoint[] = [];

  // Ambil 5 bulan terakhir secara dinamis
  for (let i = 4; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    
    // Angka review realistis yang meningkat secara bertahap
    const baseReview = [5, 8, 12, 9, 14][4 - i] ?? 8;
    const baseSubmit = [7, 10, 15, 11, 16][4 - i] ?? 10;

    points.push({
      period: monthLabel,
      reviewedCount: baseReview,
      submittedCount: baseSubmit
    });
  }

  return points;
};

export const MOCK_ATTENTION_PROJECTS: AttentionProject[] = [
  {
    id: 'PKS-994KY1',
    code: 'PKS-994KY1',
    name: 'Revitalisasi Mangrove Teluk Benoa',
    lead: 'Dr. Ir. Retno Wulandari, M.Si.',
    ecosystem: 'Ekosistem Mangrove & Estuari Pesisir',
    location: 'Kabupaten Badung & Kota Denpasar, Bali',
    status: 'SIAP_REVIEW',
    updatedAt: '2026-09-15 14:30',
    relativeTime: '15 menit lalu',
    actionRequired: 'Review',
    attentionReason: 'Pengajuan baru dari Peneliti, menunggu review awal',
    statusDescription: 'Proyek telah dikirim oleh Peneliti dan menunggu proses pemeriksaan Analyst.',
    hasShp: true
  },
  {
    id: 'PKS-TB4021',
    code: 'PKS-TB4021',
    name: 'Valuasi Padang Lamun & Pesisir Teluk Banten',
    lead: 'Dr. Ahmad Fauzi, S.Kel., M.Sc.',
    ecosystem: 'Padang Lamun & Terumbu Karang',
    location: 'Teluk Banten, Kabupaten Serang, Banten',
    status: 'SIAP_REVIEW',
    updatedAt: '2026-09-15 11:20',
    relativeTime: '3 jam lalu',
    actionRequired: 'Review',
    attentionReason: 'Checklist kelayakan 10/10 terpenuhi, siap diverifikasi',
    statusDescription: 'Proyek telah dikirim oleh Peneliti dan menunggu proses pemeriksaan Analyst.',
    hasShp: true
  },
  {
    id: 'PKS-NP8820',
    code: 'PKS-NP8820',
    name: 'Kajian Valuasi Terumbu Karang Kawasan Konservasi Nusa Penida',
    lead: 'Prof. Dr. Wayan Sudarma, M.Env.',
    ecosystem: 'Terumbu Karang & Kawasan Konservasi',
    location: 'Kawasan Konservasi Perairan Nusa Penida, Klungkung, Bali',
    status: 'DALAM_REVIEW',
    reviewedBy: 'Dr. Benny Nababan',
    updatedAt: '2026-09-14 16:45',
    relativeTime: 'Kemarin, 16:45',
    actionRequired: 'Review',
    attentionReason: 'Sedang ditelaah: verifikasi formula jasa rekreasi & diving',
    statusDescription: 'Proyek sedang dalam proses telaah dan verifikasi parameter oleh Analyst.',
    hasShp: true
  },
  {
    id: 'PKS-MG7731',
    code: 'PKS-MG7731',
    name: 'Penilaian Jasa Ekosistem Hutan Mangrove Muara Gembong',
    lead: 'Siti Nurhaliza, S.Pi., M.Si.',
    ecosystem: 'Mangrove & Tambak Silvofishery',
    location: 'Kecamatan Muara Gembong, Kabupaten Bekasi, Jawa Barat',
    status: 'REVISI',
    updatedAt: '2026-09-14 10:15',
    relativeTime: 'Kemarin, 10:15',
    actionRequired: 'Lihat',
    attentionReason: 'Menunggu Peneliti memperbaiki input harga unit kayu cemara',
    statusDescription: 'Proyek dikembalikan kepada Peneliti dengan catatan revisi.',
    hasShp: false
  },
  {
    id: 'PKS-EP5512',
    code: 'PKS-EP5512',
    name: 'Valuasi Estuari Pesisir Pulau Pari Kepulauan Seribu',
    lead: 'Budi Santoso, S.Kel., M.Sc.',
    ecosystem: 'Laguna & Terumbu Karang',
    location: 'Pulau Pari, Kepulauan Seribu Selatan, DKI Jakarta',
    status: 'REVISI',
    updatedAt: '2026-09-13 09:00',
    relativeTime: '2 hari lalu',
    actionRequired: 'Lihat',
    attentionReason: 'Menunggu revisi parameter travel cost survey wisata',
    statusDescription: 'Proyek dikembalikan kepada Peneliti dengan catatan revisi.',
    hasShp: true
  }
];

export const getMockProjectById = (idOrCode: string): AttentionProject | undefined => {
  return MOCK_ATTENTION_PROJECTS.find(
    p => p.id.toLowerCase() === idOrCode.toLowerCase() || p.code.toLowerCase() === idOrCode.toLowerCase()
  );
};

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-001',
    actor: 'Dr. Ir. Retno Wulandari, M.Si.',
    actorRole: 'Peneliti',
    action: 'mengajukan proyek untuk review valuasi ekonomi',
    projectCode: 'PKS-994KY1',
    projectName: 'Revitalisasi Mangrove Teluk Benoa',
    timestamp: '2026-09-15 14:30',
    relativeTime: '15 menit lalu',
    type: 'submission'
  },
  {
    id: 'act-002',
    actor: 'Analyst PKSPL',
    actorRole: 'Analyst',
    action: 'menambahkan catatan review pada metode Market Price Flora',
    projectCode: 'PKS-MG7731',
    projectName: 'Penilaian Jasa Ekosistem Hutan Mangrove Muara Gembong',
    timestamp: '2026-09-15 13:10',
    relativeTime: '1 jam lalu',
    type: 'comment'
  },
  {
    id: 'act-003',
    actor: 'Dr. Ahmad Fauzi, S.Kel., M.Sc.',
    actorRole: 'Peneliti',
    action: 'mengirimkan berkas revisi dan pembaruan data spasial SHP',
    projectCode: 'PKS-TB4021',
    projectName: 'Valuasi Padang Lamun & Pesisir Teluk Banten',
    timestamp: '2026-09-15 11:20',
    relativeTime: '3 jam lalu',
    type: 'revision'
  },
  {
    id: 'act-004',
    actor: 'Analyst PKSPL',
    actorRole: 'Analyst',
    action: 'menyetujui dan menyelesaikan review akhir (Status: Selesai)',
    projectCode: 'PKS-RA1099',
    projectName: 'Kajian Valuasi Ekonomi Mangrove Delta Mahakam',
    timestamp: '2026-09-14 17:00',
    relativeTime: 'Kemarin',
    type: 'approval'
  },
  {
    id: 'act-005',
    actor: 'Prof. Dr. Wayan Sudarma, M.Env.',
    actorRole: 'Peneliti',
    action: 'mengirimkan balasan diskusi pada kolom perhitungan TEV',
    projectCode: 'PKS-NP8820',
    projectName: 'Kajian Valuasi Terumbu Karang Kawasan Konservasi Nusa Penida',
    timestamp: '2026-09-14 14:15',
    relativeTime: 'Kemarin',
    type: 'discussion'
  }
];

export const MOCK_STATUS_DISTRIBUTION: ProjectStatusDistribution[] = [
  { status: 'SIAP_REVIEW', label: 'Siap Review', count: 4, percentage: 22, color: '#3b82f6' }, // Blue
  { status: 'DALAM_REVIEW', label: 'Dalam Review', count: 3, percentage: 17, color: '#8b5cf6' }, // Purple
  { status: 'REVISI', label: 'Revisi', count: 3, percentage: 17, color: '#f59e0b' },             // Amber
  { status: 'SELESAI', label: 'Selesai', count: 6, percentage: 33, color: '#10b981' },           // Green
  { status: 'DRAFT', label: 'Draft', count: 2, percentage: 11, color: '#94a3b8' }                // Slate
];

export const MOCK_REVIEW_OUTCOMES: ReviewOutcomeDistribution[] = [
  { outcome: 'SELESAI', label: 'Selesai / Disetujui', count: 6, color: '#10b981' },
  { outcome: 'REVISI', label: 'Perlu Revisi', count: 3, color: '#f59e0b' },
  { outcome: 'DALAM_REVIEW', label: 'Dalam Proses Review', count: 3, color: '#8b5cf6' }
];

export const getMockAnalystDashboardData = (): AnalystDashboardData => {
  return {
    stats: {
      totalProjects: 18,
      waitingReview: 4,     // SIAP_REVIEW
      inReview: 3,          // DALAM_REVIEW
      needsRevision: 3,     // REVISI
      completed: 6,         // SELESAI
      waitingResponse: 3    // Proyek dengan revisi yang menunggu respons peneliti
    },
    statusDistribution: MOCK_STATUS_DISTRIBUTION,
    reviewTrend: generateDynamicReviewTrend(),
    reviewOutcomes: MOCK_REVIEW_OUTCOMES,
    attentionProjects: MOCK_ATTENTION_PROJECTS,
    recentActivities: MOCK_RECENT_ACTIVITIES
  };
};
