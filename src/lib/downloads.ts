import type { DocumentPreview } from '../types/content';
import type { Locale } from './utility-customslug';
import { getCollectionDocuments } from './strapi-client';
import { formatDate } from './utility-function';
import customLabel from './utility-customlabel';

interface Download {
  documentId?: string;
  titolo?: string;
  attivo?: boolean;
  publishedAt?: string;
  file?: { url?: string; size?: number; ext?: string } | null;
  categoria_downloads?: { titolo: string; slug: string }[];
}

const categoryStyles: Record<string, { abbreviation: string; tone?: DocumentPreview['tone'] }> = {
  giurisprudenza: { abbreviation: 'GIU', tone: 'jurisprudence' },
  'prassi-amministrative': { abbreviation: 'PRA' },
  'legislazione-italiana': { abbreviation: 'ITA' },
  'legislazione-internazionale': { abbreviation: 'INT', tone: 'international' },
  'documenti-di-studio': { abbreviation: 'STU', tone: 'study' },
};

// I titoli importati dal vecchio archivio contengono entità numeriche HTML.
function readableTitle(value: string): string {
  return value.replace(/&#(x[\da-f]+|\d+);/gi, (entity, code: string) => {
    const point = code.toLowerCase().startsWith('x') ? Number.parseInt(code.slice(1), 16) : Number(code);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
}

export function toDocumentPreview(download: Download, lang: Locale): DocumentPreview | undefined {
  const title = readableTitle(download.titolo?.trim() ?? '');
  if (download.attivo === false || !title || !download.file?.url) return undefined;

  let url: URL;
  try {
    url = new URL(download.file.url, import.meta.env.STRAPI_URL);
  } catch {
    return undefined;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return undefined;

  const categories = (download.categoria_downloads ?? []).map(({ titolo }) => readableTitle(titolo));
  const style = categoryStyles[download.categoria_downloads?.[0]?.slug ?? ''];
  const date = download.publishedAt && Number.isFinite(Date.parse(download.publishedAt)) ? download.publishedAt : undefined;
  const size = download.file.size;
  const sizeLabel = size && size > 0
    ? `${new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'it-IT', { maximumFractionDigits: size >= 1000 ? 1 : 0 }).format(size >= 1000 ? size / 1000 : size)} ${size >= 1000 ? 'MB' : 'KB'}`
    : undefined;

  return {
    title,
    downloadUrl: url.href,
    category: categories[0] ?? customLabel('Documento', lang),
    categories,
    abbreviation: style?.abbreviation ?? download.file.ext?.slice(1).toUpperCase() ?? 'PDF',
    tone: style?.tone,
    metadata: [date && formatDate(date, lang), sizeLabel].filter(Boolean).join(' | '),
    dateTime: date?.slice(0, 10),
  };
}

const downloadQuery = (lang: Locale) => ({
  locale: lang === 'en' ? 'en' : 'it-IT',
  filters: { attivo: { $eq: true } },
  sort: ['publishedAt:desc', 'documentId:asc'],
  fields: ['titolo', 'attivo', 'publishedAt'],
  populate: {
    file: { fields: ['url', 'size', 'ext'] },
    categoria_downloads: { fields: ['titolo', 'slug'] },
  },
});

export async function getDownloadsRecenti(lang: Locale): Promise<DocumentPreview[]> {
  const query = downloadQuery(lang);
  const { data } = await getCollectionDocuments('downloads', {
    ...query,
    filters: { ...query.filters, file: { url: { $notNull: true } } },
    pagination: { pageSize: 2 },
  });
  return data.map((download) => toDocumentPreview(download, lang)).filter((document): document is DocumentPreview => !!document);
}

export async function getDownloads(lang: Locale): Promise<DocumentPreview[]> {
  const query = (page: number) => ({ ...downloadQuery(lang), pagination: { page, pageSize: 100 } });
  const first = await getCollectionDocuments('downloads', query(1));
  const pageCount = first.meta.pagination?.pageCount ?? 1;
  const rest = await Promise.all(Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => getCollectionDocuments('downloads', query(index + 2))));
  return [first, ...rest].flatMap(({ data }) => data)
    .map((download) => toDocumentPreview(download, lang))
    .filter((document): document is DocumentPreview => !!document);
}

export async function getDownloadCategories(lang: Locale): Promise<{ label: string; value: string }[]> {
  const { data } = await getCollectionDocuments('categoria-downloads', {
    locale: lang === 'en' ? 'en' : 'it-IT',
    fields: ['titolo', 'slug'],
    sort: ['id:asc'],
    pagination: { pageSize: 100 },
  });
  return data.map(({ titolo }) => ({ label: readableTitle(titolo), value: readableTitle(titolo) }));
}
