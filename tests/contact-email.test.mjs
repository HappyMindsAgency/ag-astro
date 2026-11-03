import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { contactMailConfig, contactEmail } from '../src/lib/contact-email.ts';
import { deliverContact } from '../src/lib/lead-delivery.ts';
import { scriptRuntime } from './helpers/google-script-runtime.mjs';

const lead = () => ({ id: randomUUID(), name: '<Nome & cognome>', email: 'utente@example.com', phone: '', profile: '', message: '<script>Test</script>\nSeconda riga', privacy: true, sourcePage: '/contatti/', lang: 'it' });
const env = { MAIL_MODE: 'test', SMTP_HOST: 'smtp.example.com', SMTP_PORT: '587', SMTP_USER: 'smtp@example.com', SMTP_PASSWORD: 'segreto-fittizio', MAIL_FROM: 'no-reply@example.com', CONTACT_MAIL_TO: 'segreteria@example.com', CONTACT_MAIL_BCC: 'assistenza@example.com', MAIL_TEST_TO: 'solo-test@example.com' };
const config = contactMailConfig(env);
const script = { url: 'https://script.google.com/macros/s/prova/exec', secret: 'segreto-fittizio-di-almeno-32-caratteri' };
const logo = readFileSync(new URL('../public/assets/brand/ag-logo-orizzontale.png', import.meta.url));
const source = readFileSync(new URL('../integrations/google-apps-script/contatti.gs', import.meta.url), 'utf8');
const headers = ['Data e ora', 'Nome e cognome', 'Email', 'Telefono', 'Profilo', 'Messaggio', 'Privacy accettata', 'Pagina di provenienza', 'Lingua', 'ID richiesta'];
const runtime = () => scriptRuntime({ source, headers, secretProperty: 'CONTACT_SECRET' });
const bridge = r => async (_, options) => Response.json(r.action({ ...JSON.parse(options.body), secret: 'segreto-fittizio-test' }));

test('SMTP: la configurazione incompleta o gli indirizzi manipolati non abilitano gli invii', () => {
  assert.ok(config);
  for (const change of [{ MAIL_MODE: '' }, { MAIL_MODE: 'automatico' }, { SMTP_PASSWORD: '' }, { SMTP_PORT: '465' }, { MAIL_TEST_TO: '' }, { MAIL_FROM: 'x@example.com\r\nBcc:x@example.com' }]) {
    assert.equal(contactMailConfig({ ...env, ...change }), null);
  }
});

test('test: entrambe le email hanno un unico destinatario e nessuna copia', () => {
  for (const kind of ['internal', 'courtesy']) {
    const mail = contactEmail(lead(), kind, config, logo);
    assert.equal(mail.to, env.MAIL_TEST_TO);
    assert.equal(mail.cc, undefined);
    assert.equal(mail.bcc, undefined);
    assert.equal(mail.replyTo, env.MAIL_TEST_TO);
    assert.match(mail.subject, /^\[TEST\]/);
  }
});

test('online: la notifica interna ha CCN, la copia va solo all’utente e Reply-To è corretto', () => {
  const live = contactMailConfig({ ...env, MAIL_MODE: 'live' });
  const submission = lead();
  const internal = contactEmail(submission, 'internal', live, logo);
  assert.equal(internal.to, env.CONTACT_MAIL_TO);
  assert.equal(internal.bcc, env.CONTACT_MAIL_BCC);
  assert.equal(internal.replyTo, submission.email);
  const courtesy = contactEmail(submission, 'courtesy', live, logo);
  assert.equal(courtesy.to, submission.email);
  assert.equal(courtesy.bcc, undefined);
  assert.equal(courtesy.replyTo, 'segreteria@agtrustees.it');
});

test('collaudo online: tutte le email e le risposte arrivano solo all’assistenza, senza copie', () => {
  const review = contactMailConfig({ ...env, MAIL_MODE: 'test', MAIL_TEST_TO: 'assistenzaweb@happyminds.it', CONTACT_MAIL_TO: 'assistenzaweb@happyminds.it', CONTACT_MAIL_BCC: '' });
  const submission = lead();
  const internal = contactEmail(submission, 'internal', review, logo);
  const courtesy = contactEmail(submission, 'courtesy', review, logo);
  assert.equal(internal.to, 'assistenzaweb@happyminds.it');
  assert.equal(internal.bcc, undefined);
  assert.equal(internal.cc, undefined);
  assert.equal(courtesy.to, 'assistenzaweb@happyminds.it');
  assert.equal(courtesy.bcc, undefined);
  assert.equal(internal.replyTo, 'assistenzaweb@happyminds.it');
  assert.equal(courtesy.replyTo, 'assistenzaweb@happyminds.it');
});

test('HTML IT/EN: testi utente protetti, logo incorporato, home definitiva e riepilogo completo', () => {
  for (const lang of ['it', 'en']) {
    const mail = contactEmail({ ...lead(), lang }, 'courtesy', config, logo);
    assert.equal(mail.html.includes('<script>Test</script>'), false);
    assert.match(mail.html, /&lt;script&gt;Test&lt;\/script&gt;/);
    assert.match(mail.html, /href="https:\/\/agtrustees.it\/"/);
    assert.match(mail.html, /src="cid:ag-trustees-logo"/);
    assert.equal(mail.attachments[0].content.equals(logo), true);
    assert.match(mail.text, lang === 'en' ? /sent automatically/ : /inviata automaticamente/);
    assert.equal(mail.subject, lang === 'en' ? '[TEST] We have received your enquiry | AG Trustees' : '[TEST] Abbiamo ricevuto la sua richiesta | AG Trustees');
    if (lang === 'it') assert.match(mail.text, /Abbiamo ricevuto correttamente la sua richiesta\. Il nostro team esaminerà le informazioni condivise e la ricontatterà il prima possibile\./);
  }
});

test('la scadenza dell’attesa SMTP lascia l’esito da verificare senza ripetere l’invio', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const r = runtime(); const submission = lead(); let entered;
  const started = new Promise(resolve => { entered = resolve; });
  const result = deliverContact(submission, script, '127.0.0.1', config, {
    fetch: bridge(r), sender: async () => { entered(); return new Promise(() => {}); },
  });
  await started;
  t.mock.timers.tick(9000);
  assert.equal((await result).code, 'email_pending');
  assert.equal(r.sheetRows('Invii email')[1][3], 'da verificare');
});

test('SMTP: anche il salvataggio diretto rifiuta una lista di destinatari nel campo email', () => {
  for (const email of ['prima,seconda@example.com', 'prima;seconda@example.com', '<utente@example.com>']) {
    const r = runtime();
    assert.equal(r.action({ lead: { ...lead(), email }, rateKey: 'a'.repeat(64) }).ok, false);
    assert.equal(r.rows.length, 1);
  }
});

test('salvataggio e due email: un nuovo tentativo non duplica righe o invii', async () => {
  const r = runtime(); const submission = lead(); let sent = [];
  const dependencies = { fetch: bridge(r), sender: async kind => { sent.push(kind); return { state: 'sent', code: 'accepted' }; } };
  assert.deepEqual(await deliverContact(submission, script, '127.0.0.1', config, dependencies), { ok: true });
  assert.deepEqual(await deliverContact(submission, script, '127.0.0.1', config, dependencies), { ok: true });
  assert.deepEqual(sent.sort(), ['courtesy', 'internal']);
  assert.equal(r.rows.length, 2);
  assert.equal(r.sheetRows('Invii email').length, 3);
});

test('invio parziale: al secondo tentativo parte solo l’email rifiutata', async () => {
  const r = runtime(); const submission = lead(); const sent = [];
  let fail = true;
  const dependencies = { fetch: bridge(r), sender: async kind => {
    sent.push(kind); return { state: fail && kind === 'courtesy' ? 'retry' : 'sent', code: fail && kind === 'courtesy' ? 'smtp_451' : 'accepted' };
  } };
  assert.equal((await deliverContact(submission, script, '127.0.0.1', config, dependencies)).code, 'email_failed');
  fail = false;
  assert.deepEqual(await deliverContact(submission, script, '127.0.0.1', config, dependencies), { ok: true });
  assert.deepEqual(sent, ['internal', 'courtesy', 'courtesy']);
});

test('interruzione dopo l’accettazione SMTP: non si reinvia alla cieca e non si conferma il successo', async () => {
  const r = runtime(); const submission = lead(); let sent = 0;
  const dependencies = { fetch: bridge(r), sender: async () => { sent++; return { state: 'review', code: 'unconfirmed' }; } };
  assert.equal((await deliverContact(submission, script, '127.0.0.1', config, dependencies)).code, 'email_pending');
  assert.equal((await deliverContact(submission, script, '127.0.0.1', config, dependencies)).code, 'email_pending');
  assert.equal(sent, 2);
});

test('due richieste simultanee con lo stesso ID non ottengono lo stesso invio', async () => {
  const r = runtime(); const submission = lead(); let release; let entered;
  const started = new Promise(resolve => { entered = resolve; });
  const hold = new Promise(resolve => { release = resolve; });
  const first = deliverContact(submission, script, '127.0.0.1', config, { fetch: bridge(r), sender: async () => { entered(); await hold; return { state: 'sent', code: 'accepted' }; } });
  await started;
  let duplicates = 0;
  const second = await deliverContact(submission, script, '127.0.0.1', config, { fetch: bridge(r), sender: async () => { duplicates++; return { state: 'sent', code: 'accepted' }; } });
  assert.equal(second.code, 'email_pending'); assert.equal(duplicates, 0);
  release(); assert.deepEqual(await first, { ok: true });
});

test('un ID già salvato con contenuti diversi non può inviare nuove email', async () => {
  const r = runtime(); const submission = lead();
  const dependencies = { fetch: bridge(r), sender: async () => ({ state: 'sent', code: 'accepted' }) };
  await deliverContact(submission, script, '127.0.0.1', config, dependencies);
  assert.equal((await deliverContact({ ...submission, email: 'altro@example.com' }, script, '127.0.0.1', config, dependencies)).code, 'save_failed');
});

test('registro non aggiornabile e ricevute non valide non producono conferme', async () => {
  const r = runtime(); const submission = lead(); let calls = 0;
  const result = await deliverContact(submission, script, '127.0.0.1', config, {
    fetch: async (...args) => { if (++calls > 1) throw new Error('Rete'); return bridge(r)(...args); },
    sender: async () => ({ state: 'sent', code: 'accepted' }),
  });
  assert.equal(result.code, 'email_pending');
  const pending = await deliverContact(submission, script, '127.0.0.1', config, { fetch: bridge(r), sender: async () => { throw new Error('Non deve inviare'); } });
  assert.equal(pending.code, 'email_pending');
});
