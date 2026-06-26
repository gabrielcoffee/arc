"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const AGENTS = [
  { tag: "economista", model: "Sonnet 4.6", line: "Regime: juro real ~10% · Selic 14,50% · IPCA 4,72%" },
  { tag: "fundamentalista", model: "Sonnet 4.6", line: "Valor + qualidade · ITUB4 ROE 24,8% · KNCR11 P/VP 1,01x" },
  { tag: "técnico", model: "Sonnet 4.6", line: "OHLCV real · IVVB11 colado à resistência R$436" },
  { tag: "editor-chefe", model: "Opus 4.8", line: "Debate + pré-mortem → Carta da semana" },
];

/** Terminal/log-style visual of the sequential committee. Types in on load. */
export function CommitteePipeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = setTimeout(() => setActive(AGENTS.length), 0);
      return () => clearTimeout(t);
    }
    const timers = AGENTS.map((_, i) =>
      setTimeout(() => setActive(i + 1), 450 + i * 520),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-[0_8px_40px_rgba(17,17,16,0.06)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-subtle/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 font-mono text-2xs uppercase tracking-[0.14em] text-ink-3">
          run · 2026-06-16 · comitê
        </span>
      </div>

      <div className="space-y-3 p-5 font-mono text-xs">
        {AGENTS.map((a, i) => {
          const shown = i < active;
          const running = i === active - 1;
          return (
            <div
              key={a.tag}
              className={cn(
                "flex flex-col gap-1 transition-all duration-500",
                shown ? "opacity-100" : "translate-y-1 opacity-0",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-accent">›</span>
                <span className="font-medium text-ink">{a.tag}</span>
                <span className="text-ink-3">/ {a.model}</span>
                {running && (
                  <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-accent" />
                )}
                {shown && !running && (
                  <span className="ml-auto text-pos">✓</span>
                )}
              </div>
              <p className="pl-4 leading-relaxed text-ink-2">{a.line}</p>
              {i < AGENTS.length - 1 && (
                <div
                  className={cn(
                    "ml-[3px] h-3 w-px transition-colors duration-500",
                    shown ? "bg-accent/40" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-border bg-subtle/40 px-5 py-3">
        <span className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-2">
          → Carta + Carteira
        </span>
        <span className="font-mono text-2xs text-ink-3">
          0 alucinações de preço
        </span>
      </div>
    </div>
  );
}
