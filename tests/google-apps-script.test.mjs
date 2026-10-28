import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createHmac, randomUUID } from 'node:crypto';

const source = readFileSync(new URL('../integrations/google-apps-script/contatti.gs', import.meta.url), 'utf8');
const headers = ['Data e ora', 'Nome e cognome', 'Email', 'Telefono', 'Profilo', 'Messaggio', 'Privacy accettata', 'Pagina di provenienza', 'Lingua', 'ID richiesta'];
const sample = () => ({
  id: 'b16a7c26-d476-46ab-bab3-5834e87e3eb0', name: 'Contatto di prova',
  email: 'test@example.com', phone: '+39 000 0000000', profile: 'Test',
  message: 'Dati sintetici per la verifica locale.', privacy: true, sourcePage: '/contatti/', lang: 'it',
});

function runtime({ failWrite = false, alteredHeader = false, busy = false, failFlushOnce = false } = {}) {
  const rows = [alteredHeader ? ['Colonne modificate'] : [...headers]];
  let spreadsheetAccesses = 0;
  let locked = false;
  let now = 1800000000000;
  const properties = { CONTACT_SECRET: 'segreto-fittizio-test', SPREADSHEET_ID: 'foglio-fittizio-test' };
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: row => { if (failWrite) throw new Error('Salvataggio non riuscito'); rows.push(row); },
    getRange: (row, column) => ({
      getValues: () => [rows[row - 1]],
      createTextFinder: value => ({ matchEntireCell: () => ({ findNext: () => rows.slice(row - 1).some(r => r[column - 1] === value) ? {} : null }) }),
    }),
  };
  const context = vm.createContext({
    Date: class extends Date {
      constructor(value = now) { super(value); }
      static now() { return now; }
    },
    Utilities: { computeHmacSha256Signature: (value, secret) => [...createHmac('sha256', secret).update(value).digest()] },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: key => properties[key], getProperties: () => ({ ...properties }),
      deleteProperty: key => { delete properties[key]; },
      setProperties: values => Object.assign(properties, values),
    }) },
    SpreadsheetApp: {
      openById: () => { spreadsheetAccesses++; return { getSheetByName: () => sheet }; },
      flush: () => { if (failFlushOnce) { failFlushOnce = false; throw new Error('Risposta interrotta dopo la scrittura'); } },
    },
    LockService: { getScriptLock: () => ({ tryLock: () => busy ? false : (locked = true), hasLock: () => locked, releaseLock: () => { locked = false; } }) },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
  });
  vm.runInContext(source, context);
  return {
    rows, properties,
    send: (lead = sample(), secret = 'segreto-fittizio-test', rateKey = 'a'.repeat(64)) => context.doPost({ postData: { contents: JSON.stringify({ secret, lead, rateKey }) } }),
    accesses: () => spreadsheetAccesses, locked: () => locked, advance: ms => { now += ms; },
  };
}

test('una richiesta valida viene registrata con pagina, lingua e ricevuta', () => {
  const r = runtime();
  assert.deepEqual(r.send(), { ok: true, id: sample().id });
  assert.equal(r.rows.length, 2);
  assert.equal(r.rows[1][7], '/contatti/');
  assert.equal(r.rows[1][8], 'it');
  assert.equal(r.locked(), false);
});

test('la ripetizione dello stesso invio restituisce la ricevuta senza una seconda riga', () => {
  const r = runtime();
  r.send();
  assert.deepEqual(r.send(), { ok: true, id: sample().id });
  assert.equal(r.rows.length, 2);
});

test('un segreto errato impedisce qualsiasi accesso al foglio', () => {
  const r = runtime();
  assert.equal(r.send(sample(), 'non-autorizzato').ok, false);
  assert.equal(r.accesses(), 0);
});

test('privacy mancante, email errata e pagina non prevista vengono rifiutate', () => {
  for (const change of [{ privacy: false }, { email: 'email-errata' }, { sourcePage: '/inesistente/' }, { lang: 'en' }]) {
    const r = runtime();
    assert.equal(r.send({ ...sample(), ...change }).ok, false);
    assert.equal(r.rows.length, 1);
  }
});

test('gli errori di scrittura e le colonne spostate non producono una conferma', () => {
  for (const options of [{ failWrite: true }, { alteredHeader: true }]) {
    const r = runtime(options);
    assert.equal(r.send().ok, false);
    assert.equal(r.rows.length, 1);
    assert.equal(r.locked(), false);
  }
});

test('le stringhe simili a formule vengono inviate al foglio come testo', () => {
  const r = runtime();
  assert.equal(r.send({ ...sample(), message: '=1+1' }).ok, true);
  assert.equal(r.rows[1][5], "'=1+1");
});

test('anche gli apostrofi iniziali vengono conservati e i campi vuoti rimangono vuoti', () => {
  const r = runtime();
  assert.equal(r.send({ ...sample(), message: "'Testo originale", profile: '' }).ok, true);
  assert.equal(r.rows[1][5], "''Testo originale");
  assert.equal(r.rows[1][4], '');
});

test('i campi facoltativi possono essere vuoti; i testi eccessivi vengono rifiutati', () => {
  assert.equal(runtime().send({ ...sample(), phone: '', profile: '', message: '' }).ok, true);
  assert.equal(runtime().send({ ...sample(), message: 'a'.repeat(5001) }).ok, false);
});

test('anche le pagine inglesi mantengono la loro provenienza', () => {
  const r = runtime();
  assert.equal(r.send({ ...sample(), sourcePage: '/en/about-us/team/', lang: 'en' }).ok, true);
  assert.equal(r.rows[1][7], '/en/about-us/team/');
});

test('cinque messaggi diversi sono consentiti e il sesto viene limitato, anche cambiando IP', () => {
  const r = runtime();
  for (let i = 0; i < 5; i++) {
    assert.equal(r.send({ ...sample(), id: randomUUID(), message: `Messaggio ${i}` }).ok, true);
  }
  assert.deepEqual(r.send({ ...sample(), id: randomUUID() }, 'segreto-fittizio-test', 'b'.repeat(64)), { ok: false, code: 'rate_limited', retryAfter: 600 });
  assert.equal(r.rows.length, 6);
  assert.equal(r.locked(), false);
});

test('la stessa email con maiuscole conta nello stesso limite', () => {
  const r = runtime();
  for (let i = 0; i < 5; i++) r.send({ ...sample(), id: randomUUID() });
  assert.equal(r.send({ ...sample(), id: randomUUID(), email: 'TEST@EXAMPLE.COM' }).code, 'rate_limited');
});

test('il limite per IP impedisce di aggirare il controllo cambiando email', () => {
  const r = runtime();
  for (let i = 0; i < 10; i++) assert.equal(r.send({ ...sample(), id: randomUUID(), email: `test${i}@example.com` }).ok, true);
  assert.equal(r.send({ ...sample(), id: randomUUID(), email: 'nuovo@example.com' }).code, 'rate_limited');
  assert.equal(r.rows.length, 11);
});

test('un invio già registrato viene confermato anche quando il limite è raggiunto', () => {
  const r = runtime();
  const first = sample();
  r.send(first);
  for (let i = 0; i < 4; i++) r.send({ ...sample(), id: randomUUID() });
  assert.deepEqual(r.send(first), { ok: true, id: first.id });
  assert.equal(r.rows.length, 6);
  assert.equal(r.send({ ...sample(), id: randomUUID() }).code, 'rate_limited');
});

test('dopo dieci minuti i contatori scadono senza cancellare le impostazioni', () => {
  const r = runtime();
  for (let i = 0; i < 5; i++) r.send({ ...sample(), id: randomUUID() });
  r.advance(599000);
  assert.equal(r.send({ ...sample(), id: randomUUID() }).retryAfter, 1);
  r.advance(1000);
  assert.equal(r.send({ ...sample(), id: randomUUID(), email: 'nuovo@example.com' }).ok, true);
  assert.equal(Object.keys(r.properties).filter(key => key.startsWith('CONTACT_RATE_')).length, 2);
  assert.equal(r.properties.CONTACT_SECRET, 'segreto-fittizio-test');
});

test('la chiave del limite è obbligatoria e i contatori non contengono email in chiaro', () => {
  const r = runtime();
  assert.equal(r.send(sample(), 'segreto-fittizio-test', '').ok, false);
  assert.equal(r.accesses(), 0);
  assert.equal(r.send().ok, true);
  assert.equal(JSON.stringify(r.properties).includes('test@example.com'), false);
});

test('un lock occupato non salva dati e non consuma un tentativo', () => {
  const r = runtime({ busy: true });
  assert.deepEqual(r.send(), { ok: false, code: 'busy' });
  assert.equal(r.rows.length, 1);
  assert.equal(Object.keys(r.properties).filter(key => key.startsWith('CONTACT_RATE_')).length, 0);
});

test('un errore dopo la scrittura non duplica la riga al tentativo successivo', () => {
  const r = runtime({ failFlushOnce: true });
  assert.deepEqual(r.send(), { ok: false, code: 'write_failed' });
  assert.deepEqual(r.send(), { ok: true, id: sample().id });
  assert.equal(r.rows.length, 2);
});
