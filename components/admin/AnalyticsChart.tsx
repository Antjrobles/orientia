"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  data: { dia: string; total: number }[];
}

const diasOrden = ["L", "M", "X", "J", "V", "S", "D"];

export function AnalyticsChart({ data }: Props) {
  // Aseguramos que los días vayan en orden lógico
  const datosOrdenados = diasOrden.map((letra) => {
    const encontrado = data.find((d) => d.dia === letra);
    return {
      dia: letra,
      total: encontrado?.total || 0,
    };
  });

  return (
    <Card className="col-span-full border-emerald-100/70 bg-white/90 shadow-sm lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-emerald-900/80">
          Actividad Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={datosOrdenados}>
            <XAxis dataKey="dia" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
