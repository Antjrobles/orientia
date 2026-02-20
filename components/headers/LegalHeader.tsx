"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AuthButtons from "@/components/auth/AuthButtons";
import { cn } from "@/lib/utils";

export default function LegalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm"
        role="banner"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 w-full overflow-hidden">
            {/* Zona izquierda: Logo */}
            <div className="flex items-center shrink-0">
              <Link href="/" aria-label="Volver a la página de inicio">
                <Image
                  src="/icons/logo4.svg"
                  alt="Logo Orientia"
                  width={150}
                  height={40}
                  className="mt-8 transform transition-transform hover:scale-105 dark:hidden"
                  style={{ height: "auto" }}
                  priority
                />
                <Image
                  src="/icons/logo4-dark.svg"
                  alt="Logo Orientia"
                  width={150}
                  height={40}
                  className="mt-8 hidden transform transition-transform hover:scale-105 dark:block"
                  style={{ height: "auto" }}
                  priority
                />
              </Link>
            </div>

            {/* Zona centro: Navegación */}
            <nav
              className="hidden md:flex flex-1 justify-center items-center mx-6 gap-2"
              role="navigation"
              aria-label="Navegación principal"
            >
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-current="page"
              >
                Inicio
              </Link>
              <Link
                href="/privacidad"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Privacidad
              </Link>
              <Link
                href="/terminos"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Términos
              </Link>
              <Link
                href="/cookies"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Cookies
              </Link>
              <Link
                href="/accesibilidad"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Accesibilidad
              </Link>
              <Link
                href="/rgpd"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                RGPD
              </Link>
              <Link
                href="/eliminacion-de-datos-de-usuario"
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Eliminación de Datos
              </Link>
            </nav>

            {/* Zona derecha: Botones de autenticación */}
            <div className="hidden md:flex items-center justify-end">
              <AuthButtons />
            </div>

            {/* Botón menú móvil (derecha) */}
            <button
              className="ml-auto rounded p-2 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring md:hidden"
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
              "fixed inset-y-0 right-0 w-full max-w-sm shadow-xl transform transition-transform duration-300 ease-in-out",
              "border-l border-border bg-card",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="flex flex-col h-full">
              {/* Header del menú */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="text-lg font-semibold text-foreground">Menú</h2>
                <button
                  className="rounded-md p-2 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Cerrar menú"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-muted-foreground" />
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
                    href="/"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-current="page"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/privacidad"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Privacidad
                  </Link>
                  <Link
                    href="/terminos"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Términos
                  </Link>
                  <Link
                    href="/cookies"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cookies
                  </Link>
                  <Link
                    href="/accesibilidad"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Accesibilidad
                  </Link>
                  <Link
                    href="/rgpd"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    RGPD
                  </Link>
                  <Link
                    href="/eliminacion-de-datos-de-usuario"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Eliminación de Datos
                  </Link>
                </nav>
              </div>

              {/* Footer del menú con botones de autenticación */}
              <div className="border-t border-border p-4">
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
