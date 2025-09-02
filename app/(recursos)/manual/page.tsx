
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manual de uso',
  description:
    'Guía completa para la creación de informes psicopedagógicos con instrucciones detalladas y ejemplos prácticos. Optimiza tu proceso de redacción con herramientas claras y efectivas.',
  robots: {
    index: false,
    follow: true,
  },
};



export default function ManualPage() {
  return(
    <section>
      <h1>Manual</h1>
    </section>
  )
}