
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  FileText,
  Shield,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Database,
  Award,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import SecuritySection from '@/components/SecuritySection';
import Benefits from '@/components/Benefits';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Sistema de Informes Psicopedagógicos',
  description:
    'Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con IA. Ahorra tiempo, garantiza calidad y cumple normativa.',
  openGraph: {
    title: 'Sistema de Informes Psicopedagógicos',
    description: 'Plataforma oficial para orientadores educativos. Genera informes con IA.',
    url: 'https://orientia.es',
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
            url: 'https://orientia.es',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EUR',
            },
            provider: {
              '@type': '',
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
      <main role='main'>
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Benefits Section */}
        <Benefits />

        {/* Security Section */}
        <SecuritySection />

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
