"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Minimize2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DatosPersonalesSection } from "./informe/DatosPersonalesSection";
import { DatosEscolaresSection } from "./informe/DatosEscolaresSection";
import { EvaluacionPsicopedagogicaSection } from "./informe/EvaluacionPsicopedagogicaSection";
import { InformacionAlumnoSection } from "./informe/InformacionAlumnoSection";
import { ContextoEscolarSection } from "./informe/ContextoEscolarSection";
import { EntornoFamiliarSection } from "./informe/EntornoFamiliarSection";
import { NecesidadesApoyoSection } from "./informe/NecesidadesApoyoSection";
import { PropuestaAtencionSection } from "./informe/PropuestaAtencionSection";
import { OrientacionesFamiliaSection } from "./informe/OrientacionesFamiliaSection";
import type { StudentData } from "@/lib/groq/types";
import type { SectionKey } from "@/types/informe-completo";
import { useInformeCompletoForm } from "@/hooks/useInformeCompletoForm";

interface Props {
  onSubmit: (data: StudentData) => void;
  isLoading: boolean;
}
export function InformeCompletoForm({ onSubmit, isLoading }: Props) {
  const {
    form,
    errors,
    open,
    setOpen,
    openCollapsibles,
    toggleCollapsible,
    historiaEscolarOpen,
    setHistoriaEscolarOpen,
    editingMedida,
    setEditingMedida,
    necesidadTemp,
    setNecesidadTemp,
    recursoMaterialTemp,
    setRecursoMaterialTemp,
    profEspecialistaTemp,
    setProfEspecialistaTemp,
    personalNoDocenteTemp,
    setPersonalNoDocenteTemp,
    handleChange,
    handleFilesChange,
    handleOrientacionesFiles,
    removeAdjunto,
    removeOrientacionesAdjunto,
    handleSaveDraft,
    handleClear,
    handleSubmit,
    handleNivelActuacionesChange,
    isSectionComplete,
    isCollapsibleSectionComplete,
    completedSectionsCount,
    totalCompletable,
    progressPercentage,
  } = useInformeCompletoForm({ onSubmit });

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="w-full max-w-full overflow-x-hidden border border-border bg-card">
        <CardHeader className="border-b border-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <CardTitle className="text-lg sm:text-xl">
              Secciones del Informe
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen([])}
              className="text-muted-foreground"
            >
              <Minimize2 className="h-4 w-4 mr-2" /> Contraer todo
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="form-progress"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Progreso de secciones requeridas
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                      aria-label="Ayuda sobre progreso de secciones"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Las secciones se marcan como completadas cuando tienen los campos
                    mínimos necesarios para generar el informe.
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-foreground">{`${completedSectionsCount} de ${totalCompletable}`}</span>
            </div>
            <Progress
              id="form-progress"
              value={progressPercentage}
              className="w-full bg-muted [&>div]:bg-primary"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-2">
          <form onSubmit={handleSubmit} className="space-y-1">
            <Accordion
              type="multiple"
              value={open}
              onValueChange={(v) => setOpen(v as SectionKey[])}
              className="w-full"
            >
              {/* Datos personales */}
              <DatosPersonalesSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleFilesChange={handleFilesChange}
                removeAdjunto={removeAdjunto}
                handleSaveDraft={handleSaveDraft}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                isIdentityOpen={openCollapsibles["dp"]}
                onToggleIdentity={() => toggleCollapsible("dp")}
              />

              {/* Datos escolares */}
              <DatosEscolaresSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSaveDraft={handleSaveDraft}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                openCollapsibles={openCollapsibles}
                toggleCollapsible={toggleCollapsible}
                historiaEscolarOpen={historiaEscolarOpen}
                onHistoriaEscolarChange={setHistoriaEscolarOpen}
                handleNivelActuacionesChange={handleNivelActuacionesChange}
                editingMedida={editingMedida}
                onEditingMedidaChange={setEditingMedida}
              />

              {/* Evaluación psicopedagógica */}
              <EvaluacionPsicopedagogicaSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSaveDraft={handleSaveDraft}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                openCollapsibles={openCollapsibles}
                toggleCollapsible={toggleCollapsible}
              />

              {/* Información relevante del alumno/a */}
              <InformacionAlumnoSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSaveDraft={handleSaveDraft}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                openCollapsibles={openCollapsibles}
                toggleCollapsible={toggleCollapsible}
              />

              <ContextoEscolarSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSaveDraft={handleSaveDraft}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                openCollapsibles={openCollapsibles}
                toggleCollapsible={toggleCollapsible}
              />

              <EntornoFamiliarSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSaveDraft={handleSaveDraft}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                openCollapsibles={openCollapsibles}
                toggleCollapsible={toggleCollapsible}
              />

              <NecesidadesApoyoSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSaveDraft={handleSaveDraft}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                openCollapsibles={openCollapsibles}
                toggleCollapsible={toggleCollapsible}
                necesidadTemp={necesidadTemp}
                setNecesidadTemp={setNecesidadTemp}
              />

              <PropuestaAtencionSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSaveDraft={handleSaveDraft}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                openCollapsibles={openCollapsibles}
                toggleCollapsible={toggleCollapsible}
                recursoMaterialTemp={recursoMaterialTemp}
                setRecursoMaterialTemp={setRecursoMaterialTemp}
                profEspecialistaTemp={profEspecialistaTemp}
                setProfEspecialistaTemp={setProfEspecialistaTemp}
                personalNoDocenteTemp={personalNoDocenteTemp}
                setPersonalNoDocenteTemp={setPersonalNoDocenteTemp}
              />

              <OrientacionesFamiliaSection
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSaveDraft={handleSaveDraft}
                handleOrientacionesFiles={handleOrientacionesFiles}
                removeOrientacionesAdjunto={removeOrientacionesAdjunto}
                isSectionComplete={isSectionComplete}
                isCollapsibleSectionComplete={isCollapsibleSectionComplete}
                openCollapsibles={openCollapsibles}
                toggleCollapsible={toggleCollapsible}
              />
            </Accordion>
            <div className="mt-6 border-t border-border bg-gradient-to-r from-muted/60 to-muted/30 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-green-600 p-6 hover:bg-green-700"
                    >
                      {isLoading ? "Generando..." : "🚀 Generar Informe"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Genera el informe completo con la información cargada.
                  </TooltipContent>
                </Tooltip>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClear}
                        disabled={isLoading}
                        className="w-full border-border px-4 text-muted-foreground hover:bg-accent hover:text-foreground sm:w-auto sm:px-6"
                      >
                        Limpiar Todo
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Borra todos los campos del formulario actual.
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => handleSaveDraft()}
                        className="w-full bg-slate-700 px-4 text-white shadow-sm hover:bg-slate-600 sm:w-auto sm:px-6"
                      >
                        💾 Guardar Borrador
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Guarda tu progreso sin generar todavía el informe final.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
