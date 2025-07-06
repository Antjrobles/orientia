import NextAuth, { type AuthOptions } from "next-auth";
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
    async signIn({ account, profile, user, credentials }) {
      console.log("Callback signIn called");
      console.log("Account:", account);
      console.log("Profile:", profile);
      console.log("User:", user);
      console.log("Credentials:", credentials);

      if (account?.provider === "google") {
        const emailVerified = profile?.email_verified ?? false;
        console.log("Google email verified:", emailVerified);
        return emailVerified;
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      console.log("Callback redirect called");
      console.log("url:", url);
      console.log("baseUrl:", baseUrl);
      // Puedes personalizar la redirección aquí
      return baseUrl;
    },

    async session({ session, token, user }) {
      console.log("Callback session called");
      console.log("Session:", session);
      console.log("Token:", token);
      console.log("User:", user);
      return session;
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("Callback jwt called");
      console.log("Token:", token);
      if (user) {
        console.log("User:", user);
      }
      return token;
    },
  },

  events: {
    signIn(message) {
      console.log("Event signIn:", message);
    },
    signOut(message) {
      console.log("Event signOut:", message);
    },
    error(message) {
      console.error("Event error:", message);
    },
  },

  debug: true, // Activa logs detallados de NextAuth
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };