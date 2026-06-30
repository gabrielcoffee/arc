# Revisão de Especialista do Modelo de Fatores — Registro de Decisões (junho/2026)

> **O que é:** o registro conciso das decisões tomadas na revisão do AFM-BR feita como
> *especialista de mercado* (não de engenharia), com a evidência e os ponteiros para
> doc-fonte e código. É um **changelog de decisões** — as fórmulas e a evidência
> detalhada vivem em [`fama_french_fatores_br.md`](fama_french_fatores_br.md) e
> [`methodology.md`](methodology.md). Onde houver conflito, aqueles prevalecem.
>
> **Método da revisão:** *medir antes de decidir.* Cada mudança de comportamento foi
> instrumentada e validada no backtest próprio (`src/backtest.py`) antes de ser adotada.

## A tese que emergiu

Na **base própria** da B3 (point-in-time, incluindo a COVID), os fatores que sobrevivem
à régua séria são **Baixa-Vol e Qualidade** (cruzam `t>3`). **Momentum é marginal e
frágil** (literatura forte em 2003–2022, mas `t≈2` no ciclo completo e quebra em crises).
**Valor** não é validável na nossa fonte, mas é o clássico mais robusto no BR (EV/EBIT).
**Dividendo** é redundante. O modelo foi reponderado para refletir isso — em vez da
intuição inicial de "momentum-rei".

## Os 5 itens

| # | Decisão | Evidência / motivo | Onde no código | Status |
|---|---|---|---|---|
| **1** | **Momentum ajustado a risco** (retorno 6-1 ÷ vol do nome) | Crash de momentum (Barroso & Santa-Clara 2015; Mussa et al.). Backtest 6a c/ COVID: spread Q5−Q1 do momentum CRU **negativo** → ajustado **positivo** (+0.55%/mês). Custo: IC um pouco menor em calmaria. | `config.AFM_MOMENTUM_RISK_ADJ`; `fundamentals_screen._risk_adjusted_momentum`; `backtest` (compara cru×ajustado) | ✅ adotado |
| **2** | **NÃO mostrar custo/imposto/giro/venda ao cliente** | Decisão de produto: a carteira é **ilustrativa** (Top-10 que troca por melhor). Cheguei a implementar medição de giro/custo e **removi tudo** a pedido. | (removido: `turnover.py`, `COST_*`, linhas `__cost__`/`__net__`) | ⛔ removido |
| **3** | **Φ-mestre = soma ponderada de fatores** (não produto de carteiras); **Dividendo fora**; pesos L 0.30, V 0.30, M 0.20, Q 0.20 | O produto geométrico exigia cada ação boa em estilos negativamente correlacionados → premiava all-rounder morno e matava a diversificação V×M. Soma deixa especialistas ranquearem; carteira colhe os fatores. Low-Vol promovido (fator-rei da base). | `config.AFM_MASTER_W`; `fundamentals_screen._score_frame` | ✅ adotado |
| **4** | **Qualidade validada point-in-time**; V e D não-validáveis via Partnr | `publish_date` permite PIT real. Q: IC 0.087, **t=3.75** (cruza t>3), spread Q5−Q1 +2.07%/mês. V (sem razões de valuation + sem nº ações histórico) e D (só TTM) não são testáveis → V ancorado em literatura, D fora do mestre. | `backtest.run_quality_backtest` / `--quality`; `_pit_ratio_value` | ✅ validado |
| **5** | **Barra de significância t>3** (multiple testing) | Harvey, Liu & Zhu (2016): t>2 gera falsos positivos demais. Fatores correlacionados (s_rt/s_dd/Φ) → t>3 em vez de FDR (que assumiria independência). | `config.IC_T_SIGNIFICANT`/`IC_T_PROMISING`; `factor_ic`, `backtest` | ✅ adotado |

## Placar de validação dos fatores (base própria)

| Fator | Peso no Φ | Validação na base | Veredito |
|---|---|---|---|
| **L** Baixa-Vol | 0.30 | preço PIT, **t≈4.6** | ✅ robusto |
| **V** Valor | 0.30 | não-validável (sem razões de valuation) | 📚 literatura (EV/EBIT) |
| **M** Momentum | 0.20 | preço PIT, **t≈2.1** | ~ promissor (ajustado a risco) |
| **Q** Qualidade | 0.20 | **PIT real** via publish_date, **t≈3.8** | ✅ robusto |
| **D** Dividendo | — (fora) | só TTM, não-validável | ❌ fora do mestre (só persona Defensiva) |

## Terreno aberto (próximos passos sugeridos)

- Revisitar o peso 0.30 do **Valor** — o único não-validado no mestre (precisa de fonte
  com razões de valuation ou nº de ações histórico para um backtest PIT honesto).
- Levar o mesmo rigor de backtest PIT ao **AFM-US**.
