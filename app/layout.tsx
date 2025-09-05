import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import './globals.css';
import Providers from '@/components/providers/Providers';
import { ConsentProvider } from '@/components/consent/ConsentProvider';
import CookieBanner from '@/components/consent/CookieBanner';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { authOptions } from '../lib/auth';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.orientia.es'),
  title: {
    default: 'Sistema de Informes Psicopedagógicos',
    template: '%s | Sistema de Informes Psicopedagógicos',
  },
  icons: {
    icon: [{ url: '/icons/favicon.ico', sizes: 'any' }],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
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
    url: 'https://www.orientia.es',
    siteName: 'Sistema de Informes Psicopedagógicos',
    title: 'Sistema de Informes Psicopedagógicos',
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
    title: 'Sistema de Informes Psicopedagógicos',
    description: 'Plataforma oficial para orientadores educativos. Genera informes psicopedagógicos con IA.',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://www.orientia.es',
    languages: {
      'es-ES': 'https://www.orientia.es',
    },
  },
  category: 'education',
  generator: 'Antonio Robles',
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={inter.className}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-gray-900 focus:shadow">Saltar al contenido principal</a>
        <Providers session={session}>
          <ConsentProvider>
            {children}
            <CookieBanner />
          </ConsentProvider>
        </Providers>
        <Toaster richColors position='top-right' expand={true} />
        <Analytics />
      </body>
    </html>
  );
}
