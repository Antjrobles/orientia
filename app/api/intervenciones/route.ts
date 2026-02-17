import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const interventionSchema = z.object({
  casoId: z.string().uuid("Caso inválido"),
  fechaIntervencion: z.string().min(10, "Fecha inválida"),
  ambito: z.enum(["escolar", "sociocultural"]),
  subambito: z
    .enum([
      "tutoria",
      "profesorado",
      "claustro",
      "equipo_directivo",
      "orientacion",
      "convivencia",
      "evaluacion",
      "familia",
      "servicios_sociales",
      "entorno_comunitario",
      "salud_mental",
      "proteccion_menor",
      "otros",
    ])
    .optional(),
  subambitos: z
    .array(
      z.enum([
        "tutoria",
        "profesorado",
        "claustro",
        "equipo_directivo",
        "orientacion",
        "convivencia",
        "evaluacion",
        "familia",
        "servicios_sociales",
        "entorno_comunitario",
        "salud_mental",
        "proteccion_menor",
        "otros",
      ]),
    )
    .optional(),
  titulo: z.string().trim().min(3, "El título es obligatorio").max(160),
  textoOriginal: z
    .string()
    .trim()
    .min(10, "Añade más contenido en la nota")
    .max(12000),
});

const updateInterventionSchema = z.object({
  id: z.string().uuid("ID de intervención inválido"),
  fechaIntervencion: z.string().min(10, "Fecha inválida"),
  ambito: z.enum(["escolar", "sociocultural"]),
  subambito: z.enum([
    "tutoria",
    "profesorado",
    "claustro",
    "equipo_directivo",
    "orientacion",
    "convivencia",
    "evaluacion",
    "familia",
    "servicios_sociales",
    "entorno_comunitario",
    "salud_mental",
    "proteccion_menor",
    "otros",
  ]),
  titulo: z.string().trim().min(3, "El título es obligatorio").max(160),
  textoOriginal: z
    .string()
    .trim()
    .min(10, "Añade más contenido en la nota")
    .max(12000),
});

const deleteInterventionSchema = z.object({
  id: z.string().uuid("ID de intervención inválido"),
});

const singleSubambitoSchema = z.enum([
  "tutoria",
  "profesorado",
  "claustro",
  "equipo_directivo",
  "orientacion",
  "convivencia",
  "evaluacion",
  "familia",
  "servicios_sociales",
  "entorno_comunitario",
  "salud_mental",
  "proteccion_menor",
  "otros",
]);

const allowedByAmbito: Record<string, Set<string>> = {
  escolar: new Set([
    "tutoria",
    "profesorado",
    "claustro",
    "equipo_directivo",
    "orientacion",
    "convivencia",
    "evaluacion",
    "otros",
  ]),
  sociocultural: new Set([
    "familia",
    "servicios_sociales",
    "entorno_comunitario",
    "salud_mental",
    "proteccion_menor",
    "otros",
  ]),
};

function redactTechnicalText(text: string) {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Placeholder de fase 1: la version IA se guarda normalizada.
  return normalized;
}

function isMissingTableError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42P01"
  );
}

function isCheckConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23514"
  );
}

function firstZodIssue(error: z.ZodError) {
  return error.issues[0]?.message || "Datos inválidos";
}

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
    const casoId = searchParams.get("casoId");
    if (!casoId) {
      return NextResponse.json(
        { success: false, error: "casoId es obligatorio" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("intervenciones")
      .select(
        "id, caso_id, fecha_intervencion, ambito, subambito, tipo_origen, titulo, texto_original, texto_redactado_ia, resumen_ia, archivo_url, archivo_nombre, created_at, updated_at",
      )
      .eq("autor_id", session.user.id)
      .eq("caso_id", casoId)
      .order("fecha_intervencion", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'intervenciones'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudieron cargar las intervenciones" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, intervenciones: data || [] });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = interventionSchema.parse(body);
    const subambitos = parsed.subambitos?.length
      ? parsed.subambitos
      : parsed.subambito
        ? [parsed.subambito]
        : [];

    if (subambitos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Selecciona al menos un contexto específico.",
        },
        { status: 400 },
      );
    }

    const invalidSubambito = subambitos.find(
      (item) =>
        !singleSubambitoSchema.safeParse(item).success ||
        !allowedByAmbito[parsed.ambito].has(item),
    );

    if (invalidSubambito) {
      return NextResponse.json(
        {
          success: false,
          error: "Algún contexto específico no es válido para el ámbito seleccionado.",
        },
        { status: 400 },
      );
    }

    const textoRedactado = redactTechnicalText(parsed.textoOriginal);
    const rows = subambitos.map((subambito) => ({
      autor_id: session.user.id,
      caso_id: parsed.casoId,
      fecha_intervencion: parsed.fechaIntervencion,
      ambito: parsed.ambito,
      subambito,
      tipo_origen: "nota_manual",
      titulo: parsed.titulo,
      texto_original: parsed.textoOriginal,
      texto_redactado_ia: textoRedactado,
      resumen_ia: null,
    }));

    const { data, error } = await supabase
      .from("intervenciones")
      .insert(rows)
      .select(
        "id, caso_id, fecha_intervencion, ambito, subambito, tipo_origen, titulo, texto_original, texto_redactado_ia, resumen_ia, archivo_url, archivo_nombre, created_at, updated_at",
      );

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'intervenciones'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      if (isCheckConstraintError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "La base de datos no admite todavía ese contexto. Aplica la migración de INTERVENCIONES_SCHEMA.sql y vuelve a intentar.",
          },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudo guardar la intervención" },
        { status: 500 },
      );
    }

    // Refresca updated_at del caso cuando hay nueva intervención.
    await supabase
      .from("casos_intervencion")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", parsed.casoId)
      .eq("autor_id", session.user.id);

    return NextResponse.json({
      success: true,
      intervenciones: data || [],
      totalGuardadas: (data || []).length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: firstZodIssue(error), details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = updateInterventionSchema.parse(body);
    if (!allowedByAmbito[parsed.ambito].has(parsed.subambito)) {
      return NextResponse.json(
        {
          success: false,
          error: "El contexto específico no es válido para el ámbito seleccionado.",
        },
        { status: 400 },
      );
    }

    const textoRedactado = redactTechnicalText(parsed.textoOriginal);

    const { data, error } = await supabase
      .from("intervenciones")
      .update({
        fecha_intervencion: parsed.fechaIntervencion,
        ambito: parsed.ambito,
        subambito: parsed.subambito,
        titulo: parsed.titulo,
        texto_original: parsed.textoOriginal,
        texto_redactado_ia: textoRedactado,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.id)
      .eq("autor_id", session.user.id)
      .select(
        "id, caso_id, fecha_intervencion, ambito, subambito, tipo_origen, titulo, texto_original, texto_redactado_ia, resumen_ia, archivo_url, archivo_nombre, created_at, updated_at",
      )
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'intervenciones'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      if (isCheckConstraintError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "La base de datos no admite todavía ese contexto. Aplica la migración de INTERVENCIONES_SCHEMA.sql y vuelve a intentar.",
          },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar la intervención" },
        { status: 500 },
      );
    }

    await supabase
      .from("casos_intervencion")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", data.caso_id)
      .eq("autor_id", session.user.id);

    return NextResponse.json({ success: true, intervencion: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: firstZodIssue(error), details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = deleteInterventionSchema.parse(body);

    const { data, error } = await supabase
      .from("intervenciones")
      .delete()
      .eq("id", parsed.id)
      .eq("autor_id", session.user.id)
      .select("id, caso_id")
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'intervenciones'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudo eliminar la intervención" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Intervención no encontrada" },
        { status: 404 },
      );
    }

    await supabase
      .from("casos_intervencion")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", data.caso_id)
      .eq("autor_id", session.user.id);

    return NextResponse.json({ success: true, deletedId: data.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: firstZodIssue(error), details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
