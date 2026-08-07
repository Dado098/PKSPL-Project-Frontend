import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-pkspl.svg'

// Static project data matching UI
const initialProjects = [
  {
    id: 1,
    name: 'Pulau Tidung',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 2,
    name: 'Pulau Seribu',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 3,
    name: 'Mangrove',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 4,
    name: 'Ujung Kulon',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 5,
    name: 'Dark Forest',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 6,
    name: 'Lombok Utara',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 7,
    name: 'Malaysia',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 8,
    name: 'Sulawesi Selatan',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 9,
    name: 'Pulau Komodo',
    description: 'analisis Komoditas yang terdapat di pesisir',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
]

// New Project Modal
function NewProjectModal({ isOpen, onClose }) {
  const [namaProyek, setNamaProyek] = useState('')
  const [tahun, setTahun] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [deskripsi, setDeskripsi] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-6 sm:p-8 animate-in">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Penelitian Baru</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left - Form Fields */}
          <div className="flex-1 space-y-5">
            {/* Nama Penelitian */}
            <div>
              <label htmlFor="modal-nama-penelitian" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Nama Penelitian
              </label>
              <input
                id="modal-nama-penelitian"
                type="text"
                placeholder="Masukan Nama Penelitian"
                value={namaProyek}
                onChange={(e) => setNamaProyek(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
              />
            </div>

            {/* Tahun */}
            <div>
              <label htmlFor="modal-tahun" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Tahun
              </label>
              <input
                id="modal-tahun"
                type="text"
                placeholder="Masukan Periode Tahun"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
              />
            </div>

            {/* Lokasi */}
            <div>
              <label htmlFor="modal-lokasi" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Lokasi
              </label>
              <input
                id="modal-lokasi"
                type="text"
                placeholder="Masukan Nama Lokasi"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label htmlFor="modal-deskripsi" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Deskripsi
              </label>
              <textarea
                id="modal-deskripsi"
                placeholder="Deskripsikan Proyek Penelitian mu..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 resize-none"
              />
            </div>
          </div>

          {/* Right - File Upload */}
          <div className="flex-1 md:pt-0">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Unggah File SHP <span className="font-normal text-gray-400">(Opsional)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 md:h-[calc(100%-28px)] flex flex-col items-center justify-center gap-3 hover:border-[#1a56db]/40 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">
                <span className="text-[#1a56db] font-medium hover:underline">Click atau Upload</span> file SHP disini
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="create-project-button"
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto sm:min-w-[280px] mx-auto block mt-8 py-3 px-8 bg-[#1a56db] text-white text-sm font-semibold rounded-full hover:bg-[#1545b8] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          Buat Penelitian Baru
        </button>
      </div>
    </div>
  )
}

function ProjectsPage() {
  const [projects] = useState(initialProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(3) // Row 3 highlighted by default
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [openActionMenu, setOpenActionMenu] = useState(null)
  const navigate = useNavigate()

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          id="back-to-home"
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Kembali ke Beranda
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

      {/* Content Area */}
      <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 max-w-7xl mx-auto w-full">
        {/* Header with Logo, Search, and New Project Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="PKSPL IPB" className="h-10 w-auto" style={{ filter: 'brightness(0) saturate(100%)' }} />
      
          </div>

          {/* Search + Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                id="search-workspace"
                type="text"
                placeholder="Find Workspace"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 bg-white"
              />
            </div>

            <button
              id="new-project-button"
              onClick={() => setShowNewProjectModal(true)}
              className="px-5 py-2 bg-[#1a56db] text-white text-sm font-semibold rounded-lg hover:bg-[#1545b8] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              + New Projects
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-16 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Penelitian</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Update</th>
                <th className="w-20 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => navigate(`/valuasi/projects/${project.id}`)}
                  className={`cursor-pointer transition-colors ${
                    selectedProject === project.id
                      ? 'bg-[#1a56db] text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onMouseEnter={() => setSelectedProject(project.id)}
                >
                  {/* Number */}
                  <td className={`px-4 py-4 text-center text-sm font-medium ${
                    selectedProject === project.id ? 'text-white' : 'text-gray-500'
                  }`}>
                    {project.id}
                  </td>

                  {/* Name */}
                  <td className={`px-4 py-4 text-sm font-medium ${
                    selectedProject === project.id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {project.name}
                  </td>

                  {/* Description */}
                  <td className={`px-4 py-4 text-sm ${
                    selectedProject === project.id ? 'text-white/90' : 'text-gray-500'
                  }`}>
                    {project.description}
                  </td>

                  {/* Last Update */}
                  <td className={`px-4 py-4 text-sm ${
                    selectedProject === project.id ? 'text-white/90' : 'text-gray-500'
                  }`}>
                    {project.lastUpdate}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-center">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenActionMenu(openActionMenu === project.id ? null : project.id)
                        }}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          selectedProject === project.id
                            ? 'hover:bg-white/20 text-white'
                            : 'hover:bg-gray-100 text-gray-400'
                        }`}
                        aria-label="Project actions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>

                      {/* Dropdown Action Menu */}
                      {openActionMenu === project.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[140px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenActionMenu(null)
                              navigate(`/valuasi/projects/${project.id}`)
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            Buka Proyek
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenActionMenu(null)
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenActionMenu(null)
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
      />
    </div>
  )
}

export default ProjectsPage
