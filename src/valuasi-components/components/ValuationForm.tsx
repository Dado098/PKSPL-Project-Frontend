import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Info,
  Calculator,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  BIOTA,
  CATEGORIES,
  formatIDR,
  formatNum,
  rowValue,
  type Biota,
  type CategoryKey,
  type DataStatus,
  type MethodMeta,
  type ModuleKey,
  type ValuationRow,
} from "../data";
import { CategoryBadge } from "./ui";

interface FormState {
  id: string;
  category: CategoryKey;
  biota: Biota;
  item: string;
  location: string;
  quantity: string;
  unit: string;
  price: string;
  cost: string;
  period: string;
  source: string;
  status: DataStatus;
  note: string;
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-[13px] font-semibold text-foreground">
          {label}
        </span>
        {required && <span className="text-[#dc2626]">*</span>}
        {hint && (
          <span className="text-[11px] font-normal text-muted-foreground">
            · {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#dc2626]">
          <AlertCircle className="size-3" /> {error}
        </div>
      )}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/25";

export function ValuationForm({
  method,
  module,
  nextId,
  initial,
  onCancel,
  onSave,
}: {
  method: MethodMeta;
  module: ModuleKey;
  nextId: string;
  initial?: ValuationRow | null;
  onCancel: () => void;
  onSave: (row: ValuationRow) => void;
}) {
  const isEdit = !!initial;
  const [f, setF] = useState<FormState>(
    initial
      ? {
          id: initial.id,
          category: initial.category,
          biota: initial.biota ?? "fauna",
          item: initial.item,
          location: initial.location,
          quantity: String(initial.quantity),
          unit: initial.unit,
          price: String(initial.price),
          cost: String(initial.cost),
          period: initial.period,
          source: initial.source,
          status: initial.status,
          note: initial.note ?? "",
        }
      : {
          id: nextId,
          category: method.category,
          biota: "fauna",
          item: "",
          location: "",
          quantity: "",
          unit: "",
          price: "",
          cost: "",
          period: String(new Date().getFullYear() - 1),
          source: "",
          status: "draft",
          note: "",
        }
  );
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setF((s) => ({ ...s, [k]: v }));

  const q = parseFloat(f.quantity) || 0;
  const p = parseFloat(f.price) || 0;
  const c = parseFloat(f.cost) || 0;
  const netUnit = p - c;
  const total = rowValue(q, p, c);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!f.item.trim()) e.item = "Wajib diisi";
    if (!f.location.trim()) e.location = "Wajib diisi";
    if (!f.quantity || q <= 0) e.quantity = "Masukkan angka > 0";
    if (!f.unit.trim()) e.unit = "Wajib diisi";
    if (!f.price || p <= 0) e.price = "Masukkan angka > 0";
    if (c < 0) e.cost = "Tidak boleh negatif";
    if (netUnit < 0) e.cost = "Biaya melebihi harga pasar";
    if (!f.source.trim()) e.source = "Wajib diisi";
    return e;
  }, [f, q, p, c, netUnit]);

  const valid = Object.keys(errors).length === 0;

  const handleSave = () => {
    setTouched(true);
    if (!valid) return;
    onSave({
      id: f.id,
      category: f.category,
      biota: f.category === "provisioning" ? f.biota : undefined,
      method: `${method.name}${method.subtitle ? " / " + method.subtitle : ""}`,
      item: f.item.trim(),
      location: f.location.trim(),
      quantity: q,
      unit: f.unit.trim(),
      price: p,
      cost: c,
      period: f.period.trim(),
      source: f.source.trim(),
      status: f.status,
      note: f.note.trim() || undefined,
      value: total,
    });
  };

  const err = (k: keyof FormState) => (touched ? errors[k] : undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-6">
      <div
        className="animate-overlay fixed inset-0 bg-[#0f1b2d]/45 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div
        className="animate-modal relative z-10 my-auto flex max-h-[94vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgba(15,27,45,0.35)] ring-1 ring-border"
        role="dialog"
        aria-modal="true"
      >
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-white px-6 py-3.5">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Kembali
          </button>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {isEdit ? (
              <>
                <span className="text-primary">Edit Data</span>
                <span>· {f.id}</span>
              </>
            ) : (
              <>
                <span className="text-primary">Langkah 2 dari 2</span>
                <span>· Input Data Valuasi</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
            >
              <Check className="size-4" /> {isEdit ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </header>

        <div className="overflow-y-auto px-6 py-7 lg:px-8">
          <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {method.name}
            </h1>
            <CategoryBadge category={method.category} />
            <span className="rounded-md bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {module === "direct" ? "Direct Use Value" : "Indirect Use Value"}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {method.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* LEFT — form */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:p-7">
            <div className="mb-5 flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-foreground">
                Formulir Input Data
              </h2>
              <div className="ml-1 h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">
                <span className="text-[#dc2626]">*</span> wajib diisi
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ID Data" hint="dibuat otomatis">
                <input
                  value={f.id}
                  readOnly
                  className={`${inputCls} border-border bg-muted font-mono text-muted-foreground`}
                />
              </Field>
              <Field label="Kategori Jasa" required>
                <select
                  value={f.category}
                  onChange={(e) => set("category", e.target.value as CategoryKey)}
                  className={`${inputCls} border-border`}
                >
                  {Object.values(CATEGORIES).map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label} — {c.labelId}
                    </option>
                  ))}
                </select>
              </Field>

              {f.category === "provisioning" && (
                <div className="sm:col-span-2">
                  <Field label="Klasifikasi Biota" required hint="khusus Provisioning">
                    <div className="grid grid-cols-2 gap-2">
                      {(["flora", "fauna"] as Biota[]).map((b) => {
                        const active = f.biota === b;
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => set("biota", b)}
                            className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-left transition ${
                              active
                                ? "border-primary bg-primary-50"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            <span
                              className="size-2.5 rounded-full"
                              style={{ backgroundColor: BIOTA[b].color }}
                            />
                            <span
                              className={`text-sm font-semibold ${
                                active ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {BIOTA[b].label}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {b === "flora" ? "tumbuhan" : "hewan"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              )}

              <div className="sm:col-span-2">
                <Field label="Jenis Barang/Jasa" required error={err("item")}>
                  <input
                    value={f.item}
                    onChange={(e) => set("item", e.target.value)}
                    placeholder="cth. Hasil perikanan tangkap"
                    className={`${inputCls} ${
                      err("item") ? "border-[#dc2626]" : "border-border"
                    }`}
                  />
                </Field>
              </div>

              <Field label="Lokasi/Ekosistem" required error={err("location")}>
                <input
                  value={f.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="cth. Zona Mangrove Utara"
                  className={`${inputCls} ${
                    err("location") ? "border-[#dc2626]" : "border-border"
                  }`}
                />
              </Field>
              <Field label="Periode / Tahun" required>
                <input
                  value={f.period}
                  onChange={(e) => set("period", e.target.value)}
                  placeholder="cth. 2024"
                  className={`${inputCls} border-border`}
                />
              </Field>

              <Field
                label="Kuantitas per Periode"
                required
                error={err("quantity")}
              >
                <input
                  type="number"
                  value={f.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                  placeholder="0"
                  className={`${inputCls} font-mono ${
                    err("quantity") ? "border-[#dc2626]" : "border-border"
                  }`}
                />
              </Field>
              <Field label="Satuan" required error={err("unit")}>
                <input
                  value={f.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  placeholder="cth. kg/tahun"
                  className={`${inputCls} ${
                    err("unit") ? "border-[#dc2626]" : "border-border"
                  }`}
                />
              </Field>

              <Field
                label="Harga Pasar per Unit"
                required
                hint="Rp"
                error={err("price")}
              >
                <input
                  type="number"
                  value={f.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0"
                  className={`${inputCls} font-mono ${
                    err("price") ? "border-[#dc2626]" : "border-border"
                  }`}
                />
              </Field>
              <Field
                label="Biaya Produksi/Pengambilan"
                hint="Rp / unit"
                error={err("cost")}
              >
                <input
                  type="number"
                  value={f.cost}
                  onChange={(e) => set("cost", e.target.value)}
                  placeholder="0"
                  className={`${inputCls} font-mono ${
                    err("cost") ? "border-[#dc2626]" : "border-border"
                  }`}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Sumber Data" required error={err("source")}>
                  <input
                    value={f.source}
                    onChange={(e) => set("source", e.target.value)}
                    placeholder="cth. Dinas Kelautan & Perikanan"
                    className={`${inputCls} ${
                      err("source") ? "border-[#dc2626]" : "border-border"
                    }`}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Catatan" hint="opsional">
                  <textarea
                    value={f.note}
                    onChange={(e) => set("note", e.target.value)}
                    rows={3}
                    placeholder="Asumsi, metodologi, atau keterangan tambahan…"
                    className={`${inputCls} resize-none border-border`}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* RIGHT — calculation panel */}
          <div className="lg:sticky lg:top-2 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-primary-50 to-card shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-primary/15 bg-primary/5 px-6 py-4">
                <div className="grid size-9 place-items-center rounded-lg bg-primary text-white">
                  <Calculator className="size-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">
                    Panel Perhitungan
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Diperbarui otomatis dari input
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {/* Formula */}
                <section>
                  <SectionLabel>Rumus Valuasi</SectionLabel>
                  <div className="rounded-xl border border-border bg-white px-4 py-3.5 text-center">
                    <div className="font-mono text-[15px] font-semibold text-foreground">
                      NEV = Q × (P − C)
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Net Economic Value = Kuantitas × Nilai bersih per unit
                    </div>
                  </div>
                </section>

                {/* Variables */}
                <section>
                  <SectionLabel>Variabel</SectionLabel>
                  <div className="space-y-1.5">
                    <VarRow sym="Q" name="Kuantitas" value={`${formatNum(q)} ${f.unit || "unit"}`} />
                    <VarRow sym="P" name="Harga pasar / unit" value={formatIDR(p)} />
                    <VarRow sym="C" name="Biaya / unit" value={formatIDR(c)} />
                  </div>
                </section>

                {/* Steps */}
                <section>
                  <SectionLabel>Langkah Perhitungan</SectionLabel>
                  <ol className="space-y-2">
                    <StepRow
                      n={1}
                      label="Nilai bersih per unit (P − C)"
                      expr={`${formatIDR(p)} − ${formatIDR(c)}`}
                      result={formatIDR(netUnit)}
                    />
                    <StepRow
                      n={2}
                      label="Total nilai (Q × net)"
                      expr={`${formatNum(q)} × ${formatIDR(netUnit)}`}
                      result={formatIDR(total)}
                    />
                  </ol>
                </section>

                {/* Component values */}
                <section>
                  <SectionLabel>Nilai Komponen</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <MiniStat label="Pendapatan kotor" value={formatIDR(q * p, true)} />
                    <MiniStat label="Total biaya" value={formatIDR(q * c, true)} />
                  </div>
                </section>

                {/* Output */}
                <section className="rounded-xl bg-[#0f2547] p-5 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-white/60">
                    <Sparkles className="size-3.5" /> Nilai Ekonomi Terhitung
                  </div>
                  <div className="mt-2 font-display text-2xl font-extrabold leading-tight">
                    {formatIDR(total)}
                  </div>
                  <div className="mt-0.5 font-mono text-[12px] text-white/70">
                    {formatIDR(total, true)} · per {f.period || "periode"}
                  </div>
                </section>

                <div className="flex items-start gap-2 rounded-lg bg-muted px-3.5 py-3 text-[11px] leading-relaxed text-muted-foreground">
                  <Info className="mt-px size-3.5 shrink-0 text-primary" />
                  Nilai ini akan ditambahkan ke subtotal{" "}
                  <span className="font-semibold text-foreground">
                    {CATEGORIES[f.category].label}
                  </span>{" "}
                  dan memperbarui Total Nilai Ekonomi proyek saat disimpan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}

function VarRow({ sym, name, value }: { sym: string; name: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 ring-1 ring-border">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary-100 font-mono text-[12px] font-bold text-primary">
        {sym}
      </span>
      <span className="flex-1 text-[12px] text-muted-foreground">{name}</span>
      <span className="font-mono text-[12px] font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function StepRow({
  n,
  label,
  expr,
  result,
}: {
  n: number;
  label: string;
  expr: string;
  result: string;
}) {
  return (
    <li className="rounded-lg border border-border bg-white px-3.5 py-2.5">
      <div className="flex items-center gap-2">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-eco-50 font-mono text-[11px] font-bold text-eco">
          {n}
        </span>
        <span className="text-[12px] font-medium text-foreground">{label}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 pl-7">
        <span className="font-mono text-[11px] text-muted-foreground">{expr}</span>
        <span className="font-mono text-[12px] font-bold text-foreground">
          = {result}
        </span>
      </div>
    </li>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2.5 ring-1 ring-border">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-[13px] font-bold text-foreground">
        {value}
      </div>
    </div>
  );
}
