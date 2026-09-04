import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, TrendingUp, Waves } from "lucide-react";
import { Modal, ModalHeader, StepDots } from "./ui";
import type { ModuleKey } from "../data";

const MODULES: {
  key: ModuleKey;
  title: string;
  tag: string;
  desc: string;
  icon: typeof TrendingUp;
  points: string[];
}[] = [
  {
    key: "direct",
    title: "Direct Use Value",
    tag: "Nilai Guna Langsung",
    desc: "Manfaat yang diperoleh secara langsung dari pemanfaatan ekosistem, seperti hasil perikanan, kayu, dan wisata.",
    icon: TrendingUp,
    points: ["Konsumtif & produktif", "Berbasis harga pasar"],
  },
  {
    key: "indirect",
    title: "Indirect Use Value",
    tag: "Nilai Guna Tidak Langsung",
    desc: "Manfaat dari fungsi ekologis ekosistem, seperti pengaturan iklim, penyerapan karbon, dan perlindungan pesisir.",
    icon: Waves,
    points: ["Fungsi & jasa ekologis", "Pendekatan non-pasar"],
  },
];

export function SelectModuleModal({
  open,
  onClose,
  onContinue,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: (m: ModuleKey) => void;
  initial?: ModuleKey | null;
}) {
  const [selected, setSelected] = useState<ModuleKey | null>(initial ?? null);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <ModalHeader
        step="Langkah 1 dari 3 · Modul Valuasi"
        title="Pilih Modul"
        subtitle="Tentukan kategori nilai ekonomi yang akan dihitung."
        onClose={onClose}
      />

      <div className="grid gap-4 px-7 py-6 sm:grid-cols-2">
        {MODULES.map((m) => {
          const active = selected === m.key;
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => setSelected(m.key)}
              className={`group relative flex flex-col rounded-xl border p-5 text-left transition-all ${
                active
                  ? "border-primary bg-primary-50 shadow-[0_8px_24px_-10px_rgba(26,92,214,0.5)]"
                  : "border-border bg-white hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <div
                className={`absolute right-4 top-4 grid size-5 place-items-center rounded-full border-2 transition ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-transparent"
                }`}
              >
                <Check className="size-3" strokeWidth={3} />
              </div>
              <div
                className={`grid size-12 place-items-center rounded-xl transition ${
                  active ? "bg-primary text-white" : "bg-muted text-primary"
                }`}
              >
                <Icon className="size-6" />
              </div>
              <div className="mt-4 font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {m.tag}
              </div>
              <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                {m.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {m.desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.points.map((p) => (
                  <span
                    key={p}
                    className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-border px-7 py-4">
        <StepDots current={0} total={3} />
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" /> Kembali
          </button>
          <button
            disabled={!selected}
            onClick={() => selected && onContinue(selected)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Lanjutkan <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
