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

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(
      50,
      Math.max(6, Number(searchParams.get("pageSize") || "12")),
    );
    const estado = searchParams.get("estado") || "todos";
    const search = (searchParams.get("search") || "").trim();
    const orden = searchParams.get("orden") || "recientes";
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const ordenColumna = orden === "actualizados" ? "actualizado_en" : "creado_en";
    const ordenAsc = orden === "antiguos";

    let query = supabase
      .from("informes")
      .select(
        "id, estado, creado_en, actualizado_en, datos_identificativos, evaluacion_psicopedagogica",
        { count: "exact" },
      )
      .eq("autor_id", session.user.id);

    if (estado !== "todos") {
      query = query.eq("estado", estado);
    }

    if (search.length > 0) {
      const escaped = search.replace(/%/g, "\\%").replace(/_/g, "\\_");
      query = query.or(
        `datos_identificativos->alumno->>nombre.ilike.%${escaped}%,datos_identificativos->centro->>nombre.ilike.%${escaped}%`,
      );
    }

    const { data: informes, error, count } = await query
      .order(ordenColumna, { ascending: ordenAsc })
      .range(from, to);

    if (error) {
      console.error("Error al obtener informes:", error);
      return NextResponse.json(
        { success: false, error: "Error al obtener los informes" },
        { status: 500 },
      );
    }

    const [
      { count: totalCount },
      { count: completadosCount },
      { count: borradoresCount },
    ] = await Promise.all([
      supabase
        .from("informes")
        .select("id", { count: "exact", head: true })
        .eq("autor_id", session.user.id),
      supabase
        .from("informes")
        .select("id", { count: "exact", head: true })
        .eq("autor_id", session.user.id)
        .eq("estado", "completado"),
      supabase
        .from("informes")
        .select("id", { count: "exact", head: true })
        .eq("autor_id", session.user.id)
        .eq("estado", "borrador"),
    ]);

    return NextResponse.json({
      success: true,
      informes: informes || [],
      total: count ?? 0,
      page,
      pageSize,
      resumen: {
        total: totalCount ?? 0,
        completados: completadosCount ?? 0,
        borradores: borradoresCount ?? 0,
        otros:
          (totalCount ?? 0) - (completadosCount ?? 0) - (borradoresCount ?? 0),
      },
    });
  } catch (error) {
    console.error("Error en list informes API:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
