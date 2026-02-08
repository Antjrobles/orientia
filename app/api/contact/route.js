import Plunk from "@plunk/node";
import validator from "validator";
import { NextResponse } from "next/server";
import { validateTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const plunk = new Plunk(process.env.PLUNK_API_KEY);

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
      body: `
        <h1>Gracias por tu solicitud, ${name}!</h1>
        <p>Hemos recibido tu solicitud desde ${school} (${locality}, ${municipality}, ${province}).</p>
        <p>Mensaje: ${safeMessage || "No se proporcionó mensaje."}</p>
        <p>Te contactaremos pronto para proporcionarte más información.</p>
        <p>Atentamente,<br>El equipo de [Nombre de tu plataforma]</p>
      `,
    });

    // Optionally, send a notification email to your team
    await plunk.emails.send({
      to: "your-team-email@domain.com", // Replace with your team's email
      subject: "Nueva solicitud de contacto",
      body: `
        <h1>Nueva solicitud recibida</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Provincia:</strong> ${province}</p>
        <p><strong>Municipio:</strong> ${municipality}</p>
        <p><strong>Localidad:</strong> ${locality}</p>
        <p><strong>Centro Educativo:</strong> ${school}</p>
        <p><strong>Mensaje:</strong> ${safeMessage || "No se proporcionó mensaje."}</p>
      `,
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
