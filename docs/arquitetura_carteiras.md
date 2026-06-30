# Arquitetura das Carteiras ARC — fonte da verdade

**Atualizado:** 2026-06-29
**Status:** vigente. Este documento **substitui** o modelo antigo de "Carteira ARC
barbell / sleeves" e o "Rankings Top-10 em 7 categorias num só lugar". Onde outros
docs ainda descreverem aquilo, este aqui prevalece.

---

## O produto em uma frase

A ARC entrega **7 carteiras de Factor Investing**, cada uma com **dono, universo,
metodologia e fonte de dados próprios** — montadas por um **motor determinístico**
(quantitativo, auditável) com **curadoria qualitativa** do agente responsável, e
**todas com tracking de performance** ao longo do tempo.

Não existe mais carteira unificada (barbell com renda fixa, ouro, bitcoin e bandas
macro). Cada universo de ativo é sua própria carteira.

---

## As 7 carteiras

| # | Carteira | Dono | Universo | Metodologia (motor) | Dados | Módulo |
|---|---|---|---|---|---|---|
| 1 | 🏆 Retorno Total | Gestor | Ações BR | AFM-BR: Valor + Momentum (s_rt) | Partnr | `fundamentals_screen.py` |
| 2 | 💰 Dividendos Defensiva | Gestor | Ações BR | AFM-BR: Dividendos + Baixa Vol (s_dd) | Partnr | `fundamentals_screen.py` |
| 3 | 🌐 ETFs da B3 | Gestor | ETFs B3 | Diversificação geográfica + tilt momentum/baixa-vol | Partnr | `etf_screen.py` |
| 4 | 🏢 FIIs | Esp. Imóveis | FIIs | Segmento + P/VP + FFO Yield + vacância | Fundamentus | `fii_screen.py` |
| 5 | ₿ Cripto | Esp. Cripto | Criptomoedas | Market-cap + dominância BTC + tilt momentum | CoinGecko | `crypto_screen.py` |
| 6 | 🇺🇸 Ações Americanas | Esp. Global | Ações US | AFM-US: Qualidade + Momentum (≠ Brasil) | SEC EDGAR + yfinance | `us_screen.py` |
| 7 | 🌎 ETFs Internacionais | Esp. Global | ETFs US-listed | Diversificação geográfica + tilt momentum/baixa-vol | yfinance | `etf_screen.py` |

---

## Princípio comum a todas

Cada carteira segue o mesmo padrão de três camadas:

1. **Motor determinístico** — um modelo de fatores quantitativo, reproduzível e
   auditável, que ranqueia o universo e **aloca pesos** (soma 100%).
2. **Caps de diversificação (guard-rails em código)** — limites rígidos que
   forçam a diversificação e impedem concentração:
   - Ações BR: ≤ 25% por **setor**.
   - ETFs (B3 e intl): cap por **geografia** (ex.: EUA ≤ 40-45%).
   - FIIs: ≤ 30% por **segmento** (papel/CRI, logística, lajes, shoppings…).
   - Cripto: BTC ≤ 50%, ETH ≤ 30%, cada altcoin ≤ 10%.
   - Ações US: ≤ 12% por **nome** + ≤ 30% por **setor**.
3. **Guardas de robustez** — filtros que evitam armadilhas conhecidas:
   - FIIs: exclui P/VP < 0,50 (CRI distressed) e satura o prêmio de "barato".
   - Cripto: exclui stablecoins, meme coins e wrapped/staked.
   - ETFs: descarta séries corrompidas (vol > 60% ou |momentum| > 150%).
   - Ações US: filtra outliers de crescimento de ativos > 100% (M&A/empire-building).

Por cima do motor, o **agente dono faz a curadoria qualitativa** (veta bandeiras
vermelhas, corrige rótulos, aplica o tilt de regime) e escreve a parte textual.

---

## Metodologia: os fatores diferem por mercado

Decisão baseada em evidência (não é o mesmo modelo para todo mundo):

- **Brasil (AFM-BR):** o score-mãe Φ é uma **soma ponderada por evidência** de
  Baixa-Vol + Valor (líderes, peso 0.30 cada) + Momentum + Qualidade (0.20 cada);
  **Dividendos fica fora do mestre** (redundante). Na base própria, **Baixa-Vol e
  Qualidade são os fatores robustos** (cruzam t>3); Momentum é marginal e entra
  **ajustado a risco**. Valor (EV/EBIT, não P/L) é ancorado em literatura. Ver
  `fama_french_fatores_br.md`.
- **EUA (AFM-US):** **Qualidade/Profitability + Momentum lideram**; Valor é
  secundário/redundante (Fama-French 5-fatores, 2015).
- **ETFs (B3 e intl):** sem fator Valor (não há fundamento de índice barato); o que
  funciona é **diversificação geográfica estratégica + tilt de momentum/baixa-vol**
  (não rotação tática — evita whipsaw; FGV: ~20% no exterior para o brasileiro).
- **Cripto:** **market-cap weighting + dominância de BTC** (âncora) + tilt de
  **momentum** (Liu, Tsyvinski & Wu, JF 2022 — fatores mercado/tamanho/momentum).
  Sem fator tamanho (= onde vivem os memes).
- **FIIs:** **diversificação por segmento** + P/VP (valor) + **FFO Yield** como
  teste de sustentabilidade do dividendo + baixa vacância + tilt de regime
  papel↔tijolo conforme a Selic.

---

## Fontes de dados (todas validadas)

| Fonte | Cobre | Custo | Nota |
|---|---|---|---|
| **Partnr** | Ações BR, ETFs B3 (preço) | token | só Brasil; fundamentos de ação prontos |
| **Fundamentus** | FIIs (P/VP, DY, FFO, segmento, vacância) | grátis, sem key | tabela única; parse stdlib |
| **CoinGecko** | Cripto (market cap, momentum, categorias) | grátis, sem key | exclui meme/stable por categoria |
| **SEC EDGAR** | Fundamentos de ações US (XBRL) | grátis, sem key | cru; computa ROIC/EV-EBIT; UA obrigatório |
| **yfinance** | Preço/setor/mcap US + ETFs intl | grátis | momentum/baixa-vol |

Descartados: roic.ai free (só AAPL).

---

## Donos e entregáveis

- **Gestor (BR):** as carteiras 1, 2 e 3 + ranking Top-10 de ações BR e de ETFs B3.
- **Especialista de Imóveis:** mini-carta temática de imóveis + carteira de FIIs +
  ranking Top-10 de FIIs.
- **Especialista Cripto:** mini-carta temática + carteira de cripto + ranking Top-10.
- **Especialista Global:** mini-carta global + carteira de ações US + carteira de
  ETFs internacionais + rankings Top-10.

Cada especialista = uma "mini-carta semanal" do seu tema (o que afeta o setor +
notícias) + a(s) carteira(s) + o ranking.

---

## Tracking de performance

Todas as 7 carteiras são **persistidas como portfolios nomeados** com versão
(rebalance **mensal**) e **snapshot de performance a cada run** (re-precifica cada
ativo e calcula retorno desde a entrada, vs. benchmark). Mesmo mecanismo para
Gestor e especialistas (`gestor.snapshot_performance` +
`pipeline._track_specialist_portfolios`). Cripto é rastreado em USD; as demais em
reais.

---

## O que NÃO existe mais (modelo antigo, aposentado)

- ❌ Carteira ARC unificada (barbell core-satélite).
- ❌ Sleeves de renda fixa, ouro, bitcoin numa carteira macro.
- ❌ Bandas de alocação macro de 9-10 classes.
- ❌ "Rankings Top-10 em 7 categorias" num só lugar (agora cada agente faz o seu).

A camada macro (Economista) agora informa **qual tema de fator o regime favorece**
e **quais setores/geografias** — não bandas de classe.

---

## Backtest e monitoramento de fatores

- `backtest.py` — backtest histórico dos fatores de preço BR (Momentum t≈3.3,
  Baixa-Vol t≈5.5, validados na B3).
- `factor_ic.py` (+ migration 012) — Information Coefficient walk-forward por fator
  a cada run, para monitorar se os fatores seguem funcionando.

Doc educacional para o cliente leigo: `investimento_quantitativo_explicado.md`.
