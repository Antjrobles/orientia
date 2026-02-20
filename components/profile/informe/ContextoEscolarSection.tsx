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
  Building2,
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

interface ContextoEscolarSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleSaveDraft: SaveDraftHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  openCollapsibles: CollapsibleRecord;
  toggleCollapsible: CollapsibleToggleHandler;
}

export function ContextoEscolarSection({
  form,
  errors,
  handleChange,
  handleSaveDraft,
  isSectionComplete,
  isCollapsibleSectionComplete,
  openCollapsibles,
  toggleCollapsible,
}: ContextoEscolarSectionProps) {
  return (
    <AccordionItem
      value="contextoEscolar"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-teal-500 no-underline hover:no-underline">
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
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:flex items-center gap-2">
              <p>Información del entorno educativo</p>
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
                    Incluye variables del centro y del aula que influyen en el
                    aprendizaje: recursos, organización y clima.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4 bg-white space-y-6">
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
                  Ratio del aula, recursos de PT/AL, clima escolar, relación con
                  el profesorado, etc.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <FormTextarea
            rows={6}
            value={form.contextoEscolar || ""}
            onChange={(e) => handleChange("contextoEscolar", e.target.value)}
            placeholder="Ej.: Llegada reciente al centro, ratio de aula, recursos de PT/AL, disponibilidad de apoyos, características del centro, etc."
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
            onClick={() => handleSaveDraft("contextoEscolar")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
