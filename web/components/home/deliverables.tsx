"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StanceBadge } from "@/components/ui/stance-badge";
import { EconIndicator } from "@/components/econ-indicator";

type TabId = "carta" | "carteira" | "rankings" | "aprofundamento";

const TABS: { id: TabId; label: string; cadence: string }[] = [
  { id: "carta", label: "Carta Semanal", cadence: "Semanal" },
  { id: "carteira", label: "Carteira ARC", cadence: "Mensal" },
  { id: "rankings", label: "Rankings", cadence: "Mensal" },
  { id: "aprofundamento", label: "Aprofundamento", cadence: "Semanal" },
];

export function Deliverables() {
  const [tab, setTab] = useState<TabId>("carta");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs transition-all",
              tab === t.id
                ? "border-accent bg-accent-wash text-ink"
                : "border-border text-ink-2 hover:border-ink-3",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-border bg-subtle/50 px-5 py-3">
          <span className="font-mono text-2xs uppercase tracking-[0.14em] text-ink-2">
            preview · {TABS.find((t) => t.id === tab)?.label}
          </span>
          <span className="font-mono text-2xs text-ink-3">
            {TABS.find((t) => t.id === tab)?.cadence}
          </span>
        </div>
        <div className="p-6 sm:p-8">
          {tab === "carta" && <CartaPreview />}
          {tab === "carteira" && <CarteiraPreview />}
          {tab === "rankings" && <RankingsPreview />}
          {tab === "aprofundamento" && <AprofPreview />}
        </div>
      </div>
    </div>
  );
}

function CartaPreview() {
  return (
    <div>
      <p className="font-mono text-2xs uppercase tracking-[0.14em] text-accent">
        16 de junho de 2026
      </p>
      <h3 className="mt-2 font-display text-[1.75rem] leading-tight text-ink">
        Desinflação Fraturada, Ciclo de Afrouxamento Sob Risco
      </h3>
      <div className="mt-4 flex flex-wrap gap-2">
        <EconIndicator label="Selic" value="14,50%" source="BCB" />
        <EconIndicator label="IPCA 12m" value="4,72%" source="IBGE" />
        <EconIndicator label="USD/BRL" value="5,07" source="Focus" />
      </div>
      <p className="mt-5 text-base leading-relaxed text-ink-2">
        <span className="font-medium text-ink">Em 30 segundos —</span> juro real
        altíssimo é o personagem principal. Com a Selic a 14,50% e a inflação
        esperada perto de 4,1%, o carrego ronda os{" "}
        <span className="font-medium text-ink">10% ao ano</span> — o que torna a
        renda fixa estruturalmente atrativa frente à bolsa.
      </p>
    </div>
  );
}

const HOLDINGS = [
  { sleeve: "Renda Fixa BR", weight: 52, color: "var(--color-accent)" },
  { sleeve: "ETFs", weight: 12, color: "#7a93a8" },
  { sleeve: "Ações Brasil", weight: 13, color: "#2e7d52" },
  { sleeve: "Ações Globais", weight: 13, color: "#b08968" },
  { sleeve: "FIIs", weight: 8, color: "#c8a96e" },
  { sleeve: "Cripto", weight: 2, color: "#c0392b" },
];

function CarteiraPreview() {
  return (
    <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
      <div className="space-y-2">
        {HOLDINGS.map((h) => (
          <div key={h.sleeve} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ background: h.color }}
            />
            <span className="flex-1 text-xs text-ink-2">{h.sleeve}</span>
            <span className="font-mono text-xs text-ink">{h.weight}%</span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {HOLDINGS.map((h) => (
            <span
              key={h.sleeve}
              style={{ width: `${h.weight}%`, background: h.color }}
            />
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          Barbell core-satélite com tilt defensivo. Sobrepeso no lado seguro
          (RF pós-fixada + IPCA+), satélites de risco moderados, cripto marginal.
          Cada ativo vem com 3 opiniões — economista, fundamentalista e técnico.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-ink">LFT 2029</span>
          <StanceBadge stance="favorece" />
          <span className="ml-2 font-mono text-ink">HGLG11</span>
          <StanceBadge stance="cautela" />
        </div>
      </div>
    </div>
  );
}

const RANKS = [
  { n: 1, ticker: "ITUB4", why: "ROE 24,8% e P/L 8,6x — valor + qualidade raro." },
  { n: 2, ticker: "BBAS3", why: "Exposição agro/consignado defensiva, múltiplo descontado." },
  { n: 3, ticker: "BBSE3", why: "Seguradora beneficiada por juro alto no float." },
];

function RankingsPreview() {
  return (
    <div>
      <p className="mb-4 font-mono text-2xs uppercase tracking-[0.14em] text-ink-2">
        Top 20 · Ações Brasil
      </p>
      <ul className="space-y-3">
        {RANKS.map((r) => (
          <li key={r.ticker} className="flex gap-4">
            <span className="font-display text-2xl leading-none text-accent">
              {r.n}
            </span>
            <div>
              <span className="font-mono text-sm text-ink">{r.ticker}</span>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-2">
                {r.why}
              </p>
            </div>
          </li>
        ))}
        <li className="pl-10 text-xs text-ink-3">+ 17 nomes ranqueados…</li>
      </ul>
    </div>
  );
}

function AprofPreview() {
  return (
    <div>
      <p className="font-mono text-2xs uppercase tracking-[0.14em] text-accent">
        Aprofundamento da semana
      </p>
      <h3 className="mt-2 font-display text-[1.6rem] leading-tight text-ink">
        O juro nominal é o trailer. O juro real é o filme inteiro.
      </h3>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        João aplicou R$ 10.000 a 14,5% ao ano e comemorou os R$ 1.450. Mas a
        inflação comeu R$ 470 do poder de compra dele. O que sobrou de verdade —
        o juro <span className="italic">real</span> — conta a história inteira.
        Explicado do zero, com glossário, mitos × fatos e FAQ.
      </p>
    </div>
  );
}
