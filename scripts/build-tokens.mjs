// Gera src/styles/tokens.css a partir de design/tokens.json (fonte única do design system).
import { readFileSync, writeFileSync } from 'node:fs';

const t = JSON.parse(readFileSync(new URL('../design/tokens.json', import.meta.url), 'utf8'));
const light = t.color.themes[1].id;
const dark = t.color.themes[0].id;

const fontFace = t.type.fonts
  .map(
    (f) => `@font-face {
  font-family: "${f.family}";
  src: url("/fonts/${f.file.split('/').pop()}") format("woff2");
  font-weight: ${f.weight};
  font-style: ${f.style};
  font-display: swap;
}`
  )
  .join('\n');

const colorLine = (theme) =>
  t.color.tokens
    .map((c) => {
      const v = c.value[theme] ?? c.value[dark];
      return `  --${c.name}: ${v.replace(/^\{(.+)\}$/, 'var(--$1)')};`;
    })
    .join('\n');

const simple = (fam) => (t[fam]?.tokens ?? []).map((x) => `  --${x.name}: ${x.value};`).join('\n');
const fonts = Object.entries(t.type.families)
  .map(([k, v]) => `  --font-${k}: ${v};`)
  .join('\n');

const css = `/* matheus — generated from design/tokens.json. Não edite: rode \`npm run tokens\`. */
${fontFace}

:root {
${colorLine(dark)}
${fonts}
${simple('spacing')}
${simple('radius')}
${simple('layout')}
${simple('duration')}
${simple('easing')}
}

[data-theme="${light}"] {
${colorLine(light)}
}
`;

writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), css);
console.log('tokens.css gerado');
