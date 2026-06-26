# Design — Agente Gestor (Carteira ARC)

**Data:** 16/06/2026
**Papel:** 6º agente. Roda após o consolidador. Transforma a análise do comitê em
(1) shortlists ranqueadas por categoria e (2) a **Carteira ARC** — uma
carteira única e evolutiva, no estilo **barbell core-satélite + renda fixa**.

## Decisões travadas (respostas do produto)

1. **Enquadramento:** recomendação **real e confiável**, mas sempre com o
   disclaimer educacional/CVM carregado no output. (Nota: recomendação de valores
   mobiliários é atividade regulada pela Res. CVM 20 — o disclaimer não substitui
   credenciamento; isto fica registrado como risco de produto.)
2. **Estrutura — duas camadas:**
   - **Camada A (menu):** **Top 10** por categoria, em **7 categorias separadas**:
     ações BR (`acoes_br`), ações EUA (`acoes_us`), FIIs (`fii`), **ETFs B3**
     (`etf_br`: BOVA11), **ETF EUA amplo** (`etf_us`: VOO/IVVB11), **ETF
     internacional ex-EUA** (`etf_intl`: VXUS), **ETF emergentes** (`etf_em`).
     Cada item com `rationale` rico (o que cada agente disse + motivo +
     consolidação + info extra das buscas).
   - **Camada B (a carteira):** a Carteira ARC, barbell core-satélite + RF,
     composta a partir do menu, com **pesos-alvo** por ativo. Pesos desacoplados
     da contagem.
   - **Pré-passo de pesquisa:** antes da decisão estruturada, um call Sonnet 4.6
     **com web search** (`gestor_research`) coleta notas factuais recentes sobre
     os candidatos (fonte+data) que enriquecem o rationale dos rankings.
   - **Explicabilidade (público leigo):** cada holding tem `o_que_e` (1 frase em
     português simples), aviso de **marcação a mercado** na RF (`mtm_warning`), e
     o relatório separa **🇧🇷 Brasil × 🌎 Global** com nota de câmbio/BDR.
3. **Acompanhamento:** **carteira única que evolui**. Rebalance **mensal** (NÃO
   semanal); monitorada/snapshot de performance toda semana. **Long-only, sem
   posição de venda** — troca de ativo é tratada como *swap*. **Baixo giro**: o
   objetivo é longo prazo, então só troca com razão estrutural forte (não fica
   girando a carteira todo mês).
4. **Cauda antifrágil:** `ouro` (2–5%, hedge de crise descorrelacionado) +
   `bitcoin` (1–3%, opcionalidade, BTC dominante, sem alavancagem).

## Filosofia aplicada (pesquisa)

- **~25 nomes** = sweet spot de diversificação (Fisher-Lorie: ~32 captam ~95%;
  Statman 30-40); além disso, retorno decrescente.
- **Barbell de Taleb:** núcleo ultra-seguro (RF) grande + fatia convexa pequena
  (cripto/assimétrico). Antifragilidade = downside limitado, upside aberto.
- **Core-satélite:** ETFs amplos = núcleo de equity; nomes individuais =
  satélites de convicção (evita a sobreposição VOO×ações globais, BOVA11×ações BR).
- **Cripto ≤ ~5%:** acima de ~4% de BTC já se dirige >20% do risco da carteira.
- **RF com laddering (feedback de assessor):** escalonar prazos — pós-fixado
  (Selic, duration ~zero, liquidez) + IPCA+ de prazos variados — em vez de
  concentrar numa única NTN-B longa; e marcar os títulos de marcação a mercado
  (oscilam, perda se vendidos antes do vencimento).

## Alocação tática por regime, dentro de bandas (TAA com guard-rails)

Objetivo do Gestor: **maximizar rentabilidade de forma antifrágil e de longo
prazo**. A política barbell é o **centro estratégico**; o Gestor faz **tilts
táticos por regime macro** (lendo o economista) e a **quantidade de nomes é
flexível** — mas tudo **dentro de bandas rígidas** (limites das oscilações,
aplicados em código, não só no prompt). É o consenso de Tactical Asset Allocation
/ regime-based allocation: tiltar para os ativos favorecidos no regime, com bandas
de desvio.

O framework evoluiu para **10 classes** (a "constituição" da Carteira ARC). As
bandas vivem em `config.SLEEVE_BANDS` (fonte da verdade):

| Sleeve | Banda (limites) | Papel |
|---|---|---|
| `rf` (renda fixa BR) | 20–30% | estabilidade, liquidez, reserva de oportunidade |
| `fii` | 8–12% | renda passiva e exposição imobiliária |
| `acoes_br` | 8–12% | melhores empresas BR (ROIC, governança) |
| `etf_br` | 3–7% | exposição ampla à B3 |
| `etf_us` | 20–30% | principal motor de crescimento global (EUA amplo) |
| `etf_intl` | 8–12% | diversificação geográfica/cambial (ex-EUA) |
| `etf_em` | 3–7% | crescimento estrutural de emergentes |
| `acoes_us` | 3–7% | convicção em empresas extraordinárias |
| `ouro` | 2–5% | hedge contra crises sistêmicas |
| `bitcoin` | 1–3% | opcionalidade de cauda (pequena, sem alavancagem) |

Nº de nomes: ~18–30 (não fixo). Pesos somam 100%. As **bandas são limites
rígidos** — `gestor._apply_sleeve_bands` projeta os pesos para dentro das bandas
(iterativo: normaliza → clampa até convergir) e garante soma 1.0; dentro delas o
Gestor decide pelo regime e justifica. Guard-rails adicionais em código:
`_cap_tesouro_in_rf` (Tesouro ≤ 40% do sleeve RF) e `_cap_sector_concentration`
(≤ 25% por setor de ações). Ex.: juro real muito alto pode pesar mais a RF;
deterioração fiscal → proteção real (ouro) e dolarização; ciclo de corte → mais
bolsa. Direção do tilt é decidida pelo economista, não fixada no código.

> **Renda fixa — só instrumentos simples (público PF):** apenas Tesouro Direto,
> CDB e LCI/LCA (sem debêntures/CRI/CRA). Tesouro ≤ 40% do sleeve RF; laddering de
> prazos; títulos de marcação a mercado levam `mtm_warning`.

## Por ativo (obrigatório)

Cada holding da carteira carrega: `rationale` (por que está lá) + as **três
opiniões** — economista, fundamentalista, técnico — sintetizadas pelo Gestor a
partir dos relatórios do run (atribuídas, não inventadas).

## Modelo de dados (migration 007)

- `portfolios` — a carteira ARC (singleton).
- `portfolio_versions` — um snapshot por run/rebalance (as_of, estratégia).
- `portfolio_holdings` — holdings da versão: sleeve, ticker, peso-alvo, rationale,
  3 opiniões, preço de entrada.
- `portfolio_shortlists` — o menu **Top-10** ranqueado nas **7 categorias**, por run.
- `portfolio_holdings` inclui `o_que_e` e `mtm_warning` (migration 008).
- `portfolio_perf` — snapshots de performance ao longo do tempo (por ativo +
  linha agregada da carteira).

## Acompanhamento de performance

Função semanal `snapshot_performance(version)`: busca preço atual de cada holding
resolvível, calcula retorno desde `price_at_add`, grava `portfolio_perf` (por
ativo) + uma linha agregada (retorno ponderado pelos pesos). Permite responder
"como cada ativo performou" e "como a carteira performou".

## Onde encaixa no pipeline

Após o consolidador (usa os 4 relatórios). Best-effort: falha do Gestor não
derruba a carta. Opt-out via `--no-gestor`. Structured outputs garantem o JSON
da carteira; Opus 4.8 + adaptive thinking para a decisão de alocação.

## Fora de escopo desta fase (futuro)

- Rebalanceamento automático / ordens (nunca — só sugestão).
- Otimização de pesos (mean-variance/risk-parity) — começa com pesos julgados
  pelo Gestor dentro das faixas; otimizador é evolução posterior.
- Calibração da carteira (Brier/ECE sobre os ativos) — reaproveita a Fase 3.
