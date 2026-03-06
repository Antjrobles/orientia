"use client";

import { useState, type DragEvent } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GripVertical, Info, Keyboard, Minimize2, RotateCcw } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useInformeCompletoForm } from "@/hooks/useInformeCompletoForm";

interface Props {
  onSubmit: (data: StudentData) => void;
  isLoading: boolean;
}

const sectionLabels: Record<SectionKey, string> = {
  datosPersonales: "Datos Personales",
  datosEscolares: "Datos Escolares",
  evaluacionPsicopedagogica: "Evaluación Psicopedagógica",
  infoAlumno: "Información del Alumno/a",
  contextoEscolar: "Contexto Escolar",
  entornoFamiliar: "Entorno Familiar",
  necesidadesApoyo: "Necesidades de Apoyo",
  propuestaAtencion: "Propuesta de Atención",
  orientacionesFamilia: "Orientaciones a la Familia",
};

const shortcuts = [
  { keys: "Ctrl/Cmd + S", description: "Guardar borrador" },
  { keys: "Ctrl/Cmd + Enter", description: "Generar informe" },
  { keys: "Alt + Shift + 1..9", description: "Abrir/cerrar sección" },
  { keys: "Alt + R", description: "Restablecer orden de secciones" },
  { keys: "Ctrl/Cmd + Shift + Backspace", description: "Limpiar formulario" },
] as const;

export function InformeCompletoForm({ onSubmit, isLoading }: Props) {
  const {
    form,
    errors,
    open,
    setOpen,
    sectionOrder,
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
    moveSection,
    resetSectionOrder,
    isSectionComplete,
    isCollapsibleSectionComplete,
    completedSectionsCount,
    totalCompletable,
    progressPercentage,
  } = useInformeCompletoForm({ onSubmit });
  const [draggedSection, setDraggedSection] = useState<SectionKey | null>(null);
  const [dragOverSection, setDragOverSection] = useState<SectionKey | null>(null);

  const handleDragStart = (
    section: SectionKey,
    event: DragEvent<HTMLButtonElement>,
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", section);
    setDraggedSection(section);
  };

  const handleDropOnSection = (targetSection: SectionKey) => {
    if (!draggedSection || draggedSection === targetSection) {
      setDragOverSection(null);
      return;
    }
    const fromIndex = sectionOrder.indexOf(draggedSection);
    const toIndex = sectionOrder.indexOf(targetSection);
    moveSection(fromIndex, toIndex);
    setDraggedSection(null);
    setDragOverSection(null);
  };

  const renderSection = (sectionKey: SectionKey) => {
    switch (sectionKey) {
      case "datosPersonales":
        return (
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
        );
      case "datosEscolares":
        return (
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
        );
      case "evaluacionPsicopedagogica":
        return (
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
        );
      case "infoAlumno":
        return (
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
        );
      case "contextoEscolar":
        return (
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
        );
      case "entornoFamiliar":
        return (
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
        );
      case "necesidadesApoyo":
        return (
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
        );
      case "propuestaAtencion":
        return (
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
        );
      case "orientacionesFamilia":
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="w-full max-w-full overflow-x-hidden border border-border bg-card">
        <CardHeader className="border-b border-border p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">
              Secciones del Informe
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="justify-start text-muted-foreground sm:justify-center"
                  >
                    <Keyboard className="mr-2 h-4 w-4" /> Atajos
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[340px] p-3">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Atajos del formulario
                    </p>
                    <div className="space-y-1.5">
                      {shortcuts.map((shortcut) => (
                        <div
                          key={shortcut.keys}
                          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] items-center gap-2 rounded-md border border-border/70 bg-muted/40 px-2.5 py-2"
                        >
                          <kbd className="rounded border border-border bg-background px-1.5 py-1 text-[11px] font-semibold text-foreground">
                            {shortcut.keys}
                          </kbd>
                          <span className="text-xs text-muted-foreground">
                            {shortcut.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetSectionOrder}
                className="text-muted-foreground"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Restablecer orden
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen([])}
                className="text-muted-foreground"
              >
                <Minimize2 className="mr-2 h-4 w-4" /> Contraer todo
              </Button>
            </div>
          </div>
          <div className="mt-2 rounded-md border border-dashed border-border/70 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Reordenación: arrastra el control de cada sección para adaptar el flujo
            de trabajo.
          </div>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
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
                    Las secciones se marcan como completadas cuando tienen los
                    campos mínimos necesarios para generar el informe.
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
              {sectionOrder.map((sectionKey) => (
                <div
                  key={sectionKey}
                  className={cn(
                    "rounded-lg transition-colors",
                    dragOverSection === sectionKey &&
                      draggedSection !== sectionKey &&
                      "bg-primary/5 ring-2 ring-primary/25",
                  )}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                  }}
                  onDragEnter={() => setDragOverSection(sectionKey)}
                  onDragLeave={() => setDragOverSection(null)}
                  onDrop={() => handleDropOnSection(sectionKey)}
                >
                  <div className="flex items-center justify-end px-4 pt-2 sm:px-6">
                    <button
                      type="button"
                      draggable
                      onDragStart={(event) => handleDragStart(sectionKey, event)}
                      onDragEnd={() => {
                        setDraggedSection(null);
                        setDragOverSection(null);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label={`Arrastrar sección ${sectionLabels[sectionKey]}`}
                      title={`Arrastrar sección ${sectionLabels[sectionKey]}`}
                    >
                      <GripVertical className="h-3 w-3" />
                      Mover sección
                    </button>
                  </div>
                  {renderSection(sectionKey)}
                </div>
              ))}
            </Accordion>
            <div className="mt-6 border-t border-border bg-gradient-to-r from-muted/60 to-muted/30 p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                <div className="flex flex-col items-center gap-3 sm:flex-row">
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
