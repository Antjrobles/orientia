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
            url: "https://informes-psicopedagogicos.juntadeandalucia.es",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            provider: {
              "@type": "GovernmentOrganization",
              name: "Junta de Andalucía",
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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center" aria-hidden="true">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Junta de Andalucía</div>
                  <div className="text-gray-600">Consejería de Desarrollo Educativo</div>
                  <div className="text-gray-600">y Formación Profesional</div>
                </div>
              </div>
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
        <section
          id="inicio"
          className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20"
          aria-labelledby="hero-title"
        >
          <div className="absolute inset-0 bg-black opacity-10" aria-hidden="true"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-green-500 text-white mb-4 px-3 py-1">
                  <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />
                  Potenciado por Inteligencia Artificial
                </Badge>
                <h1 id="hero-title" className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Sistema de Informes Psicopedagógicos
                  <span className="block text-green-200">Inteligente</span>
                </h1>
                <p className="text-xl mb-8 text-green-100 leading-relaxed">
                  Plataforma oficial para orientadores educativos de la Junta de Andalucía. Genera informes
                  psicopedagógicos profesionales con asistencia de IA, optimizando tu tiempo y garantizando la calidad
                  técnica.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-semibold">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-green-700"
                  >
                    Ver Demostración
                  </Button>
                </div>
                <div className="mt-8 flex items-center space-x-6 text-sm text-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                    Cumple normativa autonómica
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
                    Datos protegidos RGPD
                  </div>
                </div>
              </div>
              <div className="hidden lg:block" aria-hidden="true">
                <div className="relative">
                  <div className="bg-white rounded-lg shadow-2xl p-6 transform rotate-3">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-8 bg-green-100 rounded flex items-center justify-center">
                        <Brain className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-green-700 text-sm font-medium">IA Generando...</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="caracteristicas" className="py-20 bg-gray-50" aria-labelledby="features-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2 id="features-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Características Principales
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Herramientas avanzadas diseñadas específicamente para orientadores educativos
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <article className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg">
                <div className="p-6">
                  <div
                    className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Generación con IA</h3>
                  <p className="text-gray-600">
                    Inteligencia artificial especializada en psicopedagogía que genera informes profesionales basados en
                    tus observaciones y evaluaciones.
                  </p>
                </div>
              </article>

              <article className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg">
                <div className="p-6">
                  <div
                    className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Plantillas Oficiales</h3>
                  <p className="text-gray-600">
                    Formatos estandarizados que cumplen con la normativa de la Junta de Andalucía y las mejores
                    prácticas psicopedagógicas.
                  </p>
                </div>
              </article>

              <article className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg">
                <div className="p-6">
                  <div
                    className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Ahorro de Tiempo</h3>
                  <p className="text-gray-600">
                    Reduce el tiempo de elaboración de informes de horas a minutos, permitiéndote dedicar más tiempo a
                    la intervención directa.
                  </p>
                </div>
              </article>

              <article className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg">
                <div className="p-6">
                  <div
                    className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <Database className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Gestión Centralizada</h3>
                  <p className="text-gray-600">
                    Almacena y organiza todos los informes de forma segura con acceso rápido al historial de cada
                    alumno.
                  </p>
                </div>
              </article>

              <article className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg">
                <div className="p-6">
                  <div
                    className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <Award className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Calidad Profesional</h3>
                  <p className="text-gray-600">
                    Informes con terminología técnica precisa y estructura profesional que cumplen los estándares más
                    exigentes.
                  </p>
                </div>
              </article>

              <article className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg">
                <div className="p-6">
                  <div
                    className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <BookOpen className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Recursos Integrados</h3>
                  <p className="text-gray-600">
                    Acceso a bases de datos de pruebas psicopedagógicas, escalas de evaluación y recursos educativos
                    actualizados.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="py-20 bg-white" aria-labelledby="benefits-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 id="benefits-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Beneficios para Orientadores
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Diseñado por y para profesionales de la orientación educativa, nuestro sistema comprende las
                  necesidades específicas de tu trabajo diario.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      aria-hidden="true"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Eficiencia Mejorada</h3>
                      <p className="text-gray-600">
                        Automatiza la redacción manteniendo tu criterio profesional como base fundamental.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      aria-hidden="true"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Consistencia Profesional</h3>
                      <p className="text-gray-600">
                        Garantiza coherencia en la terminología y estructura de todos tus informes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      aria-hidden="true"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Respaldo Técnico</h3>
                      <p className="text-gray-600">
                        Soporte especializado y actualizaciones continuas basadas en feedback profesional.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      aria-hidden="true"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Integración Séneca</h3>
                      <p className="text-gray-600">Compatible con los sistemas existentes de la Junta de Andalucía.</p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="relative" aria-labelledby="stats-title">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div
                      className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
                      aria-hidden="true"
                    >
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 id="stats-title" className="text-2xl font-bold text-gray-900 mb-2">
                      +500 Orientadores
                    </h3>
                    <p className="text-gray-600">Ya confían en nuestro sistema</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                      <div className="text-sm text-gray-600">Reducción de tiempo</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
                      <div className="text-sm text-gray-600">Satisfacción</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                      <div className="text-sm text-gray-600">Disponibilidad</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-orange-600 mb-1">100%</div>
                      <div className="text-sm text-gray-600">Seguro</div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="seguridad" className="py-20 bg-gray-50" aria-labelledby="security-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2 id="security-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Seguridad y Privacidad
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Cumplimiento estricto de la normativa de protección de datos y seguridad informática
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="text-center border-0 shadow-md bg-white rounded-lg p-6">
                <div
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  aria-hidden="true"
                >
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">RGPD Compliant</h3>
                <p className="text-gray-600">
                  Cumplimiento total del Reglamento General de Protección de Datos. Todos los datos se procesan de forma
                  segura y confidencial.
                </p>
              </article>

              <article className="text-center border-0 shadow-md bg-white rounded-lg p-6">
                <div
                  className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  aria-hidden="true"
                >
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cifrado Avanzado</h3>
                <p className="text-gray-600">
                  Encriptación de extremo a extremo para todos los datos. Comunicaciones seguras mediante protocolos
                  SSL/TLS.
                </p>
              </article>

              <article className="text-center border-0 shadow-md bg-white rounded-lg p-6">
                <div
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  aria-hidden="true"
                >
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Certificación Oficial</h3>
                <p className="text-gray-600">
                  Sistema auditado y certificado por la Junta de Andalucía. Cumple con todos los estándares de seguridad
                  gubernamental.
                </p>
              </article>
            </div>

            <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center justify-center mb-6">
                <div
                  className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4"
                  aria-hidden="true"
                >
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Compromiso de Privacidad</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" aria-hidden="true" />
                      Los datos nunca se comparten con terceros
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" aria-hidden="true" />
                      Servidores ubicados en territorio español
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" aria-hidden="true" />
                      Acceso restringido solo a personal autorizado
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" aria-hidden="true" />
                      Copias de seguridad automáticas y cifradas
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" aria-hidden="true" />
                      Auditorías de seguridad regulares
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" aria-hidden="true" />
                      Derecho de acceso, rectificación y supresión
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white" aria-labelledby="cta-title">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-title" className="text-3xl lg:text-4xl font-bold mb-6">
              ¿Listo para Optimizar tu Trabajo?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Únete a cientos de orientadores que ya están utilizando la IA para crear informes psicopedagógicos de
              calidad profesional en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-semibold">
                Solicitar Acceso
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700"
              >
                Programar Demostración
              </Button>
            </div>
            <p className="mt-6 text-sm text-green-200">
              Acceso gratuito para todos los orientadores de la Junta de Andalucía
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contacto" className="bg-gray-900 text-white py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center" aria-hidden="true">
                  <span className="text-white font-bold">A</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Junta de Andalucía</div>
                  <div className="text-gray-400">Consejería de Desarrollo Educativo</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Sistema oficial de informes psicopedagógicos para orientadores educativos de la Junta de Andalucía.
              </p>
              <div className="text-sm text-gray-400">
                <p>© 2024 Junta de Andalucía. Todos los derechos reservados.</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Enlaces Útiles</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/manual" className="hover:text-white transition-colors">
                    Manual de Usuario
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="/soporte" className="hover:text-white transition-colors">
                    Soporte Técnico
                  </Link>
                </li>
                <li>
                  <Link href="/formacion" className="hover:text-white transition-colors">
                    Formación
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <address className="space-y-2 text-sm text-gray-400 not-italic">
                <div>Email: soporte@juntadeandalucia.es</div>
                <div>Teléfono: 955 064 000</div>
                <div>Horario: L-V 8:00-15:00</div>
                <div>
                  <Link href="/privacidad" className="hover:text-white transition-colors">
                    Política de Privacidad
                  </Link>
                </div>
              </address>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
