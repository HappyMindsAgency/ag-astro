import type { ArticlePreview, EventPreview } from '../types/content';

// TODO Strapi: sostituire evento e articoli provvisori con i dati di Strapi ed eliminare questo commento.
export const featuredEventPlaceholder: EventPreview = {
  title: 'Il Trust in Italia:\nXI Congresso Nazionale e Domenica Specialistica',
  href: '/eventi-in-agenda/',
  image: { src: '/assets/immagini/home-evento-provvisorio.webp', alt: 'Il lungomare di Bari di sera', width: 1496, height: 410 },
  organizer: 'Il Trust in Italia',
  location: 'Bari – Auditorium Deloitte, Fiera del Levante',
  date: { days: '6–8', month: 'Novembre', year: '2026' },
};
export const articlePlaceholders: ArticlePreview[] = [
  {
    title: 'Riforma fiscale 2025: le novità per i trust nella legge delega',
    category: 'Fisco e normativa',
    date: '18 settembre 2026',
    dateTime: '2026-09-18',
    featured: true,
    image: { src: '/assets/immagini/home-articolo-fisco-provvisorio.webp', alt: 'Statua della giustizia con bilancia e spada', width: 480, height: 270 },
    excerpt: 'Il decreto attuativo della delega fiscale introduce importanti chiarimenti sulla tassazione dei trust opachi e trasparenti. Analisi delle principali disposizioni.',
  },
  {
    title: 'Trust e successione: la Cassazione consolida il principio di separazione patrimoniale',
    category: 'Trust',
    date: '10 settembre 2026',
    dateTime: '2026-09-10',
    image: { src: '/assets/immagini/home-articolo-trust-provvisorio.webp', alt: 'Scaffali di una biblioteca', width: 480, height: 270 },
    excerpt: 'Con la sentenza n. 18421/2026 la Suprema Corte ribadisce l’efficacia del trust come strumento di protezione patrimoniale nelle procedure concorsuali.',
  },
  { title: 'IVAFE 2026: nuove aliquote per i patrimoni detenuti all’estero', category: 'Fisco e normativa', date: '05 settembre 2026', dateTime: '2026-09-05' },
  { title: 'Patti di famiglia e passaggio generazionale: aggiornamento alla luce della prassi notarile', category: 'Patrimonio', date: '28 agosto 2026', dateTime: '2026-08-28' },
  { title: 'Holding di famiglia: strutture societarie e pianificazione fiscale integrata', category: 'Impresa', date: '20 agosto 2026', dateTime: '2026-08-20' },
  { title: 'DAC7: obblighi di comunicazione per le piattaforme digitali — impatti sul patrimonio', category: 'Fisco e normativa', date: '12 agosto 2026', dateTime: '2026-08-12' },
  { title: 'Trust autodichiarato: profili critici alla luce dell’Agenzia delle Entrate', category: 'Trust', date: '30 luglio 2026', dateTime: '2026-07-30' },
].map((article) => ({
  href: '/ag-informa/',
  image: { src: '/assets/immagini/home-articolo-trust-provvisorio.webp', alt: 'Scaffali di una biblioteca', width: 480, height: 270 },
  excerpt: '',
  ...article,
}));
