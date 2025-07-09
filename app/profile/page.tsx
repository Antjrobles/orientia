import { Suspense } from 'react';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { FileText, FolderKanban, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from '../../lib/auth';
import Spinner from '@/components/Spinner';

async function ProfileContent() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const { user } = session;
  const firstName = user.name?.split(' ')[0] || 'usuario';

  return (
    <div className="space-y-8 text-center">
      {/* Cabecera de Bienvenida */}
      <div className='text-center space-y-2'>
        <h1 className="text-3 font-bold tracking-tight text-gray-900 text-center">
          ¡Bienvenido de nuevo, {firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Aquí tienes un resumen de tu actividad y accesos directos </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-bold text-gray-900">Informes Creados</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">en el último mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold  text-gray-900">Tiempo Ahorrado</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+48h</div>
            <p className="text-xs text-muted-foreground">estimación total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold  text-gray-900">Borradores</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">pendientes de finalizar</p>
          </CardContent>
        </Card>
        <Card className="border-orange-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold  text-green-600">Novedades</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¡Nueva Plantilla!</div>
            <p className="text-xs text-muted-foreground">Informe de altas capacidades.</p>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Actividad Reciente</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">Aún no hay informes recientes.</p>
              <p className="text-sm text-gray-400 mt-2">Cuando crees un informe, aparecerá aquí.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProfileContent />
    </Suspense>
  );
}