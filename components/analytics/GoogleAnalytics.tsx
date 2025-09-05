"use client"

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useConsent } from '@/components/consent/ConsentProvider'

// Usamos la variable existente en .env.local
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export default function GoogleAnalytics() {
  // Consentimiento desde el provider (usa la categoría 'analytics')
  const { consent, loaded } = useConsent()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Si no hay ID, no renderiza nada
  if (!GA_MEASUREMENT_ID) return null
  // Esperar a cargar el provider y sólo cargar si hay consentimiento de analítica
  if (!loaded || !consent.analytics) return null

  // Enviar page_view en cambios de ruta (App Router)
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
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
  )
}
