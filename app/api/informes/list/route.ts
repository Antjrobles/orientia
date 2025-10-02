import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 },
      );
    }

    const { data: informes, error } = await supabase
      .from("informes")
      .select("*")
      .eq("autor_id", session.user.id)
      .order("creado_en", { ascending: false });

    if (error) {
      console.error("Error al obtener informes:", error);
      return NextResponse.json(
        { success: false, error: "Error al obtener los informes" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      informes: informes || [],
    });
  } catch (error) {
    console.error("Error en list informes API:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
