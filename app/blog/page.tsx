import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { posts } from "@/data/blog/posts";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog | Recursos para Orientadores Educativos",
  description:
    "Artículos y guías prácticas para orientadores educativos en Andalucía: informes psicopedagógicos, NEAE, Séneca, plantillas y recursos para el departamento de orientación.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog de Orientia — Recursos para Orientadores",
    description:
      "Guías prácticas, plantillas y consejos para orientadores educativos en Andalucía.",
    url: "https://orientia.es/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section
        className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20 px-4"
        aria-labelledby="blog-h1"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Blog
          </div>
          <h1
            id="blog-h1"
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight"
          >
            Recursos para orientadores educativos
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            Guías prácticas, plantillas y consejos para el departamento de
            orientación. Todo enfocado en la realidad educativa de Andalucía.
          </p>
        </div>
      </section>

      {/* ── Artículos ── */}
      <section className="py-20 px-4" aria-labelledby="articulos-titulo">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2
              id="articulos-titulo"
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Últimos artículos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Contenido elaborado por y para profesionales de la orientación
              educativa.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pt-20 pb-5 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            ¿Listo para Optimizar tu Trabajo?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Únete a cientos de orientadores que ya están usando la IA para
            crear informes psicopedagógicos en minutos.
          </p>
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
          <p className="mt-6 text-sm text-green-200">
            Acceso gratuito para todos los orientadores de la Junta de Andalucía
          </p>
        </div>
      </section>

      {/* Schema Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": "https://orientia.es/blog",
            name: "Blog de Orientia",
            description:
              "Recursos y guías prácticas para orientadores educativos en Andalucía.",
            url: "https://orientia.es/blog",
            publisher: { "@id": "https://orientia.es/#organization" },
            inLanguage: "es-ES",
          }),
        }}
      />
    </div>
  );
}
