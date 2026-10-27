export type Locale = 'it' | 'en';

export const routes = {
  home: { it: '/', en: '/en/' },
  about: { it: '/chi-siamo/', en: '/en/about-us/' },
  origins: { it: '/chi-siamo/galvani-fiduciaria-argos-trustees/', en: '/en/about-us/galvani-fiduciaria-argos-trustees/' },
  vision: { it: '/chi-siamo/visione-metodologia/', en: '/en/about-us/vision-and-approach/' },
  team: { it: '/chi-siamo/team/', en: '/en/about-us/team/' },
  services: { it: '/servizi/', en: '/en/services/' },
  trust: { it: '/trust/', en: '/en/trust/' },
  wealth: { it: '/patrimonio/', en: '/en/wealth-and-assets/' },
  news: { it: '/ag-informa/', en: '/en/ag-informa/' },
  events: { it: '/eventi-in-agenda/', en: '/en/events/' },
  library: { it: '/knowledge-library/', en: '/en/knowledge-library/' },
  contact: { it: '/contatti/', en: '/en/contact-us/' },
  newsletter: { it: '/newsletter/', en: '/en/newsletter/' },
  search: { it: '/cerca/', en: '/en/search/' },
  suggestions: { it: '/cerca/suggerimenti/', en: '/en/search/suggestions/' },
  privacy: { it: '/privacy-policy/', en: '/en/privacy-policy/' },
  cookies: { it: '/cookie-policy/', en: '/en/cookie-policy/' },
  notFound: { it: '/404/', en: '/en/404/' },
  articleExample: { it: '/ag-informa/articolo-provvisorio/', en: '/en/ag-informa/sample-article/' },
  eventExample: { it: '/eventi-in-agenda/evento-provvisorio/', en: '/en/events/sample-event/' },
} as const;

export type RouteKey = keyof typeof routes;

export default function customSlug(key: RouteKey, lang: Locale = 'it'): string {
  return routes[key][lang];
}
