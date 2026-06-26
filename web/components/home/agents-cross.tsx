"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Newspaper, ChartPie, Award } from "flowbite-react-icons/outline";

type Kind = "economista" | "fundamentalista" | "tecnico" | "estrategista";

interface Agent {
  kind: Kind;
  name: string;
  model: string;
  role: string;
  /** Position on the cross + where the static caption sits. */
  pos: "top" | "left" | "right" | "bottom";
}

const AGENTS: Agent[] = [
  {
    kind: "economista",
    name: "Economista",
    model: "Sonnet 4.6",
    role: "Lê o mundo — juros, câmbio, fiscal — e define o regime macro.",
    pos: "top",
  },
  {
    kind: "fundamentalista",
    name: "Fundamentalista",
    model: "Sonnet 4.6",
    role: "Escolhe ativos ilustrativos por valor + qualidade.",
    pos: "left",
  },
  {
    kind: "tecnico",
    name: "Técnico",
    model: "Sonnet 4.6",
    role: "Confirma o momento com OHLCV real — tendência e níveis.",
    pos: "right",
  },
  {
    kind: "estrategista",
    name: "Estrategista-Chefe",
    model: "Opus 4.8",
    role: "Debate as divergências, faz o pré-mortem e escreve a carta.",
    pos: "bottom",
  },
];

const POS_CLASS: Record<Agent["pos"], string> = {
  top: "left-1/2 top-0 -translate-x-1/2",
  left: "left-0 top-1/2 -translate-y-1/2",
  right: "right-0 top-1/2 -translate-y-1/2",
  bottom: "left-1/2 bottom-0 -translate-x-1/2",
};

const FLOAT_DELAY: Record<Kind, string> = {
  economista: "0s",
  fundamentalista: "1.1s",
  tecnico: "2.2s",
  estrategista: "3.3s",
};

export function AgentsCross() {
  const [active, setActive] = useState<Kind | null>(null);
  const current = AGENTS.find((a) => a.kind === active);

  return (
    <div className="mx-auto w-full max-w-[440px]">
      {/* ── The cross ─────────────────────────────────────── */}
      <div className="relative aspect-square w-full">
        {/* cycling arrows (decorative, behind the robots) */}
        <RingArrows />

        {/* center readout */}
        <div className="absolute left-1/2 top-1/2 z-10 w-[156px] -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[var(--radius-card)] border border-border bg-bg/70 px-3.5 py-3 text-center backdrop-blur-sm transition-colors">
            {current ? (
              <>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent">
                  {current.model}
                </p>
                <p className="mt-1 font-display text-sm leading-tight text-ink">
                  {current.name}
                </p>
                <p className="mt-1.5 text-[0.7rem] leading-snug text-ink-2">
                  {current.role}
                </p>
              </>
            ) : (
              <>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-3">
                  comitê
                </p>
                <p className="mt-1 font-display text-sm leading-tight text-ink">
                  4 agentes, 1 carta
                </p>
                <p className="mt-1.5 text-[0.7rem] leading-snug text-ink-3">
                  Passe o mouse em cada robô.
                </p>
              </>
            )}
          </div>
        </div>

        {/* robots */}
        {AGENTS.map((a) => (
          <div
            key={a.kind}
            className={cn("absolute z-20", POS_CLASS[a.pos])}
          >
            <div
              className="motion-safe:animate-float"
              style={{ animationDelay: FLOAT_DELAY[a.kind] }}
            >
              <button
                type="button"
                onMouseEnter={() => setActive(a.kind)}
                onMouseLeave={() => setActive((k) => (k === a.kind ? null : k))}
                onFocus={() => setActive(a.kind)}
                onBlur={() => setActive((k) => (k === a.kind ? null : k))}
                aria-label={`${a.name} — ${a.role}`}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-xl p-1 outline-none transition-all duration-300",
                  "focus-visible:ring-2 focus-visible:ring-accent/50",
                  a.pos === "top" ? "flex-col-reverse" : "flex-col",
                  active && active !== a.kind && "opacity-45",
                )}
              >
                <Robot kind={a.kind} dim={!!active && active !== a.kind} />
                <span
                  className={cn(
                    "font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors",
                    active === a.kind ? "text-accent" : "text-ink-2",
                  )}
                >
                  {a.name}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Dotted line → the three products ──────────────── */}
      <div className="mt-4 flex flex-col items-center">
        <div className="h-6 w-px border-l border-dashed border-accent/55" />
        <div className="h-px w-[66%] border-t border-dashed border-accent/40" />
        <div className="grid w-full grid-cols-3">
          {PRODUCTS.map((p) => (
            <div key={p.label} className="flex flex-col items-center">
              <div className="h-4 w-px border-l border-dashed border-accent/40" />
              <div className="flex w-full flex-col items-center gap-1.5 rounded-[10px] border border-border bg-surface px-2 py-3 text-center transition-colors hover:border-accent/50">
                <p.icon className="h-5 w-5 text-accent" />
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink">
                  {p.label}
                </span>
                {p.sub && (
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-ink-3">
                    {p.sub}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PRODUCTS = [
  { label: "Carta", icon: Newspaper, sub: "Semanal" },
  { label: "Carteira", icon: ChartPie, sub: "Mensal" },
  { label: "Ranking", icon: Award, sub: "Top 20" },
] as const;

/* ── Cycling arrows around the four nodes ────────────────── */
function RingArrows() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className="absolute inset-0 z-0 h-full w-full text-accent/55"
      aria-hidden
    >
      <defs>
        <marker
          id="arc-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      {[
        "M50,15 Q76,24 85,50", // top → right
        "M85,50 Q76,76 50,85", // right → bottom
        "M50,85 Q24,76 15,50", // bottom → left
        "M15,50 Q24,24 50,15", // left → top
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="3 6"
          markerEnd="url(#arc-arrow)"
          className="motion-safe:animate-dash"
        />
      ))}
    </svg>
  );
}

/* ── A single robot character ────────────────────────────── */
function Robot({ kind, dim }: { kind: Kind; dim?: boolean }) {
  return (
    <svg
      viewBox="0 0 72 86"
      fill="none"
      className={cn(
        "h-[4.75rem] w-16 transition-all duration-300 sm:h-[5.5rem] sm:w-[4.75rem]",
        dim ? "text-ink-3" : "text-ink-2 group-hover:text-ink",
        "group-hover:-translate-y-1 group-hover:scale-[1.06]",
      )}
    >
      {/* antenna */}
      <line
        x1="36"
        y1="7"
        x2="36"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="36"
        cy="5"
        r="3"
        className="fill-accent transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_4px_var(--color-accent))]"
      />
      {/* head */}
      <rect
        x="11"
        y="15"
        width="50"
        height="38"
        rx="11"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* eyes */}
      <g className="origin-center transition-transform duration-300 group-hover:scale-y-110">
        <circle cx="27" cy="33" r="4.3" className="fill-accent" />
        <circle cx="45" cy="33" r="4.3" className="fill-accent" />
      </g>
      {/* mouth / visor */}
      <rect
        x="27"
        y="43"
        width="18"
        height="3.2"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* neck */}
      <line
        x1="36"
        y1="53"
        x2="36"
        y2="58"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* body */}
      <rect
        x="17"
        y="58"
        width="38"
        height="22"
        rx="7"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <Emblem kind={kind} />
    </svg>
  );
}

function Emblem({ kind }: { kind: Kind }) {
  const common = {
    className: "stroke-accent",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  switch (kind) {
    case "economista":
      // up-trend line
      return <polyline points="24,73 31,66 37,70 47,61" {...common} />;
    case "fundamentalista":
      // magnifier
      return (
        <>
          <circle cx="32" cy="67" r="5" {...common} />
          <line x1="36" y1="71" x2="41" y2="76" {...common} />
        </>
      );
    case "tecnico":
      // candlestick bars
      return (
        <>
          <line x1="28" y1="76" x2="28" y2="64" {...common} />
          <line x1="36" y1="76" x2="36" y2="60" {...common} />
          <line x1="44" y1="76" x2="44" y2="68" {...common} />
        </>
      );
    case "estrategista":
      // crown
      return <path d="M25 75 L28 63 L36 71 L44 63 L47 75 Z" {...common} />;
  }
}
