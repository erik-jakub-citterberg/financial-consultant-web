#!/usr/bin/env node
// Builds the design-preview site: every design side by side, with a switcher, for choosing
// a design with Erika. Output: dist-preview/ (Netlify publishes this folder, see netlify.toml).
//
//   /            chooser page (preview/index.html)
//   /povodny/    the original design, a frozen build of commit 3a0f8dd (preview/povodny/)
//   /rozhovor/   built from src/ with DESIGN=rozhovor
//   /identita/   built from src/ with DESIGN=identita
//
// Every page gets preview/switcher.js and a noindex tag: the preview must never compete
// with the real site in Google.
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { walk } from '../quality/_walk.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'dist-preview');
const BUILT = ['rozhovor', 'identita'];
const run = (cmd, env = {}) => execSync(cmd, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } });

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const d of BUILT) {
  console.log(`\n── building ${d} ──`);
  run('npx astro build', { DESIGN: d, BASE_PATH: `/${d}`, OUT_DIR: `./dist-preview/${d}`, PREVIEW: '1' });
  run(`node quality/sk-typo.mjs dist-preview/${d}`);
  run(`node scripts/rebase-links.mjs dist-preview/${d} /${d}`);
}

cpSync(join(root, 'preview/povodny'), join(OUT, 'povodny'), { recursive: true });
cpSync(join(root, 'preview/index.html'), join(OUT, 'index.html'));
cpSync(join(root, 'preview/switcher.js'), join(OUT, 'switcher.js'));
if (existsSync(join(root, 'preview/thumbs'))) cpSync(join(root, 'preview/thumbs'), join(OUT, 'thumbs'), { recursive: true });
writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
writeFileSync(join(OUT, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');

// Switcher + noindex into every design page
let pages = 0;
for (const f of walk(OUT, (p) => p.endsWith('.html'))) {
  if (f === join(OUT, 'index.html')) continue;
  let html = readFileSync(f, 'utf8');
  if (!html.includes('/switcher.js')) html = html.replace('</head>', '<script src="/switcher.js" defer></script></head>');
  if (!html.includes('name="robots"')) html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>');
  writeFileSync(f, html);
  pages++;
}
console.log(`\n✓ preview: ${pages} page(s) in ${BUILT.length + 1} designs → dist-preview/`);
