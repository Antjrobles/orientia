import React from 'react';
import RecursosHeader from '@/components/RecursosHeader';
import Footer from '@/components/Footer';

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
      <main className="flex-grow bg-gray-50">{children}</main>
      <Footer />
    </>
  );
}
