"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, FileText } from "lucide-react"
import Link from "next/link"

export default function NuevoInformeClientPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    alumno: "",
    nie: "",
    fechaNacimiento: "",
    curso: "",
    centro: "",
    tutor: "",
    motivoConsulta: "",
    antecedentes: "",
    observaciones: "",
    pruebasAplicadas: "",
    conclusiones: "",
    recomendaciones: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simular llamada a API de IA
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    // Aquí iría la lógica real de generación con IA
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Junta de Andalucía</div>
                  <div className="text-gray-600">Consejería de Desarrollo Educativo</div>
                  <div className="text-gray-600">y Formación Profesional</div>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-green-600 font-medium">
                Inicio
              </Link>
              <Link href="/alumnado" className="text-gray-600 hover:text-green-600">
                Alumnado
              </Link>
              <Link href="/profesorado" className="text-gray-600 hover:text-green-600">
                Profesorado
              </Link>
              <Link href="/familias" className="text-gray-600 hover:text-green-600">
                Familias
              </Link>
              <Link href="/centros" className="text-gray-600 hover:text-green-600">
                Centros
              </Link>
              <Link href="/convivencia" className="text-gray-600 hover:text-green-600">
                Convivencia
              </Link>
              <Link href="/actualidad" className="text-gray-600 hover:text-green-600">
                Actualidad
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-gray-900">Nuevo Informe Psicopedagógico</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Nuevo Informe Psicopedagógico</span>
            </CardTitle>
            <CardDescription>
              Complete los datos del alumno para generar un informe psicopedagógico asistido por IA
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
                <div>
                  <Label htmlFor="antecedentes">Antecedentes Relevantes</Label>
                  <Textarea
                    id="antecedentes"
                    value={formData.antecedentes}
                    onChange={(e) => handleInputChange("antecedentes", e.target.value)}
                    placeholder="Antecedentes médicos, educativos, familiares relevantes..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones del Orientador</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => handleInputChange("observaciones", e.target.value)}
                    placeholder="Observaciones directas del comportamiento, actitud, etc..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="pruebasAplicadas">Pruebas y Evaluaciones Aplicadas</Label>
                  <Textarea
                    id="pruebasAplicadas"
                    value={formData.pruebasAplicadas}
                    onChange={(e) => handleInputChange("pruebasAplicadas", e.target.value)}
                    placeholder="Detalle las pruebas psicopedagógicas aplicadas y sus resultados..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="conclusiones">Conclusiones Preliminares</Label>
                  <Textarea
                    id="conclusiones"
                    value={formData.conclusiones}
                    onChange={(e) => handleInputChange("conclusiones", e.target.value)}
                    placeholder="Conclusiones iniciales del orientador..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="recomendaciones">Recomendaciones Iniciales</Label>
                  <Textarea
                    id="recomendaciones"
                    value={formData.recomendaciones}
                    onChange={(e) => handleInputChange("recomendaciones", e.target.value)}
                    placeholder="Recomendaciones pedagógicas iniciales..."
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
            <div className="flex justify-between pt-6">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Limpiar
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating || !formData.alumno || !formData.nie || !formData.motivoConsulta}
                className="bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando Informe...
                  </>
                ) : (
                  "Generar Informe con IA"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
