// Valida a estrutura da home gerada em dist/. Rode `npm run build` antes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const projects = readdirSync('src/data/projects')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/data/projects/${f}`, 'utf8')));

const pages = {
  pt: { html: readFileSync('dist/index.html', 'utf8'), about: 'sobre', skills: 'habilidades', heading: 'Habilidades' },
  en: { html: readFileSync('dist/en/index.html', 'utf8'), about: 'about', skills: 'skills', heading: 'Skills' },
};

const expectedSkills = [
  ['Python', 'SQL', 'Rust', 'C', 'C++', 'JavaScript', 'TypeScript'],
  ['pandas', 'NumPy', 'SQLAlchemy', 'DuckDB', 'PostgreSQL', 'FastAPI', 'Playwright', 'RAG'],
  ['AWS', 'Git', 'GitHub', 'Docker', 'CLI', 'Claude Code', 'Notion', 'Obsidian'],
];

for (const [lang, { html, about, skills, heading }] of Object.entries(pages)) {
  test(`${lang}: sobre vive no topo, entre o nome e as habilidades, com os 2 parágrafos`, () => {
    const a = html.indexOf(`id="${about}"`), k = html.indexOf(`id="${skills}"`);
    assert.ok(a > html.indexOf('<h1') && a < k, 'sobre deve ficar entre o nome e as habilidades');
    assert.match(html, /class="lead hero__lead"/);
    assert.match(html, /class="hero__statement"/);
    assert.match(html, lang === 'pt' ? /Sou Software Engineer e estudante de Engenharia de Computação no IFCE/ : /I am a Software Engineer/);
  });

  test(`${lang}: links da navegação apontam para ids existentes`, () => {
    const nav = html.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
    const hrefs = [...nav.matchAll(/href="[^"]*#([^"]+)"/g)].map((m) => m[1]);
    assert.ok(hrefs.length >= 4, 'nav deve ter projetos, experiência, habilidades e contato');
    for (const id of hrefs) assert.match(html, new RegExp(`id="${id}"`), `falta id="${id}"`);
  });

  test(`${lang}: hero tem só GitHub, LinkedIn e currículo, sem frases de apresentação`, () => {
    const card = html.match(/<aside class="profile-card"[\s\S]*?<\/aside>/)?.[0] ?? '';
    assert.doesNotMatch(card, /<ul/);
    assert.doesNotMatch(html, /Fortaleza/);
    assert.match(card, /github\.com/);
    assert.match(card, /linkedin\.com/);
    const cv = card.match(/href="([^"]*cv\/[^"]+\.pdf)"/)?.[1];
    assert.ok(cv, 'link do currículo ausente');
    assert.match(cv, lang === 'pt' ? /ResumeBR/ : /ResumeEN/);
    assert.ok(existsSync('public' + cv.slice(cv.indexOf('/cv/'))), 'PDF ausente em public/cv');
  });

  test(`${lang}: experiência usa só AWS, e a home não tem hashtags de projeto`, () => {
    const exp = html.match(/<div class="exp">[\s\S]*?<\/ul>[\s\S]*?<\/div>/)?.[0] ?? '';
    assert.match(exp, /#aws/);
    assert.doesNotMatch(exp, /lambda|#s3/i);
    assert.doesNotMatch(html, /filter-chips|#(stockfish|rag|llm)/i);
  });

  test(`${lang}: links do topo ficam logo abaixo do nome`, () => {
    const h = html.indexOf('<h1'), l = html.indexOf('profile-card'), lead = html.indexOf('hero__lead');
    assert.ok(h < l && l < lead);
  });

  test(`${lang}: sem páginas de projeto e sem duração na experiência`, () => {
    assert.doesNotMatch(html, /href="[^"]*\/(projetos|projects|tags)\/[^"]+"/);
    assert.doesNotMatch(html, /exp__dur|\d+ (meses|months)/);
    assert.match(html, /matheus\.mqm@outlook\.com/);
  });

  test(`${lang}: experiência termina em nov/2026 e não cita "hoje"`, () => {
    const exp = html.match(/<div class="exp">[\s\S]*?<\/ul>/)?.[0] ?? '';
    assert.match(exp, lang === 'pt' ? /jul\/2026[\s\S]*nov\/2026/ : /Jul 2026[\s\S]*Nov 2026/);
    assert.doesNotMatch(exp, /hoje|present/i);
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

  test(`${lang}: painel mostra o que foi feito e GitHub só quando há repositório`, () => {
    const rows = html.match(/<article class="row[^"]*"[^]*?<\/article>/g) ?? [];
    for (const data of projects) {
      const row = rows.find((r) => r.includes(`row__title">${data.name}<`));
      assert.ok(row, `linha de ${data.name} ausente`);
      const items = row.match(/<li class="row__did-item"/g) ?? [];
      assert.equal(items.length, (data.did ?? []).length, `itens de "o que foi feito" de ${data.name}`);
        assert.doesNotMatch(row, /techs|row__tech/, 'sem hashtags de tecnologia');
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
