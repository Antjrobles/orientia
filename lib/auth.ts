import { type AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Es una buena práctica crear el cliente de Supabase en un archivo separado
// para poder reutilizarlo en otras partes de la aplicación (ej. en la API de registro).
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'tu@email.com' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[Authorize] Intentando autorizar:', credentials?.email);
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const { data: user } = await supabase
          .from('users')
          .select('*, hashed_password, emailVerified') // Incluir emailVerified
          .eq('email', credentials.email)
          .single();

        console.log('[Authorize] Usuario de la BD:', user);

        if (!user || !user.hashed_password) {
          console.log('[Authorize] Usuario no encontrado o sin contraseña.');
          return null;
        }

        // Verificar si el email está verificado (solo para usuarios con contraseña)
        if (!user.emailVerified) {
          console.log('[Authorize] Email no verificado.');
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.hashed_password);
        console.log('[Authorize] Las contraseñas coinciden:', passwordsMatch);

        if (passwordsMatch) {
          // Devuelve solo los datos necesarios para la sesión, excluyendo la contraseña
          console.log('[Authorize] Éxito, devolviendo objeto de usuario.');
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
    strategy: 'jwt',
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
        secure: process.env.NODE_ENV === 'production',
        // Si tu dominio de producción es .antjrobles.tech, podrías añadir:
        // domain: process.env.NODE_ENV === "production" ? ".antjrobles.tech" : "localhost"
      },
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirige errores de OAuth al login
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('[SignIn Callback] Provider:', account?.provider);
      console.log('[SignIn Callback] User:', user);

      if (account?.provider === 'google' || account?.provider === 'facebook') {
        if (!user.email) {
          console.error('No se encontró un email en el perfil de Google.');
          return false; // Bloquea el inicio de sesión si no hay email
        }
        try {
          const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          // Ignoramos el error que indica que no se encontró el usuario, que es lo esperado para nuevos registros.
          if (selectError && selectError.code !== 'PGRST116') {
            throw selectError;
          }

          if (existingUser) {
            // El usuario ya existe, no hacemos nada con su rol.
            // Opcional: podríamos actualizar su nombre o imagen si han cambiado en Google.
            return true;
          } else {
            // El usuario es nuevo, lo insertamos con el rol por defecto.
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                name: user.name,
                email: user.email,
                image: user.image,
                role: 'usuario', // Asignamos el rol por defecto
              });

            if (insertError) throw insertError;
          }
        } catch (error) {
          console.error(`Error al guardar/actualizar el usuario de ${account?.provider} en la BD:`, error);
          return false; // Bloquea el inicio de sesión si hay un error de base de datos
        }
      }
      return true; // Permite el inicio de sesión para todos los demás casos
    },
    async jwt({ token, user }) {
      // Al iniciar sesión (cuando el objeto 'user' está disponible),
      // buscamos al usuario en nuestra base de datos para obtener el ID (UUID) y el rol correctos.
      if (user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, role') // Obtenemos el ID de la BD y el rol
          .eq('email', user.email!)
          .single();

        // Si encontramos al usuario, enriquecemos el token con los datos de la BD.
        if (dbUser) {
          token.sub = dbUser.id; // ¡Esta es la corrección clave! Usamos el UUID de la base de datos.
          token.role = dbUser.role;
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
