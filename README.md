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

Realizzati header, footer e tutte le sezioni di Chi siamo. Il video ha solo uno spazio riservato; restano da confermare i contenuti provvisori indicati nella wiki. Home, altre pagine e integrazione Strapi sono ancora da sviluppare.
