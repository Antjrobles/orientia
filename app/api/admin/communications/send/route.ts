import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { createUnsubscribeToken } from "@/lib/communications-unsubscribe-token";
import { getOptOutEmailSet } from "@/lib/communications-optout";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SendSchema = z.object({
  subject: z.string().trim().min(3, "Asunto obligatorio").max(180),
  message: z.string().trim().min(20, "Mensaje demasiado corto").max(10000),
  recipientIds: z.array(z.string().uuid()).min(1, "Selecciona contactos"),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMessageToHtml(message: string) {
  const normalized = message.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return "";

  return paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.75;color:#1f2937;">${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

function toHtmlBody(input: {
  message: string;
  subject: string;
  recipientName?: string | null;
  unsubscribeUrl: string;
  homeUrl: string;
}) {
  const { message, subject, recipientName, unsubscribeUrl, homeUrl } = input;
  const safeSubject = escapeHtml(subject);
  const safeRecipientName =
    recipientName && recipientName.trim().length > 0
      ? escapeHtml(recipientName.trim())
      : "";
  const messageHtml = formatMessageToHtml(message);
  const preheader = "Novedades y mejoras en la plataforma de Orientia.";

  return `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
      <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
        ${preheader}
      </span>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f8fafc;">
        <tr>
          <td style="padding:0 0 24px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;background:#ffffff;">
              <tr>
                <td style="height:6px;line-height:6px;font-size:0;background:#16a34a;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding:22px 34px 8px 34px;">
                  <img src="https://www.orientia.es/icons/logo-250.png" alt="Orientia" width="170" style="display:block;border:0;outline:none;text-decoration:none;" />
                </td>
              </tr>
              <tr>
                <td style="padding:8px 34px 12px 34px;">
                  <h1 style="margin:0 0 18px 0;font-size:31px;line-height:1.22;color:#14532d;font-weight:800;">
                    ${safeSubject}
                  </h1>
                  <p style="margin:0 0 16px 0;font-size:17px;line-height:1.7;color:#1f2937;">
                    ${safeRecipientName ? `Hola ${safeRecipientName},` : "Hola,"}
                  </p>
                  ${messageHtml}
                  <p style="margin:18px 0 0 0;font-size:16px;line-height:1.75;color:#1f2937;">
                    Gracias por tu confianza.
                  </p>
                  <p style="margin:6px 0 0 0;font-size:16px;line-height:1.75;color:#1f2937;font-weight:700;">
                    Equipo de Orientia
                  </p>
                  <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:18px;">
                    <tr>
                      <td style="background:#16a34a;border-radius:8px;">
                        <a href="${homeUrl}" style="display:inline-block;padding:12px 20px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
                          Abrir Orientia
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 34px 24px 34px;background:#f0fdf4;border-top:1px solid #bbf7d0;">
                  <p style="margin:0;font-size:12px;line-height:1.65;color:#166534;">
                    Has recibido este correo porque formas parte de nuestra base de comunicaciones.
                    Si prefieres no recibir más emails, puedes
                    <a href="${unsubscribeUrl}" style="color:#166534;font-weight:700;text-decoration:underline;"> gestionar tu baja aquí</a>.
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
  if (!process.env.NEXTAUTH_SECRET) {
    return NextResponse.json(
      { success: false, error: "Falta configurar NEXTAUTH_SECRET" },
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

  const optOutSet = await getOptOutEmailSet();
  const recipients = [...uniqueByEmail.entries()].map(([email, meta]) => ({
    email,
    id: meta.id,
    name: meta.name,
  }));
  const eligibleRecipients = recipients.filter(
    (item) => !optOutSet.has(item.email),
  );

  if (eligibleRecipients.length === 0) {
    return NextResponse.json(
      { success: false, error: "No hay correos válidos para enviar." },
      { status: 400 },
    );
  }

  const failures: Array<{ email: string; status: number }> = [];
  let sent = 0;

  for (const recipient of eligibleRecipients) {
    const token = createUnsubscribeToken(recipient.email);
    const baseUrl = request.nextUrl.origin;
    const unsubscribeUrl = `${baseUrl}/comunicaciones/baja?token=${encodeURIComponent(token)}`;
    const html = toHtmlBody({
      message,
      subject,
      recipientName: recipient.name,
      unsubscribeUrl,
      homeUrl: baseUrl,
    });

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
    skippedOptOut: recipients.length - eligibleRecipients.length,
    failures,
    requested: recipientIds.length,
    resolvedRecipients: eligibleRecipients.length,
  });
}
