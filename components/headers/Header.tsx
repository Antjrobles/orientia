"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Lazy load: AuthButtons carga next-auth + DropdownMenu + iconos pesados
const AuthButtons = dynamic(() => import("@/components/auth/AuthButtons"), {
  loading: () => <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />,
  ssr: false
});

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para optimizar backdrop-blur
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "border-b border-gray-200 sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        )}
        style={{
          willChange: scrolled ? "auto" : "backdrop-filter",
          transform: "translateZ(0)",
        }}
        role="banner"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 w-full">
            {/* Zona izquierda: Logo */}
            <div className="flex items-center shrink-0">
              <Link href="/" aria-label="Volver a la página de inicio">
                <Image
                  src="/icons/logo4.svg"
                  alt="Logo Orientia"
                  width={150}
                  height={40}
                  className="transform transition-transform hover:scale-105 mt-8"
                  priority
                />
              </Link>
            </div>

            {/* Zona centro: Navegación (ocupa más espacio) */}
            <nav
              className="hidden md:flex flex-1 justify-center items-center mx-6 gap-2"
              role="navigation"
              aria-label="Navegación principal"
            >
              <Link
                href="#inicio"
                className="px-3 py-2 rounded-md text-sm font-semibold text-green-600 bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                aria-current="page"
              >
                Inicio
              </Link>
              <Link
                href="#caracteristicas"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Características
              </Link>
              <Link
                href="#beneficios"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Beneficios
              </Link>
              <Link
                href="#seguridad"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Seguridad
              </Link>
              <Link
                href="#pricing"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Precios
              </Link>
              <Link
                href="#contacto"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Contacto
              </Link>
            </nav>

            {/* Zona derecha: Botones de autenticación (desktop) */}
            <div className="hidden md:flex items-center justify-end">
              <AuthButtons />
            </div>

            {/* Botón menú móvil (derecha) */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto"
              aria-label="Abrir menú"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay oscuro */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel del menú */}
          <div
            className={cn(
              "fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="flex flex-col h-full">
              {/* Header del menú */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                <button
                  className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Cerrar menú"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Contenido del menú */}
              <div className="flex-1 px-4 py-6 overflow-y-auto">
                <nav
                  className="space-y-2"
                  role="navigation"
                  aria-label="Navegación móvil"
                >
                  <Link
                    href="#inicio"
                    className="block px-4 py-3 rounded-md text-base font-medium text-green-600 bg-green-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="#caracteristicas"
                    className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Características
                  </Link>
                  <Link
                    href="#beneficios"
                    className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Beneficios
                  </Link>
                  <Link
                    href="#seguridad"
                    className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Seguridad
                  </Link>
                  <Link
                    href="#pricing"
                    className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Precios
                  </Link>
                  <Link
                    href="#contacto"
                    className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contacto
                  </Link>
                </nav>
              </div>

              {/* Footer del menú con botones de autenticación */}
              <div className="border-t border-gray-200 p-4">
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
