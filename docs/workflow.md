# Workflow ARC — Visão Geral

> **⚠️ Atualizado 2026-06-29:** o produto pivotou para **7 carteiras de Factor
> Investing** (3 do Gestor + 4 dos especialistas). Fonte da verdade:
> [`arquitetura_carteiras.md`](arquitetura_carteiras.md). Onde este doc citar
> "Carteira ARC barbell", sleeves ou "Top-10 em 7 categorias", está superado.

**Data:** 19/06/2026

---

## Fase 1 — Comitê (sequencial)

> Cada agente recebe os relatórios dos anteriores como contexto — **podados por
> seção** (#2): o Fundamentalista e o Técnico recebem só as seções do upstream que
> usam (o Consolidador recebe os relatórios completos, pois sua nota é fidelidade aos três).

**Injetado em todos os agentes:**
- `lessons block` — memória de processo acumulada por agente
- `performance review block` — retorno das recomendações passadas vs. preço atual
  (só em Economista, Fundamentalista e Consolidador — não no Técnico, que lê price action)

**Hand-off estruturado (re-injeção de JSON extraído, não prosa):**
- Fundamentalista recebe o `INDICATORS_JSON` do Economista (números macro verificados)
- Técnico recebe o `FUNDAMENTALS_JSON` do Fundamentalista (indicadores por ativo, junto ao OHLCV)
- Consolidador recebe o `INDICATORS_JSON` do Economista
- Gestor recebe o `RECOMMENDATIONS_JSON` do Consolidador (stances por ativo)

### 1. Economista
**Modelo:** Sonnet 4.6 · web search restrito (BCB, IBGE, FGV, B3)

- Input: tarefa do dia + **dados macro pré-carregados** do BCB (determinísticos, ver abaixo)
- Output: diagnóstico macro BR + global, regime, inclinação de alocação por classe
- Structured: `INDICATORS_JSON` (Selic, IPCA, P/L Ibovespa, earnings yield…)

> **Pré-fetch macro determinístico (`macro_data.py`):** antes do Economista rodar, o
> sistema busca Selic meta (SGS 432), IPCA 12m (SGS 13522), USD/BRL PTAX (SGS 1) e
> as expectativas Focus (Selic, IPCA, câmbio, PIB do ano de referência) direto das
> APIs públicas do BCB. Deriva o **juro real ex-ante** = (1+Selic)/(1+IPCA Focus)−1.
> O Economista interpreta esses números (não os re-busca na web); a web fica para o
> earnings yield do Ibovespa e contexto. Grounding em fonte primária reduz alucinação.

### 2. Fundamentalista
**Modelo:** Sonnet 4.6 · web search (Fundamentus, StatusInvest, CVM, B3)

- Input: relatório do Economista + universo B3 ranqueado (valor+qualidade por setor)
- Output: ativos ilustrativos por classe (ações BR/EUA, FIIs, ETFs, RF, intl, cripto)
- Structured: `FUNDAMENTALS_JSON` (ticker, indicadores, fonte)

### 3. Analista Técnico
**Modelo:** Sonnet 4.6 · sem web search de cotações

- Input: relatórios Economista + Fundamentalista + dados OHLCV reais injetados (EMA20/50, RSI14, MACD, pivôs, volume)
- Output: leitura de momento e tendência dos ativos destacados

### 4. Consolidador / Editor-Chefe
**Modelo:** Opus 4.8 · adaptive thinking · web search (só para o Radar)

- Input: os 3 relatórios acima
- Output: Carta Semanal em 2 camadas:
  - **Carta pública** — TL;DR, Cenário, Radar, Oportunidades, Riscos, Debate do comitê
  - **Anexo Técnico** — dados, múltiplos, leitura técnica, fontes
- Structured: `RECOMMENDATIONS_JSON` (ticker, stance: favorece/neutro/cautela)

---

## Fase 2 — Pós-comitê (paralelo, best-effort)

> Falha em qualquer etapa não cancela o run.

### 5. Crítico
**Modelo:** Opus 4.8 · adaptive thinking

- Input: os 4 relatórios do comitê
- Output: scores 0–10 por dimensão de rubrica por agente + lições propostas
- Persiste: `agent_evals` no DB
- Escreve: `memory/<agente>/proposed/` — **gate manual antes de promover**

### 6. Calibração (algorítmica, sem LLM)

- Lê recomendações passadas (>30 dias) do DB
- Compara stance → probabilidade implícita vs. preço atual
- Computa Brier Score + ECE por bucket
- Persiste: `calibration_log` no DB
- Propõe lição se descalibração > 15pp (gate manual)

### 7. Gestor
**Modelo:** Opus 4.8 · streaming · JSON schema · rebalance mensal (≥28 dias)

**7a. Pesquisa pré-passo** (Sonnet 4.6 · max 3 buscas · timeout 120s)
- Input: resumos dos relatórios do comitê
- Output: notas factuais recentes por ativo candidato (best-effort)

**7b. Gestor principal**
- Input: 4 relatórios **destilados por seção** (só as partes que constroem carteira —
  ~20-25k chars em vez de ~88k) + `RECOMMENDATIONS_JSON` do Consolidador + notas de pesquisa
- Output: TRÊS carteiras de fator alocadas (pesos somam 1.0):
  - 🏆 **Retorno Total** (ações BR, s_rt = Valor+Momentum) e 💰 **Dividendos
    Defensiva** (ações BR, s_dd = Dividendos+Baixa Vol) — via Opus + structured outputs
  - 🌐 **ETFs da B3** — determinística (`etf_screen`), diversificação geográfica + tilt
  - Cada ativo com target_weight, fatores (V/Q/M/L/D), o_que_e, rationale, resumo_leigo
- Guard-rails em código: ≤ 25% por setor nas ações (`FACTOR_SECTOR_CAP`), manga de
  ETFs ≤ 30% (`FACTOR_ETF_CAP`), cap por geografia nos ETFs B3. Sem RF/ouro/bitcoin.
- Runs intermediários (sem rebalance): apenas snapshot de performance vs. benchmark

### 8. Professor
**Modelo:** Sonnet 4.6 · web search

- Input: os 4 relatórios do comitê
- Output: Aprofundamento da Semana — 1 tema verificado via web, ensina do zero para iniciante

### 9. Arquivista (#12)
**Modelo:** Sonnet 4.6 · sem web search · effort medium

- Input: os 3 relatórios brutos do comitê (economista, fundamentalista, técnico)
- Output: **Anexo Técnico** do dossiê (tabelas, OHLCV, fontes) — organiza, não sintetiza
- Motivo: separa as duas audiências. O Consolidador foca 100% na carta pública (clareza);
  o Arquivista cuida da auditabilidade. Duas chamadas, dois objetivos.

### 10. Watchlist Semanal (#10)
**Modelo:** Haiku 4.5 · barato

- Input: seções acionáveis da carta + níveis técnicos determinísticos (suportes/resistências)
- Output: `_watchlist.md` — 3-5 ativos para monitorar com gatilho, prazo e motivo
- Nunca inventa preços (usa só os níveis reais); no-op se não houver snapshots técnicos

### 11. Especialistas de nicho (#11) — produtos add-on
**Modelo:** Sonnet 4.6 · web search focado · opcionais via `--especialistas`

- **FII:** P/VP, vacância, DY sustentável, tijolo×papel + Carteira de Dividendos
- **Cripto:** BTC/ETH conservador, sem hype + Carteira Cripto (≤5%, BTC-dominante)
- **Global:** EUA/Europa/China/emergentes + Carteira Global (com nota de câmbio/BDR)
- Cada um: deep-dive + sub-carteira ilustrativa → `_especialista_<nicho>.md`

---

## Fase 3 — Entregáveis gerados

| Arquivo | Conteúdo |
|---|---|
| `YYYY-MM-DD_runN_carta.md` | Carta pública limpa |
| `YYYY-MM-DD_runN_carta.html` | Newsletter estilizada |
| `YYYY-MM-DD_runN_carta.pdf` | PDF (WeasyPrint, best-effort) |
| `YYYY-MM-DD_runN_dossie.md` | Ata completa auditável + Anexo Técnico (Arquivista) |
| `YYYY-MM-DD_runN_carteira.md` | Carteira ARC + Rankings Top-10 |
| `YYYY-MM-DD_runN_whatsapp.txt` | Mensagem de engajamento |
| `YYYY-MM-DD_runN_aprofundamento.md` | Aprofundamento educativo |
| `YYYY-MM-DD_runN_watchlist.md` | Watchlist Semanal (ativos para monitorar) |
| `YYYY-MM-DD_runN_especialista_fii.md` | Especialista FII + Carteira de Dividendos (opcional) |
| `YYYY-MM-DD_runN_especialista_cripto.md` | Especialista Cripto + Carteira Cripto (opcional) |
| `YYYY-MM-DD_runN_especialista_global.md` | Especialista Global + Carteira Global (opcional) |

---

## Self-improvement loop (acumulativo entre runs)

```
memory/<agente>/lessons.md      ← lições aprovadas, injetadas em todo run futuro
memory/<agente>/proposed/       ← propostas do Crítico aguardando revisão manual
calibration_log (DB)            ← histórico Brier/ECE por bucket
agent_evals (DB)                ← scores do Crítico por run
portfolio_perf (DB)             ← retorno semanal por ativo vs. benchmark
```

---

## Modos de execução

```bash
python -m src.pipeline --agents all               # run completo (3 especialistas inclusos)
python -m src.pipeline --agents all --batch       # 50% mais barato (async, ~1h)
python -m src.pipeline --rebalance                # força rebalance do Gestor
python -m src.pipeline --no-critic --no-professor # só comitê + Gestor
python -m src.pipeline --especialistas none       # pula os especialistas de nicho
python -m src.pipeline --especialistas fii,global # só FII e Global
python -m src.pipeline --agents economist,fundamentalist  # run parcial
```

> **Pós-comitê em paralelo (#5):** Crítico, Gestor, Professor, Watchlist, Arquivista
> e os Especialistas rodam concorrentemente num `ThreadPoolExecutor` (são todos
> I/O-bound e independentes). A Calibração roda depois, pois lê os evals do Crítico no DB.
