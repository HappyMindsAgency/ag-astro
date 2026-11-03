import type { ContactLead } from './contact-leads.ts';
import { mailConfig, emailMessage, escapeHtml as escape, validMailAddress, type MailConfig } from './mail.ts';

export type ContactMailKind = 'internal' | 'courtesy';
export interface ContactMailConfig extends MailConfig { to: string; bcc: string; }

export function contactMailConfig(env: Record<string, string | undefined>): ContactMailConfig | null {
  const shared = mailConfig(env);
  const to = env.CONTACT_MAIL_TO ?? '';
  const bcc = env.CONTACT_MAIL_BCC ?? '';
  if (!shared || (shared.mode === 'live' && (!validMailAddress(to) || (bcc && !validMailAddress(bcc))))) return null;
  return { ...shared, to, bcc };
}

const sourceLabels: Record<string, string> = {
  '/chi-siamo/': 'Chi siamo', '/chi-siamo/team/': 'Team', '/servizi/': 'Servizi', '/contatti/': 'Contatti',
  '/en/about-us/': 'About us', '/en/about-us/team/': 'Team', '/en/services/': 'Services', '/en/contact-us/': 'Contact us',
};

export function contactEmail(lead: ContactLead, kind: ContactMailKind, config: ContactMailConfig, logo: Buffer) {
  const courtesy = kind === 'courtesy';
  const en = courtesy && lead.lang === 'en';
  const title = courtesy
    ? en ? 'We have received your enquiry' : 'Abbiamo ricevuto la sua richiesta'
    : 'Nuova richiesta di contatto';
  const introduction = courtesy
    ? en
      ? 'We have received your enquiry successfully. Our team will review the information you have shared and get back to you as soon as possible.'
      : 'Abbiamo ricevuto correttamente la sua richiesta. Il nostro team esaminerà le informazioni condivise e la ricontatterà il prima possibile.'
    : `È stata ricevuta una richiesta dalla pagina ${sourceLabels[lead.sourcePage] ?? lead.sourcePage}.`;
  const fields = [
    [en ? 'Full name' : 'Nome e cognome', lead.name],
    ['Email', lead.email],
    [en ? 'Phone' : 'Telefono', lead.phone],
    [en ? 'Profile' : 'Profilo', lead.profile],
    [en ? 'Message' : 'Messaggio', lead.message],
    ...(!courtesy ? [['Pagina di provenienza', `https://agtrustees.it${lead.sourcePage}`], ['Lingua', lead.lang.toUpperCase()], ['Informativa privacy letta', 'Sì'], ['ID richiesta', lead.id]] : []),
  ];
  const disclaimer = en
    ? 'This email was sent automatically following a contact request on agtrustees.it. To contact our team, you can reply to this message.'
    : 'Questa email è stata inviata automaticamente a seguito di una richiesta di contatto su agtrustees.it. Per contattare il nostro team può rispondere a questo messaggio.';
  const greeting = courtesy ? `${en ? 'Dear' : 'Gentile'} ${lead.name},` : '';
  const thanks = en ? 'Thank you for contacting AG Trustees.' : 'grazie per aver contattato AG Trustees.';
  const closing = en ? 'Kind regards,' : 'Cordiali saluti,';
  const rows = fields.map(([label, value]) => `<tr><td style="padding:12px 0;border-bottom:1px solid #dde4e7;vertical-align:top;"><strong style="display:block;color:#003b56;font-size:13px;line-height:20px;">${escape(label)}</strong><div style="margin-top:4px;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;">${escape(value || (en ? 'Not provided' : 'Non indicato'))}</div></td></tr>`).join('');
  const content = `${courtesy ? `<p style="margin:0 0 16px;">${escape(greeting)}<br>${thanks}</p>` : ''}
    <p style="margin:0 0 24px;">${introduction}</p>
    ${courtesy ? `<p style="margin:0 0 28px;">${closing}<br>AG Trustees</p>` : ''}
    <h2 style="margin:0 0 8px;font-size:18px;line-height:26px;">${en ? 'Your enquiry' : 'Riepilogo della richiesta'}</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;table-layout:fixed;">${rows}</table>
    <p style="margin:24px 0 0;">AG Trustees<br><a href="mailto:segreteria@agtrustees.it" style="color:#003b56;">segreteria@agtrustees.it</a></p>`;
  return emailMessage({
    id: lead.id, kind, to: courtesy ? lead.email : config.to, bcc: courtesy ? '' : config.bcc,
    replyTo: courtesy ? 'segreteria@agtrustees.it' : lead.email,
    subject: `${title}${courtesy ? ' | AG Trustees' : ''}`, title, body: content, en, disclaimer,
    text: [title, ...(courtesy ? [greeting, thanks] : []), introduction, ...(courtesy ? [closing + '\nAG Trustees'] : []), ...fields.map(([label, value]) => `${label}: ${value || (en ? 'Not provided' : 'Non indicato')}`), disclaimer].join('\n\n'),
  }, config, logo);
}
