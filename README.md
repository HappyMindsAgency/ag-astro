# AG Trustees — frontend

Frontend Astro con Bootstrap e SCSS. Riferimento visivo: **3° Release Figma**. I contenuti dinamici e la SEO saranno gestiti con Strapi.

## Avvio

È richiesto Node.js >= 22.22.0; sviluppo verificato con Node 24. Dalla cartella del repository:

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

Realizzati header, footer e le 13 pagine del design:

| Pagina | Anteprima locale |
| --- | --- |
| Home | [Apri](http://localhost:4321/) |
| Chi siamo | [Apri](http://localhost:4321/chi-siamo/) |
| Visione e metodologia | [Apri](http://localhost:4321/chi-siamo/visione-metodologia/) |
| Servizi | [Apri](http://localhost:4321/servizi/) |
| Trust | [Apri](http://localhost:4321/trust/) |
| Patrimonio | [Apri](http://localhost:4321/patrimonio/) |
| Contatti | [Apri](http://localhost:4321/contatti/) |
| Team | [Apri](http://localhost:4321/chi-siamo/team/) |
| AG Informa | [Apri](http://localhost:4321/ag-informa/) |
| Dettaglio articolo | [Apri](http://localhost:4321/ag-informa/articolo-provvisorio/) |
| Eventi e formazione | [Apri](http://localhost:4321/eventi-in-agenda/) |
| Dettaglio evento | [Apri](http://localhost:4321/eventi-in-agenda/evento-provvisorio/) |
| Knowledge Library | [Apri](http://localhost:4321/knowledge-library/) |

Contenuti di esempio, asset mancanti, PDF e servizi esterni restano da completare con Strapi e il team. I frame mobile incompleti o incoerenti, compreso Trust, attendono il confronto con il design definitivo; i punti aperti sono nella wiki.

Privacy e Cookie hanno layout e Lorem ipsum. Ricerca, Credits, 404, profili del team, tipologie e singole risorse della Library usano `PagePlaceholder`: layout e titolo predisposti, contenuti da sviluppare.
