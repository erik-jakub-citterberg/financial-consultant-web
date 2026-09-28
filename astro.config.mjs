import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// DESIGN picks the look: src/themes/<DESIGN>/ holds theme.css, Home.astro and favicon.svg.
// BASE_PATH / OUT_DIR are only set by scripts/build-preview.mjs, which builds every design
// into one site with a switcher (for choosing a design with Erika).
export const DESIGNS = ['identita', 'rozhovor'];
const design = process.env.DESIGN || 'identita';
if (!DESIGNS.includes(design)) throw new Error(`Unknown DESIGN "${design}". Use one of: ${DESIGNS.join(', ')}`);

// Set `site` to the real domain before launch (needed for sitemap + canonical URLs).
export default defineConfig({
  site: 'https://example.sk',
  base: process.env.BASE_PATH || '/',
  outDir: process.env.OUT_DIR || './dist',
  output: 'static',
  trailingSlash: 'never',
  build: { inlineStylesheets: 'auto' },
  vite: {
    resolve: { alias: { '@theme': fileURLToPath(new URL(`./src/themes/${design}`, import.meta.url)) } },
  },
});
