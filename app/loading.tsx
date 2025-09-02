import { Loader2 } from 'lucide-react';

/**
 * Componente de carga genérico para toda la aplicación.
 * Next.js lo mostrará automáticamente como fallback de UI
 * mientras el contenido de una ruta se está cargando.
 * Se basa en React Suspense.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
    </div>
  );
}