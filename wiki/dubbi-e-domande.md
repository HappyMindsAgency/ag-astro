# Dubbi e domande

Punti ancora aperti con designer e team sulla **3° Release**. Le scelte già approvate sono nelle [regole frontend](frontend.md); le differenze mobile sotto restano come promemoria per la prossima release.

## Architettura e destinazioni

Dal [file degli slug](AG_Trustees_Slug.xlsx) restano da chiarire:

- **Family office (P08):** in standby perché potrebbe andare su Fidire. Pagina non predisposta.
- **Library (P15–P16):** confermare la gerarchia: Percorso IT usa `/knowledge-library/[tipologia]/`, Pagina padre cita `/knowledge-library/tipologia/`.
- **Filtri tematici, Newsletter e accesso ai dati (P14, P20, P24):** presenza al lancio da decidere; pagine non predisposte. Le schermate di iscrizione e conferma newsletter attendono il designer.
- **Informazioni societarie (P26):** riga incompleta, senza percorso o indicazione sul lancio.

### Collegamenti da completare prima del lancio

Provare ogni occorrenza dopo l’integrazione; se una destinazione non è prevista al lancio, decidere se omettere il relativo invito. Rimuovere le righe risolte.

| Elemento | Dove verificarlo | Da completare |
| --- | --- | --- |
| Leggi l’ultima newsletter | CTA finale di AG Informa, Eventi, Knowledge Library e modulo newsletter di Contatti | URL della newsletter in `NewsletterCallToAction` (`latestNewsletterUrl`) e nella seconda azione di `NewsletterSection`. |
| Calendario completo | Entrambi gli elenchi Eventi e i correlati del dettaglio evento | Destinazione in `EventList` (`calendarHref`). |
| PDF e documenti della ricerca | Library, correlati di Trust/Patrimonio/articolo/evento e risultati della ricerca | URL dei file da Strapi (`downloadUrl`). |
| LinkedIn | Header e footer di tutte le pagine | URL del profilo tramite `Layout` (`linkedinUrl`). |
| Certificazioni | Utility del footer | Destinazione da confermare. |
| FAQ | Menu del footer | Confermare destinazione e rapporto con le FAQ della Library; manca una pagina dedicata nel file degli slug. |
| Newsletter | Sottomenu dell’header | Confermare destinazione e presenza al lancio, come nel punto P20 sopra. |

Restano da confermare eventuali collegamenti dalle competenze di Chi siamo e dalle esigenze patrimoniali nella Home.

## Integrazioni e contenuti comuni

- **Strapi:** profili e descrizioni del Team, articoli e documenti correlati saranno caricati dinamicamente; non estrarre ora questi contenuti dai fogli. Servono dati definitivi, relazioni e accordo con Vito sul formato del corpo editoriale. I commenti `TODO Strapi` identificano gli esempi da sostituire; i dettagli articolo ed evento mostrano per ora lo stesso esempio per ogni slug.
- **FAQ:** Servizi, Trust, Patrimonio e Contatti hanno tre coppie definitive. Confermare se i gruppi ricevuti sono completi rispetto alle 4–5 domande citate nelle note del foglio.
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
| Chi siamo | A6 mantenuto come da commento, da ricontrollare con il cliente. Confermare A12/B12, A23/B23, A25/B24:B25 e A34/B34: l’inglese riprende A23, A25 e A34. Restano presentazione a due punti, competenze a un paragrafo e collocazione della CTA A44. |
| Visione e metodologia | Mancano introduzione dei principi e testi della fascia “Come nasce AG Trustees”. La fase “Definire” (A44:A46) richiede una quarta card nella griglia attuale a tre; confermare anche la CTA interna all’elenco dei principi. |
| Patrimonio | A52 coincide già con il sito ma manca la conferma nel foglio. Restano da confermare titoli e introduzione fissi degli approfondimenti A89:A95; articoli e documenti saranno dinamici. Da confermare le icone ripetute nelle ultime cinque voci. |
| Contatti | Il testo di ringraziamento in A36 è disponibile; schermata e comportamento dopo l’invio restano da concordare con designer e backend. Manca la destinazione di “Leggi l’ultima newsletter”, come nella tabella sopra. |
| Home | Manca il testo introduttivo della sezione Patrimonio; definire la collocazione della CTA del foglio Home!A56. Evento e articoli attendono dati e link da Strapi. La versione inglese del foglio non è ancora integrata. |
| Trust | Articoli e documenti correlati saranno dinamici. Confermare solo la collocazione dei testi fissi A84/A86 e delle CTA A88/A89 nel design. |
| Team | Descrizioni, profili e articoli collegati saranno gestiti tramite Strapi. Il blocco contatti A20:A24 non corrisponde alla newsletter attuale: confermare la collocazione. Profili individuali: percorsi predisposti, design mancante. |
| AG Informa | Articoli, date e categorie provvisori; servono ordine e categorie definitivi. |
| Dettaglio articolo | Testo, data, tempo di lettura, autore, nota sull’IA, correlati e CTA provvisori. Figma cita “In breve: le risposte chiave” senza mostrarne la sezione: voce omessa dall’indice. |
| Eventi | Date, luoghi e contenuti degli eventi provvisori; servono criteri di selezione dei due elenchi. |
| Dettaglio evento | Testo, orario, categoria, documenti, correlati e piccolo invito ai contatti provvisori; il primo correlato ripete l’evento corrente. |
| Knowledge Library | PDF, categorie e metadati definitivi; alcuni metadati differiscono dagli stessi esempi in articolo ed evento. I Link utili A8:A11 attendono l’indicazione grafica del designer. Correggere il collegamento di Milano Finanza, che nel foglio punta a Italia Oggi. |

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
