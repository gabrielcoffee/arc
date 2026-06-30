# Factor Investing — Modelo Multifator ARC (AFM-BR)

> **Nota 2026-06-29:** este doc é a fonte da verdade dos fatores das **ações BR**
> (AFM-BR — Valor lidera). O análogo para os **EUA** é o **AFM-US** (Qualidade +
> Momentum lideram; Valor secundário — Fama-French 5). FIIs, cripto e ETFs têm
> metodologias próprias. Visão geral: [`arquitetura_carteiras.md`](arquitetura_carteiras.md).

**Status:** estratégia **fechada** (substitui o rascunho de requisitos anterior).
**Escopo (decisão travada):** o comitê passa a girar em torno de **Factor Investing
em ações brasileiras** (`acoes_br`). O Fundamentalista e o Gestor são reorientados
a fatores; macro, global, cripto e FII permanecem como **camadas de suporte/contexto**,
não mais como o centro do produto.

> **Como ler este doc:** é a fonte de verdade da estratégia de fatores. A base de
> evidências detalhada (com citações) vive em [`methodology.md`](methodology.md) §2;
> a mecânica de carteira em [`gestor_design.md`](gestor_design.md); o **registro das
> decisões da revisão de jun/2026** (o que mudou e por quê) em
> [`revisao_fatores_2026-06.md`](revisao_fatores_2026-06.md). Onde houver conflito,
> **este doc prevalece para a parte de fatores**.

---

## 0. Premissa e nomenclatura (importante)

"Fama-French de verdade" constrói **séries de retorno de fatores** (carteiras
long-short; serve para *explicar* retorno). O que construímos aqui é um **score
multifator de seleção** — um número por ação para **rankear e escolher** —, usando
os fatores que a Fama-French *identificou* como base teórica. São coisas distintas;
mantemos a estética FF (z-scores, neutralização setorial, pernas long-short para
validação), mas o produto é o **ranking**, não o modelo de pricing.

Cada fator **não é um indicador único**, e sim um conjunto de "fatorzinhos"
combinados com pesos diferentes. Os **fatores** são decididos pela teoria; os
**pesos**, calibrados por backtest com penalização de instabilidade do ranking
(parcimônia/anti-overfit — guard INTERNO de calibração, **não** um custo de transação;
o produto é ilustrativo e não mostra custo/imposto/venda ao cliente).

---

## 1. Vereditos da pesquisa (o que mudou vs. o rascunho original)

Todas as decisões abaixo foram validadas em papers/journals (não blogs). Fontes em
§5 e em `methodology.md`.

| Tema | Rascunho original | Decisão fechada | Por quê (evidência) |
|---|---|---|---|
| **Valor** | P/L 3a com peso dominante | **EV/EBIT lidera**, depois P/L 3a, depois P/VP | EV/EBIT é neutro a estrutura de capital; no BR (juro alto/volátil) o lucro líquido é a métrica mais distorcida. Magic Formula BR (SciELO/RAM) usa EV/EBIT por incorporar a dívida. |
| **Qualidade** | ROE/ROIC/margens | **ROIC 2a + Gross Profitability + Margem Líq.** | Gross profits-to-assets tem ~o mesmo poder preditivo que book-to-market e é proxy melhor que ROE (Novy-Marx 2013). |
| **Crescimento** | fator próprio (lucro 3a) | **REBAIXADO a filtro** (elimina quem encolhe; não premia quem cresce) | Prêmio de crescimento é nulo/negativo; o lado premiado é o conservador (CMA / Fama-French 2015; Leite et al.: "Low Investment" funciona no BR). |
| **Baixa Vol** | IBLV como referência | **Mantido** (σ + β), IBLV = S&P/B3 Low Volatility | Anomalia robusta (Frazzini-Pedersen, Betting Against Beta). |
| **Momentum** | 6 meses, retorno total | **6 meses, retorno total, PULANDO o último mês, AJUSTADO A RISCO (÷ vol do nome)** | Skip-month evita reversão de curto prazo (Jegadeesh-Titman 1993). O ajuste a risco (Barroso & Santa-Clara 2015) ataca o **crash de momentum**: o backtest próprio (cap 60, 6 anos com COVID) mostra que o momentum CRU teve spread Q5−Q1 mediano **negativo** no ciclo completo (quebrou no crash) e o ajustado o tornou **positivo** (+0.55%/mês). Custo: IC um pouco menor em períodos calmos. Para uma carteira long-only servida a assinantes, robustez de ciclo > IC na bonança. Toggle: `config.AFM_MOMENTUM_RISK_ADJ` (default ligado). **Achado adjacente: na base própria Low-Vol > Momentum (t≈4.3 vs ≈2)** — reavaliar o peso de M no Φ (ver §3.3/§3.5). |
| **Dividendos** | DY com peso alto | DY mantido, mas a **carteira de dividendos é descontada** na fórmula-mãe | DY não é fator independente: é explicado por valor+qualidade+defensivo; contribuição do "yield puro" é até negativa (J. of Asset Management 2023). |
| **Tamanho** | não funciona (PIB volátil) | **Conclusão certa, mecanismo corrigido** | Size é fraco globalmente; some ao controlar por **junk/qualidade** (Asness et al., JFE) e, no BR, por **liquidez** (NEFIN: SMB≈−2%/ano). PIB é overlay do economista, não a causa. |
| **Combinação** | evitar empilhar muitos fatores | **Valor+Momentum** é a dupla campeã; multifator **integrado** > empilhamento ingênuo | Negativamente correlacionados → diversificação (Asness/Moskowitz/Pedersen, JF 2013). |

---

## 2. As duas carteiras temáticas (a "carteira recomendada" que se desdobra)

A carteira recomendada se divide em **dois perfis**, ambos servidos pelo mesmo motor:

- **Carteira Retorno Total** = **Valor + Momentum** (a dupla com melhor suporte
  acadêmico; momentum pesa um pouco mais NESTA persona — par V+M clássico). Ressalva:
  no Φ-mestre e na base própria, **Baixa-Vol/Valor lideram e Momentum é marginal**
  (ajustado a risco — §1, §3.5).
- **Carteira Dividendos Defensiva** = **Dividendos + Baixa Volatilidade** (perfil
  renda/defensivo; ciente de que os dois se sobrepõem — por isso é tratada como
  *persona*, não como tese de alpha independente).

E o **ranking-mestre de `acoes_br`** é feito pelo nosso score $\Phi$ (§3).

---

## 3. O cálculo próprio — AFM-BR (ARC Factor Model, Brasil)

### 3.1 Preparação

- Universo $\mathcal{U}$: ações líquidas da B3.
- **Filtro de liquidez** $\mathcal{U}_L$: volume médio diário ≥ limiar (ADTV).
- Cada sub-indicador vira **z-score cross-sectional, neutralizado por setor e
  winsorizado a ±3**, com sinal alinhado (maior = melhor).

### 3.2 Fatores (cada um = vários "fatorzinhos")

```
V_i = 0.45·z(EBIT/EV) + 0.35·z(L_3a / P) + 0.20·z(VP / P)          # Valor
Q_i = 0.40·z(ROIC_2a) + 0.35·z(LucroBruto/Ativos) + 0.25·z(MargemLíq)   # Qualidade
M_i = z( RetornoTotal_{t-6 → t-1} / σ_i )                          # Momentum ajustado a risco (pula último mês; ÷vol = crash-aware)
L_i = 0.50·z(−σ_12m) + 0.50·z(−β)                                  # Baixa Volatilidade
D_i = 0.70·z(DY_12m) + 0.30·z(crescimento de dividendos)           # Dividendos
```

Em LaTeX (para o report "vibe quant"):

$$V_i = 0{,}45\,z(\tfrac{\text{EBIT}}{\text{EV}}) + 0{,}35\,z(\tfrac{L_{3a}}{P}) + 0{,}20\,z(\tfrac{VP}{P})$$
$$Q_i = 0{,}40\,z(\text{ROIC}_{2a}) + 0{,}35\,z(\tfrac{\text{LucroBruto}}{\text{Ativos}}) + 0{,}25\,z(\text{MargemLíq.})$$
$$M_i = z\!\left(\text{RetTotal}_{t-6 \to t-1}\right);\quad L_i = 0{,}5\,z(-\sigma_{12m}) + 0{,}5\,z(-\beta);\quad D_i = 0{,}7\,z(\text{DY}_{12m}) + 0{,}3\,z(\Delta\text{Div})$$

### 3.3 Carteiras temáticas (blend de fatores)

```
S_RT_i = 0.45·V_i + 0.55·M_i     # Retorno Total: persona par V+M (M já ajustado a risco; §3.2)
S_DD_i = 0.50·D_i + 0.50·L_i     # Dividendos Defensiva
```

### 3.4 Portão de crescimento (filtro, não fator)

```
g_i = (Lucro_líq_t / Lucro_líq_{t-3}) − 1        # CAGR de 3 anos do lucro
gate_g(i) = 1 se g_i ≥ ḡ  (ḡ ≈ 0; elimina quem encolhe), senão 0
```

### 3.5 Equação-mãe (score de ranking)

> **Revisado 2026-06-30:** o Φ deixou de ser o **produto** das duas carteiras
> temáticas (geométrico). Aquela forma exigia que cada ação fosse boa em estilos
> **negativamente correlacionados** (Valor+Momentum × Dividendos+BaixaVol) — premiava
> o *all-rounder morno* e destruía a diversificação Valor×Momentum, que só existe no
> nível da **carteira**, não dentro de cada ação. Além disso dava peso material a
> **Dividendos**, fator redundante (Income Illusions 2023).

O Φ passa a ser a **soma ponderada por evidência dos z-scores dos fatores**
(percentilizada para exibição), **excluindo Dividendos** (que vive só na persona
Defensiva). Soma — não produto — deixa um especialista forte em V **ou** M ranquear
bem, e a carteira colhe os dois fatores:

$$\Phi_i = \mathbb{1}[i\in\mathcal{U}_L]\cdot\mathbb{1}[g_i\ge\bar g]\cdot r\!\Big(w_L L_i + w_V V_i + w_M M_i + w_Q Q_i\Big)$$

```
Φ_i = liquidez(i) · gate_g(i) · percentil( w_L·L + w_V·V + w_M·M + w_Q·Q )
```

- **Pesos default (`config.AFM_MASTER_W`): L 0.30, V 0.30, M 0.20, Q 0.20.** Low-Vol e
  Valor lideram — Low-Vol é o fator-rei no backtest próprio (t≈4.3) e Valor o clássico
  mais robusto no BR (EV/EBIT); Momentum é rebaixado (marginal/frágil, t≈2, e já
  ajustado a risco — §1) e Qualidade é overlay. Dividendos **não entra** no mestre.
- Para a **Carteira Retorno Total**, ranqueia-se por $S^{\text{RT}}$; para a
  **Dividendos Defensiva**, por $S^{\text{DD}}$ (onde D pertence). O ranking-mestre
  usa $\Phi$.

### 3.6 Camada "Fama-French de verdade" (validação)

Para cada fator $f$, construímos a perna long-short clássica (rebalance mensal,
value-weighted, skip-month no momentum) e medimos o prêmio — é o que legitima o
rótulo "estilo FF":

$$R^{f}_{t} = \frac{1}{|H|}\sum_{i\in H} r_{i,t} \;-\; \frac{1}{|L|}\sum_{i\in L} r_{i,t}$$

### 3.7 Calibração dos pesos (backtest, sem overfit)

```
w* = argmax_w  IR( Φ(w) )  −  λ·Turnover(w)
     s.a.  Σ w = 1,  w ≥ 0
```

Regra de ouro: **fatores pela teoria; pesos pelo backtest.** Backtest sempre
out-of-sample, point-in-time, no universo líquido. Pode haver mais de um conjunto
de pesos (um por carteira temática).

**Barra de significância (multiple testing).** Um fator só é tratado como
significativo com **t-stat > 3** (`config.IC_T_SIGNIFICANT`), não t>2 — Harvey, Liu &
Zhu (2016) mostram que t>2 produz falsos positivos demais dado o multiple testing da
literatura de fatores. Testamos vários fatores correlacionados (s_rt/s_dd/Φ combinam
V/Q/M/L), então usamos o hurdle t>3 em vez de uma correção FDR (que assumiria
independência — falsa aqui). Na base própria: **L (t≈4.6) e Q (t≈3.8) cruzam a barra;
M (t≈2.1) fica como "promissor mas abaixo"** — coerente com momentum ser marginal no BR.

---

## 4. Onde isso entra no projeto (mapa de implementação)

| Camada | Arquivo | Muda para |
|---|---|---|
| **Cálculo quant** | `src/fundamentals_screen.py` `_score()` | vira o **AFM-BR** (5 fatores, sub-indicadores, z-score setor-neutro, filtro de liquidez). Hoje é só `value(P/L)+quality(ROE,margem)`. |
| **Prompt do analista** | `src/prompts.py` `FUNDAMENTALIST_SYSTEM` | reescrito **factor-investing-first**: recebe os scores AFM e racionaliza (não inventa fatores). |
| **Carteira** | `src/gestor.py` | acrescenta as **carteiras temáticas de ações** (Retorno Total / Dividendos Defensiva) + ranking `acoes_br` por $\Phi$. |
| **Evidências** | `docs/methodology.md` §2 | atualizar pesos (EV/EBIT>P/L, +gross profitability, DY redundante, crescimento rebaixado). |
| **Persistência** | `sql/` | nova tabela `factor_scores` (breakdown por ação) + dimensão `theme`. |
| **Render** | `src/reports.py` | tabelas das duas carteiras temáticas + breakdown de fatores. |

### Dados: fonte definida (Partnr) + mapa de validação na base própria

Fonte = **Partnr** (`src/partnr_data.py`): ~110 razões contábeis (com `reference_date`
E `publish_date`), demonstrações brutas e OHLCV diário. O AFM-BR é plugável a ela.

**O que conseguimos validar na NOSSA base (não só na literatura) — `src/backtest.py`:**

| Fator | Validação point-in-time | Resultado |
|---|---|---|
| **L** Baixa-Vol | preço (sem look-ahead) | ✅ IC forte, t≈4.3 — fator-rei na base |
| **M** Momentum | preço (sem look-ahead) | ✅ real mas marginal (t≈2); ajustado a risco (§1) |
| **Q** Qualidade | **PIT real** via `publish_date` (NET/GROSS margin + ROE) — `--quality` | ✅ **IC 0.087, t=3.75** (cruza t>3); spread Q5−Q1 +2.07%/mês. Q5<Q4 ("qualidade cara") reforça parear com Valor (QARP). |
| **V** Valor | ❌ **não-validável** | Partnr não tem razões de valuation (P/L, EV/EBIT, P/VP) e não dá nº de ações histórico → EV/EBIT e P/VP não reconstrutíveis sem viés. Peso ancorado em literatura (EV/EBIT lidera no BR — Magic Formula). |
| **D** Dividendo | ❌ **não-validável** | DY e CAGR de dividendos só existem em TTM (sem histórico anual). Já fora do Φ-mestre (§3.5); só na persona Defensiva. |

Conclusão honesta: **3 dos 5 fatores (L, M, Q) são empiricamente validados na base**; V
fica como o único "ato de fé" (bem-documentado) no mestre, e D não entra no mestre. A
infra de `publish_date` (`_pit_ratio_value`) fica reutilizável para futuros fatores
fundamentais que a fonte permita validar.

---

## 5. Fontes (papers/journals — base dos vereditos de §1)

- Asness, Moskowitz & Pedersen (2013). "Value and Momentum Everywhere." *Journal of Finance* 68(3).
- Novy-Marx (2013). "The Other Side of Value: The Gross Profitability Premium." *JFE*.
- Asness, Frazzini, Israel, Moskowitz & Pedersen. "Size Matters, If You Control Your Junk." *JFE*.
- Frazzini & Pedersen (2014). "Betting Against Beta." *JFE*.
- Jegadeesh & Titman (1993). "Returns to Buying Winners and Selling Losers." *JF* (skip-month).
- Fama & French (2015). "A Five-Factor Asset Pricing Model." *JFE* (fator CMA/investimento).
- "Behavioral Finance: Magic Formula in the Brazilian Stock Market." *SciELO/RAM* (EV/EBIT > P/L no BR).
- "Optimal constrained strategies for factor-based investing in the Brazilian market." *RCF/SciELO* (momentum forte; SMB/HML≈0).
- "Factor Sufficiency in Asset Pricing: An Application for the Brazilian Market." *MDPI/IJFS* (FF5 insuficiente no BR).
- "Income Illusions: Challenging the High Yield Stock Narrative." *J. of Asset Management* (2023) (DY redundante).
- S&P/B3 Low Volatility Index (IBLV) — metodologia pública.

## 6. Próximos passos

1. **Definir a fonte de dados** (blocker de §4) — autor.
2. Atualizar `methodology.md` §2 com os vereditos de §1.
3. Implementar o AFM-BR em `fundamentals_screen.py` (plugável à fonte).
4. Reescrever `FUNDAMENTALIST_SYSTEM` factor-first.
5. Adicionar as carteiras temáticas ao Gestor + persistência + render.
</content>
</invoke>
