/**
 * DATA DEMO SIMULASI UNTUK FITUR DISKUSI ANALYST PKSPL
 * 
 * CATATAN PENTING:
 * Data profil peneliti di bawah ini merupakan DATA DEMO SIMULASI untuk keperluan
 * pengujian antarmuka dan prototyping fungsionalitas UI/UX Frontend Analyst.
 * Data ini BUKAN data pengguna nyata PKSPL.
 */

import { ResearcherUser, Conversation, ChatMessage } from '../types/discussion';

/**
 * Daftar seluruh pengguna dengan role PENELITI (Data Demo)
 */
export const DEMO_ALL_RESEARCHERS: ResearcherUser[] = [
  {
    id: 'peneliti-retno',
    name: 'Dr. Ir. Retno Wulandari, M.Si.',
    academicTitle: 'Peneliti Utama Ekosistem Mangrove',
    specialization: 'Valuasi Ekosistem Mangrove & Estuari',
    email: 'demo.retno@pkspl.ipb.ac.id',
    institution: 'PKSPL IPB University',
    isOnline: true,
    lastSeen: 'Online',
    associatedProjects: [
      {
        code: 'PKS-994KY1',
        name: 'Revitalisasi Mangrove Teluk Benoa'
      }
    ]
  },
  {
    id: 'peneliti-fauzi',
    name: 'Dr. Ahmad Fauzi, S.Kel., M.Sc.',
    academicTitle: 'Peneliti Sumberdaya Pesisir',
    specialization: 'Padang Lamun & Karbon Biru Pesisir',
    email: 'demo.fauzi@pkspl.ipb.ac.id',
    institution: 'PKSPL IPB University',
    isOnline: true,
    lastSeen: 'Online',
    associatedProjects: [
      {
        code: 'PKS-TB4021',
        name: 'Valuasi Padang Lamun & Pesisir Teluk Banten'
      }
    ]
  },
  {
    id: 'peneliti-wayan',
    name: 'Prof. Dr. Wayan Sudarma, M.Env.',
    academicTitle: 'Senior Specialist Konservasi Laut',
    specialization: 'Terumbu Karang & Kawasan Konservasi Perairan',
    email: 'demo.wayan@pkspl.ipb.ac.id',
    institution: 'PKSPL IPB University & Universitas Udayana',
    isOnline: false,
    lastSeen: 'Terakhir aktif 25 menit lalu',
    associatedProjects: [
      {
        code: 'PKS-NP8820',
        name: 'Kajian Valuasi Terumbu Karang Nusa Penida'
      }
    ]
  },
  {
    id: 'peneliti-siti',
    name: 'Siti Nurhaliza, S.Pi., M.Si.',
    academicTitle: 'Peneliti Perikanan & Silvofishery',
    specialization: 'Jasa Ekosistem Hutan Mangrove & Tambak',
    email: 'demo.siti@pkspl.ipb.ac.id',
    institution: 'PKSPL IPB University',
    isOnline: true,
    lastSeen: 'Online',
    associatedProjects: [
      {
        code: 'PKS-MG7731',
        name: 'Penilaian Jasa Ekosistem Mangrove Muara Gembong'
      }
    ]
  },
  {
    id: 'peneliti-budi',
    name: 'Budi Santoso, S.Kel., M.Sc.',
    academicTitle: 'Analis Oseanografi & Sosial Ekonomi',
    specialization: 'Estuari Pesisir & Travel Cost Method',
    email: 'demo.budi@pkspl.ipb.ac.id',
    institution: 'PKSPL IPB University',
    isOnline: false,
    lastSeen: 'Terakhir aktif kemarin, 17:30 WIB',
    associatedProjects: [
      {
        code: 'PKS-EP5512',
        name: 'Valuasi Estuari Pesisir Pulau Pari'
      }
    ]
  },
  {
    id: 'peneliti-hendri',
    name: 'Dr. Hendri Kusumo, M.T.',
    academicTitle: 'Peneliti Geomatika Pesisir',
    specialization: 'GIS Kelautan, Batimetri & Remote Sensing',
    email: 'demo.hendri@pkspl.ipb.ac.id',
    institution: 'PKSPL IPB University',
    isOnline: false,
    lastSeen: 'Terakhir aktif 3 hari lalu',
    associatedProjects: []
  }
];

/**
 * Riwayat pesan mock per percakapan (Data Demo)
 */
export const DEMO_INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-retno': [
    {
      id: 'msg-retno-1',
      conversationId: 'conv-retno',
      senderId: 'peneliti-retno',
      senderRole: 'Peneliti',
      senderName: 'Dr. Ir. Retno Wulandari, M.Si.',
      text: 'Selamat pagi rekan Analyst. Terkait proyek Revitalisasi Mangrove Teluk Benoa, apakah parameter biomassa atas tanah (AGB) sudah sempat ditinjau?',
      timestamp: '09:15',
      createdAt: '2026-09-16T02:15:00Z',
      isRead: true,
      projectContext: {
        projectCode: 'PKS-994KY1',
        projectName: 'Revitalisasi Mangrove Teluk Benoa'
      }
    },
    {
      id: 'msg-retno-2',
      conversationId: 'conv-retno',
      senderId: 'analyst',
      senderRole: 'Analyst',
      senderName: 'Analyst PKSPL',
      text: 'Pagi Bu Retno. Sudah kami periksa pada section Data Valuasi. Secara umum nilai serapan 142 ton C/ha masuk akal, namun rujukan allometrik pohon Rhizophora mohon diperjelas sumber literatur atau data lapangannya.',
      timestamp: '09:22',
      createdAt: '2026-09-16T02:22:00Z',
      isRead: true,
      projectContext: {
        projectCode: 'PKS-994KY1',
        projectName: 'Revitalisasi Mangrove Teluk Benoa'
      }
    },
    {
      id: 'msg-retno-3',
      conversationId: 'conv-retno',
      senderId: 'peneliti-retno',
      senderRole: 'Peneliti',
      senderName: 'Dr. Ir. Retno Wulandari, M.Si.',
      text: 'Baik, rumus yang kami pakai merujuk pada Dharmawan & Siregar (2008) untuk kerapatan tegakan lebat. Nanti saya lampirkan dokumen tabel survei lapangannya ya.',
      timestamp: '09:25',
      createdAt: '2026-09-16T02:25:00Z',
      isRead: true
    },
    {
      id: 'msg-retno-4',
      conversationId: 'conv-retno',
      senderId: 'analyst',
      senderRole: 'Analyst',
      senderName: 'Analyst PKSPL',
      text: 'Terima kasih Bu Retno. Lampiran tersebut akan sangat membantu proses validasi kami agar telaah metodologi langsung berstatus valid.',
      timestamp: '09:28',
      createdAt: '2026-09-16T02:28:00Z',
      isRead: true
    },
    {
      id: 'msg-retno-5',
      conversationId: 'conv-retno',
      senderId: 'peneliti-retno',
      senderRole: 'Peneliti',
      senderName: 'Dr. Ir. Retno Wulandari, M.Si.',
      text: 'Siap! Dokumen verifikasi sedang kami siapkan dalam bentuk PDF ringkas.',
      timestamp: '09:30',
      createdAt: '2026-09-16T02:30:00Z',
      isRead: true
    }
  ],
  'conv-fauzi': [
    {
      id: 'msg-fauzi-1',
      conversationId: 'conv-fauzi',
      senderId: 'analyst',
      senderRole: 'Analyst',
      senderName: 'Analyst PKSPL',
      text: 'Selamat pagi Pak Fauzi. Pada proyek Padang Lamun Teluk Banten, checklist kelayakan sudah 10/10 terpenuhi. Namun batas zonasi Enhalus acoroides di sisi utara sedikit tumpang tindih dengan alur pelayaran nelayan lokal.',
      timestamp: '08:40',
      createdAt: '2026-09-16T01:40:00Z',
      isRead: true,
      projectContext: {
        projectCode: 'PKS-TB4021',
        projectName: 'Valuasi Padang Lamun & Pesisir Teluk Banten'
      }
    },
    {
      id: 'msg-fauzi-2',
      conversationId: 'conv-fauzi',
      senderId: 'peneliti-fauzi',
      senderRole: 'Peneliti',
      senderName: 'Dr. Ahmad Fauzi, S.Kel., M.Sc.',
      text: 'Terima kasih atas masukannya Analyst. Kami sudah melakukan ground check ulang dengan GPS handheld. Poligon SHP versi revisi sudah siap diunggah.',
      timestamp: '08:50',
      createdAt: '2026-09-16T01:50:00Z',
      isRead: true
    },
    {
      id: 'msg-fauzi-3',
      conversationId: 'conv-fauzi',
      senderId: 'peneliti-fauzi',
      senderRole: 'Peneliti',
      senderName: 'Dr. Ahmad Fauzi, S.Kel., M.Sc.',
      text: 'Apakah revisi batas SHP bisa langsung kami unggah pada section Data Spasial atau perlu konfirmasi status terlebih dahulu?',
      timestamp: '08:52',
      createdAt: '2026-09-16T01:52:00Z',
      isRead: false,
      projectContext: {
        projectCode: 'PKS-TB4021',
        projectName: 'Valuasi Padang Lamun & Pesisir Teluk Banten'
      }
    }
  ],
  'conv-wayan': [
    {
      id: 'msg-wayan-1',
      conversationId: 'conv-wayan',
      senderId: 'analyst',
      senderRole: 'Analyst',
      senderName: 'Analyst PKSPL',
      text: 'Salam hormat Prof. Wayan. Terkait nilai rekreasi diving di Nusa Penida, formula Travel Cost Method yang digunakan apakah sudah memperhitungkan opportunity cost waktu kerja wisatawan mancanegara?',
      timestamp: 'Kemarin, 14:10',
      createdAt: '2026-09-15T07:10:00Z',
      isRead: true,
      projectContext: {
        projectCode: 'PKS-NP8820',
        projectName: 'Kajian Valuasi Terumbu Karang Nusa Penida'
      }
    },
    {
      id: 'msg-wayan-2',
      conversationId: 'conv-wayan',
      senderId: 'peneliti-wayan',
      senderRole: 'Peneliti',
      senderName: 'Prof. Dr. Wayan Sudarma, M.Env.',
      text: 'Salam. Ya, kami menggunakan proporsi 1/3 dari estimasi rata-rata upah per jam sesuai standar evaluasi pariwisata bahari NOAA.',
      timestamp: 'Kemarin, 14:35',
      createdAt: '2026-09-15T07:35:00Z',
      isRead: true
    }
  ],
  'conv-siti': [
    {
      id: 'msg-siti-1',
      conversationId: 'conv-siti',
      senderId: 'peneliti-siti',
      senderRole: 'Peneliti',
      senderName: 'Siti Nurhaliza, S.Pi., M.Si.',
      text: 'Halo tim Analyst. Untuk proyek Muara Gembong, catatan telaah mengenai harga unit kayu cemara laut sudah kami terima. Kami sedang memperbarui referensi harga pasar dari dinas terkait.',
      timestamp: 'Kemarin, 11:05',
      createdAt: '2026-09-15T04:05:00Z',
      isRead: true,
      projectContext: {
        projectCode: 'PKS-MG7731',
        projectName: 'Penilaian Jasa Ekosistem Mangrove Muara Gembong'
      }
    },
    {
      id: 'msg-siti-2',
      conversationId: 'conv-siti',
      senderId: 'analyst',
      senderRole: 'Analyst',
      senderName: 'Analyst PKSPL',
      text: 'Bagus Bu Siti. Pastikan melampirkan salinan nota survei pasar setempat agar saat re-submit bisa langsung disetujui.',
      timestamp: 'Kemarin, 11:20',
      createdAt: '2026-09-15T04:20:00Z',
      isRead: true
    }
  ],
  'conv-budi': [
    {
      id: 'msg-budi-1',
      conversationId: 'conv-budi',
      senderId: 'analyst',
      senderRole: 'Analyst',
      senderName: 'Analyst PKSPL',
      text: 'Halo Mas Budi, mohon cek telaah revisi untuk valuasi Estuari Pulau Pari. Kuesioner WTP perlu penambahan minimal 15 responden nelayan tangkap.',
      timestamp: '13 Sep',
      createdAt: '2026-09-13T06:00:00Z',
      isRead: true,
      projectContext: {
        projectCode: 'PKS-EP5512',
        projectName: 'Valuasi Estuari Pesisir Pulau Pari'
      }
    }
  ]
};

/**
 * Daftar percakapan awal (Data Demo)
 * Diurutkan berdasarkan aktivitas terbaru
 */
export const DEMO_INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-retno',
    researcherId: 'peneliti-retno',
    researcher: DEMO_ALL_RESEARCHERS[0],
    lastMessage: DEMO_INITIAL_MESSAGES['conv-retno'][4],
    unreadCount: 0,
    updatedAt: '2026-09-16T02:30:00Z'
  },
  {
    id: 'conv-fauzi',
    researcherId: 'peneliti-fauzi',
    researcher: DEMO_ALL_RESEARCHERS[1],
    lastMessage: DEMO_INITIAL_MESSAGES['conv-fauzi'][2],
    unreadCount: 1, // Pesan masuk belum dibaca
    updatedAt: '2026-09-16T01:52:00Z'
  },
  {
    id: 'conv-wayan',
    researcherId: 'peneliti-wayan',
    researcher: DEMO_ALL_RESEARCHERS[2],
    lastMessage: DEMO_INITIAL_MESSAGES['conv-wayan'][1],
    unreadCount: 0,
    updatedAt: '2026-09-15T07:35:00Z'
  },
  {
    id: 'conv-siti',
    researcherId: 'peneliti-siti',
    researcher: DEMO_ALL_RESEARCHERS[3],
    lastMessage: DEMO_INITIAL_MESSAGES['conv-siti'][1],
    unreadCount: 0,
    updatedAt: '2026-09-15T04:20:00Z'
  },
  {
    id: 'conv-budi',
    researcherId: 'peneliti-budi',
    researcher: DEMO_ALL_RESEARCHERS[4],
    lastMessage: DEMO_INITIAL_MESSAGES['conv-budi'][0],
    unreadCount: 0,
    updatedAt: '2026-09-13T06:00:00Z'
  }
];
