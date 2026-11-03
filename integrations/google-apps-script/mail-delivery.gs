const MAIL_HEADERS = ['ID richiesta', 'Modalità', 'Tipo', 'Stato', 'Tentativo', 'Aggiornato', 'Esito'];

function validMailDelivery_(delivery) {
  return delivery && ['test', 'live'].includes(delivery.mode)
    && typeof delivery.attempt === 'string'
    && /^[0-9a-f-]{36}$/i.test(delivery.attempt);
}

function mailDeliverySheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('Invii email') || spreadsheet.insertSheet('Invii email');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(MAIL_HEADERS);
    sheet.setFrozenRows(1);
  }
  const actual = sheet.getRange(1, 1, 1, MAIL_HEADERS.length).getValues()[0];
  if (MAIL_HEADERS.some((header, index) => actual[index] !== header)) throw new Error('Colonne registro email modificate');
  return sheet;
}

function claimFormMail_(spreadsheet, id, delivery, kinds) {
  if (!validMailDelivery_(delivery)) throw new Error('Configurazione invio non valida');
  const sheet = mailDeliverySheet_(spreadsheet);
  const rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, MAIL_HEADERS.length).getValues() : [];
  const result = {};
  for (const kind of kinds) {
    const index = rows.findIndex(row => row[0] === id && row[1] === delivery.mode && row[2] === kind);
    const row = index >= 0 ? rows[index] : null;
    if (row && row[3] === 'inviata') { result[kind] = 'sent'; continue; }
    if (row && !['in corso', 'da riprovare'].includes(row[3])) { result[kind] = 'review'; continue; }
    if (row && row[3] === 'in corso') {
      if (Date.now() - new Date(row[5]).getTime() > 90000) {
        sheet.getRange(index + 2, 4, 1, 4).setValues([['da verificare', row[4], new Date(), 'conferma assente']]);
        result[kind] = 'review';
      } else result[kind] = 'pending';
      continue;
    }
    const values = [id, delivery.mode, kind, 'in corso', delivery.attempt, new Date(), ''];
    if (row) sheet.getRange(index + 2, 1, 1, MAIL_HEADERS.length).setValues([values]);
    else sheet.appendRow(values);
    result[kind] = 'claimed';
  }
  SpreadsheetApp.flush();
  return result;
}

function completeFormMail_(input, properties, kinds) {
  if (!validMailDelivery_(input.delivery) || typeof input.id !== 'string' || !Array.isArray(input.outcomes)
    || !input.outcomes.length || input.outcomes.length > kinds.length
    || new Set(input.outcomes.map(outcome => outcome.kind)).size !== input.outcomes.length
    || input.outcomes.some(outcome => !kinds.includes(outcome.kind)
      || !['sent', 'retry', 'review'].includes(outcome.state)
      || typeof outcome.code !== 'string' || !/^[a-z0-9_]{1,40}$/.test(outcome.code))) {
    return mailResponse_({ ok: false, code: 'invalid_data' });
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return mailResponse_({ ok: false, code: 'busy' });
  try {
    const spreadsheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
    const sheet = mailDeliverySheet_(spreadsheet);
    const rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, MAIL_HEADERS.length).getValues() : [];
    const updates = input.outcomes.map(outcome => ({ outcome, index: rows.findIndex(row => row[0] === input.id && row[1] === input.delivery.mode && row[2] === outcome.kind && row[4] === input.delivery.attempt) }));
    if (updates.some(update => update.index < 0)) return mailResponse_({ ok: false, code: 'invalid_attempt' });
    for (const { outcome, index } of updates) {
      if (rows[index][3] !== 'in corso') continue;
      const state = { sent: 'inviata', retry: 'da riprovare', review: 'da verificare' }[outcome.state];
      sheet.getRange(index + 2, 4, 1, 4).setValues([[state, input.delivery.attempt, new Date(), outcome.code]]);
    }
    SpreadsheetApp.flush();
    return mailResponse_({ ok: true, id: input.id });
  } finally {
    lock.releaseLock();
  }
}

function mailResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
