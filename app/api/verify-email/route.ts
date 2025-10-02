import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token requerido" },
        { status: 400 },
      );
    }

    // Buscar el token en la base de datos
    const { data: tokenData, error: tokenError } = await supabase
      .from("verification_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 400 },
      );
    }

    // Verificar si el token ha expirado
    if (new Date() > new Date(tokenData.expires)) {
      // Eliminar token expirado
      await supabase.from("verification_tokens").delete().eq("token", token);

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

    // Eliminar el token usado
    await supabase.from("verification_tokens").delete().eq("token", token);

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
