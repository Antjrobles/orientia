
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Página de FAQs sobre la creación de informes psicopedagógicos, con respuestas claras y concisas a las dudas más comunes. Encuentra información útil para elaborar informes precisos y profesionales.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: '/faq' },
};



export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">FAQ</h1>
        <p className="text-sm text-gray-500 mb-8">Preguntas frecuentes sobre el uso de Orientia.</p>
        <div className="prose prose-lg max-w-none">
          <p>Pronto añadiremos las preguntas y respuestas más comunes para ayudarte a resolver dudas rápidamente.</p>
        </div>
      </div>
    </div>
  );
}
