// Copia os SVGs do Simple Icons usados em src/data/site.ts para public/icons/.
// Uso: npm run icons
import { readFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';

const source = readFileSync('src/data/site.ts', 'utf8');
const slugs = [...new Set([...source.matchAll(/icon:\s*'([a-z0-9]+)'/g)].map((m) => m[1]))];

mkdirSync('public/icons', { recursive: true });
const missing = [];
for (const slug of slugs) {
  const from = `node_modules/simple-icons/icons/${slug}.svg`;
  if (existsSync(from)) copyFileSync(from, `public/icons/${slug}.svg`);
  else missing.push(slug);
}
console.log(`ícones copiados: ${slugs.length - missing.length}/${slugs.length}`);
if (missing.length) {
  console.error(`sem ícone no Simple Icons: ${missing.join(', ')}`);
  process.exit(1);
}
