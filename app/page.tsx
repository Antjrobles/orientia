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
  title: "Sistema de Informes Psicopedagógicos",
  description:
    "Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con IA. Ahorra tiempo, garantiza calidad y cumple normativa.",
  openGraph: {
    title: "Sistema de Informes Psicopedagógicos",
    description:
      "Plataforma oficial para orientadores educativos. Genera informes con IA.",
    url: "https://www.orientia.es",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Sistema de Informes Psicopedagógicos",
      },
    ],
  },
};

export default function Page() {
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
            description: "Plataforma oficial para orientadores educativos",
            url: "https://www.orientia.es",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            provider: {
              "@type": "Organization",
              name: "Antonio Robles",
              url: "https://www.orientia.es",
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
