# ARC Website — PLAN.md

Working plan + context for the ARC website build. Read this first when resuming.

---

## Context

- **ARC** = multi-agent AI research product for Brazilian retail investors. Weekly
  market letter + monthly recommended portfolio, produced by a committee of AI agents
  (Economista → Fundamentalista → Técnico → Editor-Chefe) + post-committee agents.
- This repo (`/Users/gabrielpereira/Desktop/finagents`) holds **design/spec docs** (pt-BR
  markdown) + `samples/` (real outputs) + **`web/`** (the website we are building).
- The ARC **pipeline/backend code lives elsewhere** — not in this repo.
- Authoritative design source: **`design_brief.md`**. Pricing source: **`produto_reports.md`**.

## Decisions locked (do not relitigate)

| Topic | Decision |
|---|---|
| Scope | Full platform, built in phases. |
| Stack | Next.js 16 (App Router, Turbopack) + Tailwind v4 + TS + `@supabase/ssr`. |
| DB/Auth | Supabase. No custom backend yet (browser ↔ Supabase, RLS for gating). |
| Pricing | `produto_reports.md`: Carta **R$37**, Gestora **R$67** ⭐, add-ons **R$29** each, customizer floor **R$37**. |
| Data model | **Hybrid** — prose reports as markdown text; portfolio + rankings as structured rows. |
| Payments | **Deferred.** Plan selection only → store on profile. Stripe/Mercado Pago later (needs webhook backend). |
| Dashboard data | Seed Supabase from `samples/CARTA.md` + `samples/CARTEIRA.md`. |
| Aesthetic | Dia Browser × The Economist × Linear. Light mode primary, warm `#FAFAF8`, single amber `#A07A3E`, Instrument Serif + Geist + Geist Mono. |

## Open decisions (need user input)

- [ ] **Branding: "ARC" vs "Carteira Horizonte".** Brief says ARC; sample output says Horizonte. Currently site = ARC.
- [ ] **Persona/voice.** Site is product-first now. Commercial audit (`analise_comercial_produto.md`) says add a human face/voice. Decide or defer.
- [ ] Real pricing confirmation before any payment phase.

---

## Status

### ✅ Phase 1 — Marketing site (DONE)
Built in `web/`. Build clean, lint clean, all routes 200.
- Pages: `/`, `/planos` (+ interactive customizer), `/exemplo` (renders sample carta),
  `/como-funciona`, `/metodologia`, `/sobre`, `/app` (stub).
- Design system in `web/app/globals.css` (Tailwind v4 `@theme` tokens).
- CVM disclaimer component visible on every relevant page.

---

## ▶ CURRENT PRIORITY — Phase 1.5: Design, structure & data refinement (BEFORE auth)

Goal: get the look, page structure, and the *shape of the data* right while everything is
still static/seedable — no login required.

### Design fine-tuning
- [ ] Run `cd web && npm run dev`, review every page; capture polish notes.
- [ ] Tighten spacing rhythm, type scale, hero balance vs `design_brief.md`.
- [ ] Hero committee-pipeline animation: pacing, reduced-motion.
- [ ] Dark mode (opt-in) — tokens exist conceptually; add `.dark` + toggle if wanted.
- [ ] Responsive/mobile pass on all pages (nav, customizer summary, donut).
- [ ] Optional: real product screenshots/mockups instead of inline previews.
- [ ] Resolve branding (ARC/Horizonte) — global copy swap if needed.

### Structure
- [ ] Confirm final page set + nav IA. Add `/sobre` to nav? Footer-only now.
- [ ] Decide if dashboard preview (`/app`) gets a public read-only demo mode.
- [ ] Define routes for Phase 3 dashboard sections.

### Data modeling (do this now — it unblocks everything later)
- [ ] Design the **hybrid Supabase schema** as types/SQL, even before wiring:
  - `reports(id, type, run_date, title, regime, body_md, indicators jsonb)`
      — types: carta, aprofundamento, watchlist.
  - `portfolio_versions(id, as_of, strategy_md)`.
  - `holdings(version_id, ticker, asset_class, target_weight, entry_price, what_is,
      rationale_md, opinions jsonb, stance)`.
  - `rankings(category, rank, ticker, rationale)`.
  - `sleeves(version_id, asset_class, weight, band_low, band_high, role)`.
- [ ] Write a **seed script** that parses `samples/CARTA.md` + `CARTEIRA.md` into the above.
  - NOTE: sample portfolio = "Carteira Horizonte", **6 asset classes**, **Top 5 / 5 categories**,
    performance all 0.0% (single day). Mirror the sample, not the aspirational 10-sleeve spec.
- [ ] Build dashboard components against **local seed JSON first** (no Supabase yet),
  so design + data shape are validated before auth.
- [ ] Lock TypeScript types in `web/lib/` shared by seed + UI.

---

## Phase 2 — Auth + plan storage (after 1.5)
- [ ] Supabase project; `@supabase/ssr` clients (server/client/middleware).
- [ ] `profiles(id, plan, addons[])` + trigger to create row on signup. RLS: own-row only.
- [ ] Email/password + magic link; login/signup pages.
- [ ] Planos CTAs write `profiles.plan` (replace `?plano=` stub).
- [ ] **Use the `supabase` skill.**

## Phase 3 — Dashboard (`/app`)
- [ ] Migrate seed JSON → Supabase tables (schema from Phase 1.5).
- [ ] Sidebar + sections: Carta reader, Carteira (donut + holdings grid + 3 opinions),
      Rankings tabs, Watchlist.
- [ ] Plan-gated lock states (RLS + UI blur showing what's locked).

## Later (out of current scope)
- [ ] Real payments (Stripe / Mercado Pago + webhook → small backend / edge function).
- [ ] Pipeline → Supabase ingestion (real weekly data writing same tables).
- [ ] Track record vs CDI/Ibov once data matures — audit's #1 commercial lever.

---

## Key file map (`web/`)

```
app/
  layout.tsx            fonts (Instrument Serif/Geist/Geist Mono) + nav/footer
  globals.css           design tokens (@theme) + editorial prose + grain
  page.tsx              Home
  planos/page.tsx       Plans + FAQ
  exemplo/page.tsx      Public sample carta (reads content/carta-exemplo.md)
  como-funciona/, metodologia/, sobre/, app/   pages
components/
  site-nav, site-footer, arc-mark, disclaimer, markdown, reveal, section-label, econ-indicator
  ui/                   button, card, stance-badge
  home/                 committee-pipeline, deliverables
  planos/               plan-picker (customizer logic UI)
lib/
  plans.ts              REPORTS, PLANS, FLOOR, evaluateSelection() (pricing logic)
  utils.ts              cn(), brl()
content/
  carta-exemplo.md      copy of samples/CARTA.md
```

## Commands
```
cd web
npm run dev      # localhost:3000
npm run build    # prod build
npm run lint     # eslint (React 19 strict: no sync setState in effects)
```
