import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { DEVICE_COOKIE_NAME } from "@/lib/device";

const Schema = z.object({
  email: z.string().email(),
  deviceId: z.string().min(8).optional(),
});

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getRequestOrigin(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  if (!host) return "";
  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Datos invalidos" },
        { status: 400 },
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const origin = getRequestOrigin(request);
    const deviceId =
      parsed.data.deviceId ?? request.cookies.get(DEVICE_COOKIE_NAME)?.value;

    if (!origin || !deviceId) {
      return NextResponse.json(
        { success: false, error: "No se pudo reenviar la verificacion" },
        { status: 400 },
      );
    }

    const ip = getClientIp({ headers: request.headers });
    const rl = checkRateLimit(`device-verify-resend:${email}:${ip}`, 3, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          success: true,
          message: "Si el email existe, enviaremos un nuevo enlace.",
        },
        { status: 200 },
      );
    }

    const { data: user } = await supabase
      .from("users")
      .select("id, email, name")
      .ilike("email", email)
      .single();

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "Si el email existe, enviaremos un nuevo enlace.",
        },
        { status: 200 },
      );
    }

    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await supabase.from("device_verification_tokens").insert({
      user_id: user.id,
      device_id: deviceId,
      token_hash: tokenHash,
      expires,
      used_at: null,
    });

    const verifyUrl = `${origin}/verify-device?token=${encodeURIComponent(token)}`;
    await fetch(`${origin}/api/send-device-verification-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        name: user.name ?? "usuario",
        verifyUrl,
      }),
    });

    return NextResponse.json(
      { success: true, message: "Hemos reenviado el email de verificacion." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
