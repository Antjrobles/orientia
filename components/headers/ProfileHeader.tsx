"use client";

import Link from "next/link";
import Image from "next/image";
import AuthButtons from "@/components/auth/AuthButtons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Shield,
  LayoutDashboard,
  FilePlus2,
  FileText,
  FolderKanban,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfileHeader() {
  const pathname = usePathname() ?? "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";

  // Bloquear scroll al abrir menú móvil
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
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

            {/* Zona centro: Navegación (ocupa más espacio) */}
            <nav
              className="hidden md:flex flex-1 justify-center items-center mx-6 gap-2"
              role="navigation"
              aria-label="Navegación de perfil"
            >
              <Link
                href="/profile"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/profile"
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                Panel Principal
              </Link>
              <Link
                href="/profile/generar-informe"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith("/profile/generar-informe")
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                Nuevo Informe
              </Link>
              <Link
                href="/profile/informes"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith("/profile/informes")
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                Mis Informes
              </Link>
              <Link
                href="/profile/intervenciones"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith("/profile/intervenciones")
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                Intervenciones
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-destructive/15 text-destructive font-semibold"
                      : "text-destructive/90 hover:bg-destructive/10 hover:text-destructive",
                  )}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Zona derecha: Botones usuario (desktop) */}
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
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Panel lateral */}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm transform border-r border-border bg-card shadow-xl transition-transform">
            <div className="flex flex-col h-full">
              {/* Cabecera menú móvil */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="text-lg font-semibold text-foreground">Menú</h2>
                <button
                  className="rounded-md p-2 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>

              {/* Navegación móvil */}
              <div className="flex-1 px-4 py-6 overflow-y-auto">
                <nav className="space-y-1" role="navigation">
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-border",
                      pathname === "/profile"
                        ? "bg-primary/15 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3 flex-shrink-0" />
                    Panel Principal
                  </Link>
                  <Link
                    href="/profile/generar-informe"
                    className={cn(
                      "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-border",
                      pathname.startsWith("/profile/generar-informe")
                        ? "bg-primary/15 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FilePlus2 className="w-5 h-5 mr-3 flex-shrink-0" />
                    Nuevo Informe
                  </Link>
                  <Link
                    href="/profile/informes"
                    className={cn(
                      "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-border",
                      pathname.startsWith("/profile/informes")
                        ? "bg-primary/15 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FolderKanban className="w-5 h-5 mr-3 flex-shrink-0" />
                    Mis Informes
                  </Link>
                  <Link
                    href="/profile/intervenciones"
                    className={cn(
                      "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-border",
                      pathname.startsWith("/profile/intervenciones")
                        ? "bg-primary/15 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                    Intervenciones
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={cn(
                        "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-border",
                        pathname.startsWith("/admin")
                          ? "bg-destructive/15 text-destructive font-semibold"
                          : "border-border text-destructive/90 hover:bg-destructive/10 hover:text-destructive",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                      Administración
                    </Link>
                  )}
                </nav>
              </div>

              {/* Botones usuario */}
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
