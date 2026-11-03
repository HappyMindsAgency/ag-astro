import customLabel from '../lib/utility-customlabel';

export function setupLeadForms(selector: string) {
  document.querySelectorAll<HTMLFormElement>(selector).forEach((form) => {
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const label = button.querySelector<HTMLElement>('[data-submit-label]')!;
    const status = form.querySelector<HTMLElement>('[data-form-status]')!;
    const lang = new FormData(form).get('lang') === 'en' ? 'en' : 'it';
    const idleLabel = label.textContent ?? '';
    const newsletter = form.hasAttribute('data-newsletter-form');
    const startedAt = Number(form.dataset.startedAt);
    let pending = false;
    let previousData = '';
    let requestId = '';

    const ready = () => {
      pending = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = idleLabel;
    };
    ready();
    window.addEventListener('pageshow', ready);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;

      const fields = new FormData(form);
      const data = {
        ...Object.fromEntries([...fields].map(([key, value]) => [key, String(value)])),
        privacy: fields.has('privacy'),
        lang,
      };
      const signature = JSON.stringify(data);
      // Riutilizziamo l'ID quando si ritenta lo stesso invio dopo un errore di rete.
      if (signature !== previousData) {
        requestId = crypto.randomUUID();
        previousData = signature;
      }
      pending = true;
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      label.textContent = customLabel('Invio in corso…', lang);
      status.hidden = true;

      let error = newsletter
        ? 'Non è stato possibile confermare l’iscrizione. I dati sono ancora nel modulo: riprova tra poco.'
        : 'Non è stato possibile confermare il salvataggio. I dati sono ancora nel modulo: riprova tra poco.';
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, id: requestId, startedAt }),
          signal: AbortSignal.timeout(35000),
        });
        const receipt = await response.json();
        if (response.ok && receipt.ok === true && receipt.id === requestId) {
          window.location.assign(form.dataset.successUrl!);
          return;
        }
        if (receipt.code === 'too_fast') error = 'Attendi qualche secondo prima di inviare la richiesta.';
        if (receipt.code === 'invalid_data') error = 'Controlla i campi e il consenso privacy prima di riprovare.';
        if (receipt.code === 'email_failed' || receipt.code === 'email_pending') error = newsletter
          ? 'L’iscrizione è stata salvata, ma non è stato possibile confermare l’invio dell’email. I dati sono ancora nel modulo: riprova da qui senza compilare una nuova iscrizione.'
          : 'La richiesta è stata salvata, ma non è stato possibile confermare l’invio delle email. I dati sono ancora nel modulo: riprova da qui senza compilare una nuova richiesta.';
        if (response.status === 429) error = 'Hai inviato diverse richieste in poco tempo. Attendi qualche minuto prima di riprovare.';
      } catch {
        // Manteniamo campi e ID: il salvataggio potrebbe essere riuscito prima dell'interruzione.
      }
      ready();
      status.textContent = customLabel(error, lang);
      status.hidden = false;
      status.focus();
    });
  });
}
