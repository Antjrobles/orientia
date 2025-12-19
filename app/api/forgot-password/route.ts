import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateTurnstileToken } from "@/lib/turnstile";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email no válido"),
  turnstileToken: z.string().min(1, "Token de seguridad requerido"),
});

function makeToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`forgot:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Inténtalo más tarde." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const rlEmail = checkRateLimit(`forgot-email:${email}`, 3, 60_000);
    if (!rlEmail.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Inténtalo más tarde." },
        { status: 429 },
      );
    }

    const isValidCaptcha = await validateTurnstileToken(parsed.data.turnstileToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { success: false, error: "Verificación de seguridad fallida. Inténtalo de nuevo." },
        { status: 400 },
      );
    }

    // Respuesta genérica para evitar enumeración de usuarios.
    const genericOk = NextResponse.json({
      success: true,
      message:
        "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.",
    });

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email, name")
      .ilike("email", email)
      .single();

    if (userError || !user?.email) {
      return genericOk;
    }

    const token = makeToken();
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 60 min

    const { error: insertError } = await supabase.from("password_reset_tokens").insert({
      identifier: email,
      token_hash: tokenHash,
      expires: expires.toISOString(),
      used_at: null,
    });

    if (insertError) {
      return genericOk;
    }

    const origin = request.nextUrl.origin;
    const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(token)}`;

    try {
      const resp = await fetch(`${origin}/api/send-password-reset-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: user.name ?? "usuario",
          resetUrl,
        }),
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        console.error("send-password-reset-email failed:", resp.status, text);
      }
    } catch {
      // Ignorar errores de email para no filtrar información.
    }

    return genericOk;
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
