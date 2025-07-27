import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, verificationUrl } = await request.json();

    // Enviar email usando Plunk
    const response = await fetch('https://api.useplunk.com/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PLUNK_API_KEY}`,
      },
      body: JSON.stringify({
        to: email,
        subject: 'Verifica tu cuenta en Orientia',
        body: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Verifica tu cuenta - Orientia</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #059669; margin-bottom: 10px;">¡Bienvenido a Orientia!</h1>
                <p style="color: #666; font-size: 16px;">Plataforma para profesionales de la psicopedagogía</p>
              </div>

              <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">Hola ${name},</h2>
                <p style="margin-bottom: 20px;">
                  Gracias por registrarte en Orientia. Para completar tu registro y acceder a todas las funcionalidades,
                  necesitas verificar tu dirección de correo electrónico.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}"
                     style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Verificar mi cuenta
                  </a>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
                  <a href="${verificationUrl}" style="color: #059669; word-break: break-all;">${verificationUrl}</a>
                </p>
              </div>

              <div style="text-align: center; color: #666; font-size: 12px;">
                <p>Este enlace expirará en 24 horas por seguridad.</p>
                <p>Si no te registraste en Orientia, puedes ignorar este email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p>© 2025 Orientia - Plataforma de Psicopedagogía</p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error de Plunk:', errorData);
      throw new Error('Error enviando email con Plunk');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json(
      { success: false, error: 'Error enviando email' },
      { status: 500 }
    );
  }
}