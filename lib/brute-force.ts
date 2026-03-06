type AttemptEntry = {
  count: number;
  expiresAt: number;
};

type LockEntry = {
  lockedUntil: number;
};

const attempts = new Map<string, AttemptEntry>();
const locks = new Map<string, LockEntry>();

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const LOCK_WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS_PER_IP = 20;
const MAX_ATTEMPTS_PER_EMAIL_IP = 8;

function now() {
  return Date.now();
}

function cleanupExpired() {
  const current = now();
  for (const [key, entry] of attempts.entries()) {
    if (entry.expiresAt <= current) {
      attempts.delete(key);
    }
  }
  for (const [key, entry] of locks.entries()) {
    if (entry.lockedUntil <= current) {
      locks.delete(key);
    }
  }
}

function getIpKey(ip: string) {
  return `login:ip:${ip}`;
}

function getEmailIpKey(email: string, ip: string) {
  return `login:email-ip:${email}:${ip}`;
}

function isKeyBlocked(key: string) {
  cleanupExpired();
  const lock = locks.get(key);
  if (!lock) return null;
  return lock.lockedUntil > now() ? lock.lockedUntil : null;
}

function registerAttempt(key: string, limit: number) {
  const current = now();
  const existing = attempts.get(key);
  if (!existing || existing.expiresAt <= current) {
    attempts.set(key, {
      count: 1,
      expiresAt: current + ATTEMPT_WINDOW_MS,
    });
    return;
  }

  existing.count += 1;
  if (existing.count >= limit) {
    locks.set(key, { lockedUntil: current + LOCK_WINDOW_MS });
    attempts.delete(key);
  }
}

export function isLoginBlocked(ip: string, email?: string | null) {
  const ipBlockedUntil = isKeyBlocked(getIpKey(ip));
  const emailBlockedUntil =
    email && email.trim()
      ? isKeyBlocked(getEmailIpKey(email.trim().toLowerCase(), ip))
      : null;
  const blockedUntil = Math.max(ipBlockedUntil || 0, emailBlockedUntil || 0);
  if (!blockedUntil) {
    return { blocked: false as const, blockedUntil: null };
  }
  return { blocked: true as const, blockedUntil };
}

export function registerLoginFailure(ip: string, email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase() || "";
  registerAttempt(getIpKey(ip), MAX_ATTEMPTS_PER_IP);
  if (normalizedEmail) {
    registerAttempt(getEmailIpKey(normalizedEmail, ip), MAX_ATTEMPTS_PER_EMAIL_IP);
  }
}

export function clearLoginFailures(ip: string, email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase() || "";
  attempts.delete(getIpKey(ip));
  locks.delete(getIpKey(ip));
  if (normalizedEmail) {
    attempts.delete(getEmailIpKey(normalizedEmail, ip));
    locks.delete(getEmailIpKey(normalizedEmail, ip));
  }
}
