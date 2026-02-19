import "server-only";
import { createClient } from "@supabase/supabase-js";

const PROFILE_BUCKET = "profile-private";
const OPTOUT_OBJECT_PATH = "system/communications-unsubscribed.json";

type OptOutEntry = {
  email: string;
  reason: string;
  source: string;
  created_at: string;
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) return false;
  const exists = (buckets || []).some((bucket) => bucket.name === PROFILE_BUCKET);
  if (exists) return true;
  const { error: createError } = await supabase.storage.createBucket(PROFILE_BUCKET, {
    public: false,
    fileSizeLimit: 2 * 1024 * 1024,
  });
  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    return false;
  }
  return true;
}

export async function readOptOutEntries(): Promise<OptOutEntry[]> {
  const ok = await ensureBucket();
  if (!ok) return [];

  const { data, error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .download(OPTOUT_OBJECT_PATH);

  if (error || !data) {
    return [];
  }

  try {
    const raw = await data.text();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        email: normalizeEmail(String(item?.email || "")),
        reason: String(item?.reason || "optout"),
        source: String(item?.source || "link"),
        created_at: String(item?.created_at || new Date().toISOString()),
      }))
      .filter((item) => item.email.length > 0);
  } catch {
    return [];
  }
}

async function writeOptOutEntries(entries: OptOutEntry[]) {
  await ensureBucket();
  const payload = JSON.stringify(entries, null, 2);
  const { error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(OPTOUT_OBJECT_PATH, payload, {
      upsert: true,
      contentType: "application/json",
    });
  return !error;
}

export async function getOptOutEmailSet() {
  const entries = await readOptOutEntries();
  return new Set(entries.map((entry) => entry.email));
}

export async function addOptOutEmail(input: {
  email: string;
  reason?: string;
  source?: string;
}) {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false as const, reason: "invalid_email" };

  const entries = await readOptOutEntries();
  const exists = entries.some((entry) => entry.email === email);
  if (exists) {
    return { ok: true as const, alreadyExisted: true as const };
  }

  entries.push({
    email,
    reason: input.reason || "optout",
    source: input.source || "link",
    created_at: new Date().toISOString(),
  });

  const ok = await writeOptOutEntries(entries);
  if (!ok) {
    return { ok: false as const, reason: "persist_failed" };
  }

  return { ok: true as const, alreadyExisted: false as const };
}

export async function removeOptOutEmail(input: { email: string }) {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false as const, reason: "invalid_email" };

  const entries = await readOptOutEntries();
  const nextEntries = entries.filter((entry) => entry.email !== email);
  const removed = nextEntries.length !== entries.length;

  const ok = await writeOptOutEntries(nextEntries);
  if (!ok) {
    return { ok: false as const, reason: "persist_failed" };
  }

  return { ok: true as const, removed };
}
