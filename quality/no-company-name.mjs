#!/usr/bin/env node
// Fails when the built site names the company Erika works through.
// Not cleared yet (October 2026). Delete this check once naming it is confirmed.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { walk } from './_walk.mjs';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const re = /\bOVB\b|Allfinanz/gi;
let hits = 0;
for (const f of walk(dist, (p) => /\.(html|xml|txt|json)$/.test(p))) {
  const n = (readFileSync(f, 'utf8').match(re) || []).length;
  if (n) { console.error(`  [company name] ×${n} in ${f}`); hits += n; }
}
if (hits) { console.error(`no-company-name: ${hits} mention(s)`); process.exit(1); }
console.log('no-company-name: OK');
