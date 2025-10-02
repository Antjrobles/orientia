"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Save,
  User,
  GraduationCap,
  Brain,
  FileText,
  Building2,
  Home,
  Target,
  ClipboardCheck,
  Users,
  Minimize2,
  CheckCircle2,
  Shield,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StudentData } from "@/lib/groq/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { IdentityFields } from "./IdentityFields";

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
  // Actuaciones - Sistema condicional
  nivelEducativoActuaciones?: "infantil" | "primaria" | "secundaria";
  // Educación Infantil - Solo UNA opción seleccionable (radio button)
  medidaSeleccionadaInfantil?: string;
  // Educación Primaria - Solo UNA opción seleccionable
  medidaSeleccionadaPrimaria?: string;
  // Educación Secundaria - Solo UNA opción seleccionable
  medidaSeleccionadaSecundaria?: string;
  // Otras orientaciones (común para todos los niveles)
  otrasOrientaciones?: string;
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
  datosPersonales: ["curso"], // nombre es automático, no requerido del usuario
  datosEscolares: ["escolarizacionPrevia"],
  evaluacionPsicopedagogica: ["motivoConsulta"],
  infoAlumno: ["descDesarrolloCognitivo"],
  contextoEscolar: ["contextoEscolar"],
  entornoFamiliar: ["entornoFamiliar"],
  necesidadesApoyo: ["presentaNEAE"],
  propuestaAtencion: ["propuestaAtencion"],
  orientacionesFamilia: ["orientacionesFamilia"],
};

const requiredCollapsibleSections: Record<string, string[]> = {
  identity: ["curso", "fechaNacimiento"], // Para "Datos del alumno o alumna"
};

const SectionStatusIndicator = ({ isComplete }: { isComplete: boolean }) => (
  <div className="w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center bg-white">
    {isComplete && <div className="w-2 h-2 bg-gray-700 rounded-sm"></div>}
  </div>
);

export function InformeCompletoForm({ onSubmit, isLoading }: Props) {
  // Generar códigos anónimos únicos al montar el componente
  const [anonCodes] = useState(() => {
    const generateCode = (prefix: string) => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 7);
      return `${prefix}-${timestamp}-${random}`.toUpperCase();
    };

    return {
      alumno: generateCode("ALUM"),
      tutor1: generateCode("TUT1"),
      tutor2: generateCode("TUT2"),
    };
  });

  const [form, setForm] = useState<FormState>({
    nombre: `Alumno/a [${anonCodes.alumno}]`,
    primerTutor: `Tutor/a 1 [${anonCodes.tutor1}]`,
    segundoTutor: `Tutor/a 2 [${anonCodes.tutor2}]`,
    curso: "",
    motivoConsulta: "",
    observaciones: "",
  });

  const [open, setOpen] = useState<SectionKey[]>([]);
  const [openCollapsibles, setOpenCollapsibles] = useState<
    Record<string, boolean>
  >({
    dp: true,
    esc: false,
    ev: false,
    ir: false,
    ce: false,
    ef: false,
    ne: false,
    pa: false,
    of: false,
  });
  const [historiaEscolarOpen, setHistoriaEscolarOpen] = useState(true);
  const [editingMedida, setEditingMedida] = useState<
    "infantil" | "primaria" | "secundaria" | null
  >(null);
  const [visionTemp, setVisionTemp] = useState<string>("");
  const [audicionTemp, setAudicionTemp] = useState<string>("");
  const [necesidadTemp, setNecesidadTemp] = useState<string>("");
  const [medidaTemp, setMedidaTemp] = useState<string>("");
  const [recursoMaterialTemp, setRecursoMaterialTemp] = useState<string>("");
  const [profEspecialistaTemp, setProfEspecialistaTemp] = useState<string>("");
  const [personalNoDocenteTemp, setPersonalNoDocenteTemp] =
    useState<string>("");

  const toggleCollapsible = (key: string) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNivelActuacionesChange = (
    value: "infantil" | "primaria" | "secundaria" | undefined,
  ) => {
    handleChange("nivelEducativoActuaciones", value);
    if (value) {
      setEditingMedida(value); // Entrar en modo edición al seleccionar un nivel
    }
  };

  // Cargar borrador si existe para mantener sincronía entre secciones
  useEffect(() => {
    try {
      const raw = localStorage.getItem("informe-borrador");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        // Nunca sobreescribir campos anonimizados con el borrador
        const { nombre, primerTutor, segundoTutor, ...restParsed } = parsed;
        setForm((f) => ({ ...f, ...restParsed }));
      }
    } catch {
      // ignorar
    }
  }, []);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    // El nombre ya no es requerido del usuario, es automático
    if (!form.curso?.trim()) e.curso = "Requerido";
    if (!form.motivoConsulta?.trim()) e.motivoConsulta = "Requerido";
    return e;
  }, [form]);

  const isSectionComplete = useCallback(
    (key: SectionKey) => {
      const req = requiredSections[key];
      // Si no hay campos requeridos, la sección NUNCA está completa
      if (req.length === 0) return false;

      return req.every((k) => {
        const v = (form as any)[k];
        return typeof v === "number" ? true : Boolean(v && String(v).trim());
      });
    },
    [form],
  );

  const isCollapsibleSectionComplete = useCallback(
    (key: string) => {
      if (key === "historiaEscolar") {
        const escolarizacionOk = Boolean(
          form.escolarizacionPrevia && form.escolarizacionPrevia.trim(),
        );
        const actuacionOk = Boolean(
          form.medidaSeleccionadaInfantil ||
            form.medidaSeleccionadaPrimaria ||
            form.medidaSeleccionadaSecundaria,
        );
        return escolarizacionOk && actuacionOk;
      }
      const req = requiredCollapsibleSections[key];
      if (!req || req.length === 0) return false;

      return req.every((k) => {
        const v = (form as any)[k];
        // Para fechas y otros campos, una cadena no vacía es suficiente
        return Boolean(v && String(v).trim());
      });
    },
    [form],
  );
  const { completedSectionsCount, totalCompletable, progressPercentage } =
    useMemo(() => {
      const sectionKeys = Object.keys(requiredSections) as SectionKey[];
      const completableSections = sectionKeys.filter(
        (key) => requiredSections[key].length > 0,
      );
      const completedSectionsCount = completableSections.filter((key) =>
        isSectionComplete(key),
      ).length;
      const totalCompletable = completableSections.length;
      const progressPercentage =
        totalCompletable > 0
          ? (completedSectionsCount / totalCompletable) * 100
          : 0;

      return {
        completedSectionsCount,
        totalCompletable,
        progressPercentage,
      };
    }, [isSectionComplete]);

  const handleChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleFilesChange = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm((f) => ({
      ...f,
      familiaAdjuntos: [...(f.familiaAdjuntos || []), ...arr],
    }));
  };

  const handleOrientacionesFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm((f) => ({
      ...f,
      orientacionesAdjuntos: [...(f.orientacionesAdjuntos || []), ...arr],
    }));
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
      orientacionesAdjuntos: (f.orientacionesAdjuntos || []).filter(
        (_, i) => i !== idx,
      ),
    }));
  };

  const handleSaveDraft = () => {
    try {
      const payload = {
        ...form,
      };
      localStorage.setItem("informe-borrador", JSON.stringify(payload));
      toast.success("Borrador guardado", {
        description: "Se ha guardado localmente en este navegador.",
      });
    } catch (e) {
      toast.error("No se pudo guardar el borrador");
    }
  };

  const handleClear = () => {
    // Generar nuevos códigos anónimos
    const generateCode = (prefix: string) => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 7);
      return `${prefix}-${timestamp}-${random}`.toUpperCase();
    };

    const newCodes = {
      alumno: generateCode("ALUM"),
      tutor1: generateCode("TUT1"),
      tutor2: generateCode("TUT2"),
    };

    // LIMPIAR completamente
    setForm({
      nombre: `Alumno/a [${newCodes.alumno}]`,
      primerTutor: `Tutor/a 1 [${newCodes.tutor1}]`,
      segundoTutor: `Tutor/a 2 [${newCodes.tutor2}]`,
      curso: "",
      motivoConsulta: "",
    } as FormState);

    // Resetear estados temporales
    setVisionTemp("");
    setAudicionTemp("");

    // Cerrar acordeones
    setOpen([]);

    toast.info("Formulario limpiado", {
      description: "Se han generado nuevos códigos anónimos",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar campos requeridos (nombre es automático)
    if (!form.curso?.trim() || !form.motivoConsulta?.trim()) {
      toast.error("Por favor, completa los campos requeridos");
      return;
    }

    const payload: StudentData = {
      nombre: form.nombre, // Código anónimo generado automáticamente
      curso: form.curso.trim(),
      motivoConsulta: form.motivoConsulta.trim(),
      observaciones: form.observaciones?.trim() || "",
    };
    onSubmit(payload);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="border-0  bg-gray-50">
        <CardHeader className="border-b border-slate-200 p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg sm:text-xl">
              Secciones del Informe
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen([])}
              className="text-gray-600"
            >
              <Minimize2 className="h-4 w-4 mr-2" /> Contraer todo
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <Label
                htmlFor="form-progress"
                className="text-sm font-medium text-slate-600"
              >
                Progreso de secciones requeridas
              </Label>
              <span className="text-sm font-semibold text-slate-800">{`${completedSectionsCount} de ${totalCompletable}`}</span>
            </div>
            <Progress
              id="form-progress"
              value={progressPercentage}
              className="w-full bg-slate-200 [&>div]:bg-blue-600"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-2">
          <form onSubmit={handleSubmit} className="space-y-1">
            <Accordion
              type="multiple"
              value={open}
              onValueChange={(v) => setOpen(v as SectionKey[])}
              className="w-full"
            >
              {/* Datos personales */}
              <AccordionItem
                value="datosPersonales"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-blue-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">Datos Personales</span>
                        {isSectionComplete("datosPersonales") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Información básica del alumno
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 py-4 bg-white">
                  {/* Bloque principal: Información personal y tutores */}
                  <div className="space-y-4 sm:space-y-6">
                    <Collapsible
                      open={openCollapsibles["dp"]}
                      onOpenChange={() => toggleCollapsible("dp")}
                    >
                      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 sm:p-5">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Datos del alumno o alumna
                            </h3>
                            {isCollapsibleSectionComplete("identity") && (
                              <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          {openCollapsibles["dp"] ? (
                            <ChevronUp className="h-4 w-4 text-blue-600 transition-transform group-hover:scale-110" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-blue-600 transition-transform group-hover:scale-110" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                          <IdentityFields
                            idPrefix="dp-"
                            form={form}
                            handleChange={handleChange}
                            errors={errors}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="primerTutor"
                                className="flex items-center gap-2"
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-center gap-1 cursor-help">
                                      Nombre del primer tutor/a
                                      <Shield className="w-4 h-4 text-emerald-600" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      Este campo se anonimiza para cumplir con
                                      la LOPD. No se guardan nombres reales.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <Input
                                id="primerTutor"
                                value={
                                  form.primerTutor ||
                                  "Tutor/a 1 [Código Anónimo]"
                                }
                                readOnly
                                disabled
                                className="bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300 font-mono text-sm"
                                title="Campo protegido por LOPD - No se permiten nombres reales"
                              />
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Campo anonimizado por protección de datos (LOPD)
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="segundoTutor"
                                className="flex items-center gap-2"
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-center gap-1 cursor-help">
                                      Nombre del segundo tutor/a
                                      <Shield className="w-4 h-4 text-emerald-600" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      Este campo se anonimiza para cumplir con
                                      la LOPD. No se guardan nombres reales.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <Input
                                id="segundoTutor"
                                value={
                                  form.segundoTutor ||
                                  "Tutor/a 2 [Código Anónimo]"
                                }
                                readOnly
                                disabled
                                className="bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300 font-mono text-sm"
                                title="Campo protegido por LOPD - No se permiten nombres reales"
                              />
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Campo anonimizado por protección de datos (LOPD)
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>

                    {/* Etapa de escolarización */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <h3 className="text-sm font-semibold text-slate-700">
                                Etapa de escolarización
                              </h3>
                              <Info className="w-3 h-3 text-slate-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecciona la etapa actual del alumno/a.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select
                        value={form.etapaEscolar || undefined}
                        onValueChange={(value) =>
                          handleChange("etapaEscolar", value)
                        }
                      >
                        <SelectTrigger id="etapaEscolar">
                          <SelectValue placeholder="Selecciona la etapa educativa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Infantil">Infantil</SelectItem>
                          <SelectItem value="Primaria">Primaria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Información a la familia: adjuntos */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <h3 className="text-sm font-semibold text-slate-700">
                                Información a la familia
                              </h3>
                              <Info className="w-3 h-3 text-slate-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Adjunta aquí cualquier documento relevante que se
                              haya compartido con la familia (consentimientos,
                              informes previos, etc.).
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          id="familiaAdjuntos"
                          type="file"
                          multiple
                          onChange={(e) => handleFilesChange(e.target.files)}
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600">
                          Número total de registros:{" "}
                          {form.familiaAdjuntos?.length || 0}
                        </p>
                        {(form.familiaAdjuntos?.length || 0) > 0 && (
                          <ul className="divide-y rounded-md border bg-gray-50">
                            {(form.familiaAdjuntos || []).map((f, idx) => (
                              <li
                                key={`${f.name}-${idx}`}
                                className="flex items-center justify-between px-3 py-2 text-sm"
                              >
                                <span className="truncate" title={f.name}>
                                  {f.name}
                                </span>
                                <button
                                  type="button"
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() => removeAdjunto(idx)}
                                  aria-label={`Eliminar ${f.name}`}
                                >
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
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Datos escolares */}
              <AccordionItem
                value="datosEscolares"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-emerald-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full flex-shrink-0">
                      <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">Datos Escolares</span>
                        {isSectionComplete("datosEscolares") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Historia académica y escolarización
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 py-4 bg-white">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Bloque 1: Datos del alumno o alumna */}
                    <Collapsible
                      open={openCollapsibles["esc"]}
                      onOpenChange={() => toggleCollapsible("esc")}
                    >
                      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 sm:p-5">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Datos del alumno o alumna
                            </h3>
                            {isCollapsibleSectionComplete("identity") && (
                              <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          {openCollapsibles["esc"] ? (
                            <ChevronUp className="h-4 w-4 text-emerald-600 transition-transform group-hover:scale-110" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-emerald-600 transition-transform group-hover:scale-110" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                          <IdentityFields
                            idPrefix="esc-"
                            form={form}
                            handleChange={handleChange}
                            errors={errors}
                          />
                        </CollapsibleContent>
                      </div>
                    </Collapsible>

                    {/* Bloque 2: Historia escolar */}
                    <Collapsible
                      open={historiaEscolarOpen}
                      onOpenChange={setHistoriaEscolarOpen}
                    >
                      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Historia escolar
                            </h3>
                            {isCollapsibleSectionComplete(
                              "historiaEscolar",
                            ) && (
                              <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          {historiaEscolarOpen ? (
                            <ChevronUp className="h-4 w-4 text-emerald-600 transition-transform group-hover:scale-110" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-emerald-600 transition-transform group-hover:scale-110" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="esc-escolarizacionPrevia"
                                className="flex items-center gap-1"
                              >
                                Datos de escolarización previa
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3 h-3 text-slate-500 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Centros previos, años de escolarización,
                                      repeticiones, etc.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <Textarea
                                id="esc-escolarizacionPrevia"
                                rows={4}
                                value={form.escolarizacionPrevia || ""}
                                onChange={(e) =>
                                  handleChange(
                                    "escolarizacionPrevia",
                                    e.target.value,
                                  )
                                }
                                placeholder="Especifica centros previos, años de escolarización, etc."
                              />
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                              <div className="flex justify-between items-center">
                                <Label
                                  htmlFor="esc-nivelEducativo"
                                  className="text-sm font-semibold text-slate-800"
                                >
                                  Actuaciones, medidas y programas de atención a
                                  la diversidad desarrollados
                                </Label>
                                {form.nivelEducativoActuaciones && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-red-600 hover:bg-red-100 hover:text-red-700"
                                    onClick={() =>
                                      handleChange(
                                        "nivelEducativoActuaciones",
                                        undefined,
                                      )
                                    }
                                  >
                                    Limpiar selección
                                  </Button>
                                )}
                              </div>

                              <div className="space-y-4">
                                {/* Selector principal: Infantil, Primaria o Secundaria */}
                                <Select
                                  value={
                                    form.nivelEducativoActuaciones || undefined
                                  }
                                  onValueChange={(
                                    value:
                                      | "infantil"
                                      | "primaria"
                                      | "secundaria",
                                  ) => handleNivelActuacionesChange(value)}
                                >
                                  <SelectTrigger id="esc-nivelEducativo">
                                    <SelectValue placeholder="Selecciona un nivel para ver las medidas" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="infantil">
                                      Educación Infantil
                                    </SelectItem>
                                    <SelectItem value="primaria">
                                      Educación Primaria
                                    </SelectItem>
                                    <SelectItem value="secundaria">
                                      Educación Secundaria
                                    </SelectItem>
                                  </SelectContent>
                                </Select>

                                {/* EDUCACIÓN INFANTIL */}
                                {form.nivelEducativoActuaciones ===
                                  "infantil" && (
                                  <div className="mt-4 border-l-4 border-emerald-400 pl-4">
                                    {form.medidaSeleccionadaInfantil &&
                                    editingMedida !== "infantil" ? (
                                      <div className="p-4 bg-emerald-50 rounded-md border border-emerald-200">
                                        <p className="text-sm font-semibold text-emerald-800 mb-2">
                                          Medida seleccionada:
                                        </p>
                                        <p className="text-sm text-gray-700">
                                          {form.medidaSeleccionadaInfantil}
                                        </p>
                                        <Button
                                          type="button"
                                          variant="link"
                                          className="p-0 h-auto mt-3 text-sm text-emerald-700"
                                          onClick={() =>
                                            setEditingMedida("infantil")
                                          }
                                        >
                                          Cambiar selección
                                        </Button>
                                      </div>
                                    ) : (
                                      <RadioGroup
                                        value={
                                          form.medidaSeleccionadaInfantil ||
                                          undefined
                                        }
                                        onValueChange={(value) => {
                                          handleChange(
                                            "medidaSeleccionadaInfantil",
                                            value,
                                          );
                                          // Si no es una opción que abre sub-opciones, salimos del modo edición
                                          if (
                                            !value.startsWith(
                                              "Programas de adaptación curricular",
                                            )
                                          ) {
                                            setEditingMedida(null);
                                          }
                                        }}
                                      >
                                        {/* MEDIDAS GENERALES */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                            Medidas Generales
                                          </h4>
                                          <div className="space-y-2">
                                            {[
                                              "En el 2º ciclo, apoyo en grupos ordinarios mediante un segundo profesor/a dentro del aula",
                                              "Acción tutorial",
                                              "Metodologías didácticas basadas en el trabajo colaborativo en grupos heterogéneos, tutoría entre iguales y aprendizaje por proyectos",
                                              "Actuaciones en el proceso de tránsito entre ciclos, o etapas",
                                              "Actuaciones de prevención y control del absentismo",
                                            ].map((medida) => (
                                              <div
                                                key={medida}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={medida}
                                                  id={`inf-${medida}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`inf-${medida}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {medida}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* PROGRAMAS */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                            Programas
                                          </h4>
                                          <div className="space-y-2">
                                            {[
                                              "Programa de refuerzo del aprendizaje",
                                              "Programa de profundización",
                                            ].map((programa) => (
                                              <div
                                                key={programa}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={programa}
                                                  id={`inf-${programa}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`inf-${programa}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {programa}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* MEDIDAS ESPECÍFICAS */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                            Medidas Específicas
                                          </h4>
                                          <div className="space-y-2">
                                            {/* Opciones principales de Medidas Específicas */}
                                            {[
                                              "El apoyo dentro del aula por profesorado especialista de PT o AL, personal complementario u otro personal externo al aula",
                                              "El apoyo fuera del aula por profesorado especialista de PT o AL, personal complementario u otro personal externo al aula",
                                              "Programas específicos para el tratamiento personalizado del alumnado neae",
                                            ].map((medida) => (
                                              <div
                                                key={medida}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={medida}
                                                  id={`inf-${medida}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`inf-${medida}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {medida}
                                                </label>
                                              </div>
                                            ))}

                                            {/* Programas de adaptación curricular con sub-opciones */}
                                            <div className="flex items-start gap-2">
                                              <RadioGroupItem
                                                value="Programas de adaptación curricular"
                                                id="inf-programas-adaptacion"
                                                className="mt-1"
                                              />
                                              <label
                                                htmlFor="inf-programas-adaptacion"
                                                className="text-sm text-black cursor-pointer font-medium font-extrabold flex items-center gap-1"
                                              >
                                                Programas de adaptación
                                                curricular
                                                {form.medidaSeleccionadaInfantil?.startsWith(
                                                  "Programas de adaptación curricular",
                                                ) ? (
                                                  <ChevronDown className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className="text-xs text-emerald-600 ml-1">
                                                  (Ver opciones)
                                                </span>
                                              </label>
                                            </div>

                                            {/* Sub-opciones de Programas de adaptación curricular */}
                                            {form.medidaSeleccionadaInfantil?.startsWith(
                                              "Programas de adaptación curricular",
                                            ) && (
                                              <div className="ml-6 pl-4 border-l-2 border-emerald-300 space-y-2 mt-2">
                                                <p className="text-xs font-medium text-gray-600 mb-2">
                                                  Selecciona el tipo de
                                                  programa:
                                                </p>
                                                {[
                                                  "La atención educativa al alumnado por situaciones personales de hospitalización o de convalecencia domiciliaria",
                                                  "Las adaptaciones de acceso a los elementos del currículo para el alumnado con neae",
                                                  "Las adaptaciones curriculares significativas de los elementos del currículo para alumnado nee",
                                                  "Las adaptaciones curriculares dirigidas al alumnado con altas capacidades intelectuales",
                                                ].map((submedida) => (
                                                  <div
                                                    key={submedida}
                                                    className="flex items-start gap-2"
                                                  >
                                                    <RadioGroupItem
                                                      value={`Programas de adaptación curricular: ${submedida}`}
                                                      id={`inf-${submedida}`}
                                                      className="mt-1"
                                                    />
                                                    <label
                                                      htmlFor={`inf-${submedida}`}
                                                      className="text-sm text-gray-600 cursor-pointer"
                                                    >
                                                      {submedida}
                                                    </label>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* OTRAS ACTUACIONES - Sección independiente */}
                                        <div className="space-y-3 mt-6">
                                          <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                            Otras Actuaciones
                                          </h4>
                                          <div className="space-y-2">
                                            <Textarea
                                              id="otrasOrientacionesInfantil"
                                              rows={4}
                                              value={
                                                form.otrasOrientaciones || ""
                                              }
                                              onChange={(e) =>
                                                handleChange(
                                                  "otrasOrientaciones",
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="Especifica otras medidas, programas u orientaciones adicionales..."
                                              className="w-full"
                                            />
                                          </div>
                                        </div>
                                      </RadioGroup>
                                    )}
                                  </div>
                                )}

                                {/* EDUCACIÓN PRIMARIA */}
                                {form.nivelEducativoActuaciones ===
                                  "primaria" && (
                                  <div className="mt-4 border-l-4 border-l-blue-500 pl-4">
                                    {form.medidaSeleccionadaPrimaria &&
                                    editingMedida !== "primaria" ? (
                                      <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                                        <p className="text-sm font-semibold text-blue-800 mb-2">
                                          Medida seleccionada:
                                        </p>
                                        <p className="text-sm text-gray-700">
                                          {form.medidaSeleccionadaPrimaria}
                                        </p>
                                        <Button
                                          type="button"
                                          variant="link"
                                          className="p-0 h-auto mt-3 text-sm text-blue-700"
                                          onClick={() =>
                                            setEditingMedida("primaria")
                                          }
                                        >
                                          Cambiar selección
                                        </Button>
                                      </div>
                                    ) : (
                                      <RadioGroup
                                        value={
                                          form.medidaSeleccionadaPrimaria ||
                                          undefined
                                        }
                                        onValueChange={(value) => {
                                          handleChange(
                                            "medidaSeleccionadaPrimaria",
                                            value,
                                          );
                                          if (
                                            !value.startsWith(
                                              "Programas de adaptación curricular",
                                            )
                                          ) {
                                            setEditingMedida(null);
                                          }
                                        }}
                                      >
                                        {/* MEDIDAS GENERALES */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                                            Medidas Generales
                                          </h4>
                                          <div className="space-y-2 pl-2">
                                            {[
                                              "Agrupación de áreas en ámbitos",
                                              "Apoyo en grupos ordinarios mediante un segundo profesor/a dentro del aula",
                                              "Desdoblamiento de grupos",
                                              "Agrupamientos flexibles",
                                              "Sustitución de la Segunda Lengua Extranjera por un Área Lingüística de carácter transversal",
                                              "Acción tutorial",
                                              "Metodologías didácticas basadas en el trabajo colaborativo en grupos heterogéneos, tutoría entre iguales y aprendizaje por Proyectos",
                                              "Prevención y control del absentismo",
                                              "Distribución del horario lectivo de autonomía del centro entre las opciones previstas",
                                              "Actuaciones dentro del programa de tránsito",
                                            ].map((medida) => (
                                              <div
                                                key={medida}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={medida}
                                                  id={`prim-${medida}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`prim-${medida}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {medida}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* PROGRAMAS */}
                                        <div className="space-y-3 mt-6">
                                          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                                            Programas
                                          </h4>
                                          <div className="space-y-2 pl-2">
                                            {[
                                              "Programa de refuerzo del aprendizaje",
                                              "Programa de profundización",
                                            ].map((programa) => (
                                              <div
                                                key={programa}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={programa}
                                                  id={`prim-${programa}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`prim-${programa}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {programa}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* MEDIDAS ESPECÍFICAS */}
                                        <div className="space-y-3 mt-6">
                                          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                                            Medidas Específicas
                                          </h4>
                                          <div className="space-y-2 pl-2">
                                            {/* Opciones principales de Medidas Específicas */}
                                            {[
                                              "El apoyo dentro del aula por profesorado especialista de PT o AL, personal complementario u otro personal",
                                              "Programas específicos para el tratamiento personalizado del alumnado NEAE",
                                              "La atención educativa al alumnado por situaciones personales de hospitalización o de convalecencia domiciliaria",
                                              "Escolarización un curso por debajo del que corresponde por edad para el alumnado de incorporación tardía",
                                              "Atención específica para el alumnado que se incorpora tardíamente y que presenta graves carencias en la comunicación lingüística en Lengua Castellana",
                                              "Flexibilización de la escolarización del alumnado con altas capacidades intelectuales",
                                            ].map((medida) => (
                                              <div
                                                key={medida}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={medida}
                                                  id={`prim-${medida}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`prim-${medida}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {medida}
                                                </label>
                                              </div>
                                            ))}

                                            {/* Programas de adaptación curricular con sub-opciones */}
                                            <div className="flex items-start gap-2">
                                              <RadioGroupItem
                                                value="Programas de adaptación curricular"
                                                id="prim-programas-adaptacion"
                                                className="mt-1"
                                              />
                                              <label
                                                htmlFor="prim-programas-adaptacion"
                                                className="text-sm text-black cursor-pointer font-medium font-extrabold flex items-center gap-1"
                                              >
                                                Programas de adaptación
                                                curricular
                                                {form.medidaSeleccionadaPrimaria?.startsWith(
                                                  "Programas de adaptación curricular",
                                                ) ? (
                                                  <ChevronDown className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className="text-xs text-blue-600 ml-1">
                                                  (Ver opciones)
                                                </span>
                                              </label>
                                            </div>

                                            {/* Sub-opciones de Programas de adaptación curricular */}
                                            {form.medidaSeleccionadaPrimaria?.startsWith(
                                              "Programas de adaptación curricular",
                                            ) && (
                                              <div className="ml-6 pl-4 border-l-2 border-blue-300 space-y-2 mt-2">
                                                <p className="text-xs font-medium text-gray-600 mb-2">
                                                  Selecciona el tipo de
                                                  programa:
                                                </p>
                                                {[
                                                  "Las adaptaciones de acceso a los elementos del currículo para el alumnado NEAE",
                                                  "Las adaptaciones curriculares significativas de los elementos del currículo para alumnado NEE",
                                                  "Las adaptaciones curriculares dirigidas al alumnado con altas capacidades intelectuales",
                                                ].map((submedida) => (
                                                  <div
                                                    key={submedida}
                                                    className="flex items-start gap-2"
                                                  >
                                                    <RadioGroupItem
                                                      value={`Programas de adaptación curricular: ${submedida}`}
                                                      id={`prim-${submedida}`}
                                                      className="mt-1"
                                                    />
                                                    <label
                                                      htmlFor={`prim-${submedida}`}
                                                      className="text-sm text-gray-600 cursor-pointer"
                                                    >
                                                      {submedida}
                                                    </label>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* OTRAS ACTUACIONES - Sección independiente */}
                                        <div className="space-y-3 mt-6">
                                          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                                            Otras Actuaciones
                                          </h4>
                                          <div className="space-y-2">
                                            <Textarea
                                              id="otrasOrientacionesPrimaria"
                                              rows={4}
                                              value={
                                                form.otrasOrientaciones || ""
                                              }
                                              onChange={(e) =>
                                                handleChange(
                                                  "otrasOrientaciones",
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="Especifica otras medidas, programas u orientaciones adicionales..."
                                              className="w-full"
                                            />
                                          </div>
                                        </div>
                                      </RadioGroup>
                                    )}
                                  </div>
                                )}

                                {/* EDUCACIÓN SECUNDARIA */}
                                {form.nivelEducativoActuaciones ===
                                  "secundaria" && (
                                  <div className="mt-4 border-l-4 border-l-purple-500 pl-4">
                                    {form.medidaSeleccionadaSecundaria &&
                                    editingMedida !== "secundaria" ? (
                                      <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
                                        <p className="text-sm font-semibold text-purple-800 mb-2">
                                          Medida seleccionada:
                                        </p>
                                        <p className="text-sm text-gray-700">
                                          {form.medidaSeleccionadaSecundaria}
                                        </p>
                                        <Button
                                          type="button"
                                          variant="link"
                                          className="p-0 h-auto mt-3 text-sm text-purple-700"
                                          onClick={() =>
                                            setEditingMedida("secundaria")
                                          }
                                        >
                                          Cambiar selección
                                        </Button>
                                      </div>
                                    ) : (
                                      <RadioGroup
                                        value={
                                          form.medidaSeleccionadaSecundaria ||
                                          undefined
                                        }
                                        onValueChange={(value) => {
                                          handleChange(
                                            "medidaSeleccionadaSecundaria",
                                            value,
                                          );
                                          if (
                                            !value.startsWith(
                                              "Programas de adaptación curricular",
                                            )
                                          ) {
                                            setEditingMedida(null);
                                          }
                                        }}
                                      >
                                        {/* MEDIDAS GENERALES */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                                            Medidas Generales
                                          </h4>
                                          <div className="space-y-2 pl-2">
                                            {[
                                              "Agrupación de materias en ámbitos de conocimiento",
                                              "Apoyo en grupos ordinarios mediante un segundo profesor/a dentro del aula",
                                              "Desdoblamientos de grupos",
                                              "Agrupamientos flexibles con carácter temporal y abierto",
                                              "Sustitución de la Segunda Lengua Extranjera por una Materia Lingüística de carácter transversal",
                                              "Acción tutorial",
                                              "Metodologías didácticas basadas en el trabajo colaborativo en grupos heterogéneos, tutoría entre iguales y aprendizaje por proyectos que promuevan la inclusión",
                                              "Actuaciones de coordinación en el proceso de tránsito entre etapas",
                                              "Actuaciones de prevención y control del absentismo",
                                              "Distribución del horario lectivo de las materias optativas propias de la Comunidad Andaluza",
                                              "Actuaciones de coordinación en el proceso de tránsito entre etapas educativas",
                                            ].map((medida) => (
                                              <div
                                                key={medida}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={medida}
                                                  id={`sec-${medida}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`sec-${medida}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {medida}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* PROGRAMAS */}
                                        <div className="space-y-3 mt-6">
                                          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                                            Programas
                                          </h4>
                                          <div className="space-y-2 pl-2">
                                            {[
                                              "Programas de refuerzo del aprendizaje",
                                              "Programas de profundización",
                                              "Programa de Diversificación Curricular",
                                            ].map((programa) => (
                                              <div
                                                key={programa}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={programa}
                                                  id={`sec-${programa}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`sec-${programa}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {programa}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* MEDIDAS ESPECÍFICAS */}
                                        <div className="space-y-3 mt-6">
                                          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                                            Medidas Específicas
                                          </h4>
                                          <div className="space-y-2 pl-2">
                                            {/* Opciones principales de Medidas Específicas */}
                                            {[
                                              "Apoyo dentro del aula por PT, AL, personal complementario u otro personal",
                                              "Programas específicos para el tratamiento personalizado del alumnado NEAE",
                                              "Atención educativa al alumnado por situaciones de hospitalización o convalecencia domiciliaria",
                                              "Flexibilización del periodo de escolarización para el alumnado con altas capacidades",
                                              "Permanencia extraordinaria (solo alumnado NEE)",
                                              "Escolarización un curso inferior al que corresponde por edad para el alumnado de incorporación tardía con desfase en su nivel curricular de competencia de dos o más cursos",
                                              "Atención específica para alumnado de incorporación tardía con graves carencias en la comunicación lingüística",
                                            ].map((medida) => (
                                              <div
                                                key={medida}
                                                className="flex items-start gap-2"
                                              >
                                                <RadioGroupItem
                                                  value={medida}
                                                  id={`sec-${medida}`}
                                                  className="mt-1"
                                                />
                                                <label
                                                  htmlFor={`sec-${medida}`}
                                                  className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                  {medida}
                                                </label>
                                              </div>
                                            ))}

                                            {/* Programas de adaptación curricular con sub-opciones */}
                                            <div className="flex items-start gap-2">
                                              <RadioGroupItem
                                                value="Programas de adaptación curricular"
                                                id="sec-programas-adaptacion"
                                                className="mt-1"
                                              />
                                              <label
                                                htmlFor="sec-programas-adaptacion"
                                                className="text-sm text-black cursor-pointer font-medium font-extrabold flex items-center gap-1"
                                              >
                                                Programas de adaptación
                                                curricular
                                                {form.medidaSeleccionadaSecundaria?.startsWith(
                                                  "Programas de adaptación curricular",
                                                ) ? (
                                                  <ChevronDown className="w-4 h-4 text-purple-600" />
                                                ) : (
                                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className="text-xs text-purple-600 ml-1">
                                                  (Ver opciones)
                                                </span>
                                              </label>
                                            </div>

                                            {/* Sub-opciones de Programas de adaptación curricular */}
                                            {form.medidaSeleccionadaSecundaria?.startsWith(
                                              "Programas de adaptación curricular",
                                            ) && (
                                              <div className="ml-6 pl-4 border-l-2 border-purple-300 space-y-2 mt-2">
                                                <p className="text-xs font-medium text-gray-600 mb-2">
                                                  Selecciona el tipo de
                                                  programa:
                                                </p>
                                                {[
                                                  "Adaptación curricular de acceso",
                                                  "Adaptación curricular significativa",
                                                  "Adaptación curricular para el alumnado con altas capacidades intelectuales",
                                                ].map((submedida) => (
                                                  <div
                                                    key={submedida}
                                                    className="flex items-start gap-2"
                                                  >
                                                    <RadioGroupItem
                                                      value={`Programas de adaptación curricular: ${submedida}`}
                                                      id={`sec-${submedida}`}
                                                      className="mt-1"
                                                    />
                                                    <label
                                                      htmlFor={`sec-${submedida}`}
                                                      className="text-sm text-gray-600 cursor-pointer"
                                                    >
                                                      {submedida}
                                                    </label>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* OTRAS ACTUACIONES - Sección independiente */}
                                        <div className="space-y-3 mt-6">
                                          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                                            Otras Actuaciones
                                          </h4>
                                          <div className="space-y-2">
                                            <Textarea
                                              id="otrasOrientacionesSecundaria"
                                              rows={4}
                                              value={
                                                form.otrasOrientaciones || ""
                                              }
                                              onChange={(e) =>
                                                handleChange(
                                                  "otrasOrientaciones",
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="Especifica otras medidas, programas u orientaciones adicionales..."
                                              className="w-full"
                                            />
                                          </div>
                                        </div>
                                      </RadioGroup>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </div>
                  {/* Botón Guardar dentro de Datos escolares */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Evaluación psicopedagógica */}
              <AccordionItem
                value="evaluacionPsicopedagogica"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-purple-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
                      <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">
                          Evaluación Psicopedagógica
                        </span>
                        {isSectionComplete("evaluacionPsicopedagogica") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Datos y motivo de la evaluación
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-4 sm:px-6 bg-white">
                  <div className="space-y-6">
                    {/* Bloque identidad para consistencia */}
                    <Collapsible
                      open={openCollapsibles["ev"]}
                      onOpenChange={() => toggleCollapsible("ev")}
                    >
                      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                        <CollapsibleTrigger className="flex items-center justify-between w-full group">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Datos del alumno o alumna
                            </h3>
                            {isCollapsibleSectionComplete("identity") && (
                              <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          {openCollapsibles["ev"] ? (
                            <ChevronUp className="h-4 w-4 text-purple-600 transition-transform group-hover:scale-110" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-purple-600 transition-transform group-hover:scale-110" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                          <IdentityFields
                            idPrefix="ev-"
                            form={form}
                            handleChange={handleChange}
                            errors={errors}
                          />
                          <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="eoeReferencia">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-center gap-1 cursor-help">
                                      EOE de referencia
                                      <Info className="w-3 h-3 text-slate-500" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Equipo de Orientación Educativa (EOE).
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </Label>
                              <Input
                                id="eoeReferencia"
                                value={form.eoeReferencia || ""}
                                onChange={(e) =>
                                  handleChange("eoeReferencia", e.target.value)
                                }
                                placeholder="Ej: 29070143 - E.O.E. Málaga Norte-Ciudad Jardín - Málaga"
                              />
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>

                    {/* Bloque: Datos de la evaluación psicopedagógica */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h3 className="text-sm font-semibold text-slate-700">
                          Datos de la evaluación psicopedagógica
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="profesionalRealiza">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-1 cursor-help">
                                  Profesional que lo realiza
                                  <Info className="w-3 h-3 text-slate-500" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Nombre y apellidos del orientador/a.</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="profesionalRealiza"
                            value={form.profesionalRealiza || ""}
                            onChange={(e) =>
                              handleChange("profesionalRealiza", e.target.value)
                            }
                            placeholder="Nombre y apellidos"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fechaInicioEvaluacion">
                            Fecha inicio de la evaluación
                          </Label>
                          <Input
                            id="fechaInicioEvaluacion"
                            type="date"
                            value={form.fechaInicioEvaluacion || ""}
                            onChange={(e) =>
                              handleChange(
                                "fechaInicioEvaluacion",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fechaFinEvaluacion">
                            Fecha fin de la evaluación
                          </Label>
                          <Input
                            id="fechaFinEvaluacion"
                            type="date"
                            value={form.fechaFinEvaluacion || ""}
                            onChange={(e) =>
                              handleChange("fechaFinEvaluacion", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="motivoEvaluacion">
                            Motivo de la evaluación psicopedagógica
                          </Label>
                          <Select
                            value={form.motivoEvaluacion || undefined}
                            onValueChange={(v) =>
                              handleChange("motivoEvaluacion", v)
                            }
                          >
                            <SelectTrigger id="motivoEvaluacion">
                              <SelectValue placeholder="Selecciona un motivo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dificultades_aprendizaje">
                                Dificultades de aprendizaje
                              </SelectItem>
                              <SelectItem value="problemas_comportamiento">
                                Problemas de comportamiento
                              </SelectItem>
                              <SelectItem value="altas_capacidades">
                                Altas capacidades
                              </SelectItem>
                              <SelectItem value="neae">
                                Necesidades específicas de apoyo
                              </SelectItem>
                              <SelectItem value="otros">Otros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motivoConsulta">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center gap-1 cursor-help">
                                Motivo de la evaluación psicopedagógica
                                <Info className="w-3 h-3 text-slate-500" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Este es el campo principal que usará la IA para
                                generar el informe. Sé detallado.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Textarea
                          id="motivoConsulta"
                          rows={4}
                          value={form.motivoConsulta}
                          onChange={(e) =>
                            handleChange("motivoConsulta", e.target.value)
                          }
                          className={
                            errors.motivoConsulta ? "border-red-500" : ""
                          }
                          placeholder="Describe brevemente el motivo de la evaluación"
                        />
                        {errors.motivoConsulta && (
                          <p className="text-sm text-red-500">
                            {errors.motivoConsulta}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instrumentosInformacion">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center gap-1 cursor-help">
                                Instrumentos de recogida de información
                                <Info className="w-3 h-3 text-slate-500" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Ej: Observación, entrevistas, análisis de
                                trabajos, pruebas estandarizadas (WISC, etc.).
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Textarea
                          id="instrumentosInformacion"
                          rows={4}
                          value={form.instrumentosInformacion || ""}
                          onChange={(e) =>
                            handleChange(
                              "instrumentosInformacion",
                              e.target.value,
                            )
                          }
                          placeholder="Observación en aula, entrevistas, análisis de documentación, pruebas, etc."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="numeroSesiones">
                            Número de sesiones
                          </Label>
                          <Input
                            id="numeroSesiones"
                            type="number"
                            min={0}
                            value={form.numeroSesiones || ""}
                            onChange={(e) =>
                              handleChange("numeroSesiones", e.target.value)
                            }
                            placeholder="Ej: 5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="observaciones">Observaciones</Label>
                          <Textarea
                            id="observaciones"
                            rows={3}
                            value={form.observaciones || ""}
                            onChange={(e) =>
                              handleChange("observaciones", e.target.value)
                            }
                            placeholder="Información adicional (opcional)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Botón Guardar dentro de Evaluación psicopedagógica */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Información relevante del alumno/a */}
              <AccordionItem
                value="infoAlumno"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-orange-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full flex-shrink-0">
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">
                          Información Relevante del Alumno
                        </span>
                        {isSectionComplete("infoAlumno") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Desarrollo y características específicas
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white space-y-6">
                  {/* Datos del alumno o alumna: reutiliza identidad */}
                  <Collapsible
                    open={openCollapsibles["ir"]}
                    onOpenChange={() => toggleCollapsible("ir")}
                  >
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                      <CollapsibleTrigger className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Datos del alumno o alumna
                          </h3>
                          {isCollapsibleSectionComplete("identity") && (
                            <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        {openCollapsibles["ir"] ? (
                          <ChevronUp className="h-4 w-4 text-orange-600 transition-transform group-hover:scale-110" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-orange-600 transition-transform group-hover:scale-110" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <IdentityFields
                          idPrefix="ir-"
                          form={form}
                          handleChange={handleChange}
                          errors={errors}
                        />
                      </CollapsibleContent>
                    </div>
                  </Collapsible>

                  {/* Datos clínicos y/o sociales relevantes */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Datos clínicos y/o sociales relevantes
                            </h3>
                            <Info className="w-3 h-3 text-slate-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Diagnósticos médicos, tratamientos, informes
                            externos, situación social, etc.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Textarea
                      rows={4}
                      value={form.datosClinicosSociales || ""}
                      onChange={(e) =>
                        handleChange("datosClinicosSociales", e.target.value)
                      }
                      placeholder="Descripción médica/social relevante (diagnósticos, tratamientos, informes externos, etc.)"
                    />
                  </div>

                  {/* Datos relativos al: Desarrollo cognitivo */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Desarrollo cognitivo
                            </h3>
                            <Info className="w-3 h-3 text-slate-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Resultados de pruebas (CI, memoria, atención),
                            razonamiento, funciones ejecutivas...
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        rows={4}
                        value={form.descDesarrolloCognitivo || ""}
                        onChange={(e) =>
                          handleChange(
                            "descDesarrolloCognitivo",
                            e.target.value,
                          )
                        }
                        placeholder="Descripción de resultados, CI, memoria de trabajo, razonamiento, etc."
                      />
                    </div>
                  </div>

                  {/* Autonomía en el uso de WC */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Autonomía en el uso de WC
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="autonomiaWC">Nivel</Label>
                        <Select
                          value={form.autonomiaWC || undefined}
                          onValueChange={(v) => handleChange("autonomiaWC", v)}
                        >
                          <SelectTrigger id="autonomiaWC">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_necesita">
                              No necesita atención específica en relación con el
                              uso del W.C.
                            </SelectItem>
                            <SelectItem value="necesita_apoyo">
                              Necesita atención específica o supervisión
                              ocasional
                            </SelectItem>
                            <SelectItem value="necesita_apoyo_extenso">
                              Necesita ayuda frecuente/constante
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="autonomiaWCObs">Observaciones</Label>
                        <Textarea
                          id="autonomiaWCObs"
                          rows={3}
                          value={form.autonomiaWCObs || ""}
                          onChange={(e) =>
                            handleChange("autonomiaWCObs", e.target.value)
                          }
                          placeholder="Observaciones relevantes"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desarrollo sensorial */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Desarrollo sensorial
                    </p>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea
                        rows={3}
                        value={form.descDesarrolloSensorial || ""}
                        onChange={(e) =>
                          handleChange(
                            "descDesarrolloSensorial",
                            e.target.value,
                          )
                        }
                        placeholder="Nada que destacar / descripción"
                      />
                    </div>
                    {/* Visión */}
                    <div className="space-y-2">
                      <Label>Desarrollo sensorial visión</Label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={visionTemp || undefined}
                          onValueChange={(v) => setVisionTemp(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona valoración" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="No necesita ayuda acceso lectura/escritura/tarea escol. Su visión es funcional">
                              No necesita ayuda acceso lectura/escritura/tarea
                              escol. Su visión es funcional
                            </SelectItem>
                            <SelectItem value="Requiere adaptaciones de acceso a la lectura/escritura">
                              Requiere adaptaciones de acceso a la
                              lectura/escritura
                            </SelectItem>
                            <SelectItem value="Necesita apoyo visual específico frecuente">
                              Necesita apoyo visual específico frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            visionTemp &&
                            (handleChange("visionValoraciones", [
                              ...(form.visionValoraciones || []),
                              visionTemp,
                            ]),
                            setVisionTemp(""))
                          }
                        >
                          Añadir
                        </Button>
                      </div>
                      {(form.visionValoraciones?.length || 0) > 0 && (
                        <ul className="mt-2 divide-y rounded-md border bg-white">
                          {(form.visionValoraciones || []).map((v, i) => (
                            <li
                              key={`vision-${i}`}
                              className="px-3 py-2 text-sm flex items-center justify-between"
                            >
                              <span>{v}</span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-red-600"
                                onClick={() =>
                                  handleChange(
                                    "visionValoraciones",
                                    (form.visionValoraciones || []).filter(
                                      (_, idx) => idx !== i,
                                    ),
                                  )
                                }
                              >
                                Borrar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Audición */}
                    <div className="space-y-2">
                      <Label>Desarrollo sensorial audición</Label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={audicionTemp || undefined}
                          onValueChange={(v) => setAudicionTemp(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona valoración" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="No necesita ayuda acceso lenguaje y comunicación. Su audición es funcional">
                              No necesita ayuda acceso lenguaje y comunicación.
                              Su audición es funcional
                            </SelectItem>
                            <SelectItem value="Requiere apoyo auditivo específico ocasional">
                              Requiere apoyo auditivo específico ocasional
                            </SelectItem>
                            <SelectItem value="Necesita apoyo auditivo específico frecuente">
                              Necesita apoyo auditivo específico frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            audicionTemp &&
                            (handleChange("audicionValoraciones", [
                              ...(form.audicionValoraciones || []),
                              audicionTemp,
                            ]),
                            setAudicionTemp(""))
                          }
                        >
                          Añadir
                        </Button>
                      </div>
                      {(form.audicionValoraciones?.length || 0) > 0 && (
                        <ul className="mt-2 divide-y rounded-md border bg-white">
                          {(form.audicionValoraciones || []).map((v, i) => (
                            <li
                              key={`aud-${i}`}
                              className="px-3 py-2 text-sm flex items-center justify-between"
                            >
                              <span>{v}</span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-red-600"
                                onClick={() =>
                                  handleChange(
                                    "audicionValoraciones",
                                    (form.audicionValoraciones || []).filter(
                                      (_, idx) => idx !== i,
                                    ),
                                  )
                                }
                              >
                                Borrar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Desarrollo psicomotor */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Desarrollo psicomotor
                    </p>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea
                        rows={3}
                        value={form.descDesarrolloPsicomotor || ""}
                        onChange={(e) =>
                          handleChange(
                            "descDesarrolloPsicomotor",
                            e.target.value,
                          )
                        }
                        placeholder="Nada que destacar / descripción"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="psicomotorNivel">Nivel</Label>
                      <Select
                        value={form.psicomotorNivel || undefined}
                        onValueChange={(v) =>
                          handleChange("psicomotorNivel", v)
                        }
                      >
                        <SelectTrigger id="psicomotorNivel">
                          <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_necesita">
                            No necesita atención específica. Su desarrollo
                            psicomotor es funcional
                          </SelectItem>
                          <SelectItem value="apoyo_ocasional">
                            Requiere apoyo/seguimiento ocasional
                          </SelectItem>
                          <SelectItem value="apoyo_frecuente">
                            Necesita apoyo frecuente
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Movilidad y autonomía personal */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Autonomía en los desplazamientos (movilidad)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="movilidadNivel">Nivel</Label>
                        <Select
                          value={form.movilidadNivel || undefined}
                          onValueChange={(v) =>
                            handleChange("movilidadNivel", v)
                          }
                        >
                          <SelectTrigger id="movilidadNivel">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_necesita">
                              No necesita atención específica en relación con el
                              desplazamiento
                            </SelectItem>
                            <SelectItem value="apoyo_ocasional">
                              Requiere apoyo/seguimiento ocasional
                            </SelectItem>
                            <SelectItem value="apoyo_frecuente">
                              Necesita apoyo frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="movilidadObs">Observaciones</Label>
                        <Textarea
                          id="movilidadObs"
                          rows={3}
                          value={form.movilidadObs || ""}
                          onChange={(e) =>
                            handleChange("movilidadObs", e.target.value)
                          }
                          placeholder="Observaciones"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Control postural en sedestación */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Posibilidades de control postural en sedestación
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="controlPosturalNivel">Nivel</Label>
                        <Select
                          value={form.controlPosturalNivel || undefined}
                          onValueChange={(v) =>
                            handleChange("controlPosturalNivel", v)
                          }
                        >
                          <SelectTrigger id="controlPosturalNivel">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_necesita">
                              No necesita atención específica en relación con el
                              control postural
                            </SelectItem>
                            <SelectItem value="apoyo_ocasional">
                              Requiere apoyo/seguimiento ocasional
                            </SelectItem>
                            <SelectItem value="apoyo_frecuente">
                              Necesita apoyo frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="controlPosturalObs">
                          Observaciones
                        </Label>
                        <Textarea
                          id="controlPosturalObs"
                          rows={3}
                          value={form.controlPosturalObs || ""}
                          onChange={(e) =>
                            handleChange("controlPosturalObs", e.target.value)
                          }
                          placeholder="Observaciones"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Acceso a las enseñanzas: manipulación y materiales */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Acceso a las enseñanzas: manipulación y materiales
                      didácticos
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="manipulacionMaterialesNivel">
                          Nivel
                        </Label>
                        <Select
                          value={form.manipulacionMaterialesNivel || undefined}
                          onValueChange={(v) =>
                            handleChange("manipulacionMaterialesNivel", v)
                          }
                        >
                          <SelectTrigger id="manipulacionMaterialesNivel">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_necesita">
                              No necesita atención específica en manipulación y
                              uso de materiales didácticos
                            </SelectItem>
                            <SelectItem value="apoyo_ocasional">
                              Requiere apoyo/seguimiento ocasional
                            </SelectItem>
                            <SelectItem value="apoyo_frecuente">
                              Necesita apoyo frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manipulacionMaterialesObs">
                          Observaciones
                        </Label>
                        <Textarea
                          id="manipulacionMaterialesObs"
                          rows={3}
                          value={form.manipulacionMaterialesObs || ""}
                          onChange={(e) =>
                            handleChange(
                              "manipulacionMaterialesObs",
                              e.target.value,
                            )
                          }
                          placeholder="Observaciones"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Autonomía en la alimentación */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Autonomía en la alimentación
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="alimentacionNivel">Nivel</Label>
                        <Select
                          value={form.alimentacionNivel || undefined}
                          onValueChange={(v) =>
                            handleChange("alimentacionNivel", v)
                          }
                        >
                          <SelectTrigger id="alimentacionNivel">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_necesita">
                              No necesita atención específica en relación con la
                              alimentación
                            </SelectItem>
                            <SelectItem value="apoyo_ocasional">
                              Requiere apoyo/seguimiento ocasional
                            </SelectItem>
                            <SelectItem value="apoyo_frecuente">
                              Necesita apoyo frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alimentacionObs">Observaciones</Label>
                        <Textarea
                          id="alimentacionObs"
                          rows={3}
                          value={form.alimentacionObs || ""}
                          onChange={(e) =>
                            handleChange("alimentacionObs", e.target.value)
                          }
                          placeholder="Observaciones"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desarrollo comunicativo y lingüístico */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Desarrollo comunicativo y lingüístico
                    </p>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea
                        rows={4}
                        value={form.descDesarrolloComunicativo || ""}
                        onChange={(e) =>
                          handleChange(
                            "descDesarrolloComunicativo",
                            e.target.value,
                          )
                        }
                        placeholder="Vocabulario, información, comprensión, aritmética..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="comunicacionNivel">Comunicación</Label>
                        <Select
                          value={form.comunicacionNivel || undefined}
                          onValueChange={(v) =>
                            handleChange("comunicacionNivel", v)
                          }
                        >
                          <SelectTrigger id="comunicacionNivel">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_necesita">
                              No necesita atención específica. Comunicación
                              intencional funcional
                            </SelectItem>
                            <SelectItem value="apoyo_ocasional">
                              Requiere apoyo/seguimiento ocasional
                            </SelectItem>
                            <SelectItem value="apoyo_frecuente">
                              Necesita apoyo frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lenguajeExpresivoNivel">
                          Lenguaje expresivo
                        </Label>
                        <Select
                          value={form.lenguajeExpresivoNivel || undefined}
                          onValueChange={(v) =>
                            handleChange("lenguajeExpresivoNivel", v)
                          }
                        >
                          <SelectTrigger id="lenguajeExpresivoNivel">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_necesita">
                              No necesita atención específica en el dllo
                              lingüístico expresivo
                            </SelectItem>
                            <SelectItem value="apoyo_ocasional">
                              Requiere apoyo/seguimiento ocasional
                            </SelectItem>
                            <SelectItem value="apoyo_frecuente">
                              Necesita apoyo frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lenguajeComprensivoNivel">
                          Lenguaje comprensivo
                        </Label>
                        <Select
                          value={form.lenguajeComprensivoNivel || undefined}
                          onValueChange={(v) =>
                            handleChange("lenguajeComprensivoNivel", v)
                          }
                        >
                          <SelectTrigger id="lenguajeComprensivoNivel">
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_necesita">
                              No necesita atención específica
                            </SelectItem>
                            <SelectItem value="apoyo_ocasional">
                              Requiere apoyo/seguimiento ocasional
                            </SelectItem>
                            <SelectItem value="apoyo_frecuente">
                              Necesita apoyo frecuente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Desarrollo social y afectivo */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Desarrollo social y afectivo
                    </p>
                    <Textarea
                      rows={4}
                      value={form.descDesarrolloSocialAfectivo || ""}
                      onChange={(e) =>
                        handleChange(
                          "descDesarrolloSocialAfectivo",
                          e.target.value,
                        )
                      }
                      placeholder="Relaciones con iguales, clima aula, conductas observadas, etc."
                    />
                  </div>

                  {/* Estilo de aprendizaje y motivación */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Estilo de aprendizaje y motivación
                    </p>
                    <Textarea
                      rows={4}
                      value={form.descEstiloAprendizaje || ""}
                      onChange={(e) =>
                        handleChange("descEstiloAprendizaje", e.target.value)
                      }
                      placeholder="Puntos fuertes, motivación, autonomía, persistencia, etc."
                    />
                  </div>

                  {/* Otros */}
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Otros</p>
                    <Textarea
                      rows={3}
                      value={form.infoOtros || ""}
                      onChange={(e) =>
                        handleChange("infoOtros", e.target.value)
                      }
                      placeholder="Otra información relevante"
                    />
                  </div>

                  {/* Guardar dentro de Información relevante */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="contextoEscolar"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-teal-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-teal-100 rounded-full flex-shrink-0">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">Contexto Escolar</span>
                        {isSectionComplete("contextoEscolar") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Información del entorno educativo
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white space-y-6">
                  {/* Datos del alumno o alumna */}
                  <Collapsible
                    open={openCollapsibles["ce"]}
                    onOpenChange={() => toggleCollapsible("ce")}
                  >
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                      <CollapsibleTrigger className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Datos del alumno o alumna
                          </h3>
                          {isCollapsibleSectionComplete("identity") && (
                            <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        {openCollapsibles["ce"] ? (
                          <ChevronUp className="h-4 w-4 text-teal-600 transition-transform group-hover:scale-110" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-teal-600 transition-transform group-hover:scale-110" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <IdentityFields
                          idPrefix="ce-"
                          form={form}
                          handleChange={handleChange}
                          errors={errors}
                        />
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                  {/* Texto principal de contexto escolar */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Información relevante sobre el contexto escolar
                            </h3>
                            <Info className="w-3 h-3 text-slate-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Ratio del aula, recursos de PT/AL, clima escolar,
                            relación con el profesorado, etc.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Textarea
                      rows={6}
                      value={form.contextoEscolar || ""}
                      onChange={(e) =>
                        handleChange("contextoEscolar", e.target.value)
                      }
                      placeholder="Ej.: Llegada reciente al centro, ratio de aula, recursos de PT/AL, disponibilidad de apoyos, características del centro, etc."
                    />
                  </div>
                  {/* Botón Guardar dentro de Contexto escolar */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="entornoFamiliar"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-pink-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-pink-100 rounded-full flex-shrink-0">
                      <Home className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">Entorno Familiar</span>
                        {isSectionComplete("entornoFamiliar") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Contexto familiar y social del alumno
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white space-y-6">
                  {/* Datos del alumno o alumna */}
                  <Collapsible
                    open={openCollapsibles["ef"]}
                    onOpenChange={() => toggleCollapsible("ef")}
                  >
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                      <CollapsibleTrigger className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Datos del alumno o alumna
                          </h3>
                          {isCollapsibleSectionComplete("identity") && (
                            <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        {openCollapsibles["ef"] ? (
                          <ChevronUp className="h-4 w-4 text-pink-600 transition-transform group-hover:scale-110" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-pink-600 transition-transform group-hover:scale-110" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <IdentityFields
                          idPrefix="ef-"
                          form={form}
                          handleChange={handleChange}
                          errors={errors}
                        />
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                  {/* Texto principal del entorno familiar/contexto social */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Información relevante sobre el entorno familiar y
                              el contexto social
                            </h3>
                            <Info className="w-3 h-3 text-slate-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Estructura familiar, pautas educativas, nivel de
                            colaboración, factores de riesgo/protección, etc.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Textarea
                      rows={6}
                      value={form.entornoFamiliar || ""}
                      onChange={(e) =>
                        handleChange("entornoFamiliar", e.target.value)
                      }
                      placeholder="Ej.: Situación familiar (convivencia, custodia), red de apoyos, recursos sociales, factores de riesgo/protección, etc."
                    />
                  </div>
                  {/* Botón Guardar dentro de Entorno familiar */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-pink-600 hover:bg-pink-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="necesidadesApoyo"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-indigo-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full flex-shrink-0">
                      <Target className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">
                          Necesidades de Apoyo Educativo
                        </span>
                        {isSectionComplete("necesidadesApoyo") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Determinación de NEAE específicas
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white space-y-6">
                  {/* Datos del alumno o alumna */}
                  <Collapsible
                    open={openCollapsibles["ne"]}
                    onOpenChange={() => toggleCollapsible("ne")}
                  >
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                      <CollapsibleTrigger className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Datos del alumno o alumna
                          </h3>
                          {isCollapsibleSectionComplete("identity") && (
                            <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        {openCollapsibles["ne"] ? (
                          <ChevronUp className="h-4 w-4 text-indigo-600 transition-transform group-hover:scale-110" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-indigo-600 transition-transform group-hover:scale-110" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <IdentityFields
                          idPrefix="ne-"
                          form={form}
                          handleChange={handleChange}
                          errors={errors}
                        />
                      </CollapsibleContent>
                    </div>
                  </Collapsible>

                  {/* Determinación de NEAE */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-slate-700">
                        Determinación de las necesidades específicas de apoyo
                        educativo
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1 cursor-help">
                              ¿Presenta NEAE?
                              <Info className="w-3 h-3 text-slate-500" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Necesidades Específicas de Apoyo Educativo (NEAE).
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <RadioGroup
                        className="flex gap-6"
                        value={form.presentaNEAE || ""}
                        onValueChange={(v) => handleChange("presentaNEAE", v)}
                      >
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
                      Esta determinación de NEAE no es un diagnóstico clínico,
                      sino la identificación de necesidades que requieren
                      atención educativa diferente a la ordinaria según
                      criterios de la Consejería.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="necesidad">Necesidad</Label>
                        <Select
                          value={necesidadTemp || undefined}
                          onValueChange={(v) => setNecesidadTemp(v)}
                        >
                          <SelectTrigger id="necesidad">
                            <SelectValue placeholder="Selecciona necesidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="discapacidad_intelectual_leve">
                              Discapacidad Intelectual leve
                            </SelectItem>
                            <SelectItem value="trastorno_espectro_autista">
                              Trastorno del Espectro Autista
                            </SelectItem>
                            <SelectItem value="trastorno_lenguaje">
                              Trastorno del lenguaje
                            </SelectItem>
                            <SelectItem value="dificultades_aprendizaje">
                              Dificultades específicas de aprendizaje
                            </SelectItem>
                            <SelectItem value="altas_capacidades">
                              Altas Capacidades
                            </SelectItem>
                            <SelectItem value="otras_necesidades">
                              Otras necesidades
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          necesidadTemp &&
                          (handleChange("necesidadesListado", [
                            ...(form.necesidadesListado || []),
                            necesidadTemp,
                          ]),
                          setNecesidadTemp(""))
                        }
                      >
                        Añadir
                      </Button>
                    </div>

                    {(form.necesidadesListado?.length || 0) > 0 && (
                      <ul className="mt-2 divide-y rounded-md border bg-white">
                        {(form.necesidadesListado || []).map((n, i) => (
                          <li
                            key={`nec-${i}`}
                            className="px-3 py-2 text-sm flex items-center justify-between"
                          >
                            <span className="truncate">
                              {n
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (m) => m.toUpperCase())}
                            </span>
                            <button
                              type="button"
                              className="text-gray-500 hover:text-red-600"
                              onClick={() =>
                                handleChange(
                                  "necesidadesListado",
                                  (form.necesidadesListado || []).filter(
                                    (_, idx) => idx !== i,
                                  ),
                                )
                              }
                            >
                              Borrar
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="sindromeEspecifico">
                        Síndrome específico
                      </Label>
                      <Select
                        value={form.sindromeEspecifico || undefined}
                        onValueChange={(v) =>
                          handleChange("sindromeEspecifico", v)
                        }
                      >
                        <SelectTrigger id="sindromeEspecifico">
                          <SelectValue placeholder="Selecciona si procede" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ninguno">Ninguno</SelectItem>
                          <SelectItem value="down">Síndrome de Down</SelectItem>
                          <SelectItem value="asperger">
                            Síndrome de Asperger
                          </SelectItem>
                          <SelectItem value="x_fragil">X Frágil</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Observaciones
                            </h3>
                            <Info className="w-3 h-3 text-slate-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Resume la necesidad y su correspondencia con el
                            Nivel de Competencia Curricular (NCC).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Textarea
                      rows={4}
                      value={form.observacionesNEAE || ""}
                      onChange={(e) =>
                        handleChange("observacionesNEAE", e.target.value)
                      }
                      placeholder="Resumen de la necesidad y su correspondencia con el NCC, medidas de acceso necesarias, etc."
                    />
                  </div>

                  {/* Botón Guardar */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="propuestaAtencion"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-lime-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-lime-100 rounded-full flex-shrink-0">
                      <ClipboardCheck className="h-3 w-3 sm:h-4 sm:w-4 text-lime-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">
                          Propuesta de Atención Educativa
                        </span>
                        {isSectionComplete("propuestaAtencion") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Orientaciones y medidas para el profesorado
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white space-y-6">
                  {/* Datos del alumno o alumna */}
                  <Collapsible
                    open={openCollapsibles["pa"]}
                    onOpenChange={() => toggleCollapsible("pa")}
                  >
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                      <CollapsibleTrigger className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Datos del alumno o alumna
                          </h3>
                          {isCollapsibleSectionComplete("identity") && (
                            <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        {openCollapsibles["pa"] ? (
                          <ChevronUp className="h-4 w-4 text-lime-600 transition-transform group-hover:scale-110" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-lime-600 transition-transform group-hover:scale-110" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <IdentityFields
                          idPrefix="pa-"
                          form={form}
                          handleChange={handleChange}
                          errors={errors}
                        />
                      </CollapsibleContent>
                    </div>
                  </Collapsible>

                  {/* Propuesta de atención educativa */}
                  <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                    <p className="text-sm font-semibold text-slate-700">
                      Especificar la propuesta de medidas y recursos necesarios
                      para atender las NEAE identificadas.
                    </p>
                    <div className="rounded-md border bg-slate-100 p-3 text-xs text-slate-600">
                      Medidas Educativas
                    </div>

                    {/* Medidas educativas generales */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Medidas educativas generales
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                        <div className="md:col-span-2">
                          <Select
                            value={medidaTemp || undefined}
                            onValueChange={(v) => setMedidaTemp(v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona medida" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="refuerzo_lcl_en_lugar_de_2LE">
                                Refuerzo de LCL en lugar de 2ª Lengua Extranjera
                                (Educación Primaria)
                              </SelectItem>
                              <SelectItem value="organizacion_flexible">
                                Organización flexible de
                                espacios/tiempos/recursos
                              </SelectItem>
                              <SelectItem value="actividades_refuerzo">
                                Actividades de refuerzo educativo
                              </SelectItem>
                              <SelectItem value="apoyo_en_grupo_ordinario">
                                Apoyo en grupo ordinario mediante 2º profesor/a
                                dentro del aula
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            medidaTemp &&
                            (handleChange("medidasEducativasGenerales", [
                              ...(form.medidasEducativasGenerales || []),
                              medidaTemp,
                            ]),
                            setMedidaTemp(""))
                          }
                        >
                          Añadir
                        </Button>
                      </div>
                      {(form.medidasEducativasGenerales?.length || 0) > 0 && (
                        <ul className="mt-2 divide-y rounded-md border bg-white">
                          {(form.medidasEducativasGenerales || []).map(
                            (m, i) => (
                              <li
                                key={`med-${i}`}
                                className="px-3 py-2 text-sm flex items-center justify-between"
                              >
                                <span>
                                  {m
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (t) => t.toUpperCase())}
                                </span>
                                <button
                                  type="button"
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() =>
                                    handleChange(
                                      "medidasEducativasGenerales",
                                      (
                                        form.medidasEducativasGenerales || []
                                      ).filter((_, idx) => idx !== i),
                                    )
                                  }
                                >
                                  Borrar
                                </button>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Recursos materiales específicos */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Recursos materiales específicos
                      </p>
                      <div className="rounded-md border bg-slate-100 p-3 text-xs text-slate-600">
                        La propuesta de Recursos Materiales Específicos requiere
                        informe previo del E.O.E. Especializado. Adjuntar
                        informe en Ficheros Externos.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                        <div className="md:col-span-2">
                          <Select
                            value={recursoMaterialTemp || undefined}
                            onValueChange={(v) => setRecursoMaterialTemp(v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona recurso" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="software_apoyo_aprendizaje">
                                Software de apoyo al aprendizaje
                              </SelectItem>
                              <SelectItem value="materiales_adaptados">
                                Materiales adaptados
                              </SelectItem>
                              <SelectItem value="ayudas_tecnicas">
                                Ayudas técnicas
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            recursoMaterialTemp &&
                            (handleChange("recursosMaterialesEspecificos", [
                              ...(form.recursosMaterialesEspecificos || []),
                              recursoMaterialTemp,
                            ]),
                            setRecursoMaterialTemp(""))
                          }
                        >
                          Añadir
                        </Button>
                      </div>
                      {(form.recursosMaterialesEspecificos?.length || 0) >
                        0 && (
                        <ul className="mt-2 divide-y rounded-md border bg-white">
                          {(form.recursosMaterialesEspecificos || []).map(
                            (r, i) => (
                              <li
                                key={`rec-${i}`}
                                className="px-3 py-2 text-sm flex items-center justify-between"
                              >
                                <span>
                                  {r
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (t) => t.toUpperCase())}
                                </span>
                                <button
                                  type="button"
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() =>
                                    handleChange(
                                      "recursosMaterialesEspecificos",
                                      (
                                        form.recursosMaterialesEspecificos || []
                                      ).filter((_, idx) => idx !== i),
                                    )
                                  }
                                >
                                  Borrar
                                </button>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                      <div className="space-y-2 mt-2">
                        <Label htmlFor="recursosMaterialesObs">
                          Observaciones
                        </Label>
                        <Textarea
                          id="recursosMaterialesObs"
                          rows={3}
                          value={form.recursosMaterialesObs || ""}
                          onChange={(e) =>
                            handleChange(
                              "recursosMaterialesObs",
                              e.target.value,
                            )
                          }
                          placeholder="Aclaraciones sobre recursos materiales propuestos"
                        />
                      </div>
                    </div>

                    {/* Actuaciones personalizadas de acción tutorial y seguimiento */}
                    <div className="space-y-2">
                      <div className="rounded-md border bg-slate-100 p-3 text-xs text-slate-600">
                        Medidas de carácter ordinario sujetas a lo establecido
                        en el Proyecto Educativo del Centro
                      </div>
                      <Label htmlFor="actuacionesObservaciones">
                        Observaciones
                      </Label>
                      <Textarea
                        id="actuacionesObservaciones"
                        rows={3}
                        value={form.actuacionesObservaciones || ""}
                        onChange={(e) =>
                          handleChange(
                            "actuacionesObservaciones",
                            e.target.value,
                          )
                        }
                        placeholder="Seguimiento, coordinación, acción tutorial, etc."
                      />
                    </div>
                  </div>

                  {/* Recursos personales */}
                  <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                    <p className="text-sm font-semibold text-slate-700">
                      Recursos Personales
                    </p>
                    {/* Profesorado especialista */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Profesorado especialista
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                        <div className="md:col-span-2">
                          <Select
                            value={profEspecialistaTemp || undefined}
                            onValueChange={(v) => setProfEspecialistaTemp(v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona perfil" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pt">
                                Prof.Esp. en Pedagogía Terapéutica (PT)
                              </SelectItem>
                              <SelectItem value="al">
                                Prof.Esp. en Audición y Lenguaje (AL)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            profEspecialistaTemp &&
                            (handleChange("profesoradoEspecialista", [
                              ...(form.profesoradoEspecialista || []),
                              profEspecialistaTemp,
                            ]),
                            setProfEspecialistaTemp(""))
                          }
                        >
                          Añadir
                        </Button>
                      </div>
                      {(form.profesoradoEspecialista?.length || 0) > 0 && (
                        <ul className="mt-2 divide-y rounded-md border bg-white">
                          {(form.profesoradoEspecialista || []).map((p, i) => (
                            <li
                              key={`pe-${i}`}
                              className="px-3 py-2 text-sm flex items-center justify-between"
                            >
                              <span>
                                {p === "pt"
                                  ? "Prof.Esp. en Pedagogía Terapéutica (PT)"
                                  : "Prof.Esp. en Audición y Lenguaje (AL)"}
                              </span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-red-600"
                                onClick={() =>
                                  handleChange(
                                    "profesoradoEspecialista",
                                    (form.profesoradoEspecialista || []).filter(
                                      (_, idx) => idx !== i,
                                    ),
                                  )
                                }
                              >
                                Borrar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="space-y-2 mt-2">
                        <Label htmlFor="profesoradoEspecialistaObs">
                          Observaciones
                        </Label>
                        <Textarea
                          id="profesoradoEspecialistaObs"
                          rows={3}
                          value={form.profesoradoEspecialistaObs || ""}
                          onChange={(e) =>
                            handleChange(
                              "profesoradoEspecialistaObs",
                              e.target.value,
                            )
                          }
                          placeholder="Distribución horaria, coordinación, objetivos del apoyo, etc."
                        />
                      </div>
                    </div>

                    {/* Personal no docente */}
                    <div className="space-y-2">
                      <div className="rounded-md border bg-slate-100 p-3 text-xs text-slate-600">
                        La propuesta de ILSE requiere informe previo del E.O.E.
                        Especializado. La del Fisioterapeuta solo para Centro
                        Específico de Educación Especial.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                        <div className="md:col-span-2">
                          <Select
                            value={personalNoDocenteTemp || undefined}
                            onValueChange={(v) => setPersonalNoDocenteTemp(v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona personal no docente" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ilse">
                                Intérprete de Lengua de Signos (ILSE)
                              </SelectItem>
                              <SelectItem value="fisioterapeuta">
                                Fisioterapeuta
                              </SelectItem>
                              <SelectItem value="pteis">
                                Personal Técnico de Integración Social (PTIS)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            personalNoDocenteTemp &&
                            (handleChange("personalNoDocente", [
                              ...(form.personalNoDocente || []),
                              personalNoDocenteTemp,
                            ]),
                            setPersonalNoDocenteTemp(""))
                          }
                        >
                          Añadir
                        </Button>
                      </div>
                      {(form.personalNoDocente?.length || 0) > 0 && (
                        <ul className="mt-2 divide-y rounded-md border bg-white">
                          {(form.personalNoDocente || []).map((p, i) => (
                            <li
                              key={`pnd-${i}`}
                              className="px-3 py-2 text-sm flex items-center justify-between"
                            >
                              <span>
                                {p === "ilse"
                                  ? "Intérprete de Lengua de Signos (ILSE)"
                                  : p === "fisioterapeuta"
                                    ? "Fisioterapeuta"
                                    : "Personal Técnico de Integración Social (PTIS)"}
                              </span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-red-600"
                                onClick={() =>
                                  handleChange(
                                    "personalNoDocente",
                                    (form.personalNoDocente || []).filter(
                                      (_, idx) => idx !== i,
                                    ),
                                  )
                                }
                              >
                                Borrar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="space-y-2 mt-2">
                        <Label htmlFor="personalNoDocenteObs">
                          Observaciones
                        </Label>
                        <Textarea
                          id="personalNoDocenteObs"
                          rows={3}
                          value={form.personalNoDocenteObs || ""}
                          onChange={(e) =>
                            handleChange("personalNoDocenteObs", e.target.value)
                          }
                          placeholder="Justificación, tareas, coordinación..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Orientaciones al profesorado */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 space-y-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Orientaciones al profesorado
                            </h3>
                            <Info className="w-3 h-3 text-slate-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Sugerencias metodológicas, de organización,
                            evaluación, etc.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Especificar orientaciones para la organización de la
                      respuesta educativa.
                    </p>
                    <Textarea
                      id="propuestaAtencion"
                      rows={6}
                      value={form.propuestaAtencion || ""}
                      onChange={(e) =>
                        handleChange("propuestaAtencion", e.target.value)
                      }
                      placeholder="Sugerencias metodológicas, organización del aula, apoyos, seguimiento, coordinación..."
                    />
                  </div>

                  {/* Botón Guardar */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-lime-600 hover:bg-lime-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="orientacionesFamilia"
                className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-violet-500 no-underline hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full flex-shrink-0">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
                        <span className="truncate">
                          Orientaciones a la Familia
                        </span>
                        {isSectionComplete("orientacionesFamilia") && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-bold text-green-800 border-green-300 bg-green-100"
                          >
                            Completado
                          </Badge>
                        )}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                        Guía para representantes legales
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white space-y-6">
                  {/* Datos del alumno o alumna */}
                  <Collapsible
                    open={openCollapsibles["of"]}
                    onOpenChange={() => toggleCollapsible("of")}
                  >
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                      <CollapsibleTrigger className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                          <h3 className="text-sm font-semibold text-slate-700">
                            Datos del alumno o alumna
                          </h3>
                          {isCollapsibleSectionComplete("identity") && (
                            <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        {openCollapsibles["of"] ? (
                          <ChevronUp className="h-4 w-4 text-violet-600 transition-transform group-hover:scale-110" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-violet-600 transition-transform group-hover:scale-110" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <IdentityFields
                          idPrefix="of-"
                          form={form}
                          handleChange={handleChange}
                          errors={errors}
                        />
                      </CollapsibleContent>
                    </div>
                  </Collapsible>

                  {/* Orientaciones */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Orientaciones a la familia o a los representantes
                              legales
                            </h3>
                            <Info className="w-3 h-3 text-slate-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Pautas de actuación, fomento de la autonomía,
                            coordinación con el centro, etc.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Textarea
                      rows={8}
                      value={form.orientacionesFamilia || ""}
                      onChange={(e) =>
                        handleChange("orientacionesFamilia", e.target.value)
                      }
                      placeholder="Ej.: Establecer contactos periódicos con la tutora, reforzar logros, proporcionar apoyo y dedicación, fomentar expectativas positivas, coordinación con el centro, etc."
                    />
                  </div>

                  {/* Fichero externo */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-slate-700">
                              Fichero externo
                            </h3>
                            <Info className="w-3 h-3 text-slate-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Adjunta aquí informes externos, dictámenes, u otros
                            documentos de interés.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        multiple
                        onChange={(e) =>
                          handleOrientacionesFiles(e.target.files)
                        }
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        Número total de ficheros:{" "}
                        {form.orientacionesAdjuntos?.length || 0}
                      </p>
                      {(form.orientacionesAdjuntos?.length || 0) > 0 && (
                        <ul className="divide-y rounded-md border bg-gray-50">
                          {(form.orientacionesAdjuntos || []).map((f, idx) => (
                            <li
                              key={`of-${idx}-${f.name}`}
                              className="flex items-center justify-between px-3 py-2 text-sm"
                            >
                              <span className="truncate" title={f.name}>
                                {f.name}
                              </span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-red-600"
                                onClick={() => removeOrientacionesAdjunto(idx)}
                                aria-label={`Eliminar ${f.name}`}
                              >
                                Eliminar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Botón Guardar dentro de Orientaciones a la familia */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4 mr-2" /> Guardar Sección
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 p-4 sm:p-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 p-6"
                >
                  {isLoading ? "Generando..." : "🚀 Generar Informe"}
                </Button>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 px-4 sm:px-6 w-full sm:w-auto"
                  >
                    Limpiar Todo
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveDraft}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 sm:px-6 shadow-sm w-full sm:w-auto"
                  >
                    💾 Guardar Borrador
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
