
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manual de uso',
  description:
    'Guía completa para la creación de informes psicopedagógicos con instrucciones detalladas y ejemplos prácticos. Optimiza tu proceso de redacción con herramientas claras y efectivas.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: '/manual' },
};



export default function ManualPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">Manual</h1>
        <p className="text-sm text-gray-500 mb-8">Guía práctica para sacar el máximo partido a Orientia.</p>
        <div className="prose prose-lg max-w-none">
          <p>Estamos preparando el manual de uso con ejemplos y buenas prácticas. Muy pronto estará disponible.</p>
        </div>
      </div>
    </div>
  );
}
