import type { SearchResult } from '../types/content';
import { articlePlaceholders } from './article-placeholders';
import { eventPlaceholders } from './event-placeholders';
import { libraryDocumentPlaceholders } from './library-placeholders';
import { normalizeSearchText, searchTerms } from './search-text';

export const searchResultTypes: Record<SearchResult['type'], { label: string; plural: string }> = {
  page: { label: 'Pagina', plural: 'Pagine' },
  article: { label: 'Notizia', plural: 'Notizie' },
  event: { label: 'Evento', plural: 'Eventi' },
  document: { label: 'Documento', plural: 'Documenti' },
};

// TODO Strapi: sostituire pagine e contenuti provvisori con la fonte concordata per la ricerca ed eliminare questo commento.
const placeholderIndex: SearchResult[] = [
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
  ...articlePlaceholders.map(({ title, href, excerpt, category, dateTime }): SearchResult => ({ type: 'article', title, href, excerpt, category, dateTime })),
  ...eventPlaceholders.map(({ title, href, description, format, date }): SearchResult => ({ type: 'event', title, href, excerpt: description, category: format, dateTime: date.dateTime })),
  ...libraryDocumentPlaceholders.map(({ title, downloadUrl, category, dateTime }): SearchResult => ({ type: 'document', title, href: downloadUrl, category, dateTime })),
];

export async function searchSite(query: string): Promise<SearchResult[]> {
  const terms = searchTerms(query);
  return placeholderIndex
    .map((result) => {
      const title = normalizeSearchText(result.title);
      const { label, plural } = searchResultTypes[result.type];
      const text = normalizeSearchText([result.title, result.excerpt, result.category, label, plural].join(' '));
      const score = terms.length && terms.every((term) => text.includes(term)) ? 1 + terms.filter((term) => title.includes(term)).length : 0;
      return { result, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result);
}
