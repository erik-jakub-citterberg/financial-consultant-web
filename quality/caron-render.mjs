#!/usr/bin/env node
// Caron render check: proves that every font/weight the BUILT site uses actually draws
// Slovak carons in real words. Found 2026-09-28: Red Hat Display, Libre Franklin and Archivo
// silently drop the caron of ľ/ď when an ascender follows ("veľký" → "velký", "koľko" → "kolko"),
// even though a pangram like "Kŕdeľ šťastných ďatľov" looks perfect. Eyes miss this; pixels don't.
//
// How: open the built site in Chromium, read the font families and weights in use, then draw
// each test pair on a canvas ("ľk" vs "lk"). Identical pixels = the accent was lost.
// Usage: node quality/caron-render.mjs            (after `npm run build`)
import { chromium } from 'playwright';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join, extname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
// Optional first argument: another build folder (the preview build uses one per design).
const dist = process.argv[2] ? resolve(process.argv[2]) : join(here, '..', 'dist');
if (!existsSync(join(dist, (process.argv[3] || ''), 'index.html'))) { console.error('✗ caron-render: dist/ missing, run `npm run build` first.'); process.exit(1); }

// Optional second argument: URL prefix of a design inside a multi-design build (e.g. /rozhovor).
const prefix = (process.argv[3] || '').replace(/\/$/, '');
const PAGES = ['/', '/poistenie/', '/o-mne/'].map((p) => prefix + p);
const PAIRS = [
  ['ľk', 'lk'], ['ľb', 'lb'], ['ľh', 'lh'], ['ľl', 'll'], ['ľt', 'lt'], ['ľa', 'la'],
  ['ďk', 'dk'], ['ďb', 'db'], ['ďa', 'da'], ['ťk', 'tk'], ['ťa', 'ta'],
  ['Ľu', 'Lu'], ['Ťa', 'Ta'], ['Ďu', 'Du'], ['ŕa', 'ra'], ['ĺa', 'la'], ['ôa', 'oa'], ['äa', 'aa'],
];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml' };

const launchOpts = existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
let browser;
try { browser = await chromium.launch(launchOpts); }
catch (e) { console.error('✗ caron-render: could not start Chromium (run `npx playwright install chromium`).\n  ' + e.message.split('\n')[0]); process.exit(1); }

const page = await browser.newPage();
await page.route('http://site.test/**', (route) => {
  let p = new URL(route.request().url()).pathname;
  if (p.endsWith('/')) p += 'index.html';
  const f = join(dist, decodeURIComponent(p));
  if (!existsSync(f)) return route.fulfill({ status: 404, body: '' });
  route.fulfill({ status: 200, body: readFileSync(f), contentType: TYPES[extname(f)] || 'application/octet-stream' });
});

// Collect (family, weight) combinations actually used for text on key pages
const combos = new Map();
for (const path of PAGES) {
  const res = await page.goto('http://site.test' + path, { waitUntil: 'load' }).catch(() => null);
  if (!res || res.status() !== 200) continue;
  await page.evaluate(() => document.fonts.ready);
  const used = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('h1,h2,h3,p,li,a,b,strong,summary,.btn,small,em,th,td')) {
      if (!el.textContent.trim()) continue;
      const cs = getComputedStyle(el);
      const fam = cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
      out.push(fam + '|' + cs.fontWeight);
    }
    return [...new Set(out)];
  });
  for (const u of used) combos.set(u, path);
}

const failures = [];
for (const key of combos.keys()) {
  const [family, weight] = key.split('|');
  const bad = await page.evaluate(async ({ family, weight, pairs }) => {
    await document.fonts.load(`${weight} 48px "${family}"`, 'ľďťĽŤĎŕĺôä lkdt');
    if (!document.fonts.check(`${weight} 48px "${family}"`, 'ľ')) return ['font not loaded'];
    const c = document.createElement('canvas'); c.width = 240; c.height = 110;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    const ink = (t) => {
      ctx.clearRect(0, 0, 240, 110); ctx.font = `${weight} 64px "${family}"`; ctx.fillStyle = '#000'; ctx.fillText(t, 20, 90);
      const d = ctx.getImageData(0, 0, 240, 110).data; let n = 0; for (let i = 3; i < d.length; i += 4) n += d[i]; return n;
    };
    // The accent's own ink (single glyph) vs the ink it still adds next to the following letter.
    // A caron hidden, shrunk or dropped in context adds much less ink than it does alone.
    return pairs.filter(([acc, base]) => {
      const alone = ink(acc[0]) - ink(base[0]);
      const inContext = ink(acc) - ink(base);
      return alone <= 0 || inContext / alone < 0.8;
    }).map(([acc]) => acc);
  }, { family, weight, pairs: PAIRS });
  if (bad.length) failures.push(`  [caron] "${family}" ${weight}: accent lost in ${bad.join(' ')}`);
}
await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\n✗ caron-render: ${failures.length} font/weight(s) drop Slovak accents. Pick another face (see DESIGN.md, font table).`);
  process.exit(1);
}
console.log(`✓ caron-render: ${combos.size} font/weight combination(s) draw every Slovak accent.`);
