import type { Metadata } from "next";
import { Disclaimer } from "@/components/disclaimer";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O ARC é uma plataforma de research de mercado para o investidor pessoa física, construída sobre honestidade e transparência.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 sm:py-24">
      <h1 className="font-display text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.05] tracking-[-0.015em] text-ink">
        Research que respeita sua inteligência.
      </h1>

      <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-2">
        <p>
          O ARC nasceu de uma frustração simples: o research de varejo brasileiro
          vende emoção e promessa, raramente método. A gente foi pelo caminho
          oposto — um comitê de agentes de AI especializados que pesquisa nas
          fontes primárias, debate as próprias divergências e admite quando pode
          estar errado.
        </p>
        <p>
          Toda semana, esse comitê entrega uma carta de mercado em linguagem
          acessível e, todo mês, uma carteira ilustrativa com peso-alvo por
          ativo. Sem tecniquês desnecessário, sem guru, sem “fórmula secreta”.
        </p>
        <p>
          O diferencial não é prometer que você vai ficar rico. É mostrar o
          raciocínio inteiro — incluindo o advogado do diabo e o pré-mortem — e
          deixar a decisão com quem ela sempre foi: você.
        </p>
      </div>

      <div className="mt-12">
        <Disclaimer />
      </div>

      <div className="mt-10">
        <ButtonLink href="/planos">
          Ver planos
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
