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
    <Card className="col-span-full lg:col-span-3">
      <CardHeader>
        <CardTitle>Actividad Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={datosOrdenados}>
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
