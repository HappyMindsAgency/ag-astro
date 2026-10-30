import type { ContentImage, EventPreview, EventDetail } from '../types/content';
import customSlug, { type Locale } from './utility-customslug';
import { getCollectionDocuments } from './strapi-client';
import { blocksToHtml, blocksToText } from './strapi-blocks';
import { toDocumentPreview } from './downloads';
import { getTodayInRome } from './utility-function';
import { seoPopulate, type StrapiSeo } from './seo';

interface Category {
  titolo: string;
  slug: string;
  localizations?: { slug: string }[];
}

interface EventRecord {
  documentId: string;
  titolo: string;
  slug: string;
  dataInizioEvento: string;
  dataFineEvento?: string | null;
  orario?: string;
  luogo?: string;
  descrizione?: Parameters<typeof blocksToHtml>[0];
  cover?: { url: string; alternativeText?: string; width: number; height: number };
  inEvidenza?: { inHome?: boolean };
  categoria_eventos?: Category[];
}

const toStrapiLocale = (lang: Locale) => lang === 'en' ? 'en' : 'it-IT';
const previewPopulate = {
  cover: true,
  inEvidenza: true,
  categoria_eventos: { fields: ['titolo', 'slug'], populate: { localizations: { fields: ['slug'] } } },
};
const previewFields = ['titolo', 'slug', 'dataInizioEvento', 'dataFineEvento', 'luogo', 'descrizione'];

function toDate(startValue: string, endValue: string | null | undefined, lang: Locale): EventPreview['date'] | undefined {
  const start = new Date(startValue);
  if (!Number.isFinite(start.getTime())) return undefined;
  const candidate = endValue ? new Date(endValue) : start;
  const end = Number.isFinite(candidate.getTime()) && candidate >= start ? candidate : start;
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'it-IT', { ...options, timeZone: 'UTC' }).formatRange(start, end);
  return {
    days: start.getTime() === end.getTime() ? String(start.getUTCDate()) : `${start.getUTCDate()}–${end.getUTCDate()}`,
    month: format({ month: 'long' }),
    monthShort: format({ month: 'short' }),
    year: start.getUTCFullYear() === end.getUTCFullYear() ? String(start.getUTCFullYear()) : `${start.getUTCFullYear()}–${end.getUTCFullYear()}`,
    dateTime: startValue.slice(0, 10),
    endDateTime: end.toISOString().slice(0, 10),
    label: format({ day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

function toPreview(item: EventRecord, lang: Locale): EventPreview | undefined {
  const date = item.dataInizioEvento && toDate(item.dataInizioEvento, item.dataFineEvento, lang);
  if (!item.titolo?.trim() || !item.slug || !date) return undefined;
  const categories = item.categoria_eventos ?? [];
  const slugs = (category: Category) => [category.slug, ...(category.localizations ?? []).map(({ slug }) => slug)];
  const notToMiss = (category: Category) => slugs(category).includes('da-non-perdere');
  const primary = categories.find(category => !notToMiss(category)) ?? categories[0];
  const primarySlugs = primary ? slugs(primary) : [];
  const image: ContentImage | undefined = item.cover?.url ? { src: item.cover.url, alt: item.cover.alternativeText ?? item.titolo, width: item.cover.width, height: item.cover.height } : undefined;
  return {
    title: item.titolo,
    href: `${customSlug('events', lang)}${item.slug}/`,
    image,
    location: item.luogo?.trim() ?? '',
    format: primary?.titolo.trim(),
    categories: categories.filter(category => !notToMiss(category)).map(category => category.titolo.trim()),
    formatTone: primarySlugs.includes('webinar') ? 'webinar' : primarySlugs.includes('seminari-e-incontri') ? 'seminar' : undefined,
    inHome: !!item.inEvidenza?.inHome,
    notToMiss: categories.some(notToMiss),
    description: blocksToText(item.descrizione),
    date,
  };
}

export async function getEventi(lang: Locale): Promise<EventPreview[]> {
  const query = (page: number) => ({
    locale: toStrapiLocale(lang),
    fields: previewFields,
    populate: previewPopulate,
    sort: ['dataInizioEvento:asc', 'documentId:asc'],
    pagination: { page, pageSize: 100 },
  });
  const first = await getCollectionDocuments('eventis', query(1));
  const pageCount = first.meta.pagination?.pageCount ?? 1;
  const rest = await Promise.all(Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => getCollectionDocuments('eventis', query(index + 2))));
  return [first, ...rest].flatMap(({ data }) => data).map(item => toPreview(item as EventRecord, lang)).filter((event): event is EventPreview => !!event);
}

export function getProssimiEventi(events: EventPreview[], now = new Date()): EventPreview[] {
  const today = getTodayInRome(now);
  return events.filter(({ date }) => (date.endDateTime ?? date.dateTime ?? '') >= today);
}

export function getEventiDaNonPerdere(events: EventPreview[]): EventPreview[] {
  return events.filter(event => event.notToMiss).sort((a, b) => (b.date.dateTime ?? '').localeCompare(a.date.dateTime ?? ''));
}

export async function getEvento(slug: string, lang: Locale) {
  const { data } = await getCollectionDocuments('eventis', {
    locale: toStrapiLocale(lang),
    filters: { slug: { $eq: slug } },
    populate: {
      ...previewPopulate,
      downloads: { populate: { file: true, categoria_downloads: { fields: ['titolo', 'slug'] } } },
      localizations: { fields: ['slug', 'locale'] },
      seo: seoPopulate,
    },
  });
  const item = data[0];
  const preview = item && toPreview(item as EventRecord, lang);
  if (!preview) return null;
  const event: EventDetail = { ...preview, cover: preview.image, category: preview.format, time: item.orario?.slice(0, 5) || undefined };
  const documents = (item.downloads ?? []).flatMap((download: Parameters<typeof toDocumentPreview>[0]) => {
    const document = toDocumentPreview(download, lang);
    return document ? [document] : [];
  });
  const languageUrls: Partial<Record<Locale, string>> = { [lang]: event.href };
  for (const localization of item.localizations ?? []) {
    const locale = localization.locale === 'en' ? 'en' : localization.locale === 'it-IT' ? 'it' : undefined;
    if (locale && localization.slug) languageUrls[locale] = `${customSlug('events', locale)}${localization.slug}/`;
  }
  const relatedEvents = (await getEventi(lang)).filter(other => other.href !== event.href).slice(0, 3);
  return { event, content: blocksToHtml(item.descrizione ?? []), documents, relatedEvents, languageUrls, seo: ((item as any).seo ?? null) as StrapiSeo | null };
}

export type Evento = NonNullable<Awaited<ReturnType<typeof getEvento>>>;
