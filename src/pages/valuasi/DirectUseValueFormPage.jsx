import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProfileDropdown from '../../components/ProfileDropdown'

// Static project data (would come from API/context later)
const projectsData = {
  1: 'Pulau Tidung',
  2: 'Pulau Seribu',
  3: 'Cirebon',
  4: 'Ujung Kulon',
  5: 'Dark Forest',
  6: 'Lombok Utara',
  7: 'Malaysia',
  8: 'Sulawesi Selatan',
  9: 'Pulau Komodo',
}

function DirectUseValueFormPage() {
  const { projectId } = useParams()
  const projectName = projectsData[projectId] || 'Proyek'

  // Form state
  const [idData, setIdData] = useState('')
  const [kategoriJasa, setKategoriJasa] = useState('Provisioning')
  const [jenisBarang, setJenisBarang] = useState('')
  const [lokasiEkosistem, setLokasiEkosistem] = useState('')
  const [kuantitas, setKuantitas] = useState('')
  const [satuan, setSatuan] = useState('')
  const [hargaPerUnit, setHargaPerUnit] = useState('')
  const [biayaProduksi, setBiayaProduksi] = useState('')
  const [periode, setPeriode] = useState('')
  const [sumberData, setSumberData] = useState('')
  const [statusData, setStatusData] = useState('Draft')
  const [catatan, setCatatan] = useState('')

  // Computed preview
  const qi = parseFloat(kuantitas.replace(/\./g, '').replace(',', '.')) || 0
  const pi = parseFloat(hargaPerUnit.replace(/\./g, '').replace(',', '.')) || 0
  const ci = parseFloat(biayaProduksi.replace(/\./g, '').replace(',', '.')) || 0
  const grossDuv = qi * pi
  const netDuv = grossDuv - ci

  const formatRp = (val) => {
    if (val === 0) return 'Rp0'
    return 'Rp' + val.toLocaleString('id-ID')
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <Link
          to={`/valuasi/projects/${projectId}/modules/direct-use-value`}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Kembali ke Index
        </Link>

        <ProfileDropdown isScrolled={true} />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: Form */}
          <div className="flex-1">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
              Form Input Direct Use Value — <span className="text-gray-600">{projectName}</span>
            </h1>

            <div className="space-y-5">
              {/* Row 1: ID Data + Kategori Jasa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    ID Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: DUV-0015"
                    value={idData}
                    onChange={(e) => setIdData(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Kategori Jasa <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={kategoriJasa}
                      onChange={(e) => setKategoriJasa(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 appearance-none bg-white cursor-pointer"
                    >
                      <option value="Provisioning">Provisioning</option>
                      <option value="Regulating">Regulating</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Supporting">Supporting</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>
              </div>

              {/* Row 2: Jenis Barang + Lokasi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Jenis Barang / Jasa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ikan tangkap, kayu bakar, air bersih"
                    value={jenisBarang}
                    onChange={(e) => setJenisBarang(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Lokasi / Ekosistem <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tambak, Mangrove, Sungai"
                    value={lokasiEkosistem}
                    onChange={(e) => setLokasiEkosistem(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
                  />
                </div>
              </div>

              {/* Row 3: Kuantitas + Satuan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Kuantitas per Periode (Qi) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Contoh: 1.250"
                      value={kuantitas}
                      onChange={(e) => setKuantitas(e.target.value)}
                      className="w-full px-4 py-2.5 pr-24 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">unit/periode</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Satuan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: kg, ton, m³, ekor"
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
                  />
                </div>
              </div>

              {/* Row 4: Harga per Unit + Biaya Produksi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Harga Pasar per Unit (Pi) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Rp</span>
                    <input
                      type="text"
                      placeholder="Contoh: 25.000"
                      value={hargaPerUnit}
                      onChange={(e) => setHargaPerUnit(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Biaya Produksi / Pengambilan (Ci)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Rp</span>
                    <input
                      type="text"
                      placeholder="Contoh: 5.000.000"
                      value={biayaProduksi}
                      onChange={(e) => setBiayaProduksi(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Kosongkan bila hanya menghitung DUV gross.</p>
                </div>
              </div>

              {/* Row 5: Periode + Sumber Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Periode / Tahun <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={periode}
                      onChange={(e) => setPeriode(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 appearance-none bg-white cursor-pointer"
                    >
                      <option value="">Pilih periode / tahun</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="Per Bulan">Per Bulan</option>
                      <option value="Per Tahun">Per Tahun</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Sumber Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Survei lapangan, data produksi, literatur"
                    value={sumberData}
                    onChange={(e) => setSumberData(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20"
                  />
                </div>
              </div>

              {/* Row 6: Status Data */}
              <div className="max-w-[calc(50%-0.625rem)]">
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Status Data <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={statusData}
                    onChange={(e) => setStatusData(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 appearance-none bg-white cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Final">Final</option>
                    <option value="Disetujui">Disetujui</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
              </div>

              {/* Row 7: Catatan */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Catatan (opsional)
                </label>
                <textarea
                  placeholder="Catatan tambahan (opsional)"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#5046e5] focus:ring-2 focus:ring-[#5046e5]/20 resize-y"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-8 py-2.5 bg-[#5046e5] text-white text-sm font-semibold rounded-lg hover:bg-[#4338ca] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Simpan
                </button>
                <Link
                  to={`/valuasi/projects/${projectId}/modules/direct-use-value`}
                  className="px-8 py-2.5 border border-gray-300 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Batal
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Formula + Preview */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-5">
            {/* Formula Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5046e5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <h3 className="text-sm font-bold text-gray-900">Formula Direct Use Value</h3>
              </div>

              {/* Formula boxes */}
              <div className="space-y-3 mb-5">
                <div className="bg-[#5046e5]/10 border border-[#5046e5]/20 rounded-lg px-4 py-3 text-center">
                  <code className="text-sm font-mono font-semibold text-[#5046e5]">DUV gross = Σ(Qi × Pi)</code>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center">
                  <code className="text-sm font-mono font-semibold text-gray-700">DUV net = Σ(Qi × Pi) − Ci</code>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div className="flex gap-2">
                  <span className="font-bold text-[#5046e5] w-4">Qi</span>
                  <span>= Kuantitas barang/jasa ke-i per periode</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-[#5046e5] w-4">Pi</span>
                  <span>= Harga pasar per unit barang/jasa ke-i</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-[#5046e5] w-4">Ci</span>
                  <span>= Biaya produksi/pengambilan barang/jasa ke-i</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Nilai proyek adalah penjumlahan seluruh baris DUV yang tercatat.
              </p>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-sm font-bold text-gray-900">Pratinjau Output</h3>
              </div>

              <div className="space-y-3">
                {/* Gross DUV */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Gross DUV</p>
                      <p className="text-[11px] text-gray-400">Qi × Pi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${grossDuv > 0 ? 'text-indigo-600' : 'text-red-500'}`}>{formatRp(grossDuv)}</p>
                    <p className="text-[10px] text-gray-400">per periode</p>
                  </div>
                </div>

                {/* Total Biaya */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Total Biaya</p>
                      <p className="text-[11px] text-gray-400">Ci</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${ci > 0 ? 'text-red-500' : 'text-red-500'}`}>{formatRp(ci)}</p>
                    <p className="text-[10px] text-gray-400">per periode</p>
                  </div>
                </div>

                {/* Net DUV */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Net DUV</p>
                      <p className="text-[11px] text-gray-400">Gross − Ci</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${netDuv > 0 ? 'text-green-600' : 'text-red-500'}`}>{formatRp(netDuv)}</p>
                    <p className="text-[10px] text-gray-400">per periode</p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed italic">
                Nilai baris ini dijumlahkan menjadi total DUV proyek pada halaman daftar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectUseValueFormPage
