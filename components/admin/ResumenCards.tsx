// components/admin/ResumenCards.tsx
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
      titulo: "Total de Usuarios",
      valor: totalUsuarios,
      descripcion: "Usuarios registrados",
      icono: <Users className="h-5 w-5 text-emerald-600" />,
    },
    {
      titulo: "Total de Informes",
      valor: totalInformes,
      descripcion: "Informes generados",
      icono: <FileText className="h-5 w-5 text-emerald-600" />,
    },
    {
      titulo: "Informes Completados",
      valor: informesCompletados,
      descripcion: "Marcados como completados",
      icono: <Activity className="h-5 w-5 text-emerald-600" />,
    },
    {
      titulo: "En Progreso",
      valor: informesEnProgreso,
      descripcion: "Aún en desarrollo",
      icono: <Hourglass className="h-5 w-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {tarjetas.map((tarjeta, i) => (
        <Card
          key={i}
          className="border-emerald-100/70 bg-white/90 shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-900/80">
              {tarjeta.titulo}
            </CardTitle>
            <div className="rounded-full bg-emerald-50 p-2">
              {tarjeta.icono}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {tarjeta.valor}
            </div>
            <p className="text-xs font-medium text-emerald-700/80">
              {tarjeta.descripcion}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
