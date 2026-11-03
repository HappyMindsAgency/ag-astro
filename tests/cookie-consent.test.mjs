import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { setupOfficeMaps } from '../src/scripts/office-map.ts';

class Element extends EventTarget {
  attributes = new Map(); dataset = {}; hidden = false; navigations = [];
  classList = { toggle() {} };
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); if (name === 'src') this.navigations.push(value); }
  removeAttribute(name) { this.attributes.delete(name); }
}
function fixture(consent) {
  const frame = new Element(); frame.dataset.mapSrc = 'https://www.google.com/maps/embed?city=Milano';
  const placeholder = new Element(); const consentButton = new Element(); const error = new Element(); error.hidden = true;
  const buttons = ['Milano', 'Bologna', 'Forlì'].map((city, index) => {
    const el = new Element(); el.dataset = { mapSrc: `https://www.google.com/maps/embed?city=${city}`, mapTitle: city };
    el.setAttribute('aria-pressed', String(index === 0)); return el;
  });
  const view = new EventTarget(); const calls = [];
  const attachConsent = values => {
    view.Cookiebot = { consent: { preferences: false, statistics: false, marketing: false, ...values }, submitCustomConsent(preferences, statistics, marketing) {
      calls.push([preferences, statistics, marketing]);
      Object.assign(this.consent, { preferences, statistics, marketing });
      view.dispatchEvent(new Event('CookiebotOnAccept'));
    } };
  };
  if (consent) attachConsent(consent);
  const nodes = { iframe: frame, '[data-map-placeholder]': placeholder, '[data-map-consent]': consentButton, '[data-map-consent-error]': error };
  setupOfficeMaps({ querySelectorAll: () => [{ querySelector: key => nodes[key], querySelectorAll: () => buttons }] }, view);
  return { frame, placeholder, consentButton, error, buttons, view, calls, attachConsent };
}

test('mappe: nessun iframe remoto prima della risposta o con il solo consenso statistico', () => {
  for (const consent of [undefined, { statistics: true }, { marketing: false }]) {
    const { frame, placeholder } = fixture(consent);
    assert.equal(frame.getAttribute('src'), null);
    assert.equal(frame.hidden, true);
    assert.equal(placeholder.hidden, false);
    assert.equal(frame.navigations.length, 0);
  }
});

test('mappe: scegliere una sede prima del consenso non avvia richieste; la sede si carica dopo il consenso', () => {
  const f = fixture();
  f.buttons[1].dispatchEvent(new Event('click'));
  assert.equal(f.frame.navigations.length, 0);
  f.attachConsent({ marketing: true });
  f.view.dispatchEvent(new Event('CookiebotOnConsentReady'));
  assert.equal(f.frame.getAttribute('src'), 'https://www.google.com/maps/embed?city=Bologna');
  assert.equal(f.frame.hidden, false);
  assert.equal(f.placeholder.hidden, true);
  f.view.dispatchEvent(new Event('CookiebotOnAccept'));
  assert.equal(f.frame.navigations.length, 1);
});

test('mappe: il consenso rapido abilita solo il marketing e conserva le altre scelte', () => {
  const f = fixture({ preferences: true, statistics: false });
  f.consentButton.dispatchEvent(new Event('click'));
  assert.deepEqual(f.calls, [[true, false, true]]);
  assert.equal(f.frame.hidden, false);
  assert.equal(f.frame.navigations.length, 1);
});

test('mappe: la revoca rimuove il contenuto remoto e blocca anche i cambi di sede successivi', () => {
  const f = fixture({ marketing: true });
  f.view.Cookiebot.consent.marketing = false;
  f.view.dispatchEvent(new Event('CookiebotOnDecline'));
  assert.equal(f.frame.getAttribute('src'), null);
  assert.equal(f.frame.hidden, true);
  assert.equal(f.placeholder.hidden, false);
  f.buttons[2].dispatchEvent(new Event('click'));
  assert.equal(f.frame.navigations.length, 1);
  f.view.Cookiebot.consent.marketing = true;
  f.view.dispatchEvent(new Event('CookiebotOnAccept'));
  assert.equal(f.frame.getAttribute('src'), 'https://www.google.com/maps/embed?city=Forlì');
});

test('mappe: se il servizio cookie non risponde, il messaggio è leggibile e la mappa resta bloccata', () => {
  const f = fixture();
  f.consentButton.dispatchEvent(new Event('click'));
  assert.equal(f.error.hidden, false);
  assert.equal(f.frame.navigations.length, 0);
});

test('Analytics: inizialmente disabilitato, attivo solo con statistiche e nuovamente disabilitato alla revoca', () => {
  const head = readFileSync(new URL('../src/components/Head.astro', import.meta.url), 'utf8');
  const source = head.match(/<script is:inline data-cookieconsent="ignore"[^>]*>([\s\S]*?)<\/script>/)[1];
  const window = new EventTarget();
  window.location = { hostname: 'www.agtrustees.it' };
  const deleted = [];
  const document = { set cookie(value) { deleted.push(value); } };
  vm.runInNewContext(source, { window, document, GA_ID: 'G-TEST' });
  assert.equal(window['ga-disable-G-TEST'], true);
  assert.equal(deleted.length, 0);
  window.Cookiebot = { consent: { statistics: true } };
  window.dispatchEvent(new Event('CookiebotOnAccept'));
  assert.equal(window['ga-disable-G-TEST'], false);
  assert.equal(deleted.length, 0);
  window.Cookiebot.consent.statistics = false;
  window.dispatchEvent(new Event('CookiebotOnDecline'));
  assert.equal(window['ga-disable-G-TEST'], true);
  assert.equal(deleted.length, 6);
  assert.equal(deleted.every(value => /^_ga(?:_TEST)?=; Max-Age=0; Path=\//.test(value)), true);
  assert.equal(deleted.some(value => value.includes('Domain=agtrustees.it')), true);
});
