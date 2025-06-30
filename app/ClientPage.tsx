"use client"

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
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SecuritySection from "@/components/SecuritySection";
import Benefits from "@/components/Benefits"
import Features from "@/components/Features"
import Hero from "@/components/Hero"


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Sistema de Informes Psicopedagógicos",
            description: "Plataforma oficial para orientadores educativos de la Junta de Andalucía",
            url: "https://orientia.es",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            provider: {
              "@type": "",
              name: "Antonio Robles",
              url: "https://www.juntadeandalucia.es",
            },
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "counselor",
            },
          }),
        }}
      />

      {/* Header */}
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
              <Link href="#contacto" className="text-gray-600 hover:text-green-600 transition-colors">
                Contacto
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Iniciar Sesión
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Acceder al Sistema</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-green-600">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900" aria-current="page">
              Sistema de Informes Psicopedagógicos
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main role="main">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Benefits Section */}
        <Benefits />

        {/* Security Section */}
        <SecuritySection />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
