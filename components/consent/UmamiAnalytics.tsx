"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent/ConsentProvider";

export default function UmamiAnalytics() {
  const { consent } = useConsent();

  if (!consent?.analytics) {
    return null;
  }

  return (
    <Script
      src="https://umami.antjrobles.tech/script.js"
      data-website-id="884d7a2c-48fd-48ab-9111-01e0ae92f232"
      strategy="afterInteractive"
    />
  );
}
