
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'formacion',
  description:
    'Cursos y recursos de formación para dominar la creación de informes psicopedagógicos. Aprende técnicas avanzadas y mejora tus habilidades profesionales con nuestro programa.',
  robots: {
    index: false,
    follow: true,
  },
};



export default function FormacionPage() {
  return(
    <section>
      <h1>Formacion</h1>
    </section>
  )
}