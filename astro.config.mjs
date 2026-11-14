import { defineConfig } from 'astro/config';

// Sem domínio próprio no GitHub Pages: defina `site` e `base` (nome do repositório).
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'pt-br',
    locales: ['pt-br', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
