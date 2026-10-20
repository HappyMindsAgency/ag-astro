# Regole frontend

Riferimento: **3° Release** del [design Figma](https://www.figma.com/design/3bTHye8XeQOv4hNt3YJ0l8/AG-Trustees?node-id=2285-480). Per lo stato delle pagine vedi il [README](../README.md); per le parti da chiarire, [Dubbi e domande](dubbi-e-domande.md).

## Dove intervenire

| File | Contenuto |
| --- | --- |
| `src/styles/variables.scss` | Misure tipografiche, colori, pesi e spazi condivisi |
| `src/styles/fonts.scss` | File locali di Jost e relative dichiarazioni `@font-face` |
| `src/styles/typography.scss` | Classi tipografiche per ruolo e varianti mobile |
| `src/styles/globals.scss` | Configurazione Bootstrap e stile generale |
| `src/styles/components/` | Stili di header, footer e introduzione delle pagine |
| `src/styles/pages/` | Stili specifici delle singole pagine |
| `src/components/` | Componenti riutilizzabili, tra cui `PageIntro.astro` |
| `src/pages/` | Testi e composizione delle pagine |
| `public/assets/` | Loghi, immagini, icone, associazioni e font |

## Stile e componenti

- Usa Jost locale e misure in **px**. Bootstrap mantiene le sue unità interne.
- Riutilizza le variabili tipografiche e gli spazi `$space-*`; evita di ripetere le misure nei fogli pagina.
- Scegli nomi che descrivano il ruolo e, quando serve, il componente: per esempio `$font-size-footer-navigation`. Ruoli distinti possono avere lo stesso valore.
- Mantieni le misure specifiche del layout nel relativo componente: non serve una variabile per ogni bordo o dimensione locale.
- Normalizza piccoli residui, come 39.04 → 40 px. Conserva le interlinee previste dal design, comprese 121, 37.8 e 25.5 px.
- Rispetta colori e proporzioni degli asset. Per parti mancanti o incoerenti segui le scelte provvisorie in [Dubbi e domande](dubbi-e-domande.md).
- Condividi struttura e stile delle sezioni ripetute, passando contenuti diversi. Estrai componenti quando servono, senza prepararne di vuoti.

`PageIntro` gestisce breadcrumb, sopratitolo, titolo e introduzione. Si usa una volta per pagina; la proprietà `mobileTitleLeading` conserva le varianti `tight` (50 px), `regular` (60 px) e `relaxed` (69 px). I titoli di home, articoli e FAQ hanno ruoli propri.

## Bootstrap e adattamento alle larghezze

Usa `container`, `row`, `col-*` e le utilità Bootstrap quando corrispondono al design; completa il resto in SCSS. I breakpoint standard arrivano da Bootstrap, senza mappe duplicate.

Il contenitore desktop del design è largo 1376 px, con 40 px di padding nell'introduzione; il margine mobile è 24 px. Introduzione e tipografia passano alla variante mobile sotto `lg` (992 px). La navbar usa Bootstrap Collapse e si espande da 1632 px per contenere tutte le voci: queste soglie sono scelte tecniche per le larghezze intermedie.

Compila Bootstrap **solo in `globals.scss`**. Negli altri file usa variabili e mixin senza importare nuovamente il CSS completo. Le sezioni devono poter crescere con il contenuto, evitando altezze che taglino il testo.

## Prima di condividere

Esegui `npm run build` e `git diff --check`; se cambia l'aspetto, controlla desktop, mobile, larghezze intermedie e apertura del menu nel browser.
