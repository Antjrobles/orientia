import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const options = {
  ...authOptions,
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
