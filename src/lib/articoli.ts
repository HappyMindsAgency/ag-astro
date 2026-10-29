import type { ArticleDetail, ArticlePreview, ContentImage } from '../types/content';
import type { Locale } from './utility-customslug';
import { getCollectionDocuments } from './strapi-client';
import { localizeHref } from './lang-switch/route-map';
import { formatDate } from './utility-function';
import customLabel from './utility-customlabel';
import { toDocumentPreview } from './downloads';
import { blockToHtml, blocksToText } from './strapi-blocks';

export { blocksToText } from './strapi-blocks';

export interface ArticleSection {
  id?: string;
  title?: string;
  html: string;
}

// Divide il contenuto in sezioni al livello di titolo più alto usato, reso come h2: alimenta l'indice e lo scrollspy.
function toSections(blocks: any[] = []): ArticleSection[] {
  const topLevel = Math.min(...blocks.filter((block) => block.type === 'heading').map((block) => block.level));
  const headingShift = Number.isFinite(topLevel) ? topLevel - 2 : 0;
  const sections: ArticleSection[] = [{ html: '' }];
  for (const block of blocks) {
    if (block.type === 'heading' && block.level === topLevel) {
      sections.push({ id: `sezione-${sections.length}`, title: blocksToText(block.children), html: '' });
    } else {
      sections.at(-1)!.html += blockToHtml(block, headingShift);
    }
  }
  return sections.filter((section) => section.title || section.html);
}

const toImage = (media: any, fallbackAlt = ''): ContentImage | undefined =>
  media?.url ? { src: media.url, alt: media.alternativeText ?? fallbackAlt, width: media.width, height: media.height } : undefined;

const toPreview = (item: any, lang: Locale): ArticlePreview | undefined => {
  const image = toImage(item.cover);
  if (!image) return undefined;
  return {
    title: item.titolo,
    href: localizeHref(`/ag-informa/${item.slug}/`, lang)!,
    category: item.categorias?.[0]?.titolo?.trim() ?? '',
    date: formatDate(item.publishedAt, lang),
    dateTime: item.publishedAt.slice(0, 10),
    excerpt: blocksToText(item.anteprima),
    image,
    featured: !!item.inEvidenza?.generico,
  };
};

const toStrapiLocale = (lang: Locale) => (lang === 'en' ? 'en' : 'it-IT');
const relatedPopulate = { fields: ['titolo', 'slug', 'anteprima', 'publishedAt'], populate: { cover: true, categorias: { fields: ['titolo'] } } };

// Tutti gli articoli di una lingua, dal più recente. Strapi restituisce al massimo 100 elementi per pagina.
// ponytail: scarica l'intero archivio a ogni richiesta (cache 5 min in produzione); paginare lato server se diventa lento.
export async function getArticoli(lang: Locale): Promise<ArticlePreview[]> {
  const query = (page: number) => ({
    locale: toStrapiLocale(lang),
    sort: ['publishedAt:desc'],
    fields: relatedPopulate.fields,
    populate: { ...relatedPopulate.populate, inEvidenza: true },
    pagination: { page, pageSize: 100 },
  });
  const first = await getCollectionDocuments('articolis', query(1));
  const pageCount = (first.meta as any).pagination?.pageCount ?? 1;
  const rest = await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) => getCollectionDocuments('articolis', query(index + 2))));
  return [first, ...rest].flatMap(({ data }) => data).map((item) => toPreview(item, lang)).filter((item): item is ArticlePreview => !!item);
}

export async function getArticolo(slug: string, lang: Locale) {
  const { data } = await getCollectionDocuments('articolis', {
    locale: toStrapiLocale(lang),
    filters: { slug: { $eq: slug } },
    populate: {
      cover: true,
      categorias: { fields: ['titolo'] },
      autori: { populate: { foto: true } },
      domande: true,
      correlato: relatedPopulate,
      correlati: relatedPopulate,
      downloads: { populate: { file: true, categoria_downloads: { fields: ['titolo'] } } },
      seo: true,
    },
  });
  const item: any = data[0];
  if (!item) return null;

  const words = blocksToText(item.contenuto).split(/\s+/).filter(Boolean).length;
  const article: ArticleDetail = {
    title: item.titolo,
    href: localizeHref(`/ag-informa/${item.slug}/`, lang)!,
    category: item.categorias?.[0]?.titolo?.trim() ?? '',
    date: formatDate(item.publishedAt, lang),
    dateTime: item.publishedAt.slice(0, 10),
    readingTime: customLabel('{minutes} min di lettura', lang, { minutes: Math.max(1, Math.round(words / 200)) }),
    image: toImage(item.cover, item.titolo),
    excerpt: blocksToText(item.anteprima),
    author: item.autori ? {
      firstName: item.autori.nome,
      role: item.autori.titolo ?? undefined,
      image: toImage(item.autori.foto, item.autori.nome),
      biography: blocksToText(item.autori.descrizione) || undefined,
    } : undefined,
    editorialNote: item.aiDisclaimer ? customLabel('Contenuto realizzato con il supporto dell’intelligenza artificiale e sottoposto a controllo editoriale umano.', lang) : undefined,
  };

  const faqItems = (item.domande ?? []).map(({ domanda, risposta }: any) => ({ question: domanda, answer: blocksToText(risposta) }));

  const documents = (item.downloads ?? []).flatMap((download: Parameters<typeof toDocumentPreview>[0]) => {
    const document = toDocumentPreview(download, lang);
    return document ? [document] : [];
  });

  // `correlato` e `correlati` sono i due lati della stessa relazione: li unisco senza duplicati.
  const related = new Map([...(item.correlato ?? []), ...(item.correlati ?? [])].map((entry: any) => [entry.documentId, entry]));
  const relatedArticles = [...related.values()].map((entry) => toPreview(entry, lang)).filter((entry): entry is ArticlePreview => !!entry);

  return {
    article,
    sections: toSections(item.contenuto),
    faqItems,
    documents,
    relatedArticles,
    seo: { title: item.seo?.metaTitle ?? item.titolo, description: item.seo?.metaDescription ?? article.excerpt },
  };
}

export type Articolo = NonNullable<Awaited<ReturnType<typeof getArticolo>>>;
