import { useState } from 'react'

// Static activity data matching the UI
const activityLogs = [
  {
    id: 1,
    date: '21 Juli 2026',
    entries: [
      {
        id: 1,
        user: 'Putri Cantika',
        time: '09.35',
        activity: 'Membuat proyek Valuasi Ekonomi Mangrove Kabupaten Bogor',
        avatar: null,
      },
      {
        id: 2,
        user: 'Putri Cantika',
        time: '09.00',
        activity: 'Berhasil login ke sistem',
        avatar: null,
      },
      {
        id: 3,
        user: 'Fauzan Hasan Susyanto',
        time: '08:58',
        activity: 'Melihat hasil analisis',
        avatar: null,
      },
      {
        id: 4,
        user: 'Muh. Ahmad Saputra',
        time: '08:42',
        activity: 'Menyimpan proyek',
        avatar: null,
      },
      {
        id: 5,
        user: 'Fauzan Hasan Susyanto',
        time: '08:20',
        activity: 'Menambahkan 3 Objek Provisioning',
        avatar: null,
      },
    ],
  },
]

function RiwayatAktivitasPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div id="riwayat-aktivitas-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Riwayat Aktivitas</h1>

        {/* Search */}
        <div className="relative">
          <input
            id="search-aktivitas"
            type="text"
            placeholder="Cari Pengguna"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 bg-white"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Activity Log Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Blue Header Bar */}
        <div className="bg-[#1a56db] px-4 md:px-6 py-3 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span className="text-white text-sm font-semibold">Log Aktivitas</span>
        </div>

        {/* Activity Entries */}
        <div className="p-4 md:p-6">
          {activityLogs.map((dayLog) => (
            <div key={dayLog.id}>
              {/* Date Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                  {dayLog.date}
                </span>
              </div>

              {/* Entries */}
              <div className="space-y-1">
                {dayLog.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{entry.user}</span>
                        <span className="text-gray-400 mx-1.5">•</span>
                        <span className="text-gray-500">{entry.time}</span>
                      </p>
                      <p className="text-sm text-gray-500 truncate">{entry.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RiwayatAktivitasPage
