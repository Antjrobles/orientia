'use client'
import { useSession } from 'next-auth/react'; // Importamos useSession para saber si el usuario está logueado

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  FileText,
  Shield,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Database,
  Award,
  BookOpen,
} from "lucide-react"
import { User } from "lucide-react" // Importamos el icono de usuario para el botón de perfil
import Link from "next/link"
import Image from 'next/image';
import AuthButtons from "./AuthButtons";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { cn } from "@/lib/utils";


export default function Header() {
  const { data: session, status } = useSession(); // Obtenemos el estado de la sesión

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
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
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Navegación principal">
            <Link href="#inicio" className="px-3 py-2 rounded-md text-sm font-medium text-green-600 bg-green-50" aria-current="page">
              Inicio
            </Link>
            <Link href="#caracteristicas" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Características
            </Link>
            <Link href="#beneficios" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Beneficios
            </Link>
            <Link href="#seguridad" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Seguridad
            </Link>
            <Link href="#ContactForm" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center">
            {/* Si el usuario está autenticado, mostramos el botón de Perfil */}
            {status === 'authenticated' && (
              <Link href="/profile" passHref>
                <Button
                  variant="ghost" // Usamos un estilo ghost para que se integre bien
                  className="mr-2" // Un pequeño margen para separarlo del AuthButtons
                >
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
              </Link>
            )}
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  )
}
