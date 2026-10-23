# Regole frontend

Riferimento visivo: **3° Release** del [design Figma](https://www.figma.com/design/3bTHye8XeQOv4hNt3YJ0l8/AG-Trustees?node-id=2285-480). Per gli URL usa il [file degli slug](AG_Trustees_Slug.xlsx); per lo stato delle pagine, il [README](../README.md); per le richieste ancora aperte, [Dubbi e domande](dubbi-e-domande.md).

## Dove intervenire

| Percorso | Contenuto |
| --- | --- |
| `src/styles/variables.scss` | Colori, tipografia, pesi e spazi condivisi |
| `src/styles/fonts.scss` | Font locali e dichiarazioni `@font-face` |
| `src/styles/typography.scss` | Classi tipografiche per ruolo e varianti mobile |
| `src/styles/globals.scss` | Configurazione Bootstrap e stile generale |
| `src/styles/components/` | Stili dei componenti e pulsanti condivisi |
| `src/styles/pages/` | Stili specifici delle pagine |
| `src/components/` | Componenti Astro riutilizzabili |
| `src/pages/` | Testi e composizione delle pagine |
| `src/types/content.ts`, `src/data/` | Tipi dei contenuti, recapiti e dati provvisori condivisi |
| `public/assets/` | Loghi, immagini, icone, associazioni e font |

## Regole comuni

- Usa Jost locale e misure in **px**; le citazioni degli articoli usano Playfair Display corsivo. Bootstrap mantiene le sue unità interne.
- Riutilizza variabili tipografiche e spazi `$space-*`. I nomi descrivono il ruolo; ruoli distinti possono avere lo stesso valore. Bordi e misure locali non richiedono una variabile dedicata.
- Mantieni lo stesso stile per lo stesso ruolo sulle diverse pagine. Confronta le occorrenze Figma prima di introdurre varianti; evita correzioni locali di elementi condivisi nei fogli pagina.
- Preferisci griglia, breakpoint e utilità Bootstrap quando lo scostamento da Figma è trascurabile. Normalizza differenze minime se migliora la coerenza o riduce il codice, verificando la resa nel browser.
- Rispetta colori e proporzioni degli asset. Verifica le proprietà dei livelli Figma, comprese unità e bordi sui singoli lati; non importare valori anomali senza confrontarli con la grafica.
- Mantieni le varianti concordate, comprese le interlinee 121, 37.8 e 25.5 px. Per i frame mobile incoerenti già segnalati, usa Jost e contenuti desktop con gli adattamenti approvati.
- Estrai struttura e stile quando una sezione viene riutilizzata, passando i contenuti tramite proprietà o slot. Evita componenti vuoti o astrazioni preventive.
- Compila Bootstrap **solo in `globals.scss`**. Le personalizzazioni dei figli di `.row` e delle varianti `.site-button` devono prevalere sui reset Bootstrap senza dipendere dall’ordine dei fogli CSS.

## Tipografia e componenti principali

I sopratitoli desktop sono **16 px**, confermati dal designer, con spaziatura delle lettere `normal` tramite `.type-eyebrow`. Sul mobile, “Chi è AG Trustees” conserva 10 px; `.type-eyebrow--section` usa 12 px e maiuscole.

`PageIntro` include breadcrumb, titolo e introduzione. `mobileTitleLeading` conserva le interlinee `tight` (50 px), `regular` (60 px) e `relaxed` (69 px). `wideTitle` amplia la colonna da `xxl` e attiva `fitMobileTitle`, che riduce il corpo sotto 390 px; usa solo `fitMobileTitle` se basta l’adattamento mobile. `compact` toglie altezza minima e divisore quando subito dopo c’è un modulo, come in Cerca.

`.type-section-lead` usa 20/32.2 px sul desktop e 16/20 px sul mobile; `--relaxed` mantiene 25 px di interlinea mobile. Le descrizioni delle card del metodo hanno interlinea 23 px desktop e 20 px mobile. Sotto `lg`, `.type-section-title--compact` conserva `letter-spacing: normal`.

`CallToAction` condivide sopratitolo da 16 px senza maiuscolo forzato, descrizione da 16 px bianco pieno (interlinea 26 px desktop, 20 px mobile) e titolo da 40 px desktop/32 px mobile, con interlinea 46 px e `text-wrap: balance`. `contained` mantiene il limite del frame desktop; `plainBackground` conserva il gradiente senza foto di Library e dettaglio articolo. `NewsletterCallToAction` mantiene invece la foto sia sul desktop sia sul mobile, come approvato.

`FaqSection` riceve un `id` univoco e le coppie domanda/risposta. Conserva i titoli desktop da 56 px o, con `largeTitle`, 68 px per Trust e Contatti; sul mobile usa 34 px. `twoColumns` dispone le domande in due colonne da `lg`; `embedded` mantiene la variante compatta dell’articolo. Una sola risposta aperta per gruppo.

| Componenti o stile | Riutilizzo |
| --- | --- |
| `Breadcrumb` | Ultimi due livelli sotto `lg`, percorso completo da 992 px; `light` per gli sfondi scuri. |
| `ImageOverview`, `EditorialImage` | Foto e testo di Home/Visione; almeno 48 px tra le colonne da `lg`. `EditorialImage` condivide gli effetti; `plain` li omette. |
| `ServiceOverview`, `OverviewBanner` | Panoramica servizi e fascia introduttiva di Trust/Patrimonio. |
| `CompanyHistory`, `Certifications` | Storia e certificazioni condivise. |
| `ContactSection`, `NewsletterSection` | Moduli e stile comune; recapiti e sedi in `src/data/contacts.ts`. |
| `NewsArticleCard`, `NewsFeed` | Schede Home/archivio/hero; filtri e caricamento progressivo. `archive` mostra otto articoli da `lg`, quattro sotto. |
| `EventCard`, `EventDate`, `EventList`, `FeaturedEvent` | Eventi e data condivisi; `compact` omette foto e descrizioni nell’elenco. |
| `TeamMemberCard` | Schede `leadership`, `operational` e `counsel`, con gruppi di qualsiasi lunghezza. |
| `RelatedContent`, `DocumentList` | Correlati e documenti; `DocumentList` passa a due colonne da `xl`, `compact` ne mantiene una e `tone` gestisce i colori di categoria. |
| `LibraryArchive`, `.content-filter` | Ricerca, categorie, date ISO inclusive, ordinamento e caricamento progressivo: 12 documenti da `lg`, quattro sotto. Filtri condivisi con AG Informa. |
| `SiteSearch`, `SearchResults`, `SearchHighlight` | Lente dell’header e pagina `/cerca/`; suggerimenti da `xl`, sotto l’invio porta a `/cerca/`. La fonte è `searchSite()`; `search-text.ts` condivide con la Library il confronto senza maiuscole e accenti. I profili del team restano fuori dall’indice finché non pronti. |
| `.editorial-prose`, `ContentShare`, `EditorialContactCard`, `ArticleAuthor` | Stile e blocchi editoriali condivisi; l’indice dell’articolo usa Bootstrap Collapse e Scrollspy. |
| `.type-editorial-list-title`, `.collapse-toggle`, `.site-button--small` | Titoli Notizie/Eventi, segno più/meno degli accordion e pulsanti con etichetta da 11 px. |

## Responsive e contenitori

- Usa `container`, `row`, `col-*` e `offset-*`, senza duplicare le mappe dei breakpoint Bootstrap. Le sezioni crescono con il contenuto: evita altezze che taglino il testo.
- Il container `xxl` misura 1376 px (`$page-container-max-width`). Le sezioni contenute della Home e la newsletter usano 1280 px (`$content-container-max-width`); `NewsFeed` affianca le colonne da `xl`.
- Sotto `lg` i container delle sezioni usano `.section-container`: larghezza piena e margini di 24 px (`$page-gutter-mobile`); `px-lg-0` li azzera da `lg`. Le pagine segnaposto mantengono il `.container` di Bootstrap. `.frame-container` allinea archivi, articolo ed evento alla cornice di navbar e footer.
- `PageIntro` usa 40 px di padding, 24 px sotto `lg`; colonne 6+6 con divisore rosso da `md`, layout verticale sotto 768 px e tipografia compatta fino a 991 px. Fra `md` e `xxl` mantiene 80 px sotto il contenuto.
- Sotto `lg`, `PageIntro` aggiunge 8 px sopra la breadcrumb; dopo il percorso lascia 24 px sotto `md` e 40 px da `md`.
- Fra `lg` e `xxl` (992–1399 px), usa `$*-tablet` e `.section-spacing` per 80 px di padding verticale. Le griglie a quattro card usano `col-6 col-xxl-3`.
- I leader del Team restano impilati e centrati sotto `xxl`: larghezza massima di 640 px sotto `md`, 960 px da `md`. Fra `md` e `xxl` le card usano spazi compatti, un terzo per la foto e altezza legata al testo; le immagini restano ancorate in alto. Da 1400 px sono affiancati in tre colonne.
- Navbar e footer sono centrati, con margini minimi di 24 px e larghezza massima `$frame-max-width` (1717 px). La navbar usa `navbar-expand-xl` (1200 px) e lo script legge la stessa soglia da `--bs-breakpoint-xl`, come Notizie e Library da `--bs-breakpoint-lg`; logo, spazi e corpo crescono con `fluid()` fino a 1920 px.
- Nel menu compatto, Contatti compare nella barra da 390 px; le voci crescono da 22 a 28 px fra 360 e 430 px. Nel footer, Menu e Utility sono affiancate sotto `md`; da `md` le colonne automatiche usano `justify-content-between`.
- Foto e testo, certificazioni, video e CTA ampie mantengono il limite `$wide-layout-max-width` ricavato dal desktop da 1920 px. Gli sfondi continuano a tutta larghezza. Sotto 390 px i margini delle CTA si riducono fino a 24 px.
- Per gli a capo forzati usa il primo breakpoint Bootstrap in cui le righe entrano interamente, verificando anche subito prima e dopo la soglia. Nel paragrafo introduttivo dei contatti gli a capo valgono solo da `xxl`.

## Interazioni condivise

La navbar usa Bootstrap Dropdown: il testo apre la pagina, la freccia separata controlla il sottomenu. L’hover apre con il mouse sul menu esteso; clic, tastiera ed Escape funzionano anche nel compatto. Le voci riservano la larghezza del semibold per evitare spostamenti; la linea rossa indica hover e pagina corrente.

Il menu compatto oscura e blocca la pagina; si chiude con croce, Escape o sfondo. `FocusTrap` mantiene la tastiera nella navbar. Sulla Home l’header resta fisso e chiaro sopra la hero (`headerHeroId`), poi torna normale; anche il menu aperto usa lo stile normale.

- `.site-button--outline-light` diventa bianco con testo blu; `.service-list-row` evidenzia le righe senza spostare il contenuto.
- I pulsanti chiari hanno un focus bianco sugli sfondi scuri. `.site-title-link` sottolinea i titoli al passaggio del mouse e al focus; le frecce dei pulsanti restano ferme.
- Le card Eventi allineano “Dettagli” in fondo; titolo fino a 3 righe e descrizione fino a 4 (5 sotto `lg`), poi puntini di sospensione. Foto e titolo aprono il dettaglio.
- `ContentShare` conferma la copia con un Tooltip Bootstrap e un messaggio accessibile; Escape chiude il feedback. Il segno più/meno degli accordion usa la transizione comune.
- `.contact-action-link` schiarisce testo e bordo; `.contact-action-arrow` avanza di 4 px anche al focus da tastiera.
- Le transizioni usano `$interaction-duration` (150 ms) e `$interaction-easing`, rispettando il movimento ridotto. Gli effetti assenti dal prototipo si valutano separatamente.
- Il mixin `brand-gradient` condivide lo sfondo di CTA e newsletter; `architectural-gradient` quello di servizi e leadership; `brand-watermark` la filigrana del logo di Home e Team.
- `$anchor-offset` (160 px) è lo `scroll-margin-top` delle ancore sotto l’header; lo ScrollSpy dell’articolo ne ricava la linea di lettura.
- La linea superiore del footer sta dietro le sezioni e compare solo quando l’ultima non ha uno sfondo.
- La firma HappyMinds nella fascia finale del footer sostituisce la pagina Credits.

## Dati, percorsi e integrazioni

Organizza le pagine in cartelle con `index.astro`, seguendo **Percorso IT** nel file degli slug. I dettagli usano un modello dinamico, come `/ag-informa/[slugArt]/` e `/eventi-in-agenda/[slugEvento]/`. `PagePlaceholder` mantiene layout e titolo delle pagine solo predisposte.

I componenti ricevono dati tramite proprietà, senza API. Usa i tipi in `src/types/content.ts`; gruppi di correlati vuoti e relativo spazio non vengono renderizzati. I commenti `TODO Strapi` indicano gli esempi da sostituire: elimina anche il commento dopo l’integrazione. Non anticipare formato del corpo editoriale o chiamate API prima dell’accordo con Vito.

Moduli e mappa hanno per ora struttura e stile. Senza destinazione, pulsanti e download restano inattivi; le frecce dei collegamenti compaiono solo quando è presente l’URL. Le singole voci dei servizi non hanno pagine dedicate; gli elenchi descrittivi senza collegamenti non mostrano frecce o simboli di apertura. Lo spazio video di Chi siamo resta nascosto al lancio. I metadati SEO arriveranno da Strapi: non definirli nelle pagine.

## Prima di condividere

Esegui `npm run build` e `git diff --check`. Per cambiamenti visivi controlla mobile, desktop, larghezze intermedie e ultrawide; confronta anche Figma **Present**, hover, sottomenu e interazioni. Verifica la build di produzione quando cambiano import o stili condivisi.
