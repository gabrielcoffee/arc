# Avaliação do Sistema ARC-Agents
### Perspectiva de Especialista em Investimentos — Mercado Brasileiro

> **⚠️ Histórico (avaliação da fase barbell, pré 2026-06-29):** o produto pivotou
> para 7 carteiras de Factor Investing — ver
> [`arquitetura_carteiras.md`](arquitetura_carteiras.md). Várias críticas aqui
> motivaram esse pivot. Mantido como registro.

**Data:** 17 de junho de 2026  
**Escopo:** análise metodológica, técnica de investimentos e execução do pipeline —
como visto por um gestor/CIO com experiência no mercado brasileiro, não como review
de engenharia de software.

---

## Resumo Executivo

O sistema é notavelmente mais sofisticado do que a maioria do que circula no mercado
retail de análise financeira. A fundamentação acadêmica é real, as calibrações para o
Brasil estão na direção certa, e a posição atual da carteira (RF pesada, FII papel,
cautela com bolsa doméstica) é coerente com o regime macro de juro real ~9% e IPCA
acima do teto. Há, porém, falhas de execução importantes que contradizem as próprias
regras do sistema, ausência de métricas de risco quantitativas que qualquer arc
profissional exigiria, e pelo menos um argumento central (o earnings yield do Ibovespa)
construído sobre um dado não verificado. A estrutura de auto-melhoria com crítico e
Brier/ECE é um diferencial genuíno; mas com apenas ~17 runs, ainda é prematura.

---

## 1. O que está bom

### 1.1 Calibração do arcabouço macro para o Brasil — acima da média do mercado

A distinção entre juro real ex-ante e juro nominal como comparativo com o earnings yield
(Asness 2003 corretamente citado) é a separação que a maioria dos analistas retail
ignora. Usar NTN-B como benchmark de renda fixa — não a Selic nominal — é o que arcs
sérias como Verde, SPX e Ibiuna fazem. O tratamento do câmbio BRL/USD como driver
co-primário (não subordinado à Selic) também está correto e alinhado com evidência
empírica do mercado brasileiro.

O reconhecimento explícito de que o prêmio de tamanho (SMB) é **negativo** no Brasil
(NEFIN ≈ -2%/ano) e que momentum é **frágil** em crises locais (Mussa et al.) são
calibrações que a maioria dos relatórios de análise retail simplesmente ignora, aplicando
mecânica de mercados desenvolvidos sem adaptação. O sistema corrige isso explicitamente
nos prompts, o que é um diferencial real.

### 1.2 Posicionamento macro atual está certo

Com IPCA em 4,72% (acima do teto de 4,5%), Copom em 14,50%, juro real ex-ante ~9%
e câmbio a R$5,07 (real apreciado que comprime exportadoras), a inclinação para:

- Renda fixa pós-fixada (LFT) como âncora → correto; é o posicionamento predominante
  entre gestores macro brasileiros neste ambiente.
- FII de papel CDI (KNCR11) sobre FII de tijolo (HGLG11) → correto; KNCR11 tem duration
  curta, indexação ao CDI e isenção de IR para PF. O próprio Safra publicou postura
  defensiva em FIIs tijolo em junho/2026.
- Cautela com bolsa BR (earnings yield < juro real) → na direção correta, embora o
  argumento precise de dado verificado (ver seção 2.1).
- NTN-B 2032 a IPCA+8,11% como assimetria de médio prazo → correto; historicamente
  este patamar (acima de IPCA+7%) ofereceu retorno real excepcional para quem carregou
  ao vencimento.

### 1.3 Estrutura barbell é metodologicamente sólida

A arquitetura core-satélite com RF como âncora grande (35-65%) + convexidade pequena
em cripto (1-5%) está alinhada com Taleb e com o que fundos de endowment internacionais
chamam de "asymmetric risk budget". O laddering de RF (pós-fixado + IPCA+ de prazos
variados) e os avisos de marcação a mercado para NTN-Bs são pontos de qualidade que
muitas plataformas retail omitem deliberadamente para simplificar (e acabam enganando).

### 1.4 Loop de auto-melhoria é incomum e bem pensado

A separação entre aprendizado de processo (intra-run, disponível imediatamente) e
aprendizado de resultado (inter-run, matura em semanas/meses) com N mínimo é a distinção
correta que a academia de finanças faz e que sistemas de otimização ingênuos ignoram.
Usar Brier score e ECE para calibração — em vez de perseguir o que "subiu" — é uma
decisão de design madura. A implementação do gate humano (L1) antes de promover lições
é prudente para um produto financeiro adjacente à regulação CVM. Nenhuma arc retail
brasileira que conheço tem esse grau de metacognição estruturada.

### 1.5 Disclaimer CVM robusto e consciência regulatória

O framing como "conteúdo educacional e de cenário", com disclaimer da Res. CVM nº 20 no
topo e rodapé de todos os relatórios, é necessário e adequado. A nota sobre a distinção
entre veículo de pesquisa e atividade regulada de analista/consultoria está corretamente
registrada como risco de produto. Isso diferencia o sistema de newsletters que operam em
zona cinza regulatória.

### 1.6 Análise setorial FIIs está correta e atualizada

A distinção papel×tijolo, com P/VP, DY sustentável, vacância e qualidade de recebíveis
como critérios de avaliação, reflete o framework que analistas de FII (Itaú, XP, BTG)
aplicam. O reconhecimento de KNCR11 como "quase renda fixa pós-fixada com spread" captura
corretamente o perfil de risco do ativo neste regime.

---

## 2. O que está ruim / problemas sérios

### 2.1 Argumento central com dado não verificado — este é o maior problema

O coração da tese de cautela com bolsa brasileira é: "renda fixa hoje paga mais, com
menos risco, do que o lucro implícito da bolsa". A comparação concreta é entre o juro
real ex-ante (~9% a.a.) e o earnings yield do Ibovespa, que o sistema cita como "7-8%
nessa métrica (referência **não verificada intraday**)".

Isso é um problema sério. O P/L projetado do Ibovespa em meados de 2026 está em torno
de 8-9x (variando conforme a fonte e o método), o que implica earnings yield de **11-13%**,
não 7-8%. Se o número correto for 11-12%, a lógica de "renda fixa domina" se enfraquece:
IPCA+8,11% (NTN-B nominal ~13%) vs. earnings yield de 11-12% ainda favorece a renda fixa,
mas com margem muito menor do que a apresentada. E o earnings yield do Ibovespa inclui
Petrobras e Vale, cujos lucros são cíclicos e distorcem a comparação — excluindo-as, o
múltiplo do "Brasil ex-commodities" é mais alto (menores earnings yield).

**A conclusão pode estar certa; o argumento precisa ser verificado no run.** O
economista tem web search disponível e fontes como StatusInvest, Fundamentei e
Valor Econômico deveriam ser consultadas para este número específico antes de ele
virar o argumento central da carta. A lição já existe na memória do economista
("Não rotule evidência como FORTE sem fonte primária") — mas o dado central da tese
de alocação está sendo qualificado como "não verificado". Isso precisa ser resolvido.

### 2.2 Carteira viola sua própria regra sobre duplicidade de índice

O prompt do Gestor é explícito: "NÃO tenha dois instrumentos do MESMO índice/subjacente
(ex.: IVVB11 e VOO são ambos S&P 500 — escolha UM)". A carteira final gerada (run 17)
tem **IVVB11 (5%) e VOO (4%)** — 9% da carteira no mesmo S&P 500, em dois veículos
distintos. O Gestor ignorou sua própria instrução.

Este não é um erro de metodologia — a metodologia está certa. É um erro de execução do
agente que o crítico deveria ter flagado. A questão prática é que o IVVB11 (B3, em reais)
e o VOO (NYSE, em dólar) têm diferenças operacionais (câmbio, corretora, tributação),
mas como ativos subjacentes são idênticos. A solução correta é escolher um: IVVB11 para
quem opera só pela B3, VOO para quem tem conta no exterior — e não ter os dois.

### 2.3 Concentração setorial em financeiro/crédito não monitorada quantitativamente

Somando as exposições a crédito e setor financeiro na carteira:
- CDB pós-fixado banco grande: 16%
- LCI/LCA: 14%
- KNCR11 (FII de papel/CRI): 4%
- ITUB4 (banco): 4%
- NTN-B e Tesouro Selic: ~11,5%

O setor financeiro e crédito representa algo em torno de 38-40% da carteira direta,
mais toda a correlação com o cenário macro doméstico de juros. O sistema instrui "limite
a ~25% do total por setor" mas essa regra não está sendo verificada computacionalmente —
o Gestor a aplica por julgamento, e o julgamento está errado aqui. RF e crédito bancário
andam juntos no cenário de Selic alta; em um choque fiscal que force alta de juros, LFT e
CDB sobem, mas FII de papel pode sofrer spread de crédito e ITUB4 pode cair por receio
de inadimplência. A correlação é alta.

### 2.4 Ausência total de métricas de risco quantitativas

Qualquer arc profissional — mesmo uma boutique pequena como Kapitalo ou Truxt —
calcula e monitora regularmente: volatilidade histórica da carteira, correlação entre
ativos, VaR (Value at Risk) e CVaR/Expected Shortfall, analysis de stress (choque de
câmbio +20%, choque de juros +300bps, recessão China), tracking error vs. benchmark.
O sistema não tem nenhum desses. A "diversificação" é gerenciada por heurísticas em
linguagem natural no prompt ("~25% por setor"), não por números calculados.

Isso é aceitável em uma fase inicial, mas é a lacuna técnica mais importante para quem
quer transformar esse sistema em algo que se aproxime de uma arc. Um módulo simples
de análise de risco (numpy + pandas, dados históricos via yfinance) calculando correlação
entre os holdings e simulando cenários de stress seria adição de alto valor com baixo custo
de implementação.

### 2.5 Sem benchmark explícito = impossível avaliar geração de alfa

A Carteira ARC não tem benchmark definido. Sem isso, qualquer performance é
ininterpretável. A carteira bateu o CDI? Perdeu para o Ibovespa? Entregou alfa sobre
IPCA+5%? São perguntas sem resposta porque o benchmark não existe. Gestoras sérias
definem o benchmark antes de começar — geralmente um benchmark composto para carteiras
diversificadas como esta (ex.: 60% CDI + 20% IBOV + 20% IHFA, ou similar).

A calibração com Brier/ECE do sistema é uma forma indireta de medir qualidade de
previsão, mas não mede geração de retorno ajustado a risco frente a uma alternativa
simples (o que gestores e reguladores chamam de alfa).

### 2.6 Ciclo eleitoral 2026 tratado de forma superficial

O sistema menciona "ciclo eleitoral → prêmio de termo → custo de capital" no framework
do economista, mas os relatórios do run 17 não desenvolvem esse risco de forma adequada.
2026 é ano eleitoral no Brasil, com eleições presidenciais em outubro. Isso tem implicações
diretas e específicas:

- Populismo fiscal pré-eleitoral: pressão para gastos que deterioram o resultado primário
- Candidatos e seus programas fiscais são risk drivers para o prêmio de risco soberano
- O real tende a depreciar no segundo semestre de anos eleitorais com incerteza
- FIIs de tijolo e utilities (EGIE3) são particularmente sensíveis a mudanças regulatórias
  pós-eleição

Um gestor dedicando 2-3 parágrafos ao cenário eleitoral teria valor concreto para o
leitor neste momento. O sistema passa rapidamente sobre isso quando deveria ser um dos
temas centrais de junho/outubro 2026.

### 2.7 Análise China-minério superficial, apesar de VALE3 e PETR4 na carteira

A VALE3 está na carteira com 3%. A tese é razoável (diversificação de commodities +
transição energética via cobre/níquel), mas a análise de China se limita a "sem
catalisador robusto". Para uma posição em Vale, um gestor competente avaliaria:
o nível de estoques de minério de ferro em portos chineses, o ritmo de construção de
moradias (o maior driver de demanda de ferro), os preços de contratos de cobre no LME
(proxy da eletrificação global), e o diferencial custo-benefício de C1 vs. pares como
BHP e Rio Tinto. Nada disso aparece na análise.

---

## 3. Pontos de Melhoria — o que um CIO adicionaria

### 3.1 Verificar earnings yield do Ibovespa em cada run via web search

O economista já tem web search com fontes como BCB, IBGE e FGV. Adicionar a verificação
do P/L projetado do Ibovespa (StatusInvest, Valor Econômico, Economatica) como dado
obrigatório no bloco `INDICATORS_JSON` resolveria o problema do argumento central não
verificado. Esse dado muda pouco semana a semana, mas deve ser explicitamente buscado.

### 3.2 Script de verificação de concentração setorial calculado

Implementar em `src/gestor.py` (ou em um step pré-alocação) um cálculo de concentração
por setor usando os pesos da carteira e um mapeamento `ticker → setor`. A regra já existe
nos prompts; ela deveria ser executada como check quantitativo antes de finalizar os pesos,
retornando um erro/warning se algum setor ultrapassar o limite. A B3 publica classificação
setorial via dados públicos.

### 3.3 Módulo de risco de portfólio básico

Um `src/risk.py` que calcule para a versão atual da carteira: volatilidade histórica
anualizada dos holdings (yfinance, 1 ano), matrix de correlação entre ativos, VaR 95% e
99% (paramétrico e histórico), e dois cenários de stress (BRL +20%, Selic +300bps).
Injetar o resumo no relatório do gestor. Isso seria acompanhar o que gestores de fundos
de previdência e family offices fazem como rotina.

### 3.4 Definir e rastrear benchmark composto

Antes do próximo run, definir o benchmark da Carteira ARC — sugestão: 50% CDI +
30% IBOV + 20% IHFA (hedge funds Brasil). Persistir na tabela `portfolio_versions` e
calcular na função `snapshot_performance` o retorno do benchmark para o mesmo período.
Isso torna a calibração de longo prazo muito mais informativa do que retorno absoluto.

### 3.5 Ouro como hedge de cauda na carteira principal

O GOLD11 aparece como #8 no Top-10 de ETFs B3 com justificativa correta ("proteção de
cauda descorrelacionada"), mas não entra na carteira principal. Com risco fiscal elevado
e incerteza eleitoral em 2026, uma posição de 2-3% em GOLD11 dentro do sleeve de ETFs
faria sentido como hedge anticíclico. O ouro não tem correlação com o CDI, não tem risco
de crédito e protege especificamente contra crises fiscais/cambiais — exatamente os riscos
que o economista identifica como centrais. No barbell de Taleb, o ouro se encaixa no
lado convexo, junto com cripto, mas com menos volatilidade e maior legitimidade
institucional.

### 3.6 Análise de tributação integrada

A carteira mistura ativos com tratamentos tributários distintos: LCI/LCA (isento), CRI
(isento), NTN-B (IR regressivo), CDB (IR regressivo), FIIs rendimento (isento para PF
com mais de 50 cotistas), FIIs ganho capital (20% IR). Uma linha calculando o retorno
líquido estimado por classe seria adição de alto valor. Uma debênture incentivada IPCA+7%
isenta pode superar uma NTN-B IPCA+8,11% tributada para alíquota de IR de 22,5%
(carreira < 180 dias) ou ser equivalente para alíquota de 15% (> 720 dias). Sem esse
cálculo, a comparação entre instrumentos está incompleta.

### 3.7 Remover a redundância S&P 500 ou torná-la explícita e justificada

Escolha: ou o sistema mantém IVVB11 (para quem opera só pela B3) OU VOO (para quem tem
conta internacional), com a instrução explícita de que o leitor deve escolher um.
Outra opção: manter ambos como alternativas mutuamente exclusivas no Top-10, com nota
clara: "se você tem conta no exterior: VOO; se opera só pela B3: IVVB11 — não use os
dois". A carteira como está passa a mensagem errada de que são posições complementares.

### 3.8 Aprofundar análise eleitoral como risk driver estrutural de 2026

O economista deveria ter uma seção dedicada ao cenário eleitoral no H2 2026:
probabilidade de candidatos fiscalmente responsáveis vs. expansionistas (via mercado
de apostas e pesquisas, citando fontes), impacto no câmbio e no prêmio de risco soberano
(CDS Brasil), e implicações para alocação entre renda fixa IPCA+ (protege se fiscal
piorar) vs. bolsa (sofre em deterioração fiscal). É informação com alto valor prático
para o leitor que o sistema não está capturando.

### 3.9 Gatilho de saída formalizado por ativo

As teses têm "gatilho de invalidação" bem formulados (ex.: "WEGE3 errada se P/L
corrigir para <20x sem crescimento de lucro acelerando"). Mas falta o par correspondente:
quando o Gestor decide explicitamente sair de uma posição ao invés de simplesmente
mantê-la com "baixo giro"? Um ativo como WEGE3, com câmbio forte e 1T26 fraco (-6%
de receita), pode acumular evidências de que a tese estrutural está sendo testada — o
"baixo giro" não pode virar barreira psicológica para reconhecer que a posição saiu do
range de convicção. Uma regra simples de revisão obrigatória seria: "se gatilho de
invalidação for atingido por 2 runs consecutivos, o gestor justifica explicitamente
a permanência ou propõe a saída".

---

## 4. Perspectiva de mercado — contexto adicional que enriquece a análise

Algumas informações do mercado atual que o sistema poderia incorporar mais explicitamente:

**Sobre o posicionamento FII (validado):** Analistas de FII (Safra, junho 2026) também
recomendam postura defensiva com viés em papel/CDI sobre tijolo, com distribuição
aproximada de 60% papel e 40% tijolo de qualidade. A análise do sistema está alinhada
com o consenso profissional, o que é positivo.

**Sobre o Ibovespa (dado para verificar):** O índice fechou em ~169.648 pontos em
16/06/2026, com valorização de +22% em 12 meses. Isso é relevante: um mercado que subiu
22% em 12 meses tem earnings yield comprimido vs. um ano atrás, tornando a comparação
com juro real ainda mais desfavorável à bolsa. O argumento do sistema provavelmente está
certo, mas precisa de dado verificado.

**Sobre NTN-B (validado):** A ASA Investments publicou análise identificando ganho
potencial de até 40% em NTN-Bs em cenário de queda da Selic para ~12% em 2027-28. Isso
confirma a tese do sistema de que IPCA+8,11% representa assimetria de médio prazo
para quem carrega ao vencimento.

---

## 5. Avaliação geral (síntese)

| Dimensão | Nota | Comentário |
|---|---|---|
| Fundamentação macro Brasil | ✅ Forte | Calibrações corretas (câmbio, juro real, curva) |
| Análise de ativos individuais | ✅ Boa | QARP aplicado, F-Score como filtro, moat reconhecido |
| Posicionamento atual (jun/26) | ✅ Correto | RF pós-fixada + FII papel + cautela bolsa |
| Execução do Gestor | ⚠️ Fraca | Viola regra própria (IVVB11+VOO), concentração não monitorada |
| Métricas de risco quantitativas | ❌ Ausente | Sem VaR, correlação, stress test, benchmark |
| Verificação de dados críticos | ⚠️ Incompleta | Earnings yield (argumento central) não verificado |
| Análise eleitoral 2026 | ⚠️ Superficial | Mencionado mas não desenvolvido |
| Análise de China/commodities | ⚠️ Superficial | VALE3 na carteira sem drivers validados |
| Análise tributária | ❌ Ausente | Comparação bruta; retorno líquido não calculado |
| Loop de auto-melhoria | ✅ Sofisticado | Único no mercado retail; prematuro com N=17 |
| Disclaimers e compliance | ✅ Robusto | CVM bem tratado; consciente dos riscos regulatórios |

**Síntese:** o sistema opera no quartil superior do que existe em análise macro-quantitativa
voltada para investidor retail no Brasil. As fragilidades listadas não invalidam o valor
do produto, mas limitam a confiança que um gestor profissional depositaria nas decisões
de alocação. Com 6 meses de runs, um módulo de risco básico implementado, e a correção da
redundância S&P 500, o sistema estaria próximo do nível de um research de boutique.
A maior prioridade imediata é uma: verificar o earnings yield do Ibovespa em cada run —
porque sem esse dado confirmado, o argumento central de "renda fixa domina bolsa" está
apoiado em ar.

---

*Este documento é análise crítica de metodologia de investimentos, não recomendação de
investimento ou de valores mobiliários. Elaborado em 17/06/2026 com base na leitura
completa dos documentos do repositório arc-agents e em busca de informações
de mercado do mesmo período.*
