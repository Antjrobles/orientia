import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateTurnstileToken } from "@/lib/turnstile";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Esquema de validación con Zod
const registerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email no válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(
      /[^A-Za-z0-9]/,
      "La contraseña debe contener al menos un carácter especial"
    ),
  turnstileToken: z.string().min(1, "Token de seguridad requerido"),
});

export async function POST(request: Request) {
  try {
    // Rate limiting por IP (5 solicitudes por minuto)
    const ip = getClientIp(request);
    const rl = checkRateLimit(`register:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Inténtalo de nuevo más tarde." },
        { status: 429 },
      );
    }
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 },
      );
    }

    const { name, email, password, turnstileToken } = validation.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Validar el token de Turnstile (CAPTCHA)
    const isValidCaptcha = await validateTurnstileToken(turnstileToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: "Verificación de seguridad fallida. Por favor, inténtalo de nuevo." },
        { status: 400 },
      );
    }

    // 2. Comprobar si el usuario ya existe
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("email")
      .ilike("email", normalizedEmail)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe un usuario con este email" },
        { status: 409 },
      ); // 409 Conflict
    }

    // Ignoramos el error específico que indica que no se encontró ninguna fila, que es lo esperado.
    if (existingUserError && existingUserError.code !== "PGRST116") {
      throw existingUserError;
    }

    // 3. Hashear (cifrar) la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Generar token de verificación
    const verificationToken = crypto.randomUUID();

    // 5. Insertar el nuevo usuario en la base de datos
    const { error: insertError } = await supabase.from("users").insert({
      name,
      email: normalizedEmail,
      hashed_password: hashedPassword,
      role: "usuario", // USUARIO POR DEFECTO
      emailVerified: null, // No verificado inicialmente
    });

    if (insertError) {
      console.error("Error al insertar en Supabase:", insertError);
      return NextResponse.json(
        { error: "No se pudo crear el usuario" },
        { status: 500 },
      );
    }

    // 6. Guardar token de verificación (rate limit por email)
    const rlEmail = checkRateLimit(`register-email:${email}`, 3, 60_000);
    if (!rlEmail.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos para este email. Prueba más tarde." },
        { status: 429 },
      );
    }
    const { error: tokenError } = await supabase
      .from("verification_tokens")
      .insert({
        identifier: normalizedEmail,
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      });

    if (tokenError) {
      console.error("Error al crear token:", tokenError);
    }

    // 7. Enviar email de verificación
    try {
      const origin =
        "nextUrl" in request ? (request as any).nextUrl.origin : process.env.NEXTAUTH_URL;
      if (!origin) {
        throw new Error("Missing origin for verification email");
      }
      const verificationUrl = `${origin}/verify-email?token=${verificationToken}`;

      await fetch(`${origin}/api/send-verification-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          name,
          verificationUrl,
        }),
      });
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
    }

    // 8. Devolver una respuesta de éxito
    return NextResponse.json(
      {
        message:
          "Usuario creado correctamente. Revisa tu email para verificar tu cuenta.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error de registro:", error);
    return NextResponse.json(
      { error: "Error Interno del Servidor" },
      { status: 500 },
    );
  }
}
