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

Realizzate le sezioni statiche desktop di [Trust](http://localhost:4321/trust/), con FAQ provvisorie; la versione mobile resta da verificare e rifinire sul design definitivo. Articoli e documenti correlati sono predisposti nel componente `RelatedContent` e verranno mostrati quando arriveranno i dati da Strapi.

Realizzata [Patrimonio](http://localhost:4321/patrimonio/), con nove esigenze patrimoniali in accordion sul mobile e FAQ provvisorie. I contenuti correlati sono predisposti per Strapi; le differenze tra i frame desktop e mobile sono annotate nella wiki.

Predisposte con layout e solo titolo: Home, Team, AG Informa, Eventi e formazione, Knowledge Library, Contatti, ricerca, Privacy policy, Cookie policy, Credits e 404. Predisposti anche i modelli per profili del team, articoli, tipologie e singole risorse della Library. Contenuti, grafica e integrazione Strapi sono da sviluppare; queste pagine usano `PagePlaceholder`.

Le voci sospese o ancora da decidere sono elencate in [Dubbi e domande](wiki/dubbi-e-domande.md).
