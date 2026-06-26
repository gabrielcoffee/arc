import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/section-label";
import { Reveal } from "@/components/reveal";
import { CommitteePipeline } from "@/components/home/committee-pipeline";
import { Deliverables } from "@/components/home/deliverables";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "O Economista-Chefe lê o mundo",
    body: "Todo run começa pela macro. Juros, câmbio, fiscal, cenário global — buscados nas fontes primárias (BCB, IBGE, FGV) e usados para identificar o regime.",
  },
  {
    n: "02",
    title: "O Fundamentalista escolhe os ativos",
    body: "Com o cenário em mãos, seleciona ativos ilustrativos — ações, FIIs, ETFs, renda fixa — por valor + qualidade. Nenhum ativo entra só por ser famoso.",
  },
  {
    n: "03",
    title: "O Técnico confirma o momento",
    body: "EMA20, EMA50, RSI, MACD — calculados com dados reais de OHLCV, nunca estimados. Contextualiza o momento de cada ativo sem inventar cotação.",
  },
  {
    n: "04",
    title: "O Editor-Chefe sintetiza e debate",
    body: "Recebe os três relatórios, confronta divergências, faz o papel de advogado do diabo — e escreve a carta em duas camadas: pública e anexo técnico.",
  },
  {
    n: "05",
    title: "O sistema aprende com os próprios erros",
    body: "Após cada carta, um crítico de AI avalia o processo de cada agente. As lições viram memória — e o próximo run começa melhor.",
  },
];

const METRICS = [
  { value: "4", label: "agentes especializados" },
  { value: "Semanal", label: "carta + carteira mensal" },
  { value: "Brier", label: "calibração verificável" },
  { value: "0", label: "alucinações de preço" },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div data-reveal>
            <SectionLabel number="00" className="mb-7">
              Research de mercado, por um comitê de AI
            </SectionLabel>
            <h1 className="font-serif text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.015em] text-ink">
              Seu comitê de
              <br />
              analistas.
              <br />
              <span className="text-accent">Funciona toda semana.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-2">
              Quatro agentes de AI especializados pesquisam, debatem e entregam
              uma carta de mercado e uma carteira recomendada — toda semana, sem
              exceção.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href="/planos">
                Ver planos
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/exemplo" variant="ghost">
                Ler uma carta de exemplo →
              </ButtonLink>
            </div>
          </div>

          <div
            data-reveal
            style={{ ["--reveal-delay" as string]: "140ms" }}
            className="lg:pl-4"
          >
            <CommitteePipeline />
          </div>
        </div>
      </section>

      {/* ── Como funciona ────────────────────────────────── */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <Reveal>
            <SectionLabel number="01">Como funciona</SectionLabel>
            <h2 className="mt-6 max-w-2xl font-serif text-[clamp(2rem,4vw,2.75rem)] leading-tight tracking-[-0.01em] text-ink">
              Cinco passos, em ordem. Cada um alimenta o próximo.
            </h2>
          </Reveal>

          <div className="mt-16 divide-y divide-border border-t border-border">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 70}>
                <div className="grid gap-6 py-9 md:grid-cols-[80px_1fr_1.1fr] md:items-baseline">
                  <span className="font-mono text-sm text-accent">
                    {step.n}
                  </span>
                  <h3 className="font-serif text-2xl leading-snug text-ink">
                    {step.title}
                  </h3>
                  <p className="max-w-xl leading-relaxed text-ink-2">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── O que você recebe ────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <Reveal>
          <SectionLabel number="02">O que você recebe</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-serif text-[clamp(2rem,4vw,2.75rem)] leading-tight tracking-[-0.01em] text-ink">
            Entregáveis reais — não promessas.
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-2">
            Cada peça tem público e propósito. Veja um preview do que sai a cada
            run.
          </p>
        </Reveal>
        <Reveal delay={120} className="mt-12">
          <Deliverables />
        </Reveal>
      </section>

      {/* ── Prova social ─────────────────────────────────── */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m, i) => (
              <Reveal key={m.label} delay={i * 80}>
                <div>
                  <p className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] leading-none text-ink">
                    {m.value}
                  </p>
                  <p className="mt-3 font-mono text-2xs uppercase tracking-[0.12em] text-ink-2">
                    {m.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 max-w-xl text-xs leading-relaxed text-ink-3">
              Métricas do processo, não promessa de retorno. O histórico de
              performance da carteira aparece aqui assim que amadurecer — medido
              contra CDI e Ibovespa, com honestidade.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-tight tracking-[-0.01em] text-ink">
            Comece com a Carta.
            <br />
            Expanda quando quiser.
          </h2>
          <p className="mt-5 text-lg text-ink-2">
            Cancele a qualquer momento. Sem fidelidade.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/planos">
              Ver planos
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/exemplo" variant="secondary">
              Ler uma carta de exemplo
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
