import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PreferenciasPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Preferencias</h1>
        <p className="text-sm text-muted-foreground">
          Ajusta idioma, tema y notificaciones.
        </p>
      </div>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Idioma y tema</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Idioma</span>
            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100">
              <option value="es">Espanol</option>
              <option value="en">Ingles</option>
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Tema</span>
            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100">
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </label>
        </CardContent>
      </Card>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700">
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
