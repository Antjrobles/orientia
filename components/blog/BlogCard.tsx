import Link from "next/link";
import { Clock, Tag, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blog/posts";

export default function BlogCard({ post }: { post: BlogPost }) {
  const fecha = new Date(post.fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="hover:shadow-lg transition-shadow border-0 shadow-md bg-white rounded-lg flex flex-col h-full">
      <div className="p-6 flex flex-col flex-1">
        {/* Categoría */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
            <Tag className="h-3 w-3" aria-hidden="true" />
            {post.categoria}
          </span>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug group-hover:text-green-700 transition-colors">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
          >
            {post.titulo}
          </Link>
        </h2>

        {/* Descripción */}
        <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
          {post.descripcion}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <time dateTime={post.fecha}>{fecha}</time>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {post.tiempoLectura} min
            </span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
            aria-label={`Leer artículo: ${post.titulo}`}
          >
            Leer
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
