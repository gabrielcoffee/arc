# Plano de correções — Carteira / Gestor (v2)

> **⚠️ Histórico (superado em 2026-06-29):** este plano corrigia a Carteira ARC
> barbell, que foi **aposentada**. O Gestor agora produz 3 carteiras de fator —
> ver [`arquitetura_carteiras.md`](arquitetura_carteiras.md). Mantido como registro.

**Data:** 16/06/2026
**Origem:** feedback acumulado + frustração legítima de 3 runs sem mudança visível.

---

## #0 — BLOQUEADOR: créditos da API (causa do run 15)

No run 15 a API Anthropic retornou **HTTP 400 "Your credit balance is too low"**.
Por isso falharam: pré-passo de pesquisa do Gestor, o `run_gestor`, o WhatsApp e o
Professor. Como o `run_gestor` falhou, **nenhuma versão nova da carteira foi
criada** → o relatório caiu na **versão 1 antiga** (Top-5, 5 categorias). 

**Sem créditos, nada disso pode ser nem testado.** Recarregar em Plans & Billing
é o passo zero.

## Por que pareceu que "não corrigi em 3 iterações" (honestidade)

- **Run 13/14:** cadência mensal → o Gestor **não rebalanceou** → re-render da v1.
- **Run 15:** `--rebalance` forçou, mas **API sem crédito** → Gestor falhou → v1 de novo.

Ou seja: o Gestor **novo** (6 categorias, Top-10, `o_que_e`, MtM, laddering,
rationale rico) **nunca executou de fato**. O código existe; o que faltou foi
ele rodar — e eu não consigo executar o pipeline daqui pra verificar, dependo dos
seus runs. Assumido. Daqui pra frente: nada é dado como pronto sem um run com
crédito que comprove.

---

## Grupo A — Formato do relatório da carteira (render; baixo risco)

| # | Correção | Como |
|---|---|---|
| A1 | **Remover** a seção "Performance" do report | `reports.render_carteira` — retirar o bloco |
| A2 | Posições **separadas Brasil × Global**, com subtotais **"% Brasil" / "% Global"** e cada bloco com suas posições (não misturar) | `render_carteira` — duas tabelas/blocos + subtotal por bloco |
| A3 | "Alocação por classe": descrição do **papel** mais rica (hoje genérica) | render — textos melhores por sleeve (ou Gestor preenche o papel) |
| A4 | "Por que cada ativo": **≥3 pontos por agente** (3 economista, 3 fundamentalista, 3 técnico) + **resumo final NÃO-técnico** pro leigo | schema do Gestor (opiniões viram 3 bullets cada + novo campo `resumo_leigo`) + prompt + render + **migration 009** |
| A5 | Top-10 **exatamente 10** por categoria, com **mais info por item**, e **ETF B3 × ETF global separados** | já no schema novo (6 categorias) — reforçar "exatamente 10" no prompt; aparece no rebalance |

## Grupo B — Regras de alocação do Gestor (guard-rails em código + prompt)

| # | Correção | Como |
|---|---|---|
| B1 | **Tesouro ≤ 40% do sleeve RF**; diversificar RF com **CDB, LCI/LCA (isentos), CRI/CRA/debêntures** (crédito privado, máx ~10–15% por emissor) | guard-rail no `_apply_sleeve_bands` (sub-limite dentro de RF) + prompt do Gestor + ampliar o que conta como RF |
| B2 | **Limite de concentração por setor** (ex.: máx X% em bancos, X% em commodities) p/ evitar carteira toda correlacionada ao Brasil macro | guard-rail + prompt (o Gestor declara o setor de cada ativo) |
| B3 | Gestor **avalia melhor pesos/diversificação** | decorre de B1+B2 + do Grupo C (universo maior pra escolher) |

## Grupo C — A correção GRANDE: screening sistemático da B3

**Problema:** hoje o fundamentalista escolhe ativos **via web search** — ele
**não varre o universo**. Por isso a carteira fica "presa nos mesmos nomes"
(ITUB4/BBAS3/PETR4/VALE3…) e parece **muito correlacionada**. Não é baixo giro; é
falta de cobertura sistemática.

**Solução (como quant/robo-advisors fazem):** um **screener determinístico**
`fundamentals_screen.py` — análogo ao `market_data.py`:
1. Puxa fundamentos de **TODA a B3** via brapi `/api/quote/list` + módulos
   (`defaultKeyStatistics`, `financialData`): P/L, P/VP, ROE/ROIC, margem,
   dívida, DY, liquidez.
2. Ranqueia o universo por **valor + qualidade** (a metodologia que já temos:
   QARP, F-Score proxy, penalizar iliquidez — `methodology.md`).
3. Injeta o **Top-N ranqueado por setor** no contexto do **fundamentalista** (e
   no pool de candidatos do Gestor) — exatamente como o técnico recebe OHLCV
   pronto. O LLM então faz a análise qualitativa **sobre o universo todo
   ranqueado**, não sobre o que "lembrou".

**A validar (com sua API key):** se o `/api/quote/list` + fundamentos estão no
seu plano brapi (já batemos no limite de *range* antes). Fallback: **fundamentus**
ou **statusinvest** (scraping) como fonte de fundamentos do universo.

**Resultado:** o fundamentalista passa a "ver" a B3 inteira por dados, escolhe as
melhores com fundamento real, e a carteira fica **mais diversificada e menos
arbitrária**. Esta é a resposta ao "preciso que analise todas as ações da B3".

## Grupo D — Reset da carteira (refazer do zero)

| # | Correção | Como |
|---|---|---|
| D1 | Limpar versões antigas da carteira | SQL `TRUNCATE portfolio_versions, portfolio_holdings, portfolio_shortlists, portfolio_perf RESTART IDENTITY CASCADE;` + alvo `make reset-portfolio` |
| D2 | Recriar do zero com o Gestor novo | `make run-rebalance` (com crédito) → cria v2 limpa |

> **Validação no banco:** não acesso seu `localhost` daqui. Para inspecionar:
> `SELECT version_id, as_of, run_id FROM portfolio_versions ORDER BY version_id;`
> e `SELECT category, COUNT(*) FROM portfolio_shortlists GROUP BY category;`
> (se vier 5 categorias / ≤5 por categoria, é a v1 antiga — confirma o diagnóstico).

---

## Ordem de execução sugerida

1. **Créditos** (#0) — sem isso nada testa.
2. **Grupo A** (formato) — rápido, baixo risco, melhora imediata na leitura.
3. **Grupo B** (RF ≤40% Tesouro + limite setorial) — guard-rails.
4. **Grupo C** (screener da B3) — a correção estrutural; valida a fonte de dados primeiro.
5. **Grupo D** (reset + rebalance) — gera a v2 limpa com tudo.

Itens A1, A2, A3, A5 e parte do B não dependem de crédito (são código/render);
mas só dá pra **ver** o resultado num run com crédito (Gestor + reports).
