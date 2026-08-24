import { useState, useRef, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Plus, Trash2, Save, Search, Sparkles, PenLine } from 'lucide-react'

// ─── Area Reklamasi Suggestions ─────────────────────────────────────────────

const areaSuggestions = [
  'Cemara Laut', 'Sengon Laut', 'Jabon Merah', 'Angsana', 'Beringin halus',
  'Kersen', 'Mahoni daun lebar', 'Macaranga', 'Nani daun besar', 'Kayu putih',
  'Gofassa', 'Akasia daun kecil', 'Bintangur', 'Johar', 'Ketapang', 'Kaliandra',
  'Cemara Udang', 'Bakau', 'Api-api', 'Rhizophora', 'Sonneratia', 'Avicennia',
  'Bruguiera', 'Nypa fruticans', 'Ceriops tagal', 'Lumnitzera', 'Xylocarpus',
  'Penyerapan Karbon', 'Perlindungan Pantai', 'Pengolahan Limbah',
  'Habitat Ikan', 'Nursery Ground', 'Siklus Nutrisi', 'Pengendalian Erosi',
  'Penyimpanan Air', 'Produksi Oksigen', 'Penahan Gelombang',
]

// ─── Sample Data ────────────────────────────────────────────────────────────

const createProvisioningRows = () => [
  { id: 1, area: 'Cemara Laut', produktivitas: 33.18, satuan: 'm\u00B3/ha', harga: 3231311, jumlah: 107214099, luas: 79.86, total: 8562101033 },
  { id: 2, area: 'Sengon Laut', produktivitas: 23.93, satuan: 'm\u00B3/ha', harga: 1090107, jumlah: 26086261, luas: 79.86, total: 2083248764 },
  { id: 3, area: 'Jabon Merah', produktivitas: null, satuan: 'm\u00B3/ha', harga: 2098361, jumlah: null, luas: 79.86, total: null },
  { id: 4, area: 'Angsana', produktivitas: null, satuan: 'm\u00B3/ha', harga: 3244645, jumlah: null, luas: 79.86, total: null },
  { id: 5, area: 'Beringin halus', produktivitas: null, satuan: 'm\u00B3/ha', harga: 1090107, jumlah: null, luas: 79.86, total: null },
  { id: 6, area: 'Kersen', produktivitas: null, satuan: 'm\u00B3/ha', harga: 1090107, jumlah: null, luas: 79.86, total: null },
  { id: 7, area: 'Gofassa', produktivitas: 9.29, satuan: 'm\u00B3/ha', harga: 4218039, jumlah: 39185582, luas: 79.86, total: 3129360603 },
  { id: 8, area: 'Akasia daun kecil', produktivitas: 68.68, satuan: 'm\u00B3/ha', harga: 899428, jumlah: 61768218, luas: 79.86, total: 4932809881 },
  { id: 9, area: 'Johar', produktivitas: 2.05, satuan: 'm\u00B3/ha', harga: 4200705, jumlah: 8597443, luas: 79.86, total: 686591790 },
  { id: 10, area: 'Kaliandra', produktivitas: 3.14, satuan: 'm\u00B3/ha', harga: 2098361, jumlah: 6588854, luas: 79.86, total: 526185844 },
]

const createRegulatingRows = () => [
  { id: 1, area: 'Penyerapan Karbon', produktivitas: 12.5, satuan: 'ton/ha', harga: 950000, jumlah: 11875000, luas: 79.86, total: 948336750 },
  { id: 2, area: 'Perlindungan Pantai', produktivitas: null, satuan: 'ha', harga: 5200000, jumlah: null, luas: 79.86, total: 415272000 },
  { id: 3, area: 'Pengolahan Limbah', produktivitas: 8.3, satuan: 'ton/ha', harga: 1500000, jumlah: 12450000, luas: 79.86, total: 994257000 },
]

const createSupportingRows = () => [
  { id: 1, area: 'Habitat Ikan', produktivitas: 45.2, satuan: 'kg/ha', harga: 85000, jumlah: 3842000, luas: 79.86, total: 326612520 },
  { id: 2, area: 'Nursery Ground', produktivitas: null, satuan: 'ha', harga: 3200000, jumlah: null, luas: 79.86, total: 255552000 },
  { id: 3, area: 'Siklus Nutrisi', produktivitas: 5.6, satuan: 'ton/ha', harga: 2100000, jumlah: 11760000, luas: 79.86, total: 939349600 },
]

// ─── Number Formatter ───────────────────────────────────────────────────────

const formatNumber = (num) => {
  if (num === null || num === undefined) return '-'
  return num.toLocaleString('id-ID')
}

// ─── Autocomplete Input for Area Reklamasi ──────────────────────────────────

function AutocompleteInput({ value, onChange }) {
  const [query, setQuery] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const wrapperRef = useRef(null)

  const filtered = query.length > 0
    ? areaSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : areaSuggestions

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setQuery(value || '') }, [value])

  const selectItem = (item) => {
    setQuery(item)
    onChange(item)
    setIsOpen(false)
    setHighlightIdx(-1)
  }

  const handleKeyDown = (e) => {
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault()
      selectItem(filtered[highlightIdx])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            onChange(e.target.value)
            setIsOpen(true)
            setHighlightIdx(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cari area..."
          className="w-full text-sm text-gray-800 bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded px-2 py-1 transition-all"
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-fade-in">
          {filtered.map((item, i) => (
            <button
              key={item}
              onClick={() => selectItem(item)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                i === highlightIdx
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Harga per Unit Input (2 options: Isi Sendiri / Generate AI) ────────────

function HargaInput({ value, onChange }) {
  const [mode, setMode] = useState(value ? 'manual' : null)
  const [showMenu, setShowMenu] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Manual mode — editable input
  if (mode === 'manual' || (value && mode !== 'ai')) {
    return (
      <div ref={wrapperRef} className="relative">
        <input
          type="text"
          value={value != null ? formatNumber(value) : ''}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9]/g, '')
            onChange(v === '' ? null : parseInt(v))
          }}
          className="w-full text-sm text-gray-700 text-right bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded px-2 py-1 transition-all font-mono"
          placeholder="Masukkan harga..."
        />
        <button
          onClick={() => { setMode(null); setShowMenu(true) }}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-blue-500 transition-colors"
          title="Ganti mode"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
        {showMenu && (
          <div className="absolute z-50 top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-52 overflow-hidden animate-fade-in">
            <button
              onClick={() => { setMode('manual'); setShowMenu(false) }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
            >
              <PenLine className="w-4 h-4 text-blue-500" />
              <span>Isi Sendiri</span>
            </button>
            <button
              onClick={() => { setMode('ai'); setShowMenu(false) }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors flex items-center gap-2.5 border-t border-gray-100"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Generate AI</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  // AI mode — placeholder
  if (mode === 'ai') {
    return (
      <div ref={wrapperRef} className="relative">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-purple-50 border border-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
          <span className="text-xs text-purple-600 font-medium">AI Searching...</span>
        </div>
        <button
          onClick={() => { setMode(null); setShowMenu(false) }}
          className="absolute -right-1 -top-1 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors text-[10px]"
          title="Batal"
        >
          &times;
        </button>
      </div>
    )
  }

  // Default: show 2 option buttons
  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setMode('manual')}
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all"
          title="Input manual"
        >
          <PenLine className="w-3 h-3" />
          Isi Sendiri
        </button>
        <button
          onClick={() => setMode('ai')}
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all"
          title="Generate dengan AI"
        >
          <Sparkles className="w-3 h-3" />
          AI
        </button>
      </div>
    </div>
  )
}

// ─── Editable Table Row ─────────────────────────────────────────────────────

function TableRow({ row, index, prefix, onUpdate, onDelete }) {
  const handleChange = (field, value) => {
    const numericFields = ['produktivitas', 'harga', 'jumlah', 'luas', 'total']
    const newValue = numericFields.includes(field)
      ? (value === '' ? null : parseFloat(String(value).replace(/,/g, '')) || null)
      : value
    onUpdate(row.id, field, newValue)
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group">
      <td className="px-3 py-3 text-center text-sm text-gray-500 font-medium">
        {prefix}.{index + 1}
      </td>
      <td className="px-3 py-3 min-w-[180px]">
        <AutocompleteInput
          value={row.area}
          onChange={(val) => handleChange('area', val)}
        />
      </td>
      <td className="px-3 py-3">
        <input
          type="text"
          value={row.produktivitas ?? ''}
          onChange={(e) => handleChange('produktivitas', e.target.value)}
          className="w-full text-sm text-gray-700 text-center bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded px-2 py-1 transition-all"
          placeholder="-"
        />
      </td>
      <td className="px-3 py-3">
        <input
          type="text"
          value={row.satuan}
          onChange={(e) => handleChange('satuan', e.target.value)}
          className="w-full text-sm text-gray-600 text-center bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded px-2 py-1 transition-all"
        />
      </td>
      <td className="px-3 py-3 min-w-[170px]">
        <HargaInput
          value={row.harga}
          onChange={(val) => onUpdate(row.id, 'harga', val)}
        />
      </td>
      <td className="px-3 py-3 text-sm text-gray-700 text-right font-mono">
        {formatNumber(row.jumlah)}
      </td>
      <td className="px-3 py-3 text-sm text-gray-700 text-center">
        {row.luas}
      </td>
      <td className="px-3 py-3 text-sm text-right font-mono font-semibold text-gray-900">
        {formatNumber(row.total)}
      </td>
      <td className="px-2 py-3 text-center">
        <button
          onClick={() => onDelete(row.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
          title="Hapus baris"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  )
}

// ─── Collapsible Service Section ────────────────────────────────────────────

function ServiceSection({ label, prefix, rows, setRows, color, isOpen, onToggle }) {
  const sectionTotal = rows.reduce((sum, r) => sum + (r.total || 0), 0)

  const handleUpdate = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const handleDelete = (id) => {
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const [showAddMenu, setShowAddMenu] = useState(false)
  const addMenuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setShowAddMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleAddRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1
    setRows(prev => [...prev, {
      id: newId,
      area: '',
      produktivitas: null,
      satuan: 'm\u00B3/ha',
      harga: null,
      jumlah: null,
      luas: 79.86,
      total: null,
    }])
    setShowAddMenu(false)
  }

  const [extraColumns, setExtraColumns] = useState([])

  const handleAddColumn = () => {
    const colName = `Kolom ${extraColumns.length + 1}`
    setExtraColumns(prev => [...prev, colName])
    setShowAddMenu(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-base">{label}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {rows.length} item &bull; Total: <span className="font-semibold text-blue-600">Rp {formatNumber(sectionTotal)}</span>
            </p>
          </div>
        </div>
        <div className={`p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-blue-50 text-blue-600 rotate-0' : 'bg-gray-100 text-gray-400'}`}>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Section Content */}
      <div className={`transition-all duration-400 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-5">
          {/* Sub-label */}
          <div className="flex items-center gap-2 mb-3 pl-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{prefix}.1 Flora</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-3 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-16">No</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Area Reklamasi</th>
                  <th className="px-3 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Produktivitas per Ha</th>
                  <th className="px-3 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Satuan</th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Harga per Unit</th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-3 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Luas (Ha)</th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Nilai Ekonomi</th>
                  <th className="px-2 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    index={i}
                    prefix={`${prefix}.1`}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50/60 border-t-2 border-blue-200">
                  <td colSpan={7} className="px-4 py-3 text-sm font-bold text-gray-800">
                    Total {label}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-blue-700 font-mono">
                    {formatNumber(sectionTotal)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>


        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ValuasiPreviewPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const isNew = projectId === 'new'
  const projectCode = isNew ? 'IDX-NEW' : `IDX-${String(projectId).padStart(3, '0')}`
  const projectName = isNew ? 'Proyek Baru' : 'Mangrove Barat'

  const [provisioningRows, setProvisioningRows] = useState(createProvisioningRows)
  const [regulatingRows, setRegulatingRows] = useState(createRegulatingRows)
  const [supportingRows, setSupportingRows] = useState(createSupportingRows)

  const [openSections, setOpenSections] = useState({
    provisioning: false,
    regulating: false,
    supporting: false,
  })

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const grandTotal =
    provisioningRows.reduce((s, r) => s + (r.total || 0), 0) +
    regulatingRows.reduce((s, r) => s + (r.total || 0), 0) +
    supportingRows.reduce((s, r) => s + (r.total || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex flex-col animate-fade-in-up">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <Link
          to="/valuasi/projects"
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>

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
      <div className="flex-1 px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full">

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight">
            {projectCode}  -  {projectName}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">Status :</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Draft
            </span>
          </div>
        </div>

        {/* Service Sections (Accordion) */}
        <div className="space-y-5">
          <ServiceSection
            label="A. Provisioning Services"
            prefix="A"
            rows={provisioningRows}
            setRows={setProvisioningRows}
            color="#2563eb"
            isOpen={openSections.provisioning}
            onToggle={() => toggleSection('provisioning')}
          />

          <ServiceSection
            label="B. Regulating Services"
            prefix="B"
            rows={regulatingRows}
            setRows={setRegulatingRows}
            color="#16a34a"
            isOpen={openSections.regulating}
            onToggle={() => toggleSection('regulating')}
          />

          <ServiceSection
            label="C. Supporting Services"
            prefix="C"
            rows={supportingRows}
            setRows={setSupportingRows}
            color="#9333ea"
            isOpen={openSections.supporting}
            onToggle={() => toggleSection('supporting')}
          />
        </div>



        {/* Action Buttons */}
        <div className="mt-8 mb-12 flex items-center justify-end gap-4">
          <button
            onClick={() => navigate('/valuasi/projects')}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-200 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200"
          >
            Hapus
          </button>
          <button
            onClick={() => navigate('/valuasi/projects')}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Simpan
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
