import { Sprout } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--green)] border border-[var(--border)]">
        <Sprout className="h-6 w-6" strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-base font-bold leading-tight text-[var(--green)]">Crop-Disease-Detection</p>
        <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">Plant Health System</p>
      </div>
    </div>
  );
}
