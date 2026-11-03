import { routes, type Locale } from './utility-customslug.ts';

export const newsletterFieldLimits = { firstName: 100, lastName: 100, email: 254, city: 150 } as const;
export const newsletterProfessions = ['Notaio', 'Commercialista', 'Avvocato', 'Altro'] as const;

export interface NewsletterLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  profession: typeof newsletterProfessions[number];
  privacy: true;
  sourcePage: string;
  lang: Locale;
}

type ValidationResult = { ok: true; lead: NewsletterLead } | { ok: false; code: 'invalid_data' | 'spam' | 'too_fast' };

export function validateNewsletterSubmission(input: unknown, now = Date.now()): ValidationResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, code: 'invalid_data' };
  const data = input as Record<string, unknown>;
  if (typeof data.website !== 'string' || data.website !== '') return { ok: false, code: 'spam' };
  if (typeof data.startedAt !== 'number' || !Number.isFinite(data.startedAt) || data.startedAt <= 0) return { ok: false, code: 'invalid_data' };
  if (now - data.startedAt < 3000) return { ok: false, code: 'too_fast' };
  if (typeof data.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.id)) return { ok: false, code: 'invalid_data' };

  for (const [field, limit] of Object.entries(newsletterFieldLimits)) {
    if (typeof data[field] !== 'string' || data[field].length > limit || !data[field].trim()) return { ok: false, code: 'invalid_data' };
  }
  const email = (data.email as string).trim();
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(email) || data.privacy !== true) return { ok: false, code: 'invalid_data' };
  if (!newsletterProfessions.some(value => value === data.profession)) return { ok: false, code: 'invalid_data' };
  const lang = data.lang;
  if ((lang !== 'it' && lang !== 'en') || typeof data.sourcePage !== 'string') return { ok: false, code: 'invalid_data' };
  const sourcePage = data.sourcePage.replace(/\/*$/, '/');
  if (sourcePage !== routes.newsletter[lang]) return { ok: false, code: 'invalid_data' };

  return { ok: true, lead: {
    id: data.id, firstName: (data.firstName as string).trim(), lastName: (data.lastName as string).trim(), email,
    city: (data.city as string).trim(), profession: data.profession as NewsletterLead['profession'], privacy: true, sourcePage, lang,
  } };
}
