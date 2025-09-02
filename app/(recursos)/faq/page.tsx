
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Página de FAQs sobre la creación de informes psicopedagógicos, con respuestas claras y concisas a las dudas más comunes. Encuentra información útil para elaborar informes precisos y profesionales.',
  robots: {
    index: false,
    follow: true,
  },
};



export default function FAQPage() {
  return(
    <section>
      <h1>FAQ</h1>
    </section>
  )
}