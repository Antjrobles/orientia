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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Users } from "lucide-react";
import { format, getDay, subDays, isAfter } from "date-fns";
import { columns } from "@/components/admin/columns";
import { DataTable } from "@/components/admin/data-table";
import { ResumenCards } from "@/components/admin/ResumenCards";
import dynamic from "next/dynamic";
import { isSupabasePausedError } from "@/lib/supabase-errors";

const AnalyticsChart = dynamic(() =>
  import("@/components/admin/AnalyticsChart").then((mod) => ({
    default: mod.AnalyticsChart,
  })),
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
  const supabasePaused = [
    usersCountError,
    reportsCountError,
    recentReportsError,
    allUsersError,
    trustedDevicesError,
  ].some(isSupabasePausedError);

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

  const hace7Dias = subDays(new Date(), 7);
  const resumenSemanal = Array(7).fill(0);

  informesRecientesSeguros.forEach((informe) => {
    const fecha = new Date(informe.creado_en);
    if (isAfter(fecha, hace7Dias)) {
      const dia = getDay(fecha);
      resumenSemanal[dia]++;
    }
  });

  const dias = ["D", "L", "M", "X", "J", "V", "S"];
  const datosGrafico = resumenSemanal.map((total, index) => ({
    dia: dias[index],
    total,
  }));

  const informesCompletados = informesRecientesSeguros.filter(
    (i) => i.estado === "completado",
  ).length;
  const informesEnProgreso = informesRecientesSeguros.filter(
    (i) => i.estado === "en_progreso",
  ).length;
  const totalInformesSeguro = totalReports ?? 0;
  const completionRate = totalInformesSeguro
    ? Math.round((informesCompletados / totalInformesSeguro) * 100)
    : 0;
  const informesUltimaSemana = resumenSemanal.reduce((sum, val) => sum + val, 0);
  const ultimoInforme = informesRecientesSeguros[0];
  const ultimoInformeFecha = ultimoInforme
    ? format(new Date(ultimoInforme.creado_en), "dd/MM/yyyy")
    : "Sin datos";
  const adminLabel =
    session?.user?.name ?? session?.user?.email ?? "Administrador";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Admin</Badge>
              <span className="text-xs text-muted-foreground">
                Actualizado {format(new Date(), "dd/MM/yyyy")}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Panel de administracion
            </h1>
            <p className="text-sm text-muted-foreground">
              Hola, {adminLabel}. Vista general de la actividad reciente.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="#recientes" className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informes
              </a>
            </Button>
            <Button asChild size="sm">
              <a href="#usuarios" className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuarios
              </a>
            </Button>
          </div>
        </div>

        {supabasePaused && (
          <Alert className="border-amber-200 bg-amber-50 text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Base de datos pausada</AlertTitle>
            <AlertDescription>
              No se pudo conectar con Supabase (ENOTFOUND). Reactiva el proyecto
              en Supabase y vuelve a intentar.
            </AlertDescription>
          </Alert>
        )}

        <ResumenCards
          totalUsuarios={totalUsers ?? 0}
          totalInformes={totalReports ?? 0}
          informesCompletados={informesCompletados}
          informesEnProgreso={informesEnProgreso}
        />

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-emerald-700/70">
          <span>Resumen</span>
          <span className="h-px flex-1 bg-emerald-100" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <AnalyticsChart data={datosGrafico} />
          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-emerald-900/80">
                Estado del sistema
              </CardTitle>
              <CardDescription>Indicadores rapidos de actividad.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Informes ultimos 7 dias
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {informesUltimaSemana}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Tasa de completado
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-emerald-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {completionRate}%
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm">
                <div className="font-medium text-emerald-900">
                  Ultimo informe
                </div>
                <div className="text-emerald-800">
                  {ultimoInforme
                    ? `${ultimoInforme.informacion_alumno?.nombre_apellidos || "Sin nombre"} - ${ultimoInformeFecha}`
                    : "Sin registros recientes"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-emerald-700/70">
          <span>Actividad</span>
          <span className="h-px flex-1 bg-emerald-100" />
        </div>
        <div id="recientes" className="grid gap-8 lg:grid-cols-2">
          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Informes recientes</CardTitle>
                <CardDescription>
                  Ultimos 5 informes generados en la plataforma.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <a href="/profile/informes">Ver todos</a>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Estado
                    </TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {informesRecientesSeguros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-6 text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        Sin informes recientes
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cuando se generen informes apareceran aqui.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  informesRecientesSeguros.slice(0, 5).map((report) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

          <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Estadisticas rapidas</CardTitle>
              <CardDescription>Resumen de actividad reciente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usuarios totales</span>
                <span className="text-2xl font-bold">{totalUsers ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Informes totales</span>
                <span className="text-2xl font-bold">{totalReports ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completados</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {informesCompletados}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">En progreso</span>
                <span className="text-2xl font-bold text-orange-600">
                  {informesEnProgreso}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-emerald-700/70">
          <span>Usuarios</span>
          <span className="h-px flex-1 bg-emerald-100" />
        </div>
        <Card
          id="usuarios"
          className="border-emerald-100/70 bg-white/90 shadow-sm"
        >
          <CardHeader>
            <CardTitle>Gestion de usuarios</CardTitle>
            <CardDescription>
              Administra usuarios, accesos y acciones de seguridad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <DataTable columns={columns} data={usersWithStats} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
