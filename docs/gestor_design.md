# Design — Agente Gestor (carteiras de fator BR)

**Data:** 16/06/2026 · **Reescrito:** 2026-06-29 (pivot para Factor Investing)
**Fonte da verdade da arquitetura:** [`arquitetura_carteiras.md`](arquitetura_carteiras.md).

**Papel:** 6º agente. Roda após o consolidador. Transforma a análise do comitê +
os motores determinísticos em **três carteiras de Factor Investing** (não há mais
carteira unificada barbell):

1. 🏆 **Retorno Total** — ações BR, AFM-BR Valor+Momentum (s_rt).
2. 💰 **Dividendos Defensiva** — ações BR, AFM-BR Dividendos+Baixa Vol (s_dd).
3. 🌐 **ETFs da B3** — diversificação geográfica + tilt momentum/baixa-vol.

(FIIs, cripto, ações US e ETFs internacionais são de outros agentes — ver doc-mãe.)

## Decisões travadas

1. **Enquadramento:** recomendação **real e fundamentada**, sempre com o disclaimer
   educacional/CVM no output (Res. CVM 20 — o disclaimer não substitui
   credenciamento; risco de produto registrado).
2. **As duas carteiras de ações BR são 100% AÇÕES** (sem ETFs misturados). A
   carteira de ETFs é separada. Cada uma é **alocada de verdade** (pesos somam 1.0),
   8-12 nomes. Geradas pelo LLM do Gestor a partir do ranking AFM-BR (injetado pelo
   Fundamentalista), com structured outputs.
3. **A carteira de ETFs é determinística** (motor `etf_screen`, sem LLM): ETFs da
   B3 marcados por geografia, score momentum 6-1/12-1 + baixa-vol, alocados dentro
   de **caps rígidos por região** (EUA ≤ 40%, Global ≤ 30%, Emergentes ≤ 25%,
   Brasil ≤ 20% — âncora). Predominantemente internacional (o motor de "sair do
   Brasil"). Construída em `gestor.build_etf_portfolio()`.
4. **Diversificação em código (guard-rails):** ações BR ≤ 25% por **setor**
   (`gestor._diversify_and_normalize`); ETFs por **geografia**
   (`etf_screen._cap_geographies`). NÃO confiar no modelo para respeitar limites.
5. **Explicabilidade (público leigo):** cada holding tem `o_que_e` (1 frase
   simples), `fatores` (quais fatores sustentam), `resumo_leigo`, e `sector`.
6. **Cadência:** rebalance **mensal** (`GESTOR_REBALANCE_DAYS`), snapshot de
   performance a cada run. **Long-only, baixo giro** — só troca com razão
   estrutural forte.
7. **Pré-passo de pesquisa:** `gestor_research` (Sonnet + web search) coleta notas
   factuais recentes que enriquecem o rationale.

## Inclinação do Economista

O Economista não dá mais bandas de classe. Ele informa **qual tema de fator o
regime favorece** (Retorno Total vs Dividendos) e **quais setores** o cenário
favorece/penaliza — orientando a curadoria e a diversificação setorial.

## Modelo de dados

Cada carteira é um **portfolio nomeado** ("ARC Retorno Total", "ARC Dividendos
Defensiva", "ARC ETFs Global"), com performance independente. Tabelas (migration
007 + alters): `portfolios`, `portfolio_versions` (1 por rebalance), `portfolio_holdings`
(sleeve=asset_class, ticker, peso, sector, o_que_e, opinião-fatores, preço de
entrada), `portfolio_perf` (snapshots por ativo + linha agregada + benchmark).
A coluna `theme` distingue a carteira.

## Acompanhamento de performance

`gestor.snapshot_performance(version_id)`: re-precifica cada holding via `_snap`
(roteado por asset_class: B3/intl/cripto), calcula retorno desde `price_at_add`,
grava `portfolio_perf` (por ativo + agregado ponderado + benchmark). As 4 carteiras
dos especialistas usam o MESMO mecanismo (`pipeline._track_specialist_portfolios`).

## Onde encaixa no pipeline

Após o consolidador, no pool pós-comitê. Best-effort: falha do Gestor não derruba
a carta. Opt-out via `--no-gestor`. Opus 4.8 + adaptive thinking para as duas
carteiras de ação (a de ETFs é determinística).

## Fora de escopo (futuro)

- Rebalanceamento automático / ordens (nunca — só sugestão).
- Otimização de pesos (mean-variance/risk-parity) — hoje pesos por fator dentro
  dos caps; otimizador é evolução posterior.
- CMA como fator suave nas ações US (hoje é filtro de outlier).
