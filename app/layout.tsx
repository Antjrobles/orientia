import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://orientia.es'),
  title: {
    default: 'Sistema de Informes Psicopedagógicos - ',
    template: '%s | Sistema de Informes Psicopedagógicos - ',
  },
  icons: {
    icon: [{ url: '/icons/favicon.ico', sizes: 'any' }],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  description:
    'Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con asistencia de IA, optimizando tiempo y garantizando calidad técnica.',
  keywords: [
    'informes psicopedagógicos',
    'orientadores educativos',
    'inteligencia artificial',
    'educación',
    'psicopedagogía',
    'orientación escolar',
    'informes escolares',
    'evaluación psicopedagógica',
    'sistema educativo andaluz',
  ],
  authors: [{ name: 'Antonio José Robles Muñoz' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://orientia.es',
    siteName: 'Sistema de Informes Psicopedagógicos',
    title: 'Sistema de Informes Psicopedagógicos - ',
    description:
      'Plataforma oficial para orientadores educativos. Genera informes psicopedagógicos con IA, optimiza tiempo y garantiza calidad profesional.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sistema de Informes Psicopedagógicos - ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sistema de Informes Psicopedagógicos - ',
    description: 'Plataforma oficial para orientadores educativos. Genera informes psicopedagógicos con IA.',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://orientia.es',
    languages: {
      'es-ES': 'https://orientia.es',
    },
  },
  category: 'education',
  generator: 'Antonio Robles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <head>
        <link rel='icon' href='/icons/favicon.ico' sizes='any' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#16a34a' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}