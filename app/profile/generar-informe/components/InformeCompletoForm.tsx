"use client";

import { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, User, GraduationCap, Brain, FileText, Building2, Home, Target, ClipboardCheck, Users, Minimize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StudentData } from "@/lib/groq/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  // Historia escolar (datos escolares)
  escolarizacionPrevia?: string;
  actuacionesDiversidad?: string;
  // EOE referencia
  eoeReferencia?: string;
  // Datos de evaluación psicopedagógica ampliados
  profesionalRealiza?: string;
  fechaInicioEvaluacion?: string;
  fechaFinEvaluacion?: string;
  motivoEvaluacion?: string; // selección
  instrumentosInformacion?: string;
  numeroSesiones?: string;

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
  orientacionesAdjuntos?: File[];
  // Información relevante del alumno/a
  datosClinicosSociales?: string;
  descDesarrolloCognitivo?: string;
  autonomiaWC?: string;
  autonomiaWCObs?: string;
  descDesarrolloSensorial?: string;
  visionValoraciones?: string[];
  audicionValoraciones?: string[];
  descDesarrolloPsicomotor?: string;
  psicomotorNivel?: string;
  movilidadNivel?: string;
  movilidadObs?: string;
  controlPosturalNivel?: string;
  controlPosturalObs?: string;
  manipulacionMaterialesNivel?: string;
  manipulacionMaterialesObs?: string;
  alimentacionNivel?: string;
  alimentacionObs?: string;
  descDesarrolloComunicativo?: string;
  comunicacionNivel?: string;
  lenguajeExpresivoNivel?: string;
  lenguajeComprensivoNivel?: string;
  descDesarrolloSocialAfectivo?: string;
  descEstiloAprendizaje?: string;
  infoOtros?: string;
  // NEAE - Determinación de necesidades
  presentaNEAE?: string; // 'si' | 'no'
  necesidadesListado?: string[];
  sindromeEspecifico?: string;
  observacionesNEAE?: string;
  // Propuesta de atención educativa
  medidasEducativasGenerales?: string[];
  recursosMaterialesEspecificos?: string[];
  recursosMaterialesObs?: string;
  actuacionesObservaciones?: string;
  profesoradoEspecialista?: string[];
  profesoradoEspecialistaObs?: string;
  personalNoDocente?: string[];
  personalNoDocenteObs?: string;
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
  const [visionTemp, setVisionTemp] = useState<string>("");
  const [audicionTemp, setAudicionTemp] = useState<string>("");
  const [necesidadTemp, setNecesidadTemp] = useState<string>("");
  const [medidaTemp, setMedidaTemp] = useState<string>("");
  const [recursoMaterialTemp, setRecursoMaterialTemp] = useState<string>("");
  const [profEspecialistaTemp, setProfEspecialistaTemp] = useState<string>("");
  const [personalNoDocenteTemp, setPersonalNoDocenteTemp] = useState<string>("");

  // Cargar borrador si existe para mantener sincronía entre secciones
  useEffect(() => {
    try {
      const raw = localStorage.getItem("informe-borrador");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        setForm((f) => ({ ...f, ...parsed }));
      }
    } catch {
      // ignorar
    }
  }, []);

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

  const handleOrientacionesFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm((f) => ({ ...f, orientacionesAdjuntos: [...(f.orientacionesAdjuntos || []), ...arr] }));
  };

  const removeAdjunto = (idx: number) => {
    setForm((f) => ({
      ...f,
      familiaAdjuntos: (f.familiaAdjuntos || []).filter((_, i) => i !== idx),
    }));
  };

  const removeOrientacionesAdjunto = (idx: number) => {
    setForm((f) => ({
      ...f,
      orientacionesAdjuntos: (f.orientacionesAdjuntos || []).filter((_, i) => i !== idx),
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

  // Campos comunes (Nombre, Fecha de nacimiento, Curso, Unidad) reutilizados en dos secciones
  const IdentityFields = ({ idPrefix = "" }: { idPrefix?: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}nombre`}>Nombre</Label>
        <Input
          id={`${idPrefix}nombre`}
          value={form.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          className={errors.nombre ? "border-red-500" : ""}
          placeholder="Ej: Lidia Montoya Barea"
        />
        {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}fechaNacimiento`}>Fecha de nacimiento</Label>
        <Input
          id={`${idPrefix}fechaNacimiento`}
          type="date"
          value={form.fechaNacimiento || ""}
          onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}curso`}>Curso</Label>
        <Input
          id={`${idPrefix}curso`}
          value={form.curso}
          onChange={(e) => handleChange("curso", e.target.value)}
          className={errors.curso ? "border-red-500" : ""}
          placeholder="Ej: 6º de Educ. Primaria (Matriculado)"
        />
        {errors.curso && <p className="text-sm text-red-500">{errors.curso}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}unidad`}>Unidad</Label>
        <Input
          id={`${idPrefix}unidad`}
          value={form.unidad || ""}
          onChange={(e) => handleChange("unidad", e.target.value)}
          placeholder="Ej: 6ºA"
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-3xl font-bold">Secciones del Informe</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen([])} title="Contraer todo">
          <Minimize2 className="h-4 w-4 mr-2" /> Contraer todo
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Accordion type="multiple" value={open} onValueChange={(v) => setOpen(v as SectionKey[])} className="w-full">
            {/* Datos personales */}
            <AccordionItem value="datosPersonales" className="rounded-md section-odd mb-2 border-l-4 section-odd-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <User className="h-4 w-4" />
                <span>Datos personales</span>
                <Badge className="ml-auto" variant={isSectionComplete("datosPersonales") ? "default" : "secondary"}>
                  {isSectionComplete("datosPersonales") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {/* Bloque principal: Información personal y tutores */}
                <div className="space-y-4">
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-emerald-700">Datos del alumno o alumna</p>
                    <IdentityFields idPrefix="dp-" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Datos escolares */}
            <AccordionItem value="datosEscolares" className="rounded-md section-even mb-2 border-l-4 section-even-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <GraduationCap className="h-4 w-4" />
                <span>Datos escolares</span>
                <Badge className="ml-auto" variant={isSectionComplete("datosEscolares") ? "default" : "secondary"}>
                  {isSectionComplete("datosEscolares") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {/* Bloque 1: Datos del alumno o alumna */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm mb-4">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Datos del alumno o alumna</p>
                  <IdentityFields idPrefix="esc-" />
                </div>

                {/* Bloque 2: Historia escolar */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Historia escolar</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="esc-escolarizacionPrevia">Datos de escolarización previa</Label>
                      <Textarea id="esc-escolarizacionPrevia" rows={4} value={form.escolarizacionPrevia || ""} onChange={(e) => handleChange("escolarizacionPrevia", e.target.value)} placeholder="Especifica centros previos, repeticiones, incidencias, materias con dificultades, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="esc-actuacionesDiversidad">Actuaciones, medidas y programas de atención a la diversidad desarrollados</Label>
                      <Textarea id="esc-actuacionesDiversidad" rows={4} value={form.actuacionesDiversidad || ""} onChange={(e) => handleChange("actuacionesDiversidad", e.target.value)} placeholder="Refuerzo, acompañamiento, adaptaciones, programas específicos, etc." />
                    </div>
                  </div>
                </div>
                {/* Botón Guardar dentro de Datos escolares */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Evaluación psicopedagógica */}
            <AccordionItem value="evaluacionPsicopedagogica" className="rounded-md section-odd mb-2 border-l-4 section-odd-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <Brain className="h-4 w-4" />
                <span>Datos de la evaluación psicopedagógica</span>
                <Badge className="ml-auto" variant={isSectionComplete("evaluacionPsicopedagogica") ? "default" : "secondary"}>
                  {isSectionComplete("evaluacionPsicopedagogica") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="space-y-6">
                  {/* Bloque identidad para consistencia */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-700">Datos del alumno o alumna</p>
                    <IdentityFields idPrefix="ev-" />
                    <div className="grid grid-cols-1 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="eoeReferencia">EOE de referencia en el momento de la elaboración del informe</Label>
                        <Input id="eoeReferencia" value={form.eoeReferencia || ""} onChange={(e) => handleChange("eoeReferencia", e.target.value)} placeholder="Ej: 29070143 - E.O.E. Málaga Norte-Ciudad Jardín - Málaga" />
                      </div>
                    </div>
                  </div>

                  {/* Bloque: Datos de la evaluación psicopedagógica */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                    <p className="mb-1 text-sm font-semibold text-gray-700">Datos de la evaluación psicopedagógica</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profesionalRealiza">Profesional que lo realiza</Label>
                        <Input id="profesionalRealiza" value={form.profesionalRealiza || ""} onChange={(e) => handleChange("profesionalRealiza", e.target.value)} placeholder="Nombre y apellidos" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaInicioEvaluacion">Fecha inicio de la evaluación</Label>
                        <Input id="fechaInicioEvaluacion" type="date" value={form.fechaInicioEvaluacion || ""} onChange={(e) => handleChange("fechaInicioEvaluacion", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaFinEvaluacion">Fecha fin de la evaluación</Label>
                        <Input id="fechaFinEvaluacion" type="date" value={form.fechaFinEvaluacion || ""} onChange={(e) => handleChange("fechaFinEvaluacion", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motivoEvaluacion">Motivo de la evaluación psicopedagógica</Label>
                        <Select value={form.motivoEvaluacion || undefined} onValueChange={(v) => handleChange("motivoEvaluacion", v)}>
                          <SelectTrigger id="motivoEvaluacion">
                            <SelectValue placeholder="Selecciona un motivo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dificultades_aprendizaje">Dificultades de aprendizaje</SelectItem>
                            <SelectItem value="problemas_comportamiento">Problemas de comportamiento</SelectItem>
                            <SelectItem value="altas_capacidades">Altas capacidades</SelectItem>
                            <SelectItem value="neae">Necesidades específicas de apoyo</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motivoConsulta">Motivo de la evaluación psicopedagógica</Label>
                      <Textarea id="motivoConsulta" rows={4} value={form.motivoConsulta} onChange={(e) => handleChange("motivoConsulta", e.target.value)} className={errors.motivoConsulta ? "border-red-500" : ""} placeholder="Describe brevemente el motivo de la evaluación" />
                      {errors.motivoConsulta && <p className="text-sm text-red-500">{errors.motivoConsulta}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instrumentosInformacion">Instrumentos de recogida de información</Label>
                      <Textarea id="instrumentosInformacion" rows={4} value={form.instrumentosInformacion || ""} onChange={(e) => handleChange("instrumentosInformacion", e.target.value)} placeholder="Observación en aula, entrevistas, análisis de documentación, pruebas, etc." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numeroSesiones">Número de sesiones</Label>
                        <Input id="numeroSesiones" type="number" min={0} value={form.numeroSesiones || ""} onChange={(e) => handleChange("numeroSesiones", e.target.value)} placeholder="Ej: 5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea id="observaciones" rows={3} value={form.observaciones || ""} onChange={(e) => handleChange("observaciones", e.target.value)} placeholder="Información adicional (opcional)" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Botón Guardar dentro de Evaluación psicopedagógica */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Información relevante del alumno/a */}
            <AccordionItem value="infoAlumno" className="rounded-md section-even mb-2 border-l-4 section-even-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <FileText className="h-4 w-4" />
                <span>Información relevante del alumno/a</span>
                <Badge className="ml-auto" variant={isSectionComplete("infoAlumno") ? "default" : "secondary"}>
                  {isSectionComplete("infoAlumno") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4 space-y-6">
                {/* Datos del alumno o alumna: reutiliza identidad */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Datos del alumno o alumna</p>
                  <IdentityFields idPrefix="ir-" />
                </div>

                {/* Datos clínicos y/o sociales relevantes */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Datos clínicos y/o sociales relevantes</p>
                  <Textarea rows={4} value={form.datosClinicosSociales || ""} onChange={(e) => handleChange("datosClinicosSociales", e.target.value)} placeholder="Descripción médica/social relevante (diagnósticos, tratamientos, informes externos, etc.)" />
                </div>

                {/* Datos relativos al: Desarrollo cognitivo */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-3">
                  <p className="mb-1 text-sm font-semibold text-gray-700">Datos relativos al:</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Desarrollo cognitivo</p>
                    <Textarea rows={4} value={form.descDesarrolloCognitivo || ""} onChange={(e) => handleChange("descDesarrolloCognitivo", e.target.value)} placeholder="Descripción de resultados, CI, memoria de trabajo, razonamiento, etc." />
                  </div>
                </div>

                {/* Autonomía en el uso de WC */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Autonomía en el uso de WC</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="autonomiaWC">Nivel</Label>
                      <Select value={form.autonomiaWC || undefined} onValueChange={(v) => handleChange("autonomiaWC", v)}>
                        <SelectTrigger id="autonomiaWC">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">No necesita atención específica en relación con el uso del W.C.</SelectItem>
                          <SelectItem value="necesita_apoyo">Necesita atención específica o supervisión ocasional</SelectItem>
                          <SelectItem value="necesita_apoyo_extenso">Necesita ayuda frecuente/constante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="autonomiaWCObs">Observaciones</Label>
                      <Textarea id="autonomiaWCObs" rows={3} value={form.autonomiaWCObs || ""} onChange={(e) => handleChange("autonomiaWCObs", e.target.value)} placeholder="Observaciones relevantes" />
                    </div>
                  </div>
                </div>

                {/* Desarrollo sensorial */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Desarrollo sensorial</p>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea rows={3} value={form.descDesarrolloSensorial || ""} onChange={(e) => handleChange("descDesarrolloSensorial", e.target.value)} placeholder="Nada que destacar / descripción" />
                  </div>
                  {/* Visión */}
                  <div className="space-y-2">
                    <Label>Desarrollo sensorial visión</Label>
                    <div className="flex items-center gap-2">
                      <Select value={visionTemp || undefined} onValueChange={(v) => setVisionTemp(v)}>
                        <SelectTrigger className="w-full md:w-[560px]">
                          <SelectValue placeholder="Selecciona valoración" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No necesita ayuda acceso lectura/escritura/tarea escol. Su visión es funcional">No necesita ayuda acceso lectura/escritura/tarea escol. Su visión es funcional</SelectItem>
                          <SelectItem value="Requiere adaptaciones de acceso a la lectura/escritura">Requiere adaptaciones de acceso a la lectura/escritura</SelectItem>
                          <SelectItem value="Necesita apoyo visual específico frecuente">Necesita apoyo visual específico frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="secondary" onClick={() => visionTemp && (handleChange("visionValoraciones", [...(form.visionValoraciones || []), visionTemp]), setVisionTemp(""))}>
                        Añadir
                      </Button>
                    </div>
                    {(form.visionValoraciones?.length || 0) > 0 && (
                      <ul className="mt-2 divide-y rounded-md border bg-white">
                        {(form.visionValoraciones || []).map((v, i) => (
                          <li key={`vision-${i}`} className="px-3 py-2 text-sm flex items-center justify-between">
                            <span>{v}</span>
                            <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => handleChange("visionValoraciones", (form.visionValoraciones || []).filter((_, idx) => idx !== i))}>Borrar</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Audición */}
                  <div className="space-y-2">
                    <Label>Desarrollo sensorial audición</Label>
                    <div className="flex items-center gap-2">
                      <Select value={audicionTemp || undefined} onValueChange={(v) => setAudicionTemp(v)}>
                        <SelectTrigger className="w-full md:w-[560px]">
                          <SelectValue placeholder="Selecciona valoración" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No necesita ayuda acceso lenguaje y comunicación. Su audición es funcional">No necesita ayuda acceso lenguaje y comunicación. Su audición es funcional</SelectItem>
                          <SelectItem value="Requiere apoyo auditivo específico ocasional">Requiere apoyo auditivo específico ocasional</SelectItem>
                          <SelectItem value="Necesita apoyo auditivo específico frecuente">Necesita apoyo auditivo específico frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="secondary" onClick={() => audicionTemp && (handleChange("audicionValoraciones", [...(form.audicionValoraciones || []), audicionTemp]), setAudicionTemp(""))}>
                        Añadir
                      </Button>
                    </div>
                    {(form.audicionValoraciones?.length || 0) > 0 && (
                      <ul className="mt-2 divide-y rounded-md border bg-white">
                        {(form.audicionValoraciones || []).map((v, i) => (
                          <li key={`aud-${i}`} className="px-3 py-2 text-sm flex items-center justify-between">
                            <span>{v}</span>
                            <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => handleChange("audicionValoraciones", (form.audicionValoraciones || []).filter((_, idx) => idx !== i))}>Borrar</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Desarrollo psicomotor */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Desarrollo psicomotor</p>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea rows={3} value={form.descDesarrolloPsicomotor || ""} onChange={(e) => handleChange("descDesarrolloPsicomotor", e.target.value)} placeholder="Nada que destacar / descripción" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="psicomotorNivel">Nivel</Label>
                    <Select value={form.psicomotorNivel || undefined} onValueChange={(v) => handleChange("psicomotorNivel", v)}>
                      <SelectTrigger id="psicomotorNivel">
                        <SelectValue placeholder="Selecciona nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_necesita">No necesita atención específica. Su desarrollo psicomotor es funcional</SelectItem>
                        <SelectItem value="apoyo_ocasional">Requiere apoyo/seguimiento ocasional</SelectItem>
                        <SelectItem value="apoyo_frecuente">Necesita apoyo frecuente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Movilidad y autonomía personal */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Autonomía en los desplazamientos (movilidad)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="movilidadNivel">Nivel</Label>
                      <Select value={form.movilidadNivel || undefined} onValueChange={(v) => handleChange("movilidadNivel", v)}>
                        <SelectTrigger id="movilidadNivel">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">No necesita atención específica en relación con el desplazamiento</SelectItem>
                          <SelectItem value="apoyo_ocasional">Requiere apoyo/seguimiento ocasional</SelectItem>
                          <SelectItem value="apoyo_frecuente">Necesita apoyo frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="movilidadObs">Observaciones</Label>
                      <Textarea id="movilidadObs" rows={3} value={form.movilidadObs || ""} onChange={(e) => handleChange("movilidadObs", e.target.value)} placeholder="Observaciones" />
                    </div>
                  </div>
                </div>

                {/* Control postural en sedestación */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Posibilidades de control postural en sedestación</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="controlPosturalNivel">Nivel</Label>
                      <Select value={form.controlPosturalNivel || undefined} onValueChange={(v) => handleChange("controlPosturalNivel", v)}>
                        <SelectTrigger id="controlPosturalNivel">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">No necesita atención específica en relación con el control postural</SelectItem>
                          <SelectItem value="apoyo_ocasional">Requiere apoyo/seguimiento ocasional</SelectItem>
                          <SelectItem value="apoyo_frecuente">Necesita apoyo frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="controlPosturalObs">Observaciones</Label>
                      <Textarea id="controlPosturalObs" rows={3} value={form.controlPosturalObs || ""} onChange={(e) => handleChange("controlPosturalObs", e.target.value)} placeholder="Observaciones" />
                    </div>
                  </div>
                </div>

                {/* Acceso a las enseñanzas: manipulación y materiales */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Acceso a las enseñanzas: manipulación y materiales didácticos</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manipulacionMaterialesNivel">Nivel</Label>
                      <Select value={form.manipulacionMaterialesNivel || undefined} onValueChange={(v) => handleChange("manipulacionMaterialesNivel", v)}>
                        <SelectTrigger id="manipulacionMaterialesNivel">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">No necesita atención específica en manipulación y uso de materiales didácticos</SelectItem>
                          <SelectItem value="apoyo_ocasional">Requiere apoyo/seguimiento ocasional</SelectItem>
                          <SelectItem value="apoyo_frecuente">Necesita apoyo frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manipulacionMaterialesObs">Observaciones</Label>
                      <Textarea id="manipulacionMaterialesObs" rows={3} value={form.manipulacionMaterialesObs || ""} onChange={(e) => handleChange("manipulacionMaterialesObs", e.target.value)} placeholder="Observaciones" />
                    </div>
                  </div>
                </div>

                {/* Autonomía en la alimentación */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Autonomía en la alimentación</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alimentacionNivel">Nivel</Label>
                      <Select value={form.alimentacionNivel || undefined} onValueChange={(v) => handleChange("alimentacionNivel", v)}>
                        <SelectTrigger id="alimentacionNivel">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">No necesita atención específica en relación con la alimentación</SelectItem>
                          <SelectItem value="apoyo_ocasional">Requiere apoyo/seguimiento ocasional</SelectItem>
                          <SelectItem value="apoyo_frecuente">Necesita apoyo frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alimentacionObs">Observaciones</Label>
                      <Textarea id="alimentacionObs" rows={3} value={form.alimentacionObs || ""} onChange={(e) => handleChange("alimentacionObs", e.target.value)} placeholder="Observaciones" />
                    </div>
                  </div>
                </div>

                {/* Desarrollo comunicativo y lingüístico */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Desarrollo comunicativo y lingüístico</p>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea rows={4} value={form.descDesarrolloComunicativo || ""} onChange={(e) => handleChange("descDesarrolloComunicativo", e.target.value)} placeholder="Vocabulario, información, comprensión, aritmética..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="comunicacionNivel">Comunicación</Label>
                      <Select value={form.comunicacionNivel || undefined} onValueChange={(v) => handleChange("comunicacionNivel", v)}>
                        <SelectTrigger id="comunicacionNivel">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">No necesita atención específica. Comunicación intencional funcional</SelectItem>
                          <SelectItem value="apoyo_ocasional">Requiere apoyo/seguimiento ocasional</SelectItem>
                          <SelectItem value="apoyo_frecuente">Necesita apoyo frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lenguajeExpresivoNivel">Lenguaje expresivo</Label>
                      <Select value={form.lenguajeExpresivoNivel || undefined} onValueChange={(v) => handleChange("lenguajeExpresivoNivel", v)}>
                        <SelectTrigger id="lenguajeExpresivoNivel">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">No necesita atención específica en el dllo lingüístico expresivo</SelectItem>
                          <SelectItem value="apoyo_ocasional">Requiere apoyo/seguimiento ocasional</SelectItem>
                          <SelectItem value="apoyo_frecuente">Necesita apoyo frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lenguajeComprensivoNivel">Lenguaje comprensivo</Label>
                      <Select value={form.lenguajeComprensivoNivel || undefined} onValueChange={(v) => handleChange("lenguajeComprensivoNivel", v)}>
                        <SelectTrigger id="lenguajeComprensivoNivel">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">No necesita atención específica</SelectItem>
                          <SelectItem value="apoyo_ocasional">Requiere apoyo/seguimiento ocasional</SelectItem>
                          <SelectItem value="apoyo_frecuente">Necesita apoyo frecuente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Desarrollo social y afectivo */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Desarrollo social y afectivo</p>
                  <Textarea rows={4} value={form.descDesarrolloSocialAfectivo || ""} onChange={(e) => handleChange("descDesarrolloSocialAfectivo", e.target.value)} placeholder="Relaciones con iguales, clima aula, conductas observadas, etc." />
                </div>

                {/* Estilo de aprendizaje y motivación */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Estilo de aprendizaje y motivación</p>
                  <Textarea rows={4} value={form.descEstiloAprendizaje || ""} onChange={(e) => handleChange("descEstiloAprendizaje", e.target.value)} placeholder="Puntos fuertes, motivación, autonomía, persistencia, etc." />
                </div>

                {/* Otros */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Otros</p>
                  <Textarea rows={3} value={form.infoOtros || ""} onChange={(e) => handleChange("infoOtros", e.target.value)} placeholder="Otra información relevante" />
                </div>

                {/* Guardar dentro de Información relevante */}
                <div className="mt-4 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contextoEscolar" className="rounded-md section-odd mb-2 border-l-4 section-odd-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <Building2 className="h-4 w-4" />
                <span>Información relevante sobre el contexto escolar</span>
                <Badge className="ml-auto" variant={isSectionComplete("contextoEscolar") ? "default" : "secondary"}>
                  {isSectionComplete("contextoEscolar") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4 space-y-4">
                {/* Datos del alumno o alumna */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Datos del alumno o alumna</p>
                  <IdentityFields idPrefix="ce-" />
                </div>
                {/* Texto principal de contexto escolar */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Información relevante sobre el contexto escolar</p>
                  <Textarea rows={6} value={form.contextoEscolar || ""} onChange={(e) => handleChange("contextoEscolar", e.target.value)} placeholder="Ej.: Llegada reciente al centro, ratio de aula, recursos de PT/AL, disponibilidad de apoyos, características del centro, etc." />
                </div>
                {/* Botón Guardar dentro de Contexto escolar */}
                <div className="mt-2 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="entornoFamiliar" className="rounded-md section-even mb-2 border-l-4 section-even-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <Home className="h-4 w-4" />
                <span>Información relevante sobre el entorno familiar y el contexto social (*)</span>
                <Badge className="ml-auto" variant={isSectionComplete("entornoFamiliar") ? "default" : "secondary"}>
                  {isSectionComplete("entornoFamiliar") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4 space-y-4">
                {/* Datos del alumno o alumna */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Datos del alumno o alumna</p>
                  <IdentityFields idPrefix="ef-" />
                </div>
                {/* Texto principal del entorno familiar/contexto social */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Información relevante sobre el entorno familiar y el contexto social</p>
                  <Textarea rows={6} value={form.entornoFamiliar || ""} onChange={(e) => handleChange("entornoFamiliar", e.target.value)} placeholder="Ej.: Situación familiar (convivencia, custodia), red de apoyos, recursos sociales, factores de riesgo/protección, etc." />
                </div>
                {/* Botón Guardar dentro de Entorno familiar */}
                <div className="mt-2 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="necesidadesApoyo" className="rounded-md section-odd mb-2 border-l-4 section-odd-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <Target className="h-4 w-4" />
                <span>Determinación de las necesidades específicas de apoyo educativo (*)</span>
                <Badge className="ml-auto" variant={isSectionComplete("necesidadesApoyo") ? "default" : "secondary"}>
                  {isSectionComplete("necesidadesApoyo") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4 space-y-6">
                {/* Datos del alumno o alumna */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Datos del alumno o alumna</p>
                  <IdentityFields idPrefix="ne-" />
                </div>

                {/* Determinación de NEAE */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Determinación de las necesidades específicas de apoyo educativo</p>
                  <div className="space-y-2">
                    <Label>¿Presenta necesidades específicas de apoyo educativo?</Label>
                    <RadioGroup className="flex gap-6" value={form.presentaNEAE || ""} onValueChange={(v) => handleChange("presentaNEAE", v)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="neae-si" value="si" />
                        <Label htmlFor="neae-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="neae-no" value="no" />
                        <Label htmlFor="neae-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="rounded-md border bg-slate-50 p-3 text-xs text-slate-700">
                    Esta determinación de NEAE no es un diagnóstico clínico, sino la identificación de necesidades que requieren atención educativa diferente a la ordinaria según criterios de la Consejería.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="necesidad">Necesidad</Label>
                      <Select value={necesidadTemp || undefined} onValueChange={(v) => setNecesidadTemp(v)}>
                        <SelectTrigger id="necesidad">
                          <SelectValue placeholder="Selecciona necesidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discapacidad_intelectual_leve">Discapacidad Intelectual leve</SelectItem>
                          <SelectItem value="trastorno_espectro_autista">Trastorno del Espectro Autista</SelectItem>
                          <SelectItem value="trastorno_lenguaje">Trastorno del lenguaje</SelectItem>
                          <SelectItem value="dificultades_aprendizaje">Dificultades específicas de aprendizaje</SelectItem>
                          <SelectItem value="altas_capacidades">Altas Capacidades</SelectItem>
                          <SelectItem value="otras_necesidades">Otras necesidades</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" variant="secondary" onClick={() => necesidadTemp && (handleChange("necesidadesListado", [...(form.necesidadesListado || []), necesidadTemp]), setNecesidadTemp(""))}>
                      Añadir
                    </Button>
                  </div>

                  {(form.necesidadesListado?.length || 0) > 0 && (
                    <ul className="mt-2 divide-y rounded-md border bg-white">
                      {(form.necesidadesListado || []).map((n, i) => (
                        <li key={`nec-${i}`} className="px-3 py-2 text-sm flex items-center justify-between">
                          <span className="truncate">
                            {n.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                          </span>
                          <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => handleChange("necesidadesListado", (form.necesidadesListado || []).filter((_, idx) => idx !== i))}>Borrar</button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="sindromeEspecifico">Síndrome específico</Label>
                    <Select value={form.sindromeEspecifico || undefined} onValueChange={(v) => handleChange("sindromeEspecifico", v)}>
                      <SelectTrigger id="sindromeEspecifico">
                        <SelectValue placeholder="Selecciona si procede" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ninguno">Ninguno</SelectItem>
                        <SelectItem value="down">Síndrome de Down</SelectItem>
                        <SelectItem value="asperger">Síndrome de Asperger</SelectItem>
                        <SelectItem value="x_fragil">X Frágil</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Observaciones */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Observaciones</p>
                  <Textarea rows={4} value={form.observacionesNEAE || ""} onChange={(e) => handleChange("observacionesNEAE", e.target.value)} placeholder="Resumen de la necesidad y su correspondencia con el NCC, medidas de acceso necesarias, etc." />
                </div>

                {/* Botón Guardar */}
                <div className="mt-2 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="propuestaAtencion" className="rounded-md section-even mb-2 border-l-4 section-even-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <ClipboardCheck className="h-4 w-4" />
                <span>Propuesta de atención educativa. Orientaciones al profesorado (*)</span>
                <Badge className="ml-auto" variant={isSectionComplete("propuestaAtencion") ? "default" : "secondary"}>
                  {isSectionComplete("propuestaAtencion") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4 space-y-6">
                {/* Datos del alumno o alumna */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Datos del alumno o alumna</p>
                  <IdentityFields idPrefix="pa-" />
                </div>

                {/* Propuesta de atención educativa */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Especificar la propuesta de medidas y recursos necesarios para atender las NEAE identificadas.</p>
                  <div className="rounded-md border bg-slate-50 p-3 text-xs text-slate-700">Medidas Educativas</div>

                  {/* Medidas educativas generales */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Medidas educativas generales</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                      <div className="md:col-span-2">
                        <Select value={medidaTemp || undefined} onValueChange={(v) => setMedidaTemp(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona medida" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="refuerzo_lcl_en_lugar_de_2LE">Refuerzo de LCL en lugar de 2ª Lengua Extranjera (Educación Primaria)</SelectItem>
                            <SelectItem value="organizacion_flexible">Organización flexible de espacios/tiempos/recursos</SelectItem>
                            <SelectItem value="actividades_refuerzo">Actividades de refuerzo educativo</SelectItem>
                            <SelectItem value="apoyo_en_grupo_ordinario">Apoyo en grupo ordinario mediante 2º profesor/a dentro del aula</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" variant="secondary" onClick={() => medidaTemp && (handleChange("medidasEducativasGenerales", [...(form.medidasEducativasGenerales || []), medidaTemp]), setMedidaTemp(""))}>Añadir</Button>
                    </div>
                    {(form.medidasEducativasGenerales?.length || 0) > 0 && (
                      <ul className="mt-2 divide-y rounded-md border bg-white">
                        {(form.medidasEducativasGenerales || []).map((m, i) => (
                          <li key={`med-${i}`} className="px-3 py-2 text-sm flex items-center justify-between">
                            <span>{m.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase())}</span>
                            <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => handleChange("medidasEducativasGenerales", (form.medidasEducativasGenerales || []).filter((_, idx) => idx !== i))}>Borrar</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Recursos materiales específicos */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recursos materiales específicos</p>
                    <div className="rounded-md border bg-slate-50 p-3 text-xs text-slate-700">La propuesta de Recursos Materiales Específicos requiere informe previo del E.O.E. Especializado. Adjuntar informe en Ficheros Externos.</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                      <div className="md:col-span-2">
                        <Select value={recursoMaterialTemp || undefined} onValueChange={(v) => setRecursoMaterialTemp(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona recurso" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="software_apoyo_aprendizaje">Software de apoyo al aprendizaje</SelectItem>
                            <SelectItem value="materiales_adaptados">Materiales adaptados</SelectItem>
                            <SelectItem value="ayudas_tecnicas">Ayudas técnicas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" variant="secondary" onClick={() => recursoMaterialTemp && (handleChange("recursosMaterialesEspecificos", [...(form.recursosMaterialesEspecificos || []), recursoMaterialTemp]), setRecursoMaterialTemp(""))}>Añadir</Button>
                    </div>
                    {(form.recursosMaterialesEspecificos?.length || 0) > 0 && (
                      <ul className="mt-2 divide-y rounded-md border bg-white">
                        {(form.recursosMaterialesEspecificos || []).map((r, i) => (
                          <li key={`rec-${i}`} className="px-3 py-2 text-sm flex items-center justify-between">
                            <span>{r.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase())}</span>
                            <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => handleChange("recursosMaterialesEspecificos", (form.recursosMaterialesEspecificos || []).filter((_, idx) => idx !== i))}>Borrar</button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="recursosMaterialesObs">Observaciones</Label>
                      <Textarea id="recursosMaterialesObs" rows={3} value={form.recursosMaterialesObs || ""} onChange={(e) => handleChange("recursosMaterialesObs", e.target.value)} placeholder="Aclaraciones sobre recursos materiales propuestos" />
                    </div>
                  </div>

                  {/* Actuaciones personalizadas de acción tutorial y seguimiento */}
                  <div className="space-y-2">
                    <div className="rounded-md border bg-slate-50 p-3 text-xs text-slate-700">Medidas de carácter ordinario sujetas a lo establecido en el Proyecto Educativo del Centro</div>
                    <Label htmlFor="actuacionesObservaciones">Observaciones</Label>
                    <Textarea id="actuacionesObservaciones" rows={3} value={form.actuacionesObservaciones || ""} onChange={(e) => handleChange("actuacionesObservaciones", e.target.value)} placeholder="Seguimiento, coordinación, acción tutorial, etc." />
                  </div>
                </div>

                {/* Recursos personales */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Recursos Personales</p>
                  {/* Profesorado especialista */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Profesorado especialista</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                      <div className="md:col-span-2">
                        <Select value={profEspecialistaTemp || undefined} onValueChange={(v) => setProfEspecialistaTemp(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pt">Prof.Esp. en Pedagogía Terapéutica (PT)</SelectItem>
                            <SelectItem value="al">Prof.Esp. en Audición y Lenguaje (AL)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" variant="secondary" onClick={() => profEspecialistaTemp && (handleChange("profesoradoEspecialista", [...(form.profesoradoEspecialista || []), profEspecialistaTemp]), setProfEspecialistaTemp(""))}>Añadir</Button>
                    </div>
                    {(form.profesoradoEspecialista?.length || 0) > 0 && (
                      <ul className="mt-2 divide-y rounded-md border bg-white">
                        {(form.profesoradoEspecialista || []).map((p, i) => (
                          <li key={`pe-${i}`} className="px-3 py-2 text-sm flex items-center justify-between">
                            <span>{p === 'pt' ? 'Prof.Esp. en Pedagogía Terapéutica (PT)' : 'Prof.Esp. en Audición y Lenguaje (AL)'}</span>
                            <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => handleChange("profesoradoEspecialista", (form.profesoradoEspecialista || []).filter((_, idx) => idx !== i))}>Borrar</button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="profesoradoEspecialistaObs">Observaciones</Label>
                      <Textarea id="profesoradoEspecialistaObs" rows={3} value={form.profesoradoEspecialistaObs || ""} onChange={(e) => handleChange("profesoradoEspecialistaObs", e.target.value)} placeholder="Distribución horaria, coordinación, objetivos del apoyo, etc." />
                    </div>
                  </div>

                  {/* Personal no docente */}
                  <div className="space-y-2">
                    <div className="rounded-md border bg-slate-50 p-3 text-xs text-slate-700">La propuesta de ILSE requiere informe previo del E.O.E. Especializado. La del Fisioterapeuta solo para Centro Específico de Educación Especial.</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                      <div className="md:col-span-2">
                        <Select value={personalNoDocenteTemp || undefined} onValueChange={(v) => setPersonalNoDocenteTemp(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona personal no docente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ilse">Intérprete de Lengua de Signos (ILSE)</SelectItem>
                            <SelectItem value="fisioterapeuta">Fisioterapeuta</SelectItem>
                            <SelectItem value="pteis">Personal Técnico de Integración Social (PTIS)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" variant="secondary" onClick={() => personalNoDocenteTemp && (handleChange("personalNoDocente", [...(form.personalNoDocente || []), personalNoDocenteTemp]), setPersonalNoDocenteTemp(""))}>Añadir</Button>
                    </div>
                    {(form.personalNoDocente?.length || 0) > 0 && (
                      <ul className="mt-2 divide-y rounded-md border bg-white">
                        {(form.personalNoDocente || []).map((p, i) => (
                          <li key={`pnd-${i}`} className="px-3 py-2 text-sm flex items-center justify-between">
                            <span>{p === 'ilse' ? 'Intérprete de Lengua de Signos (ILSE)' : p === 'fisioterapeuta' ? 'Fisioterapeuta' : 'Personal Técnico de Integración Social (PTIS)'}</span>
                            <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => handleChange("personalNoDocente", (form.personalNoDocente || []).filter((_, idx) => idx !== i))}>Borrar</button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="personalNoDocenteObs">Observaciones</Label>
                      <Textarea id="personalNoDocenteObs" rows={3} value={form.personalNoDocenteObs || ""} onChange={(e) => handleChange("personalNoDocenteObs", e.target.value)} placeholder="Justificación, tareas, coordinación..." />
                    </div>
                  </div>
                </div>

                {/* Orientaciones al profesorado */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Especificar orientaciones para la organización de la respuesta educativa.</p>
                  <Label htmlFor="propuestaAtencion">Orientaciones al profesorado</Label>
                  <Textarea id="propuestaAtencion" rows={6} value={form.propuestaAtencion || ""} onChange={(e) => handleChange("propuestaAtencion", e.target.value)} placeholder="Sugerencias metodológicas, organización del aula, apoyos, seguimiento, coordinación..." />
                </div>

                {/* Botón Guardar */}
                <div className="mt-2 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="orientacionesFamilia" className="rounded-md section-odd mb-2 border-l-4 section-odd-border">
              <AccordionTrigger className="flex w-full items-center gap-2 px-4 h-12 text-emerald-900 font-bold uppercase tracking-wide">
                <Users className="h-4 w-4" />
                <span>Orientaciones a la familia o a los representantes legales (*)</span>
                <Badge className="ml-auto" variant={isSectionComplete("orientacionesFamilia") ? "default" : "secondary"}>
                  {isSectionComplete("orientacionesFamilia") ? "Completo" : "Pendiente"}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4 space-y-4">
                {/* Datos del alumno o alumna */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Datos del alumno o alumna</p>
                  <IdentityFields idPrefix="of-" />
                </div>

                {/* Orientaciones */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Orientaciones a la familia o a los representantes legales</p>
                  <Textarea rows={8} value={form.orientacionesFamilia || ""} onChange={(e) => handleChange("orientacionesFamilia", e.target.value)} placeholder="Ej.: Establecer contactos periódicos con la tutora, reforzar logros, proporcionar apoyo y dedicación, fomentar expectativas positivas, coordinación con el centro, etc." />
                </div>

                {/* Fichero externo */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Fichero externo</p>
                  <div className="flex items-center gap-3">
                    <Input type="file" multiple onChange={(e) => handleOrientacionesFiles(e.target.files)} />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">Número total de ficheros: {(form.orientacionesAdjuntos?.length || 0)}</p>
                    {(form.orientacionesAdjuntos?.length || 0) > 0 && (
                      <ul className="divide-y rounded-md border bg-gray-50">
                        {(form.orientacionesAdjuntos || []).map((f, idx) => (
                          <li key={`of-${idx}-${f.name}`} className="flex items-center justify-between px-3 py-2 text-sm">
                            <span className="truncate" title={f.name}>{f.name}</span>
                            <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => removeOrientacionesAdjunto(idx)} aria-label={`Eliminar ${f.name}`}>
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Botón Guardar dentro de Orientaciones a la familia */}
                <div className="mt-2 flex justify-end">
                  <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveDraft}>
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
