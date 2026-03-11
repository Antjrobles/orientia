import crypto from "crypto";

export const DEVICE_COOKIE_NAME = "orientia_device_id";
export const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
export const DEVICE_STORAGE_KEY = "orientia_device_id";
export const TRUSTED_DEVICE_COOKIE_NAME = "orientia_trusted_device";

type TrustedDeviceCookiePayload = {
  v: 1;
  u: string;
  d: string;
  e: number;
};

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required for trusted device cookies");
  }
  return secret;
}

function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");
}

export function createTrustedDeviceCookieValue(input: {
  userId: string;
  deviceId: string;
  maxAge?: number;
}) {
  const maxAge = input.maxAge ?? DEVICE_COOKIE_MAX_AGE;
  const payload: TrustedDeviceCookiePayload = {
    v: 1,
    u: input.userId,
    d: input.deviceId,
    e: Date.now() + maxAge * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function parseTrustedDeviceCookieValue(
  value: string | null | undefined,
  expectedUserId?: string,
) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSignature] = parts;
  const expectedSignature = signPayload(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as TrustedDeviceCookiePayload;

    if (payload.v !== 1) return null;
    if (!payload.u || !payload.d || !payload.e) return null;
    if (payload.e <= Date.now()) return null;
    if (expectedUserId && payload.u !== expectedUserId) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getCookieFromHeader(header: string | null, name: string) {
  if (!header) return null;
  const parts = header.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return part.substring(name.length + 1);
    }
  }
  return null;
}
