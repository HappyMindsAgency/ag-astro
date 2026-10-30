import type { APIRoute } from 'astro';
import { MAINTENANCE_MODE } from '../middleware';
import { getArticoli } from '../lib/articoli';
import { getEventi } from '../lib/eventi';
import { forcedRobots } from '../lib/seo';
import { routes, type RouteKey } from '../lib/utility-customslug';

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const locales = ['it', 'en'] as const;

export const GET: APIRoute = async ({ site, url }) => {
  if (MAINTENANCE_MODE) return new Response(null, { status: 404 });
  const origin = (site ?? url).origin;

  // Pagine statiche indicizzabili; esempi e pagine noindex restano fuori.
  const pages = (Object.keys(routes) as RouteKey[])
    .filter((key) => !forcedRobots[key] && !key.endsWith('Example'))
    .flatMap((key) => locales.map((lang) => ({ href: routes[key][lang], lastmod: undefined as string | undefined })));

  // In caso di errore Strapi le liste sono vuote: la sitemap contiene comunque le pagine statiche.
  const dynamic = await Promise.all(locales.flatMap((lang) => [getArticoli(lang), getEventi(lang)]))
    .then((lists) => lists.flat().map((item) => ({ href: item.href, lastmod: 'dateTime' in item && typeof item.dateTime === 'string' ? item.dateTime : undefined })))
    .catch(() => []);

  const body = [...pages, ...dynamic]
    .map(({ href, lastmod }) => `<url><loc>${escapeXml(new URL(href, origin).href)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
    .join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
