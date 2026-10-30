import { routes, type Locale, type RouteKey } from './utility-customslug';
import { resolveRouteKey } from './lang-switch/route-map';
import { getCollectionDocuments, getSingleDocument } from './strapi-client';

export const SITE_NAME = 'AG Trustees';
export const DEFAULT_IMAGE = '/assets/brand/ag-logo-orizzontale.png';

// Componente `seo-component.seo` di Strapi: ogni campo può mancare.
export interface StrapiSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaImage?: StrapiMedia | null;
  metaSocial?: { socialNetwork?: string; title?: string; description?: string; image?: StrapiMedia | null }[] | null;
  keywords?: string | null;
  metaRobots?: string | null;
  structuredData?: unknown;
  metaViewport?: string | null;
  canonicalURL?: string | null;
}

interface StrapiMedia {
  url?: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

export const seoPopulate = { populate: { metaImage: true, metaSocial: { populate: { image: true } } } };

// Robots imposti dal codice, prevalgono su Strapi.
export const forcedRobots: Partial<Record<RouteKey, string>> = {
  notFound: 'noindex, nofollow',
  newsletter: 'noindex, nofollow',
  newsletterThanks: 'noindex, nofollow',
  contactThanks: 'noindex, nofollow',
  privacy: 'noindex, nofollow',
  cookies: 'noindex, nofollow',
  search: 'noindex, follow',
  suggestions: 'noindex, follow',
};

const toStrapiLocale = (lang: Locale) => (lang === 'en' ? 'en' : 'it-IT');
const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

export function absoluteUrl(value: unknown, base: string): string | undefined {
  const url = text(value);
  if (!url) return undefined;
  try {
    return new URL(url, base).href;
  } catch {
    return undefined;
  }
}

// Identificativo della pagina nella collection `pagine`: ultimo segmento del percorso localizzato (es. `team`, `about-us`).
export function pageSlug(key: RouteKey | undefined, lang: Locale): string | undefined {
  if (!key || key === 'home') return undefined;
  return routes[key][lang].split('/').filter(Boolean).at(-1);
}

function toStructuredData(value: unknown): object[] {
  let data = value;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }
  return (Array.isArray(data) ? data : [data]).filter((item): item is object => !!item && typeof item === 'object');
}

export const toJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

interface SeoInput {
  url: URL;
  origin: string;
  lang: Locale;
  entry?: StrapiSeo | null;
  title?: string;
  description?: string;
  robots?: string;
}

export async function getSeo({ url, origin, lang, entry, title, description, robots }: SeoInput) {
  const key = resolveRouteKey(url.pathname);
  const slug = entry ? undefined : pageSlug(key, lang);
  const locale = toStrapiLocale(lang);

  // Le richieste restituiscono un ripiego vuoto in caso di errore: la pagina si genera comunque.
  const [general, page] = await Promise.all([
    getSingleDocument('general', { locale, populate: { seo: seoPopulate } }).then(({ data }) => (data as any)?.seo as StrapiSeo | undefined),
    slug
      ? getCollectionDocuments('pagines', { locale, filters: { slug: { $eq: slug } }, populate: { seo: seoPopulate }, pagination: { pageSize: 1 } })
          .then(({ data }) => (data?.[0] as any)?.seo as StrapiSeo | undefined)
      : undefined,
  ]).catch(() => [undefined, undefined] as const);

  // SEO propria della pagina; `general` vale per intero solo sulla Home, altrove fornisce solo i ripieghi.
  const own: StrapiSeo | undefined = entry ?? page ?? (key === 'home' ? general : undefined);
  const strapiBase = import.meta.env.STRAPI_URL || origin;
  const social = (network: string) => (Array.isArray(own?.metaSocial) ? own.metaSocial : []).find((item) => item?.socialNetwork === network);
  const media = [own?.metaImage, general?.metaImage].find((item) => absoluteUrl(item?.url, strapiBase));

  const resolvedRobots = text(robots) ?? (key && forcedRobots[key]) ?? text(own?.metaRobots) ?? 'index, follow';
  const resolvedTitle = text(own?.metaTitle) ?? (text(title) ? `${text(title)} | ${SITE_NAME}` : text(general?.metaTitle) ?? SITE_NAME);
  const resolvedDescription = text(own?.metaDescription) ?? text(description) ?? text(general?.metaDescription);
  const image = {
    url: absoluteUrl(media?.url, strapiBase) ?? new URL(DEFAULT_IMAGE, origin).href,
    alt: text(media?.alternativeText) ?? resolvedTitle,
    width: media?.width,
    height: media?.height,
  };
  const facebook = social('Facebook');
  const twitter = social('Twitter');

  return {
    key,
    title: resolvedTitle,
    description: resolvedDescription,
    robots: resolvedRobots,
    indexable: !/noindex/i.test(resolvedRobots),
    canonical: absoluteUrl(own?.canonicalURL, origin) ?? new URL(url.pathname, origin).href,
    keywords: text(own?.keywords),
    viewport: text(own?.metaViewport),
    image,
    facebook: {
      title: text(facebook?.title) ?? resolvedTitle,
      description: text(facebook?.description) ?? resolvedDescription,
      image: absoluteUrl(facebook?.image?.url, strapiBase) ?? image.url,
    },
    twitter: {
      title: text(twitter?.title) ?? resolvedTitle,
      description: text(twitter?.description) ?? resolvedDescription,
      image: absoluteUrl(twitter?.image?.url, strapiBase) ?? image.url,
    },
    structuredData: toStructuredData(own?.structuredData),
  };
}
