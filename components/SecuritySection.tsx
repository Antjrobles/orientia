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

export default function SecuritySection() {
  return (
    <>
      <section id="seguridad" className="pt-20 bg-gray-50" aria-labelledby="security-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-8">
            <h2 id="security-title" className="text-3xl lg:text-4xl text-center font-bold text-gray-900 mb-4">
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
                Sistema auditado que cumple con los más altos estándares de seguridad para proteger tu información y la de
                tus alumnos
              </p>
            </article>
          </div>

          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
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

      {/* Transición gradual */}
      <div className="h-16 bg-gradient-to-b from-gray-50 to-primary-600"></div>
    </>
  )
}