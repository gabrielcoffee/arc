# Methodology — Evidence-Based Foundations for the ARC Agents

**What this document is:** the intellectual backbone of the system. Every
design decision in the agent prompts traces back to a claim made here, with a
citation. Read it when you want to understand *why* an agent does what it does,
or when you want to challenge a recommendation.

**What this document is not:** investment advice, a guarantee of outperformance,
or a complete survey of the literature. The honest framing, upfront: no
documented strategy guarantees outperformance. What the evidence offers is
(a) factors with long-run risk premia documented across decades and markets,
(b) macro frameworks that identify regimes (not predict prices), and (c) clear
evidence about what does NOT work — market timing as a primary strategy,
performance chasing, high turnover, dividend-yield-only screens. The agents
exploit (a) and (b) and are explicitly instructed to avoid (c).

**Product context (as of 2026):** this system is a weekly macro-research
letter with a long-term view, covering a broad asset universe (Brazilian and
international equities, FIIs, ETFs, fixed income, crypto marginally). It also
produces the **Carteira ARC** — a recommended, evolving portfolio built by
the Gestor (see §5) — plus the Professor's educational deep-dive, a Watchlist, and
optional niche **specialists** (FII, Crypto, Global), each with its own illustrative
sub-portfolio. The committee runs sequentially; the post-committee agents run in
parallel. A deterministic pre-fetch layer grounds the agents in primary-source
data (BCB macro, OHLCV, ranked B3 universe). It runs a **self-improvement loop**
(§6) in which a critic scores each agent and proposes lessons, with calibration.
There are no regulatory allocation floors, member caps, or instrument
restrictions. The output is framed as educational scenario analysis with a strong
CVM disclaimer (see §4 regulatory note).

---

## 1. Chief Economist — what the evidence supports

### Mandate: regime identification, not market timing
The evidence on tactical asset-class timing is weak: even professionals show
little persistent skill in switching between asset classes (Sharpe, "Likely
Gains from Market Timing", 1975; the broader market-efficiency literature from
Fama, 1970). The economist's mandate is therefore **regime identification and
asset-class/sector tilting** — a structural view that changes slowly — not
in-and-out market calls.

### Framework (priority order)

**1. BRL/USD exchange rate — co-primary macro driver.**
Brazilian empirical evidence (Influência de Variáveis Macroeconômicas no
Mercado Acionário Brasileiro, JRFM/MDPI 2025, sample 2011–2022) shows the
Ibovespa is MORE sensitive to exchange-rate shocks than to the Selic rate.
This is the most important Brazil-specific calibration in the system: the
agent is instructed to treat FX as co-equal with rates, not as a secondary
consideration. A weaker BRL favors exporters (commodities, agribusiness,
pulp/paper), benefits international assets in BRL terms (BDRs, global ETFs),
and pressures domestic companies with dollar-denominated debt.

**2. Real ex-ante interest rate vs. earnings yield.**
Compare the aggregate earnings yield of the equity market with the real
ex-ante interest rate (NTN-B / IPCA-linked bonds). CRITICAL: NEVER compare
earnings yield with the nominal Selic — this confuses inflation with real
risk (Asness, "Fight the Fed Model", 2003). The real NTN-B yield is the
correct benchmark. This indicator is used as a relative-value compass for
the fixed-income vs. equities tilt; it is one input, not the decision.

**3. DI curve slope as a cycle indicator.**
Inverted or flattening curves carry information about future economic activity
(Estrella & Mishkin, "Predicting U.S. Recessions", 1998; the DI futures /
NTN-B slope is the Brazilian analogue). IMPORTANT calibration: yield curve
predictive power is WEAKER and noisier in Brazil than in the US — treat this
signal as low-to-medium confidence.

**4. Sector sensitivity to the rate cycle.**
Duration-heavy sectors (utilities, real estate/FIIs, construction, growth
equities) are hurt by high real rates; banks and insurers may benefit from
high spreads; commodities respond to the global demand cycle and USD. The
transmission lag from Selic to corporate investment is approximately 6–9
months (UFRJ empirical evidence), so the current rate level's full effect on
corporate earnings is felt with a delay.

**5. Fiscal risk as a discount-rate channel.**
In Brazil, the debt/GDP trajectory, primary balance, and electoral cycle drive
the term premium embedded in the curve — and therefore the equity risk premium.
In 2026, high real rates are partly a fiscal credibility problem, not purely
a disinflation problem. This distinction matters for the duration of the
restrictive regime.

**6. Global context.**
The Fed, US rates, the global dollar cycle, and commodity markets affect
Brazil's asset classes directly. A weaker global USD is generally positive for
EM assets and for the BRL. Global commodity cycles drive domestic-listed
commodity exporters more than Selic does.

**Output discipline:** every allocation tilt must name the indicator, the
reading, the date, the source, and the transmission channel to the asset class.
Never produce a number without a source.

---

## 2. Fundamental Analyst — quality + value, the documented premia

### Core framework: ALWAYS combine value AND quality (never a single factor)

**Value (Fama & French, 1993; 2015).**
Cheap fundamentals outperform over the long run. Metrics: EV/EBITDA, P/L,
P/VPA vs. sector peers AND own historical range (5–10 years). Brazil-specific
calibration: the value premium is the most consistently positive classic factor
in Brazil (NEFIN-USP data imply HML ≈ +3%/year), but it is CONTESTED —
Cakici, Fabozzi & Tan (2013, *Emerging Markets Review* 16) found the value
effect is not robust in Brazil, and in five-factor tests (FIPECAFI/EBFin) HML
becomes partly redundant once profitability and investment factors are added.
**Conclusion: never buy on value alone.**

**Quality/Profitability (Novy-Marx, 2013; Asness, Frazzini & Pedersen, 2019).**
Gross profitability predicts returns (Novy-Marx, "The Other Side of Value",
*JFE* 2013). Quality — profitability, growth, safety — earns a long-run
premium (Asness et al., "Quality Minus Junk", *RAS* 2019). Brazil-specific
calibration: Bortoluzzo et al. (2021, *Brazilian Review of Finance* 19(3):
31–52, 355 stocks, 2000–2018) found quality stocks earn positive risk-adjusted
returns in Brazil, but the QMJ factor is not statistically significant as a
standalone priced factor. **Combined value + quality ("QARP") is the operative
strategy** — in the spirit of Alpha Architect's QVAL approach.

**Piotroski F-Score as a value-trap filter (Piotroski, 2000).**
9-component accounting score (profitability, leverage/liquidity, operating
efficiency). Out-of-sample international evidence: Hyde (2013, SSRN 2274516)
found a significant premium for high-F-Score stocks across MSCI EM, unrelated
to size/value/momentum. The score is most powerful in low-price, low-volume,
low-analyst-coverage stocks (Piotroski 2000) — exactly the less-followed
Brazilian names the system may highlight. A cheap stock that fails the F-Score
is a trap candidate, not a bargain.

**Investment discipline / CMA factor (Fama-French, 2015).**
Aggressive asset growers underperform. Favor disciplined capital allocators
with a track record of ROIC > cost of capital on past investments.

**Size and liquidity — the critical Brazil correction.**
The size premium is NEGATIVE in Brazil (NEFIN data, SMB ≈ −2%/year) — small
caps did NOT outperform large caps. Never buy a stock primarily because it is
small. Illiquidity is an EXPLICIT risk (the IML factor in NEFIN's framework):
evaluate average daily volume against the system's typical position size and
the cost of the bid-ask spread.

**Moat and governance (qualitative).**
Durable competitive advantage, pricing power, switching costs, management
quality. In Brazil, controlling-shareholder structure and history of related-
party transactions are first-order risks. Novo Mercado listing is a positive
governance signal (100% tag along, minimum free float) — not a guarantee.

### Anti-patterns to avoid (documented)
- Buying on dividend yield alone (DY-only mechanical screens load on value
  traps and unsustainable payout ratios).
- Extrapolating peak-cycle earnings of commodity / cyclical companies as
  permanent.
- Ignoring dilution history (equity issuances, options, subscription receipts).

### Falsifiable thesis requirement
Every stock recommendation must include: "This thesis will be WRONG if ___"
— with observable, dated triggers.

---

## 3. Technical Analyst — what survives scrutiny

### Evidence hierarchy (the agent calibrates confidence by this)

**STRONG (globally): time-series momentum / trend following.**
12-month momentum is one of the most robust documented anomalies
(Jegadeesh & Titman, 1993; Carhart, 1997; Moskowitz, Ooi & Pedersen,
"Time Series Momentum", *JFE* 2012). Practical proxy: price relative to
long EMAs, EMA alignment, 12-1 month return sign.

**CRITICAL BRAZIL CORRECTION — momentum is FRAGILE here.**
Brazilian full-sample momentum evidence is weak because momentum portfolios
crash during crises (Daniel & Moskowitz, "Momentum Crashes", 2016). Mussa,
Yang, Trovão & Famá (RAUSP, sample 1997–2014) replicate Jegadeesh-Titman
strategies and find the momentum portfolio delivers significant positive returns
OUTSIDE crisis periods but suffers sharp crashes during them. Cakici, Fabozzi
& Tan (2013) classify momentum as "weak and non-significant in most emerging
markets." **Operational conclusion:** use trend/momentum as soft confirmation
(don't buy against a clearly negative trend), never as the primary signal,
and be especially skeptical in stressed/crisis market environments.

**MODERATE: simple moving-average and breakout rules.**
Brock, Lakonishok & LeBaron (1992) found predictive content; Sullivan,
Timmermann & White (1999) showed much of it disappears under data-snooping
correction. Use EMA 20/50 for trend context, not as alpha-generating signals.

**WEAK/CONTEXTUAL: oscillators (RSI, stochastic).**
Thin standalone evidence. Use RSI-14 only to avoid buying into extreme
overbought conditions WITHIN an established uptrend — never as a trend-fading
tool or standalone trigger.

**CONFIRMATORY: volume** (Lo, Mamaysky & Wang, 2000).
Confirms, never initiates. A breakout on below-average volume is suspect.

**HEURISTIC (not predictive): support/resistance via fractal pivots.**
No rigorous out-of-sample academic support. Used only as an execution heuristic
to stage entries within a monthly contribution, never as a predictive signal.

### Mandate
The system is a long-term buyer. Technical analysis = **entry discipline** to
improve average cost; it never overrides fundamental conviction and never
recommends shorting or leverage.

### DCA vs. lump sum — the correct framing for a monthly contributor
Vanguard (Shtekhman, Tasopoulos & Wimmer, 2012, "Dollar-cost averaging just
means taking risk later"): lump-sum investment outperforms DCA approximately
two-thirds of the time in the US (and ~90% of 10-year periods vs. 36-month
DCA), because markets rise over time. **However**, the system receives
contributions MONTHLY — this is NOT a lump-sum vs. DCA decision. The monthly
contribution should be deployed PROMPTLY on arrival. Staging WITHIN a single
monthly contribution is a behavioral/transaction-cost tool, not a return-
enhancement strategy — the agent labels it explicitly as such.

---

## 4. Consolidator / Portfolio Construction

### Committee debate design
The consolidator simulates a structured debate before producing the final
letter. This design is supported by multi-agent debate research (Du, Li,
Torralba, Tenenbaum & Mordatch, 2023/ICML 2024, "Improving Factuality and
Reasoning in Language Models through Multiagent Debate", arXiv:2305.14325):
multiple rounds of explicit critique reduce hallucination and improve factual
accuracy. In this system, the consolidator: (1) identifies convergences, (2)
confronts divergences explicitly, (3) makes the strongest argument AGAINST the
main recommendation (devil's advocate), (4) revises if the counter-argument
survives (one revision round), and (5) runs a pre-mortem.

### Portfolio construction principles
> **Nota (2026):** a construção de carteira evoluiu para o **Agente Gestor /
> Carteira ARC** (§5). As diretrizes originais abaixo eram para um
> contribuinte mensal concentrando o aporte; a carteira recomendada hoje é uma
> carteira diversificada (~18–30 nomes) no estilo barbell. Mantidas aqui pelo
> princípio de **peso com rationale** e **sem alavancagem/short**, que seguem
> valendo; os números (4–6 nomes, concentrar em 1 ativo) foram superados pelo §5.

- **1/N diversification is a documented behavioral bias** (Benartzi & Thaler,
  2001, *AER*) — position weights must have a rationale, not be equal by default.
- **No leverage, no shorting** — by house policy.
- *(Histórico)* Em um aporte mensal único, concentrar para minimizar spread fazia
  sentido; com uma carteira recomendada evolutiva e rebalanceada mensalmente, a
  lógica passa a ser alocação por bandas (§5).

### Decision hygiene for the Chief Strategist
Based on Kahneman, Lovallo & Sibony (2011, *HBR*, "Before You Make That Big
Decision"), Klein (2007, *HBR*, "Performing a Project Premortem"), and Tetlock
& Gardner (2015, *Superforecasting*). Every decision entry includes:
- Outside view / base rate: how often do decisions like this work out?
- Calibrated probability with an interval (not just a point estimate; avoid
  50% as an escape from commitment).
- Pre-mortem: "It's 12 months from now and this decision failed. What happened?"
- Falsifiable invalidation trigger (observable, dated).
- Emotional check: am I chasing recent performance? FOMO?
- Quarterly process review: evaluate the DECISION PROCESS, not just outcomes
  (small samples of decisions are mostly noise).

### Public distribution framing (regulatory note)
In Brazil, analysis and recommendation of specific securities is regulated as
analyst/consultancy activity (Resolução CVM 20). The letter is framed as
educational scenario content — assets are cited as ILLUSTRATION of macro
reasoning, not buy/sell orders — with a strong disclaimer on every report.
Before distributing publicly, consult a securities lawyer (approximately 1 hour
of legal review is sufficient to understand the exposure).

---

## 5. Gestor — antifragile portfolio construction

The Gestor turns the committee's analysis into the Carteira ARC. Evidence
base (details and operating bands in `gestor_design.md`):

- **Barbell / antifragility (Taleb, *Antifragile*, 2012).** A large ultra-safe
  core (fixed income) plus a small convex sleeve (crypto) caps downside while
  keeping upside open. The safe core is the point, not a concession.
- **Diversification ~20–30 names.** Fisher & Lorie (1970) — ~32 stocks capture
  ~95% of diversification; Statman (1987) — 30–40. Beyond that, marginal benefit
  drops sharply. The Carteira targets ~18–30 names; more is noise.
- **Tactical allocation within guardrails (TAA).** Strategic policy (the barbell)
  is the centre; tactical tilts are allowed only within deviation bands. Brinson
  et al. (1986) — asset allocation explains the bulk of return variance. The
  Gestor tilts within hard per-sleeve bands enforced in code, never beyond.
- **Regime-based allocation.** Tilt toward the assets favoured by the current
  macro regime read from the economist (Bouyé & Teiletche, 2025, *FAJ*,
  "Regime-Based Strategic Asset Allocation"; Dalio's All-Weather / risk parity as
  the regime-robust archetype). Direction of the tilt is decided by the regime,
  not hard-coded.
- **Crypto sizing ≤ ~5%.** Above ~4% BTC drives >20% of portfolio risk; conserva-
  tive institutional practice is 1–5%. Hence the 1–5% band, BTC-dominant.
- **Monthly rebalance, low turnover, long-only.** Long-term horizon; a change is
  a swap, only on strong structural reason.

**Refinamentos (feedback de assessor + leitor iniciante):** as rankings são
**Top-10 em 7 categorias** (ações BR, ações EUA, FIIs, ETF B3, ETF EUA amplo, ETF
internacional ex-EUA, ETF emergentes) e a carteira tem **10 classes** (incluindo
ouro como hedge de cauda); enriquecidas por um **pré-passo de pesquisa web**; cada ativo traz
explicação em linguagem simples (`o_que_e`); a RF de marcação a mercado leva
**aviso de MtM** e segue **laddering** de prazos (fato: títulos longos IPCA+
oscilam e podem dar perda se vendidos antes do vencimento); e o relatório separa
**Brasil × Global** com nota de câmbio/BDR (nem toda ação americana tem BDR).

## 5b. Professor, Watchlist e Especialistas — educação, radar e nichos

Um agente **Professor** produz um aprofundamento educativo semanal a partir de uma
notícia recente. Princípio (explainer para iniciantes): linguagem simples,
analogias do dia a dia, blocos digeríveis, glossário, mitos×fatos e FAQ — e
**educativo, nunca preditivo** (sem previsão de preço/promessa de retorno). A carta
ganhou também um **"Radar da Semana"** (grandes movimentos do mundo/tech, com
fonte verificada) para contexto e continuidade entre edições.

A **Watchlist** (passo Haiku) destila 3-5 ativos para monitorar a partir das
seções acionáveis da carta + níveis técnicos reais — radar, nunca ordem. Os
**Especialistas** de nicho (FII, Cripto, Global) são agentes pós-comitê opcionais,
cada um com framework de análise próprio e uma sub-carteira ilustrativa (Carteira
de Dividendos, Carteira Cripto ≤5% BTC-dominante, Carteira Global com nota de
câmbio/BDR) — os produtos add-on (ver `produto_reports.md`).

## 5c. Consolidador × Arquivista — duas audiências, duas chamadas

A carta antes era gerada em duas camadas numa só chamada. Hoje o **Consolidador**
(Opus 4.8) escreve apenas a **carta pública** (clareza, analogias, síntese do
debate) e o **Arquivista** (Sonnet 4.6, sem web search) organiza o **anexo técnico**
do dossiê a partir dos relatórios brutos — *fidelidade > criatividade*. Separar as
audiências evita a perda de qualidade de misturar dois objetivos numa geração só.

## 6. Self-improvement loop — learning from the agents' own errors

The system improves week to week without fine-tuning (details in
`self_improvement_design.md`):

- **Reflexion (Shinn et al., 2023).** Verbal self-reflection stored in an
  episodic memory and re-injected next run — implemented as per-agent
  `lessons.md` (Phase 1) + a critic that proposes new lessons (Phase 2).
- **Self-Refine / CRITIC / Chain-of-Verification (Madaan et al., 2023; Gou et
  al., 2024; He et al., 2024).** An LLM-as-judge critic reviews each agent
  against a rubric and flags inconsistencies before they compound.
- **Calibration over chasing returns (Phase 3).** Short-N finance outcomes are
  noise, so outcome learning enters only as **calibration** — Brier score and
  Expected Calibration Error on the committee's stances — the standard remedy for
  the documented overconfidence of LLM judges/forecasters.
- **Reflective prompt optimization (GEPA — Agrawal et al., ICLR 2026).** Phase 4
  (skeleton): evolve the agents' own system prompts from execution traces +
  critic feedback, monthly/quarterly, behind a human gate.
- **Governance:** process > outcome; human gate on all behaviour changes; memory
  is versioned in git and bounded (guards against evolving-memory drift).

## Bibliography

**Macro / factor / evidence:**
- Fama, E. (1970). "Efficient Capital Markets." *Journal of Finance.*
- Sharpe, W. (1975). "Likely Gains from Market Timing." *Financial Analysts Journal.*
- Fama, E. & French, K. (1993). "Common Risk Factors in the Returns on Stocks and Bonds." *JFE.*
- Fama, E. & French, K. (2015). "A Five-Factor Asset Pricing Model." *JFE.*
- Carhart, M. (1997). "On Persistence in Mutual Fund Performance." *Journal of Finance.*
- Jegadeesh, N. & Titman, S. (1993). "Returns to Buying Winners and Selling Losers." *JF.*
- Moskowitz, T.; Ooi, Y. & Pedersen, L. (2012). "Time Series Momentum." *JFE.*
- Daniel, K. & Moskowitz, T. (2016). "Momentum Crashes." *JFE.*
- Novy-Marx, R. (2013). "The Other Side of Value: The Gross Profitability Premium." *JFE.*
- Asness, C.; Frazzini, A. & Pedersen, L. (2019). "Quality Minus Junk." *RAS.*
- Piotroski, J. (2000). "Value Investing: The Use of Historical Financial Statement Information." *JAR.*
- Cakici, N.; Fabozzi, F. & Tan, S. (2013). "Size, Value, and Momentum in Emerging Market Stock Returns." *Emerging Markets Review* 16.
- Bortoluzzo et al. (2021). "Analyzing the quality factor for Brazil." *Brazilian Review of Finance* 19(3):31–52.
- Mussa, A.; Yang, E.; Trovão, R. & Famá, R. "Revisitando as estratégias de momento: o mercado brasileiro é realmente uma exceção?" *RAUSP* (sample 1997–2014).
- Hyde, C. (2013). "An Emerging Markets Analysis of the Piotroski F-Score." SSRN 2274516.
- Brock, W.; Lakonishok, J. & LeBaron, B. (1992). "Simple Technical Trading Rules." *JF.*
- Sullivan, R.; Timmermann, A. & White, H. (1999). "Data-Snooping, Technical Trading Rule Performance." *JF.*
- Lo, A.; Mamaysky, H. & Wang, J. (2000). "Foundations of Technical Analysis." *JF.*
- Asness, C. (2003). "Fight the Fed Model." *Journal of Portfolio Management.*
- Estrella, A. & Mishkin, F. (1998). "Predicting U.S. Recessions." *Review of Economics and Statistics.*
- NEFIN-USP Brazilian factor library (MKT, SMB, HML, WML, IML, risk-free).
- Influência de Variáveis Macroeconômicas no Mercado Acionário Brasileiro. *JRFM/MDPI* (2025, sample 2011–2022).
- Benartzi, S. & Thaler, R. (2001). "Naive Diversification Strategies in DC Saving Plans." *AER.*
- Shtekhman, A.; Tasopoulos, C. & Wimmer, B. (2012). "Dollar-cost averaging just means taking risk later." Vanguard Research.

**Decision science:**
- Kahneman, D.; Lovallo, D. & Sibony, O. (2011). "Before You Make That Big Decision." *HBR.*
- Klein, G. (2007). "Performing a Project Premortem." *HBR.*
- Tetlock, P. & Gardner, D. (2015). *Superforecasting.* Crown.

**Portfolio construction & self-improvement:**
- Taleb, N. (2012). *Antifragile: Things That Gain from Disorder.* Random House.
- Fisher, L. & Lorie, J. (1970). "Some Studies of Variability of Returns." *J. of Business.*
- Statman, M. (1987). "How Many Stocks Make a Diversified Portfolio?" *JFQA.*
- Brinson, G.; Hood, L. & Beebower, G. (1986). "Determinants of Portfolio Performance." *FAJ.*
- Bouyé, E. & Teiletche, J. (2025). "Regime-Based Strategic Asset Allocation." *Financial Analysts Journal.*
- Shinn, N. et al. (2023). "Reflexion: Language Agents with Verbal Reinforcement Learning." arXiv:2303.11366.
- Madaan, A. et al. (2023). "Self-Refine: Iterative Refinement with Self-Feedback." arXiv:2303.17651.
- Agrawal, L. et al. (2026). "GEPA: Reflective Prompt Evolution Can Outperform RL." ICLR 2026.

**Engineering:**
- Anthropic. "Building Effective Agents." (research.anthropic.com)
- Du, Y. et al. (2023/ICML 2024). "Improving Factuality and Reasoning in Language Models through Multiagent Debate." arXiv:2305.14325.
- Resolução CVM nº 20/2021 (analyst/consultancy regulation — relevant for public distribution).
