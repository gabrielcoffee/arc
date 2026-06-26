# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This directory holds the **design & specification docs** (Markdown, mostly Brazilian Portuguese)
for **ARC** — a multi-agent financial-research system that produces a weekly long-term macro
research letter plus a recommended evolving portfolio (**Carteira ARC**). The implementation
(`src/`, `Makefile`, `sql/`, `requirements.txt`, `.env`) is referenced throughout but **lives
elsewhere** — it is not checked into this directory. There is no build/test tooling here; this
is documentation. Edits here are spec changes, not code changes.

When a doc references `python -m src.X`, `make Y`, a DB table, or a config var, treat it as a
description of the implemented system, not something runnable from this folder.

## Document map

Start at `referencia_agentes.md` (pocket guide: every agent — input, output, how to read it
critically). Then by concern:

| Doc | Covers |
|---|---|
| `referencia_agentes.md` | Per-agent reference + useful DB queries + weekly-run flow |
| `workflow.md` | Pipeline phases (committee → post-committee → deliverables), data hand-offs |
| `methodology.md` | Evidence base — every prompt decision traces to a cited claim here |
| `comandos.md` | All `make` targets, `pipeline.py` flags, env vars |
| `gestor_design.md` | The Gestor agent & Carteira ARC (sleeves, bands, guard-rails) |
| `self_improvement_design.md` | Critic + lessons + calibration loop; Claude API features per agent |
| `reports_spec.md` / `produto_reports.md` | Format & audience of each deliverable |
| `performance_api_assessment.md` | Claude API capabilities used per agent |
| `analise_comercial_produto.md`, `monetizacao_estrategia.md` | Product/commercial/monetization |
| `design_brief.md`, `gestor_design.md`, `methodology.md` | Source-of-truth design decisions |
| `plano_correcoes_carteira.md` | Portfolio correction plan |

Docs cross-link each other with relative `.md` links and carry a `**Data:**` (date) header —
keep both updated when editing.

## System architecture (the big picture)

Two phases, deterministic grounding before both:

**Pre-fetch (deterministic, anti-hallucination):** before any LLM runs, primary-source data is
loaded in code and injected — BCB macro (`macro_data.py`: Selic, IPCA, USD/BRL, Focus, derives
ex-ante real rate), OHLCV indicators (`market_data.py`: EMA/RSI/MACD/pivots via yfinance), and
the ranked B3 universe (`fundamentals_screen.py`, needs `BRAPI_TOKEN`). Agents *interpret* these
numbers; they do not re-fetch them.

**Phase 1 — Committee (sequential):** Economista → Fundamentalista → Técnico → Consolidador.
Each agent sees prior reports **pruned by section** (only the upstream sections it uses), plus a
**structured JSON hand-off** re-injected from the previous agent (`INDICATORS_JSON`,
`FUNDAMENTALS_JSON`, `RECOMMENDATIONS_JSON`) — extracted JSON, not prose. Consolidador (Opus)
gets the full reports and writes the public letter + `RECOMMENDATIONS_JSON`.

**Phase 2 — Post-committee (parallel, best-effort in a ThreadPoolExecutor):** Crítico, Gestor,
Professor, Watchlist, Arquivista, and optional Especialistas (FII/Cripto/Global) run
concurrently (all I/O-bound, independent). A failure in any one does **not** cancel the run.
**Calibração** runs after, since it reads the Critic's evals from the DB.

**Self-improvement loop (across runs):** Critic (Opus) scores each agent by rubric → writes
proposed lessons to `memory/<agent>/proposed/` behind a **manual gate** (`make review-lessons`);
approved lessons live in `memory/<agent>/lessons.md` (git-versioned) and are injected at the
start of every future run. Calibração computes Brier/ECE on matured stances. State persists in
DB tables: `agent_evals`, `calibration_log`, `portfolio_perf`.

## Model / cost conventions (when editing specs, keep consistent)

- Research agents (Economista, Fundamentalista, Técnico, Professor, Especialistas, Arquivista,
  gestor_research): **Sonnet 4.6**. Consolidador & Gestor & Crítico: **Opus 4.8** + adaptive
  thinking. Watchlist: **Haiku 4.5** (cheap).
- `--batch` routes calls through the Batches API (~50% cheaper, async ~1h SLA).
- Gestor rebalances **monthly** (≥28 days, `ARC_GESTOR_REBALANCE_DAYS`); other runs only
  snapshot performance. Force with `--rebalance` / `make run-rebalance`.
- Portfolio is **long-only**, low-turnover, with **hard sleeve bands** (10 classes), ≤25% per
  equity sector, Tesouro ≤40% of the fixed-income sleeve — these are code guard-rails, not
  suggestions; don't spec a portfolio that violates them.

## Conventions specific to this project

- **Disclaimer is load-bearing:** output is framed as *educational scenario analysis*, never
  investment advice (CVM Res. 20). Assets are always cited as *illustration*, with
  `illustrative: true`. Any spec edit that softens this is wrong.
- Prose is in **pt-BR**; `methodology.md` is in English. Match the file you're editing.
- Every factual claim in agent design should be **traceable to a citation in `methodology.md`**.
- Deterministic data is never "found on the web" — keep the pre-fetch vs. web-search boundary
  explicit (web is for context/earnings yield/news, not for prices or macro headline numbers).
