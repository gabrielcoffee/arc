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
        "shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)]",
        interactive &&
          "transition-all duration-200 hover:border-accent/40 hover:shadow-[0_4px_20px_rgba(160,122,62,0.10)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
