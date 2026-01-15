import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
