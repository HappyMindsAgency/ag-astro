import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { validateNewsletterSubmission } from '../src/lib/newsletter-leads.ts';
import { POST } from '../src/pages/api/newsletter.ts';
import { scriptRuntime } from './helpers/google-script-runtime.mjs';

const sample = () => ({
  id: randomUUID(), firstName: 'Iscrizione', lastName: 'di prova', email: 'test@example.com',
  city: 'Ravenna', profession: 'Altro', privacy: true, sourcePage: '/newsletter/', lang: 'it',
  website: '', startedAt: Date.now() - 5000,
});
const source = readFileSync(new URL('../integrations/google-apps-script/newsletter.gs', import.meta.url), 'utf8');
const headers = ['Data e ora', 'Email', 'Nome', 'Cognome', 'Città', 'Professione', 'Privacy accettata', 'Lingua', 'ID iscrizione'];
const runtime = options => scriptRuntime({ source, headers, secretProperty: 'NEWSLETTER_SECRET', ...options });

test('newsletter: tutti i campi, il consenso, la provenienza e l’antispam sono controllati sul server', () => {
  for (const change of [
    { firstName: '' }, { lastName: ' ' }, { city: '' }, { email: 'non-valida' }, { email: 'x'.repeat(255) },
    { profession: 'Valore non previsto' }, { privacy: false }, { sourcePage: '/contatti/' }, { lang: 'en' },
    { website: 'spam' }, { startedAt: Date.now() }, { id: 'non-valido' },
  ]) assert.equal(validateNewsletterSubmission({ ...sample(), ...change }).ok, false);
  const en = { ...sample(), lang: 'en', sourcePage: '/en/newsletter/' };
  assert.equal(validateNewsletterSubmission(en).ok, true);
  assert.equal(validateNewsletterSubmission({ ...sample(), city: ' Ravenna ' }).lead.city, 'Ravenna');
});

test('newsletter: il foglio conserva campi e consenso nella lingua dell’iscrizione', () => {
  const r = runtime();
  const lead = { ...sample(), lang: 'en', sourcePage: '/en/newsletter/' };
  assert.deepEqual(r.send(lead), { ok: true, id: lead.id });
  assert.equal(r.rows[1][1], "'test@example.com");
  assert.equal(r.rows[1][2], "'Iscrizione");
  assert.equal(r.rows[1][6], 'Sì');
  assert.deepEqual(Array.from(r.rows[1]).slice(7), ['en', lead.id]);
});

test('newsletter: un nuovo tentativo dopo un’interruzione non duplica l’iscrizione', () => {
  const r = runtime({ failFlushOnce: true });
  const lead = sample();
  assert.deepEqual(r.send(lead), { ok: false, code: 'write_failed' });
  assert.deepEqual(r.send(lead), { ok: true, id: lead.id });
  assert.equal(r.rows.length, 2);
});

test('newsletter: errori di scrittura, colonne spostate e script occupato non confermano un salvataggio', () => {
  for (const options of [{ failWrite: true }, { alteredHeader: true }, { busy: true }]) {
    const r = runtime(options);
    assert.equal(r.send(sample()).ok, false);
    assert.equal(r.rows.length, 1);
    assert.equal(r.locked(), false);
  }
});

test('newsletter: chiave, consenso e campi non validi impediscono scritture dirette allo script', () => {
  const r = runtime();
  assert.equal(r.send(sample(), 'chiave-errata').ok, false);
  assert.equal(r.accesses(), 0);
  for (const change of [{ privacy: false }, { email: 'non-valida' }, { profession: 'non-prevista' }, { city: '' }]) {
    assert.equal(r.send({ ...sample(), ...change }).ok, false);
  }
  assert.equal(r.rows.length, 1);
});

test('newsletter: i testi simili a formule rimangono testo', () => {
  const r = runtime();
  assert.equal(r.send({ ...sample(), firstName: '=1+1', city: "'Ravenna" }).ok, true);
  assert.equal(r.rows[1][2], "'=1+1");
  assert.equal(r.rows[1][4], "''Ravenna");
});

test('newsletter: il limite per email è condiviso fra IP e non blocca i tentativi già salvati', () => {
  const r = runtime();
  const first = sample();
  assert.equal(r.send(first).ok, true);
  for (let i = 0; i < 4; i++) assert.equal(r.send(sample()).ok, true);
  assert.equal(r.send({ ...sample(), email: 'TEST@EXAMPLE.COM' }, undefined, 'b'.repeat(64)).code, 'rate_limited');
  assert.equal(r.send(first).ok, true);
  r.advance(600000);
  assert.equal(r.send(sample()).ok, true);
});

const context = (data = sample(), headers = {}) => ({
  request: new Request('http://localhost/api/newsletter', { method: 'POST', body: JSON.stringify(data), headers: {
    'Content-Type': 'application/json', Host: '127.0.0.1:4321', Origin: 'http://127.0.0.1:4321', 'Sec-Fetch-Site': 'same-origin', ...headers,
  } }),
  url: new URL('http://localhost/api/newsletter'), clientAddress: '127.0.0.1',
});

test('newsletter: la route rifiuta origine esterna, invio precoce e consenso mancante', async () => {
  assert.equal((await POST(context(sample(), { Origin: 'https://altro.example' }))).status, 403);
  assert.equal((await POST(context({ ...sample(), privacy: false }))).status, 400);
  assert.equal((await POST(context({ ...sample(), startedAt: Date.now() }))).status, 400);
});

test('newsletter: la conferma richiede la ricevuta corretta e la chiave resta sul server', async () => {
  const old = { fetch, url: process.env.NEWSLETTER_SCRIPT_URL, secret: process.env.NEWSLETTER_SCRIPT_SECRET };
  process.env.NEWSLETTER_SCRIPT_URL = 'https://script.google.com/macros/s/prova/exec';
  process.env.NEWSLETTER_SCRIPT_SECRET = 'chiave-fittizia-di-almeno-32-caratteri';
  try {
    const lead = sample();
    globalThis.fetch = async (_, options) => {
      const sent = JSON.parse(options.body);
      assert.equal(sent.lead.email, lead.email);
      assert.match(sent.rateKey, /^[a-f0-9]{64}$/);
      return Response.json({ ok: true, id: sent.lead.id });
    };
    const response = await POST(context(lead));
    assert.deepEqual(await response.json(), { ok: true, id: lead.id });
    globalThis.fetch = async () => Response.json({ ok: true, id: 'id-errato' });
    assert.equal((await POST(context())).status, 502);
    globalThis.fetch = async () => Response.json({ ok: false, code: 'rate_limited', retryAfter: 300 });
    assert.equal((await POST(context())).status, 429);
  } finally {
    globalThis.fetch = old.fetch;
    for (const [name, value] of [['NEWSLETTER_SCRIPT_URL', old.url], ['NEWSLETTER_SCRIPT_SECRET', old.secret]]) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});
