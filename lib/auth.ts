import "server-only";
import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { DEVICE_COOKIE_NAME, getCookieFromHeader } from "@/lib/device";

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
  return new Headers(input);
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

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Construye la lista de proveedores de forma condicional según env vars
const providers: Provider[] = [];

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
    },
    async authorize(credentials, req) {
      if (!credentials?.email || !credentials.password) {
        return null;
      }

      const email = normalizeEmail(credentials.email);
      const { data: user } = await supabase
        .from("users")
        .select("*, hashed_password, emailVerified") // Incluir emailVerified
        .ilike("email", email)
        .single();

      if (!user || !user.hashed_password) {
        return null;
      }

      // Verificar si el email está verificado (solo para usuarios con contraseña)
      if (!user.emailVerified) {
        // Devolvemos null para provocar CredentialsSignin.
        // La UI hará una comprobación posterior para diferenciar email no verificado.
        return null;
      }

      const passwordsMatch = await bcrypt.compare(
        credentials.password,
        user.hashed_password,
      );

      if (passwordsMatch) {
        const deviceIdFromCredentials =
          typeof credentials.deviceId === "string" &&
          credentials.deviceId.trim().length > 0
            ? credentials.deviceId.trim()
            : null;
        const deviceId =
          deviceIdFromCredentials || getDeviceIdFromReq(req) || crypto.randomUUID();
        const { data: trusted, error: trustedError } = await supabase
          .from("trusted_devices")
          .select("id")
          .eq("user_id", user.id)
          .eq("device_id", deviceId)
          .single();

        const isTrusted = Boolean(trusted) && !trustedError;
        if (!isTrusted) {
          const origin = getRequestOrigin(req);
          const ip = getClientIp({ headers: toHeaders(req?.headers) });
          const rl = checkRateLimit(`device-verify:${user.id}:${ip}`, 3, 60_000);

          if (rl.allowed && origin) {
            const token = crypto.randomBytes(32).toString("base64url");
            const tokenHash = hashToken(token);
            const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

            await supabase.from("device_verification_tokens").insert({
              user_id: user.id,
              device_id: deviceId,
              token_hash: tokenHash,
              expires,
              used_at: null,
            });

            const verifyUrl = `${origin}/verify-device?token=${encodeURIComponent(token)}`;
            await fetch(`${origin}/api/send-device-verification-email`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name ?? "usuario",
                verifyUrl,
              }),
            });
          }

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
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!user.email) {
          return false; // Bloquea el inicio de sesión si no hay email
        }
        const email = normalizeEmail(user.email);
        try {
          const { data: existingUser, error: selectError } = await supabase
            .from("users")
            .select("id")
            .ilike("email", email)
            .single();

          // Ignoramos el error que indica que no se encontró el usuario, que es lo esperado para nuevos registros.
          if (selectError && selectError.code !== "PGRST116") {
            throw selectError;
          }

          if (existingUser) {
            // El usuario ya existe, no hacemos nada con su rol.
            // Opcional: podríamos actualizar su nombre o imagen si han cambiado en Google.
            return true;
          } else {
            // El usuario es nuevo, lo insertamos con el rol por defecto.
            const { error: insertError } = await supabase.from("users").insert({
              name: user.name,
              email,
              image: user.image,
              role: "usuario", // Asignamos el rol por defecto
            });

            if (insertError) throw insertError;
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
          const deviceId = rawDeviceId ?? (token as { deviceId?: string }).deviceId;
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

          if (authProvider === "credentials") {
            if (deviceId) {
              const { data: trusted, error: trustedError } = await supabase
                .from("trusted_devices")
                .select("id")
                .eq("user_id", dbUser.id)
                .eq("device_id", deviceId)
                .single();
              (token as { deviceVerified?: boolean }).deviceVerified =
                Boolean(trusted) && !trustedError;
            } else {
              (token as { deviceVerified?: boolean }).deviceVerified = false;
            }
          } else {
            (token as { deviceVerified?: boolean }).deviceVerified = true;
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
