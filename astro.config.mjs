import { defineConfig } from 'astro/config';

// Single locale sk-SK, static output for fast, crawlable pages.
// Set `site` to the real domain before launch (needed for sitemap + canonical URLs).
export default defineConfig({
  site: 'https://example.sk',
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});
