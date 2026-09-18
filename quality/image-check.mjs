#!/usr/bin/env node
// Image authenticity check: flags stock/placeholder/AI-illustration filenames and missing alt text.
// Usage: node quality/image-check.mjs [files...]   (defaults to scanning src/)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { walk } from './_walk.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const files = args.length
  ? args
  : walk(join(here, '..', 'src'), (f) => /\.(astro|md|mdx)$/.test(f));

const BANNED_FILENAME_TOKENS = [
  'stock', 'shutterstock', 'istock', 'unsplash', 'pexels', 'placeholder',
  'blob', 'orb', 'gradient-bg', 'ai-generated', 'ai-illustration', 'hero-abstract',
  'handshake', 'team-laptop', 'business-people',
];

let violations = 0;
for (const file of files) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }

  // <img ...>  and Astro <Image ...>
  const tags = src.match(/<(?:img|Image)\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const srcAttr = (tag.match(/(?:src|src=\{)[^"'{]*["'{]([^"'}]+)/i) || [])[1] || '';
    const hasAlt = /\balt\s*=/.test(tag);
    if (!hasAlt) {
      console.error(`  [alt] <img> without alt text  in ${file}\n        ${tag.slice(0, 90)}`);
      violations++;
    }
    const lowerSrc = srcAttr.toLowerCase();
    for (const token of BANNED_FILENAME_TOKENS) {
      if (lowerSrc.includes(token)) {
        console.error(`  [stock] filename contains "${token}" ("${srcAttr}")  in ${file}`);
        violations++;
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n✗ image-check: ${violations} issue(s). Use real photos with real alt text (see DESIGN.md Imagery).`);
  process.exit(1);
}
console.log(`✓ image-check: clean (${files.length} file(s)).`);
