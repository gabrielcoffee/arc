import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Markdown } from "@/components/markdown";
import { SectionLabel } from "@/components/section-label";
import { ButtonLink } from "@/components/ui/button";
import { Disclaimer } from "@/components/disclaimer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Carta de exemplo",
  description:
    "Uma carta semanal real do ARC, publicada na íntegra. O melhor argumento de venda é o produto em si.",
};

function loadCarta(): string {
  const raw = readFileSync(
    join(process.cwd(), "content", "carta-exemplo.md"),
    "utf8",
  );
  // The pipeline already wraps the letter in a leading + trailing CVM disclaimer.
  // We render our own styled disclaimer, so drop the inline duplicates.
  return raw
    .split("\n")
    .filter((line) => !line.startsWith("**AVISO IMPORTANTE"))
    .join("\n")
    .trim();
}

export default function ExemploPage() {
  const carta = loadCarta();

  return (
    <div className="mx-auto max-w-[760px] px-6 py-16 sm:py-24">
      <header>
        <SectionLabel number="—">Carta de exemplo · pública</SectionLabel>
        <p className="mt-6 text-sm leading-relaxed text-ink-2">
          Esta é uma carta semanal real, publicada na íntegra. Sem cadastro. O
          melhor argumento é o próprio produto.
        </p>
      </header>

      <Disclaimer variant="block" className="my-10" />

      <article>
        <Markdown>{carta}</Markdown>
      </article>

      {/* lead-magnet CTA */}
      <div className="mt-14 rounded-[var(--radius-card)] border border-accent/30 bg-accent-wash p-8 text-center">
        <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight text-ink">
          Receba a próxima toda semana.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-2">
          A carta sai a cada run, junto com a Carteira ARC, os rankings e o
          aprofundamento educativo.
        </p>
        <ButtonLink href="/planos" className="mt-6">
          Ver planos
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
