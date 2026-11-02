# Registro newsletter

- [Iscrizioni](https://docs.google.com/spreadsheets/d/1N-e5dNhM2fiZ2AxQbiZ0EBmwn7JYMKsm-ZRrsQgDoUg/edit).
- [Apps Script](https://script.google.com/home/projects/11_54gDziACCBJHPBTHRvinB_uNOtBC4kEsTzdtQaKRy1F8sBpnAG3UIP/edit).

Sorgente: `newsletter.gs`. Il progetto Google è separato dai contatti; usa le proprietà `SPREADSHEET_ID` e `NEWSLETTER_SECRET`. `initializeNewsletter()` prepara la scheda `Newsletter` senza sovrascrivere le iscrizioni. Non spostare o rinominare le intestazioni.

Sul server configura `NEWSLETTER_SCRIPT_URL` (deployment `/exec`) e `NEWSLETTER_SCRIPT_SECRET`. In locale restano in `.env.local`; in produzione vanno impostate sull’hosting. Non inserirle in Git o in variabili `PUBLIC_*`.

`POST /api/newsletter` convalida nome, cognome, email, città, professione e consenso. Il foglio conserva anche data, privacy accettata, lingua e ID. La pagina di ringraziamento si apre solo dopo la ricevuta di salvataggio.

Contatti e newsletter condividono il trasporto server e la gestione del modulo; fogli, chiavi e limiti restano separati. Antispam: campo nascosto, attesa minima di 3 secondi, 5 invii per email e 10 per IP in 10 minuti. Riprovare con lo stesso ID non aggiunge righe; ogni nuovo invio resta registrato.

Brevo non è ancora collegato. All’attivazione, importare le iscrizioni e mantenere il salvataggio Google nello stesso flusso di iscrizione, anche dopo il collegamento a Brevo.

Verifiche locali: `node --test tests/*.test.mjs`. Le prove sul foglio reale usano solo dati sintetici, da rimuovere prima della consegna.
