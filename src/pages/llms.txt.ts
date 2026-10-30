import type { APIRoute } from 'astro';
import { MAINTENANCE_MODE } from '../middleware';
import { getArticoli } from '../lib/articoli';
import { getEventi, getProssimiEventi } from '../lib/eventi';
import { getSingleDocument } from '../lib/strapi-client';
import customSlug, { type RouteKey } from '../lib/utility-customslug';

// Guida sintetica al sito per i motori di risposta basati su LLM (https://llmstxt.org/).
const pages: [RouteKey, string][] = [
  ['about', 'Chi siamo'],
  ['origins', 'Galvani Fiduciaria e Argos Trustees'],
  ['vision', 'Visione e metodologia'],
  ['team', 'Team'],
  ['services', 'Servizi'],
  ['trust', 'Trust'],
  ['wealth', 'Patrimonio'],
  ['news', 'AG Informa'],
  ['events', 'Eventi in agenda'],
  ['library', 'Knowledge Library'],
  ['contact', 'Contatti'],
];

export const GET: APIRoute = async ({ site, url }) => {
  if (MAINTENANCE_MODE) return new Response(null, { status: 404 });
  const origin = (site ?? url).origin;
  const link = (href: string) => new URL(href, origin).href;

  const [general, articles, events] = await Promise.all([
    getSingleDocument('general', { locale: 'it-IT', populate: { seo: true } }).then(({ data }) => (data as any)?.seo).catch(() => undefined),
    getArticoli('it').catch(() => []),
    getEventi('it').then((items) => getProssimiEventi(items)).catch(() => []),
  ]);
  const description = typeof general?.metaDescription === 'string' ? general.metaDescription.trim() : '';

  const lines = [
    '# AG Trustees',
    ...(description ? ['', `> ${description}`] : []),
    '',
    '## Pagine',
    ...pages.map(([key, label]) => `- [${label}](${link(customSlug(key, 'it'))})`),
    `- [English version](${link(customSlug('home', 'en'))})`,
    ...(articles.length ? ['', '## AG Informa', ...articles.slice(0, 30).map((item) => `- [${item.title}](${link(item.href)})${item.excerpt ? `: ${item.excerpt.replace(/\s+/g, ' ')}` : ''}`)] : []),
    ...(events.length ? ['', '## Prossimi eventi', ...events.map((item) => `- [${item.title}](${link(item.href)}): ${item.date.label ?? item.date.dateTime ?? ''}${item.location ? `, ${item.location}` : ''}`)] : []),
  ];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
