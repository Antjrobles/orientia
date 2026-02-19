import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { addOptOutEmail, removeOptOutEmail } from "@/lib/communications-optout";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const Schema = z.object({
  userId: z.string().uuid("Usuario inválido"),
  receiveCommunications: z.boolean(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" },
      { status: 400 },
    );
  }

  const { userId, receiveCommunications } = parsed.data;
  const { data: user, error } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId)
    .single();

  if (error || !user?.email) {
    return NextResponse.json(
      { success: false, error: "No se encontró el correo del usuario." },
      { status: 404 },
    );
  }

  const email = String(user.email).trim().toLowerCase();
  const result = receiveCommunications
    ? await removeOptOutEmail({ email })
    : await addOptOutEmail({
        email,
        reason: "admin_preference",
        source: "admin_panel",
      });

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: "No se pudo actualizar la preferencia." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    userId,
    email,
    communicationsOptOut: !receiveCommunications,
  });
}

