"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronsRight,
  Compass,
  Home,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface QuickLink {
  label: string;
  href: string;
}

const pathLabels: Record<string, string> = {
  // Auth pages
  login: "Iniciar sesión",
  register: "Registrarse",
  "verify-email": "Verificar email",
  "verify-device": "Verificar dispositivo",
  "forgot-password": "Recuperar contraseña",
  "reset-password": "Nueva contraseña",

  // Profile pages
  profile: "Perfil",
  informes: "Informes",
  "generar-informe": "Generar informe",
  intervenciones: "Intervenciones",

  // Admin pages
  admin: "Administración",

  // Marketing pages
  "sobre-nosotros": "Sobre nosotros",
  blog: "Blog",

  // Resources pages
  faq: "Preguntas frecuentes",
  formacion: "Formación",
  manual: "Manual",
  soporte: "Soporte",

  // Legal pages
  cookies: "Política de cookies",
  privacidad: "Política de privacidad",
  rgpd: "RGPD",
  "ajustes-cookies": "Ajustes de cookies",
  accesibilidad: "Accesibilidad",
  "eliminacion-de-datos-de-usuario": "Eliminación de datos",
  terminos: "Términos y condiciones",

  // Error pages
  "not-permitted": "Acceso denegado",
};

const quickLinksByRoot: Record<string, QuickLink[]> = {
  profile: [
    { label: "Dashboard", href: "/profile" },
    { label: "Generar informe", href: "/profile/generar-informe" },
    { label: "Informes", href: "/profile/informes" },
    { label: "Intervenciones", href: "/profile/intervenciones" },
    { label: "Ajustes", href: "/profile/ajustes" },
  ],
  admin: [
    { label: "Panel admin", href: "/admin" },
    { label: "Comunicaciones", href: "/admin/comunicaciones" },
  ],
  blog: [{ label: "Blog", href: "/blog" }],
  faq: [{ label: "FAQ", href: "/faq" }],
  manual: [{ label: "Manual", href: "/manual" }],
  soporte: [{ label: "Soporte", href: "/soporte" }],
  formacion: [{ label: "Formación", href: "/formacion" }],
};

const prettifySegment = (segment: string) => {
  const decoded = decodeURIComponent(segment);
  const normalized = decoded.replace(/[-_]/g, " ").trim();
  if (!normalized) return decoded;
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname() ?? "";

  // Don't show breadcrumb on home page
  if (pathname === "/") {
    return null;
  }

  // Split pathname and create breadcrumb items
  const pathSegments = pathname.split("/").filter((segment) => segment);
  const breadcrumbItems: BreadcrumbItem[] = [];

  // Always start with home
  breadcrumbItems.push({ label: "Inicio", href: "/" });

  // Build breadcrumb items from path segments
  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = pathLabels[segment] || prettifySegment(segment);
    breadcrumbItems.push({ label, href: currentPath });
  });

  const rootSegment = pathSegments[0] ?? "";
  const quickLinks = (quickLinksByRoot[rootSegment] ?? []).filter(
    (item) => item.href !== pathname,
  );
  const hasCollapsedCrumbs = breadcrumbItems.length > 3;
  const middleItems = hasCollapsedCrumbs ? breadcrumbItems.slice(1, -1) : [];
  const mobileVisibleItems = hasCollapsedCrumbs
    ? [breadcrumbItems[0], breadcrumbItems[breadcrumbItems.length - 1]]
    : breadcrumbItems;

  const baseUrl = "https://orientia.es";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return (
    <div className="min-h-12 border-b border-border/70 bg-gradient-to-r from-background via-background to-muted/30 px-4 py-2 backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-1 duration-300 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="flex items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="hidden flex-wrap items-center gap-1 text-xs text-muted-foreground sm:flex sm:gap-2 sm:text-sm">
            {breadcrumbItems.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <li key={item.href} className="inline-flex min-w-0 items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                  )}
                  {isLast ? (
                    <span
                      className="inline-flex max-w-[52vw] items-center truncate rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground"
                      aria-current="page"
                    >
                      {isFirst && <Home className="mr-1 h-3.5 w-3.5 shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="inline-flex max-w-[36vw] items-center truncate rounded-full px-2.5 py-1 transition-all duration-200 hover:bg-accent hover:text-foreground hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {isFirst && <Home className="mr-1 h-3.5 w-3.5 shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>

          <ol className="flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
            {mobileVisibleItems.map((item, index) => {
              const isFirst = index === 0;
              const isLast = item.href === breadcrumbItems[breadcrumbItems.length - 1]?.href;
              const showCollapsedTrigger = isFirst && hasCollapsedCrumbs;
              return (
                <li key={item.href} className="inline-flex min-w-0 items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                  )}
                  {isLast ? (
                    <span
                      className="inline-flex max-w-[62vw] items-center truncate rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 font-medium text-foreground"
                      aria-current="page"
                    >
                      <span className="truncate">{item.label}</span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="inline-flex max-w-[30vw] items-center truncate rounded-full px-2 py-1 transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {isFirst && <Home className="mr-1 h-3.5 w-3.5 shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )}
                  {showCollapsedTrigger && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          aria-label="Mostrar rutas intermedias"
                        >
                          <ChevronsRight className="h-3.5 w-3.5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-64 p-2">
                        <p className="px-2 pb-1 text-xs font-semibold text-foreground">
                          Rutas intermedias
                        </p>
                        <div className="space-y-1">
                          {middleItems.map((middle) => (
                            <Link
                              key={middle.href}
                              href={middle.href}
                              className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                              {middle.label}
                            </Link>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="hidden shrink-0 items-center sm:flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 gap-1.5 border-border/80 bg-background/80 text-xs text-muted-foreground transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-foreground",
                  quickLinks.length === 0 && "pointer-events-none opacity-50",
                )}
                disabled={quickLinks.length === 0}
              >
                <Compass className="h-3.5 w-3.5" />
                Navegación rápida
                <Sparkles className="h-3.5 w-3.5 text-emerald-600/80" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2">
              <p className="px-2 pb-1 text-xs font-semibold text-foreground">
                Saltar a
              </p>
              <div className="space-y-1">
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:translate-x-0.5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
