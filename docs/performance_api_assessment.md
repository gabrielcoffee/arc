# Avaliação técnica — otimização de performance dos agentes (API Claude)

**Data:** 16/06/2026
**Escopo (quando escrito):** pipeline `arc-AI` (4 agentes — economist,
fundamentalist, technical em Sonnet 4.6 + web search; consolidator em Opus 4.8;
extração em Haiku 4.5). Execução **semanal**. Saída: carta + relatório full.

> **Nota (atualização):** o sistema cresceu para **7 agentes** (+ Gestor,
> Professor, Crítico) e 6 reports — ver `referencia_agentes.md`. Os recursos de API
> avaliados aqui (caching, batch, effort/adaptive thinking, advisor, fast mode)
> seguem válidos; effort+thinking já aplicados no consolidador/gestor, structured
> outputs na extração e nos rankings.

> "Performance" aqui cobre três eixos: **custo** (tokens), **latência** (irrelevante p/ job semanal) e **qualidade** (o que mais importa nesta aplicação).

---

> **Estado (16/06/2026):** itens 1, 2, 3 e 5 implementados e validados contra a
> API real. O item 4 foi **cancelado** — a cadeia é sequencial (ver §4). Detalhes
> de configuração na seção [Estado da implementação](#estado-da-implementação).

## TL;DR — parecer por recurso

| Recurso | Vale a pena? | Eixo | Esforço | Prioridade | Status |
|---|---|---|---|---|---|
| **Structured outputs** | **Sim** — substitui o hack de extração | Qualidade/robustez | Baixo | 🥇 1 | ✅ feito |
| **Batch processing** | **Sim** — corta 50% do custo | Custo | Médio | 🥈 2 | ✅ feito (`--batch`) |
| **Effort + adaptive thinking** | **Sim** — dial de custo/qualidade | Ambos | Baixo | 🥉 3 | ✅ feito |
| **Advisor tool** | Talvez — avaliar em A/B | Qualidade | Médio | 4 | ✅ feito (opt-in) |
| **Paralelizar fundam.+técnico** | ~~Sim~~ **Não dá** — ver §4 | Latência | — | ✗ | ❌ cancelado |
| **Prompt caching** | Manter; ganho marginal | Custo | Baixo | 5 | já existia |
| **Fast mode** | **Não** | Latência | — | ✗ | descartado |

---

## 1. Prompt caching — manter, ganho marginal (cadência semanal mata o cache)

**Como funciona (preços atuais):** write 5min = 1,25× input base; read = 0,1× input base; write 1h = 2×. Mínimo cacheável: **1.024 tokens** (Sonnet 4.6 / Opus 4.8), **4.096** (Haiku 4.5). TTL: 5min (default, renovado de graça a cada hit) ou 1h.

**O problema para este pipeline:** o run é **semanal**. O TTL máximo é **1 hora**. Logo o cache **nunca sobrevive de um run para o outro** — toda execução começa fria. Não há ganho run-a-run, ponto.

**E dentro de um run (~7 min)?** A hierarquia do cache é `tools → system → messages`. Cada agente tem um **system prompt diferente**; como `system` vem antes de `messages`, um system diferente já quebra o prefixo — então **não há reaproveitamento de cache entre agentes** dentro do run.

**Onde realmente ajuda:** dentro do *loop de web search de um mesmo agente*. Cada round-trip do server tool reenvia system + tool defs + transcript crescente; o cache de 5min cobre isso. O `cache_control` que já existe no system prompt captura a maior parte.

**Ação (baixa prioridade):** garantir que o breakpoint fique no **último bloco estático** (system + tool defs + contexto que não muda no run). Conteúdo que varia (timestamp, query específica) deve vir **depois** do breakpoint. Marginal, mas grátis.

---

## 2. Batch processing — maior alavanca de custo (50% off)

**Como funciona:** API assíncrona, **50% de desconto em todos os tokens** (input e output), maioria conclui em <1h, SLA de 24h. Web search e demais server tools funcionam em batch. Empilha com prompt caching.

**Fit:** excelente no eixo custo/latência — **ninguém espera o relatório semanal em tempo real**. Pagar metade aceitando minutos/horas de latência é troca óbvia.

**A ressalva — dependências:** batch é para requisições **independentes**. O pipeline é sequencial com dependência de dados (economista define o universo → fundamentalista/técnico → consolidador). Não dá pra expressar a cadeia toda num único batch.

**Padrão recomendado (staging):**
1. Economista → batch de 1 item.
2. Fundamentalista + Técnico → batch de 2 itens (independentes entre si; ver §4).
3. Consolidador → batch de 1 item.

Mesmo batches de tamanho 1 já garantem o desconto de 50%. Para um job semanal, 3 estágios sequenciais de batch (cada um tipicamente minutos) é perfeitamente aceitável.

**Esforço:** médio — trocar o caminho síncrono `messages.create` por `batches.create` + polling, e orquestrar os estágios. Combina com 1h-cache para hit-rate melhor intra-batch.

**Veredito:** implementar. É o maior corte de custo disponível, com latência que esta aplicação não percebe.

---

## 3. Effort + adaptive thinking — dial de custo/qualidade (1 parâmetro)

**`effort`** (sem beta header) controla quanto o modelo "gasta" — afeta texto, tool calls e thinking. Níveis: `low / medium / high (default) / xhigh / max`. Suportado em Opus 4.8 e Sonnet 4.6.

- **Consolidador (Opus 4.8):** habilitar **adaptive thinking** (`thinking: {type: "adaptive"}`) + `effort`. O agente que mais se beneficia de raciocínio profundo é justamente o que faz o debate do comitê + pré-mortem. `high` é o sweet spot; `xhigh` se os evals mostrarem ganho. **Esta é a alavanca de qualidade do agente mais importante.** (Opus 4.8 **não** aceita `budget_tokens` manual — só adaptive.)
- **Agentes de pesquisa (Sonnet 4.6):** o default recomendado da Anthropic é **`medium`** para economizar; hoje você paga `high` implícito. Para pesquisa onde qualidade importa, dá pra manter `high` — o ponto é **passar a ter o controle explícito** em vez de pagar profundidade não pedida.

**Esforço:** baixíssimo (parâmetro por agente). **Veredito:** implementar, com effort explícito por papel + adaptive thinking no consolidador.

---

## 4. Paralelizar fundamentalista + técnico — ❌ CANCELADO (não há independência)

A avaliação inicial supôs que fundamentalista e técnico eram independentes entre
si. **A leitura do código (`pipeline.py`) mostrou o contrário:** o técnico
depende do fundamentalista — `_extract_tickers(results["fundamentalist"])`
extrai os tickers do bloco estruturado do fundamentalista e busca os dados de
mercado (`market_data.get_snapshot`) a partir dessa lista. Logo a cadeia é
**100% sequencial**: economista → fundamentalista → técnico → consolidador.

Consequência prática: não existe par paralelizável, e o **batch (§2) opera como
batches de 1 item por estágio** — o ganho é puramente o desconto de 50%, não
paralelismo. A referência da Anthropic (orquestrador + subagentes paralelos,
+90,2% a ~15× tokens) só se aplica a tarefas decomponíveis em ramos
independentes, que não é o caso deste comitê.

---

## 5. Advisor tool — promissor para qualidade, avaliar em A/B

**Como funciona:** um **executor** mais barato (Sonnet 4.6) consulta um **advisor** mais forte (Opus 4.8) no meio da geração; o advisor lê o transcript inteiro e devolve um plano (~400–700 tokens; cap recomendado `max_tokens: 2048`). O grosso da geração continua na taxa do Sonnet. Beta header `advisor-tool-2026-03-01`.

**Fit:** a doc cita explicitamente "pipelines de pesquisa multi-step" e o caso "uso Sonnet em tarefas complexas → adicione Opus como advisor para ganho de qualidade a custo similar ou menor". Casa com os agentes de pesquisa.

**Ressalvas:** (a) ganho é **task-dependent** — "avalie no seu próprio workload"; (b) **não ajuda o consolidador** (já é Opus 4.8, o topo); (c) é beta. Funciona em batch.

**Veredito:** vale um **A/B em um agente** (ex.: fundamentalista), medindo qualidade da carta com/sem advisor. Não rollout cego.

---

## 6. Fast mode — não serve a este caso

Só **Opus 4.6/4.7** (não o Opus 4.8 do consolidador), **6× o preço**, acelera **output tokens/seg** (não TTFT), e está em **beta com waitlist**. Para um relatório semanal a latência é irrelevante — pagar 6× por velocidade que não usamos é o oposto do que queremos. **Descartar.**

---

## 7. Structured outputs — substitui o hack de extração (melhor custo-benefício)

Hoje a extração (`agents.py`) usa **Haiku + forced tool use + fallback de regex**. O recurso nativo `output_config.format` com `json_schema` faz **constrained decoding** — JSON **garantidamente válido** contra o schema, sem regex de fallback, sem retries por schema inválido. Suportado em Haiku 4.5.

- Troca código frágil e custom por uma **garantia da plataforma**.
- Cuidado: schema inválido ainda pode vir em `stop_reason: "refusal"` ou `"max_tokens"` — tratar esses dois casos (alinha com o log de `stop_reason` que já adicionamos).
- Grammar é compilada e cacheada por 24h; primeira chamada com schema novo tem latência extra (irrelevante semanalmente).

**Esforço:** baixo. **Veredito:** implementar — limpa o `agents.py` e elimina uma fonte real de fragilidade.

---

## Roadmap (execução)

1. ✅ **Structured outputs** na extração — feito.
2. ✅ **Effort explícito + adaptive thinking no consolidador** — feito.
3. ✅ **Batch processing** (`--batch`, batches de 1 item por estágio) — feito.
4. ❌ **Paralelizar fundamentalista+técnico** — cancelado (dependência de dados, §4).
5. ✅ **Advisor tool** — feito, opt-in para A/B.
6. ⬜ **Prompt caching** — ajuste fino do breakpoint (opcional, baixo retorno).
7. ❌ **Fast mode** — não fazer.

> Observação metodológica: cada mudança deveria passar por um eval comparando carta antes/depois (mesma data-base, mesmo universo) antes de virar default — exatamente o tipo de verificação que o pipeline já valoriza.

---

## Estado da implementação

Tudo abaixo foi validado contra a API real (chamadas reais a Sonnet 4.6, Opus 4.8
e Haiku 4.5). Nenhuma mudança exigiu migração de banco.

### Structured outputs (extração)
`agents.py::_extract_structured` usa `output_config={"format": {"type":
"json_schema", "schema": ...}}` (constrained decoding) em vez de forced-tool-use +
regex. Trata `stop_reason` `refusal`/`max_tokens` caindo no fallback de regex.
**Nota:** Haiku 4.5 **não** suporta `effort` — por isso a extração usa
`output_config` só com `format`.

### Effort + adaptive thinking
`config.EFFORT` (por agente) e `config.THINKING_AGENTS` (consolidador). Adaptive
thinking só no Opus 4.8. `max_tokens` do consolidador subiu para **20.000** —
thinking e texto dividem o mesmo teto, e 20k fica **sob o guard de streaming** do
SDK (`max_tokens > 128000/6 ≈ 21.333` força streaming numa chamada não-stream).

### Batch processing
`pipeline.py --batch` → `agents.run_agent_batched` → `_submit_and_wait` (cria
batch de 1 request, polling, trata loop de `pause_turn`). Caminho síncrono é o
default e permanece intacto.

### Advisor tool (opt-in)
`config.ADVISOR_AGENTS` (vazio por default). Anexa o tool advisor (Opus 4.8,
`max_tokens` 2048) às tools do agente; `_create` e o batch ficam beta-aware
(`advisor-tool-2026-03-01`, rota `client.beta`). `_run_sync` trata `pause_turn`
também no síncrono.

### Variáveis de ambiente / flags

| Controle | Default | Efeito |
|---|---|---|
| `--batch` (flag CLI) | off | Roteia agentes pela Batches API (50% off, assíncrono) |
| `ARC_EFFORT_RESEARCH` | `high` | Effort dos agentes Sonnet (economista/fundam./técnico) |
| `ARC_EFFORT_CONSOLIDATOR` | `high` | Effort do consolidador (Opus 4.8) |
| `ARC_CONSOLIDATOR_THINKING` | `1` | Liga/desliga adaptive thinking no consolidador |
| `ARC_ADVISOR_AGENTS` | `""` | Lista (CSV) de agentes com advisor Opus, ex.: `fundamentalist` |
| `ARC_ADVISOR_MODEL` | `claude-opus-4-8` | Modelo advisor |
| `ARC_ADVISOR_MAX_TOKENS` | `2048` | Teto rígido de output do advisor |
| `ARC_BATCH_POLL_SECONDS` | `20` | Intervalo de polling do batch |

### A/B sugerido (advisor)
Rodar mesma data-base com e sem advisor no fundamentalista, comparando a carta:

```bash
python -m src.pipeline --agents all                                  # baseline
ARC_ADVISOR_AGENTS="fundamentalist" python -m src.pipeline --agents all
```

---

## Fontes

- Prompt caching — https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Batch processing — https://platform.claude.com/docs/en/build-with-claude/batch-processing
- Fast mode — https://platform.claude.com/docs/en/build-with-claude/fast-mode
- Advisor tool — https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool
- Effort — https://platform.claude.com/docs/en/build-with-claude/effort
- Structured outputs — https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- Building a multi-agent research system (Anthropic Engineering) — https://www.anthropic.com/engineering/multi-agent-research-system
- Effective context engineering for AI agents (Anthropic Engineering) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
