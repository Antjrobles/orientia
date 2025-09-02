import { withAuth } from "next-auth/middleware"

// El middleware se aplica a las rutas que coinciden con el matcher
// y redirige al login si el usuario no está autenticado.
export default withAuth({
  pages: {
    signIn: "/login", // Redirige a la página de login si no está autorizado
  },
})

// Rutas protegidas que requieren autenticación
export const config = {
  matcher: [
    "/profile/:path*",
    "/alumnos/:path*",
    "/informes/:path*",
    "/centros/:path*",
  ],
}