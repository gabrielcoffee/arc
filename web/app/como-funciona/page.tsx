import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Disclaimer } from "@/components/disclaimer";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Como funciona",
  description:
    "O comitê de agentes de AI, o pipeline de execução, as fontes de dados determinísticas e o loop de auto-melhoria — sem jargão.",
};

const COMMITTEE = [
  {
    role: "Economista-Chefe",
    model: "Sonnet 4.6",
    mandate: "Identifica o regime macro e a inclinação de alocação entre classes.",
    sources: "BCB, IBGE, FGV, Tesouro, B3 (fontes primárias).",
  },
  {
    role: "Fundamentalista",
    model: "Sonnet 4.6",
    mandate: "Seleciona ativos ilustrativos por valor + qualidade.",
    sources: "Universo B3 ranqueado, Fundamentus, StatusInvest, CVM.",
  },
  {
    role: "Analista Técnico",
    model: "Sonnet 4.6",
    mandate: "Contextualiza o momento — tendência e níveis, nunca day trade.",
    sources: "OHLCV real (yfinance): EMA, RSI, MACD, pivôs, volume.",
  },
  {
    role: "Editor-Chefe",
    model: "Opus 4.8",
    mandate: "Simula o debate, confronta divergências e escreve a carta.",
    sources: "Os três relatórios + web search só para o Radar.",
  },
];

const POST = [
  { role: "Gestor", desc: "Monta a Carteira ARC e os rankings Top-20. Rebalance mensal, bandas rígidas." },
  { role: "Professor", desc: "Escolhe um tema recente e ensina do zero — o aprofundamento." },
  { role: "Crítico", desc: "Avalia o processo de cada agente e propõe lições (gate manual)." },
  { role: "Arquivista", desc: "Organiza o anexo técnico auditável do dossiê." },
  { role: "Especialistas", desc: "FII, Cripto e Global — deep-dives opcionais com sub-carteira." },
];

const DATA = [
  { src: "BCB", what: "Selic, IPCA, USD/BRL PTAX e Focus — direto das APIs públicas." },
  { src: "yfinance", what: "OHLCV ~1 ano, com indicadores calculados em código." },
  { src: "brapi", what: "Universo B3 ranqueado por valor + qualidade." },
  { src: "Web search", what: "Restrito a fontes primárias, para contexto e verificação." },
];

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
      <header className="max-w-2xl">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.04] tracking-[-0.015em] text-ink">
          Um comitê que pesquisa, debate e aprende.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-2">
          Antes de qualquer agente rodar, o sistema carrega dados de fonte
          primária. Depois o comitê trabalha em sequência; o pós-comitê, em
          paralelo. Nada de número inventado.
        </p>
      </header>

      {/* Committee */}
      <section className="mt-20">
        <h2 className="font-display text-2xl leading-snug text-ink">
          O comitê (sequencial)
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {COMMITTEE.map((a, i) => (
            <Reveal key={a.role} delay={i * 70}>
              <Card interactive className="h-full">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl text-ink">{a.role}</h3>
                  <span className="font-mono text-2xs uppercase tracking-[0.1em] text-accent">
                    {a.model}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {a.mandate}
                </p>
                <p className="mt-4 border-t border-border pt-4 font-mono text-2xs leading-relaxed text-ink-3">
                  {a.sources}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Post-committee */}
      <section className="mt-20">
        <h2 className="font-display text-2xl leading-snug text-ink">
          O pós-comitê (paralelo)
        </h2>
        <p className="mt-6 max-w-xl leading-relaxed text-ink-2">
          Best-effort e concorrente — uma falha em qualquer etapa não cancela o
          run. A calibração roda depois, lendo os scores do crítico.
        </p>
        <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {POST.map((p, i) => (
            <Reveal key={p.role} delay={i * 50}>
              <div className="border-t border-border pt-4">
                <h3 className="font-mono text-sm text-ink">{p.role}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Data grounding */}
      <section className="mt-20 rounded-[var(--radius-card)] border border-border bg-surface/50 p-8 sm:p-10">
        <h2 className="max-w-xl font-display text-2xl leading-snug text-ink">
          Grounding determinístico — a defesa contra alucinação.
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {DATA.map((d) => (
            <div key={d.src} className="flex gap-4">
              <span className="font-mono text-sm text-accent">{d.src}</span>
              <p className="flex-1 text-sm leading-relaxed text-ink-2">
                {d.what}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Self-improvement */}
      <section className="mt-20">
        <h2 className="font-display text-2xl leading-snug text-ink">
          O loop de auto-melhoria
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { t: "Injeção de lições", d: "Cada agente começa o run lendo as lições aprovadas dos runs anteriores." },
            { t: "Crítica", d: "Um crítico avalia cada agente por rubrica e propõe novas lições — promovidas só com revisão humana." },
            { t: "Calibração", d: "Brier score e ECE medem se as previsões batem com a realidade ao longo do tempo." },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 80}>
              <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
                <h3 className="font-display text-xl text-ink">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mt-20">
        <Disclaimer />
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <ButtonLink href="/exemplo" variant="secondary">
          Ler uma carta de exemplo
        </ButtonLink>
        <ButtonLink href="/planos">
          Ver planos
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
