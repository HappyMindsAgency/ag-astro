import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { validateContactSubmission, saveContactLead, validContactScriptConfig } from '../src/lib/contact-leads.ts';

const now = 1800000000000;
const input = () => ({
  id: 'b16a7c26-d476-46ab-bab3-5834e87e3eb0', name: 'Contatto di prova', email: 'test@example.com',
  phone: '', profile: '', message: '', privacy: true, sourcePage: '/contatti/', lang: 'it', website: '', startedAt: now - 5000,
});
const config = { url: 'https://script.google.com/macros/s/deployment-fittizio/exec', secret: 'segreto-fittizio-di-almeno-32-caratteri' };

test('tutte le pagine previste conservano percorso e lingua', () => {
  for (const [sourcePage, lang] of [['/chi-siamo/', 'it'], ['/chi-siamo/team/', 'it'], ['/servizi/', 'it'], ['/contatti/', 'it'], ['/en/about-us/', 'en'], ['/en/about-us/team/', 'en'], ['/en/services/', 'en'], ['/en/contact-us/', 'en']]) {
    const result = validateContactSubmission({ ...input(), sourcePage, lang }, now);
    assert.equal(result.ok, true);
    assert.equal(result.lead.sourcePage, sourcePage);
    assert.equal(result.lead.lang, lang);
  }
});

test('i campi obbligatori non possono essere aggirati inviando direttamente al server', () => {
  for (const change of [{ name: '' }, { email: 'non-valida' }, { privacy: false }, { name: [] }, { sourcePage: '/newsletter/' }, { lang: 'en' }, { id: 'non-valido' }]) {
    assert.equal(validateContactSubmission({ ...input(), ...change }, now).ok, false);
  }
});

test('il campo antispam e il tempo minimo sono controllati anche sul server', () => {
  assert.equal(validateContactSubmission({ ...input(), website: 'spam' }, now).code, 'spam');
  assert.equal(validateContactSubmission({ ...input(), startedAt: now - 2999 }, now).code, 'too_fast');
  assert.equal(validateContactSubmission({ ...input(), startedAt: now + 5000 }, now).ok, false);
  assert.equal(validateContactSubmission({ ...input(), startedAt: undefined }, now).ok, false);
  assert.equal(validateContactSubmission({ ...input(), startedAt: now - 3000 }, now).ok, true);
});

test('i campi facoltativi possono essere vuoti e i valori eccessivi vengono rifiutati', () => {
  assert.equal(validateContactSubmission(input(), now).ok, true);
  assert.equal(validateContactSubmission({ ...input(), message: 'a'.repeat(5001) }, now).ok, false);
});

test('la configurazione accetta solo un deployment Apps Script e una chiave non vuota', () => {
  assert.equal(validContactScriptConfig(config), true);
  assert.equal(validContactScriptConfig({ ...config, url: 'https://altro.example/exec' }), false);
  assert.equal(validContactScriptConfig({ ...config, url: config.url.replace('/exec', '/dev') }), false);
  assert.equal(validContactScriptConfig({ ...config, secret: '' }), false);
});

test('il salvataggio riesce solo con una ricevuta esplicita della stessa richiesta', async () => {
  const lead = validateContactSubmission(input(), now).lead;
  for (const receipt of [{}, { ok: false }, { ok: true, id: 'un-altro-id' }]) {
    assert.deepEqual(await saveContactLead(lead, config, '127.0.0.1', async () => Response.json(receipt)), { ok: false, code: 'save_failed' });
  }
  assert.deepEqual(await saveContactLead(lead, config, '127.0.0.1', async (url, options) => {
    assert.equal(url, config.url);
    assert.deepEqual(JSON.parse(options.body), { secret: config.secret, lead, rateKey: createHmac('sha256', config.secret).update('127.0.0.1').digest('hex') });
    return Response.json({ ok: true, id: lead.id });
  }), { ok: true });
});

test('errori HTTP, risposte non JSON e interruzioni non producono una conferma', async () => {
  const lead = validateContactSubmission(input(), now).lead;
  for (const send of [async () => new Response('Errore', { status: 500 }), async () => new Response('<html>Login</html>'), async () => { throw new Error('Connessione interrotta'); }]) {
    assert.deepEqual(await saveContactLead(lead, config, '127.0.0.1', send), { ok: false, code: 'save_failed' });
  }
});

test('il limite viene riconosciuto solo con un intervallo di attesa valido', async () => {
  const lead = validateContactSubmission(input(), now).lead;
  for (const retryAfter of [0, -1, 601, 1.5, '600', null]) {
    assert.deepEqual(await saveContactLead(lead, config, '127.0.0.1', async () => Response.json({ ok: false, code: 'rate_limited', retryAfter })), { ok: false, code: 'save_failed' });
  }
  assert.deepEqual(await saveContactLead(lead, config, '127.0.0.1', async () => Response.json({ ok: false, code: 'rate_limited', retryAfter: 600 })), { ok: false, code: 'rate_limited', retryAfter: 600 });
});

test('gli indirizzi IP non validi non vengono inoltrati a Google', async () => {
  let sent = false;
  const result = await saveContactLead(validateContactSubmission(input(), now).lead, config, 'non-un-ip', async () => { sent = true; return Response.json({ ok: true }); });
  assert.equal(result.ok, false);
  assert.equal(sent, false);
});
