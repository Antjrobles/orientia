import React from "react";
import { Metadata } from "next";
import ResourcePageShell from "@/components/layout/ResourcePageShell";

export const metadata: Metadata = {
  title: "Formación",
  description:
    "Cursos y recursos de formación para dominar la creación de informes psicopedagógicos. Aprende técnicas avanzadas y mejora tus habilidades profesionales con nuestro programa.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: "/formacion" },
};

export default function FormacionPage() {
  return (
    <ResourcePageShell
      title="Formación"
      description="Programas y talleres para mejorar tus competencias."
    >
      <p>Muy pronto publicaremos calendarios y materiales de formación.</p>
    </ResourcePageShell>
  );
}
