# Regole frontend

Riferimento visivo: **3° Release** del [design Figma](https://www.figma.com/design/3bTHye8XeQOv4hNt3YJ0l8/AG-Trustees?node-id=2285-480). Per gli URL usa il [file degli slug](AG_Trustees_Slug.xlsx); per lo stato delle pagine, il [README](../README.md); per le parti da chiarire, [Dubbi e domande](dubbi-e-domande.md).

## Dove intervenire

| File | Contenuto |
| --- | --- |
| `src/styles/variables.scss` | Misure tipografiche, colori, pesi e spazi condivisi |
| `src/styles/fonts.scss` | Font locali e relative dichiarazioni `@font-face` |
| `src/styles/typography.scss` | Classi tipografiche per ruolo e varianti mobile |
| `src/styles/globals.scss` | Configurazione Bootstrap e stile generale |
| `src/styles/components/` | Stili dei componenti condivisi e dei pulsanti |
| `src/styles/pages/` | Stili specifici delle singole pagine |
| `src/components/` | Componenti Astro: introduzione, storia, certificazioni, contatti, FAQ e invito finale |
| `src/pages/` | Testi e composizione delle pagine |
| `public/assets/` | Loghi, immagini, icone, associazioni e font |

## Pagine e percorsi

Organizza le sezioni in cartelle dentro `src/pages/`, con `index.astro` per la pagina principale e file o sottocartelle per le sottopagine. Segui la colonna **Percorso IT** del file degli slug. I dettagli dinamici usano un unico modello con parametro fra parentesi quadre, come `[slugArt].astro`; dati, filtri e gestione dei contenuti mancanti saranno collegati a Strapi.

Le pagine solo predisposte riutilizzano `PagePlaceholder`: layout comune, titolo visibile e contenuto opzionale nello slot (Privacy e Cookie hanno Lorem ipsum). Quando realizzi una pagina dal design, sostituiscilo con `Layout` e i relativi contenuti. I metadati SEO saranno gestiti dinamicamente da Strapi: non definirli nei file delle pagine.

## Stile e componenti

- Usa Jost locale e misure in **px**; le citazioni degli articoli usano Playfair Display corsivo, come in Figma. Bootstrap mantiene le sue unità interne.
- I sopratitoli desktop sono uniformati a **16 px**, definiti in `$font-size-page-eyebrow` e confermati dal designer. La spaziatura delle lettere è `normal`, gestita da `.type-eyebrow` anche sul mobile.
- Sul mobile, “Chi è AG Trustees” conserva la variante da 10 px; gli altri sopratitoli di sezione usano `.type-eyebrow--section` da 12 px e maiuscoli.
- Prima di definire o modificare uno stile condiviso, confronta le occorrenze nelle pagine Figma, comprese quelle ancora da sviluppare. Mantieni lo stesso stile per lo stesso ruolo; ammetti varianti solo se giustificate dal design. Non introdurre correzioni tipografiche nei fogli pagina per elementi già condivisi.
- Riutilizza le variabili tipografiche e gli spazi `$space-*`; evita di ripetere le misure nei fogli pagina.
- Scegli nomi che descrivano il ruolo e, quando serve, il componente: per esempio `$font-size-footer-primary`. Ruoli distinti possono avere lo stesso valore.
- Mantieni le misure specifiche del layout nel relativo componente: non serve una variabile per ogni bordo o dimensione locale.
- Normalizza differenze minime quando migliora la coerenza o riduce il codice, verificando la resa nel browser (es. 39.04 → 40 px). Mantieni le varianti tipografiche concordate, comprese le interlinee 121, 37.8 e 25.5 px.
- Sotto `lg`, i titoli `.type-section-title--compact` mantengono `letter-spacing: normal`.
- Rispetta colori e proporzioni degli asset. Per parti mancanti o incoerenti segui le scelte provvisorie in [Dubbi e domande](dubbi-e-domande.md).
- Verifica i valori esportati contro la grafica e le proprietà dei livelli in Figma, compresi i bordi sui singoli lati. Chiarisci unità o misure incoerenti prima di applicarle.
- Condividi struttura e stile delle sezioni ripetute, passando contenuti diversi. Estrai componenti quando servono, senza prepararne di vuoti.

`PageIntro` gestisce breadcrumb, sopratitolo, titolo e introduzione. `parents` aggiunge le pagine superiori al breadcrumb. Si usa una volta per pagina; la proprietà `mobileTitleLeading` conserva le varianti `tight` (50 px), `regular` (60 px) e `relaxed` (69 px). I titoli di home, articoli e FAQ hanno ruoli propri.

`Breadcrumb` condivide il percorso di navigazione; `light` lo adatta agli sfondi scuri. È già incluso in `PageIntro`.

Per i paragrafi editoriali usa `.type-section-lead`: 20 px con interlinea 32,2 px sul desktop, 16 px con interlinea 20 px sul mobile. La variante `.type-section-lead--relaxed` mantiene 25 px sul mobile, per la panoramica di Visione e l’introduzione dei servizi. Colori e spazi restano nel relativo contesto. Le descrizioni delle card del metodo usano interlinea 23 px sul desktop e 20 px sul mobile.

Per titoli lunghi, `wideTitle` amplia la colonna del titolo da `xxl` e attiva `fitMobileTitle`, che riduce il corpo sui telefoni più stretti del frame Figma da 390 px. Usa solo `fitMobileTitle` quando serve la riduzione mobile conservando le colonne desktop.

`CallToAction` usa lo stesso stile su tutte le pagine: sopratitolo da 16 px senza maiuscolo forzato e bianco attenuato, descrizione da 16 px bianco pieno con interlinea 26 px sul desktop e 20 px sul mobile. Il titolo mantiene 40 px sul desktop e 32 px sul mobile, con `text-wrap: balance` per bilanciare le righe libere. Sotto 390 px i margini laterali si riducono fino a 24 px. Testi e collegamento arrivano dalla pagina, senza varianti tipografiche locali.

`contained` mantiene l’invito entro il frame desktop; `secondaryAction` aggiunge un secondo collegamento. Senza `href`, il pulsante principale rimane disattivato.

`FaqSection` riceve un `id` univoco e le coppie `question`/`answer` dalla pagina; usa Bootstrap Accordion con una risposta aperta alla volta. `largeTitle` conserva il titolo desktop da 68 px di Trust e Contatti; `twoColumns` dispone le domande in due colonne sotto il titolo da `lg`. Il titolo mobile condiviso è da 34 px. `embedded` usa la variante compatta del dettaglio articolo.

`ContactSection` accetta una descrizione nello slot, mantenendo il testo predefinito se non viene passato. Recapiti e sedi condivisi con il footer sono in `src/data/contacts.ts`. Il mixin `brand-gradient` in `src/styles/mixins.scss` condivide lo sfondo di CTA e newsletter.

`ImageOverview` condivide la presentazione con foto di Home e Visione: da `lg` mantiene almeno 48 px tra foto e testo; da `xxl` il titolo cresce fino ai 72 px del riferimento da 1920 px. `ServiceOverview` condivide la panoramica dei servizi; `NewsletterSection` il modulo di Home, Contatti e Team. Il mixin `architectural-gradient` condivide lo sfondo di servizi e leadership. Testi e immagini arrivano dalle pagine. `EditorialImage` gestisce sovrapposizione e resa mobile delle foto; `plain` mantiene la foto senza effetti, mentre le proporzioni restano nella sezione.

`RelatedContent`, `NewsFeed` e `FeaturedEvent` ricevono i dati tramite proprietà, senza chiamate API: gruppi vuoti e relativo spazio non vengono renderizzati. Gli articoli condividono il tipo `ArticlePreview` in `src/types/content.ts`. `NewsFeed` filtra gli articoli ricevuti per categoria o evidenza; il collegamento a Strapi sarà aggiunto quando saranno disponibili i contenuti.

`NewsArticleCard` condivide le schede della Home e di AG Informa: `standard` per la Home, `compact` per l’archivio, `hero` per l’articolo principale. `NewsFeed` con `archive` mostra otto articoli da `lg` e quattro sotto questa soglia; filtri e “Carica altri articoli” lavorano sull’elenco ricevuto. `categories` ne definisce l’ordine, se specificato.

`TeamMemberCard` riceve un membro di tipo `TeamMember` e la variante `leadership`, `operational` o `counsel`. I dati sono nella pagina Team; i campi facoltativi vengono omessi, conservando lo spazio della foto, e i gruppi senza membri non vengono renderizzati.

`DocumentList` condivide i documenti di `RelatedContent` e del dettaglio articolo, con variante `compact`. Senza `downloadUrl`, il pulsante resta inattivo. Il corpo editoriale degli articoli usa `.article-prose`; `ArticleAuthor` condivide l’autore compatto della hero e la scheda finale. L’indice usa Bootstrap Collapse e Scrollspy.

Home, Trust, Patrimonio, Team, AG Informa e dettaglio articolo contengono dati provvisori per la revisione grafica. I commenti `TODO Strapi` indicano i blocchi da sostituire; elimina anche i commenti dopo l’integrazione. Non anticipare il formato del corpo editoriale o le chiamate API prima dell’accordo con il backend.

`OverviewBanner` condivide la fascia introduttiva con foto di Trust e Patrimonio: testi negli slot, titolo ridotto con `compactTitle` e varianti di sezione nei rispettivi fogli pagina. `.site-button--small` gestisce i pulsanti con etichetta da 11 px; `.collapse-toggle` condivide il segno più/meno di FAQ e accordion.

Gli stati interattivi sono condivisi nei fogli dei componenti. La navbar usa Bootstrap Dropdown: il testo apre la pagina e la freccia separata controlla il sottomenu. L’hover apre solo con il mouse sul menu esteso; clic, tastiera ed Escape funzionano anche nel menu mobile. Galvani/Argos e Newsletter restano etichette non attivabili finché non sono confermate le destinazioni.

Usa `.site-button--outline-light` per il pulsante trasparente che diventa bianco con testo blu e `.service-list-row` per evidenziare le righe su sfondo scuro, senza spostare i contenuti. Le transizioni condivise usano `$interaction-duration` (150 ms) e `$interaction-easing`, rispettando la preferenza di movimento ridotto. Gli effetti non presenti nel prototipo saranno valutati separatamente.

`.contact-action-link` condivide l’hover dei recapiti su sfondo blu: testo e bordo più chiari; la freccia `.contact-action-arrow` avanza di 4 px, rispettando il movimento ridotto. Lo stesso stato si applica al focus da tastiera.

## Bootstrap e adattamento alle larghezze

Usa `container`, `row`, `col-*`, `offset-*` e le utilità Bootstrap. Preferisci le colonne standard quando gli scostamenti da Figma sono trascurabili; personalizza le larghezze solo per differenze visive rilevanti. I breakpoint standard arrivano da Bootstrap, senza mappe duplicate.

Il contenitore desktop è largo 1376 px (`$page-container-max-width`), configurato in `globals.scss` nella mappa Bootstrap `$container-max-widths` per `xxl`. L'introduzione ha 40 px di padding, ridotti a 24 px sotto `lg` (992 px). Il layout diventa verticale sotto `md` (768 px); la tipografia resta compatta fino a 991 px.

Le sezioni contenute della Home e la newsletter seguono i container standard a `lg` e `xl`, con limite di 1280 px da `xxl` (`$content-container-max-width`). In `NewsFeed`, articoli principali e colonna secondaria si affiancano da `xl`.

La navbar usa `navbar-expand-xl` e si espande da 1200 px, soglia condivisa con lo script dei sottomenu. È centrata, larga al massimo 1717 px (`$frame-max-width`), con margini minimi di 24 px. Fra 1200 e 1920 px logo, spazi e corpo crescono in modo fluido con `fluid()` di `navbar.scss`. Hover e voce attiva usano il semibold con larghezza riservata, così le voci non si spostano, e una linea rossa disegnata da sinistra; Contatti parte da una linea sottile. Contatti, icone e lingua poggiano sulla linea di base dei testi e sono separati da divisori `.vr`.

La Home passa a `Layout` l’ID della hero con `headerHeroId`: l’header resta fisso e chiaro sopra la hero, poi torna allo stile normale. Anche il menu compatto aperto usa lo stile normale.

Il menu compatto si apre sopra la pagina, oscurata e bloccata, e si chiude con la croce, con Escape o toccando lo sfondo. A menu aperto, `FocusTrap` di Bootstrap mantiene la navigazione da tastiera nella navbar. Le voci crescono da 22 a 28 px fra 360 e 430 px e la pagina corrente è sottolineata in rosso, come sul desktop. Contatti compare nella barra da 390 px, con freccia e a 12 px fino a `sm` per non superare la scritta del logo; a menu aperto resta il pulsante in fondo al pannello, accanto alle voci da `md`.

Fra `lg` e `xxl` (992–1399 px), usa i valori tipografici `$*-tablet` e `.section-spacing` per 80 px di padding verticale. Le griglie a quattro card usano `col-6 col-xxl-3`: due colonne nella fascia intermedia, quattro da 1400 px. Questi adattamenti conservano le varianti Figma sotto 992 px e da 1400 px.

Da `md` a `xxl` (768–1399 px), tutte le introduzioni `PageIntro` usano colonne 6+6 con divisore rosso e 80 px di spazio sotto il contenuto. Il sopratitolo usa la larghezza della colonna e va a capo naturalmente.

Sotto `lg`, `PageIntro` aggiunge 8 px sopra la breadcrumb; lo spazio successivo è 24 px sotto `md` e 40 px da `md`.

Il footer ha gli stessi bordi della barra dell'header: margini di 24 px e larghezza massima `$frame-max-width`. Da `md` le colonne sono automatiche e distribuite con `justify-content-between`, così gli spazi restano uguali; sotto `md` Menu e Utility sono affiancate. La linea sopra il footer sta dietro le sezioni: si vede solo se l'ultima sezione della pagina non ha uno sfondo.

Le composizioni ampie di foto e testo, certificazioni, video e invito finale mantengono i limiti ricavati dal desktop da 1920 px (`$wide-layout-max-width`), con gli spazi laterali del relativo componente. Gli sfondi continuano a tutta larghezza.

Nel paragrafo introduttivo dei contatti gli a capo di Figma valgono solo da `xxl` (1400 px), con `d-xxl-block`; sotto questa soglia il testo scorre liberamente. Evita correzioni degli a capo con soglie aggiuntive.

Compila Bootstrap **solo in `globals.scss`**. Negli altri file usa variabili e mixin senza importare nuovamente il CSS completo. Le sezioni devono poter crescere con il contenuto, evitando altezze che taglino il testo.

Le personalizzazioni dei figli di `.row` e delle varianti `.site-button` devono prevalere sui reset Bootstrap con selettori di componente, senza dipendere dall'ordine dei fogli CSS.

## Prima di condividere

Per gli a capo dei titoli previsti dal design, usa il primo breakpoint Bootstrap in cui le righe entrano interamente. Controlla la composizione anche subito prima e dopo la soglia.

Esegui `npm run build` e `git diff --check`; se cambia l'aspetto, controlla desktop, mobile, larghezze intermedie e apertura del menu nel browser. Confronta anche il prototipo Figma in **Present**, inclusi hover, sottomenu e interazioni disponibili. Verifica anche la build di produzione quando cambiano import o stili condivisi.
