"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Kind = "economista" | "fundamentalista" | "tecnico" | "estrategista";
type SpecKind = "fii" | "cripto" | "global" | "professor";
type AnyKind = Kind | SpecKind;

/** One size for every robot (cross + specialists). */
const ROBOT_SIZE = "h-[3.5rem] w-12 sm:h-[3.75rem] sm:w-[3.25rem]";
/** One size for every caption (robot labels + rail title). */
const LABEL_CLASS = "font-mono text-[0.5625rem] uppercase tracking-[0.1em]";

interface Agent {
  kind: Kind;
  name: string;
  role: string;
  /** Position on the cross + where the static caption sits. */
  pos: "top" | "left" | "right" | "bottom";
}

const AGENTS: Agent[] = [
  {
    kind: "economista",
    name: "Economista",
    role: "Lê o mundo, juros, câmbio, fiscal, e define o regime macro.",
    pos: "top",
  },
  {
    kind: "fundamentalista",
    name: "Fundamentalista",
    role: "Escolhe ativos ilustrativos por valor + qualidade.",
    pos: "left",
  },
  {
    kind: "tecnico",
    name: "Técnico",
    role: "Confirma o momento com OHLCV real, tendência e níveis.",
    pos: "right",
  },
  {
    kind: "estrategista",
    name: "Estrategista-Chefe",
    role: "Debate as divergências, faz o pré-mortem e escreve a carta.",
    pos: "bottom",
  },
];

interface Specialist {
  kind: SpecKind;
  name: string;
  role: string;
}

const SPECIALISTS: Specialist[] = [
  {
    kind: "fii",
    name: "FII",
    role: "Renda e tijolo, fundos imobiliários e dividendos.",
  },
  {
    kind: "cripto",
    name: "Cripto",
    role: "Bitcoin e a fronteira digital, com risco controlado.",
  },
  {
    kind: "global",
    name: "Global",
    role: "Diversificação lá fora, bolsa e renda fixa global.",
  },
  {
    kind: "professor",
    name: "Professor",
    role: "Transforma a semana numa aula que explica cada decisão.",
  },
];

const POS_CLASS: Record<Agent["pos"], string> = {
  top: "left-1/2 top-[4%] -translate-x-1/2",
  left: "left-[12%] top-1/2 -translate-x-1/2 -translate-y-1/2",
  right: "left-[88%] top-1/2 -translate-x-1/2 -translate-y-1/2",
  bottom: "left-1/2 bottom-[4%] -translate-x-1/2",
};

const FLOAT_DELAY: Record<AnyKind, string> = {
  economista: "0s",
  fundamentalista: "1.1s",
  tecnico: "2.2s",
  estrategista: "3.3s",
  fii: "0.6s",
  cripto: "1.7s",
  global: "2.8s",
  professor: "3.9s",
};

export function AgentsCross() {
  const [active, setActive] = useState<Kind | null>(null);
  const [activeSpec, setActiveSpec] = useState<SpecKind | null>(null);
  const current = AGENTS.find((a) => a.kind === active);

  return (
    <div className="mx-auto w-full max-w-[540px]">
      {/* ── Committee (estrategistas) ──────────────────────── */}
      <div>
        <SectionTitle>Estrategistas</SectionTitle>
        <div className="relative mx-auto aspect-square w-full max-w-[360px]">
          {/* cycling connectors (decorative, behind the robots) */}
          <RingArcs />

          {/* center readout */}
          <div className="absolute left-1/2 top-1/2 z-10 w-[156px] -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-[var(--radius-card)] border border-border bg-bg/70 px-3.5 py-3 text-center backdrop-blur-sm transition-colors">
              {current ? (
                <>
                  <p className="font-display text-sm leading-tight text-ink">
                    {current.name}
                  </p>
                  <p className="mt-1.5 text-[0.7rem] leading-snug text-ink-2">
                    {current.role}
                  </p>
                </>
              ) : (
                <p className="text-[0.7rem] leading-snug text-ink-3">
                  Passe o mouse em cada robô.
                </p>
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
                  onMouseLeave={() =>
                    setActive((k) => (k === a.kind ? null : k))
                  }
                  onFocus={() => setActive(a.kind)}
                  onBlur={() => setActive((k) => (k === a.kind ? null : k))}
                  aria-label={`${a.name}, ${a.role}`}
                  className={cn(
                    "group relative flex flex-col items-center gap-1.5 rounded-xl p-1 outline-none transition-all duration-300",
                    "focus-visible:ring-2 focus-visible:ring-accent/50",
                    a.pos === "top" ? "flex-col-reverse" : "flex-col",
                    active && active !== a.kind && "opacity-45",
                  )}
                >
                  <Robot kind={a.kind} dim={!!active && active !== a.kind} />
                  <span
                    className={cn(
                      LABEL_CLASS,
                      "transition-colors",
                      active === a.kind ? "text-accent" : "text-ink-2",
                      // side robots: float the label so the glyph itself
                      // stays centered on the diamond point
                      (a.pos === "left" || a.pos === "right") &&
                        "absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap",
                    )}
                  >
                    {a.name}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Connector id="conn-1" />

      {/* ── Specialists (horizontal, below the cycle) ──────── */}
      <div className="mt-2 flex flex-col items-center">
        <SectionTitle>Especialistas</SectionTitle>
        <div className="mt-1 flex flex-wrap justify-center gap-4 sm:gap-6">
          {SPECIALISTS.map((s) => (
            <div key={s.kind} className="relative">
              <div
                className="motion-safe:animate-float"
                style={{ animationDelay: FLOAT_DELAY[s.kind] }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActiveSpec(s.kind)}
                  onMouseLeave={() =>
                    setActiveSpec((k) => (k === s.kind ? null : k))
                  }
                  onFocus={() => setActiveSpec(s.kind)}
                  onBlur={() =>
                    setActiveSpec((k) => (k === s.kind ? null : k))
                  }
                  aria-label={`${s.name}, ${s.role}`}
                  className={cn(
                    "group flex flex-col items-center gap-1 rounded-xl p-1 outline-none transition-all duration-300",
                    "focus-visible:ring-2 focus-visible:ring-accent/50",
                    activeSpec && activeSpec !== s.kind && "opacity-45",
                  )}
                >
                  <Robot
                    kind={s.kind}
                    dim={!!activeSpec && activeSpec !== s.kind}
                  />
                  <span
                    className={cn(
                      LABEL_CLASS,
                      "transition-colors",
                      activeSpec === s.kind ? "text-accent" : "text-ink-2",
                    )}
                  >
                    {s.name}
                  </span>
                </button>
              </div>

              {/* detail panel, shows below the robot */}
              {activeSpec === s.kind && (
                <div className="absolute left-1/2 top-full z-30 mt-2 w-44 -translate-x-1/2 rounded-[var(--radius-card)] border border-border bg-bg/90 px-3 py-2.5 text-left shadow-lg backdrop-blur-sm">
                  <p className="font-display text-[0.8125rem] leading-tight text-ink">
                    {s.name}
                  </p>
                  <p className="mt-1 text-[0.6875rem] leading-snug text-ink-2">
                    {s.role}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section eyebrow title (top-left, display font) ──────── */
function SectionTitle({ children }: { children: string }) {
  return (
    <p className="mb-1 w-full text-center font-display text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-ink-2">
      {children}
    </p>
  );
}

/* ── Vertical connector: dotted line + downward arrow ────── */
function Connector({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 20 76"
      fill="none"
      className="mx-auto my-1 h-[4.75rem] w-5 text-accent/50"
      aria-hidden
    >
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <line
        x1="10"
        y1="2"
        x2="10"
        y2="62"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="4 8"
        markerEnd={`url(#${id})`}
        className="motion-safe:animate-dash"
      />
    </svg>
  );
}

/* ── Cycling connectors around the four nodes ────────────── */
function RingArcs() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className="absolute inset-0 z-0 h-full w-full text-accent/40"
      aria-hidden
    >
      {[
        "M56,22 Q74,26 78,44", // top → right
        "M78,56 Q74,74 56,78", // right → bottom
        "M44,78 Q26,74 22,56", // bottom → left
        "M22,44 Q26,26 44,22", // left → top
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="3 6"
          className="motion-safe:animate-dash"
        />
      ))}
    </svg>
  );
}

/* ── A single robot character ────────────────────────────── */
function Robot({
  kind,
  dim,
}: {
  kind: AnyKind;
  dim?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 72 86"
      fill="none"
      className={cn(
        "transition-all duration-300",
        ROBOT_SIZE,
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

function Emblem({ kind }: { kind: AnyKind }) {
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
    case "fii":
      // building
      return (
        <>
          <rect x="29" y="62" width="14" height="14" {...common} />
          <line x1="36" y1="62" x2="36" y2="76" {...common} />
          <line x1="29" y1="69" x2="43" y2="69" {...common} />
        </>
      );
    case "cripto":
      // coin
      return (
        <>
          <circle cx="36" cy="69" r="6.5" {...common} />
          <line x1="36" y1="64" x2="36" y2="74" {...common} />
        </>
      );
    case "global":
      // globe
      return (
        <>
          <circle cx="36" cy="69" r="6.5" {...common} />
          <line x1="29.5" y1="69" x2="42.5" y2="69" {...common} />
          <path d="M36 62.5 Q31 69 36 75.5 Q41 69 36 62.5" {...common} />
        </>
      );
    case "professor":
      // graduation cap
      return (
        <>
          <path d="M36 63 L46 67 L36 71 L26 67 Z" {...common} />
          <path d="M43 68.5 L43 73" {...common} />
        </>
      );
  }
}
