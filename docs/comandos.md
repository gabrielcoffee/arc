# Comandos — ARC

> **Atualizado 2026-06-29:** arquitetura atual em
> [`arquitetura_carteiras.md`](arquitetura_carteiras.md). Demos dos motores de
> fator: `python -m src.backtest`, `python -m src.etf_screen`,
> `python -m src.fii_screen`, `python -m src.crypto_screen`, `python -m src.us_screen`.

Referência de tudo que dá para rodar: targets do `make`, flags do `pipeline.py` e
scripts diretos. Os targets do `make` carregam o `.env` automaticamente e ativam a
`.venv`. `make help` lista todos com uma linha de descrição.

---

## Setup (uma vez)

| Comando | O que faz |
|---|---|
| `make setup` | Cria a `.venv` e instala as dependências (`requirements.txt`) |
| `make db` | Sobe o Postgres (Docker) e aplica `sql/*.sql` no primeiro boot; espera ficar saudável |
| `make migrate` | (Re)aplica as migrations em ordem num banco **já de pé** |
| `make smoke` | Valida conexão ao DB, schema, API key e fetch de market data antes do 1º run |

```bash
cp .env.example .env     # cole seu ANTHROPIC_API_KEY (e BRAPI_TOKEN opcional)
make setup
make db
source .venv/bin/activate
make smoke
```

> `BRAPI_TOKEN` (opcional) habilita o screen do universo B3 (Fundamentalista).
> Sem ele, o pipeline roda — só pula o screen. O macro do BCB (`macro_data.py`) e
> o OHLCV (yfinance) não precisam de token.

---

## Rodar o pipeline

| Comando | O que faz |
|---|---|
| `make run-economist` | Só o Economista — teste incremental, leia criticamente |
| `make run` | **Run completo:** comitê + pós-comitê (Gestor, Professor, Watchlist, Arquivista, Crítico) + os **3 especialistas** |
| `make run-lean` | Run completo **sem** os especialistas de nicho (mais barato/rápido) |
| `make run-batch` | Run completo via Batches API — **50% mais barato**, assíncrono (~1h SLA) |
| `make run-rebalance` | Run completo **forçando rebalance** do Gestor agora (ignora a cadência mensal) |

O Gestor só recria a carteira quando a última versão tem ≥ 28 dias
(`ARC_GESTOR_REBALANCE_DAYS`); nos demais runs ele só registra performance. Use
`make run-rebalance` para forçar uma nova versão.

### Direto pelo `pipeline.py` (controle fino)

```bash
python -m src.pipeline --agents all                       # = make run
python -m src.pipeline --agents economist                 # começo incremental
python -m src.pipeline --agents economist,fundamentalist  # subconjunto, em ordem
python -m src.pipeline --agents all --batch               # Batches API
python -m src.pipeline --agents all --rebalance           # força rebalance
python -m src.pipeline --trigger scheduled                # marca como agendado (cron)
```

#### Flags de passos (ligam/desligam pós-comitê)

| Flag | Efeito |
|---|---|
| `--no-critic` | Pula o Crítico (loop de auto-melhoria) e a Calibração |
| `--no-gestor` | Pula o Gestor (carteira + snapshot de performance) |
| `--no-professor` | Pula o Professor (aprofundamento educativo) |
| `--no-watchlist` | Pula a Watchlist Semanal |
| `--especialistas fii,cripto,global` | Seleciona quais especialistas rodar (padrão: os três) |
| `--especialistas none` | Pula todos os especialistas (= `make run-lean`) |
| `--especialistas fii,global` | Só FII e Global |
| `--rebalance` | Força rebalance do Gestor agora |
| `--batch` | Roteia as chamadas pela Batches API (50% mais barato, assíncrono) |

Exemplos combinados:

```bash
# Rápido e barato: comitê + carta + carteira, sem nichos nem professor
python -m src.pipeline --agents all --no-professor --especialistas none

# Só o especialista de FII desta semana
python -m src.pipeline --agents all --especialistas fii

# Run semanal agendado, batch, completo
python -m src.pipeline --agents all --trigger scheduled --batch
```

---

## Carteira (Gestor)

| Comando | O que faz |
|---|---|
| `make gestor-only RUN=17` | Roda **só o Gestor** sobre os relatórios de um run passado (sem re-rodar o comitê) |
| `make run-rebalance` | Força um novo rebalance dentro de um run completo |
| `make reset-portfolio` | **APAGA** a Carteira ARC (todas as versões) para reconstruir do zero |

```bash
# Reconstruir a carteira do zero:
make reset-portfolio
make run-rebalance
```

> `reset-portfolio` dá `TRUNCATE` em `portfolio_perf`, `portfolio_holdings`,
> `portfolio_shortlists`, `portfolio_versions` e `portfolios` — irreversível.

---

## Loop de auto-melhoria

| Comando | O que faz |
|---|---|
| `make review-lessons` | Lista as lições propostas pelo Crítico aguardando revisão (gate manual) |
| `python -m src.review_lessons --list` | Idem (forma direta) |
| `python -m src.optimize_prompt --agent economist` | (Fase 4, esqueleto) propõe novo system prompt a partir dos traces |

As lições aprovadas vivem em `memory/<agente>/lessons.md` (versionadas em git) e são
injetadas no início de cada run. As propostas ficam em `memory/<agente>/proposed/`.

---

## Banco de dados

| Comando | O que faz |
|---|---|
| `make psql` | Abre um shell `psql` no banco |
| `make logs` | Segue os logs do Postgres |
| `make down` | Para o container do DB (mantém os dados) |
| `make reset` | **DESTRÓI** o volume do DB e recria do zero (reaplica `sql/*.sql`) |

Queries úteis estão em [`referencia_agentes.md`](referencia_agentes.md) (seção
"Queries úteis no banco").

---

## Registrar decisão (humano)

```bash
python -m src.log_decision --run-id 17 \
  --decision "Aumentei RF pós-fixada" \
  --rationale "Juro real ex-ante ~8,5% — assimetria favorável"
```

---

## Smoke tests de módulos (sem API/DB)

```bash
python -m src.macro_data        # testa o fetch macro do BCB ao vivo
python -m src.market_data EQTL3 PRIO3   # testa OHLCV + indicadores
python -m pytest -q             # suíte de testes (lógica pura, sem rede)
```

---

## Manutenção

| Comando | O que faz |
|---|---|
| `make clean` | Remove `.venv` e `__pycache__` |
| `make help` | Lista todos os targets do `make` |

---

## Variáveis de ambiente úteis (`.env`)

| Variável | Default | Efeito |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | **obrigatória** |
| `ARC_DB_DSN` | `postgresql://localhost:5432/arc` | conexão com o Postgres |
| `BRAPI_TOKEN` | vazio | habilita o screen do universo B3 |
| `ARC_GESTOR_REBALANCE_DAYS` | `28` | cadência mínima de rebalance do Gestor |
| `ARC_MODEL_RESEARCH` | `claude-sonnet-4-6` | modelo dos agentes de pesquisa |
| `ARC_MODEL_CONSOLIDATOR` | `claude-opus-4-8` | modelo do Consolidador |
| `ARC_ADVISOR_AGENTS` | vazio | liga o advisor (Opus) por agente, ex.: `fundamentalist` |
| `ARC_SECTOR_CAP` | `0.25` | teto de concentração por setor de ações |

Lista completa em `src/config.py`.
