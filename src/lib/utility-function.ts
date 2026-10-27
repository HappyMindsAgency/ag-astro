import type { Locale } from './utility-customslug';

export function formatDate(value: string, lang: Locale, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }): string {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'it-IT', { ...options, timeZone: 'UTC' }).format(new Date(value));
}
