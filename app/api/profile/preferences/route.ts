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

const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  draftReminders: z.boolean(),
  weeklySummary: z.boolean(),
});

type UserRow = Record<string, unknown>;

const METADATA_COLUMNS = [
  "settings_json",
  "settings",
  "metadata",
  "profile_settings",
] as const;

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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "No autenticado." },
      { status: 401 },
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
  const { metadata } = getMetadataObject(row);
  const email = String((row.email as string | undefined) || "")
    .trim()
    .toLowerCase();
  const optOutSet = await getOptOutEmailSet();

  return NextResponse.json({
    success: true,
    preferences: {
      emailNotifications: email ? !optOutSet.has(email) : true,
      draftReminders: toBoolean(metadata.draftReminders, true),
      weeklySummary: toBoolean(metadata.weeklySummary, false),
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

  if (metadataKey) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        [metadataKey]: {
          ...metadata,
          draftReminders: next.draftReminders,
          weeklySummary: next.weeklySummary,
          emailNotifications: next.emailNotifications,
        },
      })
      .eq("id", session.user.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "No se pudieron guardar las preferencias." },
        { status: 500 },
      );
    }
  }

  const email = String((row.email as string | undefined) || "")
    .trim()
    .toLowerCase();
  if (email) {
    const prefResult = next.emailNotifications
      ? await removeOptOutEmail({ email })
      : await addOptOutEmail({
          email,
          reason: "profile_preference",
          source: "profile_preferences",
        });

    if (!prefResult.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo actualizar la preferencia de comunicaciones.",
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ success: true, preferences: next });
}

