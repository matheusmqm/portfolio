// Valida a estrutura da home gerada em dist/. Rode `npm run build` antes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pages = {
  pt: { html: readFileSync('dist/index.html', 'utf8'), skills: 'habilidades' },
  en: { html: readFileSync('dist/en/index.html', 'utf8'), skills: 'skills' },
};

for (const [lang, { html, skills }] of Object.entries(pages)) {
  test(`${lang}: seção de skills existe e a de sobre não`, () => {
    assert.match(html, new RegExp(`id="${skills}"`));
    assert.doesNotMatch(html, /id="(sobre|about)"/);
  });

  test(`${lang}: links da navegação apontam para ids existentes`, () => {
    const nav = html.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
    const hrefs = [...nav.matchAll(/href="[^"]*#([^"]+)"/g)].map((m) => m[1]);
    assert.ok(hrefs.length >= 4, 'nav deve ter projetos, experiência, habilidades e contato');
    for (const id of hrefs) assert.match(html, new RegExp(`id="${id}"`), `falta id="${id}"`);
  });

  test(`${lang}: hero tem a ficha com 4 itens e não há bloco "about"`, () => {
    const profile = html.match(/<dl class="profile"[\s\S]*?<\/dl>/)?.[0] ?? '';
    assert.equal((profile.match(/<dt/g) ?? []).length, 4);
    assert.doesNotMatch(html, /class="about"/);
  });
}
