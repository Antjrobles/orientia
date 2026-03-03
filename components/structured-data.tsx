import Script from "next/script";

interface StructuredDataProps {
  type: "WebApplication" | "Organization" | "Article" | "FAQPage";
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Datos estructurados específicos para la organización
export const organizationStructuredData = {
  "@id": "https://orientia.es/#organization",
  name: "Orientia",
  url: "https://orientia.es",
  logo: {
    "@type": "ImageObject",
    url: "https://orientia.es/icons/logo2.svg",
    width: 48,
    height: 48,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+34955064000",
    email: "info@orientia.es",
    contactType: "customer support",
    availableLanguage: "Spanish",
    areaServed: "ES-AN",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. de la Innovación, s/n",
    addressLocality: "Sevilla",
    addressRegion: "ES-AN",
    postalCode: "41020",
    addressCountry: "ES",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Andalucía",
    addressCountry: "ES",
  },
};

// Datos estructurados para FAQ
export const faqStructuredData = {
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es el Sistema de Informes Psicopedagógicos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Orientia es una plataforma que utiliza inteligencia artificial para ayudar a los orientadores educativos a generar informes psicopedagógicos profesionales de manera eficiente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Quién puede usar el sistema?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El sistema está diseñado para orientadores educativos, psicopedagogos y profesionales del sector que deseen optimizar su flujo de trabajo y la calidad de sus informes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es seguro el tratamiento de datos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, el sistema cumple estrictamente con el RGPD y todas las normativas de protección de datos. Los datos se procesan de forma segura y confidencial.",
      },
    },
  ],
};
