import Script from "next/script"

interface StructuredDataProps {
  type: "WebApplication" | "Organization" | "Article" | "FAQPage"
  data: Record<string, any>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  }

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

// Datos estructurados específicos para la organización
export const organizationStructuredData = {
  name: "Orientia",
  alternateName: "Consejería de Desarrollo Educativo y Formación Profesional",
  url: "https://www.orientia.es",
  logo: "https://orientia.es/icons/logo2.svg",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+34-955-000-555",
    contactType: "technical support",
    availableLanguage: "Spanish",
    areaServed: "ES-AN",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Edificio Torretriana",
    addressLocality: "Sevilla",
    addressRegion: "Andalucía",
    postalCode: "41071",
    addressCountry: "ES",
    email: "antjrobles@gmail.es",
  },
  sameAs: [
    "https://www.facebook.com/",
    "https://twitter.com/",
    "https://www.youtube.com/user/",
  ],
}

// Datos estructurados para FAQ
export const faqStructuredData = {
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es el Sistema de Informes Psicopedagógicos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Orientia es una plataforma que utiliza inteligencia artificial para ayudar a los orientadores educativos a generar informes psicopedagógicos profesionales de manera eficiente.",
",
      },
    },
    {
      "@type": "Question",
      name: "¿Quién puede usar el sistema?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El sistema está diseñado para orientadores educativos, psicopedagogos y profesionales del sector que deseen optimizar su flujo de trabajo y la calidad de sus informes.",
",
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
}
