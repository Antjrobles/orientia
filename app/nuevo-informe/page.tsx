import type { Metadata } from "next"
import NuevoInformeClientPage from "./NuevoInformeClientPage"

export const metadata: Metadata = {
  title: "Nuevo Informe Psicopedagógico",
  description:
    "Crear un nuevo informe psicopedagógico con asistencia de IA. Formulario completo para orientadores educativos de la Junta de Andalucía.",
  openGraph: {
    title: "Nuevo Informe Psicopedagógico - Junta de Andalucía",
    description: "Crear informes psicopedagógicos con IA de forma rápida y profesional",
    url: "https://orientia/nuevo-informe",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function NuevoInformePage() {
  return <NuevoInformeClientPage />
}
