import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

/**
 * Este es el layout para todas las rutas de autenticación (login, register, etc.).
 * Proporciona un fondo consistente y centra el contenido en la pantalla.
 * Incluye un botón para volver al inicio.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Los componentes de página (page.tsx) que se renderizarán dentro de este layout.
 * @returns {JSX.Element}
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 p-4 dark:bg-gray-900">
      <Link href="/" className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-300 dark:hover:bg-gray-800">
        <Home className="h-4 w-4" />
        Volver al inicio
      </Link>
      <div className="w-full max-w-lg">{children}</div>
    </main>
  );
}