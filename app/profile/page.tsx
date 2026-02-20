import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { FileText, FolderKanban, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "../../lib/auth";
import Spinner from "@/components/ui/Spinner";

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "warning";
}

const MOCK_STATS: StatCard[] = [
  {
    title: "Informes Creados",
    value: "12",
    description: "en el último mes",
    icon: <FolderKanban className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Tiempo Ahorrado",
    value: "+48h",
    description: "estimación total",
    icon: <Clock className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Borradores",
    value: "3",
    description: "pendientes de finalizar",
    icon: <FileText className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Novedades",
    value: "¡Nueva Plantilla!",
    description: "Informe de altas capacidades.",
    icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
    variant: "warning" as const,
  },
];

async function ProfileContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const firstName = session.user.name?.split(" ")[0] || "usuario";

  return (
    <div className="mx-auto max-w-7xl bg-background px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 text-center">
        {/* Cabecera de Bienvenida */}
        <div className="space-y-2 text-center">
          <h1 className="text-center text-3xl font-bold tracking-tight text-foreground">
            ¡Bienvenido de nuevo, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí tienes un resumen de tu actividad y accesos directos{" "}
          </p>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {MOCK_STATS.map((stat) => (
            <Card
              key={stat.title}
              className={
                stat.variant === "warning" ? "border-orange-500/50" : ""
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  className={`text-sm font-bold ${
                    stat.variant === "warning"
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actividad Reciente */}
        <div>
          <h2 className="mb-4 text-center text-xl font-semibold text-foreground">
            Actividad Reciente
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Aún no hay informes recientes.</p>
                <p className="mt-2 text-sm text-muted-foreground/80">
                  Cuando crees un informe, aparecerá aquí.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Spinner variant="centered" />}>
      <ProfileContent />
    </Suspense>
  );
}
