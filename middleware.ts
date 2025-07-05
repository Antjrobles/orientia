import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Rutas que requieren que el usuario esté autenticado.
 * Cualquier ruta que comience con estos prefijos estará protegida.
 */
const PROTECTED_ROUTES = ['/profile', '/nuevo-informe']

/**
 * Rutas públicas principales.
 */
const PUBLIC_ROUTES = ['/']

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl
  const isUserAuthenticated = !!token

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  // 1. Si el usuario intenta acceder a una ruta protegida SIN estar logueado,
  // lo mandamos a la página de inicio para que acceda.
  if (isProtectedRoute && !isUserAuthenticated) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    // Opcional: podrías redirigir a una página de login específica si la tuvieras.
    // url.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(url)
  }

  // 2. Si no se cumple la condición anterior, dejamos que continúe.
  return NextResponse.next()
}

export const config = {
  /*
   * El matcher evita que el middleware se ejecute en peticiones de archivos estáticos,
   * imágenes o rutas de la API de autenticación, mejorando la eficiencia.
   */
  matcher: [
    '/((?!api/auth|_next/static|_next/image|icons|.*\\..*).*)',
  ],
}
