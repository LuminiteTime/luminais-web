// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://luminais.tech',
  trailingSlash: 'ignore',
  // ~20 KB of CSS in total: inlining removes the render-blocking request
  build: { inlineStylesheets: 'always' },
  i18n: { defaultLocale: 'en', locales: ['en', 'ru'] },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', ru: 'ru' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    // three.js lands in its own lazy chunk, loaded after first paint
    build: { chunkSizeWarningLimit: 600 },
  },
});
