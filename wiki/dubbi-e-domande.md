# Dubbi e domande

Punti ancora aperti con designer e team sulla **3° Release**. Le scelte già approvate sono nelle [regole frontend](frontend.md); le differenze mobile sotto restano come promemoria per la prossima release.

## Architettura e destinazioni

Dal [file degli slug](AG_Trustees_Slug.xlsx) restano da chiarire:

- **Galvani e Argos (P03):** pagina dedicata o sezione di Chi siamo? Attendere le indicazioni grafiche del designer; pagina separata non predisposta.
- **Family office (P08):** in standby perché potrebbe andare su Fidire. Pagina non predisposta.
- **Library (P15–P16):** confermare la gerarchia: Percorso IT usa `/knowledge-library/[tipologia]/`, Pagina padre cita `/knowledge-library/tipologia/`.
- **Filtri tematici, Newsletter e accesso ai dati (P14, P20, P24):** presenza al lancio da decidere; pagine non predisposte. Le schermate di iscrizione e conferma newsletter attendono il designer.
- **Informazioni societarie (P26):** riga incompleta, senza percorso o indicazione sul lancio.

### Collegamenti da completare prima del lancio

Provare ogni occorrenza dopo l’integrazione; se una destinazione non è prevista al lancio, decidere se omettere il relativo invito. Rimuovere le righe risolte.

| Elemento | Dove verificarlo | Da completare |
| --- | --- | --- |
| Leggi l’ultima newsletter | CTA finale di AG Informa, Eventi e Knowledge Library | URL della newsletter in `NewsletterCallToAction` (`latestNewsletterUrl`). |
| Calendario completo | Entrambi gli elenchi Eventi e i correlati del dettaglio evento | Destinazione in `EventList` (`calendarHref`). |
| PDF e documenti della ricerca | Library, correlati di Trust/Patrimonio/articolo/evento e risultati della ricerca | URL dei file da Strapi (`downloadUrl`). |
| LinkedIn | Header e footer di tutte le pagine | URL del profilo tramite `Layout` (`linkedinUrl`). |
| Certificazioni | Utility del footer | Destinazione da confermare. |
| FAQ | Menu del footer | Confermare destinazione e rapporto con le FAQ della Library; manca una pagina dedicata nel file degli slug. |
| Galvani e Argos / Newsletter | Sottomenu dell’header | Confermare destinazioni e presenza al lancio, come nei punti P03 e P20 sopra. |

Restano da confermare eventuali collegamenti dalle competenze di Chi siamo e dalle esigenze patrimoniali nella Home.

## Integrazioni e contenuti comuni

- **Strapi:** servono dati definitivi, relazioni e accordo con Vito sul formato del corpo editoriale. I commenti `TODO Strapi` identificano gli esempi da sostituire; i dettagli articolo ed evento mostrano per ora lo stesso esempio per ogni slug.
- **FAQ:** la prima risposta di Servizi e Patrimonio è definitiva; restano due domande e risposte segnaposto per pagina e le ulteriori FAQ richieste nel file testi. Trust attende ancora le risposte definitive e la sostituzione delle domande segnaposto.
- **Servizi esterni:** configurazione di moduli contatti, newsletter e mappa; mancano le mappe delle altre sedi. Invii e selezione sedi restano disattivati; “Iscriviti” porta al modulo di Contatti.
- **Ricerca e Knowledge Library:** scegliere con Vito la fonte dei risultati (filtri di Strapi o motore dedicato) e stimare il numero di documenti. Valutare i filtri della Library sul server in base al volume dei dati e alle prestazioni.
- **SEO della ricerca:** gestire `noindex, follow` di `/cerca/` tramite la SEO dinamica di Strapi.
- **Pagine legali:** servono testi definitivi per Privacy e Cookie.

## Asset mancanti

- **Chi siamo:** video previsto dopo il lancio, con spazio predisposto ma nascosto. Quando disponibile serviranno file o URL, poster e indicazioni sulla riproduzione.
- **Home:** foto hero definitiva, in sostituzione dell’immagine Figma con watermark Unsplash+.
- **Team:** foto di Sonia Franchini, Michela e Giuseppina Ranzenigo; manca anche il cognome di Michela.

## Contenuti specifici da completare

| Pagina | Punti da chiarire o sostituire |
| --- | --- |
| Chi siamo | A6 mantenuto come da commento, da ricontrollare con il cliente. Confermare A12/B12, A23/B23, A24:A25/B24:B25 e A34/B34; poi adattare presentazione a due punti e competenze a un paragrafo. La CTA A44 non ha una collocazione nel layout attuale. |
| Visione e metodologia | Mancano introduzione dei principi e testi della fascia “Come nasce AG Trustees”. La fase “Definire” (A44:A46) richiede una quarta card nella griglia attuale a tre; confermare anche la CTA interna all’elenco dei principi. |
| Patrimonio | Protezione e Passaggio generazionale ripetono il secondo paragrafo; confermare testi e icone ripetute nelle ultime cinque voci. |
| Contatti | FAQ definitive mancanti. Il design mantiene una sola CTA newsletter; confermare se aggiungere “Leggi l’ultima newsletter”. |
| Home | Manca il testo introduttivo della sezione Patrimonio; definire la collocazione della CTA del foglio Home!A56. Evento e articoli attendono dati e link da Strapi. La colonna inglese del foglio è ancora parziale. |
| Team | Titoli, ruoli, biografie e articoli collegati provvisori. Per i profili individuali il percorso è predisposto: mancano design, contenuti e conferma dei collegamenti dai nomi. |
| AG Informa | Articoli, date e categorie provvisori; servono ordine e categorie definitivi. |
| Dettaglio articolo | Testo, data, tempo di lettura, autore, nota sull’IA, correlati e CTA provvisori. Figma cita “In breve: le risposte chiave” senza mostrarne la sezione: voce omessa dall’indice. |
| Eventi | Date, luoghi e contenuti degli eventi provvisori; servono criteri di selezione dei due elenchi. |
| Dettaglio evento | Testo, orario, categoria, documenti, correlati e piccolo invito ai contatti provvisori; il primo correlato ripete l’evento corrente. |
| Knowledge Library | PDF, categorie e metadati definitivi; alcuni metadati differiscono dagli stessi esempi in articolo ed evento. I Link utili attendono l’indicazione grafica del designer. |
| 404 | Mantenere il segnaposto: la pagina completa attende le indicazioni grafiche del designer. |

## Mobile: confronto con la prossima release

Mantengo i contenuti desktop e gli adattamenti già approvati. Da ricontrollare quando saranno disponibili i frame definitivi:

| Pagina | Incongruenza o design mancante |
| --- | --- |
| Chi siamo | Sei competenze e otto voci del metodo, contro tre e quattro del desktop. |
| Visione e metodologia | Introduzione e testo del metodo diversi dal desktop. |
| Servizi | Titolo e introduzione riprendono Visione; sette servizi identici e FAQ riferite a Trust e Patrimonio. |
| Trust | Breadcrumb Patrimonio, sopratitolo ripreso da Visione e testi relativi al patrimonio. |
| Patrimonio | Cinque esigenze contro nove; numerazione e testi incoerenti. FAQ dopo i correlati, diversamente dal desktop. |
| Contatti | Dopo il titolo riprende Chi siamo e non mostra sedi, mappa, newsletter e FAQ. |
| Team | Testi e biografie diversi dal desktop; sopratitolo operativo “Il nostro metodo”. |
| Dettaglio articolo | Manca un frame completo; indice richiudibile prima del testo. |
| Dettaglio evento | Manca un frame dedicato; copertina nel contenitore, informazioni e condivisione prima del testo. |

## Contrasto dei testi

Il copyright nel footer (circa 1,9:1) e la descrizione della card Identità di Chi siamo sul desktop (circa 4,2:1) restano sotto il minimo di 4,5:1 per i testi normali previsto dalle [WCAG AA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Mantengo i colori approvati; serve concordare con il designer una variante più leggibile.
