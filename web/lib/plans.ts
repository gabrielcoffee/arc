// Pricing — canonical source: produto_reports.md (status: pronto para implementação)
// All values in BRL/month.

export type ReportId =
  | "carta"
  | "aprofundamento"
  | "watchlist"
  | "carteira"
  | "rankings"
  | "esp_fii"
  | "esp_cripto"
  | "esp_global";

export type ReportCategory = "base" | "especialista";

export interface Report {
  id: ReportId;
  name: string;
  price: number;
  cadence: "Semanal" | "Mensal";
  category: ReportCategory;
  blurb: string;
}

export const REPORTS: Report[] = [
  {
    id: "carta",
    name: "Carta Semanal",
    price: 19,
    cadence: "Semanal",
    category: "base",
    blurb: "Macro + cenário + oportunidades em linguagem acessível.",
  },
  {
    id: "aprofundamento",
    name: "Aprofundamento Educativo",
    price: 12,
    cadence: "Semanal",
    category: "base",
    blurb: "O Professor explica um tema do mercado do zero.",
  },
  {
    id: "watchlist",
    name: "Watchlist Semanal",
    price: 12,
    cadence: "Semanal",
    category: "base",
    blurb: "3–5 ativos para monitorar, com gatilho e prazo.",
  },
  {
    id: "carteira",
    name: "Carteira ARC",
    price: 44,
    cadence: "Mensal",
    category: "base",
    blurb: "Portfólio recomendado, barbell, 3 opiniões por ativo.",
  },
  {
    id: "rankings",
    name: "Rankings Top-10",
    price: 19,
    cadence: "Mensal",
    category: "base",
    blurb: "Shortlists ranqueadas por categoria, com rationale.",
  },
  {
    id: "esp_fii",
    name: "Especialista FII",
    price: 29,
    cadence: "Mensal",
    category: "especialista",
    blurb: "P/VP, vacância, DY + Carteira de Dividendos.",
  },
  {
    id: "esp_cripto",
    name: "Especialista Cripto",
    price: 29,
    cadence: "Mensal",
    category: "especialista",
    blurb: "BTC, ETH e macro cripto — conservador, sem hype.",
  },
  {
    id: "esp_global",
    name: "Especialista Global",
    price: 29,
    cadence: "Mensal",
    category: "especialista",
    blurb: "Europa, China, emergentes + câmbio para o investidor BR.",
  },
];

export const FLOOR = 37; // "Monte sua Gestora" minimum

export interface Plan {
  id: "carta" | "gestora";
  name: string;
  price: number;
  tagline: string;
  audience: string;
  includes: ReportId[];
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "carta",
    name: "Plano Carta",
    price: 37,
    tagline: "Entenda o mercado toda semana.",
    audience:
      "Para quem quer entender o cenário antes de alocar com base na recomendação.",
    includes: ["carta", "aprofundamento", "watchlist"],
  },
  {
    id: "gestora",
    name: "Plano Gestora",
    price: 67,
    tagline: "Carta + a Carteira ARC, todo mês.",
    audience:
      "Para quem quer alocar com base na recomendação e acompanhar de forma estruturada.",
    includes: ["carta", "aprofundamento", "watchlist", "carteira", "rankings"],
    featured: true,
  },
];

export function reportById(id: ReportId): Report {
  const r = REPORTS.find((x) => x.id === id);
  if (!r) throw new Error(`Unknown report: ${id}`);
  return r;
}

export function listSum(ids: ReportId[]): number {
  return ids.reduce((acc, id) => acc + reportById(id).price, 0);
}

export interface CustomizerResult {
  rawTotal: number; // sum of à-la-carte prices
  total: number; // after applying the floor
  flooredApplied: boolean;
  /** A fixed plan whose contents are fully covered by the selection, if cheaper. */
  suggestion?: {
    plan: Plan;
    extras: ReportId[]; // selected items beyond the plan
    bundlePrice: number; // plan price + extras
    savings: number; // raw - bundlePrice
  };
}

/** Mirrors the customizer logic described in produto_reports.md §3. */
export function evaluateSelection(selected: ReportId[]): CustomizerResult {
  const rawTotal = listSum(selected);
  const total = Math.max(rawTotal, FLOOR);
  const set = new Set(selected);

  // Find the richest plan fully contained in the selection.
  const covered = PLANS.filter((p) => p.includes.every((id) => set.has(id))).sort(
    (a, b) => b.price - a.price,
  );

  let suggestion: CustomizerResult["suggestion"];
  const plan = covered[0];
  if (plan) {
    const extras = selected.filter((id) => !plan.includes.includes(id));
    const bundlePrice = plan.price + listSum(extras);
    const savings = rawTotal - bundlePrice;
    if (savings > 0) suggestion = { plan, extras, bundlePrice, savings };
  }

  return {
    rawTotal,
    total,
    flooredApplied: rawTotal < FLOOR && selected.length > 0,
    suggestion,
  };
}

export const DISCLAIMER =
  "Conteúdo educacional e de cenário — não constitui recomendação de investimento ou oferta de valores mobiliários (Res. CVM 20/2021). Os ativos mencionados são ilustrativos do raciocínio de cenário. Consulte um profissional habilitado antes de investir.";
