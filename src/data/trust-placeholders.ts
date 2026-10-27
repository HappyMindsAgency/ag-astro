import type { ArticlePreview, DocumentPreview } from '../types/content';

// TODO Strapi: sostituire questi correlati provvisori con i dati di Strapi ed eliminare questo commento.
export const relatedArticlesPlaceholder: ArticlePreview[] = [
  {
    title: 'Trust e successione: la separazione patrimoniale',
    image: { src: '/assets/immagini/home-articolo-trust-provvisorio.webp', alt: 'Scaffali di una biblioteca', width: 480, height: 270 },
    category: 'Trust',
    date: '10 settembre 2026',
    dateTime: '2026-09-10',
  },
  {
    title: 'Riforma fiscale 2025: le novità per i trust',
    image: { src: '/assets/immagini/home-articolo-fisco-provvisorio.webp', alt: 'Statua della giustizia con bilancia e spada', width: 480, height: 270 },
    category: 'Fisco e normativa',
    date: '18 settembre 2026',
    dateTime: '2026-09-18',
  },
  {
    title: 'Il ruolo del trustee nella tutela del patrimonio',
    image: { src: '/assets/immagini/home-palazzo.webp', alt: 'Facciata vetrata di un edificio contemporaneo', width: 878, height: 666 },
    category: 'Trust',
    date: '5 settembre 2026',
    dateTime: '2026-09-05',
  },
].map((article) => ({ ...article, href: '/ag-informa/', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel ipsum quis risus varius laoreet eu non libero.' }));
export const relatedDocumentsPlaceholder: DocumentPreview[] = [
  { title: 'Guida introduttiva al trust', category: 'Guide', abbreviation: 'GD', metadata: 'PDF · 12 pagine' },
  { title: 'Il ruolo e le responsabilità del trustee', category: 'Approfondimenti', abbreviation: 'AP', metadata: 'PDF · 8 pagine' },
];
