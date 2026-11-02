const NEWSLETTER_HEADERS = [
  'Data e ora', 'Email', 'Nome', 'Cognome', 'Città', 'Professione',
  'Privacy accettata', 'Lingua', 'ID iscrizione',
];

const NEWSLETTER_SOURCES = { '/newsletter/': 'it', '/en/newsletter/': 'en' };
const NEWSLETTER_RATE_WINDOW = 10 * 60 * 1000;

function initializeNewsletter() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
  const sheet = spreadsheet.getSheetByName('Newsletter') || spreadsheet.insertSheet('Newsletter');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(NEWSLETTER_HEADERS);
  }
  validateNewsletterHeaders_(sheet);
  spreadsheet.setSpreadsheetTimeZone('Europe/Rome');
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, NEWSLETTER_HEADERS.length, 180);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 300);
  sheet.getRange(1, 1, 1, NEWSLETTER_HEADERS.length)
    .setFontWeight('bold').setBackground('#003b56').setFontColor('#ffffff').setWrap(true);
  sheet.getRange('A2:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
}

function doPost(event) {
  let lock;
  try {
    if (!event || !event.postData || event.postData.contents.length > 32000) {
      return newsletterResponse_({ ok: false, code: 'invalid_request' });
    }
    const input = JSON.parse(event.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('NEWSLETTER_SECRET');
    if (!secret || input.secret !== secret) {
      return newsletterResponse_({ ok: false, code: 'unauthorized' });
    }

    const lead = input.lead;
    if (!validNewsletterLead_(lead) || typeof input.rateKey !== 'string' || !/^[a-f0-9]{64}$/.test(input.rateKey)) {
      return newsletterResponse_({ ok: false, code: 'invalid_data' });
    }

    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return newsletterResponse_({ ok: false, code: 'busy' });

    const spreadsheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
    const sheet = spreadsheet.getSheetByName('Newsletter');
    if (!sheet) return newsletterResponse_({ ok: false, code: 'not_initialized' });
    validateNewsletterHeaders_(sheet);

    const lastRow = sheet.getLastRow();
    const existing = lastRow > 1 && sheet.getRange(2, NEWSLETTER_HEADERS.length, lastRow - 1, 1)
      .createTextFinder(lead.id).matchEntireCell(true).findNext();
    if (existing) return newsletterResponse_({ ok: true, id: lead.id });

    const retryAfter = applyNewsletterRateLimit_(properties, input.rateKey, lead.email, secret);
    if (retryAfter) return newsletterResponse_({ ok: false, code: 'rate_limited', retryAfter });

    sheet.appendRow([
      new Date(), newsletterText_(lead.email), newsletterText_(lead.firstName),
      newsletterText_(lead.lastName), newsletterText_(lead.city), newsletterText_(lead.profession),
      'Sì', lead.lang, lead.id,
    ]);
    SpreadsheetApp.flush();
    return newsletterResponse_({ ok: true, id: lead.id });
  } catch (error) {
    return newsletterResponse_({ ok: false, code: 'write_failed' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function applyNewsletterRateLimit_(properties, addressKey, email, secret) {
  const now = Date.now();
  const stored = properties.getProperties();
  const prefix = 'NEWSLETTER_RATE_';
  for (const key of Object.keys(stored)) {
    if (key.startsWith(prefix) && JSON.parse(stored[key]).until <= now) properties.deleteProperty(key);
  }

  const emailKey = Utilities.computeHmacSha256Signature(email.toLowerCase(), secret)
    .map(byte => ((byte + 256) % 256).toString(16).padStart(2, '0')).join('');
  const buckets = [[`${prefix}IP_${addressKey}`, 10], [`${prefix}EMAIL_${emailKey}`, 5]].map(([key, limit]) => {
    const previous = stored[key] ? JSON.parse(stored[key]) : null;
    const state = previous && previous.until > now ? previous : { count: 0, until: now + NEWSLETTER_RATE_WINDOW };
    return { key, limit, state };
  });
  const blocked = buckets.filter(bucket => bucket.state.count >= bucket.limit);
  if (blocked.length) return Math.ceil((Math.max(...blocked.map(bucket => bucket.state.until)) - now) / 1000);

  // Il lock dello script rende atomici controllo e incremento, anche tra istanze del sito.
  properties.setProperties(Object.fromEntries(buckets.map(({ key, state }) => [
    key, JSON.stringify({ count: state.count + 1, until: state.until }),
  ])));
  return 0;
}

function validNewsletterLead_(lead) {
  if (!lead || typeof lead !== 'object' || Array.isArray(lead)) return false;
  const limits = { firstName: 100, lastName: 100, email: 254, city: 150 };
  for (const field of Object.keys(limits)) {
    if (typeof lead[field] !== 'string' || lead[field].length > limits[field] || !lead[field].trim()) return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)
    && ['Notaio', 'Commercialista', 'Avvocato', 'Altro'].includes(lead.profession)
    && lead.privacy === true
    && typeof lead.sourcePage === 'string'
    && Object.prototype.hasOwnProperty.call(NEWSLETTER_SOURCES, lead.sourcePage)
    && NEWSLETTER_SOURCES[lead.sourcePage] === lead.lang
    && typeof lead.id === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lead.id);
}

function validateNewsletterHeaders_(sheet) {
  const actual = sheet.getRange(1, 1, 1, NEWSLETTER_HEADERS.length).getValues()[0];
  if (NEWSLETTER_HEADERS.some((header, index) => actual[index] !== header)) {
    throw new Error('Le colonne del foglio Newsletter non corrispondono alla configurazione.');
  }
}

function newsletterText_(value) {
  // L'apostrofo di escape di Sheets mantiene il testo originale, anche con formule o apostrofi iniziali.
  return value ? "'" + value : '';
}

function newsletterResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
