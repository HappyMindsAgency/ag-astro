import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

export interface GoogleScriptConfig { url: string; secret: string; }

export function validGoogleScriptConfig(config: GoogleScriptConfig): boolean {
  try {
    const url = new URL(config.url);
    return url.origin === 'https://script.google.com' && /^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname)
      && !url.search && !url.hash && config.secret.length >= 32;
  } catch {
    return false;
  }
}

type SaveResult = { ok: true } | { ok: false; code: 'save_failed' } | { ok: false; code: 'rate_limited'; retryAfter: number };

export async function saveFormLead(lead: { id: string }, config: GoogleScriptConfig, address: string, send: typeof fetch = fetch): Promise<SaveResult> {
  if (!validGoogleScriptConfig(config) || !isIP(address)) return { ok: false, code: 'save_failed' };
  try {
    const rateKey = createHmac('sha256', config.secret).update(address).digest('hex');
    const response = await send(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: config.secret, lead, rateKey }),
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    if (!response.ok) return { ok: false, code: 'save_failed' };
    const receipt = await response.json();
    if (receipt?.ok === true && receipt.id === lead.id) return { ok: true };
    if (receipt?.ok === false && receipt.code === 'rate_limited'
      && Number.isInteger(receipt.retryAfter) && receipt.retryAfter > 0 && receipt.retryAfter <= 600) {
      return { ok: false, code: 'rate_limited', retryAfter: receipt.retryAfter };
    }
  } catch {
    // Nessuna conferma senza una ricevuta valida, anche in caso di timeout.
  }
  return { ok: false, code: 'save_failed' };
}
