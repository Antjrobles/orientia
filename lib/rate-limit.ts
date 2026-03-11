import "server-only";
import { supabase } from "@/lib/supabase";

type Entry = { count: number; expires: number };

const memoryStore = new Map<string, Entry>();

function now() {
  return Date.now();
}

function toIso(timestamp: number) {
  return new Date(timestamp).toISOString();
}

function memoryCheckRateLimit(key: string, limit: number, windowMs: number) {
  const current = now();
  const entry = memoryStore.get(key);
  if (!entry || entry.expires <= current) {
    memoryStore.set(key, { count: 1, expires: current + windowMs });
    return { allowed: true, remaining: limit - 1, reset: current + windowMs };
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

export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  const current = now();
  const expiresAt = current + windowMs;

  try {
    const { data: existing, error } = await supabase
      .from("auth_rate_limits")
      .select("key, count, expires_at")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      return memoryCheckRateLimit(key, limit, windowMs);
    }

    if (!existing || new Date(existing.expires_at).getTime() <= current) {
      const { error: upsertError } = await supabase.from("auth_rate_limits").upsert(
        {
          key,
          count: 1,
          expires_at: toIso(expiresAt),
        },
        { onConflict: "key" },
      );

      if (upsertError) {
        return memoryCheckRateLimit(key, limit, windowMs);
      }

      return { allowed: true, remaining: limit - 1, reset: expiresAt };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        reset: new Date(existing.expires_at).getTime(),
      };
    }

    const nextCount = existing.count + 1;
    const { error: updateError } = await supabase
      .from("auth_rate_limits")
      .update({ count: nextCount })
      .eq("key", key);

    if (updateError) {
      return memoryCheckRateLimit(key, limit, windowMs);
    }

    return {
      allowed: true,
      remaining: limit - nextCount,
      reset: new Date(existing.expires_at).getTime(),
    };
  } catch {
    return memoryCheckRateLimit(key, limit, windowMs);
  }
}

export function getClientIp(req: Request | { headers: Headers }) {
  const h = "headers" in req ? req.headers : (req as Request).headers;
  const xff = h.get("x-forwarded-for");
  const ip = xff?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return ip;
}
