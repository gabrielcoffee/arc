"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/arc-mark";
import { ButtonLink } from "@/components/ui/button";

const LINKS = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/metodologia", label: "Metodologia" },
  { href: "/exemplo", label: "Carta de exemplo" },
  { href: "/planos", label: "Planos" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" aria-label="ARC — início">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm transition-colors hover:text-ink",
                pathname === l.href ? "text-ink" : "text-ink-2",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/app"
            className="text-sm text-ink-2 transition-colors hover:text-ink"
          >
            Entrar
          </Link>
          <ButtonLink href="/planos" size="sm">
            Ver planos
          </ButtonLink>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="relative flex h-4 w-5 flex-col justify-between">
            <span
              className={cn(
                "h-[1.5px] w-full bg-ink transition-transform",
                open && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-[1.5px] w-full bg-ink transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-[1.5px] w-full bg-ink transition-transform",
                open && "-translate-y-[7px] -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-bg px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-2 text-sm text-ink-2"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <ButtonLink href="/planos" size="sm" className="flex-1">
                Ver planos
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
