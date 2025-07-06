"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export default function NuevoInformePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    alumno: "",
    nie: "",
    fechaNacimiento: "",
    curso: "",
    centro: "",
    tutor: "",
    motivoConsulta: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveDraft = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para guardar un informe.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    const informeData = {
      autor_id: session.user.id,
      estado: "borrador" as const,
      datos_identificativos: {
        alumno: {
          nombre: formData.alumno,
          fecha_nacimiento: formData.fechaNacimiento,
          nie: formData.nie,
          curso: formData.curso,
        },
        centro: { nombre: formData.centro, localidad: "Desconocida" }, // Localidad por defecto
        tutores: formData.tutor ? [formData.tutor] : [],
        etapa_escolar: formData.curso, // Usamos el curso como etapa por ahora
      },
      evaluacion_psicopedagogica: {
        motivo: formData.motivoConsulta,
      },
    }

    const { data, error } = await supabase.from("informes").insert(informeData).select().single()

    setIsSaving(false)

    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Borrador guardado", description: "El informe se ha guardado correctamente." })
      // Redirigir a la página de edición del informe (que crearemos después)
      router.push(`/profile/informes/${data.id}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-green-600" />
          <span>Nuevo Informe Psicopedagógico</span>
        </CardTitle>
        <CardDescription>
          Rellena los datos iniciales para crear un borrador del informe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Datos del Alumno */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Datos del Alumno</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="alumno">Nombre y Apellidos *</Label>
              <Input
                id="alumno"
                value={formData.alumno}
                onChange={(e) => handleInputChange("alumno", e.target.value)}
                placeholder="Nombre completo del alumno"
              />
            </div>
            <div>
              <Label htmlFor="nie">NIE/DNI *</Label>
              <Input
                id="nie"
                value={formData.nie}
                onChange={(e) => handleInputChange("nie", e.target.value)}
                placeholder="Número de identificación"
              />
            </div>
            <div>
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="curso">Curso Académico *</Label>
              <Select onValueChange={(value) => handleInputChange("curso", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="infantil-3">Infantil 3 años</SelectItem>
                  <SelectItem value="infantil-4">Infantil 4 años</SelectItem>
                  <SelectItem value="infantil-5">Infantil 5 años</SelectItem>
                  <SelectItem value="primaria-1">1º Primaria</SelectItem>
                  <SelectItem value="primaria-2">2º Primaria</SelectItem>
                  <SelectItem value="primaria-3">3º Primaria</SelectItem>
                  <SelectItem value="primaria-4">4º Primaria</SelectItem>
                  <SelectItem value="primaria-5">5º Primaria</SelectItem>
                  <SelectItem value="primaria-6">6º Primaria</SelectItem>
                  <SelectItem value="eso-1">1º ESO</SelectItem>
                  <SelectItem value="eso-2">2º ESO</SelectItem>
                  <SelectItem value="eso-3">3º ESO</SelectItem>
                  <SelectItem value="eso-4">4º ESO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="centro">Centro Educativo *</Label>
              <Input
                id="centro"
                value={formData.centro}
                onChange={(e) => handleInputChange("centro", e.target.value)}
                placeholder="Nombre del centro"
              />
            </div>
            <div>
              <Label htmlFor="tutor">Tutor/a</Label>
              <Input
                id="tutor"
                value={formData.tutor}
                onChange={(e) => handleInputChange("tutor", e.target.value)}
                placeholder="Nombre del tutor"
              />
            </div>
          </div>
        </div>

        {/* Información Psicopedagógica */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Psicopedagógica</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivoConsulta">Motivo de la Consulta *</Label>
              <Textarea
                id="motivoConsulta"
                value={formData.motivoConsulta}
                onChange={(e) => handleInputChange("motivoConsulta", e.target.value)}
                placeholder="Describa el motivo por el cual se solicita el informe..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Alert */}
        <Alert>
          <AlertDescription>
            La inteligencia artificial generará un informe completo basado en los datos proporcionados, siguiendo
            los estándares psicopedagógicos de la Junta de Andalucía.
          </AlertDescription>
        </Alert>

        {/* Buttons */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={handleSaveDraft}
            disabled={isSaving || !formData.alumno || !formData.nie || !formData.motivoConsulta}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando Borrador...
              </>
            ) : (
              "Guardar Borrador"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
