import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname
      // Rutas de admin: requieren rol admin
      if (pathname.startsWith("/admin")) {
        return Boolean(token && (token as any).role === 'admin')
      }
      // Para el resto en el matcher: requiere estar autenticado
      return Boolean(token)
    },
  },
})

export const config = {
  matcher: [
    "/profile/:path*",
    "/alumnos/:path*",
    "/informes/:path*",
    "/centros/:path*",
    "/admin/:path*",
  ],
}
