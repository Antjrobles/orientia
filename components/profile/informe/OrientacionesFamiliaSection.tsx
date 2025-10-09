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
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Save,
} from "lucide-react";
import type {
  CollapsibleRecord,
  CollapsibleStatusChecker,
  CollapsibleToggleHandler,
  FileListHandler,
  FormChangeHandler,
  FormErrors,
  FormState,
  RemoveFileHandler,
  SaveDraftHandler,
  SectionStatusChecker,
} from "@/types/informe-completo";
import { IdentityFields } from "../IdentityFields";
import { FormTextarea } from "../FormTextarea";

interface OrientacionesFamiliaSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleSaveDraft: SaveDraftHandler;
  handleOrientacionesFiles: FileListHandler;
  removeOrientacionesAdjunto: RemoveFileHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  openCollapsibles: CollapsibleRecord;
  toggleCollapsible: CollapsibleToggleHandler;
}

export function OrientacionesFamiliaSection({
  form,
  errors,
  handleChange,
  handleSaveDraft,
  handleOrientacionesFiles,
  removeOrientacionesAdjunto,
  isSectionComplete,
  isCollapsibleSectionComplete,
  openCollapsibles,
  toggleCollapsible,
}: OrientacionesFamiliaSectionProps) {
  return (
    <AccordionItem
      value="orientacionesFamilia"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-violet-500 no-underline hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <div className="flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full flex-shrink-0">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
              <span className="truncate">Orientaciones a la Familia</span>
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
        <Collapsible
          open={openCollapsibles["of"]}
          onOpenChange={() => toggleCollapsible("of")}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full" />
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

        <Collapsible
          open={openCollapsibles["orientacionesFamilia"]}
          onOpenChange={() => toggleCollapsible("orientacionesFamilia")}
        >
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full" />
                <h3 className="text-sm font-semibold text-slate-700">
                  Orientaciones a la familia o a los representantes legales
                </h3>
              </div>
              {openCollapsibles["orientacionesFamilia"] ? (
                <ChevronUp className="h-4 w-4 text-violet-600 transition-transform group-hover:scale-110" />
              ) : (
                <ChevronDown className="h-4 w-4 text-violet-600 transition-transform group-hover:scale-110" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help mb-4">
                    <Info className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-600">
                      Pautas de actuación, fomento de la autonomía, coordinación
                      con el centro, etc.
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Pautas de actuación, fomento de la autonomía, coordinación
                    con el centro, etc.
                  </p>
                </TooltipContent>
              </Tooltip>
              <FormTextarea
                rows={8}
                value={form.orientacionesFamilia || ""}
                onChange={(event) =>
                  handleChange("orientacionesFamilia", event.target.value)
                }
                placeholder="Ej.: Establecer contactos periódicos con la tutora, reforzar logros, proporcionar apoyo y dedicación, fomentar expectativas positivas, coordinación con el centro, etc."
              />
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <div className="w-2 h-2 bg-violet-500 rounded-full" />
                  <h3 className="text-sm font-semibold text-slate-700">
                    Fichero externo
                  </h3>
                  <Info className="w-3 h-3 text-slate-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Adjunta aquí informes externos, dictámenes, u otros documentos
                  de interés.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="file"
              multiple
              onChange={(event) => handleOrientacionesFiles(event.target.files)}
            />
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              Número total de ficheros:{" "}
              {form.orientacionesAdjuntos?.length || 0}
            </p>
            {(form.orientacionesAdjuntos?.length || 0) > 0 && (
              <ul className="divide-y rounded-md border bg-gray-50">
                {(form.orientacionesAdjuntos || []).map((file, index) => (
                  <li
                    key={`of-${index}-${file.name}`}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span className="truncate" title={file.name}>
                      {file.name}
                    </span>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => removeOrientacionesAdjunto(index)}
                      aria-label={`Eliminar ${file.name}`}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
            onClick={() => handleSaveDraft("orientacionesFamilia")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
