import { cn } from "@/lib/utils";

export function Card({
  className,
  interactive,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface p-6",
        "shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
        interactive &&
          "transition-all duration-200 hover:border-accent/40 hover:shadow-[0_4px_24px_rgba(234,179,8,0.10)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
