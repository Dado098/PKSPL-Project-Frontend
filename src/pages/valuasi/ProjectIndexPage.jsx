import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Polygon, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Static project data (would come from API/context later)
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

import { moduleCategories, ModuleIcon } from './ModuleDashboardPage'

// Initial indexes for project 3 (Cirebon) as default demo
const defaultIndexes = [
  {
    id: 1,
    name: 'Index 1',
    code: 'IDX-001',
    date: 'Juli 5, 2026 at 10:08',
    jumlahArea: 1,
    luasTotal: '154.72 Ha',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
  {
    id: 2,
    name: 'Index 2',
    code: 'IDX-002',
    date: 'Juli 5, 2026 at 10:08',
    jumlahArea: 3,
    luasTotal: '154.72 Ha',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
  {
    id: 3,
    name: 'Index 3',
    code: 'IDX-003',
    date: 'Juli 5, 2026 at 10:08',
    jumlahArea: 3,
    luasTotal: '154.72 Ha',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
  {
    id: 4,
    name: 'Index 4',
    code: 'IDX-004',
    date: 'Juli 5, 2026 at 10:08',
    jumlahArea: 3,
    luasTotal: '154.72 Ha',
    dibuat: '5 Agustus 2026',
    status: 'Draft',
  },
]

function NewIndexModal({ isOpen, onClose, onCreateIndex, projectId, navigate }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#eef2f7] rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto animate-in flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">Status Modul</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Kelola Modul →
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
              Tutup
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1">
          <div className="space-y-6">
            {moduleCategories.map((cat) => (
              <div
                key={cat.category}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {cat.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className={`bg-white rounded-xl border border-gray-200 border-t-4 ${cat.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col`}
                  >
                    {/* Card Header */}
                    <div className="p-4 pb-3">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-3">
                          <ModuleIcon type={mod.icon} color={cat.color} />
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 leading-tight">{mod.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{mod.records} records</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full flex-shrink-0">
                          Draft
                        </span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 pb-4 mt-auto">
                      <p className="text-xs text-gray-400 mb-0.5">Cakupan jasa ekosistem:</p>
                      <p className={`text-xs font-bold ${cat.textColor} mb-3`}>{cat.category}</p>

                      <button
                        onClick={() => {
                          if (mod.id === 'direct-use-value') {
                            onClose()
                            navigate(`/valuasi/projects/${projectId}/modules/direct-use-value/input`)
                          } else {
                            onCreateIndex({ namaProyek: mod.name, kodeProyek: `MOD-${mod.id.substring(0,3).toUpperCase()}` })
                          }
                        }}
                        className={`w-full py-2 border rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer hover:shadow-sm active:scale-[0.97] border-[#1a56db] text-[#1a56db] hover:bg-blue-50`}
                      >
                        Buka Modul →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const createLabelIcon = (text) => L.divIcon({
  html: `<div style="background-color: white; border: 2px solid #1a56db; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; color: #1a56db; box-shadow: 0 2px 4px rgba(0,0,0,0.1); white-space: nowrap; text-align: center;">${text}</div>`,
  className: '',
  iconSize: [80, 30],
  iconAnchor: [40, 15]
})

const cirebonCenter = [-6.68, 108.55]
const cirebonPolygon = [
  [-6.65, 108.52],
  [-6.65, 108.58],
  [-6.71, 108.58],
  [-6.71, 108.52]
]
const areaMarkers = [
  { pos: [-6.68, 108.57], label: 'Area 1' },
  { pos: [-6.68, 108.53], label: 'Area 2' },
  { pos: [-6.70, 108.55], label: 'Area 3' },
  { pos: [-6.66, 108.55], label: 'Area 4' }
]

function ProjectIndexPage() {
  const { projectId, moduleId } = useParams()
  const navigate = useNavigate()
  const project = projectsData[projectId] || projectsData[3]

  const [indexes, setIndexes] = useState(defaultIndexes)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editData, setEditData] = useState({})
  const [showModal, setShowModal] = useState(false)

  const filteredIndexes = indexes.filter((idx) =>
    idx.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddIndex = (data) => {
    const newId = indexes.length > 0 ? Math.max(...indexes.map((i) => i.id)) + 1 : 1
    const newIndex = {
      id: newId,
      name: data?.namaProyek || `Index Baru ${newId}`,
      code: data?.kodeProyek || `IDX-${String(newId).padStart(3, '0')}`,
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

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSidebarIndex, setExpandedSidebarIndex] = useState(0) // First index expanded by default

  // Static sidebar area data per index (same for all as mockup)
  const sidebarAreas = [
    { name: 'Padang Rumput', color: '#F5FF69' },
    { name: 'Sawah', color: '#69B9FF' },
    { name: 'Hutan Mangrove', color: '#69FF89' },
    { name: 'Pertambangan', color: '#FF696B' },
  ]

  const sidebarAreas2 = [
    { name: 'Savana', color: '#F5FF69' },
    { name: 'Danau', color: '#69B9FF' },
    { name: 'Hutan Cemara', color: '#69FF89' },
    { name: 'Bekas Pertambangan', color: '#FF696B' },
  ]

  // Sidebar indexes (static mockup, same labels as context menu)
  const sidebarIndexes = [
    { id: 'IDX-001', areas: sidebarAreas },
    { id: 'IDX-002', areas: sidebarAreas2 },
    { id: 'IDX-003', areas: sidebarAreas2 },
    { id: 'IDX-004', areas: sidebarAreas },
    { id: 'IDX-005', areas: sidebarAreas },
    { id: 'IDX-006', areas: sidebarAreas2 },
  ]

  return (
    <div className="min-h-screen bg-[#eef2f7] font-inter flex flex-col">
      {/* Top Navbar with Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link
            to="/valuasi/projects"
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Project Page
          </Link>
          <span className="px-3 py-1.5 text-sm font-semibold text-[#1a56db] border-b-2 border-[#1a56db]">
            Index
          </span>
          <span className="px-3 py-1.5 text-sm text-gray-400 cursor-default">
            Area Reklamasi
          </span>
        </div>

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

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 relative">

        {/* Sidebar Toggle Button (closed state) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-0 top-[72px] z-30 w-10 h-10 bg-[#1a56db] rounded-r-lg flex items-center justify-center shadow-lg hover:bg-[#1545b8] transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}

        {/* Sidebar (open state) */}
        <div className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 overflow-hidden ${
          sidebarOpen ? 'w-56 md:w-60' : 'w-0'
        }`}>
          <div className="w-56 md:w-60 h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="text-sm font-bold text-gray-900 truncate">Index - {project.name}</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
            </div>

            {/* Sidebar Index List */}
            <div className="flex-1 overflow-y-auto py-2">
              {sidebarIndexes.map((sIdx, i) => (
                <div key={sIdx.id} className="border-b border-gray-100 last:border-0">
                  {/* Index Header */}
                  <button
                    onClick={() => setExpandedSidebarIndex(expandedSidebarIndex === i ? null : i)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      expandedSidebarIndex === i ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-semibold text-gray-800">{sIdx.id}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                        expandedSidebarIndex === i ? 'rotate-180' : ''
                      }`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Area List (expandable) */}
                  <div className={`overflow-hidden transition-all duration-200 ${
                    expandedSidebarIndex === i ? 'max-h-[300px]' : 'max-h-0'
                  }`}>
                    <div className="pl-6 pr-4 pb-2 space-y-1">
                      {sIdx.areas.map((area) => (
                        <div
                          key={area.name}
                          className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: area.color }}
                          />
                          <span className="text-xs text-gray-600">{area.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            
            {/* Map Preview */}
            <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-gray-200 mb-6 relative z-0">
              <MapContainer center={cirebonCenter} zoom={12} scrollWheelZoom={false} className="w-full h-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polygon positions={cirebonPolygon} pathOptions={{ color: '#1a56db', fillColor: '#1a56db', fillOpacity: 0.2 }} />
                {areaMarkers.map((marker, i) => (
                  <Marker key={i} position={marker.pos} icon={createLabelIcon(marker.label)} />
                ))}
              </MapContainer>
            </div>

            {/* Add Index Button */}
            <button
              id="tambah-index-button"
              onClick={() => setShowModal(true)}
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
                      <span className="text-sm font-semibold text-gray-500 w-8 text-center flex-shrink-0">{idx.id}</span>
                      <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{idx.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 hidden sm:inline">{idx.date}</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (idx.id === 1) {
                            navigate(`/valuasi/projects/${projectId}/index/${idx.id}/areas`)
                          } else {
                            navigate(`/valuasi/projects/${projectId}/index/${idx.id}`)
                          }
                        }}
                        className="px-4 py-1.5 bg-[#1a56db] text-white text-xs font-semibold rounded-lg hover:bg-[#1545b8] active:scale-[0.97] transition-all duration-200 cursor-pointer whitespace-nowrap"
                      >
                        Buka Index
                      </button>

                      {/* Expand Arrow */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                          expandedIndex === idx.id ? 'rotate-180' : ''
                        }`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
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
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Nama</label>
                            <input
                              type="text"
                              value={editData.name || ''}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Kod</label>
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
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Keterangan</h4>
                              <div className="space-y-1 text-sm text-gray-500">
                                <p>Jumlah Area {idx.jumlahArea}</p>
                                <p>Luas Total {idx.luasTotal}</p>
                                <p>Dibuat {idx.dibuat}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-gray-900">Status : </span>
                              <span className="text-sm text-gray-500">{idx.status}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(idx.id) }}
                              className="px-5 py-2 border border-red-400 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              Hapus
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSave(idx.id) }}
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

      <NewIndexModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        projectId={projectId}
        navigate={navigate}
        onCreateIndex={(data) => {
          handleAddIndex(data)
          setShowModal(false)
        }}
      />
    </div>
  )
}

export default ProjectIndexPage
