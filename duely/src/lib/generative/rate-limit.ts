const requestCounts = new Map<string, { count: number; resetAt: number }>();
const specCache = new Map<string, { spec: unknown; expiresAt: number }>();

const MAX_REQUESTS_PER_HOUR = 60;
const CACHE_TTL_MS = 5 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

interface RateLimitResult {
  allowed: boolean;
  retryAfterMinutes?: number;
}

export function checkRateLimit(userId: string): RateLimitResult {
  const now = Date.now();
  const entry = requestCounts.get(userId);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(userId, { count: 1, resetAt: now + HOUR_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS_PER_HOUR) {
    const remainingMs = entry.resetAt - now;
    return {
      allowed: false,
      retryAfterMinutes: Math.ceil(remainingMs / 60_000),
    };
  }

  entry.count++;
  return { allowed: true };
}

export function getCachedSpec(userId: string): unknown | undefined {
  const now = Date.now();
  const entry = specCache.get(userId);
  if (entry && now < entry.expiresAt) {
    return entry.spec;
  }
  specCache.delete(userId);
  return undefined;
}

export function setCachedSpec(userId: string, spec: unknown): void {
  specCache.set(userId, {
    spec,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function invalidateCache(userId: string): void {
  specCache.delete(userId);
}
