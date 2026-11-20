// Gera public/icons/*.svg para todo `icon: '...'` usado em src/data/site.ts.
// Formatos: 'python' (Simple Icons) ou 'conjunto:nome' ('logos:playwright', 'lucide:database'),
// onde conjunto é um pacote @iconify-json/<conjunto>. Arquivo: public/icons/<icon com ':' → '-'>.svg
// Uso: npm run icons
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';

const source = readFileSync('src/data/site.ts', 'utf8');
const icons = [...new Set([...source.matchAll(/icon:\s*'([a-z0-9:-]+)'/g)].map((m) => m[1]))];

mkdirSync('public/icons', { recursive: true });
const missing = [];
for (const icon of icons) {
  const out = `public/icons/${icon.replace(':', '-')}.svg`;
  if (!icon.includes(':')) {
    const from = `node_modules/simple-icons/icons/${icon}.svg`;
    if (existsSync(from)) copyFileSync(from, out);
    else missing.push(icon);
    continue;
  }
  const [set, name] = icon.split(':');
  const file = `node_modules/@iconify-json/${set}/icons.json`;
  const data = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
  const item = data?.icons?.[name];
  if (!item) {
    missing.push(icon);
    continue;
  }
  const w = item.width ?? data.width ?? 16;
  const h = item.height ?? data.height ?? 16;
  writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${item.body}</svg>\n`);
}
console.log(`ícones gerados: ${icons.length - missing.length}/${icons.length}`);
if (missing.length) {
  console.error(`não encontrados: ${missing.join(', ')}`);
  process.exit(1);
}
