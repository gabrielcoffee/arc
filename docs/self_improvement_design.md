# Design — agentes que aprendem com os próprios erros (loop semanal)

**Data:** 16/06/2026
**Objetivo:** a cada `make run` semanal, cada agente (economista, fundamentalista,
técnico, consolidador) revisa seus erros e melhora **na sua própria área** —
combinando melhoria **automática** e **manual**.

Este documento tem duas partes: **(A)** recursos da API Claude que elevam a
qualidade de cada agente agora; **(B)** o desenho do loop de auto-melhoria — o
núcleo do pedido — com a teoria, a adaptação ao caso (finanças, ground truth
atrasado) e um plano de implementação para este repo.

---

# Parte A — Recursos da API Claude por agente

Mapa do que já usamos e do que ainda rende, por agente. (Caching, batch, effort,
structured outputs e advisor já foram avaliados em `performance_api_assessment.md`.)

| Recurso | Economista | Fundamentalista | Técnico | Consolidador |
|---|---|---|---|---|
| **Extended/adaptive thinking** | ✅ recomendado (raciocínio macro) | ✅ recomendado (tese de ativo) | ➖ baixo (números determinísticos) | ✅ já ligado |
| **Web search** (server tool) | ✅ já, com `allowed_domains` | ⚠️ ligar `allowed_domains` (B3, CVM, RIs, StatusInvest) | ➖ minimal (usa `market_data`) | ✗ não busca |
| **Citations** (nativo) | ✅ ancorar afirmações às fontes | ✅ idem (múltiplos, P/VP) | ➖ | ➖ |
| **Structured outputs** | ✅ extração | ✅ extração | ✅ extração | ✅ extração |
| **Memory tool** | ⭐ lições macro | ⭐ lições de seleção | ⭐ lições de leitura | ⭐ lições de síntese |
| **Prompting best practices** | revisão contínua | revisão contínua | revisão contínua | revisão contínua |

**Ganhos concretos não explorados:**

1. **Adaptive thinking no economista e fundamentalista.** Hoje só o consolidador
   pensa. Macro (regime, dominância fiscal) e tese de ativo (valuation × cenário)
   são exatamente raciocínio profundo. Mesmo mecanismo já validado: `thinking:
   {type:"adaptive"}` + `effort`, com `max_tokens` folgado. ([Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking))

2. **`allowed_domains` no fundamentalista** (como já fazemos no economista). Hoje
   o fundamentalista busca a web aberta — restringir a fontes primárias (B3, CVM,
   RIs, StatusInvest, Fundamentei) reduz dado não verificado, que foi um problema
   real na carta do run 10 ("múltiplos não verificados via fonte primária").

3. **Citations nativo.** Em vez de o agente citar fonte em prosa (frágil), o
   recurso ancora cada afirmação ao trecho-fonte. Reduz alucinação de número.
   ([Citations](https://platform.claude.com/docs/en/build-with-claude/citations))

4. **Prompting best practices** — os prompts já são fortes (a qualidade da carta
   mostra). Onde mexer: (a) few-shot de uma seção **excelente vs fraca** por
   agente; (b) instruções "na altitude certa" (context engineering: menor conjunto
   de tokens de alto sinal); (c) regra explícita de calibração ("FORTE só com
   fonte primária e dado < 30 dias"). ([Prompt engineering](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview),
   [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents))

Estes são ganhos de **nível**, independentes do loop de aprendizado. O loop
(Parte B) é o que faz o nível **subir run a run**.

---

# Parte B — O loop de auto-melhoria

## B.1 A teoria (e por que se aplica)

Três famílias da literatura, todas reproduzíveis sem fine-tuning:

- **Reflexion** (Shinn et al., 2023): o agente converte o feedback do ambiente em
  **reflexão textual** e a guarda numa **memória episódica**, que é reinjetada na
  próxima tentativa — funciona como um "gradiente semântico". É exatamente o
  padrão "aprender com os próprios erros entre execuções". ([paper](https://arxiv.org/abs/2303.11366))
- **Self-Refine** (Madaan et al., 2023) e **CRITIC / Chain-of-Verification**:
  geração → auto-feedback → refino, **dentro da mesma execução**. Pega erros de
  processo antes de publicar. ([Self-Refine](https://arxiv.org/abs/2303.17651))
- **Otimização reflexiva de prompt** (GEPA, Agrawal et al., ICLR 2026): um
  otimizador reflete sobre **traços de execução** (entradas, saídas, falhas,
  feedback) e **propõe novo texto de prompt** focado nas falhas observadas.
  Eficiente: ganhos com ~10 exemplos e 20–100 avaliações, sem RL. É a melhoria
  **automática do prompt** em si. ([GEPA](https://github.com/gepa-ai/gepa))

O nosso `performance.py` já é um **Reflexion primitivo**: injeta "recomendações
passadas vs preço atual" no contexto. O design abaixo o generaliza e o torna
seguro.

## B.2 O problema específico de finanças: ground truth atrasado e ruidoso

Aprender com "erros" pressupõe saber o que foi erro. Em finanças isso é traiçoeiro:

- **Atraso:** uma tese de longo prazo (NTN-B longa, FII) só se confirma em
  meses/anos. O acerto de curto prazo é **ruído** (o próprio prompt já diz isso).
- **Ruído:** N pequeno de chamadas semanais → retorno recente não distingue
  processo bom de sorte.
- **Risco de overfitting:** otimizar para o que "funcionou semana passada"
  destrói o processo. A literatura de memória evolutiva alerta para deriva e
  acúmulo de lições ruins ([SSGM, 2026](https://arxiv.org/abs/2603.11768)).

**Consequência de design:** separar dois tipos de aprendizado.

| Tipo | Disponível | Sinal | Risco |
|---|---|---|---|
| **Processo** (intra-run) | toda semana, sem ground truth | a tese é coerente? evidência bate com o rótulo? seguiu o mandato? consistência interna? | baixo |
| **Resultado** (inter-run) | matura em semanas/meses | a tese se confirmou? o gatilho técnico funcionou? calibração dos rótulos | alto (ruído) |

O loop privilegia **processo**; resultado entra com **N mínimo** e como
**calibração**, nunca como "persiga o que subiu".

## B.3 Arquitetura proposta

Dois componentes novos + a generalização do `performance.py`.

```
                 ┌─────────────────────────────────────────────┐
   semana N      │  1. INJEÇÃO (antes de cada agente rodar)     │
                 │     lições ATIVAS do agente  ─►  contexto    │  ← Reflexion
                 └─────────────────────────────────────────────┘
                                    │ agentes produzem a carta
                                    ▼
                 ┌─────────────────────────────────────────────┐
                 │  2. CRÍTICO (após a carta, 1x por run)       │
                 │     Opus 4.8 + thinking, LLM-as-judge        │  ← Self-Refine /
                 │     • nota por rubrica (por agente)          │     CRITIC / CoVe
                 │     • lições acionáveis (estilo GEPA-ASI)    │
                 │     • atualiza métricas de calibração        │
                 └─────────────────────────────────────────────┘
                                    │ lições PROPOSTAS
                                    ▼
                 ┌─────────────────────────────────────────────┐
                 │  3. GATE (automático OU humano)              │
                 │     proposta ─► ativa  (com governança)      │  ← governança de
                 └─────────────────────────────────────────────┘     memória
```

### Componente 1 — Memória de lições por agente (Reflexion)
Um arquivo versionado por agente, ex.: `memory/<agente>/lessons.md` (git-tracked,
diffável, auditável — alinhado ao padrão do [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)).
Cada lição é curta, de **processo**, e datada. Injetada no contexto do agente no
início do run (estende o bloco que o `performance.py` já injeta).

### Componente 2 — Agente Crítico (Self-Refine / LLM-as-judge)
Um 5º agente, roda **ao final** do pipeline (Opus 4.8 + adaptive thinking).
Entrada: os 4 relatórios + dados realizados desde o último run + uma **rubrica por
agente**. Saída (structured outputs): por agente, `{score_por_dimensão,
lições_propostas[], flags_de_inconsistência[]}`.
- Pega erros de **processo** já neste run (ex.: a cronologia da Selic inconsistente
  do run 10 — `14,75 → 14,90` — seria um flag de consistência interna).
- Propõe lições no estilo **GEPA-ASI**: concretas, ligadas à falha observada
  ("não rotule FORTE quando a fonte for secundária", não "seja mais cuidadoso").

### Componente 3 — Gate de governança (automático vs manual)
Onde a escolha **automático × manual** vive. Três níveis:

| Nível | Como funciona | Quando usar |
|---|---|---|
| **L1 — Manual (recomendado p/ começar)** | crítico grava lições em `proposed/`; humano revisa o diff e promove p/ `active/` (um `make review-lessons` ou PR no git) | produto financeiro; auditabilidade; evita deriva |
| **L2 — Auto com guarda** | lições entram ativas automaticamente, mas com cap de tamanho, expiração, dedup e **rollback** se a nota cair | quando L1 já mostrou que o crítico é confiável |
| **L3 — Otimização de prompt (GEPA)** | periodicamente (mensal/trimestral, **não** semanal) otimiza o *system prompt* de um agente contra um eval set de runs passados; humano revisa o diff do prompt | fase madura; ganho estrutural, não incremental |

### Calibração (o aprendizado de resultado, feito direito)
Logar os **rótulos de confiança** que os agentes já emitem (evidência
FORTE/MODERADA; stance favorece/neutro/cautela) numa tabela. Conforme o ground
truth matura, computar **Brier score / ECE** por agente e realimentar:
> "Suas chamadas macro 'FORTE' acertaram 60% — 'FORTE' deveria implicar ~85%.
> Calibre para baixo ou exija fonte primária."

Isso transforma resultado ruidoso em um sinal **agregado e honesto** (calibração),
em vez de perseguir retornos individuais. LLM-as-judge é sabidamente
**superconfiante** — medir ECE/Brier é a correção recomendada. ([calibração de juízes](https://arxiv.org/abs/2508.06225))

## B.4 Rubricas por agente (cada um na sua área)

- **Economista:** fatos macro corretos e **atuais** (penalizar dado > 30 dias sem
  rótulo); citou fonte primária? rótulo de evidência bate? **consistência interna**
  (a cronologia da Selic do run 10 falharia aqui).
- **Fundamentalista:** os ativos servem ao cenário do economista? valuation com
  fonte primária (não "range observado")? diversidade de classes coerente com o
  mandato?
- **Técnico:** aderiu aos **números determinísticos** do `market_data` (não
  inventou cotação)? interpretação consistente com tendência/EMA/RSI? (este agente
  tem o ground truth mais rápido — níveis resolvem em dias/semanas).
- **Consolidador:** a síntese **representa fielmente** os 3 relatórios? consistência
  entre TL;DR, corpo e anexo? qualidade do debate/pré-mortem? calibração do stance
  agregado.

## B.5 Anti-overfitting e governança (inegociável em finanças)

1. **Processo > resultado.** Lições de resultado só com **N mínimo** (ex.: ≥ 8–12
   observações maturadas) e sempre via calibração, nunca "o que subiu".
2. **Memória governada:** cap de tamanho do `lessons.md`, **expiração** de lições
   estagnadas, dedup/consolidação, tudo em **git** (cada mudança auditável). Segue
   o alerta de memória evolutiva (deriva/colapso).
3. **Gate humano por padrão (L1).** Em produto adjacente a regulação, mudança de
   comportamento passa por revisão.
4. **Eval harness antes de promover.** Um conjunto de snapshots de runs passados
   para medir se a lição/prompt **realmente** melhora antes de virar default —
   usando a infra de A/B e `--batch` que já temos. (GEPA precisa de poucos
   exemplos: ~10.)
5. **Compliance:** o crítico **não** afrouxa disclaimers; lições nunca podem
   transformar "ilustrativo" em recomendação.

## B.6 Plano de implementação (incremental, no repo)

**✅ Fase 1 — Reflexion mínimo viável (IMPLEMENTADA)**
- `src/lessons.py` injeta `memory/<agente>/lessons.md` (ativas) no contexto de
  cada agente, ao lado do bloco de preços do `performance.py`.
- Arquivos de lições versionados em git, semeados com lições reais do run 10.

**✅ Fase 2 — Crítico + gate manual L1 (IMPLEMENTADA)**
- `src/critic.py` (Opus 4.8 + adaptive thinking + structured outputs) roda ao fim
  do pipeline; emite `{scores, proposed_lessons, consistency_flags}` por agente.
- Lições caem em `memory/<agente>/proposed/`; `make review-lessons` lista e
  `src/review_lessons.py --promote/--discard` promove para o `lessons.md` ativo.
- Tabela `agent_evals(run_id, agent, dimension, score)` (migration 005).

**✅ Fase 3 — Calibração (IMPLEMENTADA)**
- `src/calibration.py` mapeia stance → probabilidade implícita, computa
  **Brier/ECE** sobre stances maturadas (≥ `CALIB_MIN_AGE_DAYS`, ≥ `CALIB_MIN_N`)
  e propõe lição de calibração ao consolidador (gate L1). Métricas em
  `calibration_log` (migration 006). No-op gracioso até haver amostra.
- Escopo automático: stances do consolidador (ground truth de preço). Rótulos
  FORTE/MODERADA do economista/fundamentalista precisam de julgamento — extensão
  futura (provavelmente via o próprio crítico).

**Fase 4 — (opcional) GEPA / L2-L3**
- Eval set a partir do histórico; otimização reflexiva do system prompt de **um**
  agente, com revisão humana do diff. Cadência mensal/trimestral.

## B.7 O que evitar (anti-padrões)

- ❌ Reinjetar resultado de curto prazo como "erro" → persegue ruído.
- ❌ Lições vagas ("seja mais rigoroso") → sem ASI acionável, não muda nada.
- ❌ Memória que só cresce → deriva e colapso de contexto; precisa expirar/consolidar.
- ❌ Auto-promoção sem eval → o crítico também é falível e superconfiante.
- ❌ Otimizar prompt toda semana → instabilidade; GEPA é mensal/trimestral.

---

## Fontes

- Memory tool — https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
- Extended thinking — https://platform.claude.com/docs/en/build-with-claude/extended-thinking
- Citations — https://platform.claude.com/docs/en/build-with-claude/citations
- Prompt engineering — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- Effective context engineering (Anthropic) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Reflexion (Shinn et al., 2023) — https://arxiv.org/abs/2303.11366
- Self-Refine (Madaan et al., 2023) — https://arxiv.org/abs/2303.17651
- GEPA: Reflective Prompt Evolution (Agrawal et al., ICLR 2026) — https://github.com/gepa-ai/gepa
- Agentic RL survey (2025) — https://arxiv.org/abs/2509.02547
- Overconfidence in LLM-as-a-Judge (2025) — https://arxiv.org/abs/2508.06225
- Governing evolving memory in LLM agents (SSGM, 2026) — https://arxiv.org/abs/2603.11768
