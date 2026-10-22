import type { EventPreview } from '../types/content';

// TODO Strapi: sostituire gli eventi e i collegamenti provvisori con i dati di Strapi ed eliminare questo commento.
export const eventPlaceholders: EventPreview[] = [
  {
    href: '/eventi-in-agenda/evento-provvisorio/',
    title: 'Trust e pianificazione successoria nel diritto internazionale privato',
    format: 'Convegno',
    location: 'Milano, Palazzo Clerici',
    date: { days: '20', month: 'Ott', year: '2026', dateTime: '2026-10-20' },
    image: { src: '/assets/immagini/eventi/convegno.webp', alt: 'Relatori e pubblico in una sala affrescata', width: 1119, height: 630 },
    description: 'Relatori di caratura internazionale per una giornata di confronto su trust, testamento e successioni transfrontaliere nel nuovo quadro normativo europeo.',
  },
  {
    href: '/eventi-in-agenda/evento-provvisorio/',
    title: 'Webinar AG Trustees — Novità fiscali autunno 2026',
    format: 'Webinar',
    location: 'Online',
    date: { days: '22', month: 'Ott', year: '2026', dateTime: '2026-10-22' },
    image: { src: '/assets/immagini/eventi/webinar.webp', alt: 'Tre relatori durante un webinar sulla fiscalità', width: 1119, height: 630 },
    description: 'Sessione formativa riservata ai clienti AG Trustees: approfondimento sulle ultime circolari dell’Agenzia delle Entrate in materia di trust e patrimonio.',
  },
  {
    href: '/eventi-in-agenda/evento-provvisorio/',
    title: 'Seminario: Holding familiari e governance d’impresa',
    format: 'Seminario',
    location: 'Roma, Sala Borromini',
    date: { days: '06', month: 'Nov', year: '2026', dateTime: '2026-11-06' },
    image: { src: '/assets/immagini/eventi/seminario.webp', alt: 'Consulenti riuniti intorno a un tavolo di lavoro', width: 1119, height: 630 },
    description: 'Strutturazione di holding per il passaggio generazionale: aspetti fiscali, societari e patrimoniali. Workshop con casi studio pratici.',
  },
  {
    href: '/eventi-in-agenda/evento-provvisorio/',
    title: 'Forum Internazionale sul Trust — Roma 2026',
    format: 'Convegno',
    location: 'Roma',
    date: { days: '20', month: 'Nov', year: '2026', dateTime: '2026-11-20' },
    image: { src: '/assets/immagini/eventi/forum-roma.webp', alt: 'Pubblico di un convegno in un auditorium illuminato di blu', width: 1119, height: 630 },
    description: 'AG Trustees presenta una sessione su trust italo-svizzeri e strategie di gestione cross-border per famiglie e imprese internazionali.',
  },
  {
    href: '/eventi-in-agenda/evento-provvisorio/',
    title: 'Forum Internazionale sul Trust — Milano 2026',
    format: 'Convegno',
    location: 'Milano',
    date: { days: '30', month: 'Nov', year: '2026', dateTime: '2026-11-30' },
    image: { src: '/assets/immagini/eventi/forum-milano.webp', alt: 'Partecipanti a un forum con schermi dedicati ai mercati finanziari', width: 1119, height: 630 },
    description: 'AG Trustees illustra le novità normative e le best practice per la strutturazione e la supervisione dei trust in contesto internazionale.',
  },
  {
    href: '/eventi-in-agenda/evento-provvisorio/',
    title: 'Forum Internazionale sul Trust — Bologna 2026',
    format: 'Convegno',
    location: 'Bologna',
    date: { days: '12', month: 'Dic', year: '2026', dateTime: '2026-12-12' },
    image: { src: '/assets/immagini/eventi/forum-bologna.webp', alt: 'Pubblico seduto durante una conferenza sul trust', width: 1119, height: 630 },
    description: 'AG Trustees discute governance, reporting e compliance nei trust internazionali, con un focus sulle esigenze delle famiglie e delle imprese con attività transfrontaliere.',
  },
];
