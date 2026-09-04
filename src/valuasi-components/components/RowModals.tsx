import { AlertTriangle, Trash2 } from "lucide-react";
import {
  BIOTA,
  CATEGORIES,
  formatIDR,
  formatNum,
  type ValuationRow,
} from "../data";
import { CategoryBadge, Modal, ModalHeader, StatusBadge } from "./ui";

export function PreviewModal({
  row,
  onClose,
}: {
  row: ValuationRow | null;
  onClose: () => void;
}) {
  return (
    <Modal open={!!row} onClose={onClose} maxWidth="max-w-2xl">
      {row && (
        <>
          <ModalHeader
            step={`Detail Data · ${row.id}`}
            title={row.item}
            subtitle={row.method}
            onClose={onClose}
          />
          <div className="space-y-5 px-7 py-6">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={row.category} />
              {row.biota && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{ backgroundColor: BIOTA[row.biota].tint, color: BIOTA[row.biota].color }}
                >
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: BIOTA[row.biota].color }} />
                  {BIOTA[row.biota].label}
                </span>
              )}
              <StatusBadge status={row.status} />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <Item label="Lokasi/Ekosistem" value={row.location} />
              <Item label="Periode/Tahun" value={row.period} />
              <Item label="Kategori" value={CATEGORIES[row.category].label} />
              <Item label="Kuantitas" value={`${formatNum(row.quantity)} ${row.unit}`} />
              <Item label="Harga Pasar/Unit" value={formatIDR(row.price)} />
              <Item label="Biaya/Unit" value={formatIDR(row.cost)} />
              <Item label="Nilai bersih/Unit" value={formatIDR(row.price - row.cost)} />
              <Item label="Sumber Data" value={row.source} className="col-span-2" />
            </div>

            {row.note && (
              <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide">
                  Catatan
                </div>
                {row.note}
              </div>
            )}

            <div className="rounded-xl bg-[#0f2547] p-5 text-white">
              <div className="text-[11px] font-medium uppercase tracking-wide text-white/60">
                Nilai Ekonomi Terhitung
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold">
                {formatIDR(row.value)}
              </div>
              <div className="font-mono text-[12px] text-white/70">
                {formatNum(row.quantity)} × ({formatIDR(row.price)} − {formatIDR(row.cost)})
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t border-border px-7 py-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              Tutup
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

export function ConfirmDeleteModal({
  row,
  onClose,
  onConfirm,
}: {
  row: ValuationRow | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={!!row} onClose={onClose} maxWidth="max-w-md">
      {row && (
        <div className="p-7">
          <div className="grid size-12 place-items-center rounded-full bg-[#fdecec] text-[#c0392b]">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="mt-4 font-display text-lg font-bold text-foreground">
            Hapus data valuasi?
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Data{" "}
            <span className="font-mono font-semibold text-foreground">{row.id}</span> —{" "}
            <span className="font-medium text-foreground">{row.item}</span> senilai{" "}
            <span className="font-semibold text-foreground">{formatIDR(row.value, true)}</span>{" "}
            akan dihapus permanen. Subtotal dan Total Nilai Ekonomi akan diperbarui.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center gap-2 rounded-lg bg-[#c0392b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a93226]"
            >
              <Trash2 className="size-4" /> Hapus
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Item({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
