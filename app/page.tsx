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

      {/*
       * ─────────────────────────────────────────────────────────────────────
       * 1. SoftwareApplication — App rich results (precio, categoría, rating)
       *    https://developers.google.com/search/docs/appearance/structured-data/software-app
       * ─────────────────────────────────────────────────────────────────────
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            // FIX: Usar SoftwareApplication (tipo principal documentado por Google para
            // App rich results) con WebApplication como tipo adicional.
            "@type": ["SoftwareApplication", "WebApplication"],
            "@id": "https://orientia.es/#webapp",
            name: "Orientia — Sistema de Informes Psicopedagógicos",
            description:
              "Plataforma para orientadores educativos que genera informes psicopedagógicos profesionales con IA. Cumple normativa de la Junta de Andalucía y RGPD.",
            url: "https://orientia.es",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            // FIX: Añadir inLanguage
            inLanguage: "es-ES",
            // FIX: Añadir featureList (recomendado para App rich results)
            featureList: [
              "Generación de informes psicopedagógicos con IA",
              "Plantillas oficiales Junta de Andalucía",
              "Exportación a PDF y Word",
              "Gestión centralizada de informes",
              "Cumplimiento RGPD",
              "Análisis de datos y estadísticas",
            ],
            screenshot: "https://orientia.es/icons/icon-512x512.png",
            // FIX: Añadir availability a los Offers
            offers: [
              {
                "@type": "Offer",
                name: "Plan Orientador Individual (Gratuito)",
                price: "0",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: "https://orientia.es/register",
                description:
                  "Hasta 5 informes al mes. Acceso a plantillas básicas. Soporte por email.",
              },
              {
                "@type": "Offer",
                name: "Plan Profesional",
                price: "4.99",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: "https://orientia.es/register?plan=profesional",
                description:
                  "Informes ilimitados, todas las plantillas, exportación PDF/Word, estadísticas y soporte prioritario.",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "4.99",
                  priceCurrency: "EUR",
                  // ISO 8601 duration — 1 mes
                  billingDuration: "P1M",
                  unitText: "mes",
                },
              },
              {
                "@type": "Offer",
                name: "Plan Profesional Anual",
                price: "49.90",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: "https://orientia.es/register?plan=profesional&billing=yearly",
                description:
                  "Todo el plan Profesional con facturación anual.",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "49.90",
                  priceCurrency: "EUR",
                  billingDuration: "P1Y",
                  unitText: "año",
                },
              },
            ],
            provider: { "@id": "https://orientia.es/#organization" },
            author: { "@id": "https://orientia.es/#organization" },
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "counselor",
            },
          }),
        }}
      />

      {/*
       * ─────────────────────────────────────────────────────────────────────
       * 2. WebSite + SearchAction (Sitelinks Searchbox en SERPs de Google)
       *    https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
       * ─────────────────────────────────────────────────────────────────────
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://orientia.es/#website",
            name: "Orientia",
            alternateName: "Orientia — Informes Psicopedagógicos con IA",
            url: "https://orientia.es",
            inLanguage: "es-ES",
            publisher: { "@id": "https://orientia.es/#organization" },
            // FIX: Añadir SearchAction para Sitelinks Searchbox
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://orientia.es/soporte?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/*
       * ─────────────────────────────────────────────────────────────────────
       * 3. BreadcrumbList — Muestra la ruta de navegación en los resultados
       *    de búsqueda (green breadcrumbs under the page title in SERPs).
       *    https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
       * ─────────────────────────────────────────────────────────────────────
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "@id": "https://orientia.es/#breadcrumb",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: "https://orientia.es",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Sistema de Informes Psicopedagógicos",
                item: "https://orientia.es",
              },
            ],
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
