import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { defaultLocale, useTranslations } from '@/i18n';
import { textResponse } from '@/lib/text-response';

const { meta } = useTranslations(defaultLocale);

export const GET: APIRoute = () =>
  textResponse(
    JSON.stringify({
      name: meta.title,
      short_name: site.handle,
      description: meta.description,
      start_url: '/',
      display: 'browser',
      background_color: site.themeColor,
      theme_color: site.themeColor,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    }),
    'application/manifest+json',
  );
