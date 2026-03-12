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
      ? escapeHtml(recipientName.trim().split(/\s+/)[0])
      : "";
  const messageHtml = formatMessageToHtml(message);
  const preheader = escapeHtml(subject);

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${safeSubject}</title>
    </head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</span>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;background:#f3f4f6;">
        <tr>
          <td align="center" style="padding:48px 16px 56px;">

            <!-- Logo -->
            <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;border-collapse:collapse;">
              <tr>
                <td align="center" style="padding-bottom:28px;">
                  <img src="${homeUrl}/icons/logo-email.png" width="240" height="78" alt="Orientia" style="display:block;border:0;margin:0 auto;" />
                </td>
              </tr>
            </table>

            <!-- Card -->
            <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;border-collapse:collapse;background:#ffffff;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,0.06),0 8px 32px rgba(0,0,0,0.08);">
              <tr>
                <td style="padding:48px 48px 8px;">
                  <h1 style="margin:0 0 28px;font-size:22px;font-weight:700;line-height:1.3;color:#111827;letter-spacing:-0.02em;">${safeSubject}</h1>
                  <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:#374151;">
                    ${safeRecipientName ? `Hola <strong style="color:#111827;">${safeRecipientName}</strong>,` : "Hola,"}
                  </p>
                  <div style="font-size:15px;line-height:1.8;color:#374151;">
                    ${messageHtml.replace(/color:#1f2937/g, "color:#374151")}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 48px 40px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="background:#16a34a;border-radius:8px;">
                        <a href="${homeUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.01em;">
                          Acceder a Orientia
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;border-collapse:collapse;">
              <tr>
                <td align="center" style="padding-top:28px;">
                  <p style="margin:0;font-size:12px;line-height:1.7;color:#9ca3af;">
                    Has recibido este correo porque formas parte de las comunicaciones de Orientia.<br/>
                    <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Cancelar suscripción</a>
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
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
