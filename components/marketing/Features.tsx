import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Features() {
  return (
    <section
      id="caracteristicas"
      className="py-20 bg-gray-50"
      aria-labelledby="features-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2
            id="features-title"
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            Características Principales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Herramientas avanzadas diseñadas específicamente para orientadores
            educativos
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
                Inteligencia artificial especializada en psicopedagogía que
                genera informes profesionales basados en tus observaciones y
                evaluaciones.
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
              <h3 className="text-xl font-semibold mb-3">
                Plantillas Oficiales
              </h3>
              <p className="text-gray-600">
                Formatos estandarizados que cumplen con la normativa de la Junta
                de Andalucía y las mejores prácticas psicopedagógicas.
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
                Reduce el tiempo de elaboración de informes de horas a minutos,
                permitiéndote dedicar más tiempo a la intervención directa.
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
              <h3 className="text-xl font-semibold mb-3">
                Gestión Centralizada
              </h3>
              <p className="text-gray-600">
                Almacena y organiza todos los informes de forma segura con
                acceso rápido al historial de cada alumno.
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
              <h3 className="text-xl font-semibold mb-3">
                Calidad Profesional
              </h3>
              <p className="text-gray-600">
                Informes con terminología técnica precisa y estructura
                profesional que cumplen los estándares más exigentes.
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
              <h3 className="text-xl font-semibold mb-3">
                Recursos Integrados
              </h3>
              <p className="text-gray-600">
                Acceso a bases de datos de pruebas psicopedagógicas, escalas de
                evaluación y recursos educativos actualizados.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
