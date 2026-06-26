import { cn } from "@/lib/utils";

export type Stance = "favorece" | "neutro" | "cautela";

const styles: Record<Stance, string> = {
  favorece: "text-pos border-pos/30 bg-pos/[0.07]",
  neutro: "text-accent border-accent/30 bg-accent-wash",
  cautela: "text-neg border-neg/30 bg-neg/[0.07]",
};

export function StanceBadge({
  stance,
  className,
}: {
  stance: Stance;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-badge)] border px-2 py-[3px] font-mono text-2xs uppercase tracking-[0.12em]",
        styles[stance],
        className,
      )}
    >
      {stance}
    </span>
  );
}
