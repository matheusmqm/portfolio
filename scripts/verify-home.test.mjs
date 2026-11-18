// Valida a estrutura da home gerada em dist/. Rode `npm run build` antes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const projects = readdirSync('src/data/projects')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/data/projects/${f}`, 'utf8')));

const pages = {
  pt: { html: readFileSync('dist/index.html', 'utf8'), skills: 'habilidades', heading: 'Habilidades' },
  en: { html: readFileSync('dist/en/index.html', 'utf8'), skills: 'skills', heading: 'Skills' },
};

const expectedSkills = [
  ['Python', 'SQL', 'Rust', 'C', 'C++', 'JavaScript', 'TypeScript'],
  ['pandas', 'NumPy', 'SQLAlchemy', 'DuckDB', 'PostgreSQL', 'FastAPI', 'Playwright', 'RAG'],
  ['AWS', 'Git', 'GitHub', 'Docker', 'CLI', 'Claude Code', 'Notion', 'Obsidian'],
];

for (const [lang, { html, skills, heading }] of Object.entries(pages)) {
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

  test(`${lang}: seção "${heading}" tem os 3 grupos pedidos, cada skill com ícone`, () => {
    const section = html.match(new RegExp(`<section[^>]*id="${skills}"[^]*?</section>`))?.[0] ?? '';
    assert.match(section, new RegExp(`<h2[^>]*>${heading}</h2>`));
    const groups = section.match(/<div class="skillgroup">[^]*?<\/ul><\/div>/g) ?? [];
    assert.equal(groups.length, 3);
    const names = groups.map((g) => [...g.matchAll(/<span class="skill__name">([^<]+)</g)].map((m) => m[1]));
    assert.deepEqual(names, expectedSkills);
    assert.doesNotMatch(section, /skill__icon--none/, 'skill sem ícone (iniciais)');
    const icons = [...section.matchAll(/url\(([^)]*\/icons\/[^)]+\.svg)\)/g)].map((m) => m[1]);
    assert.equal(icons.length, expectedSkills.flat().length, 'todo item deve ter ícone');
    for (const url of icons) assert.ok(existsSync('public' + url.slice(url.indexOf('/icons/'))), `ícone ausente: ${url}`);
  });

  test(`${lang}: projetos em linhas numeradas com botão de detalhes e painel`, () => {
    const rows = html.match(/<article class="row[^"]*"[^]*?<\/article>/g) ?? [];
    assert.equal(rows.length, projects.length);
    assert.match(rows[0], /row__num[^>]*>01</);
    for (const r of rows) {
      assert.match(r, /<button[^>]*class="row__toggle"[^>]*aria-expanded="false"/);
      const id = r.match(/aria-controls="([^"]+)"/)?.[1];
      assert.ok(id, 'toggle sem aria-controls');
      assert.match(r, new RegExp(`id="${id}"`), 'painel referenciado não existe');
    }
    assert.doesNotMatch(html, /undefined/);
  });

  test(`${lang}: painel mostra o que foi feito, tecnologias e GitHub só quando há repositório`, () => {
    const rows = html.match(/<article class="row[^"]*"[^]*?<\/article>/g) ?? [];
    for (const data of projects) {
      const row = rows.find((r) => r.includes(`row__title">${data.name}<`));
      assert.ok(row, `linha de ${data.name} ausente`);
      const items = row.match(/<li class="row__did-item"/g) ?? [];
      assert.equal(items.length, (data.did ?? []).length, `itens de "o que foi feito" de ${data.name}`);
      const techs = row.match(/<div class="techs"[^]*?<\/div>/)?.[0] ?? '';
      for (const tag of data.tags) assert.match(techs.toLowerCase(), new RegExp(tag), `tecnologia ${tag} ausente`);
      assert.equal(row.includes('row__repo'), Boolean(data.links?.repo), `link do repositório de ${data.name}`);
      if (data.links?.repo) assert.match(row, new RegExp(`href="${data.links.repo}"`));
      assert.equal((row.match(/<figure/g) ?? []).length, (data.images ?? []).length, `figuras de ${data.name}`);
    }
  });

  test(`${lang}: contato em faixa com kicker e e-mail grande; rodapé presente`, () => {
    const contact = html.match(/<section[^>]*class="[^"]*contact[^"]*"[^]*?<\/section>/)?.[0] ?? '';
    assert.match(contact, /class="label contact__kicker"/);
    assert.match(contact, /href="mailto:[^"]+"[^>]*>[^<]*contact__email|contact__email[^>]*href="mailto:/);
    assert.match(html, /<footer[^]*?©/);
  });

  test(`${lang}: botão e links de cada linha têm o nome do projeto para leitores de tela`, () => {
    const rows = html.match(/<article class="row[^"]*"[^]*?<\/article>/g) ?? [];
    assert.ok(rows.length > 0);
    for (const r of rows) {
      const name = r.match(/<h3 class="row__title">([^<]+)</)[1];
      assert.match(r, new RegExp(`class="row__toggle"[^]*?<span class="sr-only">[^<]*${name}`), 'toggle sem nome');
      assert.match(r, new RegExp(`class="link row__page"[^>]*>[^<]*<span class="sr-only">[^<]*${name}`), 'link sem nome');
    }
  });
}

test('coluna de miniatura só é reservada quando a linha tem miniatura', () => {
  const css = readFileSync('src/styles/components.css', 'utf8');
  const base = css.match(/^\.row \{[^}]*\}/m)?.[0] ?? '';
  assert.doesNotMatch(base, /176px/, '.row não deve reservar 176px sem miniatura');
  assert.match(css, /^\.row--has-thumb \{[^}]*176px/m);
  assert.match(readFileSync('src/components/ProjectRow.astro', 'utf8'), /row--has-thumb/);
});

test('título do hero usa a Newsreader e Crimson Pro, com arquivo local', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf8');
  assert.match(tokens, /font-family: "Newsreader"/);
  assert.match(tokens, /--font-display: "Newsreader"/);
  assert.ok(existsSync('public/fonts/Newsreader-Variable.woff2'));
  const hero = readFileSync('src/styles/components.css', 'utf8').match(/^\.hero h1 \{[^}]*\}/m)?.[0] ?? '';
  assert.match(hero, /var\(--font-display\)/);
});
