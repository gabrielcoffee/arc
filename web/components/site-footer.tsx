import Link from "next/link";
import { Wordmark } from "@/components/arc-mark";
import { Disclaimer } from "@/components/disclaimer";

const COLS = [
  {
    title: "Produto",
    links: [
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/planos", label: "Planos" },
      { href: "/exemplo", label: "Carta de exemplo" },
    ],
  },
  {
    title: "Transparência",
    links: [
      { href: "/metodologia", label: "Metodologia" },
      { href: "/sobre", label: "Sobre" },
    ],
  },
  {
    title: "Conta",
    links: [{ href: "/app", label: "Entrar" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-[2] mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-ink-2">
              Um comitê de agentes de AI que pesquisa, debate e aprende com os
              próprios erros — toda semana.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-ink-3">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-2 transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Disclaimer />
        </div>

        <p className="mt-8 text-2xs text-ink-3">
          © {new Date().getFullYear()} ARC. Conteúdo educacional. Não é
          recomendação de investimento.
        </p>
      </div>
    </footer>
  );
}
