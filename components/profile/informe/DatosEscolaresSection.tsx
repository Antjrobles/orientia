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

const INFANTIL_MEDIDAS_GENERALES = [
  "En el 2º ciclo, apoyo en grupos ordinarios mediante un segundo profesor/a dentro del aula",
  "Acción tutorial",
  "Metodologías didácticas basadas en el trabajo colaborativo en grupos heterogéneos, tutoría entre iguales y aprendizaje por proyectos",
  "Actuaciones en el proceso de tránsito entre ciclos, o etapas",
  "Actuaciones de prevención y control del absentismo",
] as const;

const INFANTIL_PROGRAMAS = [
  "Programa de refuerzo del aprendizaje",
  "Programa de profundización",
] as const;

const INFANTIL_MEDIDAS_ESPECIFICAS = [
  "El apoyo dentro del aula por profesorado especialista de PT o AL, personal complementario u otro personal externo al aula",
  "El apoyo fuera del aula por profesorado especialista de PT o AL, personal complementario u otro personal externo al aula",
  "Programas específicos para el tratamiento personalizado del alumnado neae",
] as const;

const INFANTIL_ADAPTACION_SUBOPCIONES = [
  "La atención educativa al alumnado por situaciones personales de hospitalización o de convalecencia domiciliaria",
  "Las adaptaciones de acceso a los elementos del currículo para el alumnado con neae",
  "Las adaptaciones curriculares significativas de los elementos del currículo para alumnado nee",
  "Las adaptaciones curriculares dirigidas al alumnado con altas capacidades intelectuales",
] as const;

const PRIMARIA_MEDIDAS_GENERALES = [
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
] as const;

const PRIMARIA_PROGRAMAS = [
  "Programa de refuerzo del aprendizaje",
  "Programa de profundización",
] as const;

const PRIMARIA_MEDIDAS_ESPECIFICAS = [
  "El apoyo dentro del aula por profesorado especialista de PT o AL, personal complementario u otro personal",
  "Programas específicos para el tratamiento personalizado del alumnado NEAE",
  "La atención educativa al alumnado por situaciones personales de hospitalización o de convalecencia domiciliaria",
  "Escolarización un curso por debajo del que corresponde por edad para el alumnado de incorporación tardía",
  "Atención específica para el alumnado que se incorpora tardíamente y que presenta graves carencias en la comunicación lingüística en Lengua Castellana",
  "Flexibilización de la escolarización del alumnado con altas capacidades intelectuales",
] as const;

const PRIMARIA_ADAPTACION_SUBOPCIONES = [
  "Las adaptaciones de acceso a los elementos del currículo para el alumnado NEAE",
  "Las adaptaciones curriculares significativas de los elementos del currículo para alumnado NEE",
  "Las adaptaciones curriculares dirigidas al alumnado con altas capacidades intelectuales",
] as const;

const SECUNDARIA_MEDIDAS_GENERALES = [
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
] as const;

const SECUNDARIA_PROGRAMAS = [
  "Programas de refuerzo del aprendizaje",
  "Programas de profundización",
  "Programa de Diversificación Curricular",
] as const;

const SECUNDARIA_MEDIDAS_ESPECIFICAS = [
  "Apoyo dentro del aula por PT, AL, personal complementario u otro personal",
  "Programas específicos para el tratamiento personalizado del alumnado NEAE",
  "Atención educativa al alumnado por situaciones de hospitalización o convalecencia domiciliaria",
  "Flexibilización del periodo de escolarización para el alumnado con altas capacidades",
  "Permanencia extraordinaria (solo alumnado NEE)",
  "Escolarización un curso inferior al que corresponde por edad para el alumnado de incorporación tardía con desfase en su nivel curricular de competencia de dos o más cursos",
  "Atención específica para alumnado de incorporación tardía con graves carencias en la comunicación lingüística",
] as const;

const SECUNDARIA_ADAPTACION_SUBOPCIONES = [
  "Adaptación curricular de acceso",
  "Adaptación curricular significativa",
  "Adaptación curricular para el alumnado con altas capacidades intelectuales",
] as const;

const createOptionId = (prefix: string, label: string) =>
  `${prefix}-${label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

type Palette = "emerald" | "blue" | "purple";

const paletteHighlight: Record<
  Palette,
  {
    selected: string;
    unselected: string;
    textSelected: string;
    textUnselected: string;
  }
> = {
  emerald: {
    selected:
      "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm focus-within:ring-emerald-200",
    unselected:
      "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 focus-within:ring-emerald-200",
    textSelected: "text-emerald-900 font-semibold",
    textUnselected: "text-slate-700",
  },
  blue: {
    selected:
      "border-blue-500 bg-blue-50 text-blue-900 shadow-sm focus-within:ring-blue-200",
    unselected:
      "border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 focus-within:ring-blue-200",
    textSelected: "text-blue-900 font-semibold",
    textUnselected: "text-slate-700",
  },
  purple: {
    selected:
      "border-purple-500 bg-purple-50 text-purple-900 shadow-sm focus-within:ring-purple-200",
    unselected:
      "border-slate-200 hover:border-purple-300 hover:bg-purple-50/60 focus-within:ring-purple-200",
    textSelected: "text-purple-900 font-semibold",
    textUnselected: "text-slate-700",
  },
};

const getOptionWrapperClasses = (palette: Palette, selected: boolean) =>
  selected
    ? paletteHighlight[palette].selected
    : paletteHighlight[palette].unselected;

const getOptionTextClasses = (palette: Palette, selected: boolean) =>
  selected
    ? paletteHighlight[palette].textSelected
    : paletteHighlight[palette].textUnselected;

const INFANTIL_ADAPTACION_ID = createOptionId(
  "inf",
  "Programas de adaptación curricular",
);
const PRIMARIA_ADAPTACION_ID = createOptionId(
  "prim",
  "Programas de adaptación curricular",
);
const SECUNDARIA_ADAPTACION_ID = createOptionId(
  "sec",
  "Programas de adaptación curricular",
);

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
  const showInfantilOptions =
    editingMedida === "infantil" || !form.medidaSeleccionadaInfantil;
  const showPrimariaOptions =
    editingMedida === "primaria" || !form.medidaSeleccionadaPrimaria;
  const showSecundariaOptions =
    editingMedida === "secundaria" || !form.medidaSeleccionadaSecundaria;

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
                        <div className="mt-4 border-l-4 border-emerald-400 pl-4 space-y-4">
                          {form.medidaSeleccionadaInfantil &&
                            !showInfantilOptions && (
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
                            )}

                          {showInfantilOptions && (
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
                                  value === "Programas de adaptación curricular"
                                ) {
                                  onEditingMedidaChange("infantil");
                                } else if (
                                  value.startsWith(
                                    "Programas de adaptación curricular:",
                                  )
                                ) {
                                  onEditingMedidaChange(null);
                                } else {
                                  onEditingMedidaChange(null);
                                }
                              }}
                            >
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                  Medidas Generales
                                </h4>
                                <div className="space-y-2">
                                  {INFANTIL_MEDIDAS_GENERALES.map((medida) => {
                                    const id = createOptionId("inf", medida);
                                    const isSelected =
                                      form.medidaSeleccionadaInfantil === medida;
                                    return (
                                      <label
                                        key={medida}
                                        htmlFor={id}
                                        className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("emerald", isSelected)}`}
                                      >
                                        <RadioGroupItem
                                          value={medida}
                                          id={id}
                                          className="mt-0.5"
                                        />
                                        <span
                                          className={`text-sm leading-[1.4] ${getOptionTextClasses("emerald", isSelected)}`}
                                        >
                                          {medida}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                  Programas
                                </h4>
                                <div className="space-y-2">
                                  {INFANTIL_PROGRAMAS.map((programa) => {
                                    const id = createOptionId("inf", programa);
                                    const isSelected =
                                      form.medidaSeleccionadaInfantil ===
                                      programa;
                                    return (
                                      <label
                                        key={programa}
                                        htmlFor={id}
                                        className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("emerald", isSelected)}`}
                                      >
                                        <RadioGroupItem
                                          value={programa}
                                          id={id}
                                          className="mt-0.5"
                                        />
                                        <span
                                          className={`text-sm leading-[1.4] ${getOptionTextClasses("emerald", isSelected)}`}
                                        >
                                          {programa}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-emerald-800 uppercase">
                                  Medidas Específicas
                                </h4>
                                <div className="space-y-2">
                                  {INFANTIL_MEDIDAS_ESPECIFICAS.map(
                                    (medida) => {
                                      const id = createOptionId("inf", medida);
                                      const isSelected =
                                        form.medidaSeleccionadaInfantil ===
                                        medida;
                                      return (
                                        <label
                                          key={medida}
                                          htmlFor={id}
                                          className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("emerald", isSelected)}`}
                                        >
                                          <RadioGroupItem
                                            value={medida}
                                            id={id}
                                            className="mt-0.5"
                                          />
                                          <span
                                            className={`text-sm leading-[1.4] ${getOptionTextClasses("emerald", isSelected)}`}
                                          >
                                            {medida}
                                          </span>
                                        </label>
                                      );
                                    },
                                  )}
                                </div>
                                <label
                                  htmlFor={INFANTIL_ADAPTACION_ID}
                                  className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses(
                                    "emerald",
                                    form.medidaSeleccionadaInfantil ===
                                      "Programas de adaptación curricular",
                                  )}`}
                                >
                                  <RadioGroupItem
                                    value="Programas de adaptación curricular"
                                    id={INFANTIL_ADAPTACION_ID}
                                    className="mt-0.5"
                                  />
                                  <span
                                    className={`text-sm font-medium ${getOptionTextClasses(
                                      "emerald",
                                      form.medidaSeleccionadaInfantil ===
                                        "Programas de adaptación curricular",
                                    )}`}
                                  >
                                    Programas de adaptación curricular
                                    <span className="ml-1 text-xs text-emerald-600">
                                      (Ver opciones)
                                    </span>
                                  </span>
                                </label>
                                {form.medidaSeleccionadaInfantil?.startsWith(
                                    "Programas de adaptación curricular",
                                ) && (
                                  <div className="ml-6 pl-4 border-l-2 border-emerald-300 space-y-2 mt-2">
                                    <p className="text-xs font-medium text-gray-600 mb-2">
                                      Selecciona el tipo de programa:
                                    </p>
                                    {INFANTIL_ADAPTACION_SUBOPCIONES.map(
                                      (submedida) => {
                                        const id = createOptionId(
                                          "inf-sub",
                                          submedida,
                                        );
                                        const value = `Programas de adaptación curricular: ${submedida}`;
                                        const isSelected =
                                          form.medidaSeleccionadaInfantil ===
                                          value;
                                        return (
                                          <label
                                            key={submedida}
                                            htmlFor={id}
                                            className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("emerald", isSelected)}`}
                                          >
                                            <RadioGroupItem
                                              value={value}
                                              id={id}
                                              className="mt-0.5"
                                            />
                                            <span
                                              className={`text-sm leading-[1.4] ${getOptionTextClasses("emerald", isSelected)}`}
                                            >
                                              {submedida}
                                            </span>
                                          </label>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      )}

                      {/* Educación Primaria */}
                      {form.nivelEducativoActuaciones === "primaria" && (
                        <div className="mt-4 border-l-4 border-l-blue-500 pl-4 space-y-4">
                          {form.medidaSeleccionadaPrimaria &&
                            !showPrimariaOptions && (
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
                                    onEditingMedidaChange("primaria")
                                  }
                                >
                                  Cambiar selección
                                </Button>
                              </div>
                            )}

                          {showPrimariaOptions && (
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
                                  value === "Programas de adaptación curricular"
                                ) {
                                  onEditingMedidaChange("primaria");
                                } else if (
                                  value.startsWith(
                                    "Programas de adaptación curricular:",
                                  )
                                ) {
                                  onEditingMedidaChange(null);
                                } else {
                                  onEditingMedidaChange(null);
                                }
                              }}
                            >
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-blue-800 uppercase">
                                  Medidas Generales
                                </h4>
                                <div className="space-y-2 pl-2">
                                  {PRIMARIA_MEDIDAS_GENERALES.map((medida) => {
                                    const id = createOptionId("prim", medida);
                                    const isSelected =
                                      form.medidaSeleccionadaPrimaria ===
                                      medida;
                                    return (
                                      <label
                                        key={medida}
                                        htmlFor={id}
                                        className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("blue", isSelected)}`}
                                      >
                                        <RadioGroupItem
                                          value={medida}
                                          id={id}
                                          className="mt-0.5"
                                        />
                                        <span
                                          className={`text-sm leading-[1.4] ${getOptionTextClasses("blue", isSelected)}`}
                                        >
                                          {medida}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-blue-800 uppercase">
                                  Programas
                                </h4>
                                <div className="space-y-2 pl-2">
                                  {PRIMARIA_PROGRAMAS.map((programa) => {
                                    const id = createOptionId("prim", programa);
                                    const isSelected =
                                      form.medidaSeleccionadaPrimaria ===
                                      programa;
                                    return (
                                      <label
                                        key={programa}
                                        htmlFor={id}
                                        className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("blue", isSelected)}`}
                                      >
                                        <RadioGroupItem
                                          value={programa}
                                          id={id}
                                          className="mt-0.5"
                                        />
                                        <span
                                          className={`text-sm leading-[1.4] ${getOptionTextClasses("blue", isSelected)}`}
                                        >
                                          {programa}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-blue-800 uppercase">
                                  Medidas Específicas
                                </h4>
                                <div className="space-y-2 pl-2">
                                  {PRIMARIA_MEDIDAS_ESPECIFICAS.map(
                                    (medida) => {
                                      const id = createOptionId("prim", medida);
                                      const isSelected =
                                        form.medidaSeleccionadaPrimaria ===
                                        medida;
                                      return (
                                        <label
                                          key={medida}
                                          htmlFor={id}
                                          className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("blue", isSelected)}`}
                                        >
                                          <RadioGroupItem
                                            value={medida}
                                            id={id}
                                            className="mt-0.5"
                                          />
                                          <span
                                            className={`text-sm leading-[1.4] ${getOptionTextClasses("blue", isSelected)}`}
                                          >
                                            {medida}
                                          </span>
                                        </label>
                                      );
                                    },
                                  )}
                                </div>
                                <label
                                  htmlFor={PRIMARIA_ADAPTACION_ID}
                                  className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses(
                                    "blue",
                                    form.medidaSeleccionadaPrimaria ===
                                      "Programas de adaptación curricular",
                                  )}`}
                                >
                                  <RadioGroupItem
                                    value="Programas de adaptación curricular"
                                    id={PRIMARIA_ADAPTACION_ID}
                                    className="mt-0.5"
                                  />
                                  <span
                                    className={`text-sm font-medium ${getOptionTextClasses(
                                      "blue",
                                      form.medidaSeleccionadaPrimaria ===
                                        "Programas de adaptación curricular",
                                    )}`}
                                  >
                                    Programas de adaptación curricular
                                    <span className="ml-1 text-xs text-blue-600">
                                      (Ver opciones)
                                    </span>
                                  </span>
                                </label>
                                {form.medidaSeleccionadaPrimaria?.startsWith(
                                  "Programas de adaptación curricular",
                                ) && (
                                  <div className="ml-6 pl-4 border-l-2 border-blue-300 space-y-2 mt-2">
                                    <p className="text-xs font-medium text-gray-600 mb-2">
                                      Selecciona el tipo de programa:
                                    </p>
                                {PRIMARIA_ADAPTACION_SUBOPCIONES.map(
                                      (submedida) => {
                                        const id = createOptionId(
                                          "prim-sub",
                                          submedida,
                                        );
                                        const value = `Programas de adaptación curricular: ${submedida}`;
                                        const isSelected =
                                          form.medidaSeleccionadaPrimaria ===
                                          value;
                                        return (
                                          <label
                                            key={submedida}
                                            htmlFor={id}
                                            className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("blue", isSelected)}`}
                                          >
                                            <RadioGroupItem
                                              value={value}
                                              id={id}
                                              className="mt-0.5"
                                            />
                                            <span
                                              className={`text-sm leading-[1.4] ${getOptionTextClasses("blue", isSelected)}`}
                                            >
                                              {submedida}
                                            </span>
                                          </label>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      )}

                      {/* Educación Secundaria */}
                      {form.nivelEducativoActuaciones === "secundaria" && (
                        <div className="mt-4 border-l-4 border-l-purple-500 pl-4 space-y-4">
                          {form.medidaSeleccionadaSecundaria &&
                            !showSecundariaOptions && (
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
                                    onEditingMedidaChange("secundaria")
                                  }
                                >
                                  Cambiar selección
                                </Button>
                              </div>
                            )}

                          {showSecundariaOptions && (
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
                                  value === "Programas de adaptación curricular"
                                ) {
                                  onEditingMedidaChange("secundaria");
                                } else if (
                                  value.startsWith(
                                    "Programas de adaptación curricular:",
                                  )
                                ) {
                                  onEditingMedidaChange(null);
                                } else {
                                  onEditingMedidaChange(null);
                                }
                              }}
                            >
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-purple-800 uppercase">
                                  Medidas Generales
                                </h4>
                                <div className="space-y-2 pl-2">
                                  {SECUNDARIA_MEDIDAS_GENERALES.map(
                                    (medida) => {
                                      const id = createOptionId("sec", medida);
                                      const isSelected =
                                        form.medidaSeleccionadaSecundaria ===
                                        medida;
                                      return (
                                        <label
                                          key={medida}
                                          htmlFor={id}
                                          className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("purple", isSelected)}`}
                                        >
                                          <RadioGroupItem
                                            value={medida}
                                            id={id}
                                            className="mt-0.5"
                                          />
                                          <span
                                            className={`text-sm leading-[1.4] ${getOptionTextClasses("purple", isSelected)}`}
                                          >
                                            {medida}
                                          </span>
                                        </label>
                                      );
                                    },
                                  )}
                                </div>
                              </div>

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-purple-800 uppercase">
                                  Programas
                                </h4>
                                <div className="space-y-2 pl-2">
                                  {SECUNDARIA_PROGRAMAS.map((programa) => {
                                    const id = createOptionId("sec", programa);
                                    const isSelected =
                                      form.medidaSeleccionadaSecundaria ===
                                      programa;
                                    return (
                                      <label
                                        key={programa}
                                        htmlFor={id}
                                        className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("purple", isSelected)}`}
                                      >
                                        <RadioGroupItem
                                          value={programa}
                                          id={id}
                                          className="mt-0.5"
                                        />
                                        <span
                                          className={`text-sm leading-[1.4] ${getOptionTextClasses("purple", isSelected)}`}
                                        >
                                          {programa}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-3 mt-4">
                                <h4 className="font-semibold text-sm text-purple-800 uppercase">
                                  Medidas Específicas
                                </h4>
                                <div className="space-y-2 pl-2">
                                  {SECUNDARIA_MEDIDAS_ESPECIFICAS.map(
                                    (medida) => {
                                      const id = createOptionId("sec", medida);
                                      const isSelected =
                                        form.medidaSeleccionadaSecundaria ===
                                        medida;
                                      return (
                                        <label
                                          key={medida}
                                          htmlFor={id}
                                          className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("purple", isSelected)}`}
                                        >
                                          <RadioGroupItem
                                            value={medida}
                                            id={id}
                                            className="mt-0.5"
                                          />
                                          <span
                                            className={`text-sm leading-[1.4] ${getOptionTextClasses("purple", isSelected)}`}
                                          >
                                            {medida}
                                          </span>
                                        </label>
                                      );
                                    },
                                  )}
                                </div>
                                <label
                                  htmlFor={SECUNDARIA_ADAPTACION_ID}
                                  className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses(
                                    "purple",
                                    form.medidaSeleccionadaSecundaria ===
                                      "Programas de adaptación curricular",
                                  )}`}
                                >
                                  <RadioGroupItem
                                    value="Programas de adaptación curricular"
                                    id={SECUNDARIA_ADAPTACION_ID}
                                    className="mt-0.5"
                                  />
                                  <span
                                    className={`text-sm font-medium ${getOptionTextClasses(
                                      "purple",
                                      form.medidaSeleccionadaSecundaria ===
                                        "Programas de adaptación curricular",
                                    )}`}
                                  >
                                    Programas de adaptación curricular
                                    <span className="ml-1 text-xs text-purple-600">
                                      (Ver opciones)
                                    </span>
                                  </span>
                                </label>
                                {form.medidaSeleccionadaSecundaria?.startsWith(
                                  "Programas de adaptación curricular",
                                ) && (
                                  <div className="ml-6 pl-4 border-l-2 border-purple-300 space-y-2 mt-2">
                                    <p className="text-xs font-medium text-gray-600 mb-2">
                                      Selecciona el tipo de programa:
                                    </p>
                                    {SECUNDARIA_ADAPTACION_SUBOPCIONES.map(
                                      (submedida) => {
                                        const id = createOptionId(
                                          "sec-sub",
                                          submedida,
                                        );
                                        const value = `Programas de adaptación curricular: ${submedida}`;
                                        const isSelected =
                                          form.medidaSeleccionadaSecundaria ===
                                          value;
                                        return (
                                          <label
                                            key={submedida}
                                            htmlFor={id}
                                            className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 ${getOptionWrapperClasses("purple", isSelected)}`}
                                          >
                                            <RadioGroupItem
                                              value={value}
                                              id={id}
                                              className="mt-0.5"
                                            />
                                            <span
                                              className={`text-sm leading-[1.4] ${getOptionTextClasses("purple", isSelected)}`}
                                            >
                                              {submedida}
                                            </span>
                                          </label>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                              </div>
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
