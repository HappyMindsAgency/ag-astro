# Dubbi e domande

Punti ancora aperti con designer e team sulla **3° Release**. Le scelte già approvate sono nelle [regole frontend](frontend.md); le differenze mobile sotto restano come promemoria per la prossima release.

## Architettura e destinazioni

Dal [file degli slug](AG_Trustees_Slug.xlsx) restano da chiarire:

- **Galvani e Argos (P03):** pagina dedicata o sezione di Chi siamo? Pagina separata non predisposta.
- **Family office (P08):** in standby perché potrebbe andare su Fidire. Pagina non predisposta.
- **Library (P15–P16):** confermare la gerarchia: Percorso IT usa `/knowledge-library/[tipologia]/`, Pagina padre cita `/knowledge-library/tipologia/`.
- **Filtri tematici, Newsletter e accesso ai dati (P14, P20, P24):** presenza al lancio da decidere; pagine non predisposte.
- **Informazioni societarie (P26):** riga incompleta, senza percorso o indicazione sul lancio.

### Collegamenti da completare prima del lancio

Provare ogni occorrenza dopo l’integrazione; se una destinazione non è prevista al lancio, decidere se omettere il relativo invito. Rimuovere le righe risolte.

| Elemento | Dove verificarlo | Da completare |
| --- | --- | --- |
| Leggi l’ultima newsletter | CTA finale di AG Informa ed Eventi | URL della newsletter in `NewsletterCallToAction` (`latestNewsletterUrl`). |
| Calendario completo | Entrambi gli elenchi Eventi e i correlati del dettaglio evento | Destinazione in `EventList` (`calendarHref`). |
| Vai alla pagina — Guide e tutorial | CTA finale della Knowledge Library | Destinazione in `CallToAction` (`href`). |
| Scarica PDF | Library e documenti correlati di Trust, Patrimonio, articolo ed evento | URL dei file da Strapi (`downloadUrl`). |
| LinkedIn | Header e footer di tutte le pagine | URL del profilo tramite `Layout` (`linkedinUrl`). |
| Certificazioni | Utility del footer | Destinazione da confermare. |
| FAQ | Menu del footer | Confermare destinazione e rapporto con le FAQ della Library; manca una pagina dedicata nel file degli slug. |
| Galvani e Argos / Newsletter | Sottomenu dell’header | Confermare destinazioni e presenza al lancio, come nei punti P03 e P20 sopra. |

Restano da confermare eventuali collegamenti dalle competenze di Chi siamo e dalle esigenze patrimoniali nella Home.

## Integrazioni e contenuti comuni

- **Strapi:** servono dati definitivi, relazioni e accordo con Vito sul formato del corpo editoriale. I commenti `TODO Strapi` identificano gli esempi da sostituire; i dettagli articolo ed evento mostrano per ora lo stesso esempio per ogni slug.
- **FAQ:** servono risposte e sostituzione delle domande segnaposto di Servizi, Trust e Patrimonio. Le risposte attuali sono Lorem ipsum.
- **Servizi esterni:** configurazione di moduli contatti, newsletter, ricerca e mappa; mancano le mappe delle altre sedi. Invii e selezione sedi restano disattivati; “Iscriviti” porta al modulo di Contatti.
- **Pagine legali:** servono testi definitivi per Privacy e Cookie e contenuti di Credits.

## Asset mancanti

- **Chi siamo:** video previsto dopo il lancio, con spazio predisposto ma nascosto. Quando disponibile serviranno file o URL, poster e indicazioni sulla riproduzione.
- **Home:** foto hero definitiva, in sostituzione dell’immagine Figma con watermark Unsplash+.
- **Team:** foto di Sonia Franchini, Michela e Giuseppina Ranzenigo; manca anche il cognome di Michela.

## Contenuti specifici da completare

| Pagina | Punti da chiarire o sostituire |
| --- | --- |
| Chi siamo | Le tre descrizioni delle competenze sono segnaposto; confermare anche le voci rispetto al mobile. |
| Visione e metodologia | “Titolo della sezione”, terzo e quarto servizio, descrizioni e paragrafi Lorem ipsum/Cras et lorem. La CTA parla di newsletter ma porta ai servizi: confermare testo e destinazione. |
| Patrimonio | Protezione e Passaggio generazionale ripetono il secondo paragrafo; confermare testi e icone ripetute nelle ultime cinque voci. |
| Contatti | Titolo della fascia sedi e descrizione newsletter provvisori. |
| Home | Presentazione, descrizioni dei servizi, introduzione Patrimonio, card del metodo e newsletter provvisori. Evento e articoli attendono dati e link ai dettagli da Strapi. |
| Team | Titoli, ruoli, biografie e articoli collegati provvisori. Per i profili individuali il percorso è predisposto: mancano design, contenuti e conferma dei collegamenti dai nomi. |
| AG Informa | Introduzione, articoli, date e categorie provvisori; servono ordine e categorie definitivi. |
| Dettaglio articolo | Testo, data, tempo di lettura, autore, nota sull’IA, correlati e CTA provvisori. Figma cita “In breve: le risposte chiave” senza mostrarne la sezione: voce omessa dall’indice. |
| Eventi | Introduzione, date, luoghi e testi provvisori; servono criteri di selezione dei due elenchi. |
| Dettaglio evento | Testo, orario, categoria, documenti, correlati e piccolo invito ai contatti provvisori; il primo correlato ripete l’evento corrente. |
| Knowledge Library | PDF, categorie e metadati definitivi; alcuni metadati differiscono dagli stessi esempi in articolo ed evento. Testo di Guide e tutorial provvisorio. |

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
