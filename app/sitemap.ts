import { MetadataRoute } from "next";

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://orientia.es";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/**
 * sitemap.xml moderno:
 * - rutas públicas y legales
 * - campos opcionales: changeFrequency, priority
 * - preparado para i18n y futuras rutas dinámicas
 *
 * NOTA: /manual, /faq, /soporte, /formacion tienen robots noindex
 * y se excluyen del sitemap hasta que tengan contenido real.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastmod = "2026-03-03T00:00:00.000Z";

  const publicRoutes = ["/"];

  const legalRoutes = [
    "/privacidad",
    "/terminos",
    "/cookies",
    "/accesibilidad",
    "/rgpd",
    "/eliminacion-de-datos-de-usuario",
  ];

  // Si usas i18n, define aquí tus locales:
  // const locales = ['es', 'en']; // ejemplo
  // const makeAlternates = (path: string) => ({
  //   languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${path === '/' ? '' : path}`])),
  // });

  const mapEntry = (
    route: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"],
  ) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastmod,
    changeFrequency,
    priority,
    // alternates: makeAlternates(route), // habilita si usas i18n
  });

  const publicUrls = publicRoutes.map((r) =>
    mapEntry(r, r === "/" ? 1.0 : 0.7, r === "/" ? "daily" : "weekly"),
  );

  const legalUrls = legalRoutes.map((r) => mapEntry(r, 0.3, "yearly"));

  // 👉 ejemplo para añadir rutas dinámicas (blog, docs, etc.)
  // const posts = await fetchPostsSomehow();
  // const postUrls = posts.map((p) => mapEntry(`/blog/${p.slug}`, 0.6, 'weekly'));

  return [...publicUrls, ...legalUrls /*, ...postUrls */];
}
