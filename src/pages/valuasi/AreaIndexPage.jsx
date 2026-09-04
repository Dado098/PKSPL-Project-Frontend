import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ProfileDropdown from '../../components/ProfileDropdown'

// Static project data matching ProjectIndexPage
const projectsData = {
  1: { name: 'Pulau Tidung', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  2: { name: 'Pulau Seribu', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  3: { name: 'Cirebon', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  4: { name: 'Ujung Kulon', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  5: { name: 'Dark Forest', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  6: { name: 'Lombok Utara', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  7: { name: 'Malaysia', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  8: { name: 'Sulawesi Selatan', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
  9: { name: 'Pulau Komodo', description: 'analisis Komoditas yang terdapat di pesisir', createdAt: 'July 5, 2026  08:42' },
}

const defaultAreas = [
  {
    id: 1,
    name: 'Area Timur',
    code: 'AREA-001',
    date: 'Juli 5, 2026 at 10:08',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
  {
    id: 2,
    name: 'Area Barat',
    code: 'AREA-002',
    date: 'Juli 5, 2026 at 10:08',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
  {
    id: 3,
    name: 'Area Selatan',
    code: 'AREA-003',
    date: 'Juli 5, 2026 at 10:08',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
  {
    id: 4,
    name: 'Area Utara',
    code: 'AREA-004',
    date: 'Juli 5, 2026 at 10:08',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
]

export default function AreaIndexPage() {
  const { projectId, indexId } = useParams()
  const navigate = useNavigate()
  const project = projectsData[projectId] || projectsData[3]

  const [areas, setAreas] = useState(defaultAreas)
  const [expandedArea, setExpandedArea] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editData, setEditData] = useState({})

  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddArea = () => {
    const newId = areas.length > 0 ? Math.max(...areas.map((i) => i.id)) + 1 : 1
    const newArea = {
      id: newId,
      name: `Area Baru ${newId}`,
      code: `AREA-${String(newId).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('id-ID', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) + ' at ' + new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      dibuat: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: 'Draft',
    }
    setAreas([...areas, newArea])
    setExpandedArea(newId)
    setEditData({ name: newArea.name, code: newArea.code })
  }

  const handleExpandToggle = (id) => {
    if (expandedArea === id) {
      setExpandedArea(null)
      setEditData({})
    } else {
      const area = areas.find((i) => i.id === id)
      setExpandedArea(id)
      setEditData({ name: area.name, code: area.code })
    }
  }

  const handleSave = (id) => {
    setAreas(
      areas.map((area) =>
        area.id === id
          ? { ...area, name: editData.name, code: editData.code }
          : area
      )
    )
    setExpandedArea(null)
    setEditData({})
  }

  const handleDelete = (id) => {
    setAreas(areas.filter((area) => area.id !== id))
    setExpandedArea(null)
    setEditData({})
  }

  return (
    <div className="min-h-screen bg-[#eef2f7] font-inter flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
        <Link
          to={`/valuasi/projects/${projectId}/modules/direct-use-value`}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Kembali ke Index
        </Link>

        {/* Profile */}
        <ProfileDropdown isScrolled={true} />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto w-full">
        {/* Project Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a56db] mb-1">{project.name} - Index {indexId}</h1>
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
              type="text"
              placeholder="Find Area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 bg-white"
            />
          </div>
        </div>

        {/* Area Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
          
          {/* Add Area Button */}
          <button
            onClick={handleAddArea}
            className="w-full py-3.5 bg-[#1a56db] text-white text-base font-semibold rounded-xl hover:bg-[#1545b8] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 cursor-pointer mb-6"
          >
            + Tambah Area
          </button>

          {/* Area List */}
          <div className="space-y-3">
            {filteredAreas.map((area) => (
              <div key={area.id}>
                {/* Area Row */}
                <div
                  onClick={() => handleExpandToggle(area.id)}
                  className={`flex items-center justify-between px-4 md:px-6 py-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    expandedArea === area.id
                      ? 'border-[#1a56db]/30 bg-blue-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Number */}
                    <span className="text-sm font-semibold text-gray-500 w-8 text-center flex-shrink-0">
                      {area.id}
                    </span>
                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
                    {/* Name */}
                    <span className="text-sm font-medium text-gray-900">{area.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Date */}
                    <span className="text-sm text-gray-500 hidden sm:inline">{area.date}</span>

                    {/* Open Area Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/valuasi/projects/${projectId}/index/${indexId}/areas/${area.id}`)
                      }}
                      className="px-4 py-1.5 bg-[#1a56db] text-white text-xs font-semibold rounded-lg hover:bg-[#1545b8] active:scale-[0.97] transition-all duration-200 cursor-pointer whitespace-nowrap"
                    >
                      Buka Area
                    </button>
                  </div>
                </div>

                {/* Expandable Edit Panel */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedArea === area.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="mt-1 px-4 md:px-6 py-5 border border-t-0 border-gray-200 rounded-b-xl bg-white">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left - Edit Fields */}
                      <div className="flex-1 space-y-4">
                        {/* Nama Area */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                            Nama Area
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
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">DIBUAT</p>
                            <p className="text-sm text-gray-900">{area.dibuat}</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">STATUS</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {area.status}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleSave(area.id)}
                            className="flex-1 py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-lg hover:bg-[#1545b8] transition-colors"
                          >
                            Simpan Perubahan
                          </button>
                          <button
                            onClick={() => handleDelete(area.id)}
                            className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center"
                            title="Hapus Area"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredAreas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">Tidak ada area yang ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
