#!/usr/bin/env node
// Copy linter: fails the build when AI-tell language appears in page content.
// Usage: node quality/copy-lint.mjs [files...]   (defaults to scanning src/)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { walk } from './_walk.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(here, 'banned-copy.json'), 'utf8'));

const args = process.argv.slice(2);
const files = args.length
  ? args
  : walk(join(here, '..', 'src'), (f) => /\.(astro|md|mdx)$/.test(f));

// Strip code fences, frontmatter, HTML tags and Astro expressions so we only lint prose.
function extractProse(src) {
  return src
    .replace(/^---[\s\S]*?---/m, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/<[^>]+>/g, ' ');
}

const needles = [
  ...cfg.buzzwords_en.map((t) => ['buzzword', t]),
  ...cfg.buzzwords_sk.map((t) => ['buzzword', t]),
  ...cfg.phrases.map((t) => ['phrase', t]),
  ...cfg.vague_claims.map((t) => ['vague claim', t]),
];

let violations = 0;
for (const file of files) {
  let raw;
  try { raw = readFileSync(file, 'utf8'); } catch { continue; }
  const prose = extractProse(raw);
  const lower = prose.toLowerCase();

  for (const [kind, term] of needles) {
    const t = term.toLowerCase();
    // word-ish boundary for single tokens, substring for multi-word phrases
    const re = /\s/.test(t)
      ? new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      : new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const hits = (lower.match(re) || []).length;
    if (hits > 0) {
      console.error(`  [${kind}] "${term}" ×${hits}  in ${file}`);
      violations += hits;
    }
  }

  const chars = prose.replace(/\s+/g, ' ').length || 1;
  const emDashes = (prose.match(/—/g) || []).length;
  const perK = (emDashes / chars) * 1000;
  if (perK > cfg.limits.maxEmDashesPer1000Chars) {
    console.error(`  [em-dash] ${emDashes} em dashes (${perK.toFixed(1)}/1k chars, limit ${cfg.limits.maxEmDashesPer1000Chars})  in ${file}`);
    violations++;
  }
}

if (violations > 0) {
  console.error(`\n✗ copy-lint: ${violations} AI-tell hit(s). Rewrite in the consultant's real voice (see DESIGN.md).`);
  process.exit(1);
}
console.log(`✓ copy-lint: clean (${files.length} file(s)).`);
