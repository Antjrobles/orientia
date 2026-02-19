import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SendSchema = z.object({
  subject: z.string().trim().min(3, "Asunto obligatorio").max(180),
  message: z.string().trim().min(20, "Mensaje demasiado corto").max(10000),
  recipientIds: z.array(z.string().uuid()).min(1, "Selecciona destinatarias"),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toHtmlBody(message: string) {
  const safe = escapeHtml(message).replace(/\n/g, "<br />");
  return `
    <div style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
                  <h1 style="margin:0;font-size:18px;color:#065f46;">Orientia</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:24px;">
                  <div style="font-size:15px;line-height:1.7;color:#1f2937;">${safe}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px;background:#ecfdf5;border-top:1px solid #d1fae5;">
                  <p style="margin:0;font-size:12px;color:#065f46;">
                    Este correo se ha enviado a usuarias registradas en Orientia.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 403 },
    );
  }

  if (!process.env.PLUNK_API_KEY) {
    return NextResponse.json(
      { success: false, error: "Falta configurar PLUNK_API_KEY" },
      { status: 500 },
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

  const parsed = SendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message || "Datos inválidos",
      },
      { status: 400 },
    );
  }

  const { subject, message, recipientIds } = parsed.data;

  const { data: rows, error } = await supabase
    .from("users")
    .select("id, name, email")
    .in("id", recipientIds);

  if (error) {
    return NextResponse.json(
      { success: false, error: "No se pudieron cargar los destinatarios." },
      { status: 500 },
    );
  }

  const uniqueByEmail = new Map<string, { id: string; name: string | null }>();
  for (const row of rows || []) {
    const email = String(row.email || "").trim().toLowerCase();
    if (!email) continue;
    uniqueByEmail.set(email, {
      id: row.id as string,
      name: (row.name as string | null) ?? null,
    });
  }

  const recipients = [...uniqueByEmail.entries()].map(([email, meta]) => ({
    email,
    id: meta.id,
    name: meta.name,
  }));

  if (recipients.length === 0) {
    return NextResponse.json(
      { success: false, error: "No hay correos válidos para enviar." },
      { status: 400 },
    );
  }

  const html = toHtmlBody(message);
  const failures: Array<{ email: string; status: number }> = [];
  let sent = 0;

  for (const recipient of recipients) {
    const response = await fetch("https://api.useplunk.com/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
      },
      body: JSON.stringify({
        to: recipient.email,
        subject,
        type: "html",
        from: "info@orientia.es",
        name: "Orientia",
        body: html,
      }),
    });

    if (response.ok) {
      sent += 1;
      continue;
    }

    failures.push({ email: recipient.email, status: response.status });
  }

  return NextResponse.json({
    success: failures.length === 0,
    sent,
    failed: failures.length,
    failures,
    requested: recipientIds.length,
    resolvedRecipients: recipients.length,
  });
}

