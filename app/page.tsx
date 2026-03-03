import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/marketing/Hero";
import Header from "@/components/headers/Header";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";

// Lazy load components below-the-fold for better initial load performance
const Features = dynamic(() => import("@/components/marketing/Features"), {
  loading: () => <SectionSkeleton />,
});
const Benefits = dynamic(() => import("@/components/marketing/Benefits"), {
  loading: () => <SectionSkeleton />,
});
const SecuritySection = dynamic(
  () => import("@/components/marketing/SecuritySection"),
  {
    loading: () => <SectionSkeleton />,
  },
);
const Pricing = dynamic(() => import("@/components/marketing/Pricing"), {
  loading: () => <SectionSkeleton />,
});
const ContactForm = dynamic(() => import("@/components/forms/ContactForm"), {
  loading: () => <SectionSkeleton />,
});
const CTASection = dynamic(() => import("@/components/marketing/CTASection"), {
  loading: () => <SectionSkeleton />,
});

// Simple skeleton loader for sections
function SectionSkeleton() {
  return (
    <div className="py-20 bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Sistema de Informes Psicopedagógicos con IA",
  description:
    "Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con IA. Ahorra tiempo, garantiza calidad y cumple normativa.",
  openGraph: {
    title: "Orientia — Sistema de Informes Psicopedagógicos con IA",
    description:
      "Genera informes psicopedagógicos con IA en minutos. Plantillas oficiales, cumple normativa andaluza y RGPD. Gratis para empezar.",
    url: "https://orientia.es",
    // La imagen OG la genera app/opengraph-image.tsx automáticamente
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      {/* WebApplication schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "@id": "https://orientia.es/#webapp",
            name: "Orientia — Sistema de Informes Psicopedagógicos",
            description:
              "Plataforma para orientadores educativos que genera informes psicopedagógicos profesionales con IA.",
            url: "https://orientia.es",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: [
              {
                "@type": "Offer",
                name: "Plan Gratuito",
                price: "0",
                priceCurrency: "EUR",
                url: "https://orientia.es/#pricing",
              },
              {
                "@type": "Offer",
                name: "Plan Profesional",
                price: "4.99",
                priceCurrency: "EUR",
                url: "https://orientia.es/#pricing",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "4.99",
                  priceCurrency: "EUR",
                  billingDuration: "P1M",
                },
              },
            ],
            provider: { "@id": "https://orientia.es/#organization" },
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "counselor",
            },
          }),
        }}
      />

      {/* WebSite schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://orientia.es/#website",
            name: "Orientia",
            url: "https://orientia.es",
            publisher: { "@id": "https://orientia.es/#organization" },
          }),
        }}
      />

      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <DynamicBreadcrumb />

      {/* Main Content */}
      <main id="main" role="main">
        {/* Hero Section - Loaded immediately for LCP */}
        <Hero />

        {/* Below-the-fold sections - Lazy loaded with Suspense */}
        <Suspense fallback={<SectionSkeleton />}>
          <Features />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Benefits />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SecuritySection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Pricing />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ContactForm />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <CTASection />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
