import type { APIRoute } from 'astro';
import { saveContactLead, validContactScriptConfig, validateContactSubmission } from '../../lib/contact-leads.ts';

const reply = (status: number, body: object) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export const POST: APIRoute = async (context) => {
  const { request, url } = context;
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') return reply(403, { ok: false, code: 'invalid_origin' });
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      // L'adapter può normalizzare Astro.url a localhost: per questo confronto usiamo Host.
      const source = new URL(origin);
      if (!['http:', 'https:'].includes(source.protocol) || source.host !== (request.headers.get('host') ?? url.host)) {
        return reply(403, { ok: false, code: 'invalid_origin' });
      }
    } catch {
      return reply(403, { ok: false, code: 'invalid_origin' });
    }
  }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return reply(415, { ok: false, code: 'invalid_request' });
  }
  if (Number(request.headers.get('content-length')) > 32000) return reply(413, { ok: false, code: 'invalid_request' });

  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { ok: false, code: 'invalid_request' });
    const decoder = new TextDecoder();
    let size = 0;
    let body = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32000) {
        await reader.cancel();
        return reply(413, { ok: false, code: 'invalid_request' });
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    input = JSON.parse(body);
  } catch {
    return reply(400, { ok: false, code: 'invalid_request' });
  }
  const result = validateContactSubmission(input);
  if (!result.ok) return reply(400, { ok: false, code: result.code });

  const config = {
    url: process.env.CONTACT_SCRIPT_URL || import.meta.env.CONTACT_SCRIPT_URL || '',
    secret: process.env.CONTACT_SCRIPT_SECRET || import.meta.env.CONTACT_SCRIPT_SECRET || '',
  };
  if (!validContactScriptConfig(config)) return reply(503, { ok: false, code: 'unavailable' });
  let address: string;
  try {
    address = context.clientAddress;
  } catch {
    return reply(503, { ok: false, code: 'unavailable' });
  }
  const saved = await saveContactLead(result.lead, config, address);
  if (saved.ok) return reply(200, { ok: true, id: result.lead.id });
  if (saved.code === 'rate_limited') {
    const response = reply(429, saved);
    response.headers.set('Retry-After', String(saved.retryAfter));
    return response;
  }
  return reply(502, { ok: false, code: 'save_failed' });
};
