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
import { SectionHeader } from "@/components/profile/SectionHeader";
import { SubSection } from "@/components/profile/SubSection";
import { MultiSelectWithChips } from "@/components/profile/MultiSelectWithChips";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Save,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const GENERIC_LEVEL_OPTIONS = [
  { value: "muy_bajo", label: "Muy bajo" },
  { value: "bajo", label: "Bajo" },
  { value: "medio", label: "Medio" },
  { value: "alto", label: "Alto" },
] as const;

const AUTONOMIA_OPTIONS = [
  { value: "independiente", label: "Independiente" },
  { value: "parcial", label: "Parcialmente independiente" },
  { value: "dependiente", label: "Dependiente" },
] as const;

const COMUNICACION_OPTIONS = [
  { value: "oral_fluida", label: "Oral fluida" },
  { value: "oral_limitada", label: "Oral limitada" },
  { value: "sistemas_apoyo", label: "Requiere sistemas de apoyo" },
] as const;

const DESARROLLO_SENSORIAL_VISION = [
  "Necesita iniciarse en Braille",
  "Utiliza Braille habitualmente",
  "Requiere ayudas ópticas específicas",
  "Utiliza ayudas ópticas no específicas",
  "Visión funcional sin apoyos",
] as const;

const DESARROLLO_SENSORIAL_AUDICION = [
  "Necesita iniciarse en SAC (LSE, bimodal, etc.)",
  "Utiliza SAC de forma habitual",
  "Adquisición de lenguaje oral con prótesis",
  "Requiere ayudas tecnológicas específicas",
  "Audición funcional sin apoyos adicionales",
] as const;

interface InformacionAlumnoSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleSaveDraft: SaveDraftHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  openCollapsibles: CollapsibleRecord;
  toggleCollapsible: CollapsibleToggleHandler;
}

export function InformacionAlumnoSection({
  form,
  errors,
  handleChange,
  handleSaveDraft,
  isSectionComplete,
  isCollapsibleSectionComplete,
  openCollapsibles,
  toggleCollapsible,
}: InformacionAlumnoSectionProps) {
  return (
    <AccordionItem
      value="infoAlumno"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-orange-500 no-underline hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full flex-shrink-0">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
              <span className="truncate">
                Información Relevante del Alumno/a
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
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:flex items-center gap-2">
              <p>Desarrollo, autonomía, comunicación y otros aspectos clave</p>
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
                    Describe funcionamiento global del alumno/a para vincular
                    fortalezas y barreras con medidas educativas ajustadas.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4 bg-white space-y-6">
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

        <Collapsible
          open={openCollapsibles["datosClinicos"]}
          onOpenChange={() => toggleCollapsible("datosClinicos")}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Datos clínicos y/o sociales relevantes
                </h3>
              </div>
              {openCollapsibles["datosClinicos"] ? (
                <ChevronUp className="h-4 w-4 text-orange-600 transition-transform group-hover:scale-110" />
              ) : (
                <ChevronDown className="h-4 w-4 text-orange-600 transition-transform group-hover:scale-110" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <FormTextarea
                rows={4}
                value={form.datosClinicosSociales || ""}
                onChange={(e) =>
                  handleChange("datosClinicosSociales", e.target.value)
                }
                placeholder="Antecedentes médicos, informes sociales, apoyos externos, situación familiar, etc."
              />
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Collapsible
          open={openCollapsibles["datosRelativosAl"]}
          onOpenChange={() => toggleCollapsible("datosRelativosAl")}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 space-y-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Desarrollo global
                </h3>
              </div>
              {openCollapsibles["datosRelativosAl"] ? (
                <ChevronUp className="h-4 w-4 text-orange-600 transition-transform group-hover:scale-110" />
              ) : (
                <ChevronDown className="h-4 w-4 text-orange-600 transition-transform group-hover:scale-110" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-6">
              <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-3">
                <SectionHeader title="Desarrollo cognitivo" />
                <FormTextarea
                  rows={4}
                  value={form.descDesarrolloCognitivo || ""}
                  onChange={(e) =>
                    handleChange("descDesarrolloCognitivo", e.target.value)
                  }
                  placeholder="Descripción de resultados: razonamiento, memoria, atención, CI, etc."
                />
                <Select
                  value={form.desarrolloCognitivoNivel || undefined}
                  onValueChange={(value) =>
                    handleChange("desarrolloCognitivoNivel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona nivel competencial" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENERIC_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-4">
                <SectionHeader title="Desarrollo sensorial" />
                <FormTextarea
                  rows={3}
                  value={form.descDesarrolloSensorial || ""}
                  onChange={(e) =>
                    handleChange("descDesarrolloSensorial", e.target.value)
                  }
                  placeholder="Resumen general del perfil sensorial, necesidades de acceso, apoyos disponibles..."
                />
                <SubSection title="Visión" className="mt-2 space-y-2">
                  <MultiSelectWithChips
                    value={form.visionValoraciones || []}
                    onChange={(values) =>
                      handleChange("visionValoraciones", values)
                    }
                    options={DESARROLLO_SENSORIAL_VISION.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                  />
                </SubSection>
                <SubSection title="Audición" className="mt-2 space-y-2">
                  <MultiSelectWithChips
                    value={form.audicionValoraciones || []}
                    onChange={(values) =>
                      handleChange("audicionValoraciones", values)
                    }
                    options={DESARROLLO_SENSORIAL_AUDICION.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                  />
                </SubSection>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-4">
                <SectionHeader title="Desarrollo psicomotor y movilidad" />
                <FormTextarea
                  rows={4}
                  value={form.descDesarrolloPsicomotor || ""}
                  onChange={(e) =>
                    handleChange("descDesarrolloPsicomotor", e.target.value)
                  }
                  placeholder="Coordinación, motricidad gruesa y fina, control postural, manipulación de materiales..."
                />
                <Select
                  value={form.psicomotorNivel || undefined}
                  onValueChange={(value) =>
                    handleChange("psicomotorNivel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nivel psicomotor" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENERIC_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.movilidadNivel || undefined}
                  onValueChange={(value) =>
                    handleChange("movilidadNivel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nivel de movilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENERIC_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormTextarea
                  rows={3}
                  value={form.movilidadObs || ""}
                  onChange={(e) => handleChange("movilidadObs", e.target.value)}
                  placeholder="Observaciones sobre movilidad, apoyos técnicos, desplazamientos, etc."
                />
                <Select
                  value={form.controlPosturalNivel || undefined}
                  onValueChange={(value) =>
                    handleChange("controlPosturalNivel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Control postural" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENERIC_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormTextarea
                  rows={3}
                  value={form.controlPosturalObs || ""}
                  onChange={(e) =>
                    handleChange("controlPosturalObs", e.target.value)
                  }
                  placeholder="Observaciones sobre control postural y necesidades de apoyo."
                />
                <Select
                  value={form.manipulacionMaterialesNivel || undefined}
                  onValueChange={(value) =>
                    handleChange("manipulacionMaterialesNivel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Manipulación de materiales" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENERIC_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormTextarea
                  rows={3}
                  value={form.manipulacionMaterialesObs || ""}
                  onChange={(e) =>
                    handleChange("manipulacionMaterialesObs", e.target.value)
                  }
                  placeholder="Observaciones sobre motricidad fina, uso de herramientas, escritura, etc."
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-4">
                <SectionHeader title="Autonomía personal" />
                <SubSection title="Uso del aseo" className="space-y-2">
                  <Select
                    value={form.autonomiaWC || undefined}
                    onValueChange={(value) =>
                      handleChange("autonomiaWC", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nivel de autonomía en aseo" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTONOMIA_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormTextarea
                    rows={3}
                    value={form.autonomiaWCObs || ""}
                    onChange={(e) =>
                      handleChange("autonomiaWCObs", e.target.value)
                    }
                    placeholder="Apoyos necesarios, supervisión, pautas específicas..."
                  />
                </SubSection>
                <SubSection title="Alimentación" className="space-y-2">
                  <Select
                    value={form.alimentacionNivel || undefined}
                    onValueChange={(value) =>
                      handleChange("alimentacionNivel", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nivel de autonomía en alimentación" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTONOMIA_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormTextarea
                    rows={3}
                    value={form.alimentacionObs || ""}
                    onChange={(e) =>
                      handleChange("alimentacionObs", e.target.value)
                    }
                    placeholder="Observaciones sobre autonomía en alimentación, utensilios adaptados, etc."
                  />
                </SubSection>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-3">
                <SectionHeader title="Desarrollo comunicativo y lingüístico" />
                <FormTextarea
                  rows={4}
                  value={form.descDesarrolloComunicativo || ""}
                  onChange={(e) =>
                    handleChange("descDesarrolloComunicativo", e.target.value)
                  }
                  placeholder="Lenguaje expresivo, comprensivo, comunicación funcional, apoyos necesarios..."
                />
                <Select
                  value={form.comunicacionNivel || undefined}
                  onValueChange={(value) =>
                    handleChange("comunicacionNivel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nivel de comunicación funcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMUNICACION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.lenguajeExpresivoNivel || undefined}
                  onValueChange={(value) =>
                    handleChange("lenguajeExpresivoNivel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nivel de lenguaje expresivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMUNICACION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={form.lenguajeComprensivoNivel || undefined}
                  onValueChange={(value) =>
                    handleChange("lenguajeComprensivoNivel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nivel de lenguaje comprensivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMUNICACION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-3">
                <SectionHeader title="Desarrollo social y afectivo" />
                <FormTextarea
                  rows={4}
                  value={form.descDesarrolloSocialAfectivo || ""}
                  onChange={(e) =>
                    handleChange("descDesarrolloSocialAfectivo", e.target.value)
                  }
                  placeholder="Autoconcepto, regulación emocional, relaciones con iguales y adultos, etc."
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200 space-y-3">
                <SectionHeader title="Estilo de aprendizaje y motivación" />
                <FormTextarea
                  rows={4}
                  value={form.descEstiloAprendizaje || ""}
                  onChange={(e) =>
                    handleChange("descEstiloAprendizaje", e.target.value)
                  }
                  placeholder="Descripción del estilo de aprendizaje, intereses, ritmo, apoyos eficaces..."
                />
                <FormTextarea
                  rows={4}
                  value={form.estiloAprendizajeMotivacion || ""}
                  onChange={(e) =>
                    handleChange("estiloAprendizajeMotivacion", e.target.value)
                  }
                  placeholder="Motivación intrínseca/extrínseca, reforzadores, estrategias de implicación..."
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-slate-700">
                    Información adicional
                  </h3>
                  <Info className="w-3 h-3 text-slate-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Observaciones complementarias para contextualizar la
                  intervención educativa.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <FormTextarea
            rows={4}
            value={form.infoOtros || ""}
            onChange={(e) => handleChange("infoOtros", e.target.value)}
            placeholder="Información complementaria relevante para la intervención educativa."
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
            onClick={() => handleSaveDraft("infoAlumno")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
