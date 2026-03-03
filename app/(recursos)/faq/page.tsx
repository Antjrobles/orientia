import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Orientia FAQ",
  description:
    "Resuelve tus dudas sobre Orientia: informes psicopedagógicos con IA, compatibilidad con Séneca, privacidad de datos, planes y funcionalidades para orientadores educativos en Andalucía.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Orientia",
    description:
      "Preguntas frecuentes sobre la plataforma de informes psicopedagógicos con IA para orientadores en Andalucía.",
    url: "https://orientia.es/faq",
  },
};

const faqs: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Qué es Orientia y para qué sirve?",
    respuesta:
      "Orientia es una plataforma de inteligencia artificial diseñada específicamente para orientadores educativos en Andalucía. Su función principal es generar borradores de informes psicopedagógicos a partir de los datos de evaluación que introduce el orientador. El resultado es un informe técnico con la estructura estándar de la Junta de Andalucía, terminología precisa y propuestas de intervención coherentes con el perfil del alumno. El orientador siempre revisa, ajusta y firma el informe final.",
  },
  {
    pregunta: "¿Es compatible con Séneca (Junta de Andalucía)?",
    respuesta:
      "Sí. Los informes generados con Orientia pueden exportarse en formato PDF con la estructura y el formato habituales para su subida al expediente del alumno en Séneca. No se requieren reformateos ni adaptaciones manuales: el flujo es generar en Orientia, exportar a PDF y subir directamente a Séneca.",
  },
  {
    pregunta: "¿Los datos de los alumnos están protegidos?",
    respuesta:
      "Sí. Orientia cumple el RGPD (Reglamento UE 2016/679) y la LOPDGDD (Ley Orgánica 3/2018). Los servidores están ubicados en territorio español. Los datos de los alumnos no se usan para entrenar modelos de IA ni se comparten con terceros. Todo el tráfico va cifrado con TLS. Puedes consultar el detalle en nuestra Política de Privacidad y en la página de RGPD.",
  },
  {
    pregunta: "¿Qué tipos de informes puedo generar con Orientia?",
    respuesta:
      "Actualmente Orientia genera informes psicopedagógicos completos para alumnos con necesidades específicas de apoyo educativo (NEAE): necesidades educativas especiales (NEE), dificultades específicas de aprendizaje (dislexia, discalculia, disgrafía, etc.), TDAH, altas capacidades intelectuales, trastornos del espectro autista (TEA) e incorporación tardía al sistema educativo. La plataforma está en continuo desarrollo y se añaden nuevas tipologías regularmente.",
  },
  {
    pregunta: "¿Cuánto tiempo tarda en generar un informe?",
    respuesta:
      "Una vez introducidos los datos de evaluación, Orientia genera el borrador en menos de 2 minutos. El tiempo total del proceso —introducción de datos, generación, revisión y ajustes finales— suele estar entre 20 y 40 minutos para un informe completo. Comparado con las 3-6 horas habituales de redacción manual, supone un ahorro de más del 80% del tiempo.",
  },
  {
    pregunta: "¿Puedo exportar los informes a PDF o Word?",
    respuesta:
      "Sí. Orientia permite exportar los informes en formato PDF con la maquetación profesional estándar. La exportación a Word está disponible en el Plan Profesional, lo que permite realizar ajustes adicionales de formato si el centro lo requiere.",
  },
  {
    pregunta: "¿Funciona para otras comunidades autónomas además de Andalucía?",
    respuesta:
      "Orientia está optimizada para la normativa y los formatos de la Junta de Andalucía. Las plantillas, la terminología y la estructura de los informes siguen los criterios establecidos por la Consejería de Educación de Andalucía. Para orientadores de otras comunidades autónomas, la plataforma puede ser útil como base de redacción, aunque los informes requerirán adaptaciones a la normativa local.",
  },
  {
    pregunta: "¿Cómo funciona el plan gratuito?",
    respuesta:
      "El plan gratuito (Orientador Individual) permite generar hasta 5 informes al mes, con acceso a las plantillas básicas y soporte por email. No se requiere tarjeta de crédito para registrarse. El plan gratuito está disponible de forma permanente, no es una prueba temporal.",
  },
  {
    pregunta: "¿Qué incluye el Plan Profesional?",
    respuesta:
      "El Plan Profesional incluye informes ilimitados, acceso a todas las plantillas (incluyendo las específicas por tipología de NEAE), exportación a PDF y Word, estadísticas del departamento de orientación, historial completo de informes y soporte prioritario. El precio es de 4,99 €/mes o 49,90 €/año.",
  },
  {
    pregunta: "¿Puedo cancelar la suscripción en cualquier momento?",
    respuesta:
      "Sí. Puedes cancelar tu suscripción al Plan Profesional en cualquier momento desde los ajustes de tu cuenta, sin penalizaciones ni períodos de permanencia. Al cancelar, mantienes el acceso hasta el final del período facturado.",
  },
  {
    pregunta: "¿Puedo personalizar las plantillas?",
    respuesta:
      "Sí. Orientia permite editar el borrador generado antes de exportarlo. El Plan Profesional incluye además la posibilidad de guardar ajustes recurrentes como preferencias de redacción, lo que hace que los informes siguientes ya incorporen tu estilo desde el primer borrador.",
  },
  {
    pregunta: "¿La IA puede equivocarse? ¿Debo revisar los informes?",
    respuesta:
      "Sí, siempre debes revisar el informe antes de firmarlo. Orientia genera un borrador técnico de alta calidad, pero la IA puede cometer errores, omitir matices relevantes o interpretar datos de forma incorrecta. El criterio profesional del orientador es irreemplazable y la firma del documento es siempre responsabilidad del profesional que lo emite. Orientia es una herramienta de apoyo, no un sustituto del juicio clínico.",
  },
  {
    pregunta: "¿Cómo se garantiza la confidencialidad de los informes?",
    respuesta:
      "Los informes se almacenan cifrados en los servidores de Orientia, ubicados en España. Solo el orientador titular de la cuenta tiene acceso a sus propios informes. No existe acceso de terceros, incluido el equipo de Orientia, a los informes individuales de los alumnos. Los datos se pueden eliminar en cualquier momento desde la configuración de la cuenta.",
  },
  {
    pregunta: "¿Orientia funciona desde el móvil o tablet?",
    respuesta:
      "Sí. Orientia es una aplicación web totalmente responsiva que funciona en cualquier dispositivo con navegador: ordenador, tablet y móvil. No requiere instalación ni descarga de ninguna aplicación.",
  },
  {
    pregunta: "¿Necesito conocimientos técnicos de IA para usar Orientia?",
    respuesta:
      "No. Orientia está diseñada para que cualquier orientador pueda usarla sin conocimientos técnicos. El proceso es: introduces los datos de la evaluación en el formulario, la IA genera el informe, tú lo revisas y lo exportas. No hay parámetros, modelos ni ajustes técnicos que configurar.",
  },
  {
    pregunta: "¿Puedo usar Orientia si soy orientador de un EOE?",
    respuesta:
      "Sí. Orientia es igualmente útil para orientadores que trabajan en Equipos de Orientación Educativa (EOE), donde la carga de evaluaciones psicopedagógicas suele ser especialmente alta al atender a varios centros. La plataforma no distingue entre orientadores de departamento y orientadores de EOE.",
  },
  {
    pregunta: "¿Qué normativa sigue Orientia para la estructura de los informes?",
    respuesta:
      "Los informes de Orientia siguen la estructura establecida por la Orden de 19 de septiembre de 2002 de la Consejería de Educación de la Junta de Andalucía y las instrucciones de la Dirección General de Participación e Inclusión Educativa. La terminología empleada está alineada con el Decreto 147/2002 y con las actualizaciones normativas posteriores sobre atención a la diversidad en Andalucía.",
  },
  {
    pregunta: "¿Cómo puedo contactar con el equipo de Orientia?",
    respuesta:
      "Puedes contactarnos por email en info@orientia.es (consultas generales) o privacidad@orientia.es (cuestiones de protección de datos). El horario de atención es de lunes a viernes de 8:00 a 15:00. Los usuarios del Plan Profesional tienen soporte prioritario con tiempo de respuesta garantizado.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section
        className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20 px-4"
        aria-labelledby="faq-h1"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            FAQ
          </div>
          <h1
            id="faq-h1"
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight"
          >
            Preguntas frecuentes
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitas saber sobre Orientia, los informes psicopedagógicos
            con IA y la privacidad de los datos de tus alumnos.
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 px-4" aria-labelledby="faq-lista">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-lista" className="sr-only">
            Listado de preguntas frecuentes
          </h2>

          <dl className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
              >
                <dt>
                  <details className="group">
                    <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                      <span className="text-base font-semibold text-gray-900 leading-snug">
                        {faq.pregunta}
                      </span>
                      <ChevronDown
                        className="h-5 w-5 text-green-600 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <dd className="px-6 pb-5 pt-0">
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {faq.respuesta}
                      </p>
                    </dd>
                  </details>
                </dt>
              </div>
            ))}
          </dl>

          {/* ¿No encuentras respuesta? */}
          <div className="mt-12 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <HelpCircle className="h-10 w-10 text-green-600 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
              Escríbenos y te respondemos en menos de 24 horas (horario laboral).
            </p>
            <Button
              asChild
              className="bg-green-700 hover:bg-green-800 text-white font-semibold"
            >
              <Link href="/#contacto">
                Contactar
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FAQPage schema ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://orientia.es/faq",
            name: "Preguntas Frecuentes — Orientia",
            url: "https://orientia.es/faq",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.pregunta,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.respuesta,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
