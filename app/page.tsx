import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "Sistema de Informes Psicopedagógicos",
  description:
    "Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con IA. Ahorra tiempo, garantiza calidad y cumple normativa.",
  openGraph: {
    title: "Sistema de Informes Psicopedagógicos",
    description: "Plataforma oficial para orientadores educativos. Genera informes con IA.",
    url: "https://orientia.es",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Sistema de Informes Psicopedagógicos",
      },
    ],
  },
}

export default function LandingPage() {
  return <ClientPage />
}
