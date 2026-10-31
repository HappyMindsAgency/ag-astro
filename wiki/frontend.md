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
- Le correzioni di contrasto approvate riguardano bianchi e grigi; i titoli rossi sui fondi scuri mantengono i colori del design.
- Mantieni le varianti concordate, comprese le interlinee 121, 37.8 e 25.5 px. Per i frame mobile incoerenti già segnalati, usa Jost e contenuti desktop con gli adattamenti approvati.
- Estrai struttura e stile quando una sezione viene riutilizzata, passando i contenuti tramite proprietà o slot. Evita componenti vuoti o astrazioni preventive.
- Compila Bootstrap **solo in `globals.scss`**. Le personalizzazioni dei figli di `.row` e delle varianti `.site-button` devono prevalere sui reset Bootstrap senza dipendere dall’ordine dei fogli CSS.

## Tipografia e componenti principali

I sopratitoli desktop sono **16 px**, confermati dal designer, con spaziatura delle lettere `normal` tramite `.type-eyebrow`. Sul mobile, “Chi è AG Trustees” conserva 10 px; `.type-eyebrow--section` usa 12 px e maiuscole.

`PageIntro` include breadcrumb, titolo e introduzione. Usa `wideTitle` per ampliare la colonna da `xxl`, `fitMobileTitle` per adattare i titoli lunghi sotto `lg` e `compact` prima di moduli o archivi con filtri. `alignHeadingTop` mantiene il titolo in alto quando il testo accanto è più lungo, come in Patrimonio. `mobileTitleLeading` e `titleSize` conservano le varianti del design; misure e interlinee sono in `variables.scss`.

Nei titoli iniziali IT/EN, lo slot `title` contiene la parte blu e `titleAccent` la parte finale rossa, senza punto. `PageIntro` aggiunge il punto rosso anche quando il titolo è solo blu. L’accento inizia su una nuova riga; `inlineTitleAccent` conserva la composizione continua. Le parole evidenziate restano le stesse a tutte le larghezze.

Usa `.type-section-title`, `.type-section-lead` e `.type-section-copy` secondo il ruolo. Le varianti `--compact` e `--relaxed` mantengono gli adattamenti condivisi, senza correzioni nei fogli pagina.

`CallToAction` mantiene lo stesso stile su tutte le pagine, con titolo bilanciato, sopratitolo senza maiuscolo forzato e descrizione bianca. `contained` limita il frame; `plainBackground` usa il gradiente senza foto. `NewsletterCallToAction` riusa il componente: in Home, Team e Contatti usa `contained={false}`, nella Library `plainBackground`.

`FaqSection` riceve un `id` univoco e le coppie domanda/risposta. `largeTitle` conserva il titolo più grande di Trust e Contatti; `twoColumns` affianca le domande da `lg`; `embedded` mantiene la variante dell’articolo. Una sola risposta aperta per gruppo.

| Componenti o stile | Riutilizzo |
| --- | --- |
| `Breadcrumb` | Ultimi due livelli sotto `lg`, percorso completo da 992 px; `light` per gli sfondi scuri. |
| `ImageOverview`, `EditorialImage` | Foto e testo di Home/Visione; almeno 48 px tra le colonne da `lg`. `EditorialImage` condivide gli effetti; `plain` li omette. |
| `ServiceOverview`, `OverviewBanner` | Panoramica servizi e fascia introduttiva di Trust/Patrimonio. |
| `CompanyHistory`, `Certifications` | Storia e certificazioni condivise. |
| `ContactSection` | Modulo contatti; `.contact-form` condivide lo stile con il modulo Newsletter. Recapiti e sedi in `src/data/contacts.ts`. |
| `OfficeMap` | Mappa Google attiva in vista satellitare nelle pagine Contatti IT/EN; i pulsanti cambiano sede nello stesso riquadro. Indirizzi e URL delle mappe sono in `src/data/contacts.ts`. |
| `NewsArticleCard`, `NewsFeed` | Schede Home/archivio/hero; filtri e caricamento progressivo. `archive` mostra otto articoli da `lg`, quattro sotto. |
| `EventCard`, `EventDate`, `EventList`, `FeaturedEvent` | Eventi e data condivisi; `compact` omette foto e descrizioni nell’elenco. Solo gli intervalli di più giorni adattano il carattere alla larghezza della data; i giorni singoli mantengono le misure standard. Gli elenchi compatti ampliano la colonna della data solo se contengono intervalli, mantenendo tutte le righe allineate. |
| `TeamMemberCard` | Schede `Direttivo`, `Operativo` e `Consulente` (valori di `ruolo` in Strapi), con gruppi di qualsiasi lunghezza. |
| `RelatedContent`, `DocumentList` | Titoli comuni “Articoli correlati” e “Documenti correlati”, anche dove il foglio indica “in evidenza”. Intestazione opzionale per Trust e Patrimonio. `DocumentList` usa due colonne da `xl`, una con `compact`; `tone` distingue le categorie. |
| `LibraryArchive`, `.content-filter` | Ricerca, categorie, date ISO inclusive, ordinamento e caricamento progressivo: 12 documenti da `lg`, quattro sotto. Filtri condivisi con AG Informa. |
| `EventArchive`, `.content-archive` | Calendari con le card Eventi, ricerca, categorie, periodo e date. `content-archive.scss` condivide lo stile dei filtri con Library e ricerca; 12 risultati da `lg`, quattro sotto. |
| `SiteSearch`, `SearchResults`, `SearchHighlight` | Lente dell’header e pagina `/cerca/`; suggerimenti da `xl`, sotto l’invio porta a `/cerca/`. `searchSite()` legge articoli e download da Strapi; `search-text.ts` condivide con la Library il confronto senza maiuscole e accenti. I profili del team restano fuori dall’indice finché non pronti. |
| `.editorial-prose`, `ContentShare`, `EditorialContactCard`, `ArticleAuthor` | Stile e blocchi editoriali condivisi; l’indice dell’articolo usa Bootstrap Collapse e Scrollspy. |
| `.type-editorial-list-title`, `.collapse-toggle`, `.site-button--small` | Titoli Notizie/Eventi, segno più/meno degli accordion e pulsanti con etichetta da 11 px. |

## Responsive e contenitori

- Usa `container`, `row`, `col-*` e `offset-*`, senza duplicare le mappe dei breakpoint Bootstrap. Le sezioni crescono con il contenuto: evita altezze che taglino il testo.
- Il container `xxl` misura 1376 px (`$page-container-max-width`). Le sezioni contenute della Home usano 1280 px (`$content-container-max-width`); `NewsFeed` affianca le colonne da `xl`.
- Sotto `lg` i container delle sezioni usano `.section-container`: larghezza piena e margini di 24 px (`$page-gutter-mobile`); `px-lg-0` li azzera da `lg`. Le pagine segnaposto mantengono il `.container` di Bootstrap. `.frame-container` allinea archivi, articolo ed evento alla cornice di navbar e footer.
- `.frame-container--editorial`, insieme a `container frame-container`, limita i dettagli a `$page-container-max-width`: nell’evento anche testata, copertina e correlati; nell’articolo corpo e correlati. La testata dell’articolo mantiene la cornice ampia. Nei correlati passa `editorial` a `EventList` o `RelatedContent`.
- Nei dettagli evento e articolo, testo e scheda laterale usano colonne 8+4 fra `lg` e `xl`, 9+3 da `xl`.
- `PageIntro` usa colonne 6+6 con divisore rosso da `md`, layout verticale sotto 768 px e tipografia compatta fino a 991 px. Spaziatura di breadcrumb e introduzione gestita nel componente; fra `md` e `xxl` mantiene 80 px sotto il contenuto.
- Fra `lg` e `xxl` (992–1399 px), usa `$*-tablet` e `.section-spacing` per 80 px di padding verticale. Le griglie a quattro card usano `col-6 col-xxl-3`.
- I leader del Team restano impilati e centrati sotto `xxl`: larghezza massima di 640 px sotto `md`, 960 px da `md`. Fra `md` e `xxl` le card usano spazi compatti, un terzo per la foto e altezza legata al testo; le immagini restano ancorate in alto. Da 1400 px sono affiancati in tre colonne.
- Navbar e footer sono centrati, con margini minimi di 24 px e limite `$frame-max-width`. La navbar si espande da `xl`; lo script legge `--bs-breakpoint-xl`, come Notizie e Library da `--bs-breakpoint-lg`. Logo, spazi e corpo crescono con `fluid()` fino a 1920 px.
- Certificazioni affianca loghi e testata da `md`; sotto mantiene il titolo sopra i loghi. La griglia resta di due righe: Il Trust in Italia e STEP sopra, TPE e CTE sotto.
- Nel menu compatto, Contatti compare nella barra da 390 px; le voci crescono da 22 a 28 px fra 360 e 430 px. Nel footer, Menu e Utility sono affiancate sotto `md`; da `md` le colonne automatiche usano `justify-content-between`.
- Foto e testo, certificazioni, video e CTA ampie mantengono il limite `$wide-layout-max-width` ricavato dal desktop da 1920 px. Gli sfondi continuano a tutta larghezza. Sotto 390 px i margini delle CTA si riducono fino a 24 px.
- Per gli a capo forzati usa il primo breakpoint Bootstrap in cui le righe entrano interamente, verificando anche subito prima e dopo la soglia. Nel paragrafo introduttivo dei contatti gli a capo valgono solo da `xxl`.

## Interazioni condivise

La navbar usa Bootstrap Dropdown: il testo apre la pagina, la freccia separata controlla il sottomenu. L’hover apre con il mouse sul menu esteso; clic, tastiera ed Escape funzionano anche nel compatto. Le voci riservano la larghezza del semibold per evitare spostamenti; la linea rossa indica hover e pagina corrente.

Il menu compatto oscura e blocca la pagina; si chiude con croce, Escape o sfondo. `FocusTrap` mantiene la tastiera nella navbar. Sulla Home l’header resta trasparente fino a 8 px di scroll, poi usa lo stile normale con transizione di 150 ms; menu e ricerca aperti usano sempre lo stile normale. La transizione rispetta il movimento ridotto.

Il profilo LinkedIn in navbar e footer compare solo se `Layout` riceve `linkedinUrl`. I pulsanti di condivisione dei contenuti restano indipendenti.

- `.site-button--outline-light` diventa bianco con testo blu; `.service-list-row` evidenzia le righe senza spostare il contenuto.
- I pulsanti chiari hanno un focus bianco sugli sfondi scuri. `.site-title-link` sottolinea i titoli al passaggio del mouse e al focus; le frecce dei pulsanti restano ferme.
- Le card Eventi allineano “Dettagli” in fondo; titolo fino a 3 righe e descrizione fino a 4 (5 sotto `lg`), poi puntini di sospensione. Foto e titolo aprono il dettaglio.
- `ContentShare` conferma la copia con un Tooltip Bootstrap e un messaggio accessibile; Escape chiude il feedback. Il segno più/meno degli accordion usa la transizione comune.
- `.contact-action-link` schiarisce testo e bordo; `.contact-action-arrow` avanza di 4 px anche al focus da tastiera.
- Le transizioni usano `$interaction-duration` (150 ms) e `$interaction-easing`, rispettando il movimento ridotto. Gli effetti assenti dal prototipo si valutano separatamente.
- Il mixin `brand-gradient` condivide lo sfondo di CTA e newsletter; `architectural-gradient` quello di servizi e leadership; `brand-watermark` la filigrana del logo di Home e Team.
- `backgroundImage` cambia la foto di `CallToAction`, `ServiceOverview` e `OverviewBanner`, mantenendo lo stile comune. Gli sfondi usano `cover` per conservare le proporzioni. Le foto statiche sono quelle della cartella condivisa IMG PORTALE; foto di articoli, eventi e team arrivano da Strapi.
- `$anchor-offset` (160 px) è lo `scroll-margin-top` delle ancore sotto l’header; lo ScrollSpy dell’articolo ne ricava la linea di lettura.
- La linea superiore del footer sta dietro le sezioni e compare solo quando l’ultima non ha uno sfondo.

## Dati, percorsi e integrazioni

Organizza le pagine in cartelle con `index.astro`, seguendo **Percorso IT** nel file degli slug. I dettagli usano un modello dinamico, come `/ag-informa/[slugArt]/` e `/eventi-in-agenda/[slugEvento]/`. `PagePlaceholder` mantiene layout e titolo delle pagine solo predisposte.

Per ogni testo, segui queste priorità:

1. Commenti e precisazioni confermate.
2. Revisioni nella colonna B.
3. Testo della colonna A, se B è vuota.

In B, “ok” conferma A; “eliminare” indica una rimozione. Riporta i testi senza riformularli e segnala le ambiguità. Gli a capo delle celle non richiedono automaticamente `<br>`. Le colonne inglesi vanno riconosciute dall’intestazione: cambiano posizione tra i fogli.

In Chi siamo, “Le origini” e “L’incontro” seguono A23 e A25. Il blocco “Come funziona” di Trust segue B23; il titolo iniziale di Patrimonio segue A4.

Nei Link utili della Library, il gruppo di A11 usa il titolo “Altri siti di interesse” del riferimento Galvani in A26. Il link di Milano Finanza in A10 è corretto in `https://www.milanofinanza.it/`.

I componenti ricevono dati tramite proprietà, senza API: le pagine leggono Strapi con `src/lib/strapi-client.ts` e passano i dati ai componenti. Usa i tipi in `src/types/content.ts`; i correlati vuoti non occupano spazio. I commenti `TODO Strapi` indicano gli esempi da sostituire e vanno rimossi dopo l’integrazione. Concorda con il backend formato editoriale e chiamate API.

Gli articoli sono ordinati per `publishedAt` decrescente. Nel dettaglio, i tre correlati condividono almeno una categoria ed escludono l’articolo aperto. Trust e Patrimonio mostrano i tre articoli e i due download più recenti della propria lingua, senza esempi di riserva.

La Home usa gli articoli selezionati con `inEvidenza.inHome`; in assenza di selezioni mostra i sette più recenti. L’evento della Home usa lo stesso indicatore. `src/lib/eventi.ts` condivide i dati di Home, elenchi, dettaglio e ricerca: ordine per `dataInizioEvento`, intervalli di più giorni e allegati reali. La data di fine è facoltativa: assente o uguale all’inizio indica un giorno singolo; successiva indica più giorni. «Prossimi eventi» esclude gli appuntamenti conclusi nel fuso italiano; «Da non perdere» usa la categoria omonima. Le sezioni vuote restano nascoste. Il selettore del dettaglio usa gli URL delle localizzazioni Strapi tramite `languageUrls`, con il comportamento comune come ripiego.

I collegamenti «Calendario completo» portano a `/eventi-in-agenda/calendario/` o `/eventi-in-agenda/da-non-perdere/` secondo l’elenco, con equivalenti inglesi in `utility-customslug.ts`. Il primo apre gli eventi in programma, il secondo tutti quelli della categoria «Da non perdere». Entrambi includono i passati tramite filtro: in programma dal più vicino, passati e tutti dal più recente. Le date filtrano gli eventi che intersecano l’intervallo, estremi inclusi; la logica comune è in `src/lib/event-calendar.ts`.

`src/lib/downloads.ts` condivide la lettura dei download e la conversione per Library e allegati degli articoli. Esclude i documenti disattivati o senza file valido; categorie, date e dimensioni arrivano da Strapi. I filtri considerano tutte le categorie associate a ciascun documento. I PDF si aprono in una nuova scheda, anche dalla ricerca. Senza contenuti inglesi pubblicati, la Library EN resta vuota.

Le Privacy IT/EN leggono titolo e contenuto dal Single Type `privacy-policy`, ciascuna nella propria lingua. `src/lib/strapi-blocks.ts` condivide la conversione del testo formattato con gli articoli; `.editorial-prose--legal` usa corpo 16 px, interlinea 25 px, titoli compatti e conserva gli a capo negli elenchi. Il contenitore comune mantiene i margini di 24 px sotto `lg`.

Il modulo di iscrizione è solo in `/newsletter/`: usa il foglio NL, `.contact-form` e i campi del riferimento Galvani per la sola iscrizione ad AG Trustees. Le altre pagine usano il banner comune: iscrizione primaria verso `/newsletter/`, ultima newsletter secondaria.

L’iscrizione Newsletter sarà gestita da Brevo. Le pagine `/grazie-newsletter/` e `/en/thank-you-newsletter/` sono le destinazioni dopo l’iscrizione confermata; con doppia conferma, vanno collegate dopo la validazione via email. `ThankYou` condivide struttura e stile delle conferme di Contatti e Newsletter.

Il modulo contatti usa `POST /api/contatti`, comune a Chi siamo, Team, Servizi e Contatti, anche in inglese. Registra pagina e lingua della richiesta; apre `/grazie-contatti/` o `/en/thank-you-contacts/` solo dopo la conferma del salvataggio. Configurazione e sorgente Google Apps Script sono in [integrations/google-apps-script](../integrations/google-apps-script/README.md).

- Il modulo Newsletter ha per ora struttura e stile. Pulsanti e download senza destinazione restano inattivi; le frecce dei collegamenti compaiono solo quando è presente l’URL.
- Gli elenchi descrittivi senza link non mostrano frecce o simboli di apertura; i singoli servizi non hanno pagine dedicate.
- Il video di Chi siamo resta nascosto al lancio.

## SEO

`Head` genera i meta con `astro-seo` tramite `getSeo()` in `src/lib/seo.ts`. Ogni campo ha un ripiego: un dato mancante o Strapi non raggiungibile non bloccano la pagina.

- Priorità: SEO dell’oggetto (articolo, evento, Privacy) passata a `Layout` con `seo`; poi la voce di `pagine` con lo slug della pagina; poi `general`, che vale per intero solo sulla Home e altrove fornisce solo titolo, descrizione e immagine. Senza titolo SEO si usa `title` di `Layout` seguito da « | AG Trustees».
- Slug di `pagine`: ultimo segmento del percorso localizzato in `utility-customslug.ts` (es. `team`, `visione-metodologia` / `vision-and-approach`).
- `forcedRobots` impone `noindex, nofollow` a 404, Newsletter, ringraziamenti, Privacy e Cookie; `noindex, follow` alla ricerca. Prevale su Strapi.
- JSON-LD: `Organization`, `WebSite` e `WebPage` in `Head`; `Article` ed `Event` nei dettagli; `BreadcrumbList` in `Breadcrumb`; `FAQPage` in `FaqSection`. Lo `structuredData` di Strapi si aggiunge.
- `robots.txt`, `sitemap.xml` e `llms.txt` sono endpoint in `src/pages/`; con `MAINTENANCE_MODE` attivo `robots.txt` blocca tutto e gli altri due rispondono 404.

## Versione inglese

L’italiano resta alla radice; le pagine inglesi sono in `src/pages/en/`, con URL tradotti. Ogni pagina imposta `lang`; layout, componenti e SCSS sono condivisi, come nel riferimento `cesenatico-astro`.

`src/lib/utility-customlabel.ts` contiene le etichette riutilizzate (menu, pulsanti, moduli e messaggi); i testi delle singole pagine restano nelle pagine. `utility-customslug.ts` definisce i percorsi; `lang-switch/route-map.ts` collega le versioni del selettore. Per i futuri dettagli Strapi servirà la corrispondenza tra contenuti localizzati; i modelli e i dati provvisori sono condivisi.

Le traduzioni arrivano dalla colonna inglese del foglio, che cambia posizione tra le schede. Per le revisioni concordate, conserva l’originale nel foglio e affianca la proposta nella cella a destra, senza aggiungere intestazioni. I contenuti dinamici conservano gli esempi esistenti fino all’integrazione Strapi: non mantenere una seconda serie di mock tradotti.

## Prima di condividere

Esegui `npm run build` e `git diff --check`. Controlla i cambiamenti visivi su mobile, desktop, larghezze intermedie e ultrawide, comprese le interazioni di Figma **Present**. Se il server dev è attivo, isola la cache Vite della build di verifica. Controlla la produzione quando cambiano import o stili condivisi.

La review finale dei testi è in sola lettura su Excel e progetto. Il rapporto deve indicare pagina, scheda/cella e differenza riscontrata. Le correzioni si decidono dopo il confronto con le scelte già confermate.
