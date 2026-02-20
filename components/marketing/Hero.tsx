import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileText,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20"
      aria-labelledby="hero-title"
    >
      <div
        className="absolute inset-0 bg-black opacity-10"
        aria-hidden="true"
      ></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-green-500 text-white mb-4 px-3 py-1">
              <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />
              Potenciado por Inteligencia Artificial
            </Badge>
            <h1
              id="hero-title"
              className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            >
              Sistema de Informes Psicopedagógicos
              <span className="block text-green-200">Inteligente</span>
            </h1>
            <p className="text-xl mb-8 text-green-100 leading-relaxed">
              Genera informes psicopedagógicos profesionales con asistencia de
              IA, optimizando tu tiempo y garantizando la calidad técnica
            </p>
            <div className="flex justify-center sm:justify-start">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-green-50 font-semibold"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
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
                  <div className="flex h-8 items-center justify-center rounded bg-green-100 dark:bg-accent">
                    <Brain className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-700 dark:text-foreground">
                      IA Generando...
                    </span>
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
  );
}
