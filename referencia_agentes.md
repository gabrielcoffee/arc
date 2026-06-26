# ARC — Referência dos Agentes

Guia de bolso do sistema. O que cada agente faz, o que recebe, o que produz,
e como avaliar criticamente cada relatório. Produto atual: **carta semanal de
research macro de longo prazo + Carteira ARC recomendada**.

Documentos irmãos: [`methodology.md`](methodology.md) (fundamentos com citações),
[`gestor_design.md`](gestor_design.md) (a carteira), [`self_improvement_design.md`](self_improvement_design.md)
(o loop de aprendizado), [`reports_spec.md`](reports_spec.md) (formato dos reports),
[`performance_api_assessment.md`](performance_api_assessment.md) (recursos da API).

---

## Visão geral do pipeline

```
COMITÊ (sequencial):
  Economista → Fundamentalista → Técnico → Consolidador
   (macro)      (ativos ilustr.)  (momento)  (carta pública)

PÓS-COMITÊ (em PARALELO, best-effort — ThreadPoolExecutor):
  Crítico · Gestor · Professor · Watchlist · Arquivista · Especialistas(FII/Cripto/Global)
  └ depois: Calibração (lê os evals do Crítico no DB) → renderização dos reports
```

**Agentes do comitê (4):** Economista, Fundamentalista, Técnico, Consolidador.
**Pós-comitê:** Gestor, Professor, Crítico, **Arquivista** (anexo técnico do
dossiê), e os **Especialistas** de nicho opcionais (FII, Cripto, Global). Helpers
internos: `gestor_research` (pré-passo de pesquisa do Gestor) e a Watchlist (passo
Haiku, não um agente). A Calibração é algorítmica (sem LLM).

**Grounding determinístico (anti-alucinação):** antes do comitê, o sistema
pré-carrega dados de fonte primária — **macro do BCB** (`macro_data.py`: Selic,
IPCA, USD/BRL, Focus) para o Economista, **OHLCV** (`market_data.py`) para o
Técnico, e o **universo B3 ranqueado** (`fundamentals_screen.py`) para o
Fundamentalista. Hand-off estruturado (#1): o JSON extraído de um agente é
re-injetado como bloco primário no próximo, em vez de prosa.

O comitê é **sequencial** (cada saída vira contexto do próximo, **podada por
seção**); o pós-comitê é **paralelo** (todos I/O-bound e independentes). Recursos
de API por agente — ver `performance_api_assessment.md`.

**Reports gerados em `reports/`** (ver `reports_spec.md`):
- `..._carta.md` / `..._carta.html` (+`.pdf` best-effort) — carta pública
- `..._dossie.md` — Dossiê do Comitê (visão unificada + opinião separada de cada
  agente + **Anexo Técnico do Arquivista** + metadados: flags do crítico, scores,
  calibração)
- `..._carteira.md` — Carteira ARC (menu **Top-10** em 7 categorias —
  ações BR, ações EUA, FIIs, ETF B3, ETF EUA amplo, ETF internacional ex-EUA, ETF
  emergentes — + carteira com `o_que_e`, aviso de marcação a mercado e separação
  Brasil×Global)
- `..._whatsapp.txt` — mensagem de WhatsApp (hook + CTA, parte do TL;DR)
- `..._aprofundamento.md` — **Professor**: aula educativa da semana
- `..._watchlist.md` — **Watchlist** (3-5 ativos para monitorar, com gatilho)
- `..._especialista_fii.md` / `_cripto.md` / `_global.md` — **Especialistas**
  de nicho (opcionais), cada um com sua sub-carteira ilustrativa

| Comando | O que faz |
|---|---|
| `make run-economist` | Roda só o Economista (teste incremental) |
| `make run` | Pipeline completo (comitê + pós-comitê + especialistas) |
| `make run` + `--batch` | Mesmo, via Batches API (50% mais barato, assíncrono) |
| `make review-lessons` | Revisa lições propostas pelo crítico (gate manual) |
| `python -m src.optimize_prompt --agent X` | (Fase 4, esqueleto) propõe novo prompt |

Flags: `--no-critic`, `--no-gestor`, `--no-professor`, `--no-watchlist` desligam
passos; `--especialistas fii,cripto,global|none` seleciona os especialistas;
`ARC_ADVISOR_AGENTS` liga o advisor por agente. Lista completa em `comandos.md`.

---

## 1. Agente Economista-Chefe

**Papel:** identificar o REGIME macroeconômico e propor inclinações de
alocação entre classes de ativos e setores. Visão estrutural de longo prazo —
NÃO timing tático.

**Recebe:** a data do run + **dados macro pré-carregados do BCB** (determinísticos)
+ (se houver) revisão de performance de runs passados.

**Produz:** diagnóstico de regime, câmbio e fiscal, cenário global, inclinação
de alocação sugerida entre classes (bolsa BR, FIIs, RF, internacional, cripto
marginal), temas e setores em destaque, riscos. Mais o bloco `<INDICATORS_JSON>`
que persiste indicadores macro no banco.

**Modelo:** Sonnet 4.6 · **Web search:** restrito a fontes primárias (BCB,
IBGE, FGV-IBRE, Tesouro Nacional, B3).

**Pré-fetch macro determinístico (`macro_data.py`, #8):** antes do agente rodar,
o sistema busca direto das APIs públicas do BCB: Meta Selic (SGS 432), IPCA 12m
(SGS 13522), USD/BRL PTAX (SGS 1) e o Focus (Selic/IPCA/câmbio/PIB do ano), e
deriva o **juro real ex-ante**. O Economista INTERPRETA esses números (não os
re-busca na web); a web fica para o earnings yield do Ibovespa e contexto. Reduz
alucinação e propaga dado correto para todo o comitê.

**Fundamentos-chave:**
- **Câmbio (BRL/USD) é driver co-principal** — Ibovespa mais sensível a choque
  cambial que à Selic (JRFM/MDPI 2025). Não trate câmbio como secundário.
- Juro real ex-ante vs. earnings yield — **NUNCA com juro nominal** (Asness 2003).
- Curva DI como indicador de ciclo, confiança **baixa-média** no Brasil
  (Estrella & Mishkin 1998 é o análogo; predição mais fraca aqui).
- Lag de 6-9 meses Selic→investimento corporativo (evidência UFRJ).
- Risco fiscal como canal de taxa de desconto — juros reais altos em 2026 são
  parcialmente problema de credibilidade fiscal.

**Ao ler, pergunte:**
- Os números de Selic/IPCA/câmbio batem com o Focus dessa semana?
- Ele separou juro real de juro nominal?
- Tratou câmbio com o mesmo peso que juros?
- As fontes citadas existem e têm a data informada?

---

## 2. Agente Analista Fundamentalista

**Papel:** a partir do cenário do Economista, identificar **ativos ilustrativos**
de qualidade para o momento — ações BR, FIIs, ETFs, renda fixa, internacionais.
Visão de longo prazo (> 5 anos). Universo amplo, sem restrições regulatórias.

**Recebe:** relatório do Economista (**podado por seção** — regime, câmbio/fiscal,
global, inclinação de alocação, temas, riscos) + o **`INDICATORS_JSON` estruturado**
do Economista (números verificados) + o **universo B3 ranqueado**
(`fundamentals_screen.py`) + revisão de performance.

**Produz:** universo analisado, tabela comparativa de indicadores, ativos
ilustrativos com tese e gatilho de invalidação, riscos. Mais o bloco
`<FUNDAMENTALS_JSON>`.

**Modelo:** Sonnet 4.6 · **Web search:** ativo para buscar dados fundamentais.

**Fundamentos-chave (calibração Brasil):**
- **Valor + Qualidade SEMPRE combinados** — nunca um fator só (Fama-French
  1993/2015; Novy-Marx 2013; QMJ Asness et al. 2019).
- **Prêmio de tamanho é NEGATIVO no Brasil** (NEFIN ≈ -2%/ano) — nunca
  destacar um ativo só por ser small cap.
- **Iliquidez é risco explícito** (fator IML do NEFIN) — avaliar volume diário.
- **F-Score de Piotroski** (0-9) como filtro anti-armadilha (Hyde 2013 em
  emergentes). Mais poderoso em ações de baixa cobertura.
- **CMA (Fama-French 2015):** desconfiar de crescimento agressivo de ativos.
- Para **FIIs:** P/VP, DY sustentável, vacância, qualidade dos ativos/recebíveis.
- Para **RF:** juro real vs. NTN-B, risco de crédito, liquidez.
- Para **internacional:** mesma lógica valor+qualidade + câmbio.

**Anti-padrões que ele deve evitar:** destacar por DY isolado; extrapolar
lucro de pico de commodities; ignorar diluição; confundir empresa boa com
ativo barato.

**Tese falsificável obrigatória:** "Esta tese estará ERRADA se ___" — com
gatilhos observáveis e datados.

**Ao ler, pergunte:**
- Ele combinou valor E qualidade?
- Calculou o F-Score (ou avaliou os critérios equivalentes)?
- Tratou iliquidez como risco explícito?
- A tese tem gatilho de invalidação claro?
- Cobriu mais de uma classe de ativo (não só ações BR)?

---

## 3. Agente Analista Técnico

**Papel:** contextualizar o MOMENTO de mercado dos ativos ilustrativos —
tendência, níveis relevantes para um comprador de longo prazo. Nunca day trade,
nunca short, nunca sobrepõe os fundamentos.

**Recebe:** seções relevantes do Economista (regime) e do Fundamentalista
(destaques) + o **`FUNDAMENTALS_JSON` estruturado** (indicadores por ativo) + o
bloco determinístico de dados de mercado (OHLCV ~1 ano calculado em código:
EMA20/50, RSI14 Wilder, MACD 12/26/9, pivôs, volume vs. média 20d). **Não** recebe
a revisão de performance (#4 — ele lê price action, não decide alocação).
Os snapshots são buscados em **paralelo** (#6).

**Produz:** leitura de mercado por ativo, contexto de momento (entrada gradual,
paciência, ou cautela), níveis a monitorar.

**Modelo:** Sonnet 4.6 · **Dados:** calculados deterministicamente em
`market_data.py` — não "achados" na web. Vale para ações, FIIs, ETFs e
internacionais (via yfinance).

**Hierarquia de evidência (o coração deste agente):**

| Sinal | Força | Uso |
|---|---|---|
| Momento/tendência | **Forte no mundo, FRÁGIL no Brasil** | Confirmação suave; momentum crash em crises (Mussa et al.; Daniel & Moskowitz) |
| Médias móveis / rompimento | Moderada | Contexto de tendência (decai pós-publicação — Sullivan et al. 1999) |
| RSI / osciladores | Fraca | Só evitar sobrecompra extrema dentro de alta |
| Volume | Confirmação | Confirma, não inicia (Lo et al. 2000) |
| Suporte/resistência (pivôs) | **Heurística, não preditiva** | Staging de entrada — diz isso explicitamente |

**Sobre timing:** o aporte mensal deve ser investido prontamente ao chegar
(Vanguard 2012 — lump sum supera DCA ~2/3 das vezes). Staging dentro do mês
é ferramenta comportamental, não de retorno — o agente rotula isso.

**Ao ler, pergunte:**
- Ele usou os dados injetados (preço com data) ou inventou algo?
- Calibrou a confiança pela força da evidência?
- Não está sobrepondo os fundamentos?
- Citou a força de evidência de cada sinal?

---

## 4. Agente Consolidador (Editor-Chefe)

**Papel:** transformar os três relatórios na **carta pública** acessível, depois
de simular o debate do comitê. Desde o #12, ele foca **só** na carta pública — o
anexo técnico é responsabilidade do **Arquivista** (duas audiências, duas chamadas).

**Recebe:** os três relatórios completos (não é podado — sua nota de crítica é a
fidelidade aos três).

**Produz:**
- **Carta pública** (arquivo `_carta.md`): TL;DR em 30 segundos, O Cenário,
  Radar da Semana, Onde Estão as Oportunidades, Os Movimentos da Semana, O Que
  Pode Dar Errado, O Outro Lado (debate). Disclaimer forte no topo e rodapé.
- Bloco `<RECOMMENDATIONS_JSON>` com `stance` (favorece/neutro/cautela) e
  `illustrative: true` — alimenta o Gestor.

**Modelo:** Opus 4.8 + adaptive thinking (síntese e raciocínio de maior qualidade).
**Ferramentas:** web search (só para verificar o "Radar da Semana").

**Processo do comitê (obrigatório):**
1. Convergências entre os três analistas
2. Divergências confrontadas ponto a ponto (Du et al. 2023/ICML 2024)
3. Advogado do diabo + rodada de revisão
4. Pré-mortem: "se esta visão errar em 12 meses, por quê?"

**Ao ler:**
- A seção de debate confronta divergências de verdade ou só lista?
- O advogado do diabo é um argumento real?
- A carta pública está em linguagem acessível, sem jargão excessivo?
- O disclaimer aparece no topo e no rodapé?
- Os ativos são citados como ILUSTRAÇÃO (não como "compre X")?

---

## 5. Agente Gestor (Carteira ARC)

**Papel:** transformar a análise do comitê em (A) shortlists **Top-10** em **7
categorias** (ações BR, ações EUA, FIIs, ETF B3, ETF EUA amplo, ETF internacional
ex-EUA, ETF emergentes) e (B) a **Carteira ARC** — barbell core-satélite + renda
fixa, em **10 classes**. Objetivo: maximizar rentabilidade de forma antifrágil e
de longo prazo. (Detalhes em `gestor_design.md`.)

**Pré-passo de pesquisa:** antes da decisão, `gestor_research` (Sonnet + web
search) coleta notas factuais recentes que enriquecem o rationale dos rankings.

**Explicabilidade:** cada ativo tem `o_que_e` (linguagem simples); RF de marcação
a mercado vem com aviso; o relatório separa Brasil × Global (nota de câmbio/BDR).

**Recebe:** os 4 relatórios **destilados por seção** (#3 — só as partes que
constroem carteira, ~20-25k chars em vez de ~88k) + o **`RECOMMENDATIONS_JSON`**
do Consolidador (stances por ativo).

**Produz:** shortlists ranqueadas; e a carteira com peso-alvo por ativo, razão, e
**as 3 opiniões** (economista/fundamentalista/técnico) sintetizadas por ativo.

**Modelo:** Opus 4.8 + adaptive thinking + structured outputs (streaming).

**Regras-chave:**
- **Alocação tática por regime dentro de bandas rígidas** (TAA, 10 classes): RF
  20–30%, FIIs 8–12%, ações BR 8–12%, ETF B3 3–7%, ETF EUA 20–30%, ETF intl 8–12%,
  ETF emergentes 3–7%, ações EUA 3–7%, ouro 2–5%, bitcoin 1–3%. As bandas são
  limite duro (`gestor._apply_sleeve_bands`); o tilt segue o regime do economista.
- Guard-rails: Tesouro ≤ 40% do sleeve RF; ≤ 25% por setor de ações.
- Nº de nomes flexível (~18–30). Pesos somam 100%.
- **Rebalance MENSAL** (não semanal), baixo giro, **long-only** (sem venda/short).
- RF só instrumentos simples (Tesouro/CDB/LCI-LCA); cauda antifrágil = ouro + BTC.

**Acompanhamento:** `portfolio_perf` registra retorno por ativo + agregado a cada
run (mesmo sem rebalance). Tabelas: `portfolios`, `portfolio_versions`,
`portfolio_holdings`, `portfolio_shortlists`, `portfolio_perf` (migration 007).

---

## 6. Agente Professor (aprofundamento educativo)

**Papel:** a partir dos temas do comitê, escolher **uma notícia/evento recente** e
escrever uma **aula educativa** para o iniciante total — report à parte
(`_aprofundamento.md`). Educativo, **nunca preditivo**.

**Recebe:** os 4 relatórios do comitê. **Modelo:** Sonnet 4.6 + web search (para
ancorar a notícia com fonte e data).

**Produz:** A notícia (gancho) → Explicando do zero → Como funciona na prática →
Por que importa pra você → O que o comitê disse → Mitos×Fatos → Glossário → FAQ →
Resumo em 3 pontos → Pra ir além. (Flag `--no-professor` desliga.)

---

## 7. Agente Arquivista (anexo técnico)

**Papel (#12):** organizar o **Anexo Técnico** do dossiê a partir dos 3 relatórios
brutos do comitê — separado do Consolidador para que ESTE foque 100% na carta
pública. Mandato: **fidelidade > criatividade** — não inventa dados nem teses; só
organiza o detalhe técnico de forma auditável (todo número com fonte e data).

**Recebe:** os relatórios brutos de economista, fundamentalista e técnico.
**Produz:** Visão Macro Detalhada → Fundamentos dos Ativos → Leitura Técnica e
Níveis → Notas de Evidência e Fontes (incluído no `_dossie.md`).
**Modelo:** Sonnet 4.6, effort medium, **sem web search** (organiza, não pesquisa).

---

## 8. Watchlist Semanal (passo Haiku)

**Papel (#10):** destilar **3-5 ativos para MONITORAR** na semana, a partir das
seções acionáveis da carta + os níveis técnicos determinísticos (suportes/
resistências reais). NÃO é ordem de compra — é radar ("se chegar em X, vale olhar").

**Produz:** `_watchlist.md` (tabela: ativo, preço, gatilho, prazo, por quê).
**Modelo:** Haiku 4.5 (barato). Nunca inventa preços; no-op sem snapshots técnicos.
(Flag `--no-watchlist` desliga.)

---

## 9. Especialistas de nicho (add-on, opcionais)

**Papel (#11):** agentes pós-comitê que aprofundam um nicho e produzem uma
**sub-carteira ilustrativa**. São os produtos add-on do plano (ver
`produto_reports.md`). Cada um: Sonnet 4.6 + web search focado, recebe a carta do
comitê + o regime do economista, e pesquisa o próprio nicho.

| Especialista | Foco | Sub-carteira | Arquivo |
|---|---|---|---|
| **FII** | P/VP, vacância, DY sustentável, tijolo×papel | Carteira de Dividendos | `_especialista_fii.md` |
| **Cripto** | BTC/ETH conservador, sem hype, macro | Carteira Cripto (≤5%, BTC-dom.) | `_especialista_cripto.md` |
| **Global** | EUA/Europa/China/emergentes + câmbio/BDR | Carteira Global | `_especialista_global.md` |

Selecionáveis via `--especialistas fii,cripto,global` (padrão: os três) ou `none`.

---

## Crítico + loop de auto-melhoria (ao fim do run)

Ver `self_improvement_design.md`. A cada run, best-effort:
- **Injeção de lições** (Fase 1): cada agente recebe `memory/<agente>/lessons.md`
  no início do run (memória reflexiva, versionada em git).
- **Crítico** (Fase 2): Opus 4.8 + thinking avalia cada agente por rubrica, grava
  scores em `agent_evals` e **propõe lições** em `memory/<agente>/proposed/`
  (gate manual via `make review-lessons`).
- **Calibração** (Fase 3): Brier/ECE sobre as stances maturadas; grava
  `calibration_log` e propõe lição de calibração. No-op até haver amostra.
- **Fase 4 (esqueleto):** `optimize_prompt.py` — otimização reflexiva do próprio
  system prompt (GEPA), manual/trimestral, com gate humano.

---

## Universo de ativos coberto

| Classe | Exemplos | Nota tributária (PF) |
|---|---|---|
| Ações BR / units | EQTL3, PETR4, BPAC11 | Isenção R$20k/mês em vendas à vista |
| FIIs | KNRI11, MXRF11, HGLG11 | IR na fonte (20% rendimentos; 20% ganho capital) |
| ETFs brasileiros | BOVA11, SMAL11, IVVB11 | Sem isenção; IR 15% sobre ganho |
| Renda fixa | Tesouro Selic/IPCA+/Prefixado, CDB | Tabela regressiva IR |
| Internacional (BDR) | AAPL34, MSFT34, IVVB11 | IR 15% sobre ganho |
| Internacional (direto) | AAPL, VOO, VXUS | Tributação no exterior + carnê-leão |
| Cripto (marginal) | BTC, USDC | IR 15% sobre ganho > R$35k/mês |

---

## Fluxo de um run semanal

1. `make db` (se banco não estiver de pé) → `source .venv/bin/activate`
2. `make run` → comitê (sequencial) + pós-comitê em paralelo (Gestor, Professor,
   Watchlist, Arquivista, Especialistas, Crítico) + calibração (~10-15 min; web
   search e o rebalance mensal do Gestor são os gargalos)
3. Abre `reports/*_carta.html` (ou `.md`) — a carta pública
4. Abre `reports/*_carteira.md` — a Carteira ARC da semana
5. Abre `reports/*_dossie.md` — versão completa (visão unificada + opiniões
   separadas + Anexo Técnico + metadados); e os `_especialista_*.md` / `_watchlist.md`
6. `make review-lessons` — revisa as lições que o crítico propôs e promove as boas
7. Lê criticamente — os números macro batem com o que você vê no mercado?
8. Registra sua decisão se for executar algo:
   ```bash
   python -m src.log_decision --run-id N --decision "..." --rationale "..."
   ```

---

## Queries úteis no banco

```sql
-- Indicadores macro do último run
SELECT name, value, unit, reference_date, source
FROM macro_indicators ORDER BY indicator_id DESC LIMIT 10;

-- Custo e cache por agente (observabilidade)
SELECT agent_name, model, input_tokens, output_tokens, cache_read_tokens
FROM agent_reports ORDER BY report_id DESC LIMIT 4;

-- Ativos ilustrativos das últimas cartas
SELECT r.ticker, r.asset_class, r.stance, pr.started_at::date
FROM recommendations r
JOIN pipeline_runs pr ON pr.run_id = r.run_id
ORDER BY pr.started_at DESC LIMIT 20;

-- Status dos runs
SELECT run_id, trigger_type, status, started_at, finished_at
FROM pipeline_runs ORDER BY run_id DESC LIMIT 5;

-- Scores do crítico por agente (tendência de qualidade)
SELECT agent_name, dimension, ROUND(AVG(score),2) AS media, COUNT(*) AS n
FROM agent_evals GROUP BY agent_name, dimension ORDER BY agent_name, media;

-- Calibração ao longo do tempo
SELECT agent_name, n, brier, ece, computed_at
FROM calibration_log ORDER BY computed_at DESC LIMIT 10;

-- Carteira ARC atual (última versão) + performance
SELECT h.sleeve, h.ticker, h.target_weight, h.price_at_add
FROM portfolio_holdings h
JOIN portfolio_versions v ON v.version_id = h.version_id
WHERE v.version_id = (SELECT MAX(version_id) FROM portfolio_versions)
ORDER BY h.target_weight DESC;
```

---

## Disclaimer

O sistema produz conteúdo educacional e de cenário — **não é recomendação de
investimento**. Ativos são citados como ilustração de raciocínio macro, não
como ordens de compra. Decisões de investimento são sempre do leitor.
