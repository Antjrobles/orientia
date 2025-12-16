"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useConsent } from "@/components/consent/ConsentProvider";

// Usamos la variable existente en .env.local
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function GoogleAnalytics() {
  // Consentimiento desde el provider (usa la categoría 'analytics')
  const { consent, loaded } = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mantener los hooks siempre al mismo orden; evitar returns antes de hooks.
  // Enviar page_view en cambios de ruta si ya está cargado gtag y hay consentimiento.
  useEffect(() => {
    const allowed = !!GA_MEASUREMENT_ID && loaded && consent.analytics;
    if (!allowed) return;
    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("config", GA_MEASUREMENT_ID as string, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, loaded, consent.analytics]);

  const allowed = !!GA_MEASUREMENT_ID && loaded && consent.analytics;

  if (!allowed) return null;

  return (
    <>
      {/* Google Analytics se carga solo cuando el navegador está idle (desocupado) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
