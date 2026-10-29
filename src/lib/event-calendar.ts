import { normalizeSearchText, searchTerms } from '../data/search-text';
import { getTodayInRome } from './utility-function';

export type EventPeriod = 'upcoming' | 'past' | 'all';

export interface CalendarEvent {
  start: string;
  end: string;
  search: string;
  categories: string[];
}

export interface CalendarFilters {
  query: string;
  category: string;
  from: string;
  to: string;
  period: EventPeriod;
}

export function filterCalendarEvents<T extends CalendarEvent>(events: T[], filters: CalendarFilters, today = getTodayInRome()): T[] {
  if (filters.from && filters.to && filters.from > filters.to) return [];
  const terms = searchTerms(filters.query);
  return events.filter(event => {
    const text = normalizeSearchText(event.search);
    return event.start !== ''
      && (filters.period !== 'upcoming' || event.end >= today)
      && (filters.period !== 'past' || event.end < today)
      && (!filters.category || event.categories.includes(filters.category))
      && (!filters.from || event.end >= filters.from)
      && (!filters.to || event.start <= filters.to)
      && terms.every(term => text.includes(term));
  }).sort((a, b) => {
    const comparison = a.start.localeCompare(b.start);
    return filters.period === 'upcoming' ? comparison : -comparison;
  });
}
