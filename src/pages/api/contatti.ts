import type { APIRoute } from 'astro';
import { saveContactLead, validContactScriptConfig, validateContactSubmission } from '../../lib/contact-leads.ts';
import { formReply as reply, readFormRequest } from '../../lib/form-request.ts';
import { contactMailConfig } from '../../lib/contact-email.ts';
import { deliverContact } from '../../lib/lead-delivery.ts';

export const POST: APIRoute = async (context) => {
  const request = await readFormRequest(context.request, context.url);
  if (!request.ok) return request.response;
  const result = validateContactSubmission(request.input);
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
  const env = { ...import.meta.env, ...process.env };
  const mode = env.MAIL_MODE || 'off';
  const mail = mode === 'off' ? null : contactMailConfig(env);
  if (mode !== 'off' && !mail) return reply(503, { ok: false, code: 'unavailable' });
  const saved = mail
    ? await deliverContact(result.lead, config, address, mail)
    : await saveContactLead(result.lead, config, address);
  if (saved.ok) return reply(200, { ok: true, id: result.lead.id });
  if (saved.code === 'rate_limited') {
    const response = reply(429, saved);
    response.headers.set('Retry-After', String(saved.retryAfter));
    return response;
  }
  return reply(502, { ok: false, code: saved.code });
};
