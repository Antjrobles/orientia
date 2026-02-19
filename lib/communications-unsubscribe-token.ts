import "server-only";
import crypto from "crypto";

type TokenPayload = {
  email: string;
  exp: number;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getSecret() {
  return process.env.NEXTAUTH_SECRET || "";
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function createUnsubscribeToken(email: string, ttlMs = 30 * ONE_DAY_MS) {
  const secret = getSecret();
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required");
  }
  const payload: TokenPayload = {
    email: normalizeEmail(email),
    exp: Date.now() + ttlMs,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function parseUnsubscribeToken(token: string) {
  const secret = getSecret();
  if (!secret) {
    return { ok: false as const, reason: "missing_secret" };
  }
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return { ok: false as const, reason: "invalid_format" };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  if (expected !== signature) {
    return { ok: false as const, reason: "invalid_signature" };
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as TokenPayload;
    if (!payload?.email || typeof payload?.exp !== "number") {
      return { ok: false as const, reason: "invalid_payload" };
    }
    if (Date.now() > payload.exp) {
      return { ok: false as const, reason: "expired" };
    }
    return { ok: true as const, email: normalizeEmail(payload.email) };
  } catch {
    return { ok: false as const, reason: "invalid_payload" };
  }
}
