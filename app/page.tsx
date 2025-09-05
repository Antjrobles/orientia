
import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import CTASection from '@/components/marketing/CTASection';
import SecuritySection from '@/components/marketing/SecuritySection';
import Benefits from '@/components/marketing/Benefits';
import Features from '@/components/marketing/Features';
import Hero from '@/components/marketing/Hero';
import Header from '@/components/headers/Header';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import ContactForm from '@/components/forms/ContactForm';
import Pricing from '@/components/marketing/Pricing';

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
