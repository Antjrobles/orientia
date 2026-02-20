"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Lazy load: AuthButtons carga next-auth + DropdownMenu + iconos pesados
const AuthButtons = dynamic(() => import("@/components/auth/AuthButtons"), {
  loading: () => <div className="h-9 w-20 animate-pulse rounded bg-muted" />,
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
          "sticky top-0 z-50 border-b border-border transition-all duration-300",
          scrolled
            ? "bg-background shadow-sm"
            : "bg-background/80 backdrop-blur-sm"
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

            {/* Zona centro: Navegación (ocupa más espacio) */}
            <nav
              className="hidden md:flex flex-1 justify-center items-center mx-6 gap-2"
              role="navigation"
              aria-label="Navegación principal"
            >
              <Link
                href="#inicio"
                className="rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-current="page"
              >
                Inicio
              </Link>
              <Link
                href="#caracteristicas"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Características
              </Link>
              <Link
                href="#beneficios"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Beneficios
              </Link>
              <Link
                href="#seguridad"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Seguridad
              </Link>
              <Link
                href="#pricing"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Precios
              </Link>
              <Link
                href="#contacto"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
              className="ml-auto rounded p-2 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring md:hidden"
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
              "fixed inset-y-0 right-0 w-full max-w-sm transform bg-card shadow-xl transition-transform duration-300 ease-in-out",
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
                    href="#inicio"
                    className="block rounded-md bg-primary/10 px-4 py-3 text-base font-medium text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="#caracteristicas"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Características
                  </Link>
                  <Link
                    href="#beneficios"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Beneficios
                  </Link>
                  <Link
                    href="#seguridad"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Seguridad
                  </Link>
                  <Link
                    href="#pricing"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Precios
                  </Link>
                  <Link
                    href="#contacto"
                    className="block rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contacto
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
