# Portfólio — Matheus

Site estático bilíngue (PT-BR / EN) em Astro, seguindo o design system "matheus".

- `npm run dev` · `npm run build` · `npm run preview`
- Tokens: edite `design/tokens.json`; `npm run tokens` regenera `src/styles/tokens.css` (o build já roda isso).
- Projetos: um JSON por projeto em `src/data/projects/` (validado em `src/content.config.ts`).
- Textos da interface: `src/i18n/ui.ts`. Experiência e Sobre: `src/data/site.ts`.
- Provisórios: e-mail e LinkedIn em `src/i18n/ui.ts` (`social`).
