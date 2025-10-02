type Entry = { count: number; expires: number };

const store = new Map<string, Entry>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.expires <= now) {
    store.set(key, { count: 1, expires: now + windowMs });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, reset: entry.expires };
  }
  entry.count += 1;
  return {
    allowed: true,
    remaining: limit - entry.count,
    reset: entry.expires,
  };
}

export function getClientIp(req: Request | { headers: Headers }) {
  const h = "headers" in req ? req.headers : (req as any).headers;
  const xff = h.get("x-forwarded-for");
  const ip =
    xff?.split(",")[0]?.trim() || (h as any).get("x-real-ip") || "unknown";
  return ip;
}
