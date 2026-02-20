import React from "react";
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
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormTextarea } from "../FormTextarea";
import { IdentityFields } from "../IdentityFields";
import { FormField } from "../FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Info,
  Save,
  Brain,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Shield,
  X,
} from "lucide-react";
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

interface EvaluacionPsicopedagogicaSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleSaveDraft: SaveDraftHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  openCollapsibles: CollapsibleRecord;
  toggleCollapsible: CollapsibleToggleHandler;
}

export function EvaluacionPsicopedagogicaSection({
  form,
  errors,
  handleChange,
  handleSaveDraft,
  isSectionComplete,
  isCollapsibleSectionComplete,
  openCollapsibles,
  toggleCollapsible,
}: EvaluacionPsicopedagogicaSectionProps) {
  return (
    <AccordionItem
      value="evaluacionPsicopedagogica"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-purple-500 no-underline hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0">
            <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
              <span className="truncate">
                Datos de la Evaluación Psicopedagógica
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
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:flex items-center gap-2">
              <p>Datos y motivo de la evaluación</p>
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
                    Define motivo de evaluación, antecedentes y evidencias para
                    fundamentar el dictamen psicopedagógico.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 py-4 sm:px-6 bg-white">
        <div className="space-y-6">
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
                    <Label
                      htmlFor="eoeReferencia"
                      className="flex items-center gap-2"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-1 cursor-help">
                            EOE de referencia
                            <Shield className="w-4 h-4 text-emerald-600" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start">
                          <p className="max-w-xs">
                            Campo protegido por LOPD. El EOE real no se guarda,
                            se usa un código anónimo.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="eoeReferencia"
                      value={form.eoeReferencia || "EOE [Código Anónimo]"}
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

          <Collapsible
            open={openCollapsibles["evPsico"]}
            onOpenChange={() => toggleCollapsible("evPsico")}
          >
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
              <CollapsibleTrigger className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-slate-700">
                    Datos de la evaluación psicopedagógica
                  </h3>
                  {isCollapsibleSectionComplete("datosEvaluacionPsico") && (
                    <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                {openCollapsibles["evPsico"] ? (
                  <ChevronUp className="h-4 w-4 text-purple-600 transition-transform group-hover:scale-110" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-purple-600 transition-transform group-hover:scale-110" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Profesional que realiza la evaluación">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="profesionalRealiza"
                            value={
                              form.profesionalRealiza ||
                              "Profesional [Código Anónimo]"
                            }
                            readOnly
                            disabled
                            className="bg-gray-100 cursor-not-allowed text-gray-600 border-gray-300 font-mono text-sm"
                            title="Campo protegido por LOPD - No se permiten nombres reales"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Campo anonimizado por la normativa de protección de
                            datos.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormField>
                  <FormField label="Fecha de inicio">
                    <Input
                      id="fechaInicioEvaluacion"
                      type="date"
                      value={form.fechaInicioEvaluacion || ""}
                      onChange={(e) =>
                        handleChange("fechaInicioEvaluacion", e.target.value)
                      }
                    />
                  </FormField>
                  <FormField label="Fecha de finalización">
                    <Input
                      id="fechaFinEvaluacion"
                      type="date"
                      value={form.fechaFinEvaluacion || ""}
                      onChange={(e) =>
                        handleChange("fechaFinEvaluacion", e.target.value)
                      }
                    />
                  </FormField>
                  <FormField label="Motivo de la evaluación">
                    <div className="flex items-center gap-2">
                      <Select
                        value={form.motivoEvaluacion || undefined}
                        onValueChange={(value) =>
                          handleChange("motivoEvaluacion", value)
                        }
                      >
                        <SelectTrigger id="motivoEvaluacion">
                          <SelectValue placeholder="Selecciona motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dificultades_aprendizaje">
                            Dificultades de aprendizaje
                          </SelectItem>
                          <SelectItem value="neae">
                            Valoración de necesidades educativas especiales
                          </SelectItem>
                          <SelectItem value="adaptacion_curricular">
                            Adaptación curricular
                          </SelectItem>
                          <SelectItem value="altas_capacidades">
                            Altas capacidades
                          </SelectItem>
                          <SelectItem value="conducta">
                            Conducta / socioemocional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {form.motivoEvaluacion && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleChange("motivoEvaluacion", undefined)
                          }
                          className="flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </FormField>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="motivoEvaluacionDetalle">
                    Motivo de la evaluación psicopedagógica
                  </Label>
                  <FormTextarea
                    id="motivoEvaluacionDetalle"
                    rows={4}
                    value={form.motivoEvaluacionDetalle || ""}
                    onChange={(e) =>
                      handleChange("motivoEvaluacionDetalle", e.target.value)
                    }
                    placeholder="Describe con más detalle el motivo..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instrumentosInformacion">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help mt-4">
                          Instrumentos de recogida de información
                          <Info className="w-3 h-3 text-slate-500" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Ej: Observación, entrevistas, análisis de trabajos,
                          pruebas estandarizadas (WISC, etc.).
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <FormTextarea
                    id="instrumentosInformacion"
                    rows={4}
                    value={form.instrumentosInformacion || ""}
                    onChange={(e) =>
                      handleChange("instrumentosInformacion", e.target.value)
                    }
                    placeholder="Observación en aula, entrevistas, análisis de documentación, pruebas, etc."
                  />
                </div>

                <div className="space-y-4">
                  <FormField label="Número de sesiones">
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
                  </FormField>
                  <FormField label="Observaciones">
                    <FormTextarea
                      id="observaciones"
                      rows={3}
                      value={form.observaciones || ""}
                      onChange={(e) =>
                        handleChange("observaciones", e.target.value)
                      }
                      placeholder="Información adicional (opcional)"
                    />
                  </FormField>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
            onClick={() => handleSaveDraft("evaluacionPsicopedagogica")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
