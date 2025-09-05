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

export default function Benefits() {
  return (
    <section id="beneficios" className="py-20 bg-white" aria-labelledby="benefits-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título centrado para toda la sección */}
        <div className="text-center mb-16">
          <h2 id="benefits-title" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Beneficios para Orientadores
          </h2>
          <p className="text-lg text-gray-600 mb-8 mx-auto max-w-2xl">
            Diseñado por y para profesionales de la orientación educativa, nuestro sistema comprende las
            necesidades específicas de tu trabajo diario.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contenedor de beneficios */}
          <div>
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
  )
}
