import { MetadataRoute } from "next";
import { posts } from "@/data/blog/posts";

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://orientia.es";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/**
 * sitemap.xml moderno:
 * - rutas públicas, blog y legales
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date().toISOString();
  const legalLastmod = "2026-03-03T00:00:00.000Z";

  const publicRoutes = ["/", "/sobre-nosotros", "/faq"];

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
    // Sin trailing slash para coincidir con el canonical de layout.tsx
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified: route === "/" ? now : legalLastmod,
    changeFrequency,
    priority,
    // alternates: makeAlternates(route), // habilita si usas i18n
  });

  const publicUrls = publicRoutes.map((r) =>
    mapEntry(r, r === "/" ? 1.0 : 0.7, r === "/" ? "daily" : "weekly"),
  );

  const legalUrls = legalRoutes.map((r) => mapEntry(r, 0.3, "yearly"));

  const blogUrls = [
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.fechaActualizacion ?? p.fecha,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...publicUrls, ...blogUrls, ...legalUrls];
}
