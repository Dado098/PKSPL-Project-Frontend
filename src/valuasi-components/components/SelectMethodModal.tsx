import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Tag,
  Factory,
  Home,
  Shield,
  Leaf,
  Mountain,
  Plane,
  MessageSquareQuote,
  ListChecks,
  Fish,
} from "lucide-react";
import { Modal, ModalHeader, StepDots } from "./ui";
import {
  CATEGORIES,
  METHODS,
  type CategoryKey,
  type ModuleKey,
  type MethodMeta,
} from "../data";

const ICONS: Record<string, typeof Tag> = {
  "market-price": Tag,
  "effect-production": Factory,
  hpm: Home,
  abm: Shield,
  carbon: Leaf,
  erosion: Mountain,
  tcm: Plane,
  cvm: MessageSquareQuote,
  choice: ListChecks,
  habitat: Fish,
};

const CATEGORY_ORDER: CategoryKey[] = [
  "provisioning",
  "regulating",
  "cultural",
  "supporting",
];

export function SelectMethodModal({
  open,
  module,
  presetCategory,
  onClose,
  onBack,
  onContinue,
}: {
  open: boolean;
  module: ModuleKey | null;
  presetCategory?: CategoryKey | null;
  onClose: () => void;
  onBack: () => void;
  onContinue: (m: MethodMeta) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const available = METHODS.filter((m) => !module || m.module.includes(module));
  // When adding data from a specific service table, only surface that
  // service's methods so each service is separated cleanly.
  const order = presetCategory ? [presetCategory] : CATEGORY_ORDER;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-4xl">
      <ModalHeader
        step="Langkah 1 dari 2 · Metode Valuasi"
        title="Pilih Metode Valuasi"
        subtitle={
          presetCategory
            ? `Menampilkan metode untuk ${CATEGORIES[presetCategory].label} terlebih dahulu.`
            : "Metode dikelompokkan berdasarkan kategori jasa ekosistem."
        }
        onClose={onClose}
      />

      <div className="max-h-[58vh] space-y-6 overflow-y-auto px-7 py-6">
        {order.map((catKey) => {
          const cat = CATEGORIES[catKey];
          const methods = available.filter((m) => m.category === catKey);
          if (methods.length === 0) return null;
          return (
            <section key={catKey}>
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <h3 className="font-display text-sm font-bold text-foreground">
                  {cat.label}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {cat.labelId}
                </span>
                {presetCategory === catKey && (
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Disarankan
                  </span>
                )}
                <div className="ml-1 h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {methods.map((m) => {
                  const active = selected === m.id;
                  const Icon = ICONS[m.id] ?? Tag;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m.id)}
                      className={`group relative flex gap-3.5 rounded-xl border p-4 text-left transition-all ${
                        active
                          ? "border-primary bg-primary-50 shadow-[0_8px_20px_-12px_rgba(26,92,214,0.5)]"
                          : "border-border bg-white hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <div
                        className="grid size-10 shrink-0 place-items-center rounded-lg"
                        style={{ backgroundColor: cat.tint, color: cat.color }}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-display text-sm font-bold text-foreground">
                            {m.name}
                          </h4>
                          <span
                            className={`grid size-5 shrink-0 place-items-center rounded-full border-2 transition ${
                              active
                                ? "border-primary bg-primary text-white"
                                : "border-border text-transparent"
                            }`}
                          >
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">
                          {m.subtitle}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {m.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-border px-7 py-4">
        <StepDots current={0} total={2} />
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" /> Batal
          </button>
          <button
            disabled={!selected}
            onClick={() => {
              const m = available.find((x) => x.id === selected);
              if (m) onContinue(m);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Lanjutkan <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
