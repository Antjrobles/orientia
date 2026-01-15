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
import { format, getDay, subDays, isAfter } from "date-fns";
import { columns, type User } from "@/components/admin/columns";
import { DataTable } from "../../components/admin/data-table";
import { ResumenCards } from "@/components/admin/ResumenCards";
import dynamic from "next/dynamic";

// Code-split: recharts solo se carga en esta página
const AnalyticsChart = dynamic(
  () => import("@/components/admin/AnalyticsChart").then((mod) => ({ default: mod.AnalyticsChart }))
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
    { data: allTrustedDevices, error: trustedDevicesError },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("informes").select("*", { count: "exact", head: true }),
    supabase
      .from("informes")
      .select("id, informacion_alumno, autor_id, estado, creado_en")
      .order("creado_en", { ascending: false }),
    supabase
      .from("users")
      .select("id, name, email, image, role, emailVerified")
      .order("name", { ascending: true }),
    supabase.from("trusted_devices").select("user_id"),
  ]);

  if (
    usersCountError ||
    reportsCountError ||
    recentReportsError ||
    allUsersError ||
    trustedDevicesError
  ) {
    console.error("Error al obtener los datos para el dashboard de admin:", {
      usersCountError,
      reportsCountError,
      recentReportsError,
      allUsersError,
      trustedDevicesError,
    });
  }

  const informesRecientesSeguros = (allReports || []) as InformeReciente[];
  const trustedDevices = (allTrustedDevices || []) as { user_id: string }[];

  const reportStats = new Map<string, { count: number; lastReportAt?: string }>();
  informesRecientesSeguros.forEach((informe) => {
    const current = reportStats.get(informe.autor_id);
    if (!current) {
      reportStats.set(informe.autor_id, {
        count: 1,
        lastReportAt: informe.creado_en,
      });
      return;
    }
    current.count += 1;
    if (
      informe.creado_en &&
      (!current.lastReportAt ||
        new Date(informe.creado_en) > new Date(current.lastReportAt))
    ) {
      current.lastReportAt = informe.creado_en;
    }
  });

  const trustedDevicesCount = trustedDevices.reduce(
    (acc, item) => {
      acc[item.user_id] = (acc[item.user_id] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const usersWithStats = (allUsers || []).map((user) => {
    const stats = reportStats.get(user.id);
    return {
      ...user,
      reportsCount: stats?.count ?? 0,
      lastReportAt: stats?.lastReportAt ?? null,
      trustedDevicesCount: trustedDevicesCount[user.id] ?? 0,
    };
  });

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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Admin</Badge>
              <span className="text-xs text-muted-foreground">
                Actualizado {format(new Date(), "dd/MM/yyyy")}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Panel de Administraci¢n
            </h1>
            <p className="text-sm text-muted-foreground">
              Vista general de la actividad de la plataforma.
            </p>
          </div>
        </div>

{/* TARJETAS DE RESUMEN */}
      <ResumenCards
        totalUsuarios={totalUsers ?? 0}
        totalInformes={totalReports ?? 0}
        informesCompletados={
          informesRecientesSeguros.filter((i) => i.estado === "completado")
            .length
        }
        informesEnProgreso={
          informesRecientesSeguros.filter((i) => i.estado === "en_progreso")
            .length
        }
      />

      {/* GRÁFICO DE ACTIVIDAD */}
      <AnalyticsChart data={datosGrafico} />

      {/* INFORMES RECIENTES Y USUARIOS */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
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
                  <TableHead className="text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {informesRecientesSeguros.slice(0, 5).map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium">
                        {report.informacion_alumno?.nombre_apellidos ||
                          "No especificado"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {report.id.substring(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {report.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {format(new Date(report.creado_en), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Estadísticas Rápidas</CardTitle>
            <CardDescription>Resumen de actividad reciente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Usuarios Totales</span>
              <span className="text-2xl font-bold">{totalUsers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Informes Totales</span>
              <span className="text-2xl font-bold">{totalReports ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completados</span>
              <span className="text-2xl font-bold text-emerald-600">
                {
                  informesRecientesSeguros.filter(
                    (i) => i.estado === "completado",
                  ).length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">En Progreso</span>
              <span className="text-2xl font-bold text-orange-600">
                {
                  informesRecientesSeguros.filter(
                    (i) => i.estado === "en_progreso",
                  ).length
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLA DE USUARIOS */}
      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>
            Administra todos los usuarios de la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
              <DataTable<User> columns={columns} data={usersWithStats} />
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
