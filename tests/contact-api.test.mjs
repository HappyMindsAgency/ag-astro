import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../src/pages/api/contatti.ts';

const data = () => ({
  id: 'b16a7c26-d476-46ab-bab3-5834e87e3eb0', name: 'Test', email: 'test@example.com',
  phone: '', profile: '', message: 'Test', privacy: true, sourcePage: '/contatti/', lang: 'it',
  website: '', startedAt: Date.now() - 5000,
});
const context = (body = JSON.stringify(data()), headers = {}) => ({
  request: new Request('http://localhost/api/contatti', {
    method: 'POST', body, duplex: 'half',
    headers: { 'Content-Type': 'application/json', Host: '127.0.0.1:4321', Origin: 'http://127.0.0.1:4321', 'Sec-Fetch-Site': 'same-origin', ...headers },
  }),
  url: new URL('http://localhost/api/contatti'), clientAddress: '127.0.0.1',
});

test('la route rifiuta origine esterna, tipo errato, JSON malformato e campi non validi', async () => {
  for (const [ctx, status] of [
    [context(undefined, { Origin: 'https://altro.example' }), 403],
    [context(undefined, { 'Sec-Fetch-Site': 'cross-site' }), 403],
    [context(undefined, { 'Content-Type': 'text/plain' }), 415],
    [context('{'), 400],
    [context(JSON.stringify({ ...data(), privacy: false })), 400],
    [context(undefined, { 'Content-Length': '32001' }), 413],
  ]) assert.equal((await POST(ctx)).status, status);
});

test('una richiesta chunked troppo grande viene fermata prima di leggerla tutta', async () => {
  let sent = 0;
  let canceled = false;
  const stream = new ReadableStream({
    pull(controller) { sent += 4096; controller.enqueue(new Uint8Array(4096)); },
    cancel() { canceled = true; },
  }, { highWaterMark: 0 });
  const response = await POST(context(stream));
  assert.equal(response.status, 413);
  assert.equal(canceled, true);
  assert.equal(sent, 32768);
});

test('la route propaga ricevuta e limite senza inviare IP in chiaro a Google', async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.CONTACT_SCRIPT_URL;
  const originalSecret = process.env.CONTACT_SCRIPT_SECRET;
  process.env.CONTACT_SCRIPT_URL = 'https://script.google.com/macros/s/test-fittizio/exec';
  process.env.CONTACT_SCRIPT_SECRET = 'segreto-fittizio-test-di-almeno-32-caratteri';
  try {
    let sent;
    globalThis.fetch = async (_, options) => {
      sent = JSON.parse(options.body);
      return Response.json({ ok: true, id: sent.lead.id });
    };
    const success = await POST(context());
    assert.equal(success.status, 200);
    assert.equal((await success.json()).id, data().id);
    assert.match(sent.rateKey, /^[a-f0-9]{64}$/);
    assert.equal(JSON.stringify(sent).includes('127.0.0.1'), false);

    globalThis.fetch = async () => Response.json({ ok: false, code: 'rate_limited', retryAfter: 321 });
    const limited = await POST(context());
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get('Retry-After'), '321');

    globalThis.fetch = async () => Response.json({ ok: true, id: 'id-errato' });
    assert.equal((await POST(context())).status, 502);
    globalThis.fetch = async () => { throw new Error('Rete interrotta'); };
    assert.equal((await POST(context())).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.CONTACT_SCRIPT_URL;
    else process.env.CONTACT_SCRIPT_URL = originalUrl;
    if (originalSecret === undefined) delete process.env.CONTACT_SCRIPT_SECRET;
    else process.env.CONTACT_SCRIPT_SECRET = originalSecret;
  }
});
