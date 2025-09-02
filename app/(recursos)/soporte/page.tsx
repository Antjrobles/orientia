
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'soporte',
  description:
    'Servicio de soporte técnico y profesional para resolver dudas en la elaboración de informes psicopedagógicos. Contacta con expertos para asistencia rápida y personalizada.',
  robots: {
    index: false,
    follow: true,
  },
};



export default function SoportePage() {
  return(
    <section>
      <h1>Soporte</h1>
    </section>
  )
}