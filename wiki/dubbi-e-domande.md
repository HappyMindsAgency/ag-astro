# Dubbi e domande

Questioni da chiarire con designer e team. Le scelte già approvate sono nelle [regole frontend](frontend.md).

## Architettura e destinazioni

Dal [file degli slug](AG_Trustees_Slug.xlsx):

- **Family office e Informazioni societarie (P08, P26):** nel file degli slug erano indicate queste due pagine, ma non ho ricevuto altre indicazioni. È confermato che non vanno prodotte?
- **Pagine per tema di AG Informa e Richiesta di accesso ai dati (P14, P24):** nel file degli slug erano indicate queste pagine, ma non ho ricevuto altre indicazioni. Va chiarito se e come realizzarle.

## Collegamenti da completare prima del lancio

Servono le destinazioni dei seguenti inviti. Se non previste al lancio, decidere se rimuoverli.

| Invito | Dove manca la destinazione |
| --- | --- |
| Leggi l’ultima newsletter | Manca il link all’ultima newsletter pubblicata, da collegare al pulsante nei banner newsletter. |
| Calendario completo | Da chiarire dove deve portare il collegamento negli elenchi e nel dettaglio evento. |
| LinkedIn | Manca il link al profilo LinkedIn, da collegare alle icone in header e footer. |

## Integrazioni e contenuti comuni

- **Download:** le categorie esistono in Strapi, ma non sono ancora associate ai PDF. Le date mostrate sono quelle di pubblicazione in Strapi, coincidenti con l’importazione: vanno confermate?
- **Disponibilità Strapi:** verificare i timeout al caricamento; in assenza di risposta la Library risulta vuota.
- **Correlati di Trust e Patrimonio:** mantenuti gli esempi provvisori; mancano indicazioni sulle associazioni ai contenuti Strapi.
- **Favicon:** in attesa dell’immagine del designer.
- **Cookie e mappe:** Google Maps è attiva; resta da collegare il blocco e il comando per dare il consenso al futuro sistema dei cookie.
- **Email dei contatti:** mancano credenziali SMTP e casella destinataria; l’invio delle email è ancora da implementare e configurare.
- **Pagine legali:** restano da ricevere la Cookie policy e le indicazioni per la Privacy inglese.
