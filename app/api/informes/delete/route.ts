import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const DeleteInformeSchema = z.object({
  id: z.string().uuid("ID de informe inválido"),
});

const RestoreInformeSchema = z.object({
  id: z.string().uuid("ID de informe inválido"),
});

// DELETE — soft delete de un informe
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
    const { id } = DeleteInformeSchema.parse(body);

    const { data, error } = await supabase
      .from("informes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("autor_id", session.user.id)
      .is("deleted_at", null)
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "No se pudo eliminar el informe" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, deletedId: data.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message || "Datos inválidos",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// PATCH — restaurar un informe eliminado
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
    const { id } = RestoreInformeSchema.parse(body);

    const { data, error } = await supabase
      .from("informes")
      .update({ deleted_at: null })
      .eq("id", id)
      .eq("autor_id", session.user.id)
      .not("deleted_at", "is", null)
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "No se pudo restaurar el informe" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, restoredId: data.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message || "Datos inválidos",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
