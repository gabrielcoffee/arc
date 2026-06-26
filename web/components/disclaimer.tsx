import { cn } from "@/lib/utils";
import { DISCLAIMER } from "@/lib/plans";

/** CVM disclaimer — visible, never an 8px gray footnote (design_brief §8). */
export function Disclaimer({
  variant = "block",
  className,
}: {
  variant?: "block" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <p className={cn("text-xs leading-relaxed text-ink-2", className)}>
        {DISCLAIMER}
      </p>
    );
  }
  return (
    <aside
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-subtle/60 p-5",
        className,
      )}
    >
      <p className="mb-1.5 font-mono text-2xs uppercase tracking-[0.14em] text-accent">
        Aviso · Res. CVM 20/2021
      </p>
      <p className="text-xs leading-relaxed text-ink-2">{DISCLAIMER}</p>
    </aside>
  );
}
