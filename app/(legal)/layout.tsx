import React from "react";
import LegalHeader from "@/components/headers/LegalHeader";
import Footer from "@/components/layout/Footer";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";

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
      <LegalHeader />
      <DynamicBreadcrumb />
      <main
        id="main"
        role="main"
        tabIndex={-1}
        className="flex-grow bg-gray-50"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
