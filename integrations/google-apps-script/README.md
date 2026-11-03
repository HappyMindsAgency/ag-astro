# Salvataggio dei contatti

`contatti.gs` è il sorgente da mantenere allineato al progetto Google Apps Script. `mail-delivery.gs` va inserito come secondo file `InviiEmail.gs` sia nel progetto Contatti sia nel progetto Newsletter; condivide il registro degli esiti senza unire i dati dei due fogli. Aggiornare entrambi i deployment quando cambia questo file.

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

## Email dei contatti

Aggiornare il deployment di `contatti.gs` prima di abilitare SMTP. Il codice resta compatibile con il solo salvataggio; il nuovo foglio `Invii email` si prepara automaticamente alla prima richiesta con email attive, senza cambiare le colonne di `Contatti`.

Sul server configurare le variabili `SMTP_*`, `MAIL_*` e `CONTACT_MAIL_*` elencate in `.env.example`. SMTP, mittente e modalità sono comuni ai due moduli. `MAIL_MODE=off` conserva il solo salvataggio, `test` recapita tutte le email esclusivamente a `MAIL_TEST_TO` senza CC/CCN, `live` invia la notifica dei contatti a `CONTACT_MAIL_TO` con `CONTACT_MAIL_BCC` nascosta e la copia soltanto all’utente. Le credenziali restano in `.env.local` e nelle variabili private dell’hosting.

Per il collaudo usare `MAIL_MODE=test`, `MAIL_TEST_TO=assistenzaweb@happyminds.it`, `CONTACT_MAIL_TO=assistenzaweb@happyminds.it` e `CONTACT_MAIL_BCC` vuota. Tutte le email, incluse copie e conferme newsletter, hanno l'assistenza come unico destinatario e indirizzo di risposta. Solo dopo l'ok, passare a `live`, impostare il destinatario interno a `segreteria@agtrustees.it` e aggiungere `assistenzaweb@happyminds.it` in CCN; copie e conferme torneranno agli indirizzi compilati nei moduli.

Microsoft 365 usa LOGIN su porta 587, STARTTLS obbligatorio e TLS minimo 1.2. L’account autenticato deve poter inviare con il mittente configurato. I due messaggi contengono HTML e testo semplice; il logo è incorporato e collega alla homepage definitiva. La copia segue la lingua del modulo. Rispondere alla notifica interna contatta l’utente; rispondere alla copia contatta la segreteria.

Microsoft prevede la disattivazione predefinita di SMTP AUTH Basic a fine dicembre 2026, con possibilità di riabilitazione amministrativa: verificare la configurazione della casella o il passaggio a OAuth con chi la gestisce. [Calendario Microsoft](https://techcommunity.microsoft.com/blog/exchange/updated-exchange-online-smtp-auth-basic-authentication-deprecation-timeline/4489835).

Il contatto viene salvato prima dell’invio. La conferma richiede l’accettazione SMTP di entrambe le email e la registrazione degli esiti. Il registro distingue `in corso`, `inviata`, `da riprovare` e `da verificare`: un nuovo tentativo con lo stesso ID invia solo le email rifiutate prima dell’accettazione. Un esito incerto dopo DATA, una conferma assente o un’accettazione parziale richiedono verifica manuale; non vengono ripetuti automaticamente. Dopo aver controllato i messaggi effettivamente partiti, si può correggere lo stato del solo invio nel registro. Non cambiare ID, tipo o modalità. L’accettazione SMTP non garantisce il recapito: eventuali rimbalzi arrivano alla casella mittente.

Le iscrizioni usano un [registro newsletter separato](newsletter.md).

Test locali: `node --test tests/contact-*.test.mjs tests/google-apps-script.test.mjs`. La prova sul foglio reale va eseguita separatamente con dati sintetici.
