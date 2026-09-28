#!/usr/bin/env node
// Rewrites root-relative links in a built site so it works under a sub-path.
// Astro's `base` prefixes its own assets, but hand-written links like href="/poistenie"
// stay at the root. Usage: node scripts/rebase-links.mjs <buildDir> </prefix>
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { walk } from '../quality/_walk.mjs';

const [dir, rawPrefix] = process.argv.slice(2);
if (!dir || !rawPrefix) { console.error('usage: rebase-links.mjs <buildDir> </prefix>'); process.exit(1); }
const prefix = '/' + rawPrefix.replace(/^\/|\/$/g, '');

let n = 0;
for (const f of walk(resolve(dir), (p) => p.endsWith('.html'))) {
  const src = readFileSync(f, 'utf8');
  // href="/x", src="/x", action="/x"; skip protocol-relative (//), anchors and already-prefixed paths
  const out = src.replace(/\b(href|src|action)="\/(?!\/)([^"]*)"/g, (m, attr, rest) => {
    const path = '/' + rest;
    if (path === prefix || path.startsWith(prefix + '/')) return m;
    n++;
    return `${attr}="${prefix}${path === '/' ? '/' : path}"`;
  });
  if (out !== src) writeFileSync(f, out);
}
console.log(`✓ rebase-links: ${n} link(s) moved under ${prefix}/`);
