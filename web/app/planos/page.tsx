import type { Metadata } from "next";
import { Disclaimer } from "@/components/disclaimer";
import { PlanPicker } from "@/components/planos/plan-picker";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Monte sua própria gestora. Plano Carta R$37, Plano Gestora R$67, ou personalize cada report. Conteúdo educacional, sem promessa de retorno.",
};

const FAQ = [
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Sem fidelidade e sem multa — a assinatura é mensal e você cancela quando quiser.",
  },
  {
    q: "Qual a diferença entre Carta e Gestora?",
    a: "A Carta entrega o cenário semanal (carta e aprofundamento). A Gestora adiciona a Carteira ARC mensal e os Rankings Top-20 — para quem quer alocar com base na recomendação.",
  },
  {
    q: "O que é a Carteira ARC?",
    a: "Um portfólio ilustrativo, estilo barbell, com peso-alvo por ativo e três opiniões por posição (economista, fundamentalista e técnico). É raciocínio de cenário, nunca ordem de compra.",
  },
  {
    q: "Vocês prometem retorno?",
    a: "Não. O ARC produz análise e cenário educacionais sob a Res. CVM 20/2021. Nenhuma rentabilidade é prometida; toda decisão é sua.",
  },
];

export default function PlanosPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-24">
      <header className="max-w-2xl">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.04] tracking-[-0.015em] text-ink">
          Monte sua própria gestora.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-2">
          Escolha um plano ou personalize cada report. Pague pelo que usa — com
          o desconto do bundle quando faz sentido.
        </p>
      </header>

      <div className="mt-16">
        <PlanPicker />
      </div>

      {/* FAQ */}
      <section className="mt-24">
        <h2 className="font-display text-2xl leading-snug text-ink">
          Perguntas frequentes
        </h2>
        <div className="mt-10 divide-y divide-border border-t border-border">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="grid gap-3 py-7 md:grid-cols-[0.9fr_1.1fr]"
            >
              <h3 className="font-display text-xl leading-snug text-ink">
                {item.q}
              </h3>
              <p className="leading-relaxed text-ink-2">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <Disclaimer />
      </div>
    </div>
  );
}
