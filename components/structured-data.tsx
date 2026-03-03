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
  // FIX: @type era inexistente — Google no podía interpretar la entidad Organization
  "@type": "Organization",
  "@id": "https://orientia.es/#organization",
  name: "Orientia",
  alternateName: "Orientia — Sistema de Informes Psicopedagógicos",
  url: "https://orientia.es",
  logo: {
    "@type": "ImageObject",
    // FIX: Apuntar a un logo de mayor resolución (mínimo recomendado 112×112 px)
    url: "https://orientia.es/icons/icon-512x512.png",
    width: 512,
    height: 512,
    caption: "Logo de Orientia",
  },
  // FIX: Añadir sameAs para reforzar la entidad en el Grafo de Conocimiento de Google
  sameAs: [
    "https://orientia.es",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+34955064000",
    email: "info@orientia.es",
    contactType: "customer support",
    availableLanguage: "Spanish",
    areaServed: "ES-AN",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
      ],
      opens: "08:00",
      closes: "15:00",
    },
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. de la Innovación, s/n",
    addressLocality: "Sevilla",
    addressRegion: "Andalucía",
    postalCode: "41020",
    addressCountry: "ES",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Andalucía",
    addressCountry: "ES",
  },
  founder: {
    "@type": "Person",
    name: "Antonio José Robles Muñoz",
  },
};

/**
 * ⛔ DEPRECATED — NO USAR
 *
 * FAQPage (@type: "FAQPage") está RESTRINGIDO desde agosto 2023 por Google.
 * Solo se permite en sitios de gobierno y autoridades sanitarias.
 * Usarlo en un SaaS educativo NO generará rich results y puede ser ignorado o penalizado.
 *
 * Referencia: https://developers.google.com/search/blog/2023/08/howto-faq-changes
 *
 * Alternativa recomendada: añadir las preguntas frecuentes como texto estructurado
 * en la página /faq y marcarlas con encabezados semánticos (h2/h3 + p).
 */
// export const faqStructuredData = { ... }; // ELIMINADO intencionadamente
