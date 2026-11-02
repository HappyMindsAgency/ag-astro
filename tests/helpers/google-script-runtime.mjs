import vm from 'node:vm';
import { createHmac } from 'node:crypto';

export function scriptRuntime({ source, headers, secretProperty, failWrite = false, alteredHeader = false, busy = false, failFlushOnce = false }) {
  const rows = [alteredHeader ? ['Colonne modificate'] : [...headers]];
  let spreadsheetAccesses = 0;
  let locked = false;
  let now = 1800000000000;
  const properties = { [secretProperty]: 'segreto-fittizio-test', SPREADSHEET_ID: 'foglio-fittizio-test' };
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: row => { if (failWrite) throw new Error('Salvataggio non riuscito'); rows.push(row); },
    getRange: (row, column) => ({
      getValues: () => [rows[row - 1]],
      createTextFinder: value => ({ matchEntireCell: () => ({ findNext: () => rows.slice(row - 1).some(r => r[column - 1] === value) ? {} : null }) }),
    }),
  };
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
      openById: () => { spreadsheetAccesses++; return { getSheetByName: () => sheet }; },
      flush: () => { if (failFlushOnce) { failFlushOnce = false; throw new Error('Risposta interrotta dopo la scrittura'); } },
    },
    LockService: { getScriptLock: () => ({ tryLock: () => busy ? false : (locked = true), hasLock: () => locked, releaseLock: () => { locked = false; } }) },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
  });
  vm.runInContext(source, context);
  return {
    rows, properties,
    send: (lead, secret = 'segreto-fittizio-test', rateKey = 'a'.repeat(64)) => context.doPost({ postData: { contents: JSON.stringify({ secret, lead, rateKey }) } }),
    accesses: () => spreadsheetAccesses, locked: () => locked, advance: ms => { now += ms; },
  };
}
