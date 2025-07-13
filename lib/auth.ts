import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Es una buena práctica crear el cliente de Supabase en un archivo separado
// para poder reutilizarlo en otras partes de la aplicación (ej. en la API de registro).
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        console.log("[Authorize] Intentando autorizar:", credentials?.email);
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const { data: user } = await supabase
          .from("users")
          .select("*, hashed_password") // Asegúrate de seleccionar la nueva columna
          .eq("email", credentials.email)
          .single();

        console.log("[Authorize] Usuario de la BD:", user);

        if (!user || !user.hashed_password) {
          console.log("[Authorize] Usuario no encontrado o sin contraseña.");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.hashed_password);
        console.log("[Authorize] Las contraseñas coinciden:", passwordsMatch);

        if (passwordsMatch) {
          // Devuelve solo los datos necesarios para la sesión, excluyendo la contraseña
          console.log("[Authorize] Éxito, devolviendo objeto de usuario.");
          return { id: user.id, name: user.name, email: user.email, image: user.image };
        }

        return null;
      },
    }),
  ],
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
      name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production",
        // Si tu dominio de producción es .antjrobles.tech, podrías añadir:
        // domain: process.env.NODE_ENV === "production" ? ".antjrobles.tech" : "localhost"
      },
    },
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return (profile as any)?.email_verified ?? false;
      }
      return true;
    },
    async jwt({ token, user }) {
      console.log("[JWT Callback] Token recibido:", token);
      console.log("[JWT Callback] Usuario recibido:", user);
      if (user) {
        token.sub = user.id;
      }
      console.log("[JWT Callback] Token devuelto:", token);
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};