# ARC — Design do site

**Data:** 2026-06-26
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 (config-less, tokens em
`app/globals.css`) · TypeScript.

Este documento é a fonte de verdade do design do **site institucional** (`web/`). Não confundir
com `design_brief.md` da raiz, que descreve o sistema ARC (os agentes). Aqui é só a interface.

---

## 1. Princípios

1. **Dark-only.** Não existe modo claro. Fundo zinco/carvão, um único acento ocre.
2. **Menos texto.** Cada seção diz o essencial. Sem parágrafos de apoio redundantes.
3. **Sem "eyebrows" numeradas.** Nada de `00 / Research…`, `01 / Como funciona`. Esse padrão
   numerado em mono foi removido por soar "gerado por AI". Seções usam `h2` direto.
4. **Interativo sob direção.** As micro-interações são adicionadas sob demanda, não inventadas.
   Hoje: constelação de partículas no hero, robôs com hover, add-ons como botões selecionáveis.
5. **Sem alucinação visual.** Números exibidos são ilustrativos e marcados como tal; o disclaimer
   CVM é load-bearing (`lib/plans.ts` → `DISCLAIMER`, `components/disclaimer.tsx`).

## 2. Cor (tokens em `app/globals.css` → `@theme`)

Paleta **Industrial ochre / zinc**. Texto escuro (`on-accent`) sempre que sentar sobre o ocre —
branco sobre amarelo reprova em contraste.

| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#111113` | fundo da página (zinc-950) |
| `--color-surface` | `#1c1c1f` | cards, painéis |
| `--color-subtle` | `#242428` | chips, fundos sutis |
| `--color-border` | `#2e2e33` | hairlines, bordas |
| `--color-ink` | `#f4f4f5` | texto primário |
| `--color-ink-2` | `#a1a1aa` | texto secundário |
| `--color-ink-3` | `#71717a` | texto terciário / labels |
| `--color-accent` | `#eab308` | ocre (yellow-500) — acento único |
| `--color-accent-hover` | `#facc15` | hover do acento |
| `--color-accent-wash` | `#eab30818` | preenchimento translúcido |
| `--color-on-accent` | `#111113` | texto/ícone **sobre** o ocre |
| `--color-pos` / `--color-neg` | `#34d399` / `#f87171` | semântica (favorece/cautela) |

Sombras no escuro: pretas suaves (`rgba(0,0,0,0.4)`) ou um glow ocre discreto no card em destaque
(`rgba(234,179,8,0.12)`). Nunca as sombras claras antigas.

## 3. Tipografia (`app/layout.tsx`)

- **Display (`font-display`):** **Space Grotesk** — todos os títulos grandes. Substituiu a antiga
  Instrument Serif (não há mais serifa no site).
- **Sans (`font-sans`):** Geist — corpo de texto.
- **Mono (`font-mono`):** Geist Mono — labels, tickers, cadências, indicadores.

Escala de tipo e raios continuam em `@theme` (`--text-*`, `--radius-*`). Tailwind v4 gera o
utilitário `font-display` automaticamente a partir do token `--font-display`.

## 4. Iconografia

- **Flowbite** (`flowbite-react-icons/outline`) — ícones de produto. Mapa central em
  `components/icons.tsx` (`REPORT_ICON`): Carta=Newspaper, Aprofundamento=GraduationCap,
  Carteira=ChartPie, Rankings=Award, FII=Building, Cripto=Atom, Global=Globe. Usados nos
  checklists dos planos, nos botões de add-on e nos três produtos do hero.
- **lucide-react** — apenas utilitários de UI já existentes: `ArrowRight`, `Check`, `Sparkles`.

## 5. Movimento

- **Partículas (hero):** `components/home/particles-bg.tsx` — tsParticles slim
  (`@tsparticles/react` + `@tsparticles/slim`), constelação ocre/zinco que reage ao cursor
  (grab/push). Engine inicializa uma vez. Sob `prefers-reduced-motion`, o engine não inicia e
  fica uma camada estática.
- **Reveal:** `components/reveal.tsx` — fade-up por IntersectionObserver, respeita reduced-motion.
- **Keyframes** em `globals.css`: `fade-up`, `dash-flow` (fluxo das setas do comitê),
  `float-bob` (robôs flutuando). Aplicados via `motion-safe:animate-*` para degradar sozinhos.

## 6. Hero — o comitê (`components/home/agents-cross.tsx`)

Quatro robôs SVG desenhados à mão, em **cruz**:

```
            Economista (topo)
Fundamentalista ─ ◇ ─ Técnico
          Estrategista-Chefe (base)
```

- Setas pontilhadas circulam entre eles (ciclo, `dash-flow`).
- **Hover/foco** em um robô: ele flutua/escala, os olhos acendem, e o **painel central** mostra
  modelo + nome + o que ele faz. Cada robô tem um emblema próprio (tendência, lupa, candles, coroa).
- Da base (Estrategista-Chefe) sai uma **linha pontilhada** que se ramifica para os três produtos:
  **Carta**, **Carteira**, **Ranking (Top 20)**.

## 7. Estrutura das páginas

- `/` — Hero (partículas + comitê) → "O que você recebe" (`Deliverables`, com preview por aba) →
  CTA final. Enxuto: sem a antiga seção de 5 passos nem o mural de métricas.
- `/como-funciona` — comitê, pós-comitê, grounding de dados, loop de auto-melhoria. Sem eyebrows.
- `/exemplo` — carta semanal real renderizada de `content/carta-exemplo.md`.
- `/planos` — `PlanPicker`: **2 planos centralizados** (Carta / Gestora) + **add-ons como botões**
  (selecionáveis, alimentam o "Monte sua Gestora") + customizador à la carte. FAQ.
- `/sobre`, `/app` — institucional e stub de conta.
- **Removidos:** `/metodologia` (página inteira) e o produto **Watchlist** (de `lib/plans.ts` e dos
  textos). Rankings passou de Top-10 para **Top-20**.

## 8. Componentes-chave

| Caminho | Papel |
|---|---|
| `app/globals.css` | tokens, keyframes, prose editorial |
| `components/icons.tsx` | mapa `REPORT_ICON` (Flowbite) |
| `components/home/particles-bg.tsx` | constelação do hero |
| `components/home/agents-cross.tsx` | os 4 robôs + setas + produtos |
| `components/home/deliverables.tsx` | preview por aba (carta/carteira/rankings/aprof.) |
| `components/planos/plan-picker.tsx` | planos + add-ons + customizador |
| `components/ui/{button,card}.tsx` | primitivas (acento usa `text-on-accent`) |
| `lib/plans.ts` | modelo de preços — fonte única |

## 9. Regras ao editar

- Não reintroduzir modo claro nem serifa.
- Texto sobre ocre = `text-on-accent`. Nunca `text-white` sobre o acento.
- Toda animação nova entra via `motion-safe:` (ou checagem de reduced-motion no JS).
- Ícone de produto novo? Adicione ao `REPORT_ICON` em `components/icons.tsx`.
- Preço/plano muda só em `lib/plans.ts` — propaga para `/planos`, `/app` e os previews.
