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
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Home,
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

interface EntornoFamiliarSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleSaveDraft: SaveDraftHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  openCollapsibles: CollapsibleRecord;
  toggleCollapsible: CollapsibleToggleHandler;
}

export function EntornoFamiliarSection({
  form,
  errors,
  handleChange,
  handleSaveDraft,
  isSectionComplete,
  isCollapsibleSectionComplete,
  openCollapsibles,
  toggleCollapsible,
}: EntornoFamiliarSectionProps) {
  return (
    <AccordionItem
      value="entornoFamiliar"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-pink-500 no-underline hover:no-underline">
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
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:flex items-center gap-2">
              <p>Contexto familiar y social del alumno</p>
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
                    Ayuda a identificar factores de protección y riesgo del
                    entorno familiar para coordinar respuestas con el centro.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4 bg-white space-y-6">
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

        <Collapsible
          open={openCollapsibles["efInfo"]}
          onOpenChange={() => toggleCollapsible("efInfo")}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Información relevante sobre el entorno familiar y el contexto
                  social
                </h3>
                {isCollapsibleSectionComplete("infoEntornoFamiliar") && (
                  <CheckCircle2 className="ml-2 h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
              {openCollapsibles["efInfo"] ? (
                <ChevronUp className="h-4 w-4 text-pink-600 transition-transform group-hover:scale-110" />
              ) : (
                <ChevronDown className="h-4 w-4 text-pink-600 transition-transform group-hover:scale-110" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help mb-4">
                    <Info className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-600">
                      Estructura familiar, pautas educativas, colaboración,
                      factores de riesgo/protección, etc.
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Estructura familiar, pautas educativas, nivel de
                    colaboración, factores de riesgo/protección, etc.
                  </p>
                </TooltipContent>
              </Tooltip>
              <FormTextarea
                rows={6}
                value={form.entornoFamiliar || ""}
                onChange={(e) =>
                  handleChange("entornoFamiliar", e.target.value)
                }
                placeholder="Ej.: Estructura familiar, pautas educativas, nivel de colaboración con el centro, factores de riesgo/protección, etc."
              />
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-pink-600 hover:bg-pink-700 text-white shadow-sm"
            onClick={() => handleSaveDraft("entornoFamiliar")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
