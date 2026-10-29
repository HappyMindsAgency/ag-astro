# AG Trustees — frontend

Frontend Astro con Bootstrap e SCSS. Riferimento visivo: **3° Release Figma**. I contenuti dinamici e la SEO saranno gestiti con Strapi.

## Avvio

Usa Node.js 24 LTS. È supportato anche Node.js 22 da 22.22.0; il client Strapi richiede una versione precedente a 25. Dalla cartella del repository:

```sh
npm ci
npm run dev -- --background
```

Anteprima: [Home](http://localhost:4321/).

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
npm run build
```

La build usa l’adapter Node standalone; in ambiente Vercel seleziona l’adapter Vercel.

## Documentazione

- [Regole frontend, stile e componenti](wiki/frontend.md)
- [Dubbi e domande per designer e team](wiki/dubbi-e-domande.md)
- [Architettura delle pagine e slug](wiki/AG_Trustees_Slug.xlsx)

## Stato delle pagine

Realizzati header, footer, le 15 pagine del design, la ricerca, la pagina Newsletter e le conferme di Contatti e Newsletter:

| Pagina | Anteprima locale |
| --- | --- |
| Home | [Apri](http://localhost:4321/) |
| Chi siamo | [Apri](http://localhost:4321/chi-siamo/) |
| Galvani Fiduciaria e Argos Trustees | [Apri](http://localhost:4321/chi-siamo/galvani-fiduciaria-argos-trustees/) |
| Visione e metodologia | [Apri](http://localhost:4321/chi-siamo/visione-metodologia/) |
| Servizi | [Apri](http://localhost:4321/servizi/) |
| Trust | [Apri](http://localhost:4321/trust/) |
| Patrimonio | [Apri](http://localhost:4321/patrimonio/) |
| Contatti | [Apri](http://localhost:4321/contatti/) |
| Ringraziamento contatti | [Apri](http://localhost:4321/grazie-contatti/) |
| Team | [Apri](http://localhost:4321/chi-siamo/team/) |
| AG Informa | [Apri](http://localhost:4321/ag-informa/) |
| Dettaglio articolo | [Apri](http://localhost:4321/ag-informa/articolo-provvisorio/) |
| Eventi e formazione | [Apri](http://localhost:4321/eventi-in-agenda/) |
| Dettaglio evento | [Apri](http://localhost:4321/eventi-in-agenda/evento-provvisorio/) |
| Knowledge Library | [Apri](http://localhost:4321/knowledge-library/) |
| Ricerca | [Apri](http://localhost:4321/cerca/?q=trust) |
| Newsletter | [Apri](http://localhost:4321/newsletter/) |
| Ringraziamento Newsletter | [Apri](http://localhost:4321/grazie-newsletter/) |
| Pagina 404 | [Apri](http://localhost:4321/404/) |

Alcuni contenuti dinamici e servizi esterni restano da collegare. Dove i frame mobile sono incompleti o incoerenti, le pagine adattano i contenuti desktop con le regole comuni. I punti aperti sono nella wiki.

La ricerca parte dalla lente nell’header, suggerisce i primi risultati mentre si scrive e li elenca in `/cerca/`. Articoli e download arrivano da Strapi; gli eventi conservano gli esempi provvisori.

Team, archivio e dettaglio di AG Informa e Knowledge Library leggono i contenuti da Strapi. Configura `STRAPI_URL`, `STRAPI_API_URL` e `AUTH_READONLY` nel `.env.local` o nell’hosting, seguendo `.env.example`. Il token resta sul server e non va inserito in Git. Home e correlati di Trust e Patrimonio mantengono gli esempi ancora da collegare.

Privacy e Cookie hanno layout e Lorem ipsum. Profili del team, tipologie e singole risorse della Library usano `PagePlaceholder`: layout e titolo predisposti, contenuti da sviluppare.
