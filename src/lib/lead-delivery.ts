import { createHmac, randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import type { ContactLead, ContactScriptConfig } from './contact-leads.ts';
import { contactEmail, type ContactMailConfig, type ContactMailKind } from './contact-email.ts';
import { makeMailSender, type MailConfig, type MailSender, type MailOutcome as Outcome } from './mail.ts';
import { newsletterEmail } from './newsletter-email.ts';
import type { NewsletterLead } from './newsletter-leads.ts';
import { validGoogleScriptConfig } from './google-form-leads.ts';

type MailOutcome = Outcome & { kind: string };
type Dependencies = { fetch?: typeof fetch; sender?: MailSender };
type DeliveryResult = { ok: true } | { ok: false; code: 'save_failed' | 'email_failed' | 'email_pending' }
  | { ok: false; code: 'rate_limited'; retryAfter: number };

async function google(config: ContactScriptConfig, body: object, timeout: number, send: typeof fetch) {
  const response = await send(config.url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: config.secret, ...body }),
    signal: AbortSignal.timeout(timeout), redirect: 'follow',
  });
  if (!response.ok) throw new Error('Google non disponibile');
  return response.json();
}

async function deliver(
  lead: { id: string }, script: ContactScriptConfig, address: string, mail: MailConfig,
  kinds: string[], prepareSender: () => Promise<MailSender>, dependencies: Dependencies,
): Promise<DeliveryResult> {
  if (!validGoogleScriptConfig(script) || !isIP(address)) return { ok: false, code: 'save_failed' };
  const send = dependencies.fetch ?? fetch;
  const attempt = randomUUID();
  const delivery = { mode: mail.mode, attempt };
  let receipt;
  try {
    receipt = await google(script, {
      lead, rateKey: createHmac('sha256', script.secret).update(address).digest('hex'), delivery,
    }, 12000, send);
  } catch {
    return { ok: false, code: 'save_failed' };
  }
  if (receipt?.ok !== true || receipt.id !== lead.id) {
    if (receipt?.code === 'rate_limited' && Number.isInteger(receipt.retryAfter) && receipt.retryAfter > 0 && receipt.retryAfter <= 600) {
      return { ok: false, code: 'rate_limited', retryAfter: receipt.retryAfter };
    }
    return { ok: false, code: 'save_failed' };
  }
  if (!receipt.delivery || kinds.some(kind => !['claimed', 'sent', 'pending', 'review'].includes(receipt.delivery[kind]))) {
    return { ok: false, code: 'email_failed' };
  }
  const claimed = kinds.filter(kind => receipt.delivery[kind] === 'claimed');
  let outcomes: MailOutcome[] = [];
  if (claimed.length) {
    let sender: MailSender | undefined;
    try {
      sender = dependencies.sender ?? await prepareSender();
    } catch {
      outcomes = claimed.map(kind => ({ kind, state: 'retry', code: 'configuration' }));
    }
    if (sender) {
      outcomes = await Promise.all(claimed.map(async kind => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
          const result = await Promise.race([
            sender!(kind),
            new Promise<{ state: 'review'; code: string }>(resolve => {
              timer = setTimeout(() => resolve({ state: 'review', code: 'deadline' }), 9000);
            }),
          ]);
          return { kind, ...result };
        } catch {
          return { kind, state: 'review' as const, code: 'unconfirmed' };
        } finally {
          clearTimeout(timer);
        }
      }));
    }
    try {
      const confirmation = await google(script, { action: 'mail_result', id: lead.id, delivery, outcomes }, 5000, send);
      if (confirmation?.ok !== true || confirmation.id !== lead.id) return { ok: false, code: 'email_pending' };
    } catch {
      // Le email potrebbero essere partite: il registro impedisce di inviarle di nuovo alla cieca.
      return { ok: false, code: 'email_pending' };
    }
  }
  return kinds.every(kind => receipt.delivery[kind] === 'sent' || outcomes.some(outcome => outcome.kind === kind && outcome.state === 'sent'))
    ? { ok: true }
    : { ok: false, code: outcomes.some(outcome => outcome.state === 'retry') ? 'email_failed' : 'email_pending' };
}

export function deliverContact(lead: ContactLead, script: ContactScriptConfig, address: string, mail: ContactMailConfig, dependencies: Dependencies = {}) {
  return deliver(lead, script, address, mail, ['internal', 'courtesy'],
    () => makeMailSender(mail, (kind, logo) => contactEmail(lead, kind as ContactMailKind, mail, logo)), dependencies);
}

export function deliverNewsletter(lead: NewsletterLead, script: ContactScriptConfig, address: string, mail: MailConfig, dependencies: Dependencies = {}) {
  return deliver(lead, script, address, mail, ['welcome'],
    () => makeMailSender(mail, (_, logo) => newsletterEmail(lead, mail, logo)), dependencies);
}
