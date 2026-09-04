import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Trash2, X } from 'lucide-react'

import { INITIAL_PROJECT, METHODS, formatIDR } from '../../valuasi-components/data.ts'
import { ProjectDetail } from '../../valuasi-components/components/ProjectDetail.tsx'
import { SelectMethodModal } from '../../valuasi-components/components/SelectMethodModal.tsx'
import { ValuationForm } from '../../valuasi-components/components/ValuationForm.tsx'
import { ConfirmDeleteModal, PreviewModal } from '../../valuasi-components/components/RowModals.tsx'

const CAT_PREFIX = {
  provisioning: "PRV",
  regulating: "REG",
  supporting: "SUP",
  cultural: "CUL",
}

export default function AreaDashboardPage() {
  const { projectId, indexId, areaId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState({
    ...INITIAL_PROJECT,
    name: "Hutan lahan kering primer",
    year: "2025",
    location: "Kabupaten Badung, Bali",
    ecosystem: "Ekosistem Mangrove Pesisir",
    lead: "Dr. Ir. Retno Wulandari, M.Si.",
    updated: "28 Agustus 2025"
  })
  const [screen, setScreen] = useState("detail")
  const [modal, setModal] = useState(null)
  const [module, setModule] = useState(null)
  const [method, setMethod] = useState(null)
  const [editRow, setEditRow] = useState(null)
  const [presetCategory, setPresetCategory] = useState(null)
  const [highlightId, setHighlightId] = useState(null)
  const [previewRow, setPreviewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const nextId = (cat) => {
    const prefix = CAT_PREFIX[cat] ?? "GEN"
    const n = project.rows.filter((r) => r.category === cat).length + 1
    return `${prefix}-${String(n).padStart(3, "0")}`
  }

  const handleSave = (row) => {
    const isEdit = project.rows.some((r) => r.id === row.id)
    setProject((p) => ({
      ...p,
      rows: isEdit
        ? p.rows.map((r) => (r.id === row.id ? row : r))
        : [...p.rows, row],
      updated: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }))
    setScreen("detail")
    setModule(null)
    setMethod(null)
    setEditRow(null)
    setHighlightId(row.id)
    setToast({ id: row.id, value: row.value, kind: isEdit ? "edit" : "save" })
    setTimeout(() => setHighlightId(null), 4000)
  }

  const handleEdit = (row) => {
    const m =
      METHODS.find((x) => `${x.name} / ${x.subtitle}` === row.method || x.name === row.method) ??
      METHODS.find((x) => x.category === row.category) ??
      METHODS[0]
    setMethod(m)
    setModule(m.module[0])
    setEditRow(row)
    setPreviewRow(null)
    setScreen("form")
  }

  const handleDelete = () => {
    if (!deleteRow) return
    const removed = deleteRow
    setProject((p) => ({
      ...p,
      rows: p.rows.filter((r) => r.id !== removed.id),
      updated: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }))
    setDeleteRow(null)
    setToast({ id: removed.id, value: removed.value, kind: "delete" })
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 md:px-10 py-3 flex items-center justify-between sticky top-0 z-[40]">
        <div className="flex items-center gap-8">
          <Link to="/valuasi/projects" className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">Project Page</Link>
          <Link to={`/valuasi/projects/${projectId}/modules/direct-use-value`} className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">Index</Link>
          <div className="relative pb-3 -mb-3">
            <Link to={`/valuasi/projects/${projectId}/index/${indexId}/areas`} className="text-sm text-gray-800 font-semibold">Area Reklamasi</Link>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a56db] rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Dhafa</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </div>
      </div>

      <div className="flex-1 relative z-0">
        {screen === "detail" && (
          <ProjectDetail
            project={project}
            highlightId={highlightId}
            onPreview={(row) => setPreviewRow(row)}
            onEdit={handleEdit}
            onDelete={(row) => setDeleteRow(row)}
            onAddData={(category) => {
              setModule(null)
              setMethod(null)
              setEditRow(null)
              setPresetCategory(category ?? null)
              setModal("method")
            }}
          />
        )}
        {screen === "form" && method && module && (
          <ValuationForm
            method={method}
            module={module}
            nextId={nextId(method.category)}
            initial={editRow}
            onCancel={() => {
              setScreen("detail")
              setEditRow(null)
            }}
            onSave={handleSave}
          />
        )}
      </div>

      <SelectMethodModal
        open={modal === "method"}
        module={module}
        presetCategory={presetCategory}
        onClose={() => setModal(null)}
        onBack={() => setModal(null)}
        onContinue={(m) => {
          setMethod(m)
          setModule(m.module[0])
          setModal(null)
          setScreen("form")
        }}
      />

      <PreviewModal row={previewRow} onClose={() => setPreviewRow(null)} />
      <ConfirmDeleteModal row={deleteRow} onClose={() => setDeleteRow(null)} onConfirm={handleDelete} />

      {toast && (
        <div className="fixed inset-x-0 top-5 z-[100] flex justify-center px-4">
          <div className="animate-toast flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3.5 shadow-[0_16px_40px_-12px_rgba(15,27,45,0.3)] ring-1 ring-border">
            <div className={`grid size-9 shrink-0 place-items-center rounded-lg ${toast.kind === 'delete' ? 'bg-[#fdecec] text-[#c0392b]' : 'bg-eco-50 text-eco'}`}>
              {toast.kind === "delete" ? <Trash2 className="size-5" /> : <CheckCircle2 className="size-5" />}
            </div>
            <div className="pr-2">
              <div className="font-display text-sm font-bold text-foreground">
                {toast.kind === "save" ? "Data valuasi tersimpan" : toast.kind === "edit" ? "Data valuasi diperbarui" : "Data valuasi dihapus"}
              </div>
              <div className="text-[12px] text-muted-foreground">
                <span className="font-mono font-semibold text-primary">{toast.id}</span> · {formatIDR(toast.value, true)} {toast.kind === "save" ? "ditambahkan" : toast.kind === "edit" ? "diperbarui" : "dihapus"}. Total & subtotal diperbarui.
              </div>
            </div>
            <button onClick={() => setToast(null)} className="grid size-7 place-items-center rounded-md text-muted-foreground transition hover:bg-muted" aria-label="Tutup"><X className="size-4" /></button>
          </div>
        </div>
      )}
    </div>
  )
}
