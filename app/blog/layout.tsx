import React from "react";
import LegalHeader from "@/components/headers/LegalHeader";
import Footer from "@/components/layout/Footer";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LegalHeader />
      <DynamicBreadcrumb />
      <main id="main" role="main" tabIndex={-1} className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
    </>
  );
}
