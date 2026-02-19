import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Bell, Palette } from "lucide-react";

export default function PreferenciasPage() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Preferencias</h1>
        <p className="text-sm text-muted-foreground">
          Ajusta idioma, tema y notificaciones.
        </p>
      </div>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-600" />
            Idioma
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Idioma</span>
            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100">
              <option value="es">Espanol</option>
              <option value="en">Ingles</option>
            </select>
          </label>
        </CardContent>
      </Card>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-emerald-600" />
            Apariencia
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Tema</span>
            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100">
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Densidad</span>
            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100">
              <option value="comfortable">Comoda</option>
              <option value="compact">Compacta</option>
            </select>
          </label>
        </CardContent>
      </Card>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-600" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
            Recibir avisos de nuevos informes
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
            Recordatorios de borradores pendientes
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
            Novedades y actualizaciones de la plataforma
          </label>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">Email</Badge>
            <span>Configura las alertas principales de la cuenta.</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Los cambios se guardan por dispositivo.
        </p>
        <div className="flex gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-green-600 hover:bg-green-700">
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
