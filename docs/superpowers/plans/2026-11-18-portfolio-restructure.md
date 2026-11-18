# Reestruturação do portfólio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar a estrutura do portfólio de referência (hero em duas colunas com ficha, skills com ícones, projetos em linhas numeradas expansíveis, contato em faixa) para o site Astro atual, sem mudar a identidade visual.

**Architecture:** Adaptar `HomeView.astro` e os componentes existentes. Dados novos (ficha, skills) ficam em `src/data/site.ts`; strings novas em `src/i18n/ui.ts`; estilos em `src/styles/components.css` usando só os tokens existentes. Um teste `node:test` lê `dist/` após o build e valida a estrutura de `/` e `/en/`.

**Tech Stack:** Astro 7, CSS com tokens (`design/tokens.json`), JS inline para busca/filtro, `simple-icons` (devDependency, só para copiar SVGs), `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-18-portfolio-restructure-design.md`

## Global Constraints

- Identidade mantida: Instrument Serif, Hanken Grotesk, Geist Mono; apenas tokens existentes (`--bg`, `--surface`, `--accent`, `--border`…); nenhum hex novo.
- Todo texto novo existe em PT e EN (`ui.ts`, `site.ts`).
- Sem CDN: ícones em `public/icons/*.svg`.
- Melhoria progressiva: sem JS, linhas, `<details>` e chips (links) continuam utilizáveis.
- Não citar nomes de projetos internos do BTG Pactual.
- Não copiar textos, dados pessoais ou assets da referência.
- Commits em português, terminando com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Projeto sem `summary`, sem `tags`, sem `status` ou sem imagem: a linha deve renderizar sem buracos nem "undefined".
2. Nome/resumo longos em 320px de largura: sem rolagem horizontal.
3. Filtro/busca sem resultado na visualização de linhas: mensagem `noResults` aparece e a lista some.
4. Skill sem ícone no Simple Icons (ex.: "Data quality"): aparece só o texto, alinhado com as demais.
5. Tema claro: contraste do ícone (mask com `currentColor`) e da faixa de contato.

---

### Task 1: Dados, i18n e teste de estrutura

**Files:**
- Modify: `src/data/site.ts` (remove `about`; adiciona `profile`, `skills`)
- Modify: `src/i18n/ui.ts` (strings; `paths.section`)
- Create: `scripts/verify-home.test.mjs`
- Modify: `package.json` (script `test`)

**Interfaces:**
- Produces (`site.ts`):
  - `export interface ProfileFact { key: 'basedIn' | 'now' | 'degree' | 'focus'; value: L }`
  - `export const profile: ProfileFact[]`
  - `export interface Skill { name: string; icon?: string }` (`icon` = slug do Simple Icons)
  - `export interface SkillGroup { title: L; items: Skill[] }`
  - `export const skills: SkillGroup[]` (grupos Linguagens/Languages, Dados/Data, Ferramentas/Tools)
- Produces (`ui.ts`): chaves em PT e EN: `skills`, `basedIn`, `now`, `degree`, `focus`, `details`, `viewProject`, `contactKicker`; `nav.skills`. Remove `about`, `formation`, `languages`, `interests`.
- Produces: `paths.section(l, id: 'projetos' | 'experiencia' | 'contato' | 'habilidades')` → ids de âncora `habilidades` (pt) / `skills` (en). Remove `'sobre'`.

- [ ] **Step 1: Escrever o teste (falha)** em `scripts/verify-home.test.mjs`, com `node:test` + `node:assert/strict`, lendo `dist/index.html` e `dist/en/index.html`. Asserções iniciais:
  - existe `id="habilidades"` em PT e `id="skills"` em EN; não existe `id="sobre"` nem `id="about"`;
  - cada `href="#…"` da `<nav>` aponta para um `id` presente na mesma página;
  - 3 `<h3` de grupo de skills por página (ajustado na Task 4).
- [ ] **Step 2:** Adicionar `"test": "node --test scripts/"` em `package.json`. Rodar `npm run build && npm test`. Esperado: FAIL (ids de skills ausentes).
- [ ] **Step 3:** Implementar os dados/tipos acima. `profile` vem do usuário: `basedIn` "Fortaleza, CE", `now` "Automation Developer, BTG Pactual", `degree` "Engenharia da Computação, IFCE" / "Computer Engineering, IFCE", `focus` "Automação, engenharia de dados, finanças quantitativas" / EN equivalente (textos já existentes no `about.facts`). `skills` inicial: tecnologias de `experience[0].stack` e das tags dos projetos (python, sql, pandas, playwright, postgresql, fastapi, react, aws-lambda, s3, git, docker…). **Marcar com comentário que o usuário deve revisar a lista.**
- [ ] **Step 4:** Atualizar `TopBar.astro` (`items` ganha `skills`) e os usos de `paths.section('sobre')`. O build ainda falha no teste até a Task 4, mas `npm run build` deve compilar sem erro de tipo.
- [ ] **Step 5: Commit** `feat: dados de ficha e skills, chaves de i18n e teste de estrutura`

### Task 2: Ícones locais

**Files:**
- Create: `scripts/build-icons.mjs`, `public/icons/*.svg` (gerados e commitados)
- Modify: `package.json` (devDependency `simple-icons`, script `icons`)

**Interfaces:**
- Consumes: `skills` de `src/data/site.ts` (Task 1).
- Produces: `public/icons/<slug>.svg` para cada `Skill.icon` existente.

- [ ] **Step 1:** `npm i -D simple-icons`.
- [ ] **Step 2:** `scripts/build-icons.mjs`: lê os slugs de `skills` (importar `site.ts` não é possível em Node puro; o script faz `await import` de um JSON ou extrai os slugs por regex de `icon: '…'`, à escolha do implementador) e copia `node_modules/simple-icons/icons/<slug>.svg` para `public/icons/`. Slug inexistente: imprime aviso e sai com código 1.
- [ ] **Step 3:** Rodar `npm run icons`. Esperado: um `.svg` por skill com `icon`; remover o campo `icon` das skills sem arquivo (viram só texto).
- [ ] **Step 4: Commit** `feat: ícones locais das tecnologias`

### Task 3: Hero em duas colunas com ficha

**Files:**
- Modify: `src/views/HomeView.astro` (remove seção "sobre" e o import de `about`; novo hero)
- Create: `src/components/ProfileCard.astro` (`Props { lang: Lang }`; renderiza `<dl class="profile">` com `profile` + links GitHub/LinkedIn)
- Modify: `src/styles/components.css` (`.hero__grid`, `.profile`; remove `.about`, `.facts`)

**Interfaces:**
- Consumes: `profile`, `social`, `t(lang)`.
- Produces: `<ProfileCard lang />`.

- [ ] **Step 1:** Estender o teste: PT e EN contêm `class="profile"` com 4 `<dt>`; não contêm `class="about"`. Rodar, ver falhar.
- [ ] **Step 2:** Hero: `.hero__grid` de duas colunas (texto 1.3fr / ficha 1fr) com `HandCircle`, lead e botões à esquerda e `ProfileCard` à direita; abaixo de 900px (container query `page`) empilha, ficha depois dos botões. Ficha: linhas `dt` em `label label--muted` e `dd` em 15px, separadas por `border-top: 1px solid var(--border)`, como o `.facts` atual.
- [ ] **Step 3:** Rodar `npm run build && npm test`. Esperado: asserções do hero passam.
- [ ] **Step 4:** Conferir visualmente PT desktop (1280) e 375px com Playwright; sem rolagem horizontal.
- [ ] **Step 5: Commit** `feat: hero em duas colunas com ficha`

### Task 4: Seção de skills

**Files:**
- Create: `src/components/SkillGroup.astro` (`Props { title: string; items: Skill[] }`)
- Modify: `src/views/HomeView.astro` (nova `<section id={id.skills}>` entre hero e experiência), `src/styles/components.css`

**Interfaces:**
- Consumes: `skills`, `Skill`, `import.meta.env.BASE_URL` para o caminho dos ícones.
- Produces: `<SkillGroup title items />` — `<h3>` + `<ul>`; cada `<li>` tem `<span class="skill__icon" style="--icon:url(...)">` (omitido sem `icon`, `aria-hidden`) e o nome.

- [ ] **Step 1:** Estender o teste: PT e EN têm 3 `<h3` de grupo dentro da seção de skills; todo `url(` de ícone referencia um arquivo existente em `public/icons`. Ver falhar.
- [ ] **Step 2:** Implementar. Ícone via `mask: var(--icon) center / contain no-repeat; background: currentColor` em `.skill__icon` (herda `--text-muted`; hover → `--text`), para funcionar nos dois temas. Grade `repeat(auto-fill, minmax(96px, 1fr))` por grupo; grupos lado a lado ≥900px, empilhados abaixo.
- [ ] **Step 3:** Rodar build + teste (PASS). Conferir tema claro e escuro no Playwright (`prefers-color-scheme`/`data-theme`).
- [ ] **Step 4: Commit** `feat: seção de skills com ícones`

### Task 5: Projetos em linhas numeradas

**Files:**
- Create: `src/components/ProjectRow.astro` (substitui `ProjectList.astro`, que é removido)
- Modify: `src/views/HomeView.astro` (monta `items` com `status`, `context`, `thumb`; usa `ProjectRow`; JS com `view` padrão `'list'` e sem `data-year-head`), `src/components/FilterBar.astro` (botão `list` pressionado por padrão, `grid` não), `src/styles/components.css` (troca `.plist/.prow` por `.rows/.row`)

**Interfaces:**
- Produces: `ProjectRow` com `Props { index: number; name: string; year: number; status?: string; summary?: string; context?: string; tags: string[]; thumb?: string; href: string; search: string; lang: Lang }`.
- Estrutura: `<article class="row" data-tags data-search>`; número `String(index+1).padStart(2,'0')` em serifa na cor `--accent`; título (serifa) e resumo; meta mono `{year} · {status}`; hashtags (`Hashtag`, sem href); miniatura `<img loading="lazy">` se `thumb` (= `images[0].src`); `<details class="row__more"><summary>{u.details}</summary>` com `context` e link `{u.viewProject}` → `href`.

- [ ] **Step 1:** Estender o teste: nº de `class="row"` em `/` e `/en/` = nº de arquivos em `src/data/projects`; cada linha tem `<details`; o primeiro número é `01`; nenhuma ocorrência de `undefined` no HTML. Ver falhar.
- [ ] **Step 2:** Implementar `ProjectRow` e ligar na `HomeView`. Em `apply()` do JS, o contador `shown` usa `.row[data-tags]:not([hidden])` na visualização de linhas; remover o ramo de `data-year-head`. Linha: grade `64px / 1fr / auto(thumb 176px) / auto(details)`; ≤640px: número + texto, thumb e details abaixo; títulos com `overflow-wrap: anywhere`.
- [ ] **Step 3:** Build + teste (PASS). No Playwright: filtrar por uma hashtag, buscar um termo sem resultado (mensagem aparece), alternar grade/linhas, abrir/fechar `<details>`, 320px sem rolagem horizontal.
- [ ] **Step 4: Commit** `feat: projetos em linhas numeradas com detalhes expansíveis`

### Task 6: Contato em faixa, rodapé e verificação final

**Files:**
- Modify: `src/views/HomeView.astro` (contato), `src/components/Footer.astro`, `src/styles/components.css`

- [ ] **Step 1:** Estender o teste: seção de contato contém `mailto:` com `social.email`; rodapé contém `rights`. Ver falhar se a marcação mudar.
- [ ] **Step 2:** Contato: faixa de largura total (`background: var(--surface)`, borda superior `--border`), rótulo `contactKicker`, e-mail em serifa grande (`clamp(32px, 6vw, 56px)`, sublinhado `--accent`), links de GitHub/LinkedIn abaixo. Rodapé: `rights` + link do código-fonte opcional; manter `LangSwitch`.
- [ ] **Step 3:** `npm run build && npm test` — tudo PASS. Playwright: screenshots PT/EN em 1280 e 375, tema escuro e claro; conferir os 5 itens do Review Focus.
- [ ] **Step 4: Commit** `feat: contato em faixa e rodapé`

---

## Self-review

- Cobertura do spec: hero+ficha (T3), skills (T1,2,4), linhas numeradas (T5), contato escuro (T6), busca/filtros/grade-lista mantidos (T5), PT/EN (T1 + testes em `/` e `/en/`).
- Chamadas minhas, a validar: faixa de contato usa `--surface` (escura no tema escuro, clara no claro) em vez de um token novo; `ProjectList` é removido em favor de `ProjectRow`; a lista de skills é provisória.
