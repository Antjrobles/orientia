import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, Smartphone, Monitor } from "lucide-react";

export default function SeguridadPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seguridad</h1>
        <p className="text-sm text-muted-foreground">
          Controla el acceso a tu cuenta y dispositivos confiables.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Estado de seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Tu cuenta esta protegida con verificacion de dispositivo.</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800">
                Dispositivos confiables
              </Badge>
              <Badge variant="secondary">Sesion activa</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Revisa tus dispositivos al menos una vez al mes.</p>
            <p>Usa una contrasena unica y dificil de adivinar.</p>
          </CardContent>
        </Card>
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
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Confirmar contrasena</span>
            <input
              type="password"
              placeholder="Repite la nueva contrasena"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </CardContent>
      </Card>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Dispositivos confiables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Revisa los dispositivos con acceso y revoca los que ya no uses.
          </p>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Windows · Chrome</p>
                  <p className="text-xs text-muted-foreground">Ultimo acceso: Hoy, 10:42</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Revocar
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">iPhone · Safari</p>
                  <p className="text-xs text-muted-foreground">Ultimo acceso: Ayer, 18:20</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Revocar
              </Button>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Revocar todos los dispositivos
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Los cambios se aplican inmediatamente al guardar.
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
