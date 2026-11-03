import nodemailer from 'nodemailer';

export interface MailConfig {
  mode: 'test' | 'live'; host: string; port: number; user: string; password: string;
  from: string; fromName: string; testTo: string;
}
export type MailOutcome = { state: 'sent' | 'retry' | 'review'; code: string };
export type MailSender = (kind: string) => Promise<MailOutcome>;
export const validMailAddress = (value: string) => /^[^\s@<>;,\r\n]+@[^\s@<>;,\r\n]+\.[^\s@<>;,\r\n]+$/.test(value);
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]!);

export function mailConfig(env: Record<string, string | undefined>, mode = env.MAIL_MODE): MailConfig | null {
  const config = {
    mode, host: env.SMTP_HOST ?? '', port: Number(env.SMTP_PORT ?? 587),
    user: env.SMTP_USER ?? '', password: env.SMTP_PASSWORD ?? '', from: env.MAIL_FROM ?? '',
    fromName: env.MAIL_FROM_NAME || 'AG Trustees', testTo: env.MAIL_TEST_TO ?? '',
  };
  if ((config.mode !== 'test' && config.mode !== 'live') || !config.host || config.port !== 587
    || !config.password || !validMailAddress(config.user) || !validMailAddress(config.from)
    || /[\r\n]/.test(config.fromName) || (config.mode === 'test' && !validMailAddress(config.testTo))) return null;
  return config as MailConfig;
}

export function createMailTransport(config: MailConfig) {
  return nodemailer.createTransport({
    host: config.host, port: config.port, secure: false, requireTLS: true,
    auth: { user: config.user, pass: config.password }, authMethod: 'LOGIN',
    tls: { minVersion: 'TLSv1.2' }, connectionTimeout: 6000, greetingTimeout: 6000, socketTimeout: 8000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
  });
}

function emailFrame(title: string, body: string, en: boolean, disclaimer: string): string {
  return `<!doctype html>
<html lang="${en ? 'en' : 'it'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f2f5f6;color:#173d4b;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:25px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f5f6;">
    <tr><td align="center" style="padding:24px 12px;">
      <!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0"><tr><td><![endif]-->
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff;">
        <tr><td style="padding:28px 24px;border-bottom:1px solid #dde4e7;">
          <a href="https://agtrustees.it/" style="text-decoration:none;"><img src="cid:ag-trustees-logo" width="280" height="33" alt="AG Trustees" style="display:block;width:280px;max-width:100%;height:auto;border:0;"></a>
        </td></tr>
        <tr><td style="padding:28px 24px;">
          <h1 style="margin:0 0 20px;font-size:25px;line-height:33px;font-weight:600;color:#003b56;">${title}</h1>
          ${body}
        </td></tr>
        <tr><td style="padding:20px 24px;border-top:1px solid #dde4e7;font-size:12px;line-height:19px;color:#526b75;">${disclaimer}</td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body></html>`;
}

interface EmailContent {
  id: string; kind: string; to: string; bcc?: string; replyTo: string; subject: string;
  title: string; body: string; text: string; en: boolean; disclaimer: string;
}

export function emailMessage(content: EmailContent, config: MailConfig, logo: Buffer) {
  return {
    from: { name: config.fromName, address: config.from },
    to: config.mode === 'test' ? config.testTo : content.to,
    ...(config.mode === 'live' && content.bcc ? { bcc: content.bcc } : {}),
    replyTo: config.mode === 'test' ? config.testTo : content.replyTo,
    subject: `${config.mode === 'test' ? '[TEST] ' : ''}${content.subject}`,
    messageId: `<${content.id}.${config.mode}.${content.kind}@agtrustees.it>`,
    headers: { 'Auto-Submitted': 'auto-generated', 'X-Auto-Response-Suppress': 'All' },
    text: content.text, html: emailFrame(content.title, content.body, content.en, content.disclaimer),
    attachments: [{ filename: 'ag-trustees.png', content: logo, cid: 'ag-trustees-logo', contentType: 'image/png' }],
    disableFileAccess: true, disableUrlAccess: true,
  };
}

export async function makeMailSender(config: MailConfig, build: (kind: string, logo: Buffer) => ReturnType<typeof emailMessage>): Promise<MailSender> {
  const { default: data } = await import('../../public/assets/brand/ag-logo-orizzontale.png?inline');
  if (!data.startsWith('data:image/png;base64,')) throw new Error('Logo email non disponibile');
  const logo = Buffer.from(data.split(',')[1], 'base64');
  const transport = createMailTransport(config);
  return async kind => {
    try {
      const message = build(kind, logo);
      const result = await transport.sendMail(message);
      const expected = [message.to, ...('bcc' in message && message.bcc ? [message.bcc] : [])];
      const accepted = result.accepted.map(value => value.toLowerCase());
      // Un'accettazione parziale richiede verifica per evitare duplicati.
      return expected.every(value => accepted.includes(value.toLowerCase())) && !result.rejected.length
        ? { state: 'sent', code: 'accepted' } : { state: 'review', code: 'partial' };
    } catch (error) {
      const failure = error as { responseCode?: number; command?: string };
      const rejected = typeof failure.responseCode === 'number' && failure.responseCode >= 400;
      const beforeData = /^(AUTH(?: |$)|EHLO|HELO|STARTTLS|MAIL FROM|RCPT TO)/.test(failure.command ?? '');
      // Un'interruzione dopo DATA può nascondere un invio riuscito, anche se indicata come CONN.
      return { state: rejected || beforeData ? 'retry' : 'review', code: rejected ? `smtp_${failure.responseCode}` : beforeData ? 'connection' : 'unconfirmed' };
    }
  };
}
