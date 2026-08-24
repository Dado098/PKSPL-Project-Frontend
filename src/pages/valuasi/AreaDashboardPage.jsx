import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { moduleCategories, ModuleIcon } from './ModuleDashboardPage'

export default function AreaDashboardPage() {
  const { projectId, indexId, areaId } = useParams()
  const navigate = useNavigate()

  // Area names lookup
  const areaNames = { 1: 'Area Timur', 2: 'Area Barat', 3: 'Area Selatan', 4: 'Area Utara' }
  const areaName = areaNames[Number(areaId)] || `Area ${areaId}`

  // State for interactive elements
  const [isEditing, setIsEditing] = useState(false)
  const [showAsumsiModal, setShowAsumsiModal] = useState(false)
  const [showModulModal, setShowModulModal] = useState(false)
  const [selectedModules, setSelectedModules] = useState({})
  const [asumsi, setAsumsi] = useState({
    tahunDasar: '2026',
    discountRate: '6,00%',
    periodeAnalisis: '10 tahun',
    mataUang: 'IDR',
    dasarNilaiEOP: 'Net EOP (setelah biaya produksi)',
    rentangTahun: '-',
  })

  // Wilayah data
  const [wilayahList, setWilayahList] = useState([
    { id: 1, name: 'Mangrove Lokal' },
    { id: 2, name: 'Mangrove Swasta' },
  ])

  // Module selection helpers
  const toggleModule = (category, moduleId) => {
    setSelectedModules(prev => {
      const current = prev[category]
      if (current === moduleId) {
        const copy = { ...prev }
        delete copy[category]
        return copy
      }
      return { ...prev, [category]: moduleId }
    })
  }

  const selectedCount = Object.keys(selectedModules).length
  const allCategoriesSelected = moduleCategories.every(cat => selectedModules[cat.category])

  const handleSelanjutnya = () => {
    setShowModulModal(false)
    setSelectedModules({})
    navigate(`/valuasi/projects/${projectId}/index/${indexId}/form`)
  }

  // Category labels for the 4 service types
  const serviceCategories = [
    { key: 'Provisioning', label: 'A. Provisioning Services', color: '#2563eb' },
    { key: 'Regulating', label: 'B. Regulating Services', color: '#16a34a' },
    { key: 'Supporting', label: 'C. Supporting Services', color: '#9333ea' },
    { key: 'Cultural', label: 'D. Cultural Services', color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 capitalize mb-1">daerah cirebon</h1>
            <p className="text-sm text-gray-500 font-medium">Detail Proyek 084902 &bull; {areaName}</p>
          </div>
          
          <div className="flex flex-col items-end gap-4 mt-4 lg:mt-0">
            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <span>Kamis, 20 Agustus 2026</span>
              <a href="#" className="flex items-center gap-1.5 hover:text-[#1a56db] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Situs Publik
              </a>
            </div>
            
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => alert('Fitur Uji Asumsi sedang dalam pengembangan.')}
                className="px-4 py-2 border border-[#1a56db]/30 text-[#1a56db] rounded-xl text-sm font-semibold bg-white hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
              >
                Uji Asumsi
              </button>
              <button
                onClick={() => alert('Fitur Validasi Stakeholder sedang dalam pengembangan.')}
                className="px-4 py-2 border border-[#1a56db]/30 text-[#1a56db] rounded-xl text-sm font-semibold bg-white hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
              >
                Validasi Stakeholder
              </button>
              <button
                onClick={() => alert('TEV dihitung: Rp 0 (belum ada data).')}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#1a56db] hover:bg-[#1545b8] flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Hitung TEV
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 border rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm cursor-pointer ${
                  isEditing
                    ? 'border-green-400 text-green-700 bg-green-50 hover:bg-green-100'
                    : 'border-[#1a56db]/30 text-[#1a56db] bg-white hover:bg-blue-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {isEditing ? 'Selesai Edit' : 'Edit'}
              </button>
            </div>
          </div>
        </div>

        {/* Back Link & Active Tab */}
        <div className="mb-10">
          <Link 
            to={`/valuasi/projects/${projectId}/index/${indexId}/areas`} 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Kembali ke Daftar Area
          </Link>
          
          <div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-md hover:bg-blue-700 transition-colors cursor-pointer">
              Total Keseluruhan
            </button>
          </div>
        </div>

        {/* Main 4 Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/60 mb-14 bg-[#f4f7fb]">
          <div className="text-center px-4 py-6">
            <h3 className="text-sm font-bold text-gray-600 mb-3 tracking-wide">TEV</h3>
            <p className="text-[32px] leading-none font-bold text-[#1a56db]">Rp0</p>
            <p className="text-[11px] text-gray-400 mt-3 uppercase tracking-wider font-medium">Total Economic Value</p>
          </div>
          <div className="text-center px-4 py-6">
            <h3 className="text-sm font-bold text-gray-600 mb-3 tracking-wide">Total Manfaat</h3>
            <p className="text-[32px] leading-none font-bold text-[#10b981]">Rp0</p>
            <p className="text-[11px] text-gray-400 mt-3 uppercase tracking-wider font-medium">Present Value (PV)</p>
          </div>
          <div className="text-center px-4 py-6">
            <h3 className="text-sm font-bold text-gray-600 mb-3 tracking-wide">Total Biaya</h3>
            <p className="text-[32px] leading-none font-bold text-[#ef4444]">Rp0</p>
            <p className="text-[11px] text-gray-400 mt-3 uppercase tracking-wider font-medium">Present Value (PV)</p>
          </div>
          <div className="text-center px-4 py-6 flex flex-col justify-center items-center">
            <h3 className="text-sm font-bold text-gray-600 mb-4 tracking-wide">BCR</h3>
            <p className="text-sm font-medium text-gray-400">Belum ada biaya</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200/60 mb-10"></div>

        {/* Asumsi Valuasi Section */}
        <div className="mb-14">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Asumsi Valuasi</h2>
              <p className="text-[13px] text-gray-500 mt-1.5 font-medium">
                PV = Nilai / (1 + r)&#x207F; - Semua manfaat dan biaya didiskontokan ke tahun dasar.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1.5 bg-[#fef9c3] text-[#a16207] rounded-full text-[11px] font-bold tracking-wide shadow-sm">
                Memakai nilai bawaan
              </span>
              <button
                onClick={() => setShowAsumsiModal(!showAsumsiModal)}
                className="px-5 py-2 border border-[#1a56db]/30 text-[#1a56db] rounded-xl text-sm font-semibold bg-white hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
              >
                Ubah Asumsi
              </button>
            </div>
          </div>

          {/* Asumsi Edit Modal */}
          {showAsumsiModal && (
            <div className="bg-white rounded-xl border border-blue-200 shadow-lg p-6 mb-8">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Edit Asumsi Valuasi</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries({
                  tahunDasar: 'Tahun Dasar',
                  discountRate: 'Discount Rate',
                  periodeAnalisis: 'Periode Analisis',
                  mataUang: 'Mata Uang',
                  dasarNilaiEOP: 'Dasar Nilai EOP',
                  rentangTahun: 'Rentang Tahun',
                }).map(([key, label]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
                    <input
                      type="text"
                      value={asumsi[key]}
                      onChange={(e) => setAsumsi(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowAsumsiModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => { setShowAsumsiModal(false); alert('Asumsi berhasil disimpan!') }}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1a56db] rounded-lg hover:bg-[#1545b8] transition-colors cursor-pointer"
                >
                  Simpan Asumsi
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-left">
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium tracking-wide">Tahun Dasar</p>
              <p className="font-bold text-gray-900 text-sm">{asumsi.tahunDasar}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium tracking-wide">Discount Rate</p>
              <p className="font-bold text-gray-900 text-sm">{asumsi.discountRate}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium tracking-wide">Periode Analisis</p>
              <p className="font-bold text-gray-900 text-sm">{asumsi.periodeAnalisis}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium tracking-wide">Mata Uang</p>
              <p className="font-bold text-gray-900 text-sm">{asumsi.mataUang}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium tracking-wide">Dasar Nilai EOP</p>
              <p className="font-bold text-gray-900 text-sm">{asumsi.dasarNilaiEOP}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium tracking-wide">Rentang Tahun</p>
              <p className="font-bold text-gray-900 text-sm">{asumsi.rentangTahun}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200/60 mb-10"></div>

        {/* Status Modul Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Status Modul</h2>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/valuasi/projects/${projectId}/modules`)}
                className="text-sm font-semibold text-gray-500 cursor-pointer hover:text-gray-900 transition-colors flex items-center gap-1.5"
              >
                Kelola Modul 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-5 pb-6 snap-x hide-scrollbar">
            {moduleCategories.flatMap(cat => cat.modules).map((mod) => {
              let catContext = moduleCategories.find(c => c.modules.some(m => m.id === mod.id))
              let color = catContext?.color || 'yellow'
              
              const borderColors = {
                green: 'border-t-[#10b981]',
                blue: 'border-t-[#3b82f6]',
                yellow: 'border-t-[#eab308]',
              }
              const textColors = {
                green: 'text-[#10b981]',
                blue: 'text-[#3b82f6]',
                yellow: 'text-[#eab308]',
              }
              const btnColors = {
                green: 'border-green-300 text-green-700 hover:bg-green-50',
                blue: 'border-blue-300 text-blue-700 hover:bg-blue-50',
                yellow: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50',
              }
              
              return (
                <div
                  key={mod.id}
                  className={`min-w-[260px] bg-white rounded-xl border border-gray-200 border-t-4 ${borderColors[color]} shadow-sm hover:shadow-md flex flex-col p-5 snap-start transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <ModuleIcon type={mod.icon} color={color} />
                      <div>
                        <h3 className="text-[13px] font-extrabold text-gray-900 leading-tight mb-0.5">{mod.name}</h3>
                        <p className="text-[11px] text-gray-400 font-medium">{mod.records} records</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#fef9c3] text-[#a16207] text-[10px] font-bold rounded-full">
                      Draft
                    </span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-[11px] text-gray-400 font-medium mb-1">Cakupan jasa ekosistem:</p>
                    <p className={`text-xs font-bold ${textColors[color]} mb-3`}>{catContext?.category}</p>
                    <button
                      onClick={() => navigate(`/valuasi/projects/${projectId}/modules/${mod.id}`)}
                      className={`w-full py-2 border rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer hover:shadow-sm active:scale-[0.97] ${btnColors[color]}`}
                    >
                      Buka Modul &rarr;
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-gray-200/60 my-10"></div>

        {/* Daftar Wilayah Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Daftar Wilayah</h2>
            <button
              onClick={() => { setSelectedModules({}); setShowModulModal(true) }}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#1a56db] hover:bg-[#1545b8] flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Wilayah
            </button>
          </div>
          <div className="space-y-3">
            {wilayahList.map((w) => (
              <div key={w.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    {w.id}
                  </div>
                  <span className="font-semibold text-gray-700">{w.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing && (
                    <button
                      onClick={() => setWilayahList(prev => prev.filter(item => item.id !== w.id))}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 active:scale-[0.97] transition-all duration-200 cursor-pointer border border-red-200"
                    >
                      Hapus
                    </button>
                  )}
                  <button 
                    onClick={() => navigate(`/valuasi/projects/${projectId}/index/${indexId}/preview`)}
                    className="px-4 py-1.5 bg-white border border-[#1a56db] text-[#1a56db] text-xs font-semibold rounded-lg hover:bg-blue-50 active:scale-[0.97] transition-all duration-200 cursor-pointer"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => navigate(`/valuasi/projects/${projectId}/index/${indexId}/form`)}
                    className="px-4 py-1.5 bg-[#1a56db] text-white text-xs font-semibold rounded-lg hover:bg-[#1545b8] active:scale-[0.97] transition-all duration-200 cursor-pointer"
                  >
                    Buka
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ═══════════ Pilih Modul Modal (Tambah Wilayah) ═══════════ */}
      {showModulModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModulModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-[95vw] max-w-[1200px] max-h-[85vh] overflow-y-auto mx-4">
            <div className="p-6 md:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Pilih Modul</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium">
                    {selectedCount}/4 modul dipilih
                  </span>
                  <button
                    onClick={() => setShowModulModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-8">Pilih 1 modul dari setiap kategori (Provisioning, Regulating, Supporting, Cultural), lalu klik Selanjutnya.</p>

              {/* Module Cards Grid - grouped by category */}
              <div className="space-y-8">
                {moduleCategories.map((cat) => {
                  // Map internal category names for supporting
                  const catLabel = cat.category === 'Provisioning' ? 'Provisioning'
                    : cat.category === 'Regulating' ? 'Regulating'
                    : cat.category === 'Cultural' ? 'Cultural'
                    : cat.category

                  return (
                    <div key={cat.category}>
                      <h3 className={`text-sm font-bold mb-3 ${cat.textColor} uppercase tracking-wider`}>{cat.category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {cat.modules.map((mod) => {
                          const isSelected = selectedModules[cat.category] === mod.id
                          return (
                            <div
                              key={mod.id}
                              onClick={() => toggleModule(cat.category, mod.id)}
                              className={`rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-200'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
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
                                  {/* Checkbox indicator */}
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                                  }`}>
                                    {isSelected && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Card Footer */}
                              <div className="px-4 pb-4 mt-auto">
                                <p className="text-xs text-gray-400 mb-0.5">Cakupan jasa ekosistem:</p>
                                <p className={`text-xs font-bold ${cat.textColor}`}>{cat.category}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer with Selanjutnya button */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  {allCategoriesSelected ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Semua kategori sudah dipilih!
                    </span>
                  ) : (
                    <span>Pilih 1 modul dari setiap kategori untuk melanjutkan</span>
                  )}
                </p>
                <button
                  onClick={handleSelanjutnya}
                  disabled={!allCategoriesSelected}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    allCategoriesSelected
                      ? 'text-white bg-[#1a56db] hover:bg-[#1545b8] shadow-md hover:shadow-lg'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  Selanjutnya
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
