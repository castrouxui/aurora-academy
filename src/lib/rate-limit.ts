/**
 * Simple in-memory rate limiter.
 * Note: This resets on server restart and is per-instance.
 * For production multi-instance deployments, use Redis-backed rate limiting.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) store.delete(key);
    }
}, 5 * 60 * 1000);

/**
 * Check if a request should be rate limited.
 * @param key      Unique identifier (e.g. IP + endpoint)
 * @param limit    Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns true if the request is allowed, false if rate limited
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (entry.count >= limit) return false;

    entry.count++;
    return true;
}

export function rateLimitResponse() {
    return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
    );
}
