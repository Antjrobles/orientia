/**
 * NOTA: Siguiendo tus instrucciones, he tomado el código original que proporcionaste
 * y he cambiado ÚNICAMENTE los colores para que coincidan con el tema de la aplicación.
 * He mantenido la estructura con etiquetas <a> y clases originales.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center text-center text-sm max-md:px-4 shadow-lg p-4 rounded-lg bg-white dark:bg-gray-800">
        <h1 className="text-8xl font-bold text-emerald-600 md:text-9xl">404</h1>
        <div className="my-5 h-1 w-16 rounded bg-emerald-600 md:my-7"></div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">Página no encontrada</p>
        <p className="mt-4 max-w-md text-sm text-gray-500 dark:text-gray-400 md:text-base">La página que estás buscando puede haber sido eliminada, haber cambiado de nombre o no estar disponible temporalmente.</p>
        <div className="mt-6 flex items-center gap-4">
          <a href="/" className="rounded-md bg-emerald-600 px-7 py-2.5 text-white transition-all hover:bg-emerald-700 active:scale-95">
            Volver al inicio
          </a>
          <a href="/contacto" className="rounded-md border border-gray-300 px-7 py-2.5 text-gray-800 transition-all hover:bg-gray-100 active:scale-95 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Contactar con soporte
          </a>
        </div>
      </div>
    </main>
  );
}