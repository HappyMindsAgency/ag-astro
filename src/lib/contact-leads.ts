import { routes, type Locale } from './utility-customslug.ts';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

export const contactFieldLimits = { name: 200, email: 254, phone: 80, profile: 200, message: 5000 } as const;

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile: string;
  message: string;
  privacy: true;
  sourcePage: string;
  lang: Locale;
}

type ValidationResult = { ok: true; lead: ContactLead } | { ok: false; code: 'invalid_data' | 'spam' | 'too_fast' };

const contactRoutes = ['about', 'team', 'services', 'contact'] as const;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateContactSubmission(input: unknown, now = Date.now()): ValidationResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, code: 'invalid_data' };
  const data = input as Record<string, unknown>;
  if (typeof data.website !== 'string' || data.website !== '') return { ok: false, code: 'spam' };
  if (typeof data.startedAt !== 'number' || !Number.isFinite(data.startedAt) || data.startedAt <= 0) {
    return { ok: false, code: 'invalid_data' };
  }
  if (now - data.startedAt < 3000) return { ok: false, code: 'too_fast' };

  for (const [field, maxLength] of Object.entries(contactFieldLimits)) {
    if (typeof data[field] !== 'string' || data[field].length > maxLength) return { ok: false, code: 'invalid_data' };
  }
  const name = (data.name as string).trim();
  const email = (data.email as string).trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data.privacy !== true) {
    return { ok: false, code: 'invalid_data' };
  }
  if (typeof data.id !== 'string' || !uuid.test(data.id) || typeof data.sourcePage !== 'string') {
    return { ok: false, code: 'invalid_data' };
  }
  const sourcePage = data.sourcePage.replace(/\/*$/, '/');
  const lang = data.lang;
  if ((lang !== 'it' && lang !== 'en') || !contactRoutes.some(key => routes[key][lang] === sourcePage)) {
    return { ok: false, code: 'invalid_data' };
  }
  return {
    ok: true,
    lead: {
      id: data.id, name, email, phone: (data.phone as string).trim(), profile: (data.profile as string).trim(),
      message: (data.message as string).trim(), privacy: true, sourcePage, lang,
    },
  };
}

export interface ContactScriptConfig { url: string; secret: string; }

export function validContactScriptConfig(config: ContactScriptConfig): boolean {
  try {
    const url = new URL(config.url);
    return url.origin === 'https://script.google.com' && /^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname)
      && !url.search && !url.hash && config.secret.length >= 32;
  } catch {
    return false;
  }
}

type SaveResult = { ok: true } | { ok: false; code: 'save_failed' } | { ok: false; code: 'rate_limited'; retryAfter: number };

export async function saveContactLead(lead: ContactLead, config: ContactScriptConfig, address: string, send: typeof fetch = fetch): Promise<SaveResult> {
  if (!validContactScriptConfig(config) || !isIP(address)) return { ok: false, code: 'save_failed' };
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
