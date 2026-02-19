import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const settingsSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional().default(""),
  professionalId: z.string().trim().max(60).optional().default(""),
  schoolName: z.string().trim().max(160).optional().default(""),
  position: z.string().trim().max(120).optional().default(""),
  specialization: z.string().trim().max(160).optional().default(""),
  location: z.string().trim().max(120).optional().default(""),
  signature: z.string().trim().max(1000).optional().default(""),
  reportTone: z.enum(["tecnico", "equilibrado", "cercano"]).default("equilibrado"),
  includeSignatureInReports: z.boolean().default(true),
  includeConfidentialityFooter: z.boolean().default(true),
  autoRewriteNotes: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  draftReminders: z.boolean().default(true),
  weeklySummary: z.boolean().default(false),
});

type UserRow = Record<string, unknown>;
type SettingsPayload = z.infer<typeof settingsSchema>;

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

function getFirstString(row: UserRow, keys: readonly string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string") return value;
  }
  return "";
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

function mapUserRowToSettings(row: UserRow) {
  const { metadata } = getMetadataObject(row);

  return {
    fullName: getFirstString(row, ["name"]),
    email: getFirstString(row, ["email"]),
    phone: getFirstString(row, ["phone", "telefono"]),
    professionalId: getFirstString(row, [
      "professional_license",
      "numero_colegiado",
      "colegiado",
    ]),
    schoolName: getFirstString(row, [
      "school_name",
      "centro_nombre",
      "centro_educativo",
    ]),
    position: getFirstString(row, ["job_title", "cargo"]),
    specialization: getFirstString(row, ["specialty", "especialidad"]),
    location: getFirstString(row, ["location", "ubicacion"]),
    signature: getFirstString(row, [
      "professional_signature",
      "firma_profesional",
      "signature",
    ]),
    reportTone:
      (metadata.reportTone as "tecnico" | "equilibrado" | "cercano") || "equilibrado",
    includeSignatureInReports: toBoolean(metadata.includeSignatureInReports, true),
    includeConfidentialityFooter: toBoolean(metadata.includeConfidentialityFooter, true),
    autoRewriteNotes: toBoolean(metadata.autoRewriteNotes, true),
    emailNotifications: toBoolean(metadata.emailNotifications, true),
    draftReminders: toBoolean(metadata.draftReminders, true),
    weeklySummary: toBoolean(metadata.weeklySummary, false),
  };
}

async function ensurePrivateBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) return { ok: false as const, error: listError.message };

  const exists = (buckets || []).some((bucket) => bucket.name === PROFILE_BUCKET);
  if (exists) return { ok: true as const };

  const { error: createError } = await supabase.storage.createBucket(PROFILE_BUCKET, {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    return { ok: false as const, error: createError.message };
  }

  return { ok: true as const };
}

function settingsPathForUser(userId: string) {
  return `${userId}/${SETTINGS_OBJECT}`;
}

async function readStorageSettings(userId: string) {
  const path = settingsPathForUser(userId);
  const { data, error } = await supabase.storage.from(PROFILE_BUCKET).download(path);
  if (error || !data) return null;

  try {
    const text = await data.text();
    if (!text) return null;
    const parsed = JSON.parse(text) as Partial<SettingsPayload>;
    return settingsSchema.partial().parse(parsed);
  } catch {
    return null;
  }
}

async function writeStorageSettings(userId: string, settings: SettingsPayload) {
  const path = settingsPathForUser(userId);
  const payload = JSON.stringify(settings);

  const { error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, payload, {
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
  if (!bucket.ok) {
    return NextResponse.json(
      { success: false, error: "No se pudo inicializar el almacenamiento de perfil." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar los ajustes." },
      { status: 500 },
    );
  }

  const dbSettings = mapUserRowToSettings(data as UserRow);
  const storageSettings = await readStorageSettings(session.user.id);
  const merged = {
    ...dbSettings,
    ...(storageSettings || {}),
    email: dbSettings.email,
    fullName:
      (storageSettings?.fullName && storageSettings.fullName.trim()) ||
      dbSettings.fullName,
  };

  return NextResponse.json({ success: true, settings: merged });
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
  if (!bucket.ok) {
    return NextResponse.json(
      { success: false, error: "No se pudo inicializar el almacenamiento de perfil." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON invalido." },
      { status: 400 },
    );
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.errors[0]?.message || "Datos invalidos.",
      },
      { status: 400 },
    );
  }

  const { data: currentUser, error: readError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (readError || !currentUser) {
    return NextResponse.json(
      { success: false, error: "No se pudo leer el perfil actual." },
      { status: 500 },
    );
  }

  const next = parsed.data;
  const row = currentUser as UserRow;
  const updateData: Record<string, unknown> = {};

  if (hasColumn(row, "name")) updateData.name = next.fullName;

  const optionalMapping: Array<{ keys: string[]; value: string }> = [
    { keys: ["phone", "telefono"], value: next.phone },
    {
      keys: ["professional_license", "numero_colegiado", "colegiado"],
      value: next.professionalId,
    },
    {
      keys: ["school_name", "centro_nombre", "centro_educativo"],
      value: next.schoolName,
    },
    { keys: ["job_title", "cargo"], value: next.position },
    { keys: ["specialty", "especialidad"], value: next.specialization },
    { keys: ["location", "ubicacion"], value: next.location },
    {
      keys: ["professional_signature", "firma_profesional", "signature"],
      value: next.signature,
    },
  ];

  for (const item of optionalMapping) {
    const key = item.keys.find((candidate) => hasColumn(row, candidate));
    if (key) updateData[key] = item.value;
  }

  const { metadataKey, metadata } = getMetadataObject(row);
  if (metadataKey) {
    updateData[metadataKey] = {
      ...metadata,
      reportTone: next.reportTone,
      includeSignatureInReports: next.includeSignatureInReports,
      includeConfidentialityFooter: next.includeConfidentialityFooter,
      autoRewriteNotes: next.autoRewriteNotes,
      emailNotifications: next.emailNotifications,
      draftReminders: next.draftReminders,
      weeklySummary: next.weeklySummary,
    };
  }

  if (hasColumn(row, "updated_at")) {
    updateData.updated_at = new Date().toISOString();
  }

  let updateError: { message?: string } | null = null;
  if (Object.keys(updateData).length > 0) {
    const result = await supabase
      .from("users")
      .update(updateData)
      .eq("id", session.user.id);
    updateError = result.error;
  }

  if (updateError) {
    return NextResponse.json(
      {
        success: false,
        error: "No se pudieron guardar los ajustes. Revisa los datos e intenta de nuevo.",
      },
      { status: 500 },
    );
  }

  const storageError = await writeStorageSettings(session.user.id, next);
  if (storageError) {
    return NextResponse.json(
      { success: false, error: "Se guardo parcialmente. No se pudo persistir la configuracion avanzada." },
      { status: 500 },
    );
  }

  const { data: refreshedUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return NextResponse.json({
    success: true,
    settings: {
      ...mapUserRowToSettings((refreshedUser || row) as UserRow),
      ...next,
      email: mapUserRowToSettings((refreshedUser || row) as UserRow).email,
    },
  });
}
