#!/usr/bin/env node
// Slovak micro-typography, applied to the built HTML (runs after `astro build`).
// A Slovak typesetter would never leave a one-letter word at the end of a line,
// or split a number from its unit. AI-built sites always do. This fixes it everywhere,
// including Markdown blog content, without touching attributes, scripts or code.
//
//  - non-breaking space after one-letter words: a i k o s u v z (both cases)
//  - non-breaking space between a number and €, %, Kč, rokov/rokoch
//  - spaced em dash -> spaced en dash (Slovak pomlčka)
//  - en dash in numeric ranges: 40-70 € -> 40–70 €
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { walk } from './_walk.mjs';

const here = dirname(fileURLToPath(import.meta.url));
// Optional first argument: another build folder (the preview build uses one per design).
const dist = process.argv[2] ? resolve(process.argv[2]) : join(here, '..', 'dist');
if (!existsSync(dist)) { console.error('sk-typo: dist/ not found'); process.exit(1); }

const NBSP = ' ';
const SKIP = /^<(script|style|pre|code|textarea)\b/i;
const END = /^<\/(script|style|pre|code|textarea)\b/i;

function fixText(t) {
  // one-letter words (repeat to catch chains like "a v Brezne")
  for (let i = 0; i < 2; i++) {
    t = t.replace(/(^|[\s („"«])([aiksouvzAIKSOUVZ]) +(?=\S)/g, `$1$2${NBSP}`);
  }
  t = t.replace(/ \u2014 /g, ' \u2013 '); // SK pomlčka is a spaced en dash
  t = t.replace(/(\d) ?- ?(\d[\d ,.]*) ?(€|%)/g, `$1–$2${NBSP}$3`);
  t = t.replace(/(\d) (€|%|Kč|rokov|rokoch|mesiacov)/g, `$1${NBSP}$2`);
  return t;
}

let files = 0;
for (const f of walk(dist, (p) => p.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  const parts = html.split(/(<[^>]+>)/);
  let skip = 0;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith('<')) {
      if (SKIP.test(p) && !p.endsWith('/>')) skip++;
      else if (END.test(p) && skip > 0) skip--;
      continue;
    }
    if (!skip && p.trim()) parts[i] = fixText(p);
  }
  const out = parts.join('');
  if (out !== html) { writeFileSync(f, out); files++; }
}
console.log(`✓ sk-typo: Slovak micro-typography applied to ${files} page(s).`);
