'use client'

import Link from "next/link"
import Image from 'next/image'
import AuthButtons from "./AuthButtons"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Menu, X, Shield, LayoutDashboard, FilePlus2, FolderKanban } from "lucide-react"
import { useSession } from "next-auth/react"

export default function ProfileHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  const isAdmin = session?.user?.role === 'admin'

  // Bloquear scroll al abrir menú móvil
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
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

            {/* Navegación escritorio (solo visible en md o más) */}
            <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Navegación de perfil">
              <Link
                href="/profile"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/profile"
                    ? "text-green-600 bg-green-50 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                Panel Principal
              </Link>
              <Link
                href="/profile/generar-informe"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith("/profile/generar-informe")
                    ? "text-green-600 bg-green-50 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                Nuevo Informe
              </Link>
              <Link
                href="/profile/informes"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith("/profile/informes")
                    ? "text-green-600 bg-green-50 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                Mis Informes
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "text-red-600 bg-red-50 font-semibold"
                      : "text-red-600 hover:bg-red-50 hover:text-red-700"
                  )}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Parte derecha */}
            <div className="flex items-center">
              {/* Botón menú móvil */}
              <button
                className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Abrir menú"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Botones usuario escritorio */}
              <div className="hidden md:flex items-center">
                <AuthButtons />
              </div>
            </div>
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
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Cabecera menú móvil */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                <button
                  className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Navegación móvil */}
              <div className="flex-1 px-4 py-6 overflow-y-auto">
                <nav className="space-y-1" role="navigation">
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-gray-100",
                      pathname === "/profile"
                        ? "text-green-600 bg-green-50 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3 flex-shrink-0" />
                    Panel Principal
                  </Link>
                  <Link
                    href="/profile/generar-informe"
                    className={cn(
                      "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-gray-100",
                      pathname.startsWith("/profile/generar-informe")
                        ? "text-green-600 bg-green-50 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FilePlus2 className="w-5 h-5 mr-3 flex-shrink-0" />
                    Nuevo Informe
                  </Link>
                  <Link
                    href="/profile/informes"
                    className={cn(
                      "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-gray-100",
                      pathname.startsWith("/profile/informes")
                        ? "text-green-600 bg-green-50 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FolderKanban className="w-5 h-5 mr-3 flex-shrink-0" />
                    Mis Informes
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={cn(
                        "flex items-center px-4 py-4 text-base font-medium transition-colors border-b border-gray-100",
                        pathname.startsWith("/admin")
                          ? "text-red-600 bg-red-50 font-semibold"
                          : "text-red-600 hover:bg-red-50"
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
              <div className="border-t border-gray-200 p-4">
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
