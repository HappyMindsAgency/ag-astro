import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const mailSource = readFileSync(new URL('../../integrations/google-apps-script/mail-delivery.gs', import.meta.url), 'utf8');
import { createHmac } from 'node:crypto';

export function scriptRuntime({ source, headers, secretProperty, failWrite = false, alteredHeader = false, busy = false, failFlushOnce = false }) {
  const rows = [alteredHeader ? ['Colonne modificate'] : [...headers]];
  const sheets = new Map();
  let spreadsheetAccesses = 0;
  let locked = false;
  let now = 1800000000000;
  const properties = { [secretProperty]: 'segreto-fittizio-test', SPREADSHEET_ID: 'foglio-fittizio-test' };
  const makeSheet = values => ({
    getLastRow: () => values.length,
    setFrozenRows() {},
    appendRow: row => { if (failWrite) throw new Error('Salvataggio non riuscito'); values.push(row); },
    getRange: (row, column, height = 1, width = values[0]?.length ?? 1) => ({
      getValues: () => values.slice(row - 1, row - 1 + height).map(value => value.slice(column - 1, column - 1 + width).map(cell => typeof cell === 'string' && cell.startsWith("'") ? cell.slice(1) : cell)),
      setValues: updated => updated.forEach((value, i) => value.forEach((cell, j) => { values[row - 1 + i][column - 1 + j] = cell; })),
      createTextFinder: value => ({ matchEntireCell: () => ({ findNext: () => {
        const index = values.findIndex((r, i) => i >= row - 1 && r[column - 1] === value);
        return index >= 0 ? { getRow: () => index + 1 } : null;
      } }) }),
    }),
  });
  sheets.set(secretProperty === 'CONTACT_SECRET' ? 'Contatti' : 'Newsletter', { rows, sheet: makeSheet(rows) });
  const context = vm.createContext({
    Date: class extends Date {
      constructor(value = now) { super(value); }
      static now() { return now; }
    },
    Utilities: { computeHmacSha256Signature: (value, secret) => [...createHmac('sha256', secret).update(value).digest()] },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: key => properties[key], getProperties: () => ({ ...properties }),
      deleteProperty: key => { delete properties[key]; },
      setProperties: values => Object.assign(properties, values),
    }) },
    SpreadsheetApp: {
      openById: () => { spreadsheetAccesses++; return {
        getSheetByName: name => sheets.get(name)?.sheet,
        insertSheet: name => { const rows = []; const sheet = makeSheet(rows); sheets.set(name, { rows, sheet }); return sheet; },
      }; },
      flush: () => { if (failFlushOnce) { failFlushOnce = false; throw new Error('Risposta interrotta dopo la scrittura'); } },
    },
    LockService: { getScriptLock: () => ({ tryLock: () => busy ? false : (locked = true), hasLock: () => locked, releaseLock: () => { locked = false; } }) },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
  });
  vm.runInContext(source + '\n' + mailSource, context);
  return {
    rows, properties, sheetRows: name => sheets.get(name)?.rows,
    action: data => context.doPost({ postData: { contents: JSON.stringify({ secret: 'segreto-fittizio-test', ...data }) } }),
    send: (lead, secret = 'segreto-fittizio-test', rateKey = 'a'.repeat(64)) => context.doPost({ postData: { contents: JSON.stringify({ secret, lead, rateKey }) } }),
    accesses: () => spreadsheetAccesses, locked: () => locked, advance: ms => { now += ms; },
  };
}
