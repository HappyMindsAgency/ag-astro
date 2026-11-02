import type { APIRoute } from 'astro';
import { formReply as reply, readFormRequest } from '../../lib/form-request.ts';
import { saveFormLead, validGoogleScriptConfig } from '../../lib/google-form-leads.ts';
import { validateNewsletterSubmission } from '../../lib/newsletter-leads.ts';

export const POST: APIRoute = async (context) => {
  const request = await readFormRequest(context.request, context.url);
  if (!request.ok) return request.response;
  const result = validateNewsletterSubmission(request.input);
  if (!result.ok) return reply(400, { ok: false, code: result.code });

  const config = {
    url: process.env.NEWSLETTER_SCRIPT_URL || import.meta.env.NEWSLETTER_SCRIPT_URL || '',
    secret: process.env.NEWSLETTER_SCRIPT_SECRET || import.meta.env.NEWSLETTER_SCRIPT_SECRET || '',
  };
  if (!validGoogleScriptConfig(config)) return reply(503, { ok: false, code: 'unavailable' });
  let address: string;
  try { address = context.clientAddress; } catch { return reply(503, { ok: false, code: 'unavailable' }); }

  const saved = await saveFormLead(result.lead, config, address);
  if (saved.ok) return reply(200, { ok: true, id: result.lead.id });
  if (saved.code === 'rate_limited') {
    const response = reply(429, saved);
    response.headers.set('Retry-After', String(saved.retryAfter));
    return response;
  }
  return reply(502, { ok: false, code: 'save_failed' });
};
