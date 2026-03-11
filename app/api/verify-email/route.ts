import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function hashVerificationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token requerido" },
        { status: 400 },
      );
    }

    const tokenHash = hashVerificationToken(token);

    const nowIso = new Date().toISOString();

    // Consumo de un solo uso: marcamos el token como usado en la misma operación.
    const { data: tokenData, error: tokenError } = await supabase
      .from("verification_tokens")
      .update({ used_at: nowIso })
      .select("identifier, expires")
      .eq("token_hash", tokenHash)
      .is("used_at", null)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 400 },
      );
    }

    // Verificar si el token ha expirado
    if (new Date() > new Date(tokenData.expires)) {
      return NextResponse.json(
        { success: false, expired: true, message: "Token expirado" },
        { status: 400 },
      );
    }

    // Verificar el email del usuario
    const { error: updateError } = await supabase
      .from("users")
      .update({ emailVerified: new Date().toISOString() })
      .eq("email", tokenData.identifier);

    if (updateError) {
      console.error("Error actualizando usuario:", updateError);
      return NextResponse.json(
        { success: false, message: "Error verificando email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verificado correctamente",
    });
  } catch (error) {
    console.error("Error en verificación:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
