import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Save,
  Trash2,
} from "lucide-react";
import { IdentityFields } from "../IdentityFields";
import { FormTextarea } from "../FormTextarea";
import type {
  CollapsibleRecord,
  CollapsibleStatusChecker,
  CollapsibleToggleHandler,
  FormChangeHandler,
  FormErrors,
  FormState,
  SaveDraftHandler,
  SectionStatusChecker,
} from "@/types/informe-completo";

interface PropuestaAtencionSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleSaveDraft: SaveDraftHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  openCollapsibles: CollapsibleRecord;
  toggleCollapsible: CollapsibleToggleHandler;
  recursoMaterialTemp: string;
  setRecursoMaterialTemp: (value: string) => void;
  profEspecialistaTemp: string;
  setProfEspecialistaTemp: (value: string) => void;
  personalNoDocenteTemp: string;
  setPersonalNoDocenteTemp: (value: string) => void;
}

const GENERAL_MEASURE_OPTIONS = [
  {
    value: "apoyo_grupos_ordinarios",
    label:
      "Apoyo en grupos ordinarios mediante un segundo profesor o profesora dentro del aula",
  },
  { value: "accion_tutorial", label: "Acción tutorial" },
  {
    value: "metodologias_didacticas",
    label:
      "Metodologías didácticas basadas en el trabajo colaborativo, tutoría entre iguales y aprendizaje por proyectos",
  },
  {
    value: "actuaciones_coordinacion",
    label:
      "Actuaciones de coordinación en el proceso de tránsito entre ciclos, o entre etapas",
  },
  {
    value: "actuaciones_prevencion",
    label: "Actuaciones de prevención y control del absentismo",
  },
  {
    value: "refuerzo_troncales_4eso",
    label: "Programa de refuerzo de troncales para 4º ESO",
  },
  {
    value: "pmar",
    label: "Programa mejora aprendizaje y rendimiento (PMAR)",
  },
] as const;

const RESOURCE_OPTIONS = [
  {
    value: "software_apoyo_aprendizaje",
    label: "Software de apoyo al aprendizaje",
  },
  { value: "materiales_adaptados", label: "Materiales adaptados" },
  { value: "ayudas_tecnicas", label: "Ayudas técnicas" },
] as const;

const SPECIALIST_OPTIONS = [
  { value: "pt", label: "Prof.Esp. en Pedagogía Terapéutica (PT)" },
  { value: "al", label: "Prof.Esp. en Audición y Lenguaje (AL)" },
] as const;

const PERSONAL_NO_DOCENTE_OPTIONS = [
  { value: "ilse", label: "Intérprete de Lengua de Signos (ILSE)" },
  { value: "fisioterapeuta", label: "Fisioterapeuta" },
  {
    value: "pteis",
    label: "Personal Técnico de Integración Social (PTIS)",
  },
] as const;

const toTitleCase = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export function PropuestaAtencionSection({
  form,
  errors,
  handleChange,
  handleSaveDraft,
  isSectionComplete,
  isCollapsibleSectionComplete,
  openCollapsibles,
  toggleCollapsible,
  recursoMaterialTemp,
  setRecursoMaterialTemp,
  profEspecialistaTemp,
  setProfEspecialistaTemp,
  personalNoDocenteTemp,
  setPersonalNoDocenteTemp,
}: PropuestaAtencionSectionProps) {
  return (
    <AccordionItem
      value="propuestaAtencion"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-lime-500 no-underline hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <div className="flex items-center justify-center w-8 h-8 bg-lime-100 rounded-full flex-shrink-0">
            <ClipboardCheck className="h-3 w-3 sm:h-4 sm:w-4 text-lime-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
              <span className="truncate">
                Propuesta de Atención Educativa. Orientaciones al profesorado
                (*)
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
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:flex items-center gap-2">
              <p>Orientaciones y medidas para el profesorado</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex items-center cursor-help"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <Info className="h-3.5 w-3.5 text-slate-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" align="start">
                  <p className="max-w-xs">
                    Concreta medidas generales y específicas, recursos y
                    responsabilidades para la intervención educativa.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4 bg-white space-y-6">
        <Collapsible
          open={openCollapsibles["pa"]}
          onOpenChange={() => toggleCollapsible("pa")}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lime-500 rounded-full" />
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

        <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-4">
          <div className="rounded-md border bg-blue-50 p-3 text-xs text-gray-700 font-medium">
            Medidas Educativas
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">
              Medidas educativas generales
            </p>
            <Select
              value=""
              onValueChange={(value) => {
                const alreadySelected =
                  value && form.medidasEducativasGenerales?.includes(value);

                if (value && !alreadySelected) {
                  handleChange("medidasEducativasGenerales", [
                    ...(form.medidasEducativasGenerales || []),
                    value,
                  ]);
                }
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecciona medida" />
              </SelectTrigger>
              <SelectContent>
                {GENERAL_MEASURE_OPTIONS.map((option) => {
                  const isSelected = form.medidasEducativasGenerales?.includes(
                    option.value,
                  );
                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={isSelected}
                    >
                      {isSelected ? "✓ " : ""}
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {(form.medidasEducativasGenerales?.length || 0) > 0 && (
              <div className="space-y-2">
                {(form.medidasEducativasGenerales || []).map((item, index) => {
                  const selectedOption = GENERAL_MEASURE_OPTIONS.find(
                    (option) => option.value === item,
                  );

                  return (
                    <div
                      key={`med-${index}`}
                      className="flex items-start gap-3 p-3 bg-emerald-100 border border-emerald-200 rounded-lg group hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex-1 text-sm text-slate-700 leading-relaxed">
                        {selectedOption?.label || toTitleCase(item)}
                      </div>
                      <button
                        type="button"
                        className="flex-shrink-0 p-1.5 text-white bg-red-500 hover:text-slate-400 hover:bg-transparent rounded transition-all"
                        onClick={() =>
                          handleChange(
                            "medidasEducativasGenerales",
                            (form.medidasEducativasGenerales || []).filter(
                              (_, idx) => idx !== index,
                            ),
                          )
                        }
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Recursos materiales específicos
            </p>
            <div className="rounded-md border bg-slate-100 p-3 text-xs text-slate-600">
              La propuesta de Recursos Materiales Específicos requiere informe
              previo del E.O.E. Especializado. Adjuntar informe en Ficheros
              Externos.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
              <div className="md:col-span-2">
                <Select
                  value={recursoMaterialTemp || undefined}
                  onValueChange={(value) => setRecursoMaterialTemp(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona recurso" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
            {(form.recursosMaterialesEspecificos?.length || 0) > 0 && (
              <ul className="mt-2 divide-y rounded-md border bg-white">
                {(form.recursosMaterialesEspecificos || []).map(
                  (item, index) => {
                    const optionLabel =
                      RESOURCE_OPTIONS.find((option) => option.value === item)
                        ?.label || toTitleCase(item);
                    return (
                      <li
                        key={`rec-${index}`}
                        className="px-3 py-2 text-sm flex items-center justify-between"
                      >
                        <span>{optionLabel}</span>
                        <button
                          type="button"
                          className="text-gray-500 hover:text-red-600"
                          onClick={() =>
                            handleChange(
                              "recursosMaterialesEspecificos",
                              (form.recursosMaterialesEspecificos || []).filter(
                                (_, idx) => idx !== index,
                              ),
                            )
                          }
                        >
                          Borrar
                        </button>
                      </li>
                    );
                  },
                )}
              </ul>
            )}
            <div className="space-y-2 mt-2">
              <Label htmlFor="recursosMaterialesObs">Observaciones</Label>
              <FormTextarea
                id="recursosMaterialesObs"
                rows={3}
                value={form.recursosMaterialesObs || ""}
                onChange={(event) =>
                  handleChange("recursosMaterialesObs", event.target.value)
                }
                placeholder="Aclaraciones sobre recursos materiales propuestos"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-md border bg-slate-100 p-3 text-xs text-slate-600">
              Medidas de carácter ordinario sujetas a lo establecido en el
              Proyecto Educativo del Centro
            </div>
            <Label htmlFor="actuacionesObservaciones">Observaciones</Label>
            <FormTextarea
              id="actuacionesObservaciones"
              rows={3}
              value={form.actuacionesObservaciones || ""}
              onChange={(event) =>
                handleChange("actuacionesObservaciones", event.target.value)
              }
              placeholder="Seguimiento, coordinación, acción tutorial, etc."
            />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-4">
          <p className="text-sm font-semibold text-slate-700">
            Recursos Personales
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Profesorado especialista</p>
            <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
              <div className="md:col-span-2">
                <Select
                  value={profEspecialistaTemp || undefined}
                  onValueChange={(value) => setProfEspecialistaTemp(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIST_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
                {(form.profesoradoEspecialista || []).map((item, index) => {
                  const label =
                    SPECIALIST_OPTIONS.find((option) => option.value === item)
                      ?.label || toTitleCase(item);
                  return (
                    <li
                      key={`pe-${index}`}
                      className="px-3 py-2 text-sm flex items-center justify-between"
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-600"
                        onClick={() =>
                          handleChange(
                            "profesoradoEspecialista",
                            (form.profesoradoEspecialista || []).filter(
                              (_, idx) => idx !== index,
                            ),
                          )
                        }
                      >
                        Borrar
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="space-y-2 mt-2">
              <Label htmlFor="profesoradoEspecialistaObs">Observaciones</Label>
              <FormTextarea
                id="profesoradoEspecialistaObs"
                rows={3}
                value={form.profesoradoEspecialistaObs || ""}
                onChange={(event) =>
                  handleChange("profesoradoEspecialistaObs", event.target.value)
                }
                placeholder="Distribución horaria, coordinación, objetivos del apoyo, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-md border bg-slate-100 p-3 text-xs text-slate-600">
              La propuesta de ILSE requiere informe previo del E.O.E.
              Especializado. La del Fisioterapeuta solo para Centro Específico
              de Educación Especial.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
              <div className="md:col-span-2">
                <Select
                  value={personalNoDocenteTemp || undefined}
                  onValueChange={(value) => setPersonalNoDocenteTemp(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona personal no docente" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERSONAL_NO_DOCENTE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
                {(form.personalNoDocente || []).map((item, index) => {
                  const label =
                    PERSONAL_NO_DOCENTE_OPTIONS.find(
                      (option) => option.value === item,
                    )?.label || toTitleCase(item);
                  return (
                    <li
                      key={`pnd-${index}`}
                      className="px-3 py-2 text-sm flex items-center justify-between"
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-600"
                        onClick={() =>
                          handleChange(
                            "personalNoDocente",
                            (form.personalNoDocente || []).filter(
                              (_, idx) => idx !== index,
                            ),
                          )
                        }
                      >
                        Borrar
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="space-y-2 mt-2">
              <Label htmlFor="personalNoDocenteObs">Observaciones</Label>
              <FormTextarea
                id="personalNoDocenteObs"
                rows={3}
                value={form.personalNoDocenteObs || ""}
                onChange={(event) =>
                  handleChange("personalNoDocenteObs", event.target.value)
                }
                placeholder="Justificación, tareas, coordinación..."
              />
            </div>
          </div>
        </div>

        <Collapsible
          open={openCollapsibles["orientacionesProfesorado"]}
          onOpenChange={() => toggleCollapsible("orientacionesProfesorado")}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lime-500 rounded-full" />
                <h3 className="text-sm font-semibold text-slate-700">
                  Orientaciones al profesorado
                </h3>
              </div>
              {openCollapsibles["orientacionesProfesorado"] ? (
                <ChevronUp className="h-4 w-4 text-lime-600 transition-transform group-hover:scale-110" />
              ) : (
                <ChevronDown className="h-4 w-4 text-lime-600 transition-transform group-hover:scale-110" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help mb-4">
                    <Info className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-600">
                      Sugerencias metodológicas, de organización, evaluación,
                      etc.
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Sugerencias metodológicas, de organización, evaluación, etc.
                  </p>
                </TooltipContent>
              </Tooltip>
              <p className="text-sm text-slate-600 mb-3">
                Especificar orientaciones para la organización de la respuesta
                educativa.
              </p>
              <FormTextarea
                id="propuestaAtencion"
                rows={6}
                value={form.propuestaAtencion || ""}
                onChange={(event) =>
                  handleChange("propuestaAtencion", event.target.value)
                }
                placeholder="Sugerencias metodológicas, organización del aula, apoyos, seguimiento, coordinación..."
              />
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Collapsible
          open={openCollapsibles["ficherosAdjuntosProfesorado"]}
          onOpenChange={() => toggleCollapsible("ficherosAdjuntosProfesorado")}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lime-500 rounded-full" />
                <h3 className="text-sm font-semibold text-slate-700">
                  Ficheros adjuntos: Informe del EOE especializado para personal
                  no docente y/o recursos específicos. Otros ficheros
                </h3>
              </div>
              {openCollapsibles["ficherosAdjuntosProfesorado"] ? (
                <ChevronUp className="h-4 w-4 text-lime-600 transition-transform group-hover:scale-110" />
              ) : (
                <ChevronDown className="h-4 w-4 text-lime-600 transition-transform group-hover:scale-110" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Adjuntar fichero:</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-lime-600 hover:bg-lime-700 text-white shadow-sm"
            onClick={() => handleSaveDraft("propuestaAtencion")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
