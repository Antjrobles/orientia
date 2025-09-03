import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-emerald-50 text-gray-900">
      {/* Fondo global: gradiente emerald + patrón de puntitos */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Capa de gradiente (suave) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(5,150,105,0.22), rgba(4,120,87,0.22))",
          }}
        />
        {/* Capa de puntitos (igual estilo que la banda) */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16 md:flex-row md:gap-0 md:py-0">
        {/* Columna izquierda: más limpia */}
        <div className="flex items-center justify-center md:flex-1">
          <div className="relative">
            {/* Línea vertical simplificada (solo en escritorio) */}
            <div className="absolute -left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-400/40 to-transparent md:block" />
            {/* 404 más elegante */}
            <div className="relative select-none">
              <span className="block text-[8rem] md:text-[10rem] font-light leading-none tracking-tighter text-emerald-600/20">
                404
              </span>
              <span className="absolute inset-0 block text-[8rem] md:text-[10rem] font-light leading-none tracking-tighter text-emerald-600/60" />
            </div>
            {/* Línea de acento más sutil (solo en escritorio) */}
            <div className="mt-4 hidden h-0.5 w-16 bg-emerald-500/60 md:block" />
          </div>
        </div>

        {/* Columna derecha: más espaciada */}
        <div className="flex w-full flex-col items-center space-y-6 md:w-auto md:flex-1 md:items-start">
          {/* Badge más discreto */}
          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-300/30 bg-white/70 px-3 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Página no encontrada
          </div>

          {/* Títulos más respirados */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900">
              Esta página no existe
            </h1>
            <p className="max-w-md text-base text-gray-700 leading-relaxed">
              La ruta solicitada no se encuentra disponible. Puedes volver al
              inicio o contactar con soporte.
            </p>
          </div>

          {/* Tarjeta principal rediseñada */}
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-200/50 bg-white/80 shadow-sm backdrop-blur-sm">
            {/* Acciones principales */}
            <div className="p-1">
              <Link
                href="/"
                className="group flex items-center gap-4 rounded-xl px-5 py-4 transition-all hover:bg-emerald-600 active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 transition-colors group-hover:bg-emerald-700">
                  <Home className="h-5 w-5 text-emerald-600 transition-colors group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 transition-colors group-hover:text-white">
                    Ir al inicio
                  </div>
                  <div className="text-xs text-gray-500 transition-colors group-hover:text-emerald-200">
                    Volver a la página principal
                  </div>
                </div>
                <div className="text-emerald-600 transition-all group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">
                  →
                </div>
              </Link>

              {/* Separador sutil */}
              <div className="mx-5 my-2 h-px bg-gray-200/60" />
            </div>

            {/* Footer informativo simplificado */}
            <div className="border-t border-emerald-200/30 bg-emerald-50/50 px-5 py-3">
              <div className="flex items-center justify-between text-xs text-emerald-700">
                <span className="font-mono">Error 404</span>
                <span className="font-mono">Ruta no encontrada</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
