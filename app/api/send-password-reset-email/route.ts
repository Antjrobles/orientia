import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  resetUrl: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const { email, name, resetUrl } = parsed.data;
    if (!process.env.PLUNK_API_KEY) {
      console.error("PLUNK_API_KEY is missing");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const response = await fetch("https://api.useplunk.com/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
      },
      body: JSON.stringify({
        to: email,
        subject: "Restablece tu contraseña en Orientia",
        body: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Restablece tu contraseña - Orientia</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #059669; margin-bottom: 10px;">Orientia</h1>
                <p style="color: #666; font-size: 16px;">Restablecimiento de contraseña</p>
              </div>

              <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">Hola ${name ?? "usuario"},</h2>
                <p style="margin-bottom: 20px;">
                  Hemos recibido una solicitud para restablecer tu contraseña. Si has sido tú, usa el siguiente enlace:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}"
                     style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Restablecer contraseña
                  </a>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
                  <a href="${resetUrl}" style="color: #059669; word-break: break-all;">${resetUrl}</a>
                </p>
              </div>

              <div style="text-align: center; color: #666; font-size: 12px;">
                <p>Este enlace expira en 60 minutos por seguridad.</p>
                <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("Plunk error:", response.status, text);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
