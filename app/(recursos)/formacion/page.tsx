import React from "react";
import { Metadata } from "next";

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
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
          Formación
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Programas y talleres para mejorar tus competencias.
        </p>
        <div className="prose prose-lg max-w-none">
          <p>Muy pronto publicaremos calendarios y materiales de formación.</p>
        </div>
      </div>
    </div>
  );
}
