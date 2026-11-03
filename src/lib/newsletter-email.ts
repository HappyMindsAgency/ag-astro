import type { NewsletterLead } from './newsletter-leads.ts';
import { emailMessage, escapeHtml, type MailConfig } from './mail.ts';

export function newsletterEmail(lead: NewsletterLead, config: MailConfig, logo: Buffer) {
  const en = lead.lang === 'en';
  const title = en ? 'Subscription confirmed' : 'Iscrizione confermata';
  const greeting = `${en ? 'Dear' : 'Gentile'} ${lead.firstName},`;
  const thanks = en
    ? 'Thank you for subscribing to AG Informa, the AG Trustees newsletter.'
    : 'grazie per la sua iscrizione ad AG Informa, la newsletter di AG Trustees.';
  const copy = en
    ? 'From now on, you will receive a selection of news, expert insights and updates on events dedicated to trusts, taxation and wealth management.'
    : 'Da oggi riceverà una selezione di notizie, approfondimenti e aggiornamenti su eventi dedicati al mondo dei trust, della fiscalità e della gestione patrimoniale.';
  const privacyText = en
    ? 'For more information on how we process your personal data, please consult our'
    : 'Per maggiori informazioni sul trattamento dei suoi dati personali, può consultare la nostra';
  const privacyLabel = en ? 'Privacy Notice' : 'Informativa Privacy';
  const privacyUrl = `https://agtrustees.it${en ? '/en' : ''}/privacy-policy/`;
  const closing = en ? 'Kind regards,' : 'Un caro saluto,';
  const disclaimer = en ? 'This is an automated email confirming your newsletter subscription.' : 'Questa email è stata inviata automaticamente per confermare l’iscrizione alla newsletter.';
  const body = `<p style="margin:0 0 16px;">${escapeHtml(greeting)}<br>${thanks}</p>
    <p style="margin:0 0 24px;">${copy}</p>
    <p style="margin:0 0 24px;">${privacyText} <a href="${privacyUrl}" style="color:#003b56;">${privacyLabel}</a>.</p>
    <p style="margin:0;">${closing}<br>AG Trustees</p>`;
  return emailMessage({
    id: lead.id, kind: 'welcome', to: lead.email, replyTo: 'segreteria@agtrustees.it',
    subject: `${title} | AG Informa`, title, body, en, disclaimer,
    text: [greeting, thanks, copy, `${privacyText} ${privacyLabel}: ${privacyUrl}`, `${closing}\nAG Trustees`, disclaimer].join('\n\n'),
  }, config, logo);
}
