# Produto ARC — Reports & Precificação

**Data:** 19/06/2026
**Status:** definido / pronto para implementação
**Contexto:** resultado de sessão de brainstorming sobre quais reports gerar, como precificar e como estruturar os planos de venda.

---

## 1. Catálogo de Reports

### Reports Base

| Report | Cadência | Público | Descrição |
|---|---|---|---|
| **Carta Semanal** | Semanal | Investidor PF médio | Análise macro + cenário + oportunidades em linguagem acessível, 2–4 páginas |
| **Aprofundamento Educativo** | Semanal | Iniciante | Agente Professor explica um tema do mercado do zero — analogia, mitos, glossário, FAQ |
| **Watchlist Semanal** | Semanal | Qualquer assinante | 3–5 ativos para monitorar na semana com preço de gatilho e motivo. Tático, complementa a Carteira sem contradizê-la |
| **Carteira ARC** | Mensal | Quem vai alocar | Portfólio recomendado ~25 ativos, estratégia barbell, 3 opiniões por ativo (economista, fundamentalista, técnico) |
| **Rankings Top-10** | Mensal | Qualquer assinante | Shortlists ranqueadas em 7 categorias: ações BR, ações EUA, FIIs, ETF B3, ETF EUA amplo, ETF internacional ex-EUA, ETF emergentes |

### Especialistas (Add-ons)

| Especialista | Cadência | O que inclui |
|---|---|---|
| **Especialista FII** | Mensal | Análise profunda de FIIs (P/VP, vacância, DY, gestora) + **Carteira de Dividendos** (sub-carteira com foco em yield sustentável) |
| **Especialista Cripto** | Mensal | Análise BTC, ETH e macro cripto, conservative sem hype + **Carteira Cripto** (posição marginal, educativa) |
| **Especialista Global** | Mensal | Cobertura de mercados globais além dos EUA: Europa (DAX, BCE), China (CSI 300, yuan, regulatório), emergentes + ranking de BDRs e ETFs globais disponíveis na B3 + impacto cambial para o investidor brasileiro |

> **Nota:** Carteira de Dividendos vive dentro do Especialista FII. Carteira Cripto vive dentro do Especialista Cripto. Não são produtos standalone.

### Report Interno (não comercializado)

| Report | Uso |
|---|---|
| **Dossiê do Comitê** | Auditoria interna — ata completa com todas as opiniões dos agentes, metadados do run, flags do crítico e scores de calibração |

---

## 2. Preço Individual de Cada Report

| Report | Preço avulso/mês |
|---|---|
| Carta Semanal | R$ 19 |
| Aprofundamento Educativo | R$ 12 |
| Watchlist Semanal | R$ 12 |
| Carteira ARC | R$ 44 |
| Rankings Top-10 | R$ 19 |
| Especialista FII | R$ 29 |
| Especialista Cripto | R$ 29 |
| Especialista Global | R$ 29 |

**Soma de tudo avulso: R$ 193/mês**

---

## 3. Planos

### Plano Carta — R$ 37/mês

| Inclui | Preço avulso |
|---|---|
| Carta Semanal | R$ 19 |
| Aprofundamento Educativo | R$ 12 |
| Watchlist Semanal | R$ 12 |
| **Total avulso** | **R$ 43** |
| **Economia** | **R$ 6** |

Público: investidor iniciante ou intermediário que quer entender o mercado sem ainda alocar com base na recomendação.

---

### Plano Gestora — R$ 67/mês ⭐ recomendado

| Inclui | Preço avulso |
|---|---|
| Carta Semanal | R$ 19 |
| Aprofundamento Educativo | R$ 12 |
| Watchlist Semanal | R$ 12 |
| Carteira ARC | R$ 44 |
| Rankings Top-10 | R$ 19 |
| **Total avulso** | **R$ 106** |
| **Economia** | **R$ 39** |

Público: investidor que quer alocar com base na recomendação e acompanhar o mercado de forma estruturada.

> Meta de conversão: 60–70% dos assinantes devem estar neste plano. O design da página deve favorecer isso (destaque visual, badge "mais escolhido").

---

### Monte sua Gestora — a partir de R$ 37

O assinante seleciona reports individualmente e paga pelo combo escolhido.

**Regras:**
- Piso mínimo de R$ 37 — qualquer combinação abaixo trava nesse valor (custo de infra é quase o mesmo para todos)
- Quando a seleção equivale a um plano fixo ou o ultrapassa, o sistema sugere a troca automaticamente:

```
Você selecionou:
  Carteira ARC        R$ 44
  Especialista FII    R$ 29
  Watchlist Semanal   R$ 12
  ─────────────────────────
  Total               R$ 85/mês

  💡 Adicione Carta Semanal + Rankings e tenha o Plano Gestora
     + Especialista FII por apenas R$ 96/mês — economize R$ 19
  → Ver Gestora + FII   (destaque)
  → Continuar com personalizado
```

Público: investidor que tem perfil específico (ex.: só quer Carteira + FII, sem Carta) ou que quer testar antes de assinar um plano fixo.

---

## 4. Especialistas como Add-on

Disponíveis em qualquer plano, incluindo Monte sua Gestora.

| Add-on | Preço |
|---|---|
| + Especialista FII | +R$ 29/mês |
| + Especialista Cripto | +R$ 29/mês |
| + Especialista Global | +R$ 29/mês |

---

## 5. Tetos de Assinatura

| Combo | Preço/mês |
|---|---|
| Plano Carta | R$ 37 |
| Plano Gestora | R$ 67 |
| Gestora + 1 especialista | R$ 96 |
| Gestora + 2 especialistas | R$ 125 |
| Gestora + 3 especialistas | R$ 154 |
| Monte sua Gestora (tudo) | R$ 164 |

---

## 6. Lógica de Precificação

**Por que os preços estão onde estão:**

- **R$ 37 (Carta)** quebra o padrão de R$ 19,99 e sinaliza qualidade sem assustar. Em produto financeiro, preço baixo demais reduz percepção de credibilidade (Rao & Monroe, 1989).
- **R$ 67 (Gestora)** é o ponto de conversão real. Para quem investe R$ 500–2.000/mês, representa 3–13% do aporte mensal. Se melhorar 0,5% do retorno, já cobriu o custo.
- **R$ 29 por especialista** é fácil de dizer sim — add-on incremental, não uma decisão de troca de plano.
- **Bundle dominance:** planos fixos custam significativamente menos que a soma das partes (Gestora economiza R$ 39 vs avulso), tornando-os racionalmente superiores.
- **Ancoragem:** o teto de R$ 154 faz R$ 67 parecer acessível mesmo para quem consideraria pagar no máximo R$ 40.

---

## 7. O que Falta Implementar

| Report | Status | Observação |
|---|---|---|
| Carta Semanal | ✅ implementado | `_carta.md` / `.html` |
| Aprofundamento Educativo | ✅ implementado | `_aprofundamento.md` |
| Carteira ARC | ✅ implementado | `_carteira.md` |
| Rankings Top-10 | ✅ implementado | dentro do `_carteira.md` |
| Watchlist Semanal | ✅ implementado | `_watchlist.md` (Haiku, usa níveis técnicos reais) |
| Especialista FII | ✅ implementado | `_especialista_fii.md` + Carteira de Dividendos |
| Especialista Cripto | ✅ implementado | `_especialista_cripto.md` + Carteira Cripto |
| Especialista Global | ✅ implementado | `_especialista_global.md`, Europa/China/emergentes |
| Dossiê do Comitê | ✅ implementado | `_dossie.md` (+ Anexo Técnico do Arquivista) |

---

## 8. Considerações Regulatórias

- Nenhum material de venda pode prometer retorno
- Usar "carteira ilustrativa", "cenário", "análise" — nunca "recomendação de compra"
- Disclaimer CVM (Resolução 20/2021) em toda landing page, e-mail de confirmação e dentro de cada report
- Especialista Cripto: cuidado redobrado — não posicionar como "investimento", mas como "análise de cenário de ativos digitais"
- Validar materiais de venda com advogado especializado em mercado de capitais antes do lançamento público (~1-2h de consultoria)

---

*Documento gerado em sessão de brainstorming em 19/06/2026. Atualizar conforme features e preços forem validados com o público-alvo.*
