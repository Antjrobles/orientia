import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SeguridadPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seguridad</h1>
        <p className="text-sm text-muted-foreground">
          Controla el acceso a tu cuenta y dispositivos confiables.
        </p>
      </div>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Cambio de contrasena</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Contrasena actual</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Nueva contrasena</span>
            <input
              type="password"
              placeholder="Minimo 8 caracteres"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </CardContent>
      </Card>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Dispositivos confiables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Aqui podras revisar y revocar dispositivos asociados a tu cuenta.
          </p>
          <div className="rounded-md border border-dashed border-gray-200 p-4 text-center">
            Aun no hay dispositivos para mostrar.
          </div>
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
