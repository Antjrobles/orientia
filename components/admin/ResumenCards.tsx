"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, Hourglass } from "lucide-react";

interface Props {
  totalUsuarios: number;
  totalInformes: number;
  informesCompletados: number;
  informesEnProgreso: number;
}

export function ResumenCards({
  totalUsuarios,
  totalInformes,
  informesCompletados,
  informesEnProgreso,
}: Props) {
  const tarjetas = [
    {
      titulo: "Total de usuarios",
      valor: totalUsuarios,
      descripcion: "Usuarios registrados",
      icono: <Users className="h-5 w-5 text-emerald-600" />,
    },
    {
      titulo: "Total de informes",
      valor: totalInformes,
      descripcion: "Informes generados",
      icono: <FileText className="h-5 w-5 text-emerald-600" />,
    },
    {
      titulo: "Informes completados",
      valor: informesCompletados,
      descripcion: "Marcados como completados",
      icono: <Activity className="h-5 w-5 text-emerald-600" />,
    },
    {
      titulo: "En progreso",
      valor: informesEnProgreso,
      descripcion: "Aun en desarrollo",
      icono: <Hourglass className="h-5 w-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {tarjetas.map((tarjeta, i) => (
        <Card
          key={i}
          className="border-border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-300">
              {tarjeta.titulo}
            </CardTitle>
            <div className="rounded-full bg-emerald-500/10 p-2">
              {tarjeta.icono}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {tarjeta.valor}
            </div>
            <p className="text-xs font-medium text-emerald-300/90">
              {tarjeta.descripcion}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
