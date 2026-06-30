# Estratégia de Monetização — ARC

> **⚠️ Atualizado 2026-06-29:** o produto técnico agora são **7 carteiras de Factor
> Investing** (ver [`arquitetura_carteiras.md`](arquitetura_carteiras.md)). Os planos
> de preço abaixo precisam ser revisados à luz desse catálogo novo.

**Status:** rascunho / brainstorming  
**Audiência:** pessoa física investidora brasileira — fundo de emergência formado, aporta R$ 500–2.000/mês

---

## 1. O conceito central: "Monte sua própria arc"

A ideia é posicionar o produto não como "newsletter financeira" (commodity, percepção de baixo valor), mas como uma **arc de AI personalizada** — algo que o usuário sente que está *construindo para si*, não apenas assinando.

Esse posicionamento é relevante porque:
- Diferencia de BTG Insights, XP Research, Kinea e concorrentes que vendem pacotes fixos institucionais
- Cria senso de propriedade (endowment effect — Thaler, 1980): o usuário que "montou" o próprio plano tem menor propensão a cancelar porque sente que o produto é dele
- Permite upsell orgânico: à medida que novos agentes são lançados, o usuário já está num framework mental de "adicionar módulos"

---

## 2. A estrutura de preços

### 2.1 Tiers fixos (âncoras principais)

Três planos fixos são a espinha dorsal. A maioria dos usuários vai para o **plano do meio** — fenômeno documentado como *compromise effect* (Simonson, 1989): quando há três opções, a intermediária é percebida como o equilíbrio entre custo e benefício.

| Plano | Conteúdo | Preço |
|---|---|---|
| **Carta** | Carta semanal de mercado + Aprofundamento educativo semanal | R$ 19,99/mês |
| **Gestora** ⭐ recomendado | Carta + Carteira ARC mensal + Rankings Top 10 | R$ 49,99/mês |
| **Completo** | Gestora + Especialistas extras (a definir) | R$ 79,99/mês |

> Os valores acima são referência de brainstorming — a decisão final depende de benchmarks de mercado e da composição final de features.

**Por que o plano do meio precisa de destaque visual?**  
*"Highlighting a middle option increases its selection by ~20%"* — Ariely, Loewenstein & Prelec (2003), *Coherent Arbitrariness*, QJE. O destaque (badge "mais escolhido", cor diferente, borda) não precisa de desconto: só de sinalização.

---

### 2.2 O personalizador — "Monte o seu"

Uma quarta opção onde o usuário seleciona features individualmente, com preços à-la-carte. A função estratégica desse módulo **não é ser o canal de venda principal** — é ser um **motor de percepção de valor** que empurra o usuário para os planos fixos.

#### Como funciona na prática

O usuário abre o personalizador, seleciona features, vê o total crescendo em tempo real — e recebe uma sugestão automática:

```
Você selecionou:  Carta semanal + Aprofundamento
Total personalizado: R$ 22,00/mês

💡 O Plano Carta tem exatamente isso por R$ 19,99/mês
   → Trocar para Plano Carta  (destaque)
   → Continuar com personalizado
```

Quando o usuário adiciona mais features e cruza o limiar do próximo plano:

```
Você está a apenas R$ 4 de ter tudo do Plano Gestora
(que inclui Rankings + Carteira ARC além do que você já selecionou)
→ Ver Plano Gestora
```

Isso é **upsell embutido no fluxo de compra**, não um banner invasivo.

#### A regra do piso mínimo

Qualquer combinação no personalizador que custaria menos que R$ 19,99 trava nesse valor. Isso por dois motivos:

1. **Econômico:** o pipeline de agentes roda com custo fixo praticamente igual para todos os assinantes (API, infra, DB). Um assinante de R$ 6,99 custa quase o mesmo para servir que um de R$ 49,99.
2. **Percepção de qualidade:** pesquisa de precificação (Rao & Monroe, 1989) mostra que preço muito baixo reduz a percepção de qualidade do produto — especialmente em serviços de informação financeira, onde credibilidade é o ativo principal.

---

## 3. Por que essa estratégia funciona — a teoria

### 3.1 Bundle dominance

Estratégia onde planos fixos são precificados abaixo da soma das partes individuais, tornando-os racionalmente superiores para qualquer combinação relevante. Exemplos reais:

- **Adobe Creative Cloud:** cada app custa ~US$ 20/mês individual; o pacote completo sai por US$ 54,99. A maioria dos usuários precisa de 4+ apps — o pacote domina.
- **Microsoft 365:** Word, Excel, PowerPoint individuais somam mais caro que a assinatura. O bundle é dominante mesmo para quem usa só 2 dos 3.
- **Streaming:** a maioria dos serviços de streaming testou à-la-carte de canais/conteúdo na década de 2010 e voltou para bundles — a conversão e o LTV são melhores.

No contexto da ARC, o personalizador serve como **visualizador do valor que o bundle entrega** — o usuário vê o preço justo de cada peça, e o plano fixo aparece como vantagem clara.

### 3.2 Anchoring (ancoragem de preço)

Mostrar R$ 79,99 como opção máxima faz R$ 49,99 parecer acessível — mesmo que o usuário nunca considerasse pagar mais de R$ 30 antes de ver a página. Documentado extensamente por Tversky & Kahneman (1974) e replicado em contextos de e-commerce e assinatura (Ariely, 2008, *Predictably Irrational*).

A âncora funciona mesmo quando o usuário sabe que está sendo ancorado.

### 3.3 Endowment effect no personalizador

Quando o usuário **constrói** o próprio plano — seleciona features, vê o total mudar — ele desenvolve senso de propriedade mesmo antes de comprar. Thaler (1980) mostrou que pessoas valorizam mais objetos que "possuem" (mesmo que momentaneamente). No personalizador, o usuário sente que o plano é **dele** antes de assinar, o que:

- Reduz churn no primeiro mês (período mais crítico)
- Aumenta a probabilidade de upgrade posterior ("eu mesmo escolhi esse plano, posso ajustar quando quiser")

### 3.4 Paradoxo da escolha — o limite

Barry Schwartz (*The Paradox of Choice*, 2004) documentou que a partir de ~7 opções simultâneas, a satisfação com a escolha cai e a taxa de desistência sobe. Portanto:

- **Página principal:** máximo 3 cards fixos + 1 CTA para o personalizador
- **Personalizador:** máximo 8-10 features toggleáveis, agrupadas em categorias (não uma lista plana)
- **Não lançar tudo de uma vez:** começar com as features mais claras (Carta, Carteira, Rankings básicos) e adicionar Especialistas como upgrades no roadmap

---

## 4. Módulos (a definir)

> Esta seção é intencionalmnete vaga — as features serão definidas conforme o produto evolui. A estrutura abaixo é uma referência do que o sistema já produz hoje.

### Módulos base (já existem no sistema)

| Módulo | Descrição | Cadência |
|---|---|---|
| Carta Semanal | Análise macro + cenário + oportunidades | Semanal |
| Aprofundamento Educativo | Professor: explicação de um tema do mercado para iniciantes | Semanal |
| Carteiras de Fator | 7 carteiras de Factor Investing (ações BR Retorno Total e Dividendos, ETFs B3, FIIs, Cripto, ações US, ETFs intl), cada uma alocada e com tracking | Mensal |
| Rankings Top 10 | Rankings por nicho (FIIs, Cripto, ações US, ETFs intl) curados pelos especialistas | Mensal |

### Módulos extras em potencial (futuro)

| Módulo | Descrição |
|---|---|
| Especialista de FII | Agente focado exclusivamente em fundos imobiliários — P/VP, vacância, DY |
| Especialista de Cripto | Análise aprofundada de BTC e exposição digital — conservative, sem hype |
| Carteira de Dividendos | Sub-variante da Carteira ARC com foco em yield sustentável |
| Alerta de Rebalanceamento | Notificação quando a carteira recomendada sofre mudança relevante |
| Acesso a dados brutos (CSV/API) | Para o perfil mais técnico — exportação dos indicadores macro e fundamentais |

---

## 5. Fluxo de conversão recomendado

```
Landing page
│
├── Hero: "Monte sua própria arc de AI"
│     (headline + 1 frase de benefício + CTA principal)
│
├── 3 cards de planos fixos
│     Carta | [Gestora ⭐] | Completo
│     (Gestora destacado visualmente)
│
├── "Prefere montar do zero?" → abre Personalizador
│     ├── Checkboxes agrupados por categoria
│     ├── Total em tempo real
│     ├── Sugestão de plano equivalente quando aplicável
│     └── CTA: "Assinar personalizado" | "Ver Plano X" (segundo em destaque)
│
└── Social proof + FAQ + Disclaimer CVM
```

---

## 6. Considerações regulatórias (não ignorar)

O produto opera sob o framework de **pesquisa educacional com disclaimer CVM** (Resolução CVM 20). A precificação e o marketing precisam manter essa coerência:

- **Não prometer retorno** em nenhum material de vendas
- **Não usar "recomendação de compra"** — usar "carteira ilustrativa", "cenário", "análise"
- **Disclaimer em toda landing page e e-mail de confirmação**, não só dentro dos relatórios
- Feature "Carteira de Dividendos" deve ser posicionada como *análise de ativos* que historicamente distribuem dividendos — não como promessa de renda

Antes de lançar publicamente, 1-2h com um advogado especializado em mercado de capitais é suficiente para validar os materiais de venda.

---

## 7. Próximos passos

- [ ] Definir lista final de features do MVP
- [ ] Validar preços com 5-10 entrevistas com o público-alvo (pessoa física, investe regularmente)
- [ ] Prototipar o personalizador — testar se o comportamento de "sugestão de plano" converte
- [ ] Definir benchmark: qual plano representa 60-70% das conversões? (esse é o Plano Gestora — o design deve forçar isso)
- [ ] Consulta legal antes do lançamento público

---

*Documento vivo — atualizar conforme as features e preços forem definidos.*
