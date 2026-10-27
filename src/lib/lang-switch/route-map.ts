import customSlug, { routes, type Locale, type RouteKey } from '../utility-customslug';

export type { Locale, RouteKey };

const normalize = (path: string) => path.replace(/\/+$/, '') || '/';

export function getLangFromUrl(url: URL): Locale {
  return /^\/en(?:\/|$)/.test(url.pathname) ? 'en' : 'it';
}

export function resolveRouteKey(pathname: string): RouteKey | undefined {
  const path = normalize(pathname);
  return (Object.keys(routes) as RouteKey[]).find(key =>
    normalize(routes[key].it) === path || normalize(routes[key].en) === path,
  );
}

export function localizeHref(href: string | undefined, lang: Locale): string | undefined {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return href;
  const url = new URL(href, 'https://agtrustees.invalid');
  const key = resolveRouteKey(url.pathname);
  if (key) return `${customSlug(key, lang)}${url.search}${url.hash}`;

  for (const parent of ['team', 'library'] as const) {
    for (const locale of ['it', 'en'] as const) {
      if (url.pathname.startsWith(routes[parent][locale])) {
        return `${routes[parent][lang]}${url.pathname.slice(routes[parent][locale].length)}${url.search}${url.hash}`;
      }
    }
  }
  return href;
}

export function languageSwitchUrl(pathname: string, target: Locale): string {
  const key = resolveRouteKey(pathname);
  if (key) return customSlug(key, target);
  if (getLangFromUrl(new URL(pathname, 'https://agtrustees.invalid')) === target) return pathname;
  const localized = localizeHref(pathname, target);
  if (localized !== pathname) return localized!;
  return customSlug('home', target);
}
