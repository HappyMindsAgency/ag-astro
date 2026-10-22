# AG Trustees — frontend

Frontend Astro con Bootstrap e SCSS. Il riferimento visivo è la 3° Release Figma; i contenuti dinamici saranno gestiti con Strapi.

## Avvio

È richiesto Node.js >= 22.22.0; sviluppo verificato con Node 24. Dalla cartella del repository:

```sh
npm ci
npm run dev -- --background
```

Anteprima della pagina in sviluppo: [Chi siamo](http://localhost:4321/chi-siamo/).

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
npm run build
```

La build usa l'adapter Node standalone; in ambiente Vercel la configurazione seleziona l'adapter Vercel.

## Documentazione

- [Regole frontend, stile e componenti](wiki/frontend.md)
- [Dubbi e domande per designer e team](wiki/dubbi-e-domande.md)
- [Architettura delle pagine e slug](wiki/AG_Trustees_Slug.xlsx)

## Stato delle pagine

Realizzati header, footer, [Chi siamo](http://localhost:4321/chi-siamo/), [Visione e metodologia](http://localhost:4321/chi-siamo/visione-metodologia/) e [Servizi](http://localhost:4321/servizi/), con sottomenu e stati interattivi condivisi verificati in Figma Present. Restano il video e i contenuti provvisori indicati nella wiki.

Realizzate le sezioni statiche desktop di [Trust](http://localhost:4321/trust/), con FAQ provvisorie; la versione mobile resta da verificare e rifinire sul design definitivo. Articoli e documenti correlati usano `RelatedContent`, con placeholder da sostituire con Strapi.

Realizzata [Patrimonio](http://localhost:4321/patrimonio/), con nove esigenze patrimoniali in accordion sul mobile e FAQ provvisorie. I correlati mostrano placeholder da sostituire con Strapi; le differenze tra i frame desktop e mobile sono annotate nella wiki.

Realizzata [Contatti](http://localhost:4321/contatti/), con sedi, mappa statica di Milano, modulo contatti, newsletter e FAQ provvisorie. Selezione delle sedi e invii saranno integrati con i servizi; il mobile usa i contenuti desktop in attesa del frame definitivo.

Realizzata [Home](http://localhost:4321/), con hero, presentazione, servizi, patrimonio, trust, metodo e newsletter. Evento in evidenza e articoli usano i componenti `FeaturedEvent` e `NewsFeed`, con contenuti placeholder da Figma per la revisione grafica, da sostituire con i dati Strapi. Foto della hero provvisoria, da sostituire con l’asset definitivo.

Realizzata [Team](http://localhost:4321/chi-siamo/team/), con leadership, team operativo e Of Counsel. Le 14 schede usano `TeamMemberCard` e dati provvisori da Figma, pronti per essere sostituiti con quelli di Strapi. Testi, foto mancanti e dettagli dei profili restano da confermare.

Realizzata [AG Informa](http://localhost:4321/ag-informa/), con articolo in evidenza, filtri, caricamento progressivo e invito alla newsletter. Le schede condividono `NewsArticleCard` con la Home. Contenuti e collegamenti sono provvisori, da sostituire con Strapi.

Realizzato il [dettaglio articolo](http://localhost:4321/ag-informa/articolo-provvisorio/), con indice richiudibile sul mobile, condivisione, autore, FAQ e correlati. Contenuti da Figma e risposte Lorem ipsum; PDF e integrazione Strapi ancora mancanti. Il mobile adatta il desktop in attesa del frame definitivo.

Predisposte Privacy policy e Cookie policy con layout e testi Lorem ipsum, da sostituire con quelli definitivi.

Predisposte con layout e solo titolo: Eventi e formazione, Knowledge Library, ricerca, Credits e 404. Predisposti anche i modelli per profili del team, tipologie e singole risorse della Library. Contenuti, grafica e integrazione Strapi sono da sviluppare; queste pagine usano `PagePlaceholder`.

Le voci sospese o ancora da decidere sono elencate in [Dubbi e domande](wiki/dubbi-e-domande.md).
