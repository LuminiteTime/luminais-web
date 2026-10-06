// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://luminais.tech',
  vite: { build: { chunkSizeWarningLimit: 800 } },
  i18n: { defaultLocale: 'en', locales: ['en', 'ru'] },
});
