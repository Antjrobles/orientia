import React from "react";
import type { Metadata } from "next";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import DeviceIdHydrator from "@/components/security/DeviceIdHydrator";

export const metadata: Metadata = {
  title: {
    default: "Acceso | Orientia",
    template: "%s | Orientia",
  },
  description:
    "Inicia sesión o crea tu cuenta para acceder a Orientia y generar informes psicopedagógicos.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Acceso | Orientia",
    description:
      "Inicia sesión o crea tu cuenta para acceder a Orientia y generar informes psicopedagógicos.",
    siteName: "Orientia",
  },
  twitter: {
    card: "summary",
    title: "Acceso | Orientia",
    description:
      "Inicia sesión o crea tu cuenta para acceder a Orientia y generar informes psicopedagógicos.",
  },
};

/**
 * Este es el layout para todas las rutas de autenticación (login, register, etc.).
 * Proporciona un fondo consistente y centra el contenido en la pantalla.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <DeviceIdHydrator />
      <DynamicBreadcrumb />
      <main
        id="main"
        role="main"
        tabIndex={-1}
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gray-50 p-4"
      >
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
