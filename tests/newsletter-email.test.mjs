import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { mailConfig } from '../src/lib/mail.ts';
import { newsletterEmail } from '../src/lib/newsletter-email.ts';
import { deliverNewsletter } from '../src/lib/lead-delivery.ts';
import { scriptRuntime } from './helpers/google-script-runtime.mjs';

const sample = () => ({ id: randomUUID(), firstName: 'Nome <test>', lastName: 'Iscritto', email: 'iscritto@example.com', city: 'Ravenna', profession: 'Altro', privacy: true, sourcePage: '/newsletter/', lang: 'it' });
const env = { MAIL_MODE: 'test', SMTP_HOST: 'smtp.example.com', SMTP_USER: 'smtp@example.com', SMTP_PASSWORD: 'segreto-fittizio', MAIL_FROM: 'no-reply@example.com', MAIL_TEST_TO: 'solo-test@example.com' };
const config = mailConfig(env);
const script = { url: 'https://script.google.com/macros/s/newsletter-prova/exec', secret: 'segreto-fittizio-di-almeno-32-caratteri' };
const logo = readFileSync(new URL('../public/assets/brand/ag-logo-orizzontale.png', import.meta.url));
const source = readFileSync(new URL('../integrations/google-apps-script/newsletter.gs', import.meta.url), 'utf8');
const headers = ['Data e ora', 'Email', 'Nome', 'Cognome', 'Città', 'Professione', 'Privacy accettata', 'Lingua', 'ID iscrizione'];
const runtime = () => scriptRuntime({ source, headers, secretProperty: 'NEWSLETTER_SECRET' });
const bridge = r => async (_, options) => Response.json(r.action({ ...JSON.parse(options.body), secret: 'segreto-fittizio-test' }));

test('newsletter: testo italiano esatto, privacy localizzata, logo e nome protetto', () => {
  const mail = newsletterEmail(sample(), config, logo);
  assert.equal(mail.subject, '[TEST] Iscrizione confermata | AG Informa');
  assert.match(mail.text, /grazie per la sua iscrizione ad AG Informa, la newsletter di AG Trustees\./);
  assert.match(mail.text, /Da oggi riceverà una selezione di notizie, approfondimenti e aggiornamenti su eventi dedicati al mondo dei trust, della fiscalità e della gestione patrimoniale\./);
  assert.match(mail.text, /Un caro saluto,\nAG Trustees/);
  assert.match(mail.html, /Gentile Nome &lt;test&gt;,/);
  assert.match(mail.html, /href="https:\/\/agtrustees.it\/privacy-policy\/"/);
  assert.equal(mail.attachments[0].content.equals(logo), true);
  const en = newsletterEmail({ ...sample(), lang: 'en', sourcePage: '/en/newsletter/' }, config, logo);
  assert.equal(en.subject, '[TEST] Subscription confirmed | AG Informa');
  assert.match(en.html, /href="https:\/\/agtrustees.it\/en\/privacy-policy\/"/);
  assert.match(en.html, /Thank you for subscribing to AG Informa/);
});

test('newsletter: in prova solo il destinatario autorizzato, online solo l’iscritto, senza copie', () => {
  const lead = sample();
  const trial = newsletterEmail(lead, config, logo);
  assert.equal(trial.to, env.MAIL_TEST_TO);
  assert.equal(trial.replyTo, env.MAIL_TEST_TO);
  const live = newsletterEmail(lead, mailConfig({ ...env, MAIL_MODE: 'live' }), logo);
  assert.equal(live.to, lead.email);
  for (const mail of [trial, live]) { assert.equal(mail.bcc, undefined); assert.equal(mail.cc, undefined); }
});

test('newsletter: una conferma dopo il salvataggio, senza duplicati al nuovo tentativo', async () => {
  const r = runtime(); const lead = sample(); const sent = [];
  const deps = { fetch: bridge(r), sender: async kind => { assert.equal(r.rows.length, 2); sent.push(kind); return { state: 'sent', code: 'accepted' }; } };
  assert.deepEqual(await deliverNewsletter(lead, script, '127.0.0.1', config, deps), { ok: true });
  assert.deepEqual(await deliverNewsletter(lead, script, '127.0.0.1', config, deps), { ok: true });
  assert.deepEqual(sent, ['welcome']);
  assert.equal(r.rows.length, 2);
  assert.equal(r.sheetRows('Invii email').length, 2);
});

test('newsletter: un invio rifiutato può essere ritentato senza duplicare l’iscrizione', async () => {
  const r = runtime(); const lead = sample(); let state = 'retry';
  const deps = { fetch: bridge(r), sender: async () => ({ state, code: state === 'retry' ? 'smtp_451' : 'accepted' }) };
  assert.equal((await deliverNewsletter(lead, script, '127.0.0.1', config, deps)).code, 'email_failed');
  state = 'sent';
  assert.deepEqual(await deliverNewsletter(lead, script, '127.0.0.1', config, deps), { ok: true });
  assert.equal(r.rows.length, 2);
});

test('newsletter: esito incerto e registro non confermato non reinviano la stessa email', async () => {
  const r = runtime(); const lead = sample(); let sent = 0;
  const deps = { fetch: bridge(r), sender: async () => { sent++; return { state: 'review', code: 'unconfirmed' }; } };
  assert.equal((await deliverNewsletter(lead, script, '127.0.0.1', config, deps)).code, 'email_pending');
  assert.equal((await deliverNewsletter(lead, script, '127.0.0.1', config, deps)).code, 'email_pending');
  assert.equal(sent, 1);
});

test('newsletter: modificare l’indirizzo mantenendo lo stesso ID non invia una nuova email', async () => {
  const r = runtime(); const lead = sample(); let sent = 0;
  const deps = { fetch: bridge(r), sender: async () => { sent++; return { state: 'sent', code: 'accepted' }; } };
  await deliverNewsletter(lead, script, '127.0.0.1', config, deps);
  assert.equal((await deliverNewsletter({ ...lead, email: 'altro@example.com' }, script, '127.0.0.1', config, deps)).code, 'save_failed');
  assert.equal(sent, 1);
});

test('newsletter: salvataggio fallito o ricevuta incompleta impediscono l’invio', async () => {
  for (const fetch of [async () => { throw new Error('Rete'); }, async () => Response.json({ ok: true, id: 'errato' })]) {
    let sent = false;
    assert.equal((await deliverNewsletter(sample(), script, '127.0.0.1', config, { fetch, sender: async () => { sent = true; return { state: 'sent', code: 'accepted' }; } })).code, 'save_failed');
    assert.equal(sent, false);
  }
});

test('il registro condiviso non reinvia stati alterati e non accetta tipi email di un altro modulo', async () => {
  const r = runtime(); const lead = sample();
  const attempt = randomUUID();
  r.action({ lead, rateKey: 'a'.repeat(64), delivery: { mode: 'test', attempt } });
  const rows = r.sheetRows('Invii email'); rows[1][3] = 'stato modificato';
  let sent = false;
  const result = await deliverNewsletter(lead, script, '127.0.0.1', config, { fetch: bridge(r), sender: async () => { sent = true; return { state: 'sent', code: 'accepted' }; } });
  assert.equal(result.code, 'email_pending'); assert.equal(sent, false);
  assert.equal(r.action({ action: 'mail_result', id: lead.id, delivery: { mode: 'test', attempt }, outcomes: [{ kind: 'internal', state: 'sent', code: 'accepted' }] }).ok, false);
});
