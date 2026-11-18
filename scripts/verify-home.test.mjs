// Valida a estrutura da home gerada em dist/. Rode `npm run build` antes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

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

  test(`${lang}: skills têm 3 grupos e todo ícone referenciado existe`, () => {
    const section = html.match(new RegExp(`<section[^>]*id="${skills}"[^]*?</section>`))?.[0] ?? '';
    assert.equal((section.match(/<h3/g) ?? []).length, 3);
    const icons = [...section.matchAll(/url\(([^)]*\/icons\/[^)]+\.svg)\)/g)].map((m) => m[1]);
    assert.ok(icons.length > 0, 'deve haver ao menos um ícone');
    for (const url of icons) assert.ok(existsSync('public' + url.slice(url.indexOf('/icons/'))), `ícone ausente: ${url}`);
  });

  test(`${lang}: projetos em linhas numeradas com detalhes expansíveis`, () => {
    const total = readdirSync('src/data/projects').filter((f) => f.endsWith('.json')).length;
    const rows = html.match(/<article class="row"[^]*?<\/article>/g) ?? [];
    assert.equal(rows.length, total);
    for (const r of rows) assert.match(r, /<details/);
    assert.match(rows[0], /row__num[^>]*>01</);
    assert.doesNotMatch(html, /undefined/);
  });
}
