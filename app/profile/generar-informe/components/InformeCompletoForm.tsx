"use client";

import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";
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
  curso: string;
  fechaNacimiento?: string;
  unidad?: string;
  primerTutor?: string;
  segundoTutor?: string;
  etapaEscolar?: string;

  // Adjuntos (p. ej., comunicación a la familia)
  familiaAdjuntos?: File[];

  // Datos escolares
  centro?: string;
  localidad?: string;

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
  datosPersonales: ["nombre", "curso"],
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
    curso: "",
    motivoConsulta: "",
    observaciones: "",
  });

  const [open, setOpen] = useState<SectionKey[]>(["datosPersonales", "evaluacionPsicopedagogica"]);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre?.trim()) e.nombre = "Requerido";
    if (!form.curso?.trim()) e.curso = "Requerido";
    if (!form.motivoConsulta?.trim()) e.motivoConsulta = "Requerido";
    return e;
  }, [form]);

  const isSectionComplete = (key: SectionKey) => {
    const req = requiredSections[key];
    return req.every((k) => {
      const v = (form as any)[k];
      return typeof v === "number" ? true : Boolean(v && String(v).trim());
    });
  };

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleFilesChange = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm((f) => ({ ...f, familiaAdjuntos: [...(f.familiaAdjuntos || []), ...arr] }));
  };

  const removeAdjunto = (idx: number) => {
    setForm((f) => ({
      ...f,
      familiaAdjuntos: (f.familiaAdjuntos || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSaveDraft = () => {
    try {
      const payload = {
        ...form,
      };
      localStorage.setItem("informe-borrador", JSON.stringify(payload));
      toast.success("Borrador guardado", { description: "Se ha guardado localmente en este navegador." });
    } catch (e) {
      toast.error("No se pudo guardar el borrador");
    }
  };

  const handleClear = () => {
    setForm({ nombre: "", curso: "", motivoConsulta: "", observaciones: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Solo enviamos lo que el backend espera hoy
    if (!form.nombre?.trim() || !form.curso?.trim() || !form.motivoConsulta?.trim()) return;
    const payload: StudentData = {
      nombre: form.nombre.trim(),
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
                {/* Bloque principal: Información personal y tutores */}
                <div className="space-y-4">
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-emerald-700">Información personal</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre del alumno/a</Label>
                        <Input id="nombre" value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} className={errors.nombre ? "border-red-500" : ""} placeholder="Ej: Lidia Montoya Barea" />
                        {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                        <Input id="fechaNacimiento" type="date" value={form.fechaNacimiento || ""} onChange={(e) => handleChange("fechaNacimiento", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="curso">Curso</Label>
                        <Input id="curso" value={form.curso} onChange={(e) => handleChange("curso", e.target.value)} className={errors.curso ? "border-red-500" : ""} placeholder="Ej: 6º de Educ. Primaria (Matriculado)" />
                        {errors.curso && <p className="text-sm text-red-500">{errors.curso}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unidad">Unidad</Label>
                        <Input id="unidad" value={form.unidad || ""} onChange={(e) => handleChange("unidad", e.target.value)} placeholder="Ej: 6ºA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primerTutor">Nombre del primer tutor</Label>
                        <Input id="primerTutor" value={form.primerTutor || ""} onChange={(e) => handleChange("primerTutor", e.target.value)} placeholder="Ej: Barea González, Mónica" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="segundoTutor">Nombre del segundo tutor</Label>
                        <Input id="segundoTutor" value={form.segundoTutor || ""} onChange={(e) => handleChange("segundoTutor", e.target.value)} placeholder="Ej: Montoya Pacheco, David" />
                      </div>
                    </div>
                  </div>

                  {/* Etapa de escolarización */}
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-emerald-700">Etapa de escolarización</p>
                    <Input id="etapaEscolar" value={form.etapaEscolar || ""} onChange={(e) => handleChange("etapaEscolar", e.target.value)} placeholder="Ej: Tercer Ciclo de Educación Primaria" />
                  </div>

                  {/* Información a la familia: adjuntos */}
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-emerald-700">Información a la familia</p>
                    <div className="flex items-center gap-3">
                      <Input id="familiaAdjuntos" type="file" multiple onChange={(e) => handleFilesChange(e.target.files)} />
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">Número total de registros: {(form.familiaAdjuntos?.length || 0)}</p>
                      {(form.familiaAdjuntos?.length || 0) > 0 && (
                        <ul className="divide-y rounded-md border bg-gray-50">
                          {(form.familiaAdjuntos || []).map((f, idx) => (
                            <li key={`${f.name}-${idx}`} className="flex items-center justify-between px-3 py-2 text-sm">
                              <span className="truncate" title={f.name}>{f.name}</span>
                              <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => removeAdjunto(idx)} aria-label={`Eliminar ${f.name}`}>
                                Eliminar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                {/* Botón Guardar dentro de Datos personales */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
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
                  {/* La etapa se ha movido a Datos personales para alinearlo con Séneca */}
                </div>
                {/* Botón Guardar dentro de Datos escolares */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
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
                {/* Botón Guardar dentro de Evaluación psicopedagógica */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
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
                {/* Botón Guardar dentro de Información relevante del alumno/a */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contextoEscolar" className="rounded-md bg-green-50 mb-2">
              <AccordionTrigger className="px-4">
                Información relevante sobre el contexto escolar (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.contextoEscolar || ""} onChange={(e) => handleChange("contextoEscolar", e.target.value)} placeholder="Clima de aula, recursos, apoyos, etc." />
                {/* Botón Guardar dentro de Contexto escolar */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="entornoFamiliar" className="rounded-md bg-white mb-2">
              <AccordionTrigger className="px-4">
                Información relevante sobre el entorno familiar y el contexto social (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.entornoFamiliar || ""} onChange={(e) => handleChange("entornoFamiliar", e.target.value)} placeholder="Situación familiar, apoyos, contexto socioeconómico, etc." />
                {/* Botón Guardar dentro de Entorno familiar */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="necesidadesApoyo" className="rounded-md bg-green-50 mb-2">
              <AccordionTrigger className="px-4">
                Determinación de las necesidades específicas de apoyo educativo (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.necesidadesApoyo || ""} onChange={(e) => handleChange("necesidadesApoyo", e.target.value)} placeholder="Necesidades detectadas, barreras, ajustes, etc." />
                {/* Botón Guardar dentro de Necesidades de apoyo */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="propuestaAtencion" className="rounded-md bg-white mb-2">
              <AccordionTrigger className="px-4">
                Propuesta de atención educativa. Orientaciones al profesorado (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.propuestaAtencion || ""} onChange={(e) => handleChange("propuestaAtencion", e.target.value)} placeholder="Medidas, metodologías, adaptaciones, seguimiento..." />
                {/* Botón Guardar dentro de Propuesta de atención */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="orientacionesFamilia" className="rounded-md bg-green-50 mb-2">
              <AccordionTrigger className="px-4">
                Orientaciones a la familia o a los representantes legales (*)
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <Textarea rows={4} value={form.orientacionesFamilia || ""} onChange={(e) => handleChange("orientacionesFamilia", e.target.value)} placeholder="Recomendaciones, coordinación, recursos externos, etc." />
                {/* Botón Guardar dentro de Orientaciones a la familia */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex items-center justify-between gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="">
              {isLoading ? "Generando..." : "Generar informe"}
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading}>
                Limpiar
              </Button>
              <Button type="button" onClick={handleSaveDraft} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Guardar borrador
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
