"use client";

import { useMemo, useState } from "react";
import { Check, Sparkles, ArrowRight, Crown } from "lucide-react";
import { cn, brl } from "@/lib/utils";
import {
  PLANS,
  REPORTS,
  reportById,
  evaluateSelection,
  type PlanId,
  type ReportId,
} from "@/lib/plans";
import { REPORT_ICON } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";

/* Cor por plano: inicial branco/cinza · meio amarelo (accent) · último premium (violeta) */
const PLAN_THEME: Record<
  PlanId,
  { icon: string; card: string; btnVariant: "primary" | "secondary"; btnClass: string }
> = {
  carta: {
    icon: "text-ink-2",
    card: "border-border",
    btnVariant: "secondary",
    btnClass: "",
  },
  gestora: {
    icon: "text-accent",
    card: "border-accent shadow-[0_12px_50px_rgba(234,179,8,0.12)]",
    btnVariant: "primary",
    btnClass: "",
  },
  gestora_plus: {
    icon: "text-[#a78bfa]",
    card: "border-[#8b5cf6]/50 shadow-[0_12px_50px_rgba(139,92,246,0.14)]",
    btnVariant: "primary",
    btnClass:
      "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-[0_2px_16px_rgba(139,92,246,0.28)]",
  },
};

export function PlanPicker() {
  return (
    <div className="space-y-16">
      <FixedPlans />
      <Customizer />
    </div>
  );
}

/* ── Três planos ─────────────────────────────────────────── */
function FixedPlans() {
  return (
    <div className="mx-auto grid max-w-[1080px] gap-6 sm:grid-cols-3 sm:items-stretch">
      {PLANS.map((plan) => {
        const t = PLAN_THEME[plan.id];
        return (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-[var(--radius-card)] border bg-surface p-7",
              t.card,
            )}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-on-accent">
                <Sparkles className="h-3 w-3" />
                Mais escolhido
              </span>
            )}
            {plan.id === "gestora_plus" && (
              <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full bg-[#8b5cf6] px-3 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-white">
                <Crown className="h-3 w-3" />
                Premium
              </span>
            )}

            <h3 className="font-display text-2xl text-ink">{plan.name}</h3>
            <p className="mt-1 text-sm text-ink-2">{plan.tagline}</p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-[3rem] leading-none text-ink">
                {brl(plan.price)}
              </span>
              <span className="text-sm text-ink-2">/mês</span>
            </div>

            <ul className="mt-7 space-y-3 border-t border-border pt-7">
              {plan.includes.map((id) => {
                const r = reportById(id);
                const Icon = REPORT_ICON[id];
                return (
                  <li key={id} className="flex items-start gap-2.5 text-sm">
                    <Icon
                      className={cn(
                        "mt-0.5 h-[1.05rem] w-[1.05rem] shrink-0",
                        t.icon,
                      )}
                    />
                    <span className="text-ink">{r.name}</span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-7 flex-1 text-xs leading-relaxed text-ink-3">
              {plan.audience}
            </p>

            <ButtonLink
              href={`/app?plano=${plan.id}`}
              variant={t.btnVariant}
              className={cn("mt-7 w-full", t.btnClass)}
            >
              Começar
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        );
      })}
    </div>
  );
}

/* ── À-la-carte — monte do zero ──────────────────────────── */
function Customizer() {
  const [selected, setSelected] = useState<ReportId[]>([
    "carta",
    "aprofundamento",
  ]);

  const toggle = (id: ReportId) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const result = useMemo(() => evaluateSelection(selected), [selected]);

  const base = REPORTS.filter((r) => r.category === "base");
  const esp = REPORTS.filter((r) => r.category === "especialista");

  return (
    <div
      id="montar"
      className="scroll-mt-24 rounded-[var(--radius-card)] border border-border bg-surface"
    >
      <div className="border-b border-border p-7 sm:p-9">
        <p className="font-mono text-2xs uppercase tracking-[0.16em] text-accent">
          Monte do zero
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-tight text-ink">
          Prefere escolher cada report?
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-2">
          Selecione peça por peça. O total atualiza na hora. Quando sua seleção
          equivale a um plano, a gente avisa.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* seleção */}
        <div className="space-y-8 p-7 sm:p-9">
          <Group title="Reports base">
            {base.map((r) => (
              <ReportRow
                key={r.id}
                id={r.id}
                checked={selected.includes(r.id)}
                onToggle={toggle}
              />
            ))}
          </Group>
          <Group title="Especialistas">
            {esp.map((r) => (
              <ReportRow
                key={r.id}
                id={r.id}
                checked={selected.includes(r.id)}
                onToggle={toggle}
              />
            ))}
          </Group>
        </div>

        {/* resumo — sticky no desktop */}
        <div className="border-t border-border bg-subtle/40 p-7 sm:p-9 lg:border-l lg:border-t-0">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-2xs uppercase tracking-[0.14em] text-ink-2">
              Total personalizado
            </p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-mono text-[2.75rem] leading-none text-ink tabular-nums">
                {brl(result.total)}
              </span>
              <span className="text-sm text-ink-2">/mês</span>
            </div>

            {result.suggestion && (
              <div className="mt-4 rounded-[var(--radius-btn)] border border-accent/40 bg-accent-wash p-4">
                <p className="flex items-start gap-2 text-xs leading-relaxed text-ink">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span>
                    O <strong>{result.suggestion.plan.name}</strong> tem tudo
                    isso
                    {result.suggestion.extras.length > 0 && " e mais"} por{" "}
                    <strong>{brl(result.suggestion.bundlePrice)}</strong> —
                    economize {brl(result.suggestion.savings)}.
                  </span>
                </p>
                <ButtonLink
                  href={`/app?plano=${result.suggestion.plan.id}`}
                  size="sm"
                  className="mt-3 w-full"
                >
                  Trocar para {result.suggestion.plan.name}
                </ButtonLink>
              </div>
            )}

            <Button
              variant={result.suggestion ? "secondary" : "primary"}
              className="mt-4 w-full"
              disabled={selected.length === 0}
            >
              {selected.length === 0
                ? "Selecione ao menos 1 report"
                : "Assinar personalizado"}
            </Button>

            <p className="mt-4 text-2xs leading-relaxed text-ink-3">
              Pagamento em breve. Por enquanto, sua seleção fica salva ao criar
              conta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-4 font-mono text-2xs uppercase tracking-[0.14em] text-ink-3">
        {title}
      </p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function ReportRow({
  id,
  checked,
  onToggle,
}: {
  id: ReportId;
  checked: boolean;
  onToggle: (id: ReportId) => void;
}) {
  const r = reportById(id);
  const Icon = REPORT_ICON[id];
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={cn(
        "flex w-full items-center gap-4 rounded-[var(--radius-btn)] border p-3.5 text-left transition-all",
        checked
          ? "border-accent/50 bg-accent-wash"
          : "border-border bg-surface hover:border-ink-3",
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
          checked ? "border-accent bg-accent text-on-accent" : "border-ink-3",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <Icon className="h-5 w-5 shrink-0 text-accent" />
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm text-ink">{r.name}</span>
          <span className="font-mono text-2xs text-ink-3">{r.cadence}</span>
        </span>
        <span className="mt-0.5 block text-xs text-ink-2">{r.blurb}</span>
      </span>
      <span className="shrink-0 font-mono text-sm text-ink">{brl(r.price)}</span>
    </button>
  );
}
