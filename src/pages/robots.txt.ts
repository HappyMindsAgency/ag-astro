import type { APIRoute } from 'astro';
import { MAINTENANCE_MODE } from '../middleware';

export const GET: APIRoute = ({ site, url }) => {
  const origin = (site ?? url).origin;
  const body = MAINTENANCE_MODE
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
