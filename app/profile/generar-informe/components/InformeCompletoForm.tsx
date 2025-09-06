"use client";

import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StudentData } from "@/lib/groq/types";

type SectionKey =
  | "datosPersonales"
  | "datosEscolares"
  | "evaluacionPsicopedagogica"
  | "infoAlumno"
  | "contextoEscolar"
  | "entornoFamiliar"
  | "necesidadesApoyo"
  | "propuestaAtencion"
  | "orientacionesFamilia";

interface FormState {
  // Datos personales
  nombre: string;
  edad: number | "";
  curso: string;
  fechaNacimiento?: string;
  nie?: string;

  // Datos escolares
  centro?: string;
  localidad?: string;
  etapaEscolar?: string;

  // Evaluación psicopedagógica (lo que hoy usamos para IA)
  motivoConsulta: string;
  observaciones?: string;

  // Otras secciones (placeholder inicial)
  infoAlumno?: string;
  contextoEscolar?: string;
  entornoFamiliar?: string;
  necesidadesApoyo?: string;
  propuestaAtencion?: string;
  orientacionesFamilia?: string;
}

interface Props {
  onSubmit: (data: StudentData) => void;
  isLoading: boolean;
}

const requiredSections: Record<SectionKey, string[]> = {
  datosPersonales: ["nombre", "edad", "curso"],
  datosEscolares: [],
  evaluacionPsicopedagogica: ["motivoConsulta"],
  infoAlumno: [],
  contextoEscolar: [],
  entornoFamiliar: [],
  necesidadesApoyo: [],
  propuestaAtencion: [],
  orientacionesFamilia: [],
};

export function InformeCompletoForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    edad: "",
    curso: "",
    motivoConsulta: "",
    observaciones: "",
  });

  const [open, setOpen] = useState<SectionKey[]>(["datosPersonales", "evaluacionPsicopedagogica"]);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre?.trim()) e.nombre = "Requerido";
    const edadNum = typeof form.edad === "string" ? parseInt(form.edad) : form.edad;
    if (!edadNum || edadNum < 3 || edadNum > 25) e.edad = "3-25";
    if (!form.curso?.trim()) e.curso = "Requerido";
    if (!form.motivoConsulta?.trim()) e.motivoConsulta = "Requerido";
    return e;
  }, [form]);

  const isSectionComplete = (key: SectionKey) => {
    const req = requiredSections[key];
    return req.every((k) => {
      const v = (form as any)[k];
      if (k === "edad") {
        const n = typeof v === "string" ? parseInt(v) : v;
        return !!n && n >= 3 && n <= 25;
      }
      return typeof v === "number" ? true : Boolean(v && String(v).trim());
    });
  };

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleClear = () => {
    setForm({ nombre: "", edad: "", curso: "", motivoConsulta: "", observaciones: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Solo enviamos lo que el backend espera hoy
    const edadNum = typeof form.edad === "string" ? parseInt(form.edad || "0") : form.edad;
    if (!form.nombre?.trim() || !edadNum || !form.curso?.trim() || !form.motivoConsulta?.trim()) return;
    const payload: StudentData = {
      nombre: form.nombre.trim(),
      edad: edadNum,
      curso: form.curso.trim(),
      motivoConsulta: form.motivoConsulta.trim(),
      observaciones: form.observaciones?.trim() || "",
    };
    onSubmit(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secciones del Informe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Accordion type="multiple" value={open} onValueChange={(v) => setOpen(v as SectionKey[])} className="w-full">
            {/* Datos personales */}
            <AccordionItem value="datosPersonales" className="rounded-md bg-green-50 mb-2">
              <AccordionTrigger className="flex items-center gap-2 px-4">
                <span>Datos personales (*)</span>
                <Badge variant={isSectionComplete("datosPersonales") ? "default" : "secondary"}>
                  {isSectionComplete("datosPersonales") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre y apellidos</Label>
                    <Input id="nombre" value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} className={errors.nombre ? "border-red-500" : ""} placeholder="Ej: María García López" />
                    {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edad">Edad</Label>
                    <Input
                      id="edad"
                      type="number"
                      min={3}
                      max={25}
                      value={form.edad}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const val = raw === "" ? "" : Number(raw);
                        handleChange("edad", val as number | "");
                      }}
                      className={errors.edad ? "border-red-500" : ""}
                      placeholder="Ej: 12"
                    />
                    {errors.edad && <p className="text-sm text-red-500">{errors.edad}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="curso">Curso</Label>
                    <Input id="curso" value={form.curso} onChange={(e) => handleChange("curso", e.target.value)} className={errors.curso ? "border-red-500" : ""} placeholder="Ej: 6º Primaria" />
                    {errors.curso && <p className="text-sm text-red-500">{errors.curso}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nie">NIE (opcional)</Label>
                    <Input id="nie" value={form.nie || ""} onChange={(e) => handleChange("nie", e.target.value)} placeholder="Identificador escolar" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fechaNacimiento">Fecha de nacimiento (opcional)</Label>
                    <Input id="fechaNacimiento" type="date" value={form.fechaNacimiento || ""} onChange={(e) => handleChange("fechaNacimiento", e.target.value)} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Datos escolares */}
            <AccordionItem value="datosEscolares" className="rounded-md bg-white mb-2">
              <AccordionTrigger className="flex items-center gap-2 px-4">
                <span>Datos escolares (*)</span>
                <Badge variant={isSectionComplete("datosEscolares") ? "default" : "secondary"}>
                  {isSectionComplete("datosEscolares") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="centro">Centro</Label>
                    <Input id="centro" value={form.centro || ""} onChange={(e) => handleChange("centro", e.target.value)} placeholder="Nombre del centro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localidad">Localidad</Label>
                    <Input id="localidad" value={form.localidad || ""} onChange={(e) => handleChange("localidad", e.target.value)} placeholder="Ej: Málaga" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="etapaEscolar">Etapa escolar</Label>
                    <Input id="etapaEscolar" value={form.etapaEscolar || ""} onChange={(e) => handleChange("etapaEscolar", e.target.value)} placeholder="Infantil, Primaria, ESO..." />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Evaluación psicopedagógica */}
            <AccordionItem value="evaluacionPsicopedagogica" className="rounded-md bg-green-50 mb-2">
              <AccordionTrigger className="flex items-center gap-2 px-4">
                <span>Datos de la evaluación psicopedagógica (*)</span>
                <Badge variant={isSectionComplete("evaluacionPsicopedagogica") ? "default" : "secondary"}>
                  {isSectionComplete("evaluacionPsicopedagogica") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="motivoConsulta">Motivo de consulta</Label>
                    <Textarea id="motivoConsulta" rows={3} value={form.motivoConsulta} onChange={(e) => handleChange("motivoConsulta", e.target.value)} className={errors.motivoConsulta ? "border-red-500" : ""} placeholder="Descripción del motivo" />
                    {errors.motivoConsulta && <p className="text-sm text-red-500">{errors.motivoConsulta}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea id="observaciones" rows={3} value={form.observaciones || ""} onChange={(e) => handleChange("observaciones", e.target.value)} placeholder="Información adicional (opcional)" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Secciones placeholder (texto libre por ahora) */}
            <AccordionItem value="infoAlumno" className="rounded-md bg-white mb-2">
              <AccordionTrigger className="px-4">
                Información relevante del alumno/a (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.infoAlumno || ""} onChange={(e) => handleChange("infoAlumno", e.target.value)} placeholder="Anota datos relevantes. Lo estructuraremos más adelante." />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contextoEscolar" className="rounded-md bg-green-50 mb-2">
              <AccordionTrigger className="px-4">
                Información relevante sobre el contexto escolar (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.contextoEscolar || ""} onChange={(e) => handleChange("contextoEscolar", e.target.value)} placeholder="Clima de aula, recursos, apoyos, etc." />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="entornoFamiliar" className="rounded-md bg-white mb-2">
              <AccordionTrigger className="px-4">
                Información relevante sobre el entorno familiar y el contexto social (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.entornoFamiliar || ""} onChange={(e) => handleChange("entornoFamiliar", e.target.value)} placeholder="Situación familiar, apoyos, contexto socioeconómico, etc." />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="necesidadesApoyo" className="rounded-md bg-green-50 mb-2">
              <AccordionTrigger className="px-4">
                Determinación de las necesidades específicas de apoyo educativo (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.necesidadesApoyo || ""} onChange={(e) => handleChange("necesidadesApoyo", e.target.value)} placeholder="Necesidades detectadas, barreras, ajustes, etc." />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="propuestaAtencion" className="rounded-md bg-white mb-2">
              <AccordionTrigger className="px-4">
                Propuesta de atención educativa. Orientaciones al profesorado (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.propuestaAtencion || ""} onChange={(e) => handleChange("propuestaAtencion", e.target.value)} placeholder="Medidas, metodologías, adaptaciones, seguimiento..." />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="orientacionesFamilia" className="rounded-md bg-green-50 mb-2">
              <AccordionTrigger className="px-4">
                Orientaciones a la familia o a los representantes legales (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.orientacionesFamilia || ""} onChange={(e) => handleChange("orientacionesFamilia", e.target.value)} placeholder="Recomendaciones, coordinación, recursos externos, etc." />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Generando..." : "Generar informe"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading}>
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
