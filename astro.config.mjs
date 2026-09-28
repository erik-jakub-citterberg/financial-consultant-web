import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// The look lives in src/themes/<DESIGN>/ (theme.css, Home.astro, favicon.svg).
// Erika chose Identita on 2026-09-28; the other directions are kept on the design/* branches.
export const DESIGNS = ['identita'];
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
