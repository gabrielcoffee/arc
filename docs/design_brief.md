# ARC — Design Brief para Claude Design

> **⚠️ Atualizado 2026-06-29:** o produto agora são **7 carteiras de Factor Investing**
> (ver [`arquitetura_carteiras.md`](arquitetura_carteiras.md)). Telas que mostrem a
> "Carteira ARC barbell", sleeves ou alocação macro de 10 classes devem ser
> repensadas para mostrar as carteiras de fator + ranking + performance por carteira.

> Documento de identidade visual e estrutura de produto para uso no Claude Design.
> Objetivo: criar um site e sistema de design completo para a plataforma ARC —
> uma plataforma de inteligência artificial para investidores pessoas físicas brasileiras.

---

## 1. O produto em uma frase

**ARC é uma plataforma de inteligência artificial** que produz, toda semana, uma carta de mercado e, todo mês, uma carteira de investimentos recomendada — geradas por um comitê de agentes de AI especializados que pesquisam, debatem e aprendem com os próprios erros.

---

## 2. O usuário

Pessoa física brasileira, 25–45 anos. Investe entre R$ 500–2.000/mês. Tem fundo de emergência formado, usa corretora (XP, Clear, Rico), já leu sobre Tesouro Direto e ações, mas não tem tempo nem expertise para fazer análise semanal por conta própria. Quer tomar decisões mais inteligentes sem depender de influencer financeiro ou assessor de banco.

**Perfil psicográfico:** pragmático, curioso, levemente cético (já foi queimado por "guru" de finanças), valoriza dados e transparência sobre promessas vagas. Aprecia design limpo — usa Notion, Linear, talvez Figma. Não quer sentir que está num site de banco do século XX, nem num app de criptomoeda com cores neon.

---

## 3. Referências visuais (em ordem de prioridade)

| # | Site | O que extrair |
|---|---|---|
| 1 | Dia Browser (diabrowser.com) | Minimalismo produtivo, warmth sem perder seriedade, seções numeradas, copy conversacional |
| 2 | Paper Design (paper.design) | Dual theme clean, composições assimétricas fluidas, "anti-slop" ethos — design com propósito |
| 3 | Devouring Details (devouringdetails.com) | Two-column layouts, tipografia como estrutura, restraint intencional sem animações desnecessárias |
| 4 | Anthropic Glasswing (anthropic.com/glasswing) | Gravidade institucional, alta credibilidade, copy que lida com complexidade sem simplificar demais |
| 5 | Luma (luma.com) | Whitespace generoso, CTAs limpos, acessibilidade e otimismo sem ser infantil |

**Síntese:** O site deve sentir como **um produto de tecnologia sério que respeita a inteligência do usuário** — não um app de fintech colorido, não um relatório de banco. A referência mental é: *se a The Economist tivesse um produto SaaS construído pela equipe que fez o Linear*.

### Tradução prática do Dia Browser para o ARC

O Dia Browser é a referência #1 — o design deve ser **praticamente uma cópia de linguagem visual**. O que isso significa concretamente:

| Elemento Dia Browser | Equivalente ARC |
|---|---|
| Fundo branco limpo (`#FAFAFA`) com warmth sutil | `#FAFAF8` como base, zero gradientes de fundo |
| Seções numeradas `01 / 02 / 03` em monospace cinza | Mesma convenção nas seções "Como Funciona" |
| Screenshots do produto ocupando metade da tela | Mockups da carta/dashboard como prova real |
| Tipografia sem-serifa leve, tracking normal | Geist Regular no corpo — sem bold desnecessário |
| Espaço em branco como elemento de design | Margens generosas; nunca comprimir para encaixar mais conteúdo |
| Copy curto, direto, sem adjetivos de marketing | Tom do briefing de voz (seção 7) |
| Nenhuma ilustração genérica ou ícone decorativo | Apenas screenshots reais, diagramas de dados e tipografia |
| Hover states sutis (não flashy) | Apenas mudança de cor de border e shadow suave |

**O que NÃO copiar do Dia Browser:** o foco em browser/produtividade pessoal. O ARC é financeiro — os componentes de dados (tabelas, badges, gráficos) precisam de mais estrutura tipográfica do que o Dia usa.

---

## 4. Sistema de design

### 4.1 Paleta de cores

> **Modo primário: claro.** Referência direta ao Dia Browser — superfícies brancas limpas,
> tipografia em preto quente, espaço em branco generoso. O escuro é alternativo/opt-in.

**Modo claro (primário):**
```
Background principal:   #FAFAF8  (branco quente — não puro, não frio)
Background elevado:     #FFFFFF  (cards, modais)
Background sutil:       #F3F3F0  (hover states, separadores, row stripes)
Border:                 #E4E4DF  (linhas, divisores — quente, não cinza azulado)
Texto primário:         #111110  (preto quente)
Texto secundário:       #6B6B6A  (labels, metadados — warm mid-gray)
Texto desabilitado:     #ABABAA
```

**Accent (único — usar com parcimônia):**
```
Accent principal:       #A07A3E  (âmbar mais escuro — lê bem no claro)
Accent hover:           #8C6A32
Accent sutil (bg):      #A07A3E12  (7% opacity — badges, highlights)
```

**Modo escuro (alternativo):**
```
Background principal:   #0C0C0E
Background elevado:     #131316
Background sutil:       #1A1A1F
Border:                 #2A2A32
Texto primário:         #F2F2F0
Texto secundário:       #8A8A96
Accent:                 #C8A96E  (âmbar mais claro no escuro)
```

**Semânticas (valem nos dois modos):**
```
Positivo (alta, favorece):   #2E7D52  (verde — lê bem no claro e escuro)
Negativo (queda, cautela):   #C0392B  (vermelho — discreto mas legível)
Neutro/atenção:              accent do modo ativo
```

**Por que âmbar/ouro:** evoca gráficos de candlestick, referência visual ao mercado financeiro, comunica inteligência e valor sem ser flashy. No modo claro, a versão mais escura (#A07A3E) garante contraste mínimo WCAG AA sobre fundos brancos.

---

### 4.2 Tipografia

**Display / Headlines grandes:**
```
Família:  "Instrument Serif" ou "Playfair Display" (serif editorial)
Uso:      Hero headline, número de destaque, nome da carta semanal
Peso:     Regular (400) — não bold; serifa fina é mais sofisticada
```

**UI / Corpo / Labels:**
```
Família:  "Geist" ou "Inter" (sans-serif geométrica moderna)
Uso:      Navegação, botões, body copy, tabelas, metadados
Pesos:    400 (body), 500 (labels), 600 (destaques), 700 (CTA)
```

**Monospace (código / dados):**
```
Família:  "Geist Mono" ou "JetBrains Mono"
Uso:      Tickers de ativo (ITUB4, IVVB11), preços, percentuais,
          blocos de indicadores econômicos
```

**Escala tipográfica:**
```
xs:   11px / 1.4  — labels de metadado, badges
sm:   13px / 1.5  — corpo secundário, captions
md:   15px / 1.6  — corpo principal
lg:   18px / 1.5  — lead / intro paragraphs
xl:   24px / 1.3  — subheadlines de seção
2xl:  36px / 1.2  — headlines de seção
3xl:  52px / 1.1  — hero headline (sans-serif)
4xl:  72px / 1.0  — número de destaque (serif)
```

---

### 4.3 Espaçamento e grid

```
Grid base: 8px
Colunas:   12 colunas, gap 24px
Max-width: 1200px (conteúdo), 1440px (backgrounds)

Espaçamento de seção (vertical):  120px desktop / 80px mobile
Padding de card:                   24px
Border-radius de card:             12px
Border-radius de botão:            8px
Border-radius de badge:            4px
```

---

### 4.4 Componentes base

**Botão primário:**
```
Background: #A07A3E
Texto:      #FFFFFF
Hover:      background #8C6A32, leve escala scale(1.01)
Border-radius: 8px
Padding: 12px 24px
Font: Geist 500 14px
Transição: 150ms ease
```

**Botão secundário:**
```
Background: transparent
Border: 1px solid #E4E4DF
Texto: #111110
Hover: background #F3F3F0
```

**Card:**
```
Background: #FFFFFF
Border: 1px solid #E4E4DF
Border-radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
Hover (se clicável): border-color #A07A3E60, shadow levemente mais forte
Transição: 200ms ease
```

**Badge:**
```
Tipos: favorece (verde), neutro (âmbar), cautela (vermelho)
Font: Geist Mono 11px uppercase
Padding: 3px 8px
Border-radius: 4px
```

---

### 4.5 Motion

**Princípio:** movimento com propósito. Nenhuma animação existe para parecer moderno — existe para comunicar uma relação de causa e efeito.

```
Micro-interações (hover, click):    150ms ease
Transições de componente (open/close): 200ms ease-out
Scroll-triggered reveals:           fade-up, 400ms, staggered 80ms entre items
Número contando (métricas):         800ms ease-out
Linha de gráfico se desenhando:     1200ms ease-in-out (home apenas)
```

**O que NÃO fazer:**
- Parallax pesado
- Animações que atrasam leitura de conteúdo
- Loading spinners sem necessidade
- Transições de página com efeito de slide/flip

---

## 5. Estrutura do site — páginas

### Página 1: Home (`/`)

**Objetivo:** converter o visitante que ainda não sabe o que é o produto.

**Seções em ordem:**

**① Hero**
```
Headline (serif 72px): "Seu comitê de analistas.
                        Funciona toda semana."
Subline (sans 18px):   "Quatro agentes de AI especializados pesquisam,
                        debatem e entregam uma carta de mercado e uma
                        carteira recomendada — toda semana, sem exceção."
CTA principal:         "Ver planos" (botão âmbar)
CTA secundário:        "Como funciona ↓" (link texto)
Visual:                Diagrama animado dos 4 agentes em conversa
                       (estilo terminal/log, não robô ou abstrato)
```

**② Como funciona — sequência numerada (01 → 05)**
```
01 — O Economista-Chefe lê o mundo
     Visual: scroll de notícias sendo filtradas, indicadores BCB/IBGE aparecendo
     Copy: "Todo run começa com a macroeconomia. Juros, câmbio, fiscal,
            cenário global — o Economista busca nas fontes primárias
            (BCB, IBGE, FGV) e identifica o regime."

02 — O Analista Fundamentalista escolhe os ativos
     Visual: tabela de ativos sendo ranqueados (P/L, EV/EBITDA, ROIC)
     Copy: "Com o cenário macro em mãos, o Fundamentalista seleciona ativos
            ilustrativos — ações, FIIs, ETFs, renda fixa — usando valor +
            qualidade. Nenhum ativo entra só por ser famoso."

03 — O Analista Técnico confirma o momento
     Visual: gráfico de candlestick com EMAs traçadas
     Copy: "EMA20, EMA50, RSI, MACD — calculados com dados reais de OHLCV,
            não estimados. O Técnico contextualiza o momento de cada ativo
            sem inventar cotação."

04 — O Editor-Chefe sintetiza e debate
     Visual: três relatórios entrando, uma carta saindo
     Copy: "O consolidador recebe os três relatórios, confronta divergências,
            faz o papel de advogado do diabo — e escreve a carta em duas
            camadas: uma parte pública acessível e um anexo técnico."

05 — O sistema aprende com os próprios erros
     Visual: loop de feedback (crítico → lição → próximo run)
     Copy: "Após cada carta, um crítico de AI avalia o processo de cada agente.
            As lições viram memória — e o próximo run começa melhor."
```

**③ O que você recebe — preview das entregas**
```
Tabs: [Carta Semanal] [Carteira Mensal] [Rankings] [Aprofundamento]
Cada tab mostra um preview real (truncado) de um output do sistema
Visual: mockup de documento com tipografia editorial
```

**④ Prova social / credibilidade**
```
3-4 métricas de destaque (número serif grande + label mono):
  "17 runs" — semanas consecutivas produzidas
  "4 agentes" — especializados e orquestrados
  "Brier score" — calibração verificável das previsões
  "0 alucinações de preço" — dados de mercado determinísticos

(Usar números reais do sistema quando disponíveis)
```

**⑤ CTA final**
```
Headline: "Comece com a Carta. Expanda quando quiser."
Subline:  "Cancele a qualquer momento. Sem fidelidade."
CTA:      "Ver planos" + "Ler uma carta de exemplo →"
```

---

### Página 2: Como Funciona (`/como-funciona`)

Página longa, educativa. Expande o "como funciona" da home com mais profundidade técnica — para o usuário que quer entender antes de assinar.

**Seções:**
1. O comitê de agentes (cards de cada agente com mandato, fontes, método)
2. Pipeline de execução (diagrama técnico simplificado)
3. Como os dados chegam (brapi, yfinance, BCB, web search restrito a fontes primárias)
4. O loop de auto-melhoria (Reflexion → Crítico → Calibração — explicado sem jargão)
5. Transparência metodológica (link para methodology.md em versão legível)
6. Disclaimer CVM em destaque (não escondido no rodapé)

---

### Página 3: Planos (`/planos`)

Implementa a estratégia de monetização descrita em `monetizacao_estrategia.md`.

**Layout:**

**① Headline + toggle mensal/anual**
```
Headline: "Monte sua própria gestora"
Subline:  "Escolha o plano ou personalize cada feature."
Toggle:   Mensal | Anual (desconto 20% no anual)
```

**② 3 cards de planos fixos**
```
Layout: 3 colunas, card central com borda âmbar e badge "mais escolhido"

[Plano Simples]   [Plano Essencial ⭐]   [Plano Completo]
R$ XX,XX/mês      R$ XX,XX/mês           R$ XX,XX/mês
──────────────    ──────────────────     ─────────────────
✓ [feature A]     ✓ [feature A]          ✓ Tudo do Essencial
✓ [feature B]     ✓ [feature B]          ✓ [feature extra]
                  ✓ [feature C]          ✓ [feature extra]
                  ✓ [feature D]          (features a definir)

[Começar]         [Começar] ←CTA        [Começar]
                  primário âmbar
```

**③ "Ou monte o seu" — personalizador interativo**
```
Accordion com checkboxes agrupados por categoria
Total em tempo real (fonte monospace âmbar grande)
Badge de sugestão quando atinge threshold:
  "💡 Plano Gestora tem tudo isso por R$ 49,99 — economize R$ X"
  [Switch para Gestora] [Continuar personalizado]

Piso mínimo: R$ 19,99 (qualquer combinação abaixo trava aqui)
```

**④ FAQ de precificação**
```
Perguntas: "Posso cancelar a qualquer momento?"
           "Como funciona o plano anual?"
           "O que é o Especialista Extra?"
           "Recebo acesso imediato?"
```

---

### Página 4: Dashboard do Assinante (`/app`)

Ambiente autenticado. O conteúdo exibido depende do plano do usuário.

**Layout geral:**
```
Sidebar fixa (esquerda, 240px):
├── Logo
├── [Carta Semanal] — sempre visível
├── [Carteira ARC] — lock se não tem plano
├── [Rankings] — lock se não tem plano
├── [Aprofundamento] — sempre visível
├── [Especialistas] — lock se não tem plano
└── Configurações / Plano

Conteúdo principal (direita):
├── Header: "Semana de DD/MM/YYYY" + badge do run
└── Conteúdo da seção selecionada
```

**Seção: Carta Semanal**
```
Layout: duas colunas
  Esquerda (lista):
    Cada semana = um card com:
    - Data (DD/MM/YYYY)
    - Headline macro da semana (ex: "Selic estável, câmbio pressionado")
    - Badge de regime (expansão / contração / neutro)
    - Indicadores-chave em monospace (Selic %, IPCA %, USD/BRL)

  Direita (preview do documento):
    A carta renderizada em markdown com tipografia editorial
    Seções: TL;DR → Cenário → Radar → Oportunidades → Riscos → Debate
    Botão: "Baixar PDF" | "Abrir completo"
```

**Seção: Carteira ARC**
```
Header: versão atual (Mês/Ano) + data de última atualização

Gráfico de alocação (donut ou treemap, usando accent âmbar + tons neutros):
  Sleeves: RF (30%), ETF EUA (25%), FIIs (10%), Ações BR (10%)...

Tabela de holdings:
  Colunas: Ativo | O que é | Sleeve | Peso | Retorno desde entrada | Stance
  Rows com monospace para tickers e números

Performance vs benchmark:
  Gráfico de linha simples (carteira âmbar vs benchmark cinza)
  Brier score da última calibração
```

**Seção: Rankings**
```
Tabs: [Ações BR] [ETFs] [FIIs] [Ações EUA] [Emergentes]
Cada tab: lista numerada Top 10 com ticker, rationale (2-3 linhas) e badge de stance
```

**Lock state (feature não contratada):**
```
Blur no conteúdo (não esconder — mostrar o que está sendo perdido)
Overlay com:
  "Esta feature faz parte do Plano Gestora"
  Preview das últimas 2 semanas desfocado
  [Fazer upgrade] (âmbar)
```

---

### Página 5: Metodologia (`/metodologia`)

Versão legível do `methodology.md` — fundamental para construir confiança.

**Por que essa página existe:** o usuário cético quer saber *como* o sistema funciona antes de confiar com seu dinheiro. Esta página responde isso com transparência radical.

**Seções:**
1. Princípios gerais (regime macro, não market timing)
2. O que o sistema usa e por que (Fama-French, NEFIN, calibrações Brasil)
3. O que o sistema *não* faz (sem alavancagem, sem day trade, sem promessa de retorno)
4. Como medimos se estamos calibrados (Brier score, ECE — explicados sem jargão)
5. Limitações honestas (amostra pequena, ground truth atrasado)
6. Disclaimer completo CVM

**Tom:** técnico mas acessível. Comparável ao "how we work" da Anthropic ou da Stripe.

---

### Página 6: Carta de Exemplo (`/exemplo`) — pública, sem login

Uma carta semanal real publicada publicamente — funciona como isca de conversão.

**Estratégia:** o melhor argumento de venda é o produto em si. Uma carta bem escrita, com dados reais, metodologia clara e design editorial limpo converte melhor que qualquer copy de marketing.

**Layout:** a carta em full-width com tipografia editorial (serif para headlines, sans para corpo). No final: "Receba toda semana → [Ver planos]"

---

### Página 7: Sobre (`/sobre`) — opcional

Curta. O produto, a filosofia, o disclaimer completo. Sem fotos de equipe (produto first).

---

## 6. Componentes específicos do produto financeiro

### Badge de stance
```
favorece:  fundo #4CAF7214, borda #4CAF72, texto "FAVORECE"
neutro:    fundo #C8A96E14, borda #C8A96E, texto "NEUTRO"
cautela:   fundo #E05A5A14, borda #E05A5A, texto "CAUTELA"
Font: Geist Mono 10px uppercase tracking-widest
```

### Indicador econômico inline
```
[SELIC] [14.75%] [BCB · Jun/26]
  ^label  ^valor mono  ^fonte + data
Background: #F3F3F0, border: 1px solid #E4E4DF, border-radius: 4px, padding: 4px 8px
Font: Geist Mono; label em texto secundário, valor em texto primário
```

### Card de holding (carteira)
```
┌─────────────────────────────────────────────────┐
│ IVVB11          ETF S&P 500 em reais      25.0% │
│ ─────────────────────────────────────────────── │
│ O que é: ETF que replica o S&P 500 comprado     │
│ em reais na B3 (IVVB11)                         │
│                                                  │
│ +4.2% desde entrada  ·  sleeve: etf_us          │
│ [FAVORECE]                                      │
└─────────────────────────────────────────────────┘
```

### Linha do tempo semanal (sidebar/index)
```
• Semana 17 · 16/06/2026  ← ativa
  "Fiscal deteriora, câmbio pressionado"
  Selic 14.75% · USD/BRL 5.72

○ Semana 16 · 09/06/2026
  "Copom mantém, inflação surpreende"
  ...
```

---

## 7. Copy e tom de voz

**Princípios:**
- **Claro antes de inteligente** — se a frase parece esperta mas confusa, cortar
- **Dados têm fonte e data** — nenhum número flutua sem referência
- **Sem promessa de retorno** — "pode se beneficiar", "tende a favorecer", nunca "vai subir"
- **Respeitar a inteligência do leitor** — não explicar o óbvio, explicar o não-óbvio
- **Humor quando couber** — discreto, britânico, nunca forçado

**Exemplos de copy:**
```
❌ "Turbine sua carteira com AI de ponta!"
✅ "Quatro especialistas de AI. Uma carta toda semana. Você decide o que fazer."

❌ "Nossa tecnologia revolucionária analisa o mercado em tempo real"
✅ "O economista pesquisa nas fontes do BCB, IBGE e FGV.
    O fundamentalista filtra por valor e qualidade.
    O técnico confirma o momento com dados reais de OHLCV.
    O editor sintetiza, debate, e entrega."

❌ "Descubra as melhores ações AGORA"
✅ "Rankings semanais de ativos — com rationale, não só ticker."
```

---

## 8. Disclaimer — posicionamento visual

O disclaimer CVM não deve ser um rodapé minúsculo que ninguém lê. Deve aparecer:
1. **Na home**, como uma nota de rodapé visível (não em 8px cinza)
2. **No topo de cada carta** (o consolidador já insere — preservar no render)
3. **Na página de planos**, antes do CTA
4. **No dashboard**, em um banner fixo discreto

```
Texto padrão:
"Conteúdo educativo e de cenário — não constitui recomendação de 
investimento ou oferta de valores mobiliários (Res. CVM 20/2021).
Os ativos mencionados são ilustrativos do raciocínio de cenário.
Consulte um profissional habilitado antes de investir."
```

---

## 9. Checklist para o Claude Design

- [ ] Criar sistema de design completo (tokens de cor, tipografia, espaçamento)
- [ ] Layout da Home com as 5 seções descritas
- [ ] Layout da Página de Planos com personalizador interativo
- [ ] Layout do Dashboard com sidebar + 3 seções principais
- [ ] Componentes: badge de stance, card de holding, indicador econômico, linha do tempo
- [ ] **Light mode como primário**; dark mode alternativo opt-in
- [ ] Versão mobile responsiva das páginas principais
- [ ] Estado de lock (feature não contratada) no dashboard
- [ ] Mockup de uma carta renderizada com tipografia editorial

---

*Este documento é um brief vivo — atualizar conforme as features e preços forem definidos.*
