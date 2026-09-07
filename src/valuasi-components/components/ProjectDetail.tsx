import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  ChevronDown,
  MapPin,
  Calendar,
  User,
  Leaf,
  Sprout,
  CloudSun,
  Layers,
  Landmark,
  TrendingUp,
  FileClock,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  ClipboardCheck,
} from "lucide-react";
import {
  BIOTA,
  CATEGORIES,
  STATUS,
  STATUS_ORDER,
  formatIDR,
  formatNum,
  type Biota,
  type CategoryKey,
  type Project,
  type ValuationRow,
} from "../data";
import { CategoryBadge, StatusBadge } from "./ui";

const CAT_ICON: Record<CategoryKey, typeof Sprout> = {
  provisioning: Sprout,
  regulating: CloudSun,
  supporting: Layers,
  cultural: Landmark,
};

const CAT_ORDER: CategoryKey[] = [
  "provisioning",
  "regulating",
  "supporting",
  "cultural",
];
const BIOTA_ORDER: Biota[] = ["flora", "fauna"];
const STATUS_LEGEND_KEYS = STATUS_ORDER;

export function ProjectDetail({
  project,
  onAddData,
  onPreview,
  onEdit,
  onDelete,
  highlightId,
}: {
  project: Project;
  onAddData: (category?: CategoryKey) => void;
  onPreview: (row: ValuationRow) => void;
  onEdit: (row: ValuationRow) => void;
  onDelete: (row: ValuationRow) => void;
  highlightId?: string | null;
}) {
  const [open, setOpen] = useState<Record<CategoryKey, boolean>>({
    provisioning: true,
    regulating: true,
    supporting: false,
    cultural: false,
  });

  const total = project.rows.reduce((s, r) => s + r.value, 0);
  const subtotal = (cat: CategoryKey) =>
    project.rows.filter((r) => r.category === cat).reduce((s, r) => s + r.value, 0);

  const usedMethods = (() => {
    const m = new Map<
      string,
      { method: string; category: CategoryKey; count: number; total: number }
    >();
    project.rows.forEach((r) => {
      const cur = m.get(r.method);
      if (cur) {
        cur.count += 1;
        cur.total += r.value;
      } else {
        m.set(r.method, {
          method: r.method,
          category: r.category,
          count: 1,
          total: r.value,
        });
      }
    });
    return [...m.values()].sort((a, b) => b.total - a.total);
  })();

  const usedMethodCount = usedMethods.length;

  const usedByCategory = CAT_ORDER.map((cat) => ({
    cat,
    methods: usedMethods.filter((m) => m.category === cat),
  })).filter((g) => g.methods.length > 0);

  return (
    <div className="min-h-full bg-background">


      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        {/* Status */}
        <div className="mb-3">
          <StatusBadge status="accepted" />
        </div>

        {/* Breadcrumb & Actions */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{project.group}</span>
            <span>/</span>
            <span className="font-medium text-foreground">{project.code}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#1a56db] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-[#1545b8] hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
              Kirimkan Hasil ke Analis
            </button>
          </div>
        </div>

        {/* Project header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="max-w-2xl font-display text-[28px] font-extrabold leading-tight text-foreground">
              {project.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <Meta icon={Calendar} text={`Tahun ${project.year}`} />
              <Meta icon={MapPin} text={project.location} />
              <Meta icon={Leaf} text={project.ecosystem} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileClock className="size-3.5" /> Diperbarui {project.updated}
          </div>
        </div>

        {/* Combined TEV composition + methods */}
        <div className="relative mt-6 overflow-hidden rounded-2xl bg-[#0f2547] p-6 text-white shadow-[0_16px_40px_-16px_rgba(15,37,71,0.6)] lg:p-7">
          <div
            className="pointer-events-none absolute -right-10 -top-10 size-56 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(34,160,107,0.35), transparent 70%)" }}
          />
          <div className="relative grid gap-7 lg:grid-cols-[1.7fr_1fr]">
            {/* LEFT — TEV composition pie chart */}
            <TevComposition
              tevLahan={total}
              values={{
                provisioning: subtotal("provisioning"),
                regulating: subtotal("regulating"),
                supporting: subtotal("supporting"),
                cultural: subtotal("cultural"),
              }}
            />

            {/* RIGHT — meta + methods used */}
            <div className="lg:border-l lg:border-white/10 lg:pl-7">
              <div className="flex items-center gap-4 text-[12px] text-white/70">
                <span>
                  <span className="font-semibold text-white">
                    {project.rows.length}
                  </span>{" "}
                  entri data
                </span>
                <span>
                  <span className="font-semibold text-white">4</span> kategori jasa
                </span>
              </div>

              {/* Metode valuasi yang telah digunakan */}
              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/60">
                    <ClipboardCheck className="size-3.5" /> Metode Valuasi Digunakan
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-white/70">
                    {usedMethodCount} metode
                  </span>
                </div>
                {usedByCategory.length === 0 ? (
                  <p className="text-[12px] text-white/60">
                    Belum ada metode yang digunakan.
                  </p>
                ) : (
                  <div className="space-y-3.5">
                    {usedByCategory.map((g) => {
                      const cat = CATEGORIES[g.cat];
                      return (
                        <div key={g.cat}>
                          <div className="mb-1.5 flex items-center gap-2">
                            <span
                              className="size-2 shrink-0 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                              {cat.label}
                            </span>
                            <span className="font-mono text-[10px] text-white/45">
                              {g.methods.length}
                            </span>
                            <div className="ml-1 h-px flex-1 bg-white/10" />
                          </div>
                          <div className="space-y-1.5">
                            {g.methods.map((m) => (
                              <div
                                key={m.method}
                                className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10"
                              >
                                <div className="min-w-0 flex-1 leading-tight">
                                  <div className="truncate text-[12px] font-semibold text-white">
                                    {m.method}
                                  </div>
                                  <div className="text-[10px] text-white/55">
                                    {formatIDR(m.total, true)}
                                  </div>
                                </div>
                                <span className="grid min-w-5 place-items-center rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                                  {m.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Identification section */}
        <section className="mt-9">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-foreground">
              Identifikasi Jasa Ekosistem
            </h2>
            <p className="text-sm text-muted-foreground">
              Data valuasi dikelompokkan menurut kategori jasa ekosistem.
            </p>
          </div>

          <div className="space-y-3">
            {CAT_ORDER.map((cat) => {
              const meta = CATEGORIES[cat];
              const Icon = CAT_ICON[cat];
              const rows = project.rows.filter((r) => r.category === cat);
              const isOpen = open[cat];
              return (
                <div
                  key={cat}
                  className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                >
                  <button
                    onClick={() => setOpen((o) => ({ ...o, [cat]: !o[cat] }))}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-muted/40"
                  >
                    <div
                      className="grid size-10 shrink-0 place-items-center rounded-xl"
                      style={{ backgroundColor: meta.tint, color: meta.color }}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-[15px] font-bold text-foreground">
                          {meta.label}
                        </h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {rows.length}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {meta.description}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Subtotal
                      </div>
                      <div className="font-display text-sm font-bold text-foreground">
                        {formatIDR(subtotal(cat), true)}
                      </div>
                    </div>
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="animate-panel border-t border-border">
                      {rows.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-5 py-9 text-center">
                          <p className="text-sm text-muted-foreground">
                            Belum ada data valuasi untuk kategori ini.
                          </p>
                          <button
                            onClick={() => onAddData(cat)}
                            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-50 px-3.5 py-2 text-[13px] font-semibold text-primary transition hover:bg-primary-100"
                          >
                            <Plus className="size-4" /> Tambah Data · {meta.label}
                          </button>
                        </div>
                      ) : cat === "provisioning" ? (
                        <div>
                          {BIOTA_ORDER.map((b) => {
                            const bRows = rows.filter((r) => r.biota === b);
                            const other = rows.filter((r) => !r.biota);
                            const list = b === "fauna" ? [...bRows, ...other] : bRows;
                            return (
                              <div key={b} className="border-b border-border last:border-0">
                                <div className="flex items-center gap-2 bg-muted/40 px-5 py-2.5">
                                  <span
                                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                    style={{ backgroundColor: BIOTA[b].tint, color: BIOTA[b].color }}
                                  >
                                    <span className="size-1.5 rounded-full" style={{ backgroundColor: BIOTA[b].color }} />
                                    {BIOTA[b].label}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {list.length} entri · Subtotal{" "}
                                    <span className="font-semibold text-foreground">
                                      {formatIDR(list.reduce((s, r) => s + r.value, 0), true)}
                                    </span>
                                  </span>
                                </div>
                                <ServiceTable
                                  rows={list}
                                  highlightId={highlightId}
                                  onPreview={onPreview}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  emptyLabel={`Belum ada data ${BIOTA[b].label.toLowerCase()}.`}
                                />
                              </div>
                            );
                          })}
                          <div className="flex justify-end border-t border-border bg-muted/20 px-5 py-3">
                            <button
                              onClick={() => onAddData(cat)}
                              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-50 px-3.5 py-2 text-[13px] font-semibold text-primary transition hover:bg-primary-100"
                            >
                              <Plus className="size-4" /> Tambah Data · {meta.label}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <ServiceTable
                            rows={rows}
                            highlightId={highlightId}
                            onPreview={onPreview}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-3">
                            <span className="text-[12px] text-muted-foreground">
                              Subtotal {meta.label} ·{" "}
                              <span className="font-display font-bold text-foreground">
                                {formatIDR(subtotal(cat), true)}
                              </span>
                            </span>
                            <button
                              onClick={() => onAddData(cat)}
                              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-50 px-3.5 py-2 text-[13px] font-semibold text-primary transition hover:bg-primary-100"
                            >
                              <Plus className="size-4" /> Tambah Data · {meta.label}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <StatusLegend />
        </section>
      </div>
    </div>
  );
}

type TevScope = "lahan" | "index" | "project";

const SCOPE_META: Record<
  TevScope,
  { label: string; title: string; totalLabel: string; sisaLabel: string; mult: number }
> = {
  lahan: {
    label: "Tutupan Lahan",
    title: "Komposisi TEV Tutupan Lahan",
    totalLabel: "Total TEV Tutupan Lahan",
    sisaLabel: "",
    mult: 1,
  },
  index: {
    label: "Index",
    title: "Komposisi TEV terhadap Index",
    totalLabel: "Total TEV Index",
    sisaLabel: "Sisa TEV Index",
    mult: 5,
  },
  project: {
    label: "Project",
    title: "Komposisi TEV terhadap Project",
    totalLabel: "Total TEV Project",
    sisaLabel: "Sisa TEV Project",
    mult: 12.5,
  },
};

const SCOPES: TevScope[] = ["lahan", "index", "project"];

function TevComposition({
  tevLahan,
  values,
}: {
  tevLahan: number;
  values: Record<CategoryKey, number>;
}) {
  const [scope, setScope] = useState<TevScope>("lahan");
  const [hovered, setHovered] = useState<string | null>(null);
  const meta = SCOPE_META[scope];
  const scopeTotal = tevLahan * meta.mult;
  const sisa = Math.max(0, scopeTotal - tevLahan);

  const segments: {
    key: string;
    label: string;
    value: number;
    color: string;
    aggregate?: boolean;
  }[] = [
    ...CAT_ORDER.map((cat) => ({
      key: cat,
      label: CATEGORIES[cat].label,
      value: values[cat],
      color: CATEGORIES[cat].color,
    })),
    ...(scope === "lahan"
      ? []
      : [
          {
            key: "sisa",
            label: meta.sisaLabel,
            value: sisa,
            color: "#94a3b8",
            aggregate: true,
          },
        ]),
  ];

  const denom = scopeTotal > 0 ? scopeTotal : 1;
  const share = denom > 0 ? (tevLahan / denom) * 100 : 0;

  const activeSeg = segments.find((s) => s.key === hovered) ?? null;

  // Donut geometry
  const r = 76;
  const circ = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="flex flex-col">
      {/* Header + scope selector */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/60">
            <TrendingUp className="size-3.5" /> {meta.title}
          </div>
        </div>
        <div className="inline-flex rounded-lg bg-white/10 p-0.5">
          {SCOPES.map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${
                scope === s
                  ? "bg-white text-[#0f2547] shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {SCOPE_META[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        {/* Donut */}
        <div className="relative shrink-0">
          <svg viewBox="0 0 200 200" className="size-72 -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="26"
            />
            {segments.map((seg) => {
              const frac = denom > 0 ? seg.value / denom : 0;
              const len = frac * circ;
              const dash = `${len} ${circ - len}`;
              const offset = -acc * circ;
              acc += frac;
              const isActive = hovered === seg.key;
              const dim = hovered !== null && !isActive;
              return (
                <circle
                  key={seg.key}
                  cx="100"
                  cy="100"
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isActive ? 32 : 26}
                  strokeDasharray={dash}
                  strokeDashoffset={offset}
                  opacity={dim ? 0.3 : 1}
                  onMouseEnter={() => setHovered(seg.key)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer transition-all duration-300 [transform-box:fill-box] [transform-origin:center]"
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            {activeSeg ? (
              <>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: activeSeg.color }}
                  />
                  {activeSeg.label}
                </div>
                <div className="mt-1 font-display text-[26px] font-extrabold leading-none text-white">
                  {formatIDR(activeSeg.value, true)}
                </div>
                <div className="mt-1 font-mono text-[13px] font-bold text-eco">
                  {((activeSeg.value / denom) * 100).toFixed(1)}%
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                  {meta.totalLabel}
                </div>
                <div className="mt-1 font-display text-[28px] font-extrabold leading-none text-white">
                  {formatIDR(scopeTotal, true)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex-1 space-y-1.5">
          {segments.map((seg) => {
            const pct = denom > 0 ? (seg.value / denom) * 100 : 0;
            return (
              <div
                key={seg.key}
                onMouseEnter={() => setHovered(seg.key)}
                onMouseLeave={() => setHovered(null)}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1 transition ${
                  hovered === seg.key ? "bg-white/10" : "hover:bg-white/5"
                } ${hovered !== null && hovered !== seg.key ? "opacity-40" : ""}`}
              >
                <span
                  className={`size-2.5 shrink-0 rounded-full ${
                    seg.aggregate ? "ring-2 ring-white/25 ring-offset-1 ring-offset-[#0f2547]" : ""
                  }`}
                  style={{ backgroundColor: seg.color }}
                />
                <span
                  className={`flex-1 text-[12px] ${
                    seg.aggregate
                      ? "font-semibold text-white/60"
                      : "font-medium text-white"
                  }`}
                >
                  {seg.label}
                </span>
                <span className="font-mono text-[11px] text-white/60">
                  {formatIDR(seg.value, true)}
                </span>
                <span className="w-10 text-right font-mono text-[11px] font-bold text-white">
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer summary / explanatory text */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
        {scope === "lahan" ? (
          <>
            <span className="text-[12px] font-semibold text-white/70">
              {meta.totalLabel}
            </span>
            <span className="font-mono text-[13px] font-bold text-white">
              {formatIDR(scopeTotal)}
            </span>
          </>
        ) : (
          <p className="text-[12px] text-white/70">
            TEV Tutupan Lahan{" "}
            <span className="font-mono font-semibold text-white">
              {formatIDR(tevLahan, true)}
            </span>{" "}
            berkontribusi{" "}
            <span className="font-semibold text-eco">{share.toFixed(1)}%</span>{" "}
            terhadap {meta.totalLabel.replace("Total ", "")}{" "}
            <span className="font-mono font-semibold text-white">
              {formatIDR(scopeTotal, true)}
            </span>
            .
          </p>
        )}
      </div>
    </div>
  );
}

function ServiceTable({
  rows,
  highlightId,
  onPreview,
  onEdit,
  onDelete,
  emptyLabel,
}: {
  rows: ValuationRow[];
  highlightId?: string | null;
  onPreview: (row: ValuationRow) => void;
  onEdit: (row: ValuationRow) => void;
  onDelete: (row: ValuationRow) => void;
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="px-5 py-5 text-center text-[12px] text-muted-foreground">
        {emptyLabel ?? "Belum ada data."}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
            <Th>ID</Th>
            <Th>Barang/Jasa</Th>
            <Th>Metode</Th>
            <Th className="text-right">Kuantitas</Th>
            <Th className="text-right">Nilai Ekonomi</Th>
            <Th className="text-right">Aksi</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const hot = r.id === highlightId;
            const s = STATUS[r.status];
            return (
              <tr
                key={r.id}
                title={`Status: ${s.label}`}
                className={`border-b border-border/70 transition last:border-0 ${
                  hot ? "bg-eco-50" : "hover:bg-muted/40"
                }`}
              >
                <Td style={{ boxShadow: `inset 4px 0 0 ${s.color}` }}>
                  <span className="font-mono text-[12px] font-semibold text-primary">
                    {r.id}
                  </span>
                </Td>
                <Td>
                  <div className="font-medium text-foreground">{r.item}</div>
                </Td>
                <Td>
                  <span className="text-[12px] text-muted-foreground">
                    {r.method}
                  </span>
                </Td>
                <Td className="text-right">
                  <span className="font-mono text-[12px] text-foreground">
                    {formatNum(r.quantity)}
                  </span>
                  <div className="text-[10px] text-muted-foreground">{r.unit}</div>
                </Td>
                <Td className="text-right">
                  <span className="font-mono text-[13px] font-bold text-foreground">
                    {formatIDR(r.value, true)}
                  </span>
                </Td>
                <Td className="text-right">
                  <ActionMenu
                    row={r}
                    onPreview={onPreview}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Meta({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-4 text-muted-foreground/70" />
      {text}
    </span>
  );
}

function Th({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-5 py-2.5 font-semibold ${className}`}>{children}</th>
  );
}

function Td({
  children,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <td className={`px-5 py-3.5 align-top ${className}`} style={style}>
      {children}
    </td>
  );
}

function ActionMenu({
  row,
  onPreview,
  onEdit,
  onDelete,
}: {
  row: ValuationRow;
  onPreview: (row: ValuationRow) => void;
  onEdit: (row: ValuationRow) => void;
  onDelete: (row: ValuationRow) => void;
}) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (pos) {
      setPos(null);
      return;
    }
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    }
  };

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  const items: {
    label: string;
    icon: typeof Eye;
    onClick: () => void;
    danger?: boolean;
  }[] = [
    { label: "Preview", icon: Eye, onClick: () => onPreview(row) },
    { label: "Edit", icon: Pencil, onClick: () => onEdit(row) },
    { label: "Hapus", icon: Trash2, onClick: () => onDelete(row), danger: true },
  ];

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label={`Aksi ${row.id}`}
        aria-expanded={!!pos}
        className={`grid size-8 place-items-center rounded-lg border transition ${
          pos
            ? "border-primary/40 bg-primary-50 text-primary"
            : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <MoreVertical className="size-4" />
      </button>
      {pos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[70]" onClick={() => setPos(null)} />
            <div
              className="animate-panel fixed z-[71] w-44 overflow-hidden rounded-xl border border-border bg-white py-1 text-left shadow-[0_16px_40px_-12px_rgba(15,27,45,0.35)]"
              style={{ top: pos.top, right: pos.right }}
            >
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <button
                    key={it.label}
                    onClick={() => {
                      setPos(null);
                      it.onClick();
                    }}
                    className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium transition ${
                      it.danger
                        ? "text-[#c0392b] hover:bg-[#fdecec]"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-4" /> {it.label}
                  </button>
                );
              })}
            </div>
          </>,
          document.body
        )}
    </>
  );
}

export function StatusLegend() {
  return (
    <div className="mt-4 rounded-2xl border border-border bg-white px-5 py-4">
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Keterangan Status Data
      </div>
      <div className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {STATUS_LEGEND_KEYS.map((k) => {
          const s = STATUS[k];
          return (
            <div key={k} className="flex items-start gap-2.5">
              <span
                className="mt-0.5 h-4 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <div className="text-[13px] leading-snug">
                <span className="font-semibold text-foreground">{s.label}</span>
                <span className="text-muted-foreground"> — {s.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
