import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
  .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .regex(
    /[^A-Za-z0-9]/,
    "La contraseña debe contener al menos un carácter especial",
  );

const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token requerido"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`reset:${ip}`, 10, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Inténtalo más tarde." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? "Datos inválidos" },
        { status: 400 },
      );
    }

    const tokenHash = hashToken(parsed.data.token);

    const { data: tokenRow, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("identifier, expires, used_at")
      .eq("token_hash", tokenHash)
      .single();

    if (tokenError || !tokenRow?.identifier) {
      return NextResponse.json(
        { success: false, error: "Token inválido o expirado" },
        { status: 400 },
      );
    }

    if (tokenRow.used_at) {
      return NextResponse.json(
        { success: false, error: "Este enlace ya fue usado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    if (new Date() > new Date(tokenRow.expires)) {
      return NextResponse.json(
        { success: false, error: "Token expirado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    const email = String(tokenRow.identifier).trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    const { error: updateUserError } = await supabase
      .from("users")
      .update({
        hashed_password: hashedPassword,
        emailVerified: new Date().toISOString(),
      })
      .ilike("email", email);

    if (updateUserError) {
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar la contraseña" },
        { status: 500 },
      );
    }

    await supabase
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("token_hash", tokenHash);

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
