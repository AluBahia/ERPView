import crypto from 'crypto';

interface CacheEntry {
  path: string;
  createdAt: number;
}

const cache = new Map<string, CacheEntry>();

export function getCacheKey(nome: string, params: Record<string, string>): string {
  const str = `${nome}:${JSON.stringify(params)}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

export function getCachedPdf(key: string, ttlMinutes: number): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  const ageMs = Date.now() - entry.createdAt;
  if (ageMs > ttlMinutes * 60 * 1000) {
    cache.delete(key);
    return null;
  }
  return entry.path;
}

export function setCachedPdf(key: string, path: string): void {
  cache.set(key, { path, createdAt: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}
