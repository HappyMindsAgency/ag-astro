const CONTACT_HEADERS = [
  'Data e ora', 'Nome e cognome', 'Email', 'Telefono', 'Profilo',
  'Messaggio', 'Privacy accettata', 'Pagina di provenienza', 'Lingua', 'ID richiesta',
];

const CONTACT_SOURCES = {
  '/chi-siamo/': 'it', '/chi-siamo/team/': 'it', '/servizi/': 'it', '/contatti/': 'it',
  '/en/about-us/': 'en', '/en/about-us/team/': 'en', '/en/services/': 'en', '/en/contact-us/': 'en',
};

const CONTACT_RATE_WINDOW = 10 * 60 * 1000;

function initializeContacts() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
  const sheet = spreadsheet.getSheetByName('Contatti') || spreadsheet.insertSheet('Contatti');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONTACT_HEADERS);
  }
  validateContactHeaders_(sheet);
  spreadsheet.setSpreadsheetTimeZone('Europe/Rome');
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, CONTACT_HEADERS.length, 180);
  sheet.setColumnWidth(6, 420);
  sheet.setColumnWidth(8, 240);
  sheet.setColumnWidth(10, 300);
  sheet.getRange(1, 1, 1, CONTACT_HEADERS.length)
    .setFontWeight('bold').setBackground('#003b56').setFontColor('#ffffff').setWrap(true);
  sheet.getRange('A2:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
}

function doPost(event) {
  let lock;
  try {
    if (!event || !event.postData || event.postData.contents.length > 32000) {
      return contactResponse_({ ok: false, code: 'invalid_request' });
    }
    const input = JSON.parse(event.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('CONTACT_SECRET');
    if (!secret || input.secret !== secret) {
      return contactResponse_({ ok: false, code: 'unauthorized' });
    }

    const lead = input.lead;
    if (!validContactLead_(lead) || typeof input.rateKey !== 'string' || !/^[a-f0-9]{64}$/.test(input.rateKey)) {
      return contactResponse_({ ok: false, code: 'invalid_data' });
    }

    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return contactResponse_({ ok: false, code: 'busy' });

    const spreadsheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
    const sheet = spreadsheet.getSheetByName('Contatti');
    if (!sheet) return contactResponse_({ ok: false, code: 'not_initialized' });
    validateContactHeaders_(sheet);

    const lastRow = sheet.getLastRow();
    const existing = lastRow > 1 && sheet.getRange(2, CONTACT_HEADERS.length, lastRow - 1, 1)
      .createTextFinder(lead.id).matchEntireCell(true).findNext();
    if (existing) return contactResponse_({ ok: true, id: lead.id });

    const retryAfter = applyContactRateLimit_(properties, input.rateKey, lead.email, secret);
    if (retryAfter) return contactResponse_({ ok: false, code: 'rate_limited', retryAfter });

    sheet.appendRow([
      new Date(), contactText_(lead.name), contactText_(lead.email),
      contactText_(lead.phone), contactText_(lead.profile), contactText_(lead.message),
      'Sì', lead.sourcePage, lead.lang, lead.id,
    ]);
    SpreadsheetApp.flush();
    return contactResponse_({ ok: true, id: lead.id });
  } catch (error) {
    return contactResponse_({ ok: false, code: 'write_failed' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function applyContactRateLimit_(properties, addressKey, email, secret) {
  const now = Date.now();
  const stored = properties.getProperties();
  const prefix = 'CONTACT_RATE_';
  for (const key of Object.keys(stored)) {
    if (key.startsWith(prefix) && JSON.parse(stored[key]).until <= now) properties.deleteProperty(key);
  }

  const emailKey = Utilities.computeHmacSha256Signature(email.toLowerCase(), secret)
    .map(byte => ((byte + 256) % 256).toString(16).padStart(2, '0')).join('');
  const buckets = [[`${prefix}IP_${addressKey}`, 10], [`${prefix}EMAIL_${emailKey}`, 5]].map(([key, limit]) => {
    const previous = stored[key] ? JSON.parse(stored[key]) : null;
    const state = previous && previous.until > now ? previous : { count: 0, until: now + CONTACT_RATE_WINDOW };
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

function validContactLead_(lead) {
  if (!lead || typeof lead !== 'object' || Array.isArray(lead)) return false;
  const limits = { name: 200, email: 254, phone: 80, profile: 200, message: 5000 };
  for (const field of Object.keys(limits)) {
    if (typeof lead[field] !== 'string' || lead[field].length > limits[field]) return false;
  }
  return Boolean(lead.name.trim())
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)
    && lead.privacy === true
    && typeof lead.sourcePage === 'string'
    && Object.prototype.hasOwnProperty.call(CONTACT_SOURCES, lead.sourcePage)
    && CONTACT_SOURCES[lead.sourcePage] === lead.lang
    && typeof lead.id === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lead.id);
}

function validateContactHeaders_(sheet) {
  const actual = sheet.getRange(1, 1, 1, CONTACT_HEADERS.length).getValues()[0];
  if (CONTACT_HEADERS.some((header, index) => actual[index] !== header)) {
    throw new Error('Le colonne del foglio Contatti non corrispondono alla configurazione.');
  }
}

function contactText_(value) {
  // L'apostrofo di escape di Sheets mantiene il testo originale, anche con formule o apostrofi iniziali.
  return value ? "'" + value : '';
}

function contactResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
