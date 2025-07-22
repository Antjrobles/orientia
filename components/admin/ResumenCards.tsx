// components/admin/ResumenCards.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Activity, Hourglass } from "lucide-react"

interface Props {
  totalUsuarios: number
  totalInformes: number
  informesCompletados: number
  informesEnProgreso: number
}

export function ResumenCards({
  totalUsuarios,
  totalInformes,
  informesCompletados,
  informesEnProgreso,
}: Props) {
  const tarjetas = [
    {
      titulo: "Total de Usuarios",
      valor: totalUsuarios,
      descripcion: "Usuarios registrados",
      icono: <Users className="h-5 w-5 text-muted-foreground" />,
    },
    {
      titulo: "Total de Informes",
      valor: totalInformes,
      descripcion: "Informes generados",
      icono: <FileText className="h-5 w-5 text-muted-foreground" />,
    },
    {
      titulo: "Informes Completados",
      valor: informesCompletados,
      descripcion: "Marcados como completados",
      icono: <Activity className="h-5 w-5 text-muted-foreground" />,
    },
    {
      titulo: "En Progreso",
      valor: informesEnProgreso,
      descripcion: "Aún en desarrollo",
      icono: <Hourglass className="h-5 w-5 text-muted-foreground" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {tarjetas.map((tarjeta, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tarjeta.titulo}</CardTitle>
            {tarjeta.icono}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tarjeta.valor}</div>
            <p className="text-xs text-muted-foreground">{tarjeta.descripcion}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
