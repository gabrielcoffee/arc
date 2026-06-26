import { cn } from "@/lib/utils";

/** The ARC mark — a drawn arc, nodding to the "committee that builds for you". */
export function ArcMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={cn("text-accent", className)}
    >
      <path
        d="M4 22a10 10 0 0 1 20 0"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <circle cx="4" cy="22" r="2.4" fill="currentColor" />
      <circle cx="14" cy="12" r="2.4" fill="currentColor" />
      <circle cx="24" cy="22" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <ArcMark className="h-[22px] w-[22px]" />
      <span className="font-display text-[1.35rem] leading-none tracking-tight text-ink">
        ARC
      </span>
    </span>
  );
}
