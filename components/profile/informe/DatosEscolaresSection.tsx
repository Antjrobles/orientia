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
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "../FormTextarea";
import { IdentityFields } from "../IdentityFields";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Info,
  Save,
  GraduationCap,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
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

type NivelEducativo = "infantil" | "primaria" | "secundaria" | null;

interface DatosEscolaresSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleSaveDraft: SaveDraftHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  openCollapsibles: CollapsibleRecord;
  toggleCollapsible: CollapsibleToggleHandler;
  historiaEscolarOpen: boolean;
  onHistoriaEscolarChange: (open: boolean) => void;
  handleNivelActuacionesChange: (
    value: "infantil" | "primaria" | "secundaria" | undefined,
  ) => void;
  editingMedida: NivelEducativo;
  onEditingMedidaChange: (value: NivelEducativo) => void;
}

export function DatosEscolaresSection({
  form,
  errors,
  handleChange,
  handleSaveDraft,
  isSectionComplete,
  isCollapsibleSectionComplete,
  openCollapsibles,
  toggleCollapsible,
  historiaEscolarOpen,
  onHistoriaEscolarChange,
  handleNivelActuacionesChange,
  editingMedida,
  onEditingMedidaChange,
}: DatosEscolaresSectionProps) {
  return (
    <AccordionItem
      value="datosEscolares"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-emerald-500 no-underline hover:no-underline">
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
            onOpenChange={onHistoriaEscolarChange}
          >
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
              <CollapsibleTrigger className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-slate-700">
                    Historia escolar
                  </h3>
                  {isCollapsibleSectionComplete("historiaEscolar") && (
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
                    <FormTextarea
                      id="esc-escolarizacionPrevia"
                      rows={4}
                      value={form.escolarizacionPrevia || ""}
                      onChange={(e) =>
                        handleChange("escolarizacionPrevia", e.target.value)
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
                        Actuaciones, medidas y programas de atención a la
                        diversidad desarrollados
                      </Label>
                      {form.nivelEducativoActuaciones && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-red-600 hover:bg-red-100 hover:text-red-700"
                          onClick={() =>
                            handleNivelActuacionesChange(undefined)
                          }
                        >
                          Limpiar selección
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Select
                        value={form.nivelEducativoActuaciones || undefined}
                        onValueChange={(
                          value: "infantil" | "primaria" | "secundaria",
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

                      {/* Educación Infantil */}
                      {form.nivelEducativoActuaciones === "infantil" && (
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
                                  onEditingMedidaChange("infantil")
                                }
                              >
                                Cambiar selección
                              </Button>
                            </div>
                          ) : (
                            <RadioGroup
                              value={
                                form.medidaSeleccionadaInfantil || undefined
                              }
                              onValueChange={(value) => {
                                handleChange(
                                  "medidaSeleccionadaInfantil",
                                  value,
                                );
                                if (
                                  !value.startsWith(
                                    "Programas de adaptación curricular",
                                  )
                                ) {
                                  onEditingMedidaChange(null);
                                }
                              }}
                            >
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

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                  Programas específicos
                                </h4>
                                <div className="space-y-2">
                                  {[
                                    "Programas específicos de refuerzo y apoyo",
                                    "Programas de adaptación curricular",
                                    "Programas de ayuda a la integración",
                                  ].map((medida) => (
                                    <div
                                      key={medida}
                                      className="flex items-start gap-2"
                                    >
                                      <RadioGroupItem
                                        value={medida}
                                        id={`inf-prog-${medida}`}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`inf-prog-${medida}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                      >
                                        {medida}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {form.medidaSeleccionadaInfantil?.startsWith(
                                "Programas de adaptación curricular",
                              ) && (
                                <div className="ml-6 pl-4 border-l-2 border-emerald-300 space-y-2 mt-2">
                                  <p className="text-xs font-medium text-gray-600 mb-2">
                                    Selecciona el tipo de programa:
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
                                        id={`inf-sub-${submedida}`}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`inf-sub-${submedida}`}
                                        className="text-sm text-gray-600 cursor-pointer"
                                      >
                                        {submedida}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </RadioGroup>
                          )}
                        </div>
                      )}

                      {/* Educación Primaria */}
                      {form.nivelEducativoActuaciones === "primaria" && (
                        <div className="mt-4 border-l-4 border-emerald-400 pl-4">
                          {form.medidaSeleccionadaPrimaria &&
                          editingMedida !== "primaria" ? (
                            <div className="p-4 bg-emerald-50 rounded-md border border-emerald-200">
                              <p className="text-sm font-semibold text-emerald-800 mb-2">
                                Medida seleccionada:
                              </p>
                              <p className="text-sm text-gray-700">
                                {form.medidaSeleccionadaPrimaria}
                              </p>
                              <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto mt-3 text-sm text-emerald-700"
                                onClick={() =>
                                  onEditingMedidaChange("primaria")
                                }
                              >
                                Cambiar selección
                              </Button>
                            </div>
                          ) : (
                            <RadioGroup
                              value={
                                form.medidaSeleccionadaPrimaria || undefined
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
                                  onEditingMedidaChange(null);
                                }
                              }}
                            >
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                  Medidas Generales
                                </h4>
                                <div className="space-y-2">
                                  {[
                                    "Desdoblamiento de grupos en áreas instrumentales",
                                    "Refuerzo pedagógico dentro del grupo ordinario",
                                    "Apoyo educativo fuera del aula ordinaria",
                                    "Adaptaciones curriculares no significativas",
                                  ].map((medida) => (
                                    <div
                                      key={medida}
                                      className="flex items-start gap-2"
                                    >
                                      <RadioGroupItem
                                        value={medida}
                                        id={`pri-${medida}`}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`pri-${medida}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                      >
                                        {medida}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                  Programas específicos
                                </h4>
                                <div className="space-y-2">
                                  {[
                                    "Programas de refuerzo y recuperación de aprendizajes no adquiridos",
                                    "Programas de apoyo lingüístico",
                                    "Programas de profundización y enriquecimiento curricular",
                                    "Programas de adaptación curricular",
                                  ].map((medida) => (
                                    <div
                                      key={medida}
                                      className="flex items-start gap-2"
                                    >
                                      <RadioGroupItem
                                        value={medida}
                                        id={`pri-prog-${medida}`}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`pri-prog-${medida}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                      >
                                        {medida}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {form.medidaSeleccionadaPrimaria?.startsWith(
                                "Programas de adaptación curricular",
                              ) && (
                                <div className="ml-6 pl-4 border-l-2 border-emerald-300 space-y-2 mt-2">
                                  <p className="text-xs font-medium text-gray-600 mb-2">
                                    Selecciona el tipo de programa:
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
                                        id={`pri-sub-${submedida}`}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`pri-sub-${submedida}`}
                                        className="text-sm text-gray-600 cursor-pointer"
                                      >
                                        {submedida}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </RadioGroup>
                          )}
                        </div>
                      )}

                      {/* Educación Secundaria */}
                      {form.nivelEducativoActuaciones === "secundaria" && (
                        <div className="mt-4 border-l-4 border-emerald-400 pl-4">
                          {form.medidaSeleccionadaSecundaria &&
                          editingMedida !== "secundaria" ? (
                            <div className="p-4 bg-emerald-50 rounded-md border border-emerald-200">
                              <p className="text-sm font-semibold text-emerald-800 mb-2">
                                Medida seleccionada:
                              </p>
                              <p className="text-sm text-gray-700">
                                {form.medidaSeleccionadaSecundaria}
                              </p>
                              <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto mt-3 text-sm text-emerald-700"
                                onClick={() =>
                                  onEditingMedidaChange("secundaria")
                                }
                              >
                                Cambiar selección
                              </Button>
                            </div>
                          ) : (
                            <RadioGroup
                              value={
                                form.medidaSeleccionadaSecundaria || undefined
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
                                  onEditingMedidaChange(null);
                                }
                              }}
                            >
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                  Medidas Generales
                                </h4>
                                <div className="space-y-2">
                                  {[
                                    "Adaptaciones de los elementos prescriptivos del currículo",
                                    "Refuerzos educativos específicos",
                                    "Apoyo en materias instrumentales básicas",
                                    "Programas de refuerzo para la mejora del aprendizaje y el rendimiento",
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

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                  Programas específicos
                                </h4>
                                <div className="space-y-2">
                                  {[
                                    "Programas de mejora del aprendizaje y del rendimiento",
                                    "Programas de diversificación curricular",
                                    "Programas de adaptación curricular",
                                    "Programas de refuerzo para la titulación",
                                  ].map((medida) => (
                                    <div
                                      key={medida}
                                      className="flex items-start gap-2"
                                    >
                                      <RadioGroupItem
                                        value={medida}
                                        id={`sec-prog-${medida}`}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`sec-prog-${medida}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                      >
                                        {medida}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {form.medidaSeleccionadaSecundaria?.startsWith(
                                "Programas de adaptación curricular",
                              ) && (
                                <div className="ml-6 pl-4 border-l-2 border-purple-300 space-y-2 mt-2">
                                  <p className="text-xs font-medium text-gray-600 mb-2">
                                    Selecciona el tipo de programa:
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
                            </RadioGroup>
                          )}
                        </div>
                      )}

                      {/* Otras actuaciones */}
                      <div className="space-y-3 mt-6">
                        <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                          Otras Actuaciones
                        </h4>
                        <div className="space-y-2">
                          <FormTextarea
                            id="otrasOrientaciones"
                            rows={4}
                            value={form.otrasOrientaciones || ""}
                            onChange={(e) =>
                              handleChange("otrasOrientaciones", e.target.value)
                            }
                            placeholder="Especifica otras medidas, programas u orientaciones adicionales..."
                            className="w-full"
                          />
                        </div>
                      </div>
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
            onClick={() => handleSaveDraft("datosEscolares")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
