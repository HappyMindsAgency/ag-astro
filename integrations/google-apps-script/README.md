# Salvataggio dei contatti

`contatti.gs` è il sorgente da mantenere allineato al progetto Google Apps Script.

- [Registro contatti](https://docs.google.com/spreadsheets/d/1PGGaOY7If1t1QJlraiRJtJHWEafrJ7XbPDWHmDXdzFw/edit).
- [Progetto Apps Script](https://script.google.com/home/projects/19ocYkHZv5KPwKVOC5uR7Gi560N_Q80u9_TRYZ5tmahiMIxbzRJnmSsg8/edit).

1. Crea un foglio Google privato e una scheda `Contatti`.
2. Nelle proprietà dello script imposta `SPREADSHEET_ID` e `CONTACT_SECRET` (chiave casuale di almeno 32 caratteri).
3. Esegui `initializeContacts`: prepara le colonne senza sovrascrivere dati esistenti. Non spostare o rinominare le intestazioni.
4. Pubblica come applicazione web, eseguita dal proprietario e raggiungibile dal server del sito. Ogni richiesta richiede la chiave privata.
5. Configura `CONTACT_SCRIPT_URL` con l’URL `/exec` del deployment e `CONTACT_SCRIPT_SECRET` con la stessa chiave. In locale usa `.env.local`, escluso da Git; in produzione le variabili dell’hosting.

`POST /api/contatti` convalida i campi, il campo antispam e i tre secondi minimi. Salva pagina e lingua delle quattro pagine previste, anche in inglese. Conferma solo una ricevuta con lo stesso ID della richiesta; un nuovo tentativo con lo stesso ID non aggiunge altre righe.

Il modulo apre la pagina di ringraziamento nella stessa lingua solo dopo la ricevuta. Durante l’invio il pulsante è disabilitato; in caso di errore i campi restano compilati e si può riprovare.

Il limite condiviso è di 5 nuove richieste per email e 10 per IP in 10 minuti; i tentativi con lo stesso ID già salvato non vengono conteggiati. I contatori `CONTACT_RATE_*` nelle proprietà dello script usano impronte protette, senza IP in chiaro, e vengono rimossi alla prima richiesta successiva alla scadenza. Non modificarli manualmente. Anche un errore di scrittura dopo la verifica consuma un tentativo.

L’IP proviene da `context.clientAddress` dell’adapter Astro, senza leggere intestazioni inoltrate nel codice del modulo. Con Node standalone dietro un proxy, verificare la configurazione del proxy prima del rilascio; su Vercel lo gestisce l’adapter.

URL e chiave restano sul server. Non usare variabili `PUBLIC_*` per questi valori. Non registrare dati personali o chiavi nei log.

L’invio SMTP e il modulo Newsletter non sono collegati a questo flusso.

Test locali: `node --test tests/contact-*.test.mjs tests/google-apps-script.test.mjs`. La prova sul foglio reale va eseguita separatamente con dati sintetici.
