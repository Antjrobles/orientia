import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Rutas que requieren que el usuario esté autenticado.
 * Cualquier ruta que comience con estos prefijos estará protegida.
 */
const PROTECTED_ROUTES = ['/profile', '/nuevo-informe']

const AUTH_ROUTES = ['/login', '/register']

/**
 * Rutas que requieren rol de admin.
 * Se manejan por separado de las rutas protegidas normales.
 */
const ADMIN_ROUTES = ['/admin']

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  })

  console.log('[Middleware] Path:', req.nextUrl.pathname)
  console.log('[Middleware] Token:', token)
  console.log('[Middleware] User role:', token?.role)

  const { pathname } = req.nextUrl
  const isUserAuthenticated = !!token

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))

  // 1. PRIMERO: Validación específica para rutas de admin
  if (isAdminRoute) {
    // Si no está autenticado, lo mandamos al login
    if (!isUserAuthenticated) {
      console.log('[Middleware] Redirecting unauthenticated user from admin to login')
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Si está autenticado pero no es admin, lo mandamos a not-permitted
    if (token?.role !== 'admin') {
      console.log('[Middleware] Access denied to admin. User role:', token?.role)
      const url = req.nextUrl.clone()
      url.pathname = '/not-permitted'
      return NextResponse.redirect(url)
    }

    console.log('[Middleware] Admin access granted')
    return NextResponse.next()
  }

  // 2. Si el usuario no está autenticado e intenta acceder a una ruta protegida,
  // lo mandamos a la página de login.
  if (isProtectedRoute && !isUserAuthenticated) {
    console.log('[Middleware] Redirecting unauthenticated user to login')
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. Si el usuario YA ESTÁ logueado e intenta acceder a /login o /register,
  // lo mandamos a su perfil.
  if (isAuthRoute && isUserAuthenticated) {
    console.log('[Middleware] Redirecting authenticated user from auth routes to profile')
    const url = req.nextUrl.clone()
    url.pathname = '/profile'
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