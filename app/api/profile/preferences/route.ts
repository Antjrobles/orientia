import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  addOptOutEmail,
  getOptOutEmailSet,
  removeOptOutEmail,
} from "@/lib/communications-optout";

const themeSchema = z.enum(["light", "dark"]);
const inputThemeSchema = z.enum(["light", "dark", "system"]).transform((value) =>
  value === "system" ? "light" : value,
);

const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  draftReminders: z.boolean(),
  weeklySummary: z.boolean(),
  theme: inputThemeSchema,
});

type UserRow = Record<string, unknown>;

const METADATA_COLUMNS = [
  "settings_json",
  "settings",
  "metadata",
  "profile_settings",
] as const;
const PROFILE_BUCKET = "profile-private";
const SETTINGS_OBJECT = "settings/profile.json";

function hasColumn(row: UserRow, key: string) {
  return Object.prototype.hasOwnProperty.call(row, key);
}

function getMetadataObject(row: UserRow) {
  const metadataKey = METADATA_COLUMNS.find((key) => hasColumn(row, key));
  const raw = metadataKey ? row[metadataKey] : null;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { metadataKey, metadata: {} as Record<string, unknown> };
  }
  return { metadataKey, metadata: raw as Record<string, unknown> };
}

function toBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function toTheme(value: unknown): z.infer<typeof themeSchema> {
  if (value === "system") {
    return "light";
  }
  return themeSchema.safeParse(value).success
    ? (value as z.infer<typeof themeSchema>)
    : "light";
}

async function ensurePrivateBucket() {
  const CACHE_WINDOW_MS = 5 * 60 * 1000;
  const now = Date.now();
  if (
    (globalThis as typeof globalThis & { __profileBucketCache?: { ok: boolean; error?: string; checkedAt: number } })
      .__profileBucketCache &&
    now -
      ((globalThis as typeof globalThis & { __profileBucketCache?: { ok: boolean; error?: string; checkedAt: number } })
        .__profileBucketCache?.checkedAt ?? 0) <
      CACHE_WINDOW_MS
  ) {
    const cached =
      (globalThis as typeof globalThis & {
        __profileBucketCache?: { ok: boolean; error?: string; checkedAt: number };
      }).__profileBucketCache!;
    return cached.ok
      ? { ok: true as const }
      : { ok: false as const, error: cached.error ?? "No se pudo verificar el bucket." };
  }

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    (globalThis as typeof globalThis & { __profileBucketCache?: { ok: boolean; error?: string; checkedAt: number } })
      .__profileBucketCache = {
      ok: false,
      error: listError.message,
      checkedAt: now,
    };
    return { ok: false as const, error: listError.message };
  }

  const exists = (buckets || []).some((bucket) => bucket.name === PROFILE_BUCKET);
  if (exists) {
    (globalThis as typeof globalThis & { __profileBucketCache?: { ok: boolean; error?: string; checkedAt: number } })
      .__profileBucketCache = {
      ok: true,
      checkedAt: now,
    };
    return { ok: true as const };
  }

  const { error: createError } = await supabase.storage.createBucket(PROFILE_BUCKET, {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    (globalThis as typeof globalThis & { __profileBucketCache?: { ok: boolean; error?: string; checkedAt: number } })
      .__profileBucketCache = {
      ok: false,
      error: createError.message,
      checkedAt: now,
    };
    return { ok: false as const, error: createError.message };
  }

  (globalThis as typeof globalThis & { __profileBucketCache?: { ok: boolean; error?: string; checkedAt: number } })
    .__profileBucketCache = {
    ok: true,
    checkedAt: now,
  };
  return { ok: true as const };
}

function settingsPathForUser(userId: string) {
  return `${userId}/${SETTINGS_OBJECT}`;
}

async function readStoragePreferences(userId: string) {
  const path = settingsPathForUser(userId);
  const { data, error } = await supabase.storage.from(PROFILE_BUCKET).download(path);
  if (error || !data) return {};

  try {
    const text = await data.text();
    if (!text) return {};
    const parsed = JSON.parse(text) as Record<string, unknown>;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

async function mergeStoragePreferences(
  userId: string,
  next: {
    emailNotifications: boolean;
    draftReminders: boolean;
    weeklySummary: boolean;
    theme: z.infer<typeof themeSchema>;
  },
) {
  const current = await readStoragePreferences(userId);
  const merged = {
    ...current,
    emailNotifications: next.emailNotifications,
    draftReminders: next.draftReminders,
    weeklySummary: next.weeklySummary,
    theme: next.theme,
  };

  const path = settingsPathForUser(userId);
  const payload = JSON.stringify(merged);
  const { error } = await supabase.storage.from(PROFILE_BUCKET).upload(path, payload, {
    upsert: true,
    contentType: "application/json",
  });

  return error ? error.message : null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "No autenticado." },
      { status: 401 },
    );
  }

  const bucket = await ensurePrivateBucket();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar las preferencias." },
      { status: 500 },
    );
  }

  const row = user as UserRow;
  const { metadata } = getMetadataObject(row);
  const email = String((row.email as string | undefined) || "")
    .trim()
    .toLowerCase();
  const optOutSet = await getOptOutEmailSet();
  const storagePrefs = bucket.ok
    ? await readStoragePreferences(session.user.id)
    : {};
  const userThemeColumn = hasColumn(row, "theme") ? row.theme : undefined;

  return NextResponse.json({
    success: true,
    preferences: {
      emailNotifications: email ? !optOutSet.has(email) : true,
      draftReminders: toBoolean(
        metadata.draftReminders ?? storagePrefs.draftReminders,
        true,
      ),
      weeklySummary: toBoolean(
        metadata.weeklySummary ?? storagePrefs.weeklySummary,
        false,
      ),
      theme: toTheme(metadata.theme ?? userThemeColumn ?? storagePrefs.theme),
    },
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "No autenticado." },
      { status: 401 },
    );
  }

  const bucket = await ensurePrivateBucket();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido." },
      { status: 400 },
    );
  }

  const parsed = preferencesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message || "Datos inválidos.",
      },
      { status: 400 },
    );
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar las preferencias." },
      { status: 500 },
    );
  }

  const row = user as UserRow;
  const { metadataKey, metadata } = getMetadataObject(row);
  const next = parsed.data;

  const updatePayload: Record<string, unknown> = {};
  if (metadataKey) {
    updatePayload[metadataKey] = {
      ...metadata,
      draftReminders: next.draftReminders,
      weeklySummary: next.weeklySummary,
      emailNotifications: next.emailNotifications,
      theme: next.theme,
    };
  }

  if (hasColumn(row, "theme")) {
    updatePayload.theme = next.theme;
  }

  if (Object.keys(updatePayload).length > 0) {
    const { error: updateError } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", session.user.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "No se pudieron guardar las preferencias." },
        { status: 500 },
      );
    }
  }

  const warnings: string[] = [];
  if (bucket.ok) {
    const storageError = await mergeStoragePreferences(session.user.id, next);
    if (storageError) {
      warnings.push(
        "No se pudieron guardar todas las preferencias en almacenamiento secundario.",
      );
    }
  } else {
    warnings.push("No se pudo acceder al almacenamiento secundario de perfil.");
  }

  const email = String((row.email as string | undefined) || "")
    .trim()
    .toLowerCase();
  if (email) {
    const optOutSet = await getOptOutEmailSet();
    const currentEmailNotifications = !optOutSet.has(email);
    if (currentEmailNotifications !== next.emailNotifications) {
      const prefResult = next.emailNotifications
        ? await removeOptOutEmail({ email })
        : await addOptOutEmail({
            email,
            reason: "profile_preference",
            source: "profile_preferences",
          });

      if (!prefResult.ok) {
        warnings.push("No se pudo sincronizar la preferencia de comunicaciones.");
      }
    }
  }

  return NextResponse.json({
    success: true,
    preferences: next,
    warnings: warnings.length > 0 ? warnings : undefined,
  });
}

