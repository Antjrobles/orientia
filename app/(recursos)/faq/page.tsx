import React from "react";
import { Metadata } from "next";
import ResourcePageShell from "@/components/layout/ResourcePageShell";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Página de FAQs sobre la creación de informes psicopedagógicos, con respuestas claras y concisas a las dudas más comunes. Encuentra información útil para elaborar informes precisos y profesionales.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <ResourcePageShell
      title="FAQ"
      description="Preguntas frecuentes sobre el uso de Orientia."
    >
      <p>
        Pronto añadiremos las preguntas y respuestas más comunes para ayudarte
        a resolver dudas rápidamente.
      </p>
    </ResourcePageShell>
  );
}
