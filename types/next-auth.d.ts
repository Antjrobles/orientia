import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extiende los tipos de NextAuth para incluir nuestras propiedades personalizadas

declare module "next-auth" {
  /**
   * El objeto Session que se devuelve desde useSession() o getSession()
   */
  interface Session {
    user: {
      /** El rol del usuario */
      role?: string;
    } & DefaultSession["user"]; // Mantiene las propiedades por defecto (name, email, image)
  }
}

declare module "next-auth/jwt" {
  /** El token que se devuelve desde el callback jwt() */
  interface JWT {
    /** El rol del usuario */
    role?: string;
  }
}
