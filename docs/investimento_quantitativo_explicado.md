# Investimento Quantitativo e Factor Investing — explicado para todo mundo

> **AVISO IMPORTANTE.** Este material é conteúdo **educacional**. **Não é
> recomendação de investimento** nem consultoria de valores mobiliários (Resolução
> CVM nº 20/2021). Os ativos e números que aparecem servem só para ilustrar o
> raciocínio. Rentabilidade passada não garante resultado futuro. Toda decisão é
> sua — se precisar, procure um profissional habilitado.

---

## Em 30 segundos

A maioria das pessoas escolhe ações por "achismo": uma dica, uma manchete, a
empresa que todo mundo comenta. **Investimento quantitativo** troca o achismo por
**regras e dados**: a gente decide com base em números medidos da mesma forma para
todas as empresas, sem paixão e sem palpite. **Factor Investing** é o tipo de
investimento quantitativo que a gente usa — escolher ações por suas
**características comprovadas** (chamadas *fatores*) que, ao longo de décadas e em
vários países, tenderam a entregar retorno melhor. No nosso projeto, isso vira o
**Modelo Multifator ARC (AFM-BR)**, que pontua as ações da bolsa brasileira de
forma automática.

---

## 1. O que é investimento quantitativo?

Imagine dois jeitos de montar um time de futebol:

- **Jeito tradicional (discricionário):** o técnico assiste aos jogos e escolhe
  "no olho" quem joga bem. Funciona, mas depende da intuição dele, do humor do
  dia, e de quem ele viu jogar.
- **Jeito quantitativo:** você mede **os mesmos números de todos os jogadores** —
  passes certos, quilômetros percorridos, gols, desarmes — e monta o time por
  esses dados, com uma regra fixa.

Investir de forma quantitativa é o segundo jeito, aplicado ao mercado. Em vez de
"essa empresa parece boa", você diz: *"vou medir lucratividade, preço, tendência e
risco da mesma maneira em todas as empresas, e montar a carteira por essas
medidas".*

**Por que isso ajuda?**

1. **Tira a emoção da decisão.** Medo e euforia são os maiores destruidores de
   retorno do investidor comum. A regra não entra em pânico.
2. **Trata todas as empresas igual.** Nada de favorecer a marca conhecida e
   ignorar a boa empresa que ninguém comenta.
3. **É testável.** Como é uma regra, dá para voltar no passado e perguntar: *"se eu
   tivesse seguido isso nos últimos anos, teria funcionado?"* (Isso se chama
   **backtest** — falaremos dele lá embaixo.)
4. **É transparente e repetível.** Qualquer pessoa, com os mesmos dados, chega ao
   mesmo resultado. Não depende de um "gênio" insubstituível.

> **Não é robô adivinhando o futuro.** Investimento quantitativo não prevê a
> cotação de amanhã. Ele coloca a probabilidade a seu favor ao longo de **anos**,
> da mesma forma que o cassino não sabe o resultado da próxima rodada, mas conhece
> as chances no longo prazo.

---

## 2. O que é Factor Investing (investimento por fatores)?

Décadas de pesquisa acadêmica (os economistas **Eugene Fama** e **Kenneth French**
ganharam um Nobel relacionado a isso) descobriram algo importante: o retorno de uma
ação pode ser explicado por um punhado de **características recorrentes** — os
**fatores**. Ações que têm esses fatores tenderam, historicamente e em vários
países, a se sair melhor que a média.

Os fatores que usamos, em linguagem simples:

| Fator | Pergunta que ele responde | Em uma frase |
|---|---|---|
| **Valor** | A ação está barata? | Pagar pouco pelo que a empresa lucra. |
| **Qualidade** | A empresa é boa de verdade? | Lucra muito com o que investe, com boa margem. |
| **Momentum** | A ação vem indo bem? | Quem subiu nos últimos meses tende a continuar um pouco mais. |
| **Baixa Volatilidade** | A ação é "tranquila"? | Ações menos balançadas costumam render mais por risco. |
| **Dividendos** | A empresa paga bem o acionista? | Distribui lucro de forma consistente. |

A grande sacada **não é** escolher UM fator e apostar tudo nele. É **combinar**
fatores que se complementam. Um exemplo clássico: **Valor + Momentum**. Eles
costumam funcionar em momentos diferentes — quando um esfria, o outro esquenta —,
então juntos a carteira fica mais estável. É o mesmo princípio de não colocar todos
os ovos na mesma cesta, mas aplicado às *estratégias*, não só às ações.

> **Importante: nem tudo que parece fator é fator.** A pesquisa também mostra o que
> **não** funciona. Exemplos que evitamos de propósito: escolher ação só porque a
> empresa "cresceu muito" no passado (crescimento passado não se paga), ou só
> porque o dividend yield está alto isoladamente. A gente segue a evidência, não a
> moda.

---

## 3. Como usamos tudo isso no projeto — o Modelo Multifator ARC (AFM-BR)

Aqui é onde a teoria vira o nosso produto. O **AFM-BR** é o motor que roda
automaticamente sobre as ações da bolsa brasileira (B3). Passo a passo:

### Passo 1 — Só empresas "jogáveis"
Antes de pontuar, filtramos:
- **Liquidez:** a ação precisa ser negociada o suficiente (dá para comprar e vender
  sem dificuldade). Empresas que quase não negociam ficam de fora.
- **Portão de crescimento:** empresas que estão **encolhendo** (lucro caindo de
  forma consistente) são excluídas. Crescimento aqui não é prêmio — é só um filtro
  de segurança.

### Passo 2 — Medir os 5 fatores, de forma justa
Para cada ação, calculamos os 5 fatores acima. Dois cuidados técnicos que fazem
diferença:
- **Comparação dentro do setor (setor-neutro):** não dá para comparar um banco com
  uma empresa de energia diretamente. Então comparamos cada empresa **com as do seu
  próprio setor**. Assim, "a melhor entre os bancos" e "a melhor entre as elétricas"
  competem em pé de igualdade.
- **Notas padronizadas (z-score):** cada fator vira uma nota comparável (quanto
  maior, melhor), para podermos somar maçãs com laranjas de forma honesta.

### Passo 3 — Duas carteiras temáticas (o coração do produto)
Combinamos os fatores em **duas carteiras** com personalidades diferentes:

- 🏆 **Retorno Total (Valor + Momentum):** para quem busca crescimento do
  patrimônio. Junta ações baratas com ações em boa trajetória.
- 💰 **Dividendos Defensiva (Dividendos + Baixa Volatilidade):** para quem busca
  renda e tranquilidade. Junta boas pagadoras com ações mais estáveis.

E um **score-mãe (Φ, "fi")** que resume tudo numa nota única de 0 a 1. Ele é uma
**média ponderada por evidência** dos fatores que mais funcionam na bolsa brasileira:
**Baixa Volatilidade e Valor pesam mais** (são os mais robustos nos nossos testes),
seguidos de Momentum e Qualidade. Dividendos **não entra** nessa nota-mãe (ele se
sobrepõe a valor/qualidade) — fica só na carteira de Dividendos. Quanto maior o Φ,
melhor a ação no conjunto dos fatores que pagam.

### Passo 4 — A leitura macro por cima (regime, não market timing)
O Factor Investing escolhe **as ações brasileiras** — esse é o núcleo. Por cima, a
leitura macro do mês **não** faz compra-e-venda tática de classes; ela só indica
**qual das duas carteiras o cenário favorece** (ex.: a Dividendos Defensiva quando os
juros reais estão altos). As carteiras em si são exposições de fator estratégicas e de
baixo giro. A diversificação vem de **espalhar entre setores** dentro de cada carteira
(limite por setor) + ETFs como lastro de geografia/câmbio — não de uma alocação tática
que entra e sai. Cripto, FIIs e ativos internacionais **não** se misturam aqui: cada um
é uma **carteira própria** de um agente especialista (ver `arquitetura_carteiras.md`).

---

## 4. "Mas isso funciona mesmo?" — a evidência

Duas formas de responder, e usamos as duas:

**a) Evidência acadêmica.** Os pesos e a escolha dos fatores não saíram da nossa
cabeça — vêm de estudos calibrados para o Brasil (por exemplo: a métrica de "barato"
que melhor funciona aqui é o EV/EBIT, não o famoso P/L; e a anomalia de **baixa
volatilidade** é uma das mais robustas do mundo). A gente parte da ciência, não do
palpite.

**b) Teste com dados reais (backtest).** Pegamos o histórico da bolsa e perguntamos:
*"se a gente tivesse ranqueado as ações por cada fator no passado, as mais bem
pontuadas teriam rendido mais que as mal pontuadas?"* Nos nossos testes com vários
anos de dados (incluindo a crise da COVID), **Baixa Volatilidade e Qualidade**
apareceram com sinal estatisticamente **forte e robusto** na B3 — passam até a régua
mais exigente, que desconta o "achismo" de testar muitos fatores. O **Momentum**
aparece mais fraco e **instável em crises**, por isso o usamos de forma **ajustada ao
risco** e com peso menor. E continuamos medindo isso **a cada atualização**, para saber
se um fator deixou de funcionar no cenário atual.

> **Honestidade intelectual.** Nenhum fator funciona o tempo todo. Há meses e anos
> em que um deles vai mal — isso é normal e esperado. Por isso combinamos fatores e
> medimos a performance continuamente, em vez de prometer que "sempre dá certo".

---

## 5. Por que esse jeito é diferente do "investidor comum"

| Investidor comum | Nosso processo (quantitativo + fatores) |
|---|---|
| Escolhe por dica, manchete ou intuição | Escolhe por números medidos igual para todos |
| Decide no calor da emoção | Segue uma regra que não entra em pânico |
| "Essa empresa parece boa" | "Essa empresa pontua bem em valor, qualidade e momentum" |
| Não dá para testar se a estratégia presta | Dá para testar no histórico (backtest) |
| Concentra no que é familiar | Compara o universo todo, setor a setor |

---

## Glossário rápido

- **Fator:** uma característica medível de uma ação (valor, qualidade, momentum…)
  que historicamente ajudou a explicar retorno.
- **Quantitativo:** decidir com dados e regras, não com intuição.
- **Backtest:** testar uma estratégia no passado para ver se teria funcionado.
- **Setor-neutro:** comparar empresas dentro do mesmo setor, para ser justo.
- **z-score:** uma nota padronizada que permite comparar coisas diferentes.
- **Φ (score-mãe):** nossa nota final de 0 a 1 que resume todos os fatores de uma ação.
- **EV/EBIT:** uma medida de "quão cara ou barata" está a empresa (melhor que o P/L
  para o Brasil).

---

> **De novo, e sempre:** isto é conteúdo educacional, não recomendação de
> investimento. Serve para você **entender como pensamos** — a decisão final, e a
> responsabilidade por ela, é sempre sua.
