import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const createCasoSchema = z.object({
  inicialesAlumno: z
    .string()
    .trim()
    .min(2, "Las iniciales son obligatorias")
    .max(10, "Las iniciales son demasiado largas"),
  centroNombre: z
    .string()
    .trim()
    .min(2, "El centro es obligatorio")
    .max(160, "El nombre del centro es demasiado largo"),
});

const updateCasoSchema = z.object({
  id: z.string().uuid("ID de caso inválido"),
  inicialesAlumno: z
    .string()
    .trim()
    .min(2, "Las iniciales son obligatorias")
    .max(10, "Las iniciales son demasiado largas"),
  centroNombre: z
    .string()
    .trim()
    .min(2, "El centro es obligatorio")
    .max(160, "El nombre del centro es demasiado largo"),
});

const deleteCasoSchema = z.object({
  id: z.string().uuid("ID de caso inválido"),
});

function normalizeInitials(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

function normalizeCenter(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function buildSearchSlug(initials: string, center: string) {
  return `${normalizeInitials(initials)}|${normalizeCenter(center).toLowerCase()}`;
}

function isMissingTableError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42P01"
  );
}

function isUniqueViolationError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function isPermissionError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42501"
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
    const q = (searchParams.get("q") || "").trim();
    const center = (searchParams.get("centro") || "").trim();
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || "20")),
    );

    let query = supabase
      .from("casos_intervencion")
      .select(
        "id, iniciales_alumno, centro_nombre, slug_busqueda, created_at, updated_at",
      )
      .eq("autor_id", session.user.id)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (q.length > 0) {
      const escaped = q.replace(/%/g, "\\%").replace(/_/g, "\\_");
      query = query.ilike("iniciales_alumno", `%${escaped}%`);
    }

    if (center.length > 0) {
      const escaped = center.replace(/%/g, "\\%").replace(/_/g, "\\_");
      query = query.ilike("centro_nombre", `%${escaped}%`);
    }

    const { data, error } = await query;
    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'casos_intervencion'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudieron cargar los casos" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, casos: data || [] });
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
    const parsed = createCasoSchema.parse(body);
    const iniciales = normalizeInitials(parsed.inicialesAlumno);
    const centro = normalizeCenter(parsed.centroNombre);
    const slug = buildSearchSlug(iniciales, centro);

    if (iniciales.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Las iniciales deben contener al menos 2 letras (ejemplo: JBL).",
        },
        { status: 400 },
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("casos_intervencion")
      .select("id")
      .eq("autor_id", session.user.id)
      .eq("iniciales_alumno", iniciales)
      .eq("centro_nombre", centro)
      .maybeSingle();

    if (existingError) {
      if (isMissingTableError(existingError)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'casos_intervencion'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      if (isPermissionError(existingError)) {
        return NextResponse.json(
          { success: false, error: "No tienes permisos para crear casos." },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudo validar si el caso ya existe." },
        { status: 500 },
      );
    }

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Ya existe un caso con esas iniciales y ese centro. Revisa el listado o usa otro identificador.",
        },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("casos_intervencion")
      .insert(
        {
          autor_id: session.user.id,
          iniciales_alumno: iniciales,
          centro_nombre: centro,
          slug_busqueda: slug,
          updated_at: new Date().toISOString(),
        },
      )
      .select(
        "id, iniciales_alumno, centro_nombre, slug_busqueda, created_at, updated_at",
      )
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'casos_intervencion'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      if (isUniqueViolationError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Ya existe un caso con esas iniciales y ese centro. Revisa el listado o usa otro identificador.",
          },
          { status: 409 },
        );
      }
      if (isPermissionError(error)) {
        return NextResponse.json(
          { success: false, error: "No tienes permisos para crear casos." },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudo crear el caso" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, caso: data });
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
    const parsed = updateCasoSchema.parse(body);
    const iniciales = normalizeInitials(parsed.inicialesAlumno);
    const centro = normalizeCenter(parsed.centroNombre);
    const slug = buildSearchSlug(iniciales, centro);

    const { data, error } = await supabase
      .from("casos_intervencion")
      .update({
        iniciales_alumno: iniciales,
        centro_nombre: centro,
        slug_busqueda: slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.id)
      .eq("autor_id", session.user.id)
      .select(
        "id, iniciales_alumno, centro_nombre, slug_busqueda, created_at, updated_at",
      )
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'casos_intervencion'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      if (isUniqueViolationError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Ya existe un caso con esas iniciales y ese centro. Usa otra combinación.",
          },
          { status: 409 },
        );
      }
      if (isPermissionError(error)) {
        return NextResponse.json(
          { success: false, error: "No tienes permisos para actualizar casos." },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar el caso" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, caso: data });
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
    const parsed = deleteCasoSchema.parse(body);

    const { data, error } = await supabase
      .from("casos_intervencion")
      .delete()
      .eq("id", parsed.id)
      .eq("autor_id", session.user.id)
      .select("id");

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Falta la tabla 'casos_intervencion'. Aplica el esquema de Intervenciones en Supabase.",
          },
          { status: 503 },
        );
      }
      if (isPermissionError(error)) {
        return NextResponse.json(
          { success: false, error: "No tienes permisos para eliminar casos." },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { success: false, error: "No se pudo eliminar el caso" },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se encontró el caso para eliminar" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, deletedId: data[0].id });
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
