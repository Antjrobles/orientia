import "server-only";
import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  clearLoginFailures,
  isLoginBlocked,
  registerLoginFailure,
} from "@/lib/brute-force";
import {
  DEVICE_COOKIE_NAME,
  TRUSTED_DEVICE_COOKIE_NAME,
  getCookieFromHeader,
  parseTrustedDeviceCookieValue,
} from "@/lib/device";
import { validateTurnstileToken } from "@/lib/turnstile";
import { isPasswordExpired } from "@/lib/user-password-policy";

// Es una buena práctica crear el cliente de Supabase en un archivo separado
// para poder reutilizarlo en otras partes de la aplicación (ej. en la API de registro).
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

type HeaderInput = Headers | Record<string, string | string[] | undefined> | undefined;

function toHeaders(input: HeaderInput) {
  if (!input) return new Headers();
  if (input instanceof Headers) return input;
  const headers = new Headers();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") headers.append(key, item);
      }
      continue;
    }
    if (typeof value === "string") {
      headers.set(key, value);
    }
  }
  return headers;
}

function getRequestOrigin(
  req: { headers?: Headers | Record<string, string | string[] | undefined> } | undefined,
) {
  if (!req) return process.env.NEXTAUTH_URL || "";
  const headers = toHeaders(req.headers);
  const proto = headers.get("x-forwarded-proto") || "https";
  const host =
    headers.get("x-forwarded-host") || headers.get("host") || "";
  if (!host) return process.env.NEXTAUTH_URL || "";
  return `${proto}://${host}`;
}

function getDeviceIdFromReq(
  req: { headers?: Headers | Record<string, string | string[] | undefined> } | undefined,
) {
  if (!req) return null;
  const cookie = toHeaders(req.headers).get("cookie");
  return getCookieFromHeader(cookie, DEVICE_COOKIE_NAME);
}

function getTrustedDeviceCookieFromReq(
  req: { headers?: Headers | Record<string, string | string[] | undefined> } | undefined,
) {
  if (!req) return null;
  const cookie = toHeaders(req.headers).get("cookie");
  return getCookieFromHeader(cookie, TRUSTED_DEVICE_COOKIE_NAME);
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function getCurrentRequestOrigin() {
  const requestHeaders = await headers();
  const proto = requestHeaders.get("x-forwarded-proto") || "https";
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "";
  if (!host) return process.env.NEXTAUTH_URL || "";
  return `${proto}://${host}`;
}

async function getCurrentRequestDeviceId() {
  const cookieStore = await cookies();
  return cookieStore.get(DEVICE_COOKIE_NAME)?.value ?? null;
}

async function isTrustedDevice(userId: string, trustedCookieValue: string | null | undefined) {
  const trustedCookie = parseTrustedDeviceCookieValue(trustedCookieValue, userId);
  if (!trustedCookie) return null;

  const { data: trusted, error } = await supabase
    .from("trusted_devices")
    .select("id")
    .eq("user_id", userId)
    .eq("device_id", trustedCookie.d)
    .single();

  if (error || !trusted) {
    return null;
  }

  return trustedCookie.d;
}

async function sendDeviceVerificationIfNeeded(input: {
  userId: string;
  email: string;
  name?: string | null;
  deviceId: string | null;
  ip: string;
  origin: string;
}) {
  if (!input.deviceId || !input.origin) {
    return false;
  }

  const { data: trusted, error: trustedError } = await supabase
    .from("trusted_devices")
    .select("id")
    .eq("user_id", input.userId)
    .eq("device_id", input.deviceId)
    .single();

  const alreadyTrusted = Boolean(trusted) && !trustedError;
  if (alreadyTrusted) {
    return true;
  }

  const rl = await checkRateLimit(`device-verify:${input.userId}:${input.ip}`, 3, 60_000);
  if (rl.allowed) {
    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await supabase.from("device_verification_tokens").insert({
      user_id: input.userId,
      device_id: input.deviceId,
      token_hash: tokenHash,
      expires,
      used_at: null,
    });

    const verifyUrl = `${input.origin}/verify-device?token=${encodeURIComponent(token)}`;
    await fetch(`${input.origin}/api/send-device-verification-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: input.email,
        name: input.name ?? "usuario",
        verifyUrl,
      }),
    });
  }

  return false;
}

// Construye la lista de proveedores de forma condicional según env vars
const providers: AuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  );
}

if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    }),
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  );
}

providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "tu@email.com" },
      password: { label: "Contraseña", type: "password" },
      deviceId: { label: "DeviceId", type: "text" },
      turnstileToken: { label: "TurnstileToken", type: "text" },
    },
    async authorize(credentials, req) {
      if (!credentials?.email || !credentials.password) {
        return null;
      }

      const turnstileRequired = process.env.NODE_ENV !== "development";
      const turnstileToken =
        typeof credentials.turnstileToken === "string"
          ? credentials.turnstileToken.trim()
          : "";

      if (turnstileRequired) {
        if (!turnstileToken) {
          throw new Error("SecurityVerificationFailed");
        }

        const isValidTurnstile = await validateTurnstileToken(turnstileToken);
        if (!isValidTurnstile) {
          throw new Error("SecurityVerificationFailed");
        }
      }

      const email = normalizeEmail(credentials.email);
      const ip = getClientIp({ headers: toHeaders(req?.headers) });
      const blocked = await isLoginBlocked(ip, email);
      if (blocked.blocked) {
        throw new Error("TooManyLoginAttempts");
      }

      const { data: user } = await supabase
        .from("users")
        .select("*, hashed_password, emailVerified") // Incluir emailVerified
        .ilike("email", email)
        .single();

      if (!user || !user.hashed_password) {
        await registerLoginFailure(ip, email);
        return null;
      }

      // Verificar si el email está verificado (solo para usuarios con contraseña)
      if (!user.emailVerified) {
        await registerLoginFailure(ip, email);
        // Devolvemos null para provocar CredentialsSignin.
        // La UI hará una comprobación posterior para diferenciar email no verificado.
        return null;
      }

      const passwordsMatch = await bcrypt.compare(
        credentials.password,
        user.hashed_password,
      );

      if (passwordsMatch) {
        if (isPasswordExpired(user as Record<string, unknown>)) {
          throw new Error("PasswordExpired");
        }

        await clearLoginFailures(ip, email);

        const skipDeviceVerification = process.env.NODE_ENV === "development";
        const deviceIdFromCredentials =
          typeof credentials.deviceId === "string" &&
          credentials.deviceId.trim().length > 0
            ? credentials.deviceId.trim()
            : null;
        const deviceId =
          deviceIdFromCredentials || getDeviceIdFromReq(req) || crypto.randomUUID();
        const isTrusted = await sendDeviceVerificationIfNeeded({
          userId: user.id,
          email: user.email,
          name: user.name,
          deviceId,
          ip,
          origin: getRequestOrigin(req),
        });
        if (!isTrusted && !skipDeviceVerification) {
          throw new Error("DeviceVerificationRequired");
        }
        // Devuelve solo los datos necesarios para la sesión, excluyendo la contraseña
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          deviceId,
          provider: "credentials",
        };
      }

      await registerLoginFailure(ip, email);
      return null;
    },
  }),
);

export const authOptions: AuthOptions = {
  providers,
  // adapter: SupabaseAdapter({
  //   url: process.env.SUPABASE_URL as string,
  //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  // }),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      // En producción, es buena idea usar el prefijo __Secure-
      // pero requiere que el sitio se sirva sobre HTTPS.
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Si tu dominio de producción es .antjrobles.tech, podrías añadir:
        // domain: process.env.NODE_ENV === "production" ? ".antjrobles.tech" : "localhost"
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirige errores de OAuth al login
  },
  callbacks: {
    async signIn({ user, account }) {
      if (
        account?.provider === "google" ||
        account?.provider === "facebook" ||
        account?.provider === "apple"
      ) {
        if (!user.email) {
          return false; // Bloquea el inicio de sesión si no hay email
        }
        const email = normalizeEmail(user.email);
        let userId: string | null = null;
        try {
          const { data: existingUser, error: selectError } = await supabase
            .from("users")
            .select("id, name, email")
            .ilike("email", email)
            .single();

          // Ignoramos el error que indica que no se encontró el usuario, que es lo esperado para nuevos registros.
          if (selectError && selectError.code !== "PGRST116") {
            throw selectError;
          }

          if (existingUser) {
            // El usuario ya existe, no hacemos nada con su rol.
            // Opcional: podríamos actualizar su nombre o imagen si han cambiado en Google.
            userId = existingUser.id;
          } else {
            // El usuario es nuevo, lo insertamos con el rol por defecto.
            const { data: insertedUser, error: insertError } = await supabase
              .from("users")
              .insert({
                name: user.name,
                email,
                image: user.image,
                role: "usuario", // Asignamos el rol por defecto
              })
              .select("id")
              .single();

            if (insertError) throw insertError;
            userId = insertedUser?.id ?? null;
          }

          const skipDeviceVerification = process.env.NODE_ENV === "development";
          if (!skipDeviceVerification && userId) {
            const currentDeviceId = await getCurrentRequestDeviceId();
            const requestOrigin = await getCurrentRequestOrigin();
            const requestHeaders = await headers();
            const ip = getClientIp({ headers: requestHeaders });
            const trustedCookieStore = await cookies();
            const trustedCookieValue =
              trustedCookieStore.get(TRUSTED_DEVICE_COOKIE_NAME)?.value ?? null;
            const trustedDeviceId = await isTrustedDevice(userId, trustedCookieValue);

            if (!trustedDeviceId) {
              const isTrustedNow = await sendDeviceVerificationIfNeeded({
                userId,
                email,
                name: user.name,
                deviceId: currentDeviceId,
                ip,
                origin: requestOrigin,
              });

              if (!isTrustedNow) {
                return "/login?error=DeviceVerificationRequired";
              }
            }
          }
        } catch {
          return false; // Bloquea el inicio de sesión si hay un error de base de datos
        }
      }
      return true; // Permite el inicio de sesión para todos los demás casos
    },
    async jwt({ token, user, account }) {
      // Al iniciar sesión (cuando el objeto 'user' está disponible),
      // buscamos al usuario en nuestra base de datos para obtener el ID (UUID) y el rol correctos.
      if (user) {
        const email = user.email ? normalizeEmail(user.email) : null;
        const { data: dbUser } = await supabase
          .from("users")
          .select("id, role") // Obtenemos el ID de la BD y el rol
          .ilike("email", email!)
          .single();

        // Si encontramos al usuario, enriquecemos el token con los datos de la BD.
        if (dbUser) {
          token.sub = dbUser.id; // ¡Esta es la corrección clave! Usamos el UUID de la base de datos.
          token.role = dbUser.role;

          const rawDeviceId = (user as { deviceId?: string } | null)?.deviceId;
          const cookieStore = await cookies();
          const trustedCookieValue =
            cookieStore.get(TRUSTED_DEVICE_COOKIE_NAME)?.value ??
            getTrustedDeviceCookieFromReq({ headers: await headers() });
          const trustedDeviceId = await isTrustedDevice(dbUser.id, trustedCookieValue);
          const deviceId =
            rawDeviceId ??
            trustedDeviceId ??
            (token as { deviceId?: string }).deviceId ??
            cookieStore.get(DEVICE_COOKIE_NAME)?.value;
          if (deviceId) {
            (token as { deviceId?: string }).deviceId = deviceId;
          }

          const authProvider =
            account?.provider ??
            (user as { provider?: string } | null)?.provider ??
            (token as { provider?: string }).provider;
          if (authProvider) {
            (token as { provider?: string }).provider = authProvider;
          }

          if (deviceId) {
            (token as { deviceVerified?: boolean }).deviceVerified =
              trustedDeviceId === deviceId;
          } else {
            (token as { deviceVerified?: boolean }).deviceVerified = false;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pasamos los datos del token (id y rol) al objeto de sesión
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        if (token.role) session.user.role = token.role as string;
      }
      return session;
    },
  },
};
