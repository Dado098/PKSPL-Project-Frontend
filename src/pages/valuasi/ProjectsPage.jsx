import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-pkspl.svg'

// Static project data matching UI
const initialProjects = [
  {
    id: 1,
    name: 'Pulau Tidung',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Accepted',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 2,
    name: 'Pulau Seribu',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Draft',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 3,
    name: 'Cirebon',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Accepted',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 4,
    name: 'Ujung Kulon',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Pending',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 5,
    name: 'Dark Forest',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Draft',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 6,
    name: 'Lombok Utara',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Accepted',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 7,
    name: 'Malaysia',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Pending',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 8,
    name: 'Sulawesi Selatan',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Draft',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
  {
    id: 9,
    name: 'Pulau Komodo',
    description: 'analisis Komoditas yang terdapat di pesisir',
    status: 'Accepted',
    lastUpdate: 'Juli 5, 2026 at 10:08',
  },
]

// New Project Modal
function NewProjectModal({ isOpen, onClose, onCreateProject }) {
  const [kodeProyek, setKodeProyek] = useState('PROJ-001')
  const [namaProyek, setNamaProyek] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [batasMode, setBatasMode] = useState('wilayah')
  const [provinsi, setProvinsi] = useState('')
  const [kabupaten, setKabupaten] = useState('')
  const [kecamatan, setKecamatan] = useState('')
  const [kelurahan, setKelurahan] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [shpFile, setShpFile] = useState(null)

  if (!isOpen) return null

  const autoLokasi = [provinsi, kabupaten, kecamatan, kelurahan].filter(Boolean).join(', ')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto animate-in">
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Form Proyek Baru</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Kode Proyek</label>
              <input
                type="text"
                placeholder="PROJ-001"
                value={kodeProyek}
                onChange={(e) => setKodeProyek(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Nama Proyek</label>
              <input
                type="text"
                placeholder="Nama proyek valuasi"
                value={namaProyek}
                onChange={(e) => setNamaProyek(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Deskripsi</label>
            <textarea
              placeholder="Deskripsi proyek..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 resize-y"
            />
          </div>

          <hr className="border-gray-200 mb-6" />

          <div className="mb-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Batas Area &amp; Wilayah</h3>
            <div className="flex items-center gap-3 mb-5">
              <button
                type="button"
                onClick={() => setBatasMode('wilayah')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  batasMode === 'wilayah'
                    ? 'bg-[#5046e5] text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
                }`}
              >
                Pilih Wilayah Administratif
              </button>
              <button
                type="button"
                onClick={() => setBatasMode('shp')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  batasMode === 'shp'
                    ? 'bg-[#5046e5] text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
                }`}
              >
                Upload File SHP
              </button>
            </div>

            {batasMode === 'wilayah' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Provinsi</label>
                    <div className="relative">
                      <select
                        value={provinsi}
                        onChange={(e) => { setProvinsi(e.target.value); setKabupaten(''); setKecamatan(''); setKelurahan('') }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none transition-all duration-200 focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 appearance-none bg-white cursor-pointer"
                      >
                        <option value="">— Pilih provinsi —</option>
                        <option value="DKI Jakarta">DKI Jakarta</option>
                        <option value="Jawa Barat">Jawa Barat</option>
                        <option value="Jawa Tengah">Jawa Tengah</option>
                        <option value="Jawa Timur">Jawa Timur</option>
                        <option value="Banten">Banten</option>
                        <option value="Kalimantan Timur">Kalimantan Timur</option>
                        <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                        <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
                        <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
                        <option value="Papua">Papua</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Kabupaten/Kota</label>
                    <div className="relative">
                      <select
                        value={kabupaten}
                        onChange={(e) => { setKabupaten(e.target.value); setKecamatan(''); setKelurahan('') }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none transition-all duration-200 focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 appearance-none bg-white cursor-pointer"
                      >
                        <option value="">— Pilih kabupaten/kota —</option>
                        <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                        <option value="Jakarta Utara">Jakarta Utara</option>
                        <option value="Jakarta Barat">Jakarta Barat</option>
                        <option value="Jakarta Selatan">Jakarta Selatan</option>
                        <option value="Bogor">Bogor</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Kecamatan</label>
                    <div className="relative">
                      <select
                        value={kecamatan}
                        onChange={(e) => { setKecamatan(e.target.value); setKelurahan('') }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none transition-all duration-200 focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 appearance-none bg-white cursor-pointer"
                      >
                        <option value="">— Pilih kecamatan —</option>
                        <option value="Kepulauan Seribu Utara">Kepulauan Seribu Utara</option>
                        <option value="Kepulauan Seribu Selatan">Kepulauan Seribu Selatan</option>
                        <option value="Penjaringan">Penjaringan</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Kelurahan/Desa</label>
                    <div className="relative">
                      <select
                        value={kelurahan}
                        onChange={(e) => setKelurahan(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none transition-all duration-200 focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 appearance-none bg-white cursor-pointer"
                      >
                        <option value="">— Pilih kelurahan/desa —</option>
                        <option value="Pulau Tidung">Pulau Tidung</option>
                        <option value="Pulau Panggang">Pulau Panggang</option>
                        <option value="Pulau Kelapa">Pulau Kelapa</option>
                        <option value="Pulau Harapan">Pulau Harapan</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex flex-col items-center justify-center py-16 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                  <p className="text-sm text-gray-400">Pilih wilayah di atas untuk menggambar batas area secara otomatis</p>
                </div>
                <p className="text-xs text-[#5046e5] mb-5">
                  Pilih wilayah administratif untuk menggambar batas area otomatis, atau unggah file SHP manual.
                </p>
              </>
            ) : (
              <div className="mb-5">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl py-16 flex flex-col items-center justify-center gap-3 hover:border-[#5046e5]/40 hover:bg-indigo-50/30 transition-all duration-200 cursor-pointer"
                  onClick={() => document.getElementById('shp-file-input')?.click()}
                >
                  <input
                    id="shp-file-input"
                    type="file"
                    accept=".shp,.zip"
                    className="hidden"
                    onChange={(e) => setShpFile(e.target.files?.[0] || null)}
                  />
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  {shpFile ? (
                    <p className="text-sm text-gray-700 font-medium">{shpFile.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      <span className="text-[#5046e5] font-medium hover:underline">Klik atau drag</span> file SHP / ZIP di sini
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Lokasi</label>
            <input
              type="text"
              placeholder="Terisi otomatis dari wilayah yang dipilih, atau isi manual"
              value={lokasi || autoLokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCreateProject}
              className="px-6 py-2.5 bg-[#5046e5] text-white text-sm font-semibold rounded-lg hover:bg-[#4338ca] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Buat Proyek
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-[#5046e5] hover:text-[#4338ca] transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


function ProjectsPage() {
  const navigate = useNavigate()
  const [projects] = useState(initialProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(3) // Row 3 highlighted by default
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [openActionMenu, setOpenActionMenu] = useState(null)

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex flex-col animate-fade-in-up">
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
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Update</th>
                <th className="w-20 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => navigate(`/valuasi/projects/${project.id}/modules/direct-use-value`)}
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

                  {/* Status Badge */}
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      project.status === 'Accepted'
                        ? 'bg-green-100 text-green-700'
                        : project.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
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
                              navigate(`/valuasi/projects/${project.id}/modules/direct-use-value`)
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
        onCreateProject={() => {
          setShowNewProjectModal(false)
          navigate('/valuasi/projects/new/modules/direct-use-value')
        }}
      />
    </div>
  )
}

export default ProjectsPage
