import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ENCRYPTED_PREFIX = "enc:v1:";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function resolveKeyMaterial() {
  const raw = process.env.DATA_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY || "";
  const normalized = raw.trim();
  if (!normalized) return null;

  if (/^[a-f0-9]{64}$/i.test(normalized)) {
    return Buffer.from(normalized, "hex");
  }

  try {
    const decoded = Buffer.from(normalized, "base64");
    if (decoded.length === 32) return decoded;
  } catch {
    // Ignore invalid base64 and fallback to derivation.
  }

  // Fallback for passphrases. Prefer base64/hex 32-byte keys in production.
  return createHash("sha256").update(normalized, "utf8").digest();
}

function getKey() {
  return resolveKeyMaterial();
}

export function isDataEncryptionConfigured() {
  return Boolean(getKey());
}

export function encryptSensitiveValue(value: string) {
  if (!value) return "";

  const key = getKey();
  if (!key) return value;
  if (value.startsWith(ENCRYPTED_PREFIX)) return value;

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${ENCRYPTED_PREFIX}${iv.toString("base64url")}.${encrypted.toString(
    "base64url",
  )}.${tag.toString("base64url")}`;
}

export function decryptSensitiveValue(value: unknown) {
  if (typeof value !== "string") return "";
  if (!value) return "";
  if (!value.startsWith(ENCRYPTED_PREFIX)) return value;

  const key = getKey();
  if (!key) return "";

  const payload = value.slice(ENCRYPTED_PREFIX.length);
  const [ivRaw, encryptedRaw, tagRaw] = payload.split(".");
  if (!ivRaw || !encryptedRaw || !tagRaw) return "";

  try {
    const iv = Buffer.from(ivRaw, "base64url");
    const encrypted = Buffer.from(encryptedRaw, "base64url");
    const tag = Buffer.from(tagRaw, "base64url");

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    return "";
  }
}
