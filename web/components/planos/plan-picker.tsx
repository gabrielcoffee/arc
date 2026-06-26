"use client";

import { useMemo, useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { cn, brl } from "@/lib/utils";
import {
  PLANS,
  REPORTS,
  FLOOR,
  reportById,
  evaluateSelection,
  type ReportId,
} from "@/lib/plans";
import { REPORT_ICON } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";

export function PlanPicker() {
  const [selected, setSelected] = useState<ReportId[]>([
    "carta",
    "aprofundamento",
  ]);

  const toggle = (id: ReportId) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <div className="space-y-16">
      <FixedPlans />
      <AddOns selected={selected} onToggle={toggle} />
      <Customizer selected={selected} toggle={toggle} />
    </div>
  );
}

/* ── Fixed plans — two, centered ─────────────────────────── */
function FixedPlans() {
  return (
    <div className="mx-auto grid max-w-[760px] gap-6 sm:grid-cols-2 sm:items-start">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "relative flex flex-col rounded-[var(--radius-card)] border bg-surface p-7",
            plan.featured
              ? "border-accent shadow-[0_12px_50px_rgba(234,179,8,0.12)] sm:-mt-3 sm:mb-3"
              : "border-border",
          )}
        >
          {plan.featured && (
            <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-on-accent">
              <Sparkles className="h-3 w-3" />
              Mais escolhido
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
                  <Icon className="mt-0.5 h-[1.05rem] w-[1.05rem] shrink-0 text-accent" />
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
            variant={plan.featured ? "primary" : "secondary"}
            className="mt-7 w-full"
          >
            Começar
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      ))}
    </div>
  );
}

/* ── Add-ons, as buttons ─────────────────────────────────── */
function AddOns({
  selected,
  onToggle,
}: {
  selected: ReportId[];
  onToggle: (id: ReportId) => void;
}) {
  const esp = REPORTS.filter((r) => r.category === "especialista");
  return (
    <div>
      <p className="text-center font-mono text-2xs uppercase tracking-[0.16em] text-ink-3">
        Add-ons · disponíveis em qualquer plano
      </p>
      <div className="mx-auto mt-5 grid max-w-[760px] gap-3 sm:grid-cols-3">
        {esp.map((r) => {
          const Icon = REPORT_ICON[r.id];
          const on = selected.includes(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onToggle(r.id)}
              aria-pressed={on}
              className={cn(
                "group flex items-center gap-3 rounded-[var(--radius-btn)] border p-4 text-left transition-all",
                on
                  ? "border-accent bg-accent-wash"
                  : "border-border bg-surface hover:border-ink-3",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  on
                    ? "border-transparent bg-accent text-on-accent"
                    : "border-border text-accent",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-ink">{r.name}</span>
                <span className="block truncate font-mono text-2xs text-ink-3">
                  {on ? "selecionado" : "adicionar"}
                </span>
              </span>
              <span className="shrink-0 font-mono text-sm text-accent">
                +{brl(r.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Customizer ──────────────────────────────────────────── */
function Customizer({
  selected,
  toggle,
}: {
  selected: ReportId[];
  toggle: (id: ReportId) => void;
}) {
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
          Monte sua Gestora
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-tight text-ink">
          Prefere montar do zero?
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-2">
          Escolha cada peça. O total atualiza na hora. Quando sua seleção
          equivale a um plano, a gente avisa.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* selection */}
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
          <Group title="Especialistas (add-on)">
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

        {/* summary — sticky on desktop */}
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

            {result.flooredApplied && (
              <p className="mt-3 rounded-md bg-accent-wash px-3 py-2 text-xs leading-relaxed text-ink-2">
                Piso mínimo de {brl(FLOOR)} — o custo de produzir os reports é
                praticamente o mesmo para todos.
              </p>
            )}

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
