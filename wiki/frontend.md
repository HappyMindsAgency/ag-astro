# Regole frontend

Riferimento: **3° Release** del [design Figma](https://www.figma.com/design/3bTHye8XeQOv4hNt3YJ0l8/AG-Trustees?node-id=2285-480). Per lo stato delle pagine vedi il [README](../README.md); per le parti da chiarire, [Dubbi e domande](dubbi-e-domande.md).

## Dove intervenire

| File | Contenuto |
| --- | --- |
| `src/styles/variables.scss` | Misure tipografiche, colori, pesi e spazi condivisi |
| `src/styles/fonts.scss` | File locali di Jost e relative dichiarazioni `@font-face` |
| `src/styles/typography.scss` | Classi tipografiche per ruolo e varianti mobile |
| `src/styles/globals.scss` | Configurazione Bootstrap e stile generale |
| `src/styles/components/` | Stili dei componenti condivisi e dei pulsanti |
| `src/styles/pages/` | Stili specifici delle singole pagine |
| `src/components/` | Componenti Astro: introduzione, storia, certificazioni, contatti e invito finale |
| `src/pages/` | Testi e composizione delle pagine |
| `public/assets/` | Loghi, immagini, icone, associazioni e font |

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

`PageIntro` gestisce breadcrumb, sopratitolo, titolo e introduzione. Si usa una volta per pagina; la proprietà `mobileTitleLeading` conserva le varianti `tight` (50 px), `regular` (60 px) e `relaxed` (69 px). I titoli di home, articoli e FAQ hanno ruoli propri.

Per i paragrafi editoriali usa `.type-section-lead`: 20 px con interlinea 32,2 px sul desktop, 16 px con interlinea 20 px sul mobile. Colori e spazi restano nel relativo contesto. Le descrizioni delle card del metodo usano interlinea 23 px sul desktop e 20 px sul mobile.

Per titoli lunghi, `wideTitle` amplia la colonna del titolo da `xxl` e riduce il corpo sui telefoni più stretti del frame Figma da 390 px. `CallToAction` gestisce l'invito finale, con testi e collegamento passati dalla pagina.

## Bootstrap e adattamento alle larghezze

Usa `container`, `row`, `col-*`, `offset-*` e le utilità Bootstrap. Preferisci le colonne standard quando gli scostamenti da Figma sono trascurabili; personalizza le larghezze solo per differenze visive rilevanti. I breakpoint standard arrivano da Bootstrap, senza mappe duplicate.

Il contenitore desktop è largo 1376 px (`$page-container-max-width`), configurato in `globals.scss` nella mappa Bootstrap `$container-max-widths` per `xxl`. L'introduzione ha 40 px di padding; il margine mobile è 24 px. Introduzione e tipografia passano alla variante mobile sotto `lg` (992 px). La navbar usa Bootstrap Collapse e si espande da 1720 px per mantenere spazio fra logo, voci e contatti.

Fra `lg` e `xxl` (992–1399 px), usa i valori tipografici `$*-tablet` e `.section-spacing` per 80 px di padding verticale. Le griglie a quattro card usano `col-6 col-xxl-3`: due colonne nella fascia intermedia, quattro da 1400 px. Questi adattamenti conservano le varianti Figma sotto 992 px e da 1400 px.

Nella stessa fascia, tutte le introduzioni `PageIntro` usano colonne 6+6 con divisore rosso e 80 px di spazio sotto il contenuto; il sopratitolo ha larghezza massima di 320 px e va a capo naturalmente.

Il footer usa colonne Bootstrap 3+3+2+4 da `lg`, con spaziatura orizzontale `gx-lg-4`, ripristinata a zero da `xxl`. Il contenitore interno non supera 1720 px; sotto `md` il logo mantiene le proporzioni dell'asset e non supera 342 px di larghezza.

Le composizioni ampie di foto e testo, certificazioni, video e invito finale mantengono i limiti ricavati dal desktop da 1920 px (`$wide-layout-max-width`), con gli spazi laterali del relativo componente. Gli sfondi continuano a tutta larghezza.

Nel paragrafo introduttivo dei contatti gli a capo di Figma valgono solo da `xxl` (1400 px), con `d-xxl-block`; sotto questa soglia il testo scorre liberamente. Evita correzioni degli a capo con soglie aggiuntive.

Compila Bootstrap **solo in `globals.scss`**. Negli altri file usa variabili e mixin senza importare nuovamente il CSS completo. Le sezioni devono poter crescere con il contenuto, evitando altezze che taglino il testo.

Le personalizzazioni dei figli di `.row` e delle varianti `.site-button` devono prevalere sui reset Bootstrap con selettori di componente, senza dipendere dall'ordine dei fogli CSS.

## Prima di condividere

Esegui `npm run build` e `git diff --check`; se cambia l'aspetto, controlla desktop, mobile, larghezze intermedie e apertura del menu nel browser. Verifica anche la build di produzione quando cambiano import o stili condivisi.
