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
import {
  Users,
  FileText,
  Activity,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { columns } from "./columns";
import { DataTable } from "./data-table";

// Creamos un cliente de Supabase para uso en el servidor.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Tipos para asegurar los datos que vienen de Supabase
interface InformeReciente {
  id: string;
  // El nombre del estudiante podría estar en el JSONB
  informacion_alumno: { nombre_apellidos?: string } | null;
  // El creador ahora es un ID, necesitaríamos un JOIN para el nombre
  autor_id: string;
  estado: string;
  creado_en: string;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // --- Obtención de datos desde Supabase (Corregido) ---
  const [
    { count: totalUsers, error: usersCountError },
    { count: totalReports, error: reportsCountError },
    { data: recentReports, error: recentReportsError },
    { data: allUsers, error: allUsersError },
  ] = await Promise.all([
    // 1. Contar total de usuarios (Correcto)
    supabase.from("users").select("*", { count: "exact", head: true }),
    // 2. Contar total de informes (Corregido: "reports" -> "informes")
    supabase.from("informes").select("*", { count: "exact", head: true }),
    // 3. Obtener los 5 informes más recientes (Corregido)
    supabase
      .from("informes")
      .select("id, informacion_alumno, autor_id, estado, creado_en") // Columnas corregidas
      .order("creado_en", { ascending: false }) // Columna de fecha corregida
      .limit(5),
    // 4. Obtener TODOS los usuarios para la tabla (Corregido)
    supabase
      .from("users")
      .select("id, name, email, image, role") // Se eliminó "created_at" que no existe
      .order("name", { ascending: true }), // Ordenamos por nombre como alternativa
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completado": // Ajustado a minúsculas como es común en enums de DB
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-200"
          >
            {status}
          </Badge>
        );
      case "en_progreso": // Ajustado a minúsculas
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            {status}
          </Badge>
        );
      case "borrador": // Ajustado a minúsculas
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            {status}
          </Badge>
        );
      default:
        return <Badge variant="destructive">{status}</Badge>;
    }
  };

  // Hacemos un type assertion para mayor seguridad
  const informesRecientesSeguros = (recentReports || []) as InformeReciente[];

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de usuarios registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Informes Generados
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de informes en el sistema
            </p>
          </CardContent>
        </Card>
        {/* Cards de ejemplo que no dependen de los datos con error */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suscripciones</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+350</div>
            <p className="text-xs text-muted-foreground">+12 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actividad Reciente
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +20 desde la última hora
            </p>
          </CardContent>
        </Card>
      </div>

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
                  <TableHead className="hidden md:table-cell">
                    ID Autor
                  </TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {informesRecientesSeguros.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium">{report.informacion_alumno?.nombre_apellidos || 'No especificado'}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        ID: {report.id.substring(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(report.estado)}
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

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Administra todos los usuarios de la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* La data-table ahora recibirá los datos correctos */}
            <DataTable columns={columns} data={allUsers || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}