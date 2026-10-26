# Dubbi e domande

Questioni da chiarire con designer e team. Le scelte già approvate sono nelle [regole frontend](frontend.md).

## Architettura e destinazioni

Dal [file degli slug](AG_Trustees_Slug.xlsx):

- **Family office (P08):** resta in standby o sarà pubblicata su Fidire?
- **Library (P15–P16):** confermare la gerarchia: Percorso IT usa `/knowledge-library/[tipologia]/`, Pagina padre cita `/knowledge-library/tipologia/`.
- **Filtri tematici e accesso ai dati (P14, P24):** saranno presenti al lancio?
- **Informazioni societarie (P26):** riga incompleta, senza percorso o indicazione sul lancio.

## Collegamenti da completare prima del lancio

Servono le destinazioni dei seguenti inviti. Se non previste al lancio, decidere se rimuoverli.

| Invito | Dove manca la destinazione |
| --- | --- |
| Leggi l’ultima newsletter | Banner di AG Informa, Eventi, Library e Contatti. |
| Calendario completo | Elenchi Eventi e correlati del dettaglio evento. |
| PDF | Library, correlati e risultati della ricerca: servono gli URL dei file da Strapi. |
| LinkedIn | Header e footer: serve l’URL del profilo. |
| Certificazioni | Utility del footer. |
| FAQ | Menu del footer: chiarire anche il rapporto con le FAQ della Library; manca una pagina dedicata negli slug. |

Le competenze di Chi siamo e le esigenze patrimoniali della Home devono avere collegamenti?

## Integrazioni e contenuti comuni

- **Strapi:** concordare con Vito dati, relazioni e formato del corpo editoriale. Team, articoli, eventi e documenti usano ancora esempi; i dettagli mostrano lo stesso contenuto per ogni slug.
- **FAQ:** le tre domande ricevute per Servizi, Trust, Patrimonio e Contatti sono complete? Le note del foglio ne citano 4–5.
- **Moduli e mappa:** concordare servizi, invio e conferme; mancano le mappe delle altre sedi.
- **Ricerca e Library:** concordare con Vito la fonte dei risultati e il volume dei documenti, per scegliere tra filtri locali e sul server.
- **Pagine legali:** servono testi definitivi per Privacy e Cookie.

## Asset mancanti

- **Home:** foto hero definitiva, in sostituzione dell’immagine Figma con watermark Unsplash+.
- **Team:** foto di Sonia Franchini, Michela e Giuseppina Ranzenigo; manca anche il cognome di Michela.

## Contenuti specifici da completare

| Pagina | Punti da chiarire o sostituire |
| --- | --- |
| Chi siamo | Ricontrollare A6 con il cliente e confermare A12/B12, A23/B23, A25/B24:B25 e A34/B34: alcuni testi inglesi ripetono i paragrafi italiani. Chiarire la disposizione della presentazione a due punti, delle competenze a un paragrafo e della CTA A44. |
| Visione e metodologia | Servono introduzione dei principi e testi di “Come nasce AG Trustees”. Come inserire la quarta fase “Definire” (A44:A46) e la CTA nell’elenco dei principi? |
| Patrimonio | Confermare A52, titoli e introduzione degli approfondimenti A89:A95 e icone ripetute nelle ultime cinque voci. |
| Contatti | Definire la schermata dopo l’invio; il ringraziamento A36 è già disponibile. |
| Home | Servono l’introduzione della sezione Patrimonio e la collocazione della CTA A56. La versione inglese non è ancora integrata. |
| Trust | Dove collocare i testi fissi A84/A86 e le CTA A88/A89? |
| Team | Dove inserire il blocco contatti A20:A24? Mancano il testo definitivo della fascia newsletter e il design dei profili individuali. |
| Newsletter | Definire il design della pagina e della conferma. Testi nel foglio NL: A3/A4/A6, modulo A8:A9, conferma A15/A17. |
| AG Informa | Confermare ordine e categorie degli articoli. |
| Dettaglio articolo | Servono testi e dati definitivi. Figma cita “In breve: le risposte chiave” senza mostrarne la sezione: va prevista? |
| Eventi | Quali criteri distinguono i due elenchi? |
| Dettaglio evento | Servono contenuti e CTA definitivi; il primo correlato ripete l’evento corrente. |
| Knowledge Library | Chiarire metadati incoerenti tra gli esempi e disposizione dei Link utili A8:A11. Nel foglio il link Milano Finanza punta a Italia Oggi: serve quello corretto. |

## Mobile: confronto con la prossima release

Gli adattamenti attuali sono approvati. Al prossimo aggiornamento di Figma, confrontare:

| Pagina | Incongruenza o design mancante |
| --- | --- |
| Chi siamo | Sei competenze e otto voci del metodo, contro tre e quattro del desktop. |
| Galvani e Argos / 404 | Mancano i frame mobile. |
| Visione e metodologia | Introduzione e testo del metodo diversi dal desktop. |
| Servizi | Titolo e introduzione riprendono Visione; sette servizi identici e FAQ riferite a Trust e Patrimonio. |
| Trust | Breadcrumb Patrimonio, sopratitolo ripreso da Visione e testi relativi al patrimonio. |
| Patrimonio | Cinque esigenze contro nove; numerazione e testi incoerenti. FAQ dopo i correlati, diversamente dal desktop. |
| Contatti | Dopo il titolo riprende Chi siamo e non mostra sedi, mappa, newsletter e FAQ. |
| Team | Testi e biografie diversi dal desktop; sopratitolo operativo “Il nostro metodo”. |
| Dettaglio articolo / evento | Mancano i frame mobile completi. |

## Contrasto dei testi

Concordare con il designer colori più leggibili per il copyright del footer (circa 1,9:1) e la descrizione della card Identità di Chi siamo sul desktop (circa 4,2:1). Il minimo [WCAG AA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) per i testi normali è 4,5:1; i colori attuali restano approvati.
