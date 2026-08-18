import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

// Static project data (would come from API/context later)
const projectsData = {
  1: { name: 'Pulau Tidung', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  2: { name: 'Pulau Seribu', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  3: { name: 'Mangrove', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  4: { name: 'Ujung Kulon', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  5: { name: 'Dark Forest', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  6: { name: 'Lombok Utara', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  7: { name: 'Malaysia', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  8: { name: 'Sulawesi Selatan', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  9: { name: 'Pulau Komodo', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
}

// Initial indexes for project 3 (Mangrove) as default demo
const defaultIndexes = [
  {
    id: 1,
    name: 'Mangrove Utara',
    code: 'IDX-001',
    date: 'Juli 5, 2026 at 10:08',
    jumlahArea: 3,
    luasTotal: '154.72 Ha',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
  {
    id: 2,
    name: 'Mangrove Selatan',
    code: 'IDX-002',
    date: 'Juli 5, 2026 at 10:08',
    jumlahArea: 3,
    luasTotal: '154.72 Ha',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
  {
    id: 3,
    name: 'Mangrove Barat',
    code: 'IDX-003',
    date: 'Juli 5, 2026 at 10:08',
    jumlahArea: 3,
    luasTotal: '154.72 Ha',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
]

function ProjectIndexPage() {
  const { projectId, moduleId } = useParams()
  const navigate = useNavigate()
  const project = projectsData[projectId] || projectsData[3]

  const [indexes, setIndexes] = useState(defaultIndexes)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editData, setEditData] = useState({})

  const filteredIndexes = indexes.filter((idx) =>
    idx.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddIndex = () => {
    const newId = indexes.length > 0 ? Math.max(...indexes.map((i) => i.id)) + 1 : 1
    const newIndex = {
      id: newId,
      name: `Index Baru ${newId}`,
      code: `IDX-${String(newId).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('id-ID', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) + ' at ' + new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      jumlahArea: 0,
      luasTotal: '0 Ha',
      dibuat: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: 'Draft',
    }
    setIndexes([...indexes, newIndex])
    // Auto-expand the new index for editing
    setExpandedIndex(newId)
    setEditData({ name: newIndex.name, code: newIndex.code })
  }

  const handleExpandToggle = (id) => {
    if (expandedIndex === id) {
      setExpandedIndex(null)
      setEditData({})
    } else {
      const idx = indexes.find((i) => i.id === id)
      setExpandedIndex(id)
      setEditData({ name: idx.name, code: idx.code })
    }
  }

  const handleSave = (id) => {
    setIndexes(
      indexes.map((idx) =>
        idx.id === id
          ? { ...idx, name: editData.name, code: editData.code }
          : idx
      )
    )
    setExpandedIndex(null)
    setEditData({})
  }

  const handleDelete = (id) => {
    setIndexes(indexes.filter((idx) => idx.id !== id))
    setExpandedIndex(null)
    setEditData({})
  }

  return (
    <div className="min-h-screen bg-[#eef2f7] font-inter flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
        <Link
          to={`/valuasi/projects/${projectId}/modules`}
          id="back-to-modules"
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Kembali ke Modul
        </Link>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Dhafa</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto w-full">
        {/* Project Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a56db] mb-1">{project.name}</h1>
            <p className="text-sm text-gray-500">
              {project.description}
              <span className="ml-4 text-gray-400">Created at : {project.createdAt}</span>
            </p>
          </div>

          {/* Search */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              id="search-index"
              type="text"
              placeholder="Find Index"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 bg-white"
            />
          </div>
        </div>

        {/* Index Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
          {/* Add Index Button */}
          <button
            id="tambah-index-button"
            onClick={handleAddIndex}
            className="w-full py-3.5 bg-[#1a56db] text-white text-base font-semibold rounded-xl hover:bg-[#1545b8] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 cursor-pointer mb-6"
          >
            + Tambah Index
          </button>

          {/* Index List */}
          <div className="space-y-3">
            {filteredIndexes.map((idx) => (
              <div key={idx.id}>
                {/* Index Row */}
                <div
                  onClick={() => handleExpandToggle(idx.id)}
                  className={`flex items-center justify-between px-4 md:px-6 py-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    expandedIndex === idx.id
                      ? 'border-[#1a56db]/30 bg-blue-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Number */}
                    <span className="text-sm font-semibold text-gray-500 w-8 text-center flex-shrink-0">
                      {idx.id}
                    </span>
                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
                    {/* Name */}
                    <span className="text-sm font-medium text-gray-900">{idx.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Date */}
                    <span className="text-sm text-gray-500 hidden sm:inline">{idx.date}</span>

                    {/* Open Index Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/valuasi/projects/${projectId}/index/${idx.id}`)
                      }}
                      className="px-4 py-1.5 bg-[#1a56db] text-white text-xs font-semibold rounded-lg hover:bg-[#1545b8] active:scale-[0.97] transition-all duration-200 cursor-pointer whitespace-nowrap"
                    >
                      Buka Index
                    </button>
                  </div>
                </div>

                {/* Expandable Edit Panel */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedIndex === idx.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="mt-1 px-4 md:px-6 py-5 border border-t-0 border-gray-200 rounded-b-xl bg-white">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left - Edit Fields */}
                      <div className="flex-1 space-y-4">
                        {/* Nama Index */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                            Nama Index
                          </label>
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
                          />
                        </div>

                        {/* Kode */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                            Kode
                          </label>
                          <input
                            type="text"
                            value={editData.code || ''}
                            onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
                          />
                        </div>
                      </div>

                      {/* Right - Info & Actions */}
                      <div className="flex-1">
                        {/* Keterangan */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Keterangan</h4>
                            <div className="space-y-1 text-sm text-gray-500">
                              <p>Jumlah Area {idx.jumlahArea}</p>
                              <p>Luas Total {idx.luasTotal}</p>
                              <p>Dibuat {idx.dibuat}</p>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">Status : </span>
                            <span className="text-sm text-gray-500">{idx.status}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 mt-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(idx.id)
                            }}
                            className="px-5 py-2 border border-red-400 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSave(idx.id)
                            }}
                            className="px-5 py-2 border border-[#1a56db] text-[#1a56db] text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredIndexes.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm">Belum ada index. Klik "+ Tambah Index" untuk membuat.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectIndexPage
