import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import CookieBanner from "@/components/consent/CookieBanner";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import UmamiAnalytics from "@/components/consent/UmamiAnalytics";
import BackToTopButton from "@/components/navigation/BackToTopButton";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true, // Preload automático de Next.js
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orientia.es"),
  title: {
    default: "Orientia — Sistema de Informes Psicopedagógicos con IA",
    template: "%s | Orientia",
  },
  icons: {
    icon: [{ url: "/icons/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  description:
    "Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con asistencia de IA, optimizando tiempo y garantizando calidad técnica.",
  authors: [{ name: "Antonio José Robles Muñoz" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://orientia.es",
    siteName: "Orientia",
    title: "Orientia — Sistema de Informes Psicopedagógicos con IA",
    description:
      "Genera informes psicopedagógicos profesionales con IA en minutos. Plantillas oficiales, cumple normativa andaluza y RGPD. +500 orientadores confían en Orientia.",
    // La imagen OG la genera app/opengraph-image.tsx automáticamente
  },
  twitter: {
    card: "summary_large_image",
    title: "Orientia — Sistema de Informes Psicopedagógicos con IA",
    description:
      "Genera informes psicopedagógicos profesionales con IA en minutos. Plantillas oficiales, cumple normativa andaluza y RGPD.",
  },
  alternates: {
    canonical: "https://orientia.es",
    languages: {
      "es-ES": "https://orientia.es",
      "x-default": "https://orientia.es",
    },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://orientia.es/#organization",
              name: "Orientia",
              url: "https://orientia.es",
              logo: {
                "@type": "ImageObject",
                url: "https://orientia.es/icons/logo4.svg",
                width: 150,
                height: 40,
              },
              founder: {
                "@type": "Person",
                name: "Antonio José Robles Muñoz",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Av. de la Innovación, s/n",
                addressLocality: "Sevilla",
                postalCode: "41020",
                addressRegion: "Andalucía",
                addressCountry: "ES",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "privacidad@orientia.es",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* next/font ya inyecta preconnects a Google Fonts automáticamente */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-gray-900 focus:shadow"
        >
          Saltar al contenido principal
        </a>
        <Providers>
          <ConsentProvider>
            {children}
            <CookieBanner />
            {/* Google Analytics solo carga si consent.analytics === true */}
            <GoogleAnalytics />
            <UmamiAnalytics />
          </ConsentProvider>
        </Providers>
        <BackToTopButton />
        <Toaster richColors position="top-right" expand={true} />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
