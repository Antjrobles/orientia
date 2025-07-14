import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Rutas que requieren que el usuario esté autenticado.
 * Cualquier ruta que comience con estos prefijos estará protegida.
 */
const PROTECTED_ROUTES = ['/profile', '/nuevo-informe', '/admin']

const AUTH_ROUTES = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  })
  console.log('[Middleware] Path:', req.nextUrl.pathname)
  console.log('[Middleware] Token:', token)

  const { pathname } = req.nextUrl
  const isUserAuthenticated = !!token

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // 1. Si el usuario intenta acceder a una ruta protegida SIN estar logueado,
  // lo mandamos a la página de login.
  if (isProtectedRoute && !isUserAuthenticated) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Si el usuario YA ESTÁ logueado e intenta acceder a /login o /register,
  // lo mandamos a su perfil.
  if (isAuthRoute && isUserAuthenticated) {
    const url = req.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  // 3. Si el usuario está logueado pero intenta acceder a /admin SIN ser admin,
  // lo mandamos a su perfil.
  if (pathname.startsWith('/admin') && token?.role !== 'admin') {
    const url = req.nextUrl.clone()
    url.pathname = '/profile' // O a la home '/' si lo prefieres
    return NextResponse.redirect(url)
  }

  // 4. Si no se cumple ninguna de las condiciones anteriores, dejamos que continúe.
  return NextResponse.next()
}

export const config = {
  /*
   * El matcher evita que el middleware se ejecute en peticiones de archivos estáticos,
   * imágenes o rutas de API, mejorando la eficiencia.
   */
  matcher: [
    // Excluye rutas de API, archivos estáticos, imágenes y archivos con extensión.
    '/((?!api/|_next/static|_next/image|.*\\..*).*)',
  ],
}
