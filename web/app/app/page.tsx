import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Sua conta",
};

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string }>;
}) {
  const { plano } = await searchParams;
  const plan = PLANS.find((p) => p.id === plano);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col justify-center px-6 py-24">
      <p className="font-mono text-2xs uppercase tracking-[0.18em] text-ink-3">
        Dashboard · em breve
      </p>
      <h1 className="mt-6 font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-tight tracking-[-0.015em] text-ink">
        {plan ? `${plan.name} selecionado.` : "Sua conta ARC."}
      </h1>
      <p className="mt-5 leading-relaxed text-ink-2">
        {plan
          ? `Boa escolha — o ${plan.name} por ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
            }).format(plan.price)}/mês. `
          : ""}
        O acesso à carta, à Carteira ARC e aos rankings chega na próxima fase. O
        cadastro e o pagamento estão a caminho — por enquanto, a seleção fica
        registrada.
      </p>
      <div className="mt-9 flex flex-wrap gap-4">
        <ButtonLink href="/exemplo" variant="secondary">
          Ler uma carta enquanto isso
        </ButtonLink>
        <ButtonLink href="/planos" variant="ghost">
          Voltar aos planos
        </ButtonLink>
      </div>
    </div>
  );
}
