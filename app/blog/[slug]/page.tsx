import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Tag, ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { posts, getPost, getAllSlugs } from "@/data/blog/posts";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.titulo} | Blog Orientia`,
    description: post.descripcion,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.titulo,
      description: post.descripcion,
      url: `https://orientia.es/blog/${post.slug}`,
      type: "article",
      publishedTime: post.fecha,
      modifiedTime: post.fechaActualizacion ?? post.fecha,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const fecha = new Date(post.fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fechaActualizacion = post.fechaActualizacion
    ? new Date(post.fechaActualizacion).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Posts relacionados (los otros 2)
  const relacionados = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-green-200 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Volver al blog
            </Link>
          </nav>

          {/* Categoría */}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-800 bg-green-100 px-2.5 py-1 rounded-full mb-4">
            <Tag className="h-3 w-3" aria-hidden="true" />
            {post.categoria}
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6 tracking-tight">
            {post.titulo}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-green-200 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.fecha}>{fecha}</time>
            </span>
            {fechaActualizacion && (
              <span className="flex items-center gap-1.5">
                Actualizado: <time dateTime={post.fechaActualizacion}>{fechaActualizacion}</time>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.tiempoLectura} min de lectura
            </span>
          </div>
        </div>
      </section>

      {/* ── Contenido ── */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Descripción destacada */}
        <p className="text-xl text-gray-600 leading-relaxed mb-10 pb-10 border-b border-gray-200">
          {post.descripcion}
        </p>

        {/* Cuerpo del artículo */}
        <article
          className="prose prose-gray prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-ul:text-gray-700 prose-ol:text-gray-700
            prose-li:leading-relaxed prose-li:my-1
            prose-strong:text-gray-900
            prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.contenido }}
        />

        {/* CTA inline */}
        <div className="mt-16 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Genera tus informes en minutos con Orientia
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Deja de dedicar horas a la redacción. Orientia genera el borrador
            técnico; tú lo revisas y lo firmas.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold"
          >
            <Link href="/register">
              Empezar gratis
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Artículos relacionados ── */}
      {relacionados.length > 0 && (
        <section className="py-16 px-4 bg-gray-50" aria-labelledby="relacionados-titulo">
          <div className="max-w-7xl mx-auto">
            <h2
              id="relacionados-titulo"
              className="text-2xl font-bold text-gray-900 mb-8"
            >
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relacionados.map((rel) => (
                <article
                  key={rel.slug}
                  className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg"
                >
                  <div className="p-6">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full mb-3">
                      <Tag className="h-3 w-3" aria-hidden="true" />
                      {rel.categoria}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="hover:text-green-700 transition-colors"
                      >
                        {rel.titulo}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {rel.descripcion}
                    </p>
                    <Link
                      href={`/blog/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
                    >
                      Leer artículo
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schema Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `https://orientia.es/blog/${post.slug}`,
            headline: post.titulo,
            description: post.descripcion,
            datePublished: post.fecha,
            dateModified: post.fechaActualizacion ?? post.fecha,
            inLanguage: "es-ES",
            url: `https://orientia.es/blog/${post.slug}`,
            publisher: { "@id": "https://orientia.es/#organization" },
            author: { "@id": "https://orientia.es/#organization" },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://orientia.es/blog/${post.slug}`,
            },
          }),
        }}
      />
    </div>
  );
}
