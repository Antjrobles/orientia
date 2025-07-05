'use client'

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
import Link from "next/link"
import Image from 'next/image';
import AuthButtons from "./AuthButtons"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">

            <img
              src="/icons/logo4.svg"
              alt="Logo Orientia"
              width={150}
              height={150}
              className="transform transition-transform hover:scale-110 mt-8"
            />

          </div>
          <nav className="hidden md:flex space-x-6" role="navigation" aria-label="Navegación principal">
            <Link href="#inicio" className="text-green-600 font-medium" aria-current="page">
              Inicio
            </Link>
            <Link href="#caracteristicas" className="text-gray-600 hover:text-green-600 transition-colors">
              Características
            </Link>
            <Link href="#beneficios" className="text-gray-600 hover:text-green-600 transition-colors">
              Beneficios
            </Link>
            <Link href="#seguridad" className="text-gray-600 hover:text-green-600 transition-colors">
              Seguridad
            </Link>
            <Link href="#contacform" className="text-gray-600 hover:text-green-600 transition-colors">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Iniciar Sesión
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">Acceder al Sistema</Button>
            <AuthButtons />

          </div>
        </div>
      </div>
    </header>
  )
}