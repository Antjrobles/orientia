import Spinner from "@/components/ui/Spinner";

/**
 * Componente de carga genérico para toda la aplicación.
 * Next.js lo mostrará automáticamente como fallback de UI
 * mientras el contenido de una ruta se está cargando.
 * Se basa en React Suspense.
 */
export default function Loading() {
  return <Spinner variant="fullscreen" />;
}
