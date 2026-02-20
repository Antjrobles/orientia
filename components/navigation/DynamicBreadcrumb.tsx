"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
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

export default function DynamicBreadcrumb() {
  const pathname = usePathname() ?? "";

  // Don't show breadcrumb on home page
  if (pathname === "/") {
    return (
      <div className="min-h-11 flex items-start justify-start border-b border-border bg-background/70 px-4 py-2 sm:items-center">
        <nav aria-label="Breadcrumb" className="w-full min-w-0">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground sm:gap-2 sm:text-sm">
            <li>
              <Link
                href="/"
                className="flex items-center rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Home className="w-4 h-4 mr-1" />
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="break-words text-foreground" aria-current="page">
              Sistema de Informes Psicopedagógicos
            </li>
          </ol>
        </nav>
      </div>
    );
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
    const label =
      pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbItems.push({ label, href: currentPath });
  });

  return (
    <div className="min-h-11 flex items-start justify-start border-b border-border bg-background/70 px-4 py-2 sm:items-center">
      <nav aria-label="Breadcrumb" className="w-full min-w-0">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground sm:gap-2 sm:text-sm">
          {breadcrumbItems.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === breadcrumbItems.length - 1;
            const hideOnMobile = !isFirst && !isLast;
            return (
              <li
                key={item.href}
                className={`items-center max-w-full ${hideOnMobile ? "hidden sm:flex" : "flex"}`}
              >
                {index > 0 && (
                  <ChevronRight
                    className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    className="flex min-w-0 items-center break-words text-foreground"
                    aria-current="page"
                  >
                    {isFirst && <Home className="w-4 h-4 mr-1" />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {isFirst && <Home className="w-4 h-4 mr-1" />}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
