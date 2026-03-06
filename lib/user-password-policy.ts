type UserRow = Record<string, unknown>;

const METADATA_COLUMNS = [
  "settings_json",
  "settings",
  "metadata",
  "profile_settings",
] as const;

const PASSWORD_MAX_AGE_DAYS = 90;
const PASSWORD_MAX_AGE_MS = PASSWORD_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

export function hasColumn(row: UserRow, key: string) {
  return Object.prototype.hasOwnProperty.call(row, key);
}

export function getMetadataObject(row: UserRow) {
  const metadataKey = METADATA_COLUMNS.find((key) => hasColumn(row, key));
  const raw = metadataKey ? row[metadataKey] : null;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { metadataKey, metadata: {} as Record<string, unknown> };
  }
  return { metadataKey, metadata: raw as Record<string, unknown> };
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getPasswordLastChangedAt(row: UserRow): Date | null {
  const directCandidates = [
    row.password_changed_at,
    row.password_updated_at,
    row.passwordChangedAt,
  ];
  for (const candidate of directCandidates) {
    const parsed = parseDate(candidate);
    if (parsed) return parsed;
  }

  const { metadata } = getMetadataObject(row);
  const metadataCandidates = [
    metadata.passwordChangedAt,
    metadata.password_changed_at,
  ];
  for (const candidate of metadataCandidates) {
    const parsed = parseDate(candidate);
    if (parsed) return parsed;
  }

  const fallback = parseDate(row.created_at);
  if (fallback) return fallback;

  return null;
}

export function isPasswordExpired(row: UserRow) {
  const lastChangedAt = getPasswordLastChangedAt(row);
  if (!lastChangedAt) return false;
  return Date.now() - lastChangedAt.getTime() > PASSWORD_MAX_AGE_MS;
}

export function buildPasswordChangedUpdate(row: UserRow, whenIso: string) {
  const payload: Record<string, unknown> = {};
  if (hasColumn(row, "password_changed_at")) {
    payload.password_changed_at = whenIso;
  } else if (hasColumn(row, "passwordChangedAt")) {
    payload.passwordChangedAt = whenIso;
  }

  const { metadataKey, metadata } = getMetadataObject(row);
  if (metadataKey) {
    payload[metadataKey] = {
      ...metadata,
      passwordChangedAt: whenIso,
    };
  }

  return payload;
}

export const PASSWORD_POLICY_MAX_AGE_DAYS = PASSWORD_MAX_AGE_DAYS;
