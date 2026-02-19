import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addOptOutEmail } from "@/lib/communications-optout";
import { parseUnsubscribeToken } from "@/lib/communications-unsubscribe-token";

const Schema = z.object({
  token: z.string().min(1, "Token requerido"),
});

export async function POST(request: NextRequest) {
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
      { success: false, error: "Token inválido" },
      { status: 400 },
    );
  }

  const tokenData = parseUnsubscribeToken(parsed.data.token);
  if (!tokenData.ok) {
    return NextResponse.json(
      { success: false, error: "Enlace inválido o expirado" },
      { status: 400 },
    );
  }

  const result = await addOptOutEmail({
    email: tokenData.email,
    reason: "unsubscribe_link",
    source: "email_link",
  });

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: "No se pudo registrar la baja" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    alreadyExisted: result.alreadyExisted,
    email: tokenData.email,
  });
}

