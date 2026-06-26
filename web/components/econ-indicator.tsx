import { cn } from "@/lib/utils";

/** Inline economic indicator chip — [SELIC] [14.50%] [BCB · Jun/26] */
export function EconIndicator({
  label,
  value,
  source,
  className,
}: {
  label: string;
  value: string;
  source?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--radius-badge)] border border-border bg-subtle px-2 py-1 font-mono text-2xs",
        className,
      )}
    >
      <span className="uppercase tracking-[0.08em] text-ink-2">{label}</span>
      <span className="font-medium text-ink">{value}</span>
      {source && <span className="text-ink-3">{source}</span>}
    </span>
  );
}
