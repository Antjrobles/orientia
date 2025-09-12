import React from 'react';
import RecursosHeader from '@/components/headers/RecursosHeader';
import Footer from '@/components/layout/Footer';
import DynamicBreadcrumb from '@/components/navigation/DynamicBreadcrumb';

/**
 * Layout para las páginas de recursos (FAQ, Manual, Soporte, Formación).
 * Incluye la cabecera y el pie de página estándar para mantener la consistencia
 * en la navegación del sitio.
 */
export default function RecursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RecursosHeader />
      <DynamicBreadcrumb />
      <main id="main" role="main" tabIndex={-1} className="flex-grow bg-gray-50">{children}</main>
      <Footer />
    </>
  );
}
