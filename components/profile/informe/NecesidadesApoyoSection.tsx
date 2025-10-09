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
import { MultiSelectWithChips } from "@/components/profile/MultiSelectWithChips";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  Info,
  Save,
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

const NECESIDAD_OPTIONS = [
  "discapacidad_intelectual_leve",
  "trastorno_espectro_autista",
  "trastorno_lenguaje",
  "dificultades_aprendizaje",
  "altas_capacidades",
  "otras_necesidades",
] as const;

const SINDROME_OPTIONS = [
  { value: "ninguno", label: "Ninguno" },
  { value: "down", label: "Síndrome de Down" },
  { value: "asperger", label: "Síndrome de Asperger" },
  { value: "x_fragil", label: "X Frágil" },
  { value: "otro", label: "Otro" },
] as const;

const PROGRAMAS_NEAE = [
  "Medidas curriculares significativas",
  "Medidas de acceso (material y comunicación)",
  "Apoyo dentro del aula ordinaria",
  "Refuerzo en pequeño grupo",
  "Intervención específica externa",
] as const;

interface NecesidadesApoyoSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleSaveDraft: SaveDraftHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  openCollapsibles: CollapsibleRecord;
  toggleCollapsible: CollapsibleToggleHandler;
  necesidadTemp: string;
  setNecesidadTemp: (value: string) => void;
}

export function NecesidadesApoyoSection({
  form,
  errors,
  handleChange,
  handleSaveDraft,
  isSectionComplete,
  isCollapsibleSectionComplete,
  openCollapsibles,
  toggleCollapsible,
  necesidadTemp,
  setNecesidadTemp,
}: NecesidadesApoyoSectionProps) {
  void errors;

  const handleAddNecesidad = () => {
    if (!necesidadTemp) return;
    if (form.necesidadesListado?.includes(necesidadTemp)) return;
    handleChange("necesidadesListado", [
      ...(form.necesidadesListado || []),
      necesidadTemp,
    ]);
    setNecesidadTemp("");
  };

  const handleRemoveNecesidad = (index: number) => {
    handleChange(
      "necesidadesListado",
      (form.necesidadesListado || []).filter((_, i) => i !== index),
    );
  };

  return (
    <AccordionItem
      value="necesidadesApoyo"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-indigo-500 no-underline hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full flex-shrink-0">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
              <span className="truncate">Necesidades de Apoyo Educativo</span>
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

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-slate-700">
              Determinación de las necesidades específicas de apoyo educativo
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
                    Necesidades Específicas de Apoyo Educativo reconocidas por
                    la normativa educativa.
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <RadioGroup
              className="flex gap-6"
              value={form.presentaNEAE || ""}
              onValueChange={(value) => handleChange("presentaNEAE", value)}
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
            La determinación de NEAE identifica necesidades de apoyo educativo
            adicionales, sin constituir un diagnóstico clínico.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="necesidad">Necesidad específica</Label>
              <Select
                value={necesidadTemp || undefined}
                onValueChange={(value) => setNecesidadTemp(value)}
              >
                <SelectTrigger id="necesidad">
                  <SelectValue placeholder="Selecciona una necesidad" />
                </SelectTrigger>
                <SelectContent>
                  {NECESIDAD_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddNecesidad}
            >
              Añadir
            </Button>
          </div>
          {(form.necesidadesListado || []).length > 0 && (
            <ul className="divide-y rounded-md border bg-white">
              {(form.necesidadesListado || []).map((item, index) => (
                <li
                  key={item + index}
                  className="flex items-center justify-between px-3 py-2 text-sm"
                >
                  <span className="truncate">{item.replace(/_/g, " ")}</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => handleRemoveNecesidad(index)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-2">
            <Label htmlFor="sindromeEspecifico">Síndrome específico</Label>
            <Select
              value={form.sindromeEspecifico || undefined}
              onValueChange={(value) =>
                handleChange("sindromeEspecifico", value)
              }
            >
              <SelectTrigger id="sindromeEspecifico">
                <SelectValue placeholder="Selecciona si procede" />
              </SelectTrigger>
              <SelectContent>
                {SINDROME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="programasNeae">Programas y apoyos aplicados</Label>
            <MultiSelectWithChips
              value={form.medidasEducativasGenerales || []}
              onChange={(values) =>
                handleChange("medidasEducativasGenerales", values)
              }
              options={PROGRAMAS_NEAE.map((option) => ({
                value: option,
                label: option,
              }))}
            />
          </div>
        </div>

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
                  Resume la necesidad identificada, su relación con el NCC y los
                  apoyos recomendados.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <FormTextarea
            rows={4}
            value={form.observacionesNEAE || ""}
            onChange={(e) => handleChange("observacionesNEAE", e.target.value)}
            placeholder="Resumen de la necesidad, nivel curricular, apoyos propuestos, responsables de seguimiento, etc."
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            onClick={() => handleSaveDraft("necesidadesApoyo")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
