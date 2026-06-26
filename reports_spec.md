# Spec dos 4 reports da ARC

**Data:** 16/06/2026
**Objetivo:** definir o formato ideal de cada entregável semanal, com base no seu
público e propósito. Fundamentado em best practices de research report, newsletter
de investimento retail, apresentação de carteira e mensageria WhatsApp.

**Status:** implementado. O pipeline gera os entregáveis abaixo:

| # | Report | Público | Formato | Tamanho |
|---|---|---|---|---|
| 1 | Dossiê do Comitê (full) | você/equipe, auditoria, avançado | `.md` | completo |
| 2 | Carta Semanal | investidor PF médio | **PDF**/HTML/md | 2–4 págs |
| 3 | Carteira ARC (Top 10 + carteira) | quem vai alocar | `.md`/PDF | 2–3 págs |
| 4 | Mensagem WhatsApp | assinante WhatsApp | texto curto | 3–5 linhas |
| 5 | Aprofundamento (Professor) | iniciante total | `.md` | 1–2 págs |
| 6 | Watchlist Semanal | quem acompanha de perto | `.md` | tabela curta |
| 7 | Especialista FII (+ Carteira de Dividendos) | add-on FII | `.md` | 1–2 págs |
| 8 | Especialista Cripto (+ Carteira Cripto) | add-on Cripto | `.md` | 1–2 págs |
| 9 | Especialista Global (+ Carteira Global) | add-on Global | `.md` | 1–2 págs |

> **Nota (#12):** o **Anexo Técnico** do Dossiê é gerado pelo agente **Arquivista**
> (separado do Consolidador, que agora foca só na carta pública). A Watchlist é um
> passo Haiku barato; os Especialistas são opcionais (`--especialistas`).

> **Aprofundamento (agente Professor):** report educativo à parte. A partir dos
> temas do comitê, escolhe UMA notícia/evento recente (verificada via web search)
> e ensina o conceito do zero — analogia do dia a dia, "o que o comitê disse",
> mitos×fatos, glossário, FAQ, resumo em 3 pontos e "pra ir além". Educativo,
> nunca preditivo. Arquivo `_aprofundamento.md`. (Pedido de um leitor iniciante.)

---

## 1. Dossiê do Comitê (report full)

**Objetivo:** registro completo e **auditável** — todas as ideias, pesquisas e
opiniões separadas dos agentes (economista, fundamentalista, técnico, gestor),
**separadas E unificadas**. É a fonte da verdade.

**Estrutura** (estilo equity research + ata de comitê):
1. **Sumário executivo** — regime, tese central, stance, em 1 parágrafo.
2. **Visão unificada** (síntese do consolidador): macro, oportunidades, riscos,
   debate do comitê, pré-mortem.
3. **Carteira ARC** — resumo + estratégia do mês.
4. **Opiniões separadas por agente** (verbatim, p/ auditoria): economista,
   fundamentalista, técnico, gestor — cada um na íntegra.
5. **Apêndice técnico** — indicadores determinísticos, OHLCV, fontes.
6. **Metadados do run** — datas, força de evidência (FORTE/MODERADA), flags do
   crítico, scores de calibração.

**Tom:** técnico, rigoroso, evidência sempre rotulada. **Sem cortes** (o teto de
tokens já foi resolvido). É o único que mostra o "como pensaram", não só o "o quê".

---

## 2. Carta Semanal (PDF, investidor médio)

**Objetivo:** o brasileiro investidor médio entender o cenário e agir com calma,
toda semana. Best practice: **linguagem simples, zero jargão (ou jargão
explicado), visual, uma ideia por seção**.

**Estrutura:**
1. **Cabeçalho** — data + 1 frase-tese da semana.
2. **Em 30 segundos** (TL;DR) — 3–5 bullets.
3. **O Cenário** — analogias do dia a dia ("imagine a economia como um carro…").
4. **Radar da Semana** — 2-3 grandes movimentos do mundo/macro/tech, com fonte e
   data verificadas (web search); dá continuidade entre as cartas.
5. **O que isso significa pra você** — tradução prática (poupança, financiamento,
   renda fixa vs bolsa).
5. **Onde estão as oportunidades** — ilustrativo, por classe.
6. **O que pode dar errado** — riscos, tom humilde.
7. **1 gráfico/infográfico** — ex.: Selic×IPCA, ou pizza da Carteira ARC.
8. **Glossário rápido** — boxes explicando 2–3 termos da semana.
9. **Convite** — "veja a Carteira ARC completa".
10. **Disclaimer CVM** — topo e rodapé.

**Tom:** caloroso, claro, honesto, encorajador (sem hype). **Tamanho:** 2–4 págs.
**Regra de ouro:** se um termo técnico aparece, ou some ou é explicado na hora.
Visual e bullets curtos > parágrafos longos.

---

## 3. Carteira ARC (Top 10 + carteira recomendada)

**Objetivo:** mostrar a carteira recomendada e o menu Top-10, com razão e as **3
opiniões** por ativo. Best practice: **rationale estratégico claro + tabela de
alocação + densidade de informação controlada** (só o essencial: peso, papel,
razão, risco), mas com explicação acessível ao público leigo (feedback de
assessor + leitor iniciante).

**Estrutura:**
1. **Estratégia do mês** + nota "Como ler".
2. **Alocação por classe** — tabela: classe, peso, banda, papel.
3. **Posições** — tabela: ativo, peso, **o que é** (1 linha simples), preço de entrada.
4. **Por que cada ativo está aqui**, agrupado em **🇧🇷 Brasil** e **🌎 Global (em
   dólar)** (com nota de câmbio/BDR): `o_que_e` + razão + opinião do economista,
   fundamentalista e técnico; RF de marcação a mercado leva aviso de oscilação.
5. **Top-10 por categoria** — menu ranqueado em **7 categorias** (ações BR, ações
   EUA, FIIs, ETF B3, ETF EUA amplo, ETF internacional ex-EUA, ETF emergentes);
   cada item com rationale rico (o que cada agente disse + motivo + consolidação +
   info extra do pré-passo de pesquisa).
6. **Gatilhos de realocação** + lembrete: rebalance **mensal**, baixo giro,
   long-only.
7. **Performance** — desde a entrada, por ativo + carteira (quando houver
   histórico em `portfolio_perf`).
8. **Disclaimer**.

**Tom:** organizado, direto, transparente. **Tamanho:** 2–3 págs. Evitar
sobrecarga de gráficos — só o que informa decisão.

---

## 4. Mensagem WhatsApp (engajamento)

**Objetivo:** chamar a atenção e levar a pessoa a ler a Carta + a Carteira.
Best practice (WhatsApp tem ~98% de abertura; a 1ª linha decide tudo):
**saudação + hook + síntese curta + CTA + opt-out**.

**Estrutura (3–5 linhas):**
1. **Saudação** curta e pessoal.
2. **Hook** (1ª linha) — curiosidade ou benefício direto sobre o tema da semana
   (ex.: "A renda fixa abriu uma janela rara esta semana 👀").
3. **Síntese** — 1–2 frases com o mais importante (sem entregar tudo).
4. **CTA** — convite claro: "Leia a Carta da semana + a Carteira ARC 👉".
5. **Opt-out** discreto.

**Tom:** próximo, curioso, **sem clickbait que quebre confiança** (é produto
financeiro sério) e **sem promessa de retorno**. 1–2 emojis no máximo.

---

## Mapa de dados → report

| Report | Fontes |
|---|---|
| Dossiê | os 4 relatórios (`report_md`) + gestor + `agent_evals`/`calibration_log` + market_data |
| Carta | saída do consolidador (camada pública) + 1 número-chave por seção |
| Carteira | saída do gestor (`portfolio` + `shortlists`) + `portfolio_holdings`/`portfolio_perf` |
| WhatsApp | TL;DR do consolidador + 1 gancho da carteira |

## Implementação sugerida

Um módulo `src/reports.py` que, a partir do resultado do run (relatórios + saída
do gestor + dados do banco), renderiza os 4 arquivos: `*_dossie.md`,
`*_carta.pdf` (via skill de PDF), `*_carteira.md`, `*_whatsapp.txt`. O
consolidador continua gerando a camada pública (vira a carta); o gestor alimenta a
carteira; um passo final de geração de WhatsApp (Haiku, barato) destila o gancho.
