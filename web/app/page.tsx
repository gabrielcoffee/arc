import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { ParticlesBg } from "@/components/home/particles-bg";
import { AgentsCross } from "@/components/home/agents-cross";
import { Deliverables } from "@/components/home/deliverables";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <ParticlesBg className="absolute inset-0 z-0" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-16 pb-24 sm:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div data-reveal>
              <h1 className="font-display text-[clamp(2.75rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-ink">
                Seu comitê de
                <br />
                analistas de investimento.
              </h1>
              <p className="mt-5 text-accent font-medium text-[clamp(1.05rem,2vw,1.4rem)] leading-snug">
                Uma gestora formada por agentes de IA que pesquisa, debate e
                entrega relatórios de mercado.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <ButtonLink href="/planos">
                  Ver planos
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/exemplo" variant="ghost">
                  Ler relatórios de exemplo →
                </ButtonLink>
              </div>
            </div>

            <div
              data-reveal
              style={{ ["--reveal-delay" as string]: "140ms" }}
              className="lg:pl-4"
            >
              <AgentsCross />
            </div>
          </div>
        </div>
      </section>

      {/* ── O que você recebe ────────────────────────────── */}
      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight tracking-[-0.015em] text-ink">
              Entregáveis reais, não promessas.
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <Deliverables />
          </Reveal>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-tight tracking-[-0.015em] text-ink">
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
              Ler relatórios de exemplo
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
