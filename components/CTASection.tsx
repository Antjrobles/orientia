
'use client'

import { Button } from "@/components/ui/button";
import {ArrowRight, Sparkles, BookOpen} from "lucide-react";
import Link from "next/link";


export default function CTASection() {
  return (
    <section className="pt-20 pb-5 bg-gradient-to-r from-green-600 to-green-700 text-white" aria-labelledby="cta-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="cta-title" className="text-3xl lg:text-4xl font-bold mb-6">
          ¿Listo para Optimizar tu Trabajo?
        </h2>
        <p className="text-xl mb-8 text-green-100">
          Únete a cientos de orientadores que ya están utilizando la IA para crear informes psicopedagógicos de
          calidad profesional en minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
          <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-semibold">
            Solicitar Acceso
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-green-200">
          Acceso gratuito para todos los orientadores de la Junta de Andalucía
        </p>
      </div>
    </section>
  )

}