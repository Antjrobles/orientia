import "server-only";
import { supabase } from "@/lib/supabase";

type AttemptRow = {
  key: string;
  count: number;
  expires_at: string;
  blocked_until: string | null;
};

type MemoryAttemptEntry = {
  count: number;
  expiresAt: number;
  blockedUntil: number | null;
};

const attempts = new Map<string, MemoryAttemptEntry>();

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const LOCK_WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS_PER_IP = 20;
const MAX_ATTEMPTS_PER_EMAIL_IP = 8;

function now() {
  return Date.now();
}

function toIso(timestamp: number) {
  return new Date(timestamp).toISOString();
}

function getIpKey(ip: string) {
  return `login:ip:${ip}`;
}

function getEmailIpKey(email: string, ip: string) {
  return `login:email-ip:${email}:${ip}`;
}

function memoryRead(key: string) {
  const entry = attempts.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now() && (!entry.blockedUntil || entry.blockedUntil <= now())) {
    attempts.delete(key);
    return null;
  }
  return entry;
}

function memoryIsBlocked(key: string) {
  const entry = memoryRead(key);
  return entry?.blockedUntil && entry.blockedUntil > now() ? entry.blockedUntil : null;
}

function memoryRegisterAttempt(key: string, limit: number) {
  const current = now();
  const existing = memoryRead(key);
  if (!existing || existing.expiresAt <= current) {
    attempts.set(key, {
      count: 1,
      expiresAt: current + ATTEMPT_WINDOW_MS,
      blockedUntil: null,
    });
    return;
  }

  const nextCount = existing.count + 1;
  existing.count = nextCount;
  existing.expiresAt = current + ATTEMPT_WINDOW_MS;
  if (nextCount >= limit) {
    existing.blockedUntil = current + LOCK_WINDOW_MS;
    existing.count = 0;
  }
}

function memoryClear(key: string) {
  attempts.delete(key);
}

async function dbReadAttempt(key: string) {
  const { data, error } = await supabase
    .from("auth_login_attempts")
    .select("key, count, expires_at, blocked_until")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    return null;
  }

  return (data as AttemptRow | null) ?? null;
}

async function dbUpsertAttempt(
  key: string,
  count: number,
  expiresAt: number,
  blockedUntil: number | null,
) {
  const { error } = await supabase.from("auth_login_attempts").upsert(
    {
      key,
      count,
      expires_at: toIso(expiresAt),
      blocked_until: blockedUntil ? toIso(blockedUntil) : null,
    },
    { onConflict: "key" },
  );

  return !error;
}

async function dbDeleteAttempt(key: string) {
  const { error } = await supabase.from("auth_login_attempts").delete().eq("key", key);
  return !error;
}

async function getBlockedUntil(key: string) {
  try {
    const row = await dbReadAttempt(key);
    if (!row) return null;
    const blockedUntil = row.blocked_until ? new Date(row.blocked_until).getTime() : null;
    if (!blockedUntil || blockedUntil <= now()) {
      return null;
    }
    return blockedUntil;
  } catch {
    return memoryIsBlocked(key);
  }
}

async function registerAttempt(key: string, limit: number) {
  const current = now();

  try {
    const existing = await dbReadAttempt(key);
    const existingExpiresAt = existing ? new Date(existing.expires_at).getTime() : 0;
    const existingBlockedUntil = existing?.blocked_until
      ? new Date(existing.blocked_until).getTime()
      : null;

    if (!existing || existingExpiresAt <= current) {
      const ok = await dbUpsertAttempt(key, 1, current + ATTEMPT_WINDOW_MS, null);
      if (!ok) {
        memoryRegisterAttempt(key, limit);
      }
      return;
    }

    if (existingBlockedUntil && existingBlockedUntil > current) {
      return;
    }

    const nextCount = existing.count + 1;
    const blockedUntil = nextCount >= limit ? current + LOCK_WINDOW_MS : null;
    const ok = await dbUpsertAttempt(
      key,
      blockedUntil ? 0 : nextCount,
      current + ATTEMPT_WINDOW_MS,
      blockedUntil,
    );
    if (!ok) {
      memoryRegisterAttempt(key, limit);
    }
  } catch {
    memoryRegisterAttempt(key, limit);
  }
}

export async function isLoginBlocked(ip: string, email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase() || "";
  const ipBlockedUntil = await getBlockedUntil(getIpKey(ip));
  const emailBlockedUntil = normalizedEmail
    ? await getBlockedUntil(getEmailIpKey(normalizedEmail, ip))
    : null;
  const blockedUntil = Math.max(ipBlockedUntil || 0, emailBlockedUntil || 0);
  if (!blockedUntil) {
    return { blocked: false as const, blockedUntil: null };
  }
  return { blocked: true as const, blockedUntil };
}

export async function registerLoginFailure(ip: string, email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase() || "";
  await registerAttempt(getIpKey(ip), MAX_ATTEMPTS_PER_IP);
  if (normalizedEmail) {
    await registerAttempt(getEmailIpKey(normalizedEmail, ip), MAX_ATTEMPTS_PER_EMAIL_IP);
  }
}

export async function clearLoginFailures(ip: string, email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase() || "";
  if (normalizedEmail) {
    const emailKey = getEmailIpKey(normalizedEmail, ip);
    const deleted = await dbDeleteAttempt(emailKey);
    if (!deleted) {
      memoryClear(emailKey);
    }
  }
}
