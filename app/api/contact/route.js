import Plunk from "@plunk/node";
import validator from "validator";
import { NextResponse } from "next/server";
import { validateTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const plunk = new Plunk(process.env.PLUNK_API_KEY);
const BRAND = {
  name: "Orientia",
  from: "info@orientia.es",
  color: "#16a34a",
  logoUrl: "https://www.orientia.es/icons/logo2.svg",
  siteUrl: "https://www.orientia.es",
  privacyUrl: "https://www.orientia.es/privacidad",
};

function buildEmailHtml({ title, intro, contentHtml, footerNote }) {
  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f6f7f9;color:#111827;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f6f7f9;padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
                <tr>
                  <td style="padding:24px 28px;border-bottom:1px solid #e5e7eb;background:#ffffff;">
                    <div style="display:flex;align-items:center;gap:12px;">
                      <img src="${BRAND.logoUrl}" alt="${BRAND.name}" height="36" style="display:block;" />
                      <span style="font-size:18px;font-weight:700;color:#111827;">${BRAND.name}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;color:#111827;">${title}</h1>
                    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.6;color:#374151;">${intro}</p>
                    <div style="padding:16px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;">
                      ${contentHtml}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <p style="margin:18px 0 0 0;font-size:14px;color:#374151;">
                      Atentamente,<br />
                      <strong>Antonio Robles</strong><br />
                      ${BRAND.name}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 28px;background:${BRAND.color};color:#ffffff;font-size:12px;line-height:1.5;">
                    <div style="margin-bottom:6px;">${footerNote}</div>
                    <div>© ${new Date().getFullYear()} ${BRAND.name}. Todos los derechos reservados.</div>
                  </td>
                </tr>
              </table>
              <div style="max-width:640px;padding:14px 8px;color:#6b7280;font-size:11px;line-height:1.5;text-align:center;">
                Recibes este correo porque solicitaste información en ${BRAND.siteUrl}.
                Consulta nuestra política de privacidad en ${BRAND.privacyUrl}.
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function POST(request) {
  try {
    const { name, email, province, municipality, locality, school, message, turnstileToken } =
      await request.json();

    const ip = getClientIp(request);
    const rlIp = checkRateLimit(`contact:ip:${ip}`, 5, 10 * 60 * 1000);
    if (!rlIp.allowed) {
      return NextResponse.json(
        { message: "Demasiadas solicitudes desde esta IP. Inténtalo más tarde.", success: false },
        { status: 429 },
      );
    }

    // Validation
    if (!name || !email || !province || !municipality || !locality || !school) {
      return NextResponse.json(
        { message: "Todos los campos obligatorios deben ser completados", success: false },
        { status: 400 },
      );
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: "El email proporcionado no es válido", success: false },
        { status: 400 },
      );
    }
    const normalizedEmail = validator.normalizeEmail(email) || email.trim().toLowerCase();
    const rlEmail = checkRateLimit(`contact:email:${normalizedEmail}`, 3, 30 * 60 * 1000);
    if (!rlEmail.allowed) {
      return NextResponse.json(
        { message: "Demasiados envíos para este email. Inténtalo más tarde.", success: false },
        { status: 429 },
      );
    }

    const rawMessage = typeof message === "string" ? message.trim() : "";
    if (rawMessage.length > 2000) {
      return NextResponse.json(
        { message: "El mensaje no puede superar los 2000 caracteres.", success: false },
        { status: 400 },
      );
    }
    if (rawMessage && /<[^>]+>/.test(rawMessage)) {
      return NextResponse.json(
        { message: "El mensaje no puede contener HTML.", success: false },
        { status: 400 },
      );
    }
    const safeMessage = validator.escape(rawMessage);
    const safeMessageHtml = safeMessage.replace(/\n/g, "<br />");

    // Validar el token de Turnstile (CAPTCHA)
    if (!turnstileToken) {
      return NextResponse.json(
        { message: "Token de seguridad requerido", success: false },
        { status: 400 },
      );
    }

    const isValidCaptcha = await validateTurnstileToken(turnstileToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { message: "Verificación de seguridad fallida. Por favor, inténtalo de nuevo.", success: false },
        { status: 400 },
      );
    }

    // Send email using Plunk
    await plunk.emails.send({
      to: email, // Send confirmation email to the user
      subject: "Confirmación de solicitud de información",
      type: "html",
      from: BRAND.from,
      name: BRAND.name,
      body: buildEmailHtml({
        title: `Gracias por tu solicitud, ${validator.escape(name)}.`,
        intro:
          "Hemos recibido tu solicitud de información. Te contactaremos pronto para ayudarte.",
        contentHtml: `
          <p style="margin:0 0 10px 0;font-size:14px;color:#111827;">
            <strong>Centro:</strong> ${validator.escape(school)} (${validator.escape(locality)}, ${validator.escape(municipality)}, ${validator.escape(province)})
          </p>
          <p style="margin:0;font-size:14px;color:#111827;">
            <strong>Mensaje:</strong><br />
            ${safeMessageHtml || "No se proporcionó mensaje."}
          </p>
        `,
        footerNote: "Si no has solicitado esta información, puedes ignorar este mensaje.",
      }),
    });

    // Optionally, send a notification email to your team
    await plunk.emails.send({
      to: BRAND.from,
      subject: "Nueva solicitud de contacto",
      type: "html",
      from: BRAND.from,
      name: BRAND.name,
      body: buildEmailHtml({
        title: "Nueva solicitud recibida",
        intro: "Se ha registrado una nueva solicitud desde el formulario de contacto.",
        contentHtml: `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#111827;">
            <tr><td style="padding:6px 0;"><strong>Nombre:</strong></td><td style="padding:6px 0;">${validator.escape(name)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Email:</strong></td><td style="padding:6px 0;">${validator.escape(email)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Provincia:</strong></td><td style="padding:6px 0;">${validator.escape(province)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Municipio:</strong></td><td style="padding:6px 0;">${validator.escape(municipality)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Localidad:</strong></td><td style="padding:6px 0;">${validator.escape(locality)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Centro:</strong></td><td style="padding:6px 0;">${validator.escape(school)}</td></tr>
            <tr><td style="padding:6px 0;vertical-align:top;"><strong>Mensaje:</strong></td><td style="padding:6px 0;">${safeMessageHtml || "No se proporcionó mensaje."}</td></tr>
          </table>
        `,
        footerNote: "Este mensaje fue generado automáticamente por el formulario de Orientia.",
      }),
    });

    return NextResponse.json({
      message: "Solicitud enviada correctamente",
      success: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        message:
          "Error interno del servidor. Por favor, inténtalo de nuevo más tarde.",
        success: false,
      },
      { status: 500 },
    );
  }
}
