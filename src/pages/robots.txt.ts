import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { textResponse } from '@/lib/text-response';

// Search engines and AI crawlers are welcome: the page exists to be found.
export const GET: APIRoute = () =>
  textResponse(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /404',
      '',
      `Sitemap: ${new URL('/sitemap-index.xml', site.url).href}`,
      '',
    ].join('\n'),
  );
