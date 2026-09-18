#!/usr/bin/env node
// Structured-data validation: run AFTER `astro build`. Scans dist/ for JSON-LD and checks
// that the homepage carries a valid LocalBusiness/FinancialService block.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { walk } from './_walk.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');

if (!existsSync(dist)) {
  console.error('✗ schema-validate: dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = walk(dist, (f) => /\.html$/.test(f));
let violations = 0;
let sawLocalBusiness = false;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const blocks = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of blocks) {
    const json = block.replace(/<[^>]+>/g, '');
    let parsed;
    try { parsed = JSON.parse(json); } catch (e) {
      console.error(`  [json-ld] invalid JSON in ${file}: ${e.message}`);
      violations++;
      continue;
    }
    const types = []
      .concat(parsed['@graph'] || parsed)
      .flatMap((n) => (n && n['@type'] ? [].concat(n['@type']) : []));
    if (types.some((t) => /LocalBusiness|FinancialService/.test(t))) sawLocalBusiness = true;
  }
}

if (!sawLocalBusiness) {
  console.error('  [json-ld] no LocalBusiness/FinancialService structured data found in any built page.');
  violations++;
}

if (violations > 0) {
  console.error(`\n✗ schema-validate: ${violations} issue(s).`);
  process.exit(1);
}
console.log(`✓ schema-validate: clean (${htmlFiles.length} page(s), LocalBusiness present).`);
