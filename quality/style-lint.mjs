#!/usr/bin/env node
// Style linter: fails on the visual AI tells (purple, banned fonts, gradient, radius sameness).
// Usage: node quality/style-lint.mjs [files...]   (defaults to scanning src/ for .css)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { walk } from './_walk.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(here, 'forbidden-styles.json'), 'utf8'));

const args = process.argv.slice(2);
const files = args.length
  ? args.filter((f) => /\.css$/.test(f))
  : walk(join(here, '..', 'src'), (f) => /\.css$/.test(f));

function hexToHsl(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0, hue = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
  }
  return { h: hue, s, l };
}

let violations = 0;
for (const file of files) {
  let css;
  try { css = readFileSync(file, 'utf8'); } catch { continue; }
  css = css.replace(/\/\*[\s\S]*?\*\//g, ' '); // ignore comments (docs mention banned values)
  const lower = css.toLowerCase();

  for (const font of cfg.bannedFontFamilies) {
    if (lower.includes(font.toLowerCase())) {
      console.error(`  [font] banned font "${font}"  in ${file}`);
      violations++;
    }
  }

  for (const hex of cfg.bannedHexes) {
    if (lower.includes(hex.toLowerCase())) {
      console.error(`  [color] banned hex "${hex}"  in ${file}`);
      violations++;
    }
  }

  const hexes = lower.match(/#[0-9a-f]{6}\b/g) || [];
  const pr = cfg.purpleHueRange;
  for (const hex of hexes) {
    const { h, s, l } = hexToHsl(hex);
    if (h >= pr.minHue && h <= pr.maxHue && s >= pr.minSaturation && l >= pr.minLightnessGate) {
      console.error(`  [color] purple/indigo hue ${Math.round(h)}° ("${hex}")  in ${file}`);
      violations++;
    }
  }

  const allowed = cfg.gradientAllowlistFiles.includes(basename(file));
  if (!allowed) {
    for (const kw of cfg.forbidGradientKeywords) {
      const n = (lower.match(new RegExp(kw, 'g')) || []).length;
      if (n > 0) {
        console.error(`  [gradient] "${kw}" ×${n} (allowlist in forbidden-styles.json if intentional)  in ${file}`);
        violations += n;
      }
    }
  }

  const radiusHits = (lower.match(new RegExp(`border-radius\\s*:\\s*${cfg.watchRadiusValue}`, 'g')) || []).length;
  if (radiusHits > cfg.maxIdenticalRadiusUses) {
    console.error(`  [radius] ${cfg.watchRadiusValue} used ×${radiusHits} (>${cfg.maxIdenticalRadiusUses}) — vary radii by component  in ${file}`);
    violations++;
  }
}

if (violations > 0) {
  console.error(`\n✗ style-lint: ${violations} visual-tell hit(s). See DESIGN.md (Color / Typography / Layout).`);
  process.exit(1);
}
console.log(`✓ style-lint: clean (${files.length} file(s)).`);
