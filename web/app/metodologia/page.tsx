import type { Metadata } from "next";
import { SectionLabel } from "@/components/section-label";
import { Disclaimer } from "@/components/disclaimer";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Metodologia",
  description:
    "Transparência radical: os princípios, o que o sistema usa e por quê, o que ele não faz, como medimos calibração e os limites honestos.",
};

const PRINCIPLES = [
  {
    t: "Regime, não market timing",
    d: "O foco é identificar o regime macro — juros, câmbio, fiscal — e inclinar a alocação dentro de bandas. Não tentamos prever o preço de amanhã. Timing como estratégia principal não funciona, e a evidência é clara.",
  },
  {
    t: "Valor + qualidade, sempre juntos",
    d: "Nenhum ativo entra por um fator só. Fama-French, Novy-Marx e o QMJ mostram que valor e qualidade combinados resistem melhor. No Brasil, o prêmio de tamanho é negativo — não destacamos algo só por ser small cap.",
  },
  {
    t: "Câmbio é driver co-principal",
    d: "O Ibovespa é mais sensível a choque cambial do que à Selic. Tratamos o BRL/USD com o mesmo peso dos juros, não como nota de rodapé.",
  },
  {
    t: "Juro real, nunca nominal",
    d: "A régua de comparação com a bolsa é o juro real ex-ante contra o earnings yield — jamais o juro nominal. É a separação que a maioria do varejo ignora.",
  },
];

const NOTDO = [
  "Sem promessa de retorno — em nenhum material.",
  "Sem alavancagem, sem day trade, sem operação vendida.",
  "Sem 'compre X agora' — ativos são ilustração de cenário.",
  "Sem screen de dividend yield isolado como tese.",
  "Sem rotular evidência como forte sem fonte primária.",
];

export default function MetodologiaPage() {
  return (
    <div className="mx-auto max-w-[860px] px-6 py-16 sm:py-24">
      <header>
        <SectionLabel number="01">Metodologia</SectionLabel>
        <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.015em] text-ink">
          Transparência radical.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-2">
          Você quer saber como o sistema funciona antes de confiar nele. Esta
          página responde isso — incluindo onde ele é fraco. A honestidade é o
          produto.
        </p>
      </header>

      <section className="mt-16">
        <SectionLabel number="02">Princípios</SectionLabel>
        <div className="mt-8 space-y-8">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.t} delay={i * 60}>
              <div className="border-t border-border pt-6">
                <h2 className="font-serif text-2xl leading-snug text-ink">
                  {p.t}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-2">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionLabel number="03">O que o sistema não faz</SectionLabel>
        <ul className="mt-8 space-y-3">
          {NOTDO.map((n) => (
            <li key={n} className="flex items-start gap-3 leading-relaxed text-ink">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-neg" />
              {n}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <SectionLabel number="04">Como medimos se estamos calibrados</SectionLabel>
        <p className="mt-8 leading-relaxed text-ink-2">
          Cada stance vira uma probabilidade implícita. Meses depois, comparamos
          com o que de fato aconteceu usando o{" "}
          <strong className="font-medium text-ink">Brier score</strong> (erro
          médio das previsões) e o{" "}
          <strong className="font-medium text-ink">ECE</strong> (quão bem a
          confiança declarada bate com o acerto real). Se o sistema diz “70% de
          chance” em dez ocasiões, deveria acertar cerca de sete. Não buscamos o
          que “subiu” — buscamos previsões honestamente calibradas.
        </p>
      </section>

      <section className="mt-16">
        <SectionLabel number="05">Limitações honestas</SectionLabel>
        <p className="mt-8 leading-relaxed text-ink-2">
          A amostra ainda é pequena — o ground truth de finanças chega com
          atraso de semanas a meses, então a calibração amadurece devagar. Não
          há, por enquanto, métricas quantitativas de risco de carteira (VaR,
          correlação, stress) nem benchmark formal de performance. Estamos
          construindo isso à vista, e o histórico aparece aqui quando for real —
          não antes.
        </p>
      </section>

      <div className="mt-16">
        <Disclaimer />
      </div>
    </div>
  );
}
