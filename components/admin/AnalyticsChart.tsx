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
import { cn } from "@/lib/utils";

interface Props {
  data: { dia: string; total: number }[];
  className?: string;
}

const diasOrden = ["L", "M", "X", "J", "V", "S", "D"];

export function AnalyticsChart({ data, className }: Props) {
  // Aseguramos que los dias vayan en orden logico
  const datosOrdenados = diasOrden.map((letra) => {
    const encontrado = data.find((d) => d.dia === letra);
    return {
      dia: letra,
      total: encontrado?.total || 0,
    };
  });

  return (
    <Card className={cn("border-emerald-100/70 bg-white/90 shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-emerald-900/80">
          Actividad semanal
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
