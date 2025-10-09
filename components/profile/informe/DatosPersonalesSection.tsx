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
import { Badge } from "@/components/ui/badge";
import {
  Save,
  User,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
} from "lucide-react";
import { IdentityFields } from "../IdentityFields";
import type {
  CollapsibleStatusChecker,
  FileListHandler,
  FormChangeHandler,
  FormErrors,
  FormState,
  RemoveFileHandler,
  SaveDraftHandler,
  SectionStatusChecker,
} from "@/types/informe-completo";

interface DatosPersonalesSectionProps {
  form: FormState;
  errors: FormErrors;
  handleChange: FormChangeHandler;
  handleFilesChange: FileListHandler;
  removeAdjunto: RemoveFileHandler;
  handleSaveDraft: SaveDraftHandler;
  isSectionComplete: SectionStatusChecker;
  isCollapsibleSectionComplete: CollapsibleStatusChecker;
  isIdentityOpen: boolean;
  onToggleIdentity: () => void;
}

export function DatosPersonalesSection({
  form,
  errors,
  handleChange,
  handleFilesChange,
  removeAdjunto,
  handleSaveDraft,
  isSectionComplete,
  isCollapsibleSectionComplete,
  isIdentityOpen,
  onToggleIdentity,
}: DatosPersonalesSectionProps) {
  return (
    <AccordionItem
      value="datosPersonales"
      className="border-b-0 rounded-lg mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <AccordionTrigger className="w-full px-3 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors border-l-4 border-l-blue-500 no-underline hover:no-underline">
        <div className="flex items-center gap-2 sm:gap-3 text-left w-full">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-slate-800 flex items-center flex-wrap gap-2">
              <span className="truncate">Datos Personales</span>
              {isSectionComplete("datosPersonales") && (
                <Badge
                  variant="outline"
                  className="text-xs font-bold text-green-800 border-green-300 bg-green-100 whitespace-nowrap"
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
        <div className="space-y-4 sm:space-y-6">
          <Collapsible
            open={isIdentityOpen}
            onOpenChange={() => onToggleIdentity()}
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
                {isIdentityOpen ? (
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
                            Este campo se anonimiza para cumplir con la LOPD. No
                            se guardan nombres reales.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="primerTutor"
                      value={form.primerTutor || "Tutor/a 1 [Código Anónimo]"}
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
                            Este campo se anonimiza para cumplir con la LOPD. No
                            se guardan nombres reales.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="segundoTutor"
                      value={form.segundoTutor || "Tutor/a 2 [Código Anónimo]"}
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
              onValueChange={(value) => handleChange("etapaEscolar", value)}
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
                    Adjunta aquí cualquier documento relevante compartido con la
                    familia (consentimientos, informes previos, etc.).
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                multiple
                onChange={(e) => handleFilesChange(e.target.files)}
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                Número total de ficheros: {form.familiaAdjuntos?.length || 0}
              </p>
              {(form.familiaAdjuntos?.length || 0) > 0 && (
                <ul className="divide-y rounded-md border bg-gray-50">
                  {(form.familiaAdjuntos || []).map((f, idx) => (
                    <li
                      key={`df-${idx}-${f.name}`}
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

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            onClick={() => handleSaveDraft("datosPersonales")}
          >
            <Save className="h-4 w-4 mr-2" /> Guardar Sección
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
