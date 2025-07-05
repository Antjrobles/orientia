'use client'

import Link from "next/link"
import Image from 'next/image'
import AuthButtons from "./AuthButtons"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ProfileHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Columna Izquierda: Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Volver a la página de inicio">
              <Image
                src="/icons/logo4.svg"
                alt="Logo Orientia"
                width={150}
                height={40}
                // El mt-8 sigue aquí, no se ha tocado.
                className="transform transition-transform hover:scale-105 mt-8"
                priority
              />
            </Link>
          </div>

          {/* Columna Central: Navegación */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Navegación de perfil">
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
              href="/nuevo-informe"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith("/nuevo-informe")
                  ? "text-green-600 bg-green-50 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              Nuevo Informe
            </Link>
            {/* Enlace deshabilitado, con padding para alinear */}
            <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed" aria-disabled="true">
              Mis Informes
            </span>
          </nav>

          {/* Columna Derecha: Menú de usuario */}
          <div className="flex items-center">
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  )
}
