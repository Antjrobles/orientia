import { MetadataRoute } from 'next';

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://www.orientia.es';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

/**
 * robots.txt moderno y mantenible:
 * - reglas globales + posibilidad de reglas específicas por bot
 * - rutas privadas y de app bloqueadas de indexación
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Autenticación / áreas privadas
          '/login',
          '/register',
          '/profile',
          '/alumnos',
          '/informes',
          '/centros',
          '/admin',
          // Rutas técnicas que no aportan valor SEO
          '/api',
          '/_next',
          '/static',
          // Páginas con querystrings (si tu buscador usa /buscar?q=…, deja esta línea comentada)
          // '/*?*',
        ],
      },
      // 👇 Ejemplo opcional: tratar a ciertos bots de forma distinta
      // { userAgent: 'GPTBot', disallow: '/' },
      // { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // host ya no es necesario, los buscadores priorizan el sitemap
  };
}
