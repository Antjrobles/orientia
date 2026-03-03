import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain,
  Shield,
  Users,
  Lightbulb,
  GraduationCap,
  Heart,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Orientia",
  description:
    "Conoce la misión y los valores de Orientia, la plataforma de IA para orientadores educativos en Andalucía. Creada para devolverte el tiempo.",
  alternates: { canonical: "/sobre-nosotros" },
  openGraph: {
    title: "Sobre Nosotros — Orientia",
    description:
      "Orientia nació de una pregunta: ¿por qué los orientadores dedican más tiempo a redactar informes que a orientar alumnos?",
    url: "https://orientia.es/sobre-nosotros",
  },
};

const valores = [
  {
    icon: GraduationCap,
    color: "bg-green-100",
    iconColor: "text-green-600",
    titulo: "Especialización real",
    texto:
      "No es una herramienta de IA genérica adaptada. Orientia está diseñada desde cero para la orientación en el sistema educativo andaluz.",
  },
  {
    icon: Shield,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    titulo: "Privacidad ante todo",
    texto:
      "Los datos de tus alumnos son sagrados. Cumplimos RGPD y LOPDGDD, con servidores en España y sin compartir datos con terceros.",
  },
  {
    icon: Heart,
    color: "bg-red-100",
    iconColor: "text-red-600",
    titulo: "Orientadores primero",
    texto:
      "Cada decisión de producto responde a una sola pregunta: ¿esto devuelve tiempo al orientador? Si no, no entra.",
  },
  {
    icon: Lightbulb,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
    titulo: "Transparencia técnica",
    texto:
      "Siempre sabrás qué hace la IA y cuándo revisar su output. El criterio profesional del orientador es siempre la última palabra.",
  },
];

const compromisos = [
  "Cumplimiento total del RGPD (Reglamento UE 2016/679)",
  "LOPDGDD — Ley Orgánica 3/2018 de Protección de Datos",
  "Servidores ubicados en territorio español (UE)",
  "Los datos de alumnos no se usan para entrenar modelos de IA",
  "Acuerdo de encargo de tratamiento según art. 28 GDPR",
  "Derecho de supresión y portabilidad garantizados",
  "Cifrado en tránsito (TLS) y en reposo",
  "Sin publicidad. Sin venta de datos a terceros. Nunca.",
];

const stats = [
  { label: "Tiempo medio con informes manuales", valor: "4–6 h" },
  { label: "Tiempo medio con Orientia", valor: "20–40 min" },
  { label: "Reducción de tiempo", valor: "~85 %" },
  { label: "Orientadores activos", valor: "+500" },
];

export default function SobreNosotrosPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section
        className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20 px-4"
        aria-labelledby="sobre-h1"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Users className="h-4 w-4" aria-hidden="true" />
            Sobre Orientia
          </div>
          <h1
            id="sobre-h1"
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight"
          >
            Tecnología al servicio del orientador, no al revés
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            Orientia nació de una pregunta simple: ¿por qué los orientadores educativos
            dedican más tiempo a redactar informes que a orientar alumnos?
          </p>
        </div>
      </section>

      {/* ── Misión + Stats ── */}
      <section className="py-20 px-4" aria-labelledby="mision-titulo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                id="mision-titulo"
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
              >
                El problema que resolvemos
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Un orientador educativo en Andalucía dedica de{" "}
                  <strong className="text-gray-900">3 a 6 horas</strong> en redactar un
                  informe psicopedagógico completo. Multiplica eso por la cantidad de
                  alumnos con NEAE en un centro y gran parte del tiempo del orientador
                  se va en escribir, no en orientar.
                </p>
                <p>
                  La normativa de la Junta de Andalucía exige una estructura específica.
                  Séneca tiene sus propios formatos. Cada tipo de necesidad —dislexia,
                  TDAH, altas capacidades, TEA— requiere terminología precisa. Todo eso
                  convierte la redacción en un trabajo tedioso que consume el recurso
                  más valioso: el tiempo con el alumno.
                </p>
                <p>
                  <strong className="text-gray-900">Orientia no reemplaza al orientador.</strong>{" "}
                  Le devuelve su tiempo. La IA genera el borrador técnico; el orientador
                  aporta el criterio profesional, lo revisa y lo firma.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-sm">
              <dl className="space-y-5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between items-center border-b border-green-200 pb-4 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-gray-600">{s.label}</dt>
                    <dd className="font-bold text-green-700 text-lg">{s.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── Equipo ── */}
      <section className="py-20 px-4 bg-gray-50" aria-labelledby="equipo-titulo">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2
              id="equipo-titulo"
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Nuestro equipo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un equipo multidisciplinar de desarrolladores, diseñadores y
              profesionales de la orientación educativa que trabajan juntos para
              que Orientia sea la herramienta que los orientadores merecen.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                color: "bg-green-100",
                iconColor: "text-green-600",
                rol: "Desarrollo e IA",
                desc: "Ingenieros especializados en IA generativa y procesamiento del lenguaje natural aplicado al ámbito educativo.",
              },
              {
                icon: GraduationCap,
                color: "bg-blue-100",
                iconColor: "text-blue-600",
                rol: "Orientación Educativa",
                desc: "Orientadores en activo que validan cada funcionalidad y aseguran que el output de la IA cumple los estándares profesionales.",
              },
              {
                icon: Target,
                color: "bg-purple-100",
                iconColor: "text-purple-600",
                rol: "Diseño y Producto",
                desc: "Especialistas en UX que hacen que una herramienta compleja sea simple, accesible y agradable de usar en el día a día.",
              },
            ].map((item) => (
              <article
                key={item.rol}
                className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg"
              >
                <div className="p-6">
                  <div
                    className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}
                    aria-hidden="true"
                  >
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.rol}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="py-20 px-4 bg-white" aria-labelledby="valores-titulo">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2
              id="valores-titulo"
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Nuestros principios
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los valores que guían cada decisión técnica y de producto en Orientia.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((v) => (
              <article
                key={v.titulo}
                className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg"
              >
                <div className="p-6">
                  <div
                    className={`w-12 h-12 ${v.color} rounded-lg flex items-center justify-center mb-4`}
                    aria-hidden="true"
                  >
                    <v.icon className={`h-6 w-6 ${v.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{v.titulo}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compromisos RGPD ── */}
      <section className="py-20 px-4 bg-gray-50" aria-labelledby="compromisos-titulo">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h2
              id="compromisos-titulo"
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Compromisos con los datos de tus alumnos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La privacidad no es un extra: es la base sobre la que construimos todo.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {compromisos.map((c) => (
              <div
                key={c}
                className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <CheckCircle
                  className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-sm text-gray-500">
            Más información en nuestra{" "}
            <Link href="/privacidad" className="text-green-700 hover:underline font-medium">
              Política de Privacidad
            </Link>{" "}
            y en la página de{" "}
            <Link href="/rgpd" className="text-green-700 hover:underline font-medium">
              RGPD
            </Link>.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="pt-20 pb-5 bg-gradient-to-r from-green-600 to-green-700 text-white"
        aria-labelledby="cta-sobre-titulo"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="cta-sobre-titulo"
            className="text-3xl lg:text-4xl font-bold mb-6"
          >
            ¿Listo para Optimizar tu Trabajo?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Únete a cientos de orientadores que ya están usando la IA para
            crear informes psicopedagógicos de calidad profesional en minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-green-700 hover:bg-green-50 font-semibold"
            >
              <Link href="/register">
                Solicitar Acceso
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-green-200">
            Acceso gratuito para todos los orientadores de la Junta de Andalucía
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": "https://orientia.es/sobre-nosotros",
            name: "Sobre Nosotros — Orientia",
            url: "https://orientia.es/sobre-nosotros",
            description:
              "Misión, valores y equipo de Orientia, plataforma de IA para orientadores educativos en Andalucía.",
            about: { "@id": "https://orientia.es/#organization" },
          }),
        }}
      />
    </div>
  );
}
