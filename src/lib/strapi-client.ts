import { strapi, type API } from '@strapi/client';

const client = strapi({
  baseURL: import.meta.env.STRAPI_API_URL,
  auth: import.meta.env.AUTH_READONLY,
});

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { promise: Promise<unknown>; expires: number }>();

// Ordina le chiavi, così la stessa query produce sempre la stessa chiave di cache.
function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
}

// In produzione riusa le risposte per CACHE_TTL_MS; in caso di errore restituisce il fallback senza memorizzarlo.
function cachedRequest<T>(key: string, fetcher: () => Promise<T>, fallback: T): Promise<T> {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.promise as Promise<T>;

  const promise: Promise<T> = fetcher().catch((error) => {
    if (cache.get(key)?.promise === promise) cache.delete(key);
    console.warn(`[strapi] Richiesta non riuscita: ${key}`, error instanceof Error ? error.message : 'Errore sconosciuto');
    return fallback;
  });

  if (import.meta.env.PROD) {
    const now = Date.now();
    // Elimina le voci scadute, così la cache non cresce senza limiti.
    for (const [cachedKey, cached] of cache) if (cached.expires <= now) cache.delete(cachedKey);
    cache.set(key, { promise, expires: now + CACHE_TTL_MS });
  }
  return promise;
}

export function getStrapiClient() {
  return client;
}

export function getSingleDocument(resource: string, query: API.BaseQueryParams = {}) {
  return cachedRequest<Omit<API.DocumentResponse, 'data'> & { data: API.Document | null }>(
    `single:${resource}:${JSON.stringify(stableValue(query))}`,
    () => client.single(resource).find(query),
    { data: null, meta: {} },
  );
}

export function getCollectionDocuments(resource: string, query: API.BaseQueryParams = {}) {
  return cachedRequest<API.DocumentResponseCollection>(
    `collection:${resource}:${JSON.stringify(stableValue(query))}`,
    () => client.collection(resource).find(query),
    { data: [], meta: {} },
  );
}
