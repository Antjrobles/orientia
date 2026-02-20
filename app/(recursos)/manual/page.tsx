import React from "react";
import { Metadata } from "next";
import ResourcePageShell from "@/components/layout/ResourcePageShell";

export const metadata: Metadata = {
  title: "Manual de uso",
  description:
    "Guía completa para la creación de informes psicopedagógicos con instrucciones detalladas y ejemplos prácticos. Optimiza tu proceso de redacción con herramientas claras y efectivas.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: "/manual" },
};

export default function ManualPage() {
  return (
    <ResourcePageShell
      title="Manual"
      description="Guía práctica para sacar el máximo partido a Orientia."
    >
      <p>
        Estamos preparando el manual de uso con ejemplos y buenas prácticas. Muy
        pronto estará disponible.
      </p>
    </ResourcePageShell>
  );
}
