import customLabel from '../lib/utility-customlabel';
import { localizeHref, type Locale } from '../lib/lang-switch/route-map';
import type { SearchResult } from '../types/content';
import { getArticoli } from '../lib/articoli';
import { getDownloads } from '../lib/downloads';
import { getEventi } from '../lib/eventi';
import { normalizeSearchText, searchTerms } from './search-text';

export const searchResultTypes: Record<SearchResult['type'], { label: string; plural: string }> = {
  page: { label: 'Pagina', plural: 'Pagine' },
  article: { label: 'Notizia', plural: 'Notizie' },
  event: { label: 'Evento', plural: 'Eventi' },
  document: { label: 'Documento', plural: 'Documenti' },
};

type PageSearchEntry = Omit<SearchResult, 'excerpt'> & { excerpt: Record<Locale, string> };

const baseIndex: PageSearchEntry[] = [
  {
    type: 'page', title: 'Chi siamo', href: '/chi-siamo/',
    excerpt: {
      it: 'AG Trustees è una trust company italiana nata dall’integrazione di Galvani Fiduciaria e Argos Trustees, dedicata all’amministrazione di trust.',
      en: 'AG Trustees is an Italian trust company formed by bringing together Galvani Fiduciaria and Argos Trustees, specialising in trust administration.',
    },
  },
  {
    type: 'page', title: 'Galvani Fiduciaria e Argos Trustees', href: '/chi-siamo/galvani-fiduciaria-argos-trustees/',
    excerpt: {
      it: 'Le esperienze di Galvani Fiduciaria e Argos Trustees da cui nasce AG Trustees, una trust company italiana dedicata all’amministrazione professionale di trust.',
      en: 'The experience of Galvani Fiduciaria and Argos Trustees comes together in AG Trustees, an Italian trust company dedicated to professional trust administration.',
    },
  },
  {
    type: 'page', title: 'Visione e metodologia', href: '/chi-siamo/visione-metodologia/',
    excerpt: {
      it: 'Comprendere, amministrare, accompagnare: i principi e il metodo con cui AG Trustees assume e gestisce ogni incarico di trustee.',
      en: 'Understand, administer and support: the principles and approach that guide AG Trustees in accepting and managing each trustee appointment.',
    },
  },
  {
    type: 'page', title: 'Il team', href: '/chi-siamo/team/',
    excerpt: {
      it: 'Le persone di AG Trustees: competenze legali, fiscali e amministrative al servizio di trust, passaggio generazionale e tutela del patrimonio.',
      en: 'The people behind AG Trustees: legal, tax and administrative expertise supporting trusts, succession planning and asset protection.',
    },
  },
  {
    type: 'page', title: 'Servizi', href: '/servizi/',
    excerpt: {
      it: 'Istituzione e amministrazione del trust, incarichi di trustee, co-trustee e guardiano, contabilità e adempimenti fiscali: i servizi di AG Trustees.',
      en: 'Trust establishment and administration, trustee, co-trustee and trust protector appointments, accounting and tax compliance: the services of AG Trustees.',
    },
  },
  {
    type: 'page', title: 'Trust', href: '/trust/',
    excerpt: {
      it: 'Che cos’è il trust, chi sono disponente, trustee, guardiano e beneficiari, quali beni si possono conferire e come funziona in Italia.',
      en: 'What a trust is, the roles of the settlor, trustee, trust protector and beneficiaries, which assets can be placed in trust and how trusts work in Italy.',
    },
  },
  {
    type: 'page', title: 'Patrimonio', href: '/patrimonio/',
    excerpt: {
      it: 'Protezione del patrimonio, passaggio generazionale, impresa di famiglia e persone fragili: come il trust può dare continuità al patrimonio.',
      en: 'Asset protection, succession planning, family businesses and vulnerable individuals: how a trust can support continuity in wealth and assets.',
    },
  },
  {
    type: 'page', title: 'AG Informa', href: '/ag-informa/',
    excerpt: {
      it: 'Articoli, notizie ed eventi per seguire l’evoluzione della normativa su trust, successioni, fiscalità e passaggio generazionale.',
      en: 'Articles, news and events covering legal and regulatory developments in trusts, inheritance, taxation and succession planning.',
    },
  },
  {
    type: 'page', title: 'Eventi e formazione', href: '/eventi-in-agenda/',
    excerpt: {
      it: 'Convegni, master e incontri formativi sul trust: i prossimi appuntamenti e l’archivio degli eventi organizzati o seguiti da AG Trustees.',
      en: 'Conferences, specialist courses and training on trusts: upcoming dates and the archive of events organised or attended by AG Trustees.',
    },
  },
  {
    type: 'page', title: 'Knowledge Library', href: '/knowledge-library/',
    excerpt: {
      it: 'Norme, sentenze, prassi amministrativa e guide su trust, successioni e pianificazione patrimoniale, selezionate da AG Trustees.',
      en: 'Legislation, court decisions, administrative guidance and resources on trusts, inheritance and wealth planning, selected by AG Trustees.',
    },
  },
  {
    type: 'page', title: 'Contatti', href: '/contatti/',
    excerpt: {
      it: 'Recapiti, sedi e modulo per richiedere un confronto con un professionista su trust e patrimonio.',
      en: 'Contact details, offices and an enquiry form to discuss trusts, wealth and assets with a professional adviser.',
    },
  },
  {
    type: 'page', title: 'Newsletter', href: '/newsletter/',
    excerpt: {
      it: 'Iscriviti alla newsletter di AG Trustees per ricevere una selezione di notizie, approfondimenti e appuntamenti dedicati al trust, alla fiscalità e alle questioni patrimoniali.',
      en: 'Subscribe to the AG Trustees newsletter for a curated selection of news, insights and events on trusts, taxation and wealth-related matters.',
    },
  },
];

export async function searchSite(query: string, lang: Locale = 'it'): Promise<SearchResult[]> {
  const terms = searchTerms(query);
  if (!terms.length) return [];
  const [articles, documents, events] = await Promise.all([getArticoli(lang), getDownloads(lang), getEventi(lang)]);
  const index: SearchResult[] = [
    ...baseIndex.map(({ excerpt, ...page }) => ({ ...page, excerpt: excerpt[lang] })),
    ...events.map(({ title, href, description, format, date }): SearchResult => ({ type: 'event', title, href, excerpt: description, category: format, dateTime: date.dateTime })),
    ...articles.map(({ title, href, excerpt, category, dateTime }): SearchResult => ({ type: 'article', title, href, excerpt, category, dateTime })),
    ...documents.map(({ title, downloadUrl, category, categories, metadata, dateTime }): SearchResult => ({ type: 'document', title, href: downloadUrl, excerpt: metadata, category: categories?.join(', ') || category, dateTime })),
  ];
  return index
    .map(result => ({ ...result, title: result.type === 'page' ? customLabel(result.title, lang) : result.title, href: localizeHref(result.href, lang) }))
    .map((result) => {
      const title = normalizeSearchText(result.title);
      const { label, plural } = searchResultTypes[result.type];
      const text = normalizeSearchText([result.title, result.excerpt, result.category, customLabel(label, lang), customLabel(plural, lang)].join(' '));
      const score = terms.length && terms.every((term) => text.includes(term)) ? 1 + terms.filter((term) => title.includes(term)).length : 0;
      return { result, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result);
}
