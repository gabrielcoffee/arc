import { cn } from "@/lib/utils";

/** Numbered section eyebrow — "01 / Como funciona" in mono, Dia Browser style. */
export function SectionLabel({
  number,
  children,
  className,
}: {
  number?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.18em] text-ink-2",
        className,
      )}
    >
      {number && <span className="text-accent">{number}</span>}
      <span className="h-px w-6 bg-border" />
      <span>{children}</span>
    </div>
  );
}
