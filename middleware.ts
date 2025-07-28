import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { JWT } from 'next-auth/jwt'

// Extend the JWT type to include our custom role property
declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'admin' | 'usuario'
  }
}

/**
 * Rutas que requieren que el usuario esté autenticado.
 * Cualquier ruta que comience con estos prefijos estará protegida.
 */
const PROTECTED_ROUTES = ['/profile', '/profile/generar-informe']

const AUTH_ROUTES = ['/login', '/register']

/**
 * Rutas que requieren rol de admin.
 * Se manejan por separado de las rutas protegidas normales.
 */
const ADMIN_ROUTES = ['/admin']

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not defined')
  }

  const token: JWT | null = await getToken({
    req,
    secret,
    secureCookie: process.env.NODE_ENV === 'production',
  })

  // Solo log en desarrollo y para rutas importantes
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Path:', req.nextUrl.pathname)
    if (token) {
      console.log('[Middleware] User role:', token?.role)
    }
  }

  const { pathname } = req.nextUrl
  const isUserAuthenticated = !!token

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))

  // 1. PRIMERO: Validación específica para rutas de admin
  if (isAdminRoute) {
    // Si no está autenticado, lo mandamos al login
    if (!isUserAuthenticated) {
      // Redirecting to login
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Si está autenticado pero no es admin, lo mandamos a not-permitted
    if (token?.role !== 'admin') {
      // Access denied to admin
      const url = req.nextUrl.clone()
      url.pathname = '/not-permitted'
      return NextResponse.redirect(url)
    }

    // Admin access granted
    return NextResponse.next()
  }

  // 2. Si el usuario no está autenticado e intenta acceder a una ruta protegida,
  // lo mandamos a la página de login.
  if (isProtectedRoute && !isUserAuthenticated) {
    // Redirecting to login
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. Si el usuario YA ESTÁ logueado e intenta acceder a /login o /register,
  // lo mandamos a su perfil.
  if (isAuthRoute && isUserAuthenticated) {
    // Redirecting to profile
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