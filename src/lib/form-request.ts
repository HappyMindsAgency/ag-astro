export const formReply = (status: number, body: object) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export async function readFormRequest(request: Request, url: URL): Promise<{ ok: true; input: unknown } | { ok: false; response: Response }> {
  const invalid = (status: number, body: object) => ({ ok: false as const, response: formReply(status, body) });
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') return invalid(403, { ok: false, code: 'invalid_origin' });
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      // L'adapter può normalizzare Astro.url a localhost: per questo confronto usiamo Host.
      const source = new URL(origin);
      if (!['http:', 'https:'].includes(source.protocol) || source.host !== (request.headers.get('host') ?? url.host)) {
        return invalid(403, { ok: false, code: 'invalid_origin' });
      }
    } catch {
      return invalid(403, { ok: false, code: 'invalid_origin' });
    }
  }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return invalid(415, { ok: false, code: 'invalid_request' });
  }
  if (Number(request.headers.get('content-length')) > 32000) return invalid(413, { ok: false, code: 'invalid_request' });

  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return invalid(400, { ok: false, code: 'invalid_request' });
    const decoder = new TextDecoder();
    let size = 0;
    let body = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32000) {
        await reader.cancel();
        return invalid(413, { ok: false, code: 'invalid_request' });
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    input = JSON.parse(body);
  } catch {
    return invalid(400, { ok: false, code: 'invalid_request' });
  }
  return { ok: true, input };
}
