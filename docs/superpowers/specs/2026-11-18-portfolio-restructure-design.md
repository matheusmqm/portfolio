# Reestruturação do portfólio a partir da referência (design curto)

Status: aprovado pelo usuário em 2026-11-18.

## Intenção
O usuário gostou da estrutura de https://samuelmel.github.io/portfolio/ e quer essa estrutura no portfólio atual, mantendo a identidade visual (Instrument Serif, Hanken Grotesk, Geist Mono, tokens em `design/tokens.json`, PT/EN, `HandCircle`).

## Objetivos
1. Hero em duas colunas: nome, lead e CTAs à esquerda; ficha lateral (mora em, agora, formação, foco) e links (GitHub, LinkedIn, CV) à direita. A seção "Sobre" é absorvida pelo hero.
2. Nova seção de skills agrupada (Linguagens, Dados, Ferramentas), com ícones SVG locais (Simple Icons).
3. Projetos como linhas numeradas (01, 02…): título, resumo, ano, status, ícones da stack, miniatura opcional e "Detalhes" expansível.
4. Manter experiência e contato; contato vira bloco escuro com e-mail grande em serifa.
5. Manter busca, filtros por hashtag, atalho Ctrl/Cmd+K e alternância grade/lista.

## Não-objetivos
- Mudar a identidade visual, as fontes ou a paleta.
- Copiar textos, dados pessoais ou assets da referência.
- Trocar de framework (continua Astro).

## Restrições
- Bilíngue PT/EN em todas as novas strings (`src/i18n/ui.ts`, `src/data/site.ts`).
- Sem CDN: ícones e imagens locais.
- Melhoria progressiva: sem JS o conteúdo continua acessível.
- Nunca citar nomes de projetos internos do BTG Pactual.

## Abordagens consideradas
- **A (escolhida):** adaptar os componentes e views existentes (`HomeView`, `ProjectCard`/`ProjectList`, `Footer`), adicionando uma seção de skills e uma ficha no hero.
- B: reescrever a home do zero. Descartada: perde filtros/i18n já prontos.
- C: só trocar estilos. Descartada: não traz a estrutura pedida.

## Decisões do builder (a validar)
- Ícones: SVGs da Simple Icons salvos em `public/icons/`, mapeados por slug em `site.ts`.
- Miniatura é opcional por projeto; linha sem imagem continua válida.
- Dados de skills em `site.ts`, agrupados e traduzíveis.
