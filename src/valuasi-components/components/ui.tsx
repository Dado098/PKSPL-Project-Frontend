import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { CATEGORIES, STATUS, type CategoryKey, type DataStatus } from "../data";

export function CategoryBadge({ category }: { category: CategoryKey }) {
  const c = CATEGORIES[category];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold font-display"
      style={{ backgroundColor: c.tint, color: c.color }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: c.color }}
      />
      {c.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: DataStatus }) {
  const s = STATUS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ backgroundColor: s.tint, color: s.color }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  children,
  maxWidth = "max-w-3xl",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div
        className="animate-overlay fixed inset-0 bg-[#0f1b2d]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={`animate-modal relative z-10 w-full ${maxWidth} my-auto rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgba(15,27,45,0.35)] ring-1 ring-border`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  title,
  step,
  onClose,
  subtitle,
}: {
  title: string;
  step?: string;
  onClose: () => void;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-7 py-5">
      <div>
        {step && (
          <div className="mb-1 font-mono text-[11px] font-medium uppercase tracking-wider text-primary">
            {step}
          </div>
        )}
        <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label="Tutup"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

export function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all"
          style={{
            width: i === current ? 22 : 8,
            backgroundColor: i <= current ? "var(--primary)" : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}
