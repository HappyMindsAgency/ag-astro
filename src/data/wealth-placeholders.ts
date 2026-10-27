import type { ArticlePreview, DocumentPreview } from '../types/content';

// TODO Strapi: sostituire questi correlati provvisori con i dati di Strapi ed eliminare questo commento.
export const relatedArticlesPlaceholder: ArticlePreview[] = [
  {
    title: 'Patti di famiglia e passaggio generazionale',
    image: { src: '/assets/immagini/home-articolo-trust-provvisorio.webp', alt: 'Scaffali di una biblioteca', width: 480, height: 270 },
    category: 'Patrimonio',
    date: '28 agosto 2026',
    dateTime: '2026-08-28',
  },
  {
    title: 'Protezione patrimoniale e continuità dell’impresa',
    image: { src: '/assets/immagini/home-palazzo.webp', alt: 'Facciata vetrata di un edificio contemporaneo', width: 878, height: 666 },
    category: 'Impresa',
    date: '20 agosto 2026',
    dateTime: '2026-08-20',
  },
  {
    title: 'Trust e tutela delle persone fragili',
    image: { src: '/assets/immagini/ufficio-panorama.jpg', alt: 'Sala riunioni con vista sulla città', width: 1024, height: 1024 },
    category: 'Patrimonio',
    date: '12 agosto 2026',
    dateTime: '2026-08-12',
  },
].map((article) => ({ ...article, href: '/ag-informa/', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel ipsum quis risus varius laoreet eu non libero.' }));
export const relatedDocumentsPlaceholder: DocumentPreview[] = [
  { title: 'La pianificazione del passaggio generazionale', category: 'Guide', abbreviation: 'GD', metadata: 'PDF · 12 pagine' },
  { title: 'La tutela del patrimonio familiare', category: 'Schede', abbreviation: 'SC', metadata: 'PDF · 8 pagine' },
];
