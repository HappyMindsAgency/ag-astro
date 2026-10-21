# Regole frontend

Riferimento visivo: **3° Release** del [design Figma](https://www.figma.com/design/3bTHye8XeQOv4hNt3YJ0l8/AG-Trustees?node-id=2285-480). Per gli URL usa il [file degli slug](AG_Trustees_Slug.xlsx); per lo stato delle pagine, il [README](../README.md); per le parti da chiarire, [Dubbi e domande](dubbi-e-domande.md).

## Dove intervenire

| File | Contenuto |
| --- | --- |
| `src/styles/variables.scss` | Misure tipografiche, colori, pesi e spazi condivisi |
| `src/styles/fonts.scss` | File locali di Jost e relative dichiarazioni `@font-face` |
| `src/styles/typography.scss` | Classi tipografiche per ruolo e varianti mobile |
| `src/styles/globals.scss` | Configurazione Bootstrap e stile generale |
| `src/styles/components/` | Stili dei componenti condivisi e dei pulsanti |
| `src/styles/pages/` | Stili specifici delle singole pagine |
| `src/components/` | Componenti Astro: introduzione, storia, certificazioni, contatti, FAQ e invito finale |
| `src/pages/` | Testi e composizione delle pagine |
| `public/assets/` | Loghi, immagini, icone, associazioni e font |

## Pagine e percorsi

Organizza le sezioni in cartelle dentro `src/pages/`, con `index.astro` per la pagina principale e file o sottocartelle per le sottopagine. Segui la colonna **Percorso IT** del file degli slug. I dettagli dinamici usano un unico modello con parametro fra parentesi quadre, come `[slugArt].astro`; dati, filtri e gestione dei contenuti mancanti saranno collegati a Strapi.

Le pagine solo predisposte riutilizzano `PagePlaceholder`: layout comune e titolo visibile. Quando realizzi una pagina, sostituiscilo con `Layout` e i relativi contenuti. I metadati SEO saranno gestiti dinamicamente da Strapi: non definirli nei file delle pagine.

## Stile e componenti

- Usa Jost locale e misure in **px**. Bootstrap mantiene le sue unità interne.
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

Per i paragrafi editoriali usa `.type-section-lead`: 20 px con interlinea 32,2 px sul desktop, 16 px con interlinea 20 px sul mobile. La variante `.type-section-lead--relaxed` mantiene 25 px sul mobile, per la panoramica di Visione e l’introduzione dei servizi. Colori e spazi restano nel relativo contesto. Le descrizioni delle card del metodo usano interlinea 23 px sul desktop e 20 px sul mobile.

Per titoli lunghi, `wideTitle` amplia la colonna del titolo da `xxl` e riduce il corpo sui telefoni più stretti del frame Figma da 390 px. `CallToAction` gestisce l'invito finale, con testi e collegamento passati dalla pagina.

`FaqSection` riceve un `id` univoco e le coppie `question`/`answer` dalla pagina; usa Bootstrap Accordion con una risposta aperta alla volta. Il titolo mobile condiviso è da 34 px, come nei frame FAQ di Servizi, Trust e Patrimonio.

Gli stati interattivi sono condivisi nei fogli dei componenti. La navbar usa Bootstrap Dropdown: il testo apre la pagina e la freccia separata controlla il sottomenu. L’hover apre solo con il mouse sul menu esteso; clic, tastiera ed Escape funzionano anche nel menu mobile. Galvani/Argos e Newsletter restano etichette non attivabili finché non sono confermate le destinazioni.

Usa `.site-button--outline-light` per il pulsante trasparente che diventa bianco con testo blu e `.service-list-row` per evidenziare le righe su sfondo scuro, senza spostare i contenuti. Le transizioni condivise usano `$interaction-duration` (150 ms) e `$interaction-easing`, rispettando la preferenza di movimento ridotto. Gli effetti non presenti nel prototipo saranno valutati separatamente.

## Bootstrap e adattamento alle larghezze

Usa `container`, `row`, `col-*`, `offset-*` e le utilità Bootstrap. Preferisci le colonne standard quando gli scostamenti da Figma sono trascurabili; personalizza le larghezze solo per differenze visive rilevanti. I breakpoint standard arrivano da Bootstrap, senza mappe duplicate.

Il contenitore desktop è largo 1376 px (`$page-container-max-width`), configurato in `globals.scss` nella mappa Bootstrap `$container-max-widths` per `xxl`. L'introduzione ha 40 px di padding, ridotti a 24 px sotto `lg` (992 px). Il layout diventa verticale sotto `md` (768 px); la tipografia resta compatta fino a 991 px.

La navbar si espande da `xl` (1200 px), con soglia condivisa fra SCSS e sottomenu. È centrata, con larghezza massima di 1717 px e margini minimi di 24 px. Il logo cresce da 200 a 336 px; gli spazi fra le voci sono 24 px fino a `xxl`, 32 px fino a 1919 px e 40 px da 1920 px. Voci, Contatti e lingua condividono il corpo, che cresce da 14 a 16 px con lo spazio disponibile.

Nel menu compatto il logo occupa lo spazio disponibile fino a 336 px. Il pulsante di apertura misura 44 px, con icona da 24 px e croce a menu aperto. Le voci aperte usano 18 px; sulle finestre basse il pannello scorre lasciando raggiungibile la chiusura.

Fra `lg` e `xxl` (992–1399 px), usa i valori tipografici `$*-tablet` e `.section-spacing` per 80 px di padding verticale. Le griglie a quattro card usano `col-6 col-xxl-3`: due colonne nella fascia intermedia, quattro da 1400 px. Questi adattamenti conservano le varianti Figma sotto 992 px e da 1400 px.

Da `md` a `xxl` (768–1399 px), tutte le introduzioni `PageIntro` usano colonne 6+6 con divisore rosso e 80 px di spazio sotto il contenuto; il sopratitolo ha larghezza massima di 320 px e va a capo naturalmente.

Il footer usa colonne Bootstrap 3+3+2+4 da `lg`, con spaziatura orizzontale `gx-lg-4`, ripristinata a zero da `xxl`. Il contenitore interno non supera 1720 px; sotto `md` il logo mantiene le proporzioni dell'asset e non supera 342 px di larghezza.

Le composizioni ampie di foto e testo, certificazioni, video e invito finale mantengono i limiti ricavati dal desktop da 1920 px (`$wide-layout-max-width`), con gli spazi laterali del relativo componente. Gli sfondi continuano a tutta larghezza.

Nel paragrafo introduttivo dei contatti gli a capo di Figma valgono solo da `xxl` (1400 px), con `d-xxl-block`; sotto questa soglia il testo scorre liberamente. Evita correzioni degli a capo con soglie aggiuntive.

Compila Bootstrap **solo in `globals.scss`**. Negli altri file usa variabili e mixin senza importare nuovamente il CSS completo. Le sezioni devono poter crescere con il contenuto, evitando altezze che taglino il testo.

Le personalizzazioni dei figli di `.row` e delle varianti `.site-button` devono prevalere sui reset Bootstrap con selettori di componente, senza dipendere dall'ordine dei fogli CSS.

## Prima di condividere

Esegui `npm run build` e `git diff --check`; se cambia l'aspetto, controlla desktop, mobile, larghezze intermedie e apertura del menu nel browser. Confronta anche il prototipo Figma in **Present**, inclusi hover, sottomenu e interazioni disponibili. Verifica anche la build di produzione quando cambiano import o stili condivisi.
