#!/usr/bin/env node
// Pattern linter: catches the LAYOUT and ORNAMENT tells that make a site read as AI-built,
// including the "premium" kit that anti-slop guides themselves produced in 2025-26.
// Evidence: DESIGN.md > "Research: why it still looked AI-made".
// Usage: node quality/pattern-lint.mjs   (scans src/)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { walk } from './_walk.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const files = walk(join(root, 'src'), (f) => /\.(astro|css|md|mdx)$/.test(f));

const rules = [
  // markup
  { id: 'eyebrow-label', re: /class="[^"]*\beyebrow\b/, why: 'Small label above a heading ("badge above H1") is a top AI tell. Let the heading speak.' },
  { id: 'stat-banner', re: /data-count=|class="[^"]*\b(stats-strip|statline)\b/, why: 'Stat banner rows (and count-up numbers) are a template move. State real facts in context.' },
  { id: 'feather-icons', re: /M14 2H6a2 2 0 0 0-2 2v16|M3 9l9-7 9 7v11|polyline points="23 6 13\.5 15\.5/, why: 'Stock Feather/Lucide icons. Use none, or a set drawn for this site.' },
  { id: 'decorative-rings', re: /hero-rings|<circle[^>]+stroke="rgba\(/, why: 'Decorative concentric rings are filler ornament.' },
  { id: 'glyph-watermark', re: /data-glyph=/, why: 'Giant faded letter watermarks are a 2025 "premium" cliché.' },
  // css
  { id: 'grain-texture', re: /fractalNoise|feTurbulence/, why: 'SVG grain/noise texture is part of the anti-slop cookbook kit that now reads as AI.' },
  { id: 'glow-gradient', re: /radial-gradient\([^)]*(rgba|transparent)/, why: 'Soft radial glows on hero panels are a recognisable AI hero treatment.' },
  { id: 'left-border-callout', re: /border-left:\s*\d+px\s+solid\s+var\(--color-accent/, why: 'Coloured left-border callouts are a listed AI pattern.' },
  { id: 'tracked-caps', re: /text-transform:\s*uppercase[^}]*letter-spacing:\s*0?\.(0[6-9]|[1-9])/s, why: 'Tracked all-caps micro-labels. Use sentence case.' },
  { id: 'spring-lift', re: /translateY\(-[3-9]px\)/, why: 'Hover lift on cards/buttons is the default AI hover. Change colour/underline instead.' },
];

let hits = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  for (const r of rules) {
    if (r.id === 'tracked-caps') {
      // rule spans a block: check each CSS block
      for (const m of src.matchAll(/\{[^{}]*\}/g)) {
        if (r.re.test(m[0])) {
          const line = src.slice(0, m.index).split('\n').length;
          console.error(`  [${r.id}] ${relative(root, f)}:${line}  ${r.why}`); hits++;
        }
      }
      continue;
    }
    lines.forEach((l, i) => {
      if (r.re.test(l)) { console.error(`  [${r.id}] ${relative(root, f)}:${i + 1}  ${r.why}`); hits++; }
    });
  }
}
if (hits) { console.error(`\n✗ pattern-lint: ${hits} AI-pattern hit(s).`); process.exit(1); }
console.log(`✓ pattern-lint: clean (${files.length} file(s)).`);
