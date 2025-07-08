import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        // El objeto 'profile' de Google tiene más propiedades que el tipo 'Profile' por defecto.
        // Usamos `as any` para indicarle a TypeScript que permita el acceso a `email_verified`.
        return (profile as any)?.email_verified ?? false;
      }
      return true;
    },
    async session({ session, token }) {
      // Añade el ID del usuario (del token JWT) al objeto de la sesión del cliente.
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};
