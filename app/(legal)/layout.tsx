import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Layout para las páginas legales (privacidad, términos, etc.).
 * Incluye la cabecera y el pie de página estándar para mantener la consistencia
 * en la navegación del sitio.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-gray-50 py-2 sm:py-4">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}