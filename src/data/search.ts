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

const baseIndex: SearchResult[] = [
  { type: 'page', title: 'Chi siamo', href: '/chi-siamo/', excerpt: 'AG Trustees è una trust company italiana nata dall’integrazione di Galvani Fiduciaria e Argos Trustees, dedicata all’amministrazione di trust.' },
  { type: 'page', title: 'Galvani Fiduciaria e Argos Trustees', href: '/chi-siamo/galvani-fiduciaria-argos-trustees/', excerpt: 'Le esperienze di Galvani Fiduciaria e Argos Trustees da cui nasce AG Trustees, una trust company italiana dedicata all’amministrazione professionale di trust.' },
  { type: 'page', title: 'Visione e metodologia', href: '/chi-siamo/visione-metodologia/', excerpt: 'Comprendere, amministrare, accompagnare: i principi e il metodo con cui AG Trustees assume e gestisce ogni incarico di trustee.' },
  { type: 'page', title: 'Il team', href: '/chi-siamo/team/', excerpt: 'Le persone di AG Trustees: competenze legali, fiscali e amministrative al servizio di trust, passaggio generazionale e tutela del patrimonio.' },
  { type: 'page', title: 'Servizi', href: '/servizi/', excerpt: 'Istituzione e amministrazione del trust, incarichi di trustee, co-trustee e guardiano, contabilità e adempimenti fiscali: i servizi di AG Trustees.' },
  { type: 'page', title: 'Trust', href: '/trust/', excerpt: 'Che cos’è il trust, chi sono disponente, trustee, guardiano e beneficiari, quali beni si possono conferire e come funziona in Italia.' },
  { type: 'page', title: 'Patrimonio', href: '/patrimonio/', excerpt: 'Protezione del patrimonio, passaggio generazionale, impresa di famiglia e persone fragili: come il trust può dare continuità al patrimonio.' },
  { type: 'page', title: 'AG Informa', href: '/ag-informa/', excerpt: 'Articoli, notizie ed eventi per seguire l’evoluzione della normativa su trust, successioni, fiscalità e passaggio generazionale.' },
  { type: 'page', title: 'Eventi e formazione', href: '/eventi-in-agenda/', excerpt: 'Convegni, master e incontri formativi sul trust: i prossimi appuntamenti e l’archivio degli eventi organizzati o seguiti da AG Trustees.' },
  { type: 'page', title: 'Knowledge Library', href: '/knowledge-library/', excerpt: 'Norme, sentenze, prassi amministrativa e guide su trust, successioni e pianificazione patrimoniale, selezionate da AG Trustees.' },
  { type: 'page', title: 'Contatti', href: '/contatti/', excerpt: 'Recapiti, sedi e modulo per richiedere un confronto con un professionista su trust e patrimonio.' },
  { type: 'page', title: 'Newsletter', href: '/newsletter/', excerpt: 'Iscriviti alla newsletter di AG Trustees per ricevere una selezione di notizie, approfondimenti e appuntamenti dedicati al trust, alla fiscalità e alle questioni patrimoniali.' },
];

export async function searchSite(query: string, lang: Locale = 'it'): Promise<SearchResult[]> {
  const terms = searchTerms(query);
  if (!terms.length) return [];
  const [articles, documents, events] = await Promise.all([getArticoli(lang), getDownloads(lang), getEventi(lang)]);
  const index: SearchResult[] = [
    ...baseIndex,
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
