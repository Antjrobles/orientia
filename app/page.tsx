
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import SecuritySection from '@/components/SecuritySection';
import Benefits from '@/components/Benefits';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import ContactForm from '@/components/ContactForm';
import Pricing from '@/components/Pricing';

export const metadata: Metadata = {
  title: 'Sistema de Informes Psicopedagógicos',
  description:
    'Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con IA. Ahorra tiempo, garantiza calidad y cumple normativa.',
  openGraph: {
    title: 'Sistema de Informes Psicopedagógicos',
    description: 'Plataforma oficial para orientadores educativos. Genera informes con IA.',
    url: 'https://www.orientia.es',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Sistema de Informes Psicopedagógicos',
      },
    ],
  },
};

export default function Page() {
  return (
    <div className='min-h-screen bg-white'>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-gray-900 focus:shadow">Saltar al contenido principal</a>
      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Sistema de Informes Psicopedagógicos',
            description: 'Plataforma oficial para orientadores educativos',
            url: 'https://www.orientia.es',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EUR',
            },
            provider: {
              '@type': 'Organization',
              name: 'Antonio Robles',
              url: 'https://www.orientia.es',
            },
            audience: {
              '@type': 'EducationalAudience',
              educationalRole: 'counselor',
            },
          }),
        }}
      />

      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Main Content */}
      <main id='main' role='main'>
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Benefits Section */}
        <Benefits />

        {/* Security Section */}
        <SecuritySection />

        {/* Pricing Section */}
        <Pricing/>

        {/* Contact Form */}
        <ContactForm />

        {/* Call to Action Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
