import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText } from "lucide-react";
import Link from "next/link";
import { format, getDay, subDays, isAfter } from "date-fns";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ResumenCards } from "@/components/admin/ResumenCards";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface InformeReciente {
  id: string;
  informacion_alumno: { nombre_apellidos?: string } | null;
  autor_id: string;
  estado: string;
  creado_en: string;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  const [
    { count: totalUsers, error: usersCountError },
    { count: totalReports, error: reportsCountError },
    { data: allReports, error: recentReportsError },
    { data: allUsers, error: allUsersError },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("informes").select("*", { count: "exact", head: true }),
    supabase
      .from("informes")
      .select("id, informacion_alumno, autor_id, estado, creado_en")
      .order("creado_en", { ascending: false }),
    supabase
      .from("users")
      .select("id, name, email, image, role")
      .order("name", { ascending: true }),
  ]);

  if (
    usersCountError ||
    reportsCountError ||
    recentReportsError ||
    allUsersError
  ) {
    console.error("Error al obtener los datos para el dashboard de admin:", {
      usersCountError,
      reportsCountError,
      recentReportsError,
      allUsersError,
    });
  }

  const informesRecientesSeguros = (allReports || []) as InformeReciente[];

  // Datos para el gráfico (últimos 7 días)
  const hace7Dias = subDays(new Date(), 7);
  const resumenSemanal = Array(7).fill(0); // D, L, M, X, J, V, S

  informesRecientesSeguros.forEach((informe) => {
    const fecha = new Date(informe.creado_en);
    if (isAfter(fecha, hace7Dias)) {
      const dia = getDay(fecha); // 0 = domingo
      resumenSemanal[dia]++;
    }
  });

  const dias = ["D", "L", "M", "X", "J", "V", "S"];
  const datosGrafico = resumenSemanal.map((total, index) => ({
    dia: dias[index],
    total,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Vista general de la actividad de la plataforma.
          </p>
        </div>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <ResumenCards
        totalUsuarios={totalUsers ?? 0}
        totalInformes={totalReports ?? 0}
        informesCompletados={
          informesRecientesSeguros.filter((i) => i.estado === "completado").length
        }
        informesEnProgreso={
          informesRecientesSeguros.filter((i) => i.estado === "en_progreso").length
        }
      />

      {/* GRÁFICO DE ACTIVIDAD */}
      <AnalyticsChart data={datosGrafico} />

      {/* INFORMES RECIENTES */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Informes Recientes</CardTitle>
            <CardDescription>
              Últimos 5 informes generados en la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead className="hidden sm:table-cell">Estado</TableHead>
                  <TableHead className="hidden md:table-cell">ID Autor</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {informesRecientesSeguros.slice(0, 5).map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium">
                        {report.informacion_alumno?.nombre_apellidos || "No especificado"}
                      </div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        ID: {report.id.substring(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {report.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {report.autor_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-right">
                      {format(new Date(report.creado_en), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* TABLA DE USUARIOS */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Administra todos los usuarios de la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={allUsers || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
