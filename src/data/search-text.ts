// Mantiene la lunghezza del testo, così le posizioni valgono anche per l’evidenziazione.
export const normalizeSearchText = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').replace(/[‘’]/g, '\'').toLocaleLowerCase('it');

export const searchTerms = (query: string) => normalizeSearchText(query).split(/\s+/).filter(Boolean);
