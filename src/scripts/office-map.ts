interface ConsentManager {
  consent: { preferences: boolean; statistics: boolean; marketing: boolean };
  submitCustomConsent: (preferences: boolean, statistics: boolean, marketing: boolean) => void;
}

type ConsentWindow = Window & { Cookiebot?: ConsentManager };

export function setupOfficeMaps(root: Pick<Document, 'querySelectorAll'> = document, view: ConsentWindow = window) {
  root.querySelectorAll<HTMLElement>('[data-office-map]').forEach((section) => {
    const frame = section.querySelector<HTMLIFrameElement>('iframe');
    const placeholder = section.querySelector<HTMLElement>('[data-map-placeholder]');
    const consentButton = section.querySelector<HTMLButtonElement>('[data-map-consent]');
    const error = section.querySelector<HTMLElement>('[data-map-consent-error]');
    const buttons = section.querySelectorAll<HTMLButtonElement>('button[data-map-src]');
    if (!frame || !placeholder || !consentButton || !error) return;

    const syncConsent = () => {
      const allowed = view.Cookiebot?.consent.marketing === true;
      const src = frame.dataset.mapSrc;
      if (allowed && src) {
        if (frame.getAttribute('src') !== src) frame.setAttribute('src', src);
      } else {
        frame.removeAttribute('src');
      }
      frame.hidden = !allowed;
      placeholder.hidden = allowed;
      if (view.Cookiebot) error.hidden = true;
    };
    ['CookiebotOnConsentReady', 'CookiebotOnAccept', 'CookiebotOnDecline'].forEach(event => view.addEventListener(event, syncConsent));
    syncConsent();

    consentButton.addEventListener('click', () => {
      const api = view.Cookiebot;
      if (!api) { error.hidden = false; return; }
      api.submitCustomConsent(api.consent.preferences === true, api.consent.statistics === true, true);
      syncConsent();
    });

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-pressed') === 'true') return;
        const { mapSrc, mapTitle } = button.dataset;
        if (!mapSrc || !mapTitle) return;
        frame.dataset.mapSrc = mapSrc;
        frame.title = mapTitle;
        buttons.forEach(item => {
          const selected = item === button;
          item.classList.toggle('active', selected);
          item.setAttribute('aria-pressed', String(selected));
        });
        syncConsent();
      });
    });
  });
}
