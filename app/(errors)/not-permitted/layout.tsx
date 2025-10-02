import type { Metadata } from "next";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";

export const metadata: Metadata = {
  title: "Acceso restringido",
  description: "No tienes permisos para acceder a este recurso.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/not-permitted" },
};

export default function NotPermittedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DynamicBreadcrumb />
      {children}
    </div>
  );
}
