import React from "react";
import { Metadata } from "next";
import ResourcePageShell from "@/components/layout/ResourcePageShell";

export const metadata: Metadata = {
  title: "Soporte",
  description:
    "Servicio de soporte técnico y profesional para resolver dudas en la elaboración de informes psicopedagógicos. Contacta con expertos para asistencia rápida y personalizada.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: "/soporte" },
};

export default function SoportePage() {
  return (
    <ResourcePageShell
      title="Soporte"
      description="¿Necesitas ayuda? Estamos aquí para ayudarte."
    >
      <p>
        Ponte en contacto con nosotros en soporte@orientia.es o visita la
        sección FAQ para resolver dudas comunes.
      </p>
    </ResourcePageShell>
  );
}
