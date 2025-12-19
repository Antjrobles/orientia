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
  "forgot-password": "Recuperar contraseña",
  "reset-password": "Nueva contraseña",

  // Profile pages
  profile: "Perfil",
  informes: "Informes",
  "generar-informe": "Generar informe",

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
  const pathname = usePathname();

  // Don't show breadcrumb on home page
  if (pathname === "/") {
    return (
      <div className="h-11 px-4 border-b border-gray-200 bg-gray-50 flex items-center justify-start">
        <nav aria-label="Breadcrumb" className="w-full">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-green-600 flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-gray-900" aria-current="page">
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
    <div className="h-11 px-4 border-b border-gray-200 bg-gray-50 flex items-center justify-start">
      <nav aria-label="Breadcrumb" className="w-full">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mr-2" aria-hidden="true" />
              )}
              {index === breadcrumbItems.length - 1 ? (
                <span
                  className="text-gray-900 flex items-center"
                  aria-current="page"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-green-600 flex items-center"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
