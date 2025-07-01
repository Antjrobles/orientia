"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"
import Image from 'next/image';
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import SecuritySection from "@/components/SecuritySection";
import Benefits from "@/components/Benefits"
import Features from "@/components/Features"
import Hero from "@/components/Hero"
import Header from "@/components/Header"
import Breadcrumb from "@/components/Breadcrumb"
import ContactForm from "@/components/ContactForm"


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Sistema de Informes Psicopedagógicos",
            description: "Plataforma oficial para orientadores educativos de la Junta de Andalucía",
            url: "https://orientia.es",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            provider: {
              "@type": "",
              name: "Antonio Robles",
              url: "https://www.juntadeandalucia.es",
            },
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "counselor",
            },
          }),
        }}
      />

      {/* Header */}
        <Header />

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Main Content */}
      <main role="main">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Benefits Section */}
        <Benefits />

        {/* Security Section */}
        <SecuritySection />

        {/* CTA Section */}
        <ContactForm />

        {/* Call to Action Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
