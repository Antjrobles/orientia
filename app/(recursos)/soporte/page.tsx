
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soporte',
  description:
    'Servicio de soporte técnico y profesional para resolver dudas en la elaboración de informes psicopedagógicos. Contacta con expertos para asistencia rápida y personalizada.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: '/soporte' },
};



export default function SoportePage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">Soporte</h1>
        <p className="text-sm text-gray-500 mb-8">¿Necesitas ayuda? Estamos aquí para ayudarte.</p>
        <div className="prose prose-lg max-w-none">
          <p>Ponte en contacto con nosotros en soporte@orientia.es o visita la sección FAQ para resolver dudas comunes.</p>
        </div>
      </div>
    </div>
  );
}
