import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCircle } from "lucide-react";

export default function AjustesPerfilPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil y datos</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tu informacion basica y firma profesional.
        </p>
      </div>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <UserCircle className="h-10 w-10" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Foto de perfil
              </p>
              <p className="text-xs text-muted-foreground">
                Se mostrara en tus informes y perfil.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <Button variant="outline" size="sm">
              Subir foto
            </Button>
            <Button variant="outline" size="sm">
              Eliminar
            </Button>
          </div>
        </CardContent>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Nombre completo</span>
            <input
              type="text"
              placeholder="Nombre y apellidos"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Email</span>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Telefono</span>
            <input
              type="tel"
              placeholder="+34 600 000 000"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Numero de colegiado</span>
            <input
              type="text"
              placeholder="N. colegiado"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </CardContent>
      </Card>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Perfil profesional</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Centro educativo</span>
            <input
              type="text"
              placeholder="Nombre del centro"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Cargo</span>
            <input
              type="text"
              placeholder="Orientador/a, psicopedagogo/a"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Especialidad</span>
            <input
              type="text"
              placeholder="Altas capacidades, NEAE, etc."
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-gray-700">Ubicacion</span>
            <input
              type="text"
              placeholder="Ciudad, provincia"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </CardContent>
      </Card>

      <Card className="border-emerald-100/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Firma profesional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Se mostrara al final de los informes generados.
          </p>
          <textarea
            rows={4}
            placeholder="Nombre, cargo, centro, contacto"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">Firma corta</Badge>
            <span>Maximo recomendado: 3 lineas.</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Los cambios se aplicaran a futuros informes.
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
