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

  test(`${lang}: contato em faixa com kicker e e-mail grande; rodapé presente`, () => {
    const contact = html.match(/<section[^>]*class="[^"]*contact[^"]*"[^]*?<\/section>/)?.[0] ?? '';
    assert.match(contact, /class="label contact__kicker"/);
    assert.match(contact, /href="mailto:[^"]+"[^>]*>[^<]*contact__email|contact__email[^>]*href="mailto:/);
    assert.match(html, /<footer[^]*?©/);
  });

  test(`${lang}: "Detalhes" e "Ver projeto" de cada linha têm o nome do projeto para leitores de tela`, () => {
    const rows = html.match(/<article class="row"[^]*?<\/article>/g) ?? [];
    assert.ok(rows.length > 0);
    for (const r of rows) {
      const name = r.match(/<h3 class="row__title">([^<]+)</)[1];
      assert.match(r, new RegExp(`<summary>[^<]*<span class="sr-only">[^<]*${name}`), 'summary sem nome');
      assert.match(r, new RegExp(`<a class="link" href="[^"]+">[^<]*<span class="sr-only">[^<]*${name}`), 'link sem nome');
    }
  });

  test(`${lang}: hero tem o nome como título e sem o texto antigo`, () => {
    assert.match(html, /<h1[^>]*>\s*Matheus Mesquita\s*<\/h1>/);
    const main = html.match(/<main[^]*<\/main>/)?.[0] ?? '';
    assert.doesNotMatch(main, /funcionam|systems that|Sou Matheus|I'm Matheus/);
  });
}

test('coluna de miniatura só é reservada quando a linha tem miniatura', () => {
  const css = readFileSync('src/styles/components.css', 'utf8');
  const base = css.match(/^\.row \{[^}]*\}/m)?.[0] ?? '';
  assert.doesNotMatch(base, /176px/, '.row não deve reservar 176px sem miniatura');
  assert.match(css, /^\.row--has-thumb \{[^}]*176px/m);
  assert.match(readFileSync('src/components/ProjectRow.astro', 'utf8'), /row--has-thumb/);
});
