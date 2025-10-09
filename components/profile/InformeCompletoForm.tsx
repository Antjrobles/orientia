"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minimize2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
      <Card className="border-0 bg-gray-50 w-full max-w-full overflow-x-hidden">
        <CardHeader className="border-b border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <CardTitle className="text-lg sm:text-xl">
              Secciones del Informe
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen([])}
              className="text-gray-600"
            >
              <Minimize2 className="h-4 w-4 mr-2" /> Contraer todo
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <Label
                htmlFor="form-progress"
                className="text-sm font-medium text-slate-600"
              >
                Progreso de secciones requeridas
              </Label>
              <span className="text-sm font-semibold text-slate-800">{`${completedSectionsCount} de ${totalCompletable}`}</span>
            </div>
            <Progress
              id="form-progress"
              value={progressPercentage}
              className="w-full bg-slate-200 [&>div]:bg-blue-600"
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
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 p-4 sm:p-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 p-6"
                >
                  {isLoading ? "Generando..." : "🚀 Generar Informe"}
                </Button>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 px-4 sm:px-6 w-full sm:w-auto"
                  >
                    Limpiar Todo
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSaveDraft()}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 sm:px-6 shadow-sm w-full sm:w-auto"
                  >
                    💾 Guardar Borrador
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
