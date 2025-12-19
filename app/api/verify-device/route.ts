import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { DEVICE_COOKIE_MAX_AGE, DEVICE_COOKIE_NAME } from "@/lib/device";

const Schema = z.object({
  token: z.string().min(1, "Token requerido"),
});

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Token requerido" },
        { status: 400 },
      );
    }

    const tokenHash = hashToken(parsed.data.token);

    const { data: tokenRow, error: tokenError } = await supabase
      .from("device_verification_tokens")
      .select("user_id, device_id, expires, used_at")
      .eq("token_hash", tokenHash)
      .single();

    if (tokenError || !tokenRow) {
      return NextResponse.json(
        { success: false, error: "Token invalido o expirado" },
        { status: 400 },
      );
    }

    if (tokenRow.used_at) {
      return NextResponse.json(
        { success: false, error: "Este enlace ya fue usado" },
        { status: 400 },
      );
    }

    if (new Date() > new Date(tokenRow.expires)) {
      return NextResponse.json(
        { success: false, error: "Token expirado" },
        { status: 400 },
      );
    }

    await supabase.from("trusted_devices").insert({
      user_id: tokenRow.user_id,
      device_id: tokenRow.device_id,
      last_seen_at: new Date().toISOString(),
    });

    await supabase
      .from("device_verification_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("token_hash", tokenHash);

    const response = NextResponse.json({
      success: true,
      message: "Dispositivo verificado correctamente",
    });

    response.cookies.set(DEVICE_COOKIE_NAME, tokenRow.device_id, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: DEVICE_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

