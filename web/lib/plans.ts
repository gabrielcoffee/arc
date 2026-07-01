// Pricing — canonical source: produto_reports.md (status: pronto para implementação)
// All values in BRL/month.

export type ReportId =
  | "carta"
  | "aprofundamento"
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
    id: "carteira",
    name: "Carteira ARC",
    price: 44,
    cadence: "Mensal",
    category: "base",
    blurb: "Portfólio recomendado, barbell, 3 opiniões por ativo.",
  },
  {
    id: "rankings",
    name: "Rankings Top-20",
    price: 19,
    cadence: "Mensal",
    category: "base",
    blurb: "Shortlists Top-20 ranqueadas por categoria, com rationale.",
  },
  {
    id: "esp_fii",
    name: "Especialista FII",
    price: 19,
    cadence: "Mensal",
    category: "especialista",
    blurb: "P/VP, vacância, DY + Carteira de Dividendos.",
  },
  {
    id: "esp_cripto",
    name: "Especialista Cripto",
    price: 19,
    cadence: "Mensal",
    category: "especialista",
    blurb: "BTC, ETH e macro cripto — conservador, sem hype.",
  },
  {
    id: "esp_global",
    name: "Especialista Global",
    price: 19,
    cadence: "Mensal",
    category: "especialista",
    blurb: "Europa, China, emergentes + câmbio para o investidor BR.",
  },
];

/** Ids dos especialistas (usados no à-la-carte). */
export const ESPECIALISTAS: ReportId[] = ["esp_fii", "esp_cripto", "esp_global"];

export type PlanId = "carta" | "gestora" | "gestora_plus";

export interface Plan {
  id: PlanId;
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
    name: "Carta",
    price: 19,
    tagline: "Entenda o mercado toda semana.",
    audience:
      "Para quem quer acompanhar o cenário antes de decidir onde alocar.",
    includes: ["carta", "aprofundamento"],
  },
  {
    id: "gestora",
    name: "Gestora",
    price: 59,
    tagline: "O cenário + a Carteira ARC e os Rankings.",
    audience:
      "Para quem quer alocar seguindo a recomendação, de forma estruturada.",
    includes: ["carta", "aprofundamento", "carteira", "rankings"],
    featured: true,
  },
  {
    id: "gestora_plus",
    name: "Gestora+",
    price: 99,
    tagline: "Tudo, mais os três especialistas.",
    audience:
      "Para quem investe também em FIIs, cripto e mercados globais.",
    includes: [
      "carta",
      "aprofundamento",
      "carteira",
      "rankings",
      "esp_fii",
      "esp_cripto",
      "esp_global",
    ],
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
  total: number; // soma à-la-carte da seleção
  /** Plano cuja lista está inteiramente contida na seleção e sai mais barato. */
  suggestion?: {
    plan: Plan;
    extras: ReportId[]; // itens selecionados além do plano
    bundlePrice: number; // preço do plano + extras
    savings: number; // à-la-carte − bundle
  };
}

/** À-la-carte: soma a seleção e sugere o plano que a cobre mais barato. */
export function evaluateSelection(selected: ReportId[]): CustomizerResult {
  const total = listSum(selected);
  const set = new Set(selected);

  const covered = PLANS.filter((p) =>
    p.includes.every((id) => set.has(id)),
  ).sort((a, b) => b.price - a.price);

  let suggestion: CustomizerResult["suggestion"];
  const plan = covered[0];
  if (plan) {
    const extras = selected.filter((id) => !plan.includes.includes(id));
    const bundlePrice = plan.price + listSum(extras);
    const savings = total - bundlePrice;
    if (savings > 0) suggestion = { plan, extras, bundlePrice, savings };
  }

  return { total, suggestion };
}

export const DISCLAIMER =
  "Conteúdo educacional e de cenário — não constitui recomendação de investimento ou oferta de valores mobiliários (Res. CVM 20/2021). Os ativos mencionados são ilustrativos do raciocínio de cenário. Consulte um profissional habilitado antes de investir.";
