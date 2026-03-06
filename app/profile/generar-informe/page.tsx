"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { StudentData } from "@/lib/groq/types";
import { InformeCompletoForm } from "@/components/profile/InformeCompletoForm";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FriendlyErrorAlert } from "@/components/ui/friendly-error-alert";
import dynamic from "next/dynamic";
import { Loader2, Sparkles } from "lucide-react";

// Code-split: react-markdown solo se carga cuando hay un informe generado
const InformePreview = dynamic(
  () => import("@/components/profile/InformePreview").then((mod) => ({ default: mod.InformePreview })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

export default function GenerarInformePage() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<{
    message: string;
    context: "generate" | "save";
  } | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const [currentFormData, setCurrentFormData] = useState<StudentData | null>(
    null,
  );

  const handleGenerateReport = async (formData: StudentData) => {
    setIsGenerating(true);
    setErrorState(null);
    setGeneratedReport(null);
    setCurrentFormData(formData);
    setOptimisticStatus("Preparando datos para generar el informe...");
    const optimisticTimer = window.setTimeout(() => {
      setOptimisticStatus("La IA está redactando el informe. Esto puede tardar unos segundos.");
    }, 900);

    try {
      const response = await fetch("/api/groq/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.report) {
        setGeneratedReport(data.report);
        setOptimisticStatus("Informe generado. Revisa el contenido antes de guardar.");
      } else {
        setErrorState({
          message:
            data.error ||
            "No pudimos generar el informe. Revisa los datos y vuelve a intentarlo.",
          context: "generate",
        });
        setOptimisticStatus(null);
      }
    } catch (err) {
      console.error("Error al generar informe:", err);
      setErrorState({
        message:
          "No se pudo conectar con el servicio de generación. Comprueba tu conexión e inténtalo de nuevo.",
        context: "generate",
      });
      setOptimisticStatus(null);
    } finally {
      window.clearTimeout(optimisticTimer);
      setIsGenerating(false);
    }
  };

  const handleSaveInforme = async () => {
    if (!generatedReport || !currentFormData) {
      toast.error("Error de validación", {
        description: "Faltan datos necesarios para guardar el informe.",
      });
      return;
    }

    setIsSaving(true);
    setErrorState(null);
    setOptimisticStatus("Guardando informe en tu historial...");

    try {
      const response = await fetch("/api/informes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentData: currentFormData,
          generatedReport: generatedReport,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error del servidor");
      }

      if (data.success) {
        toast.success("¡Informe guardado exitosamente!", {
          description:
            "El informe se ha guardado correctamente en tu base de datos.",
        });
        setGeneratedReport(null);
        setCurrentFormData(null);
        setOptimisticStatus("Informe guardado correctamente.");
        window.setTimeout(() => setOptimisticStatus(null), 1800);
      } else {
        throw new Error(
          data.error || "Error desconocido al guardar el informe",
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error de conexión al guardar.";
      toast.error("Error al guardar", {
        description: errorMessage,
      });
      setErrorState({
        message: errorMessage,
        context: "save",
      });
      setOptimisticStatus(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-4 overflow-x-hidden bg-background px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          Generar Informe Psicopedagógico
        </h1>
        <p className="text-muted-foreground">
          Complete el formulario para generar un informe
        </p>
      </div>

      {optimisticStatus && (
        <Alert className="border-emerald-500/40 bg-emerald-500/10 text-emerald-100">
          <Sparkles className="h-4 w-4 text-emerald-300" />
          <AlertTitle>Estado de la operación</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            {(isGenerating || isSaving) && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{optimisticStatus}</span>
          </AlertDescription>
        </Alert>
      )}

      {errorState && (
        <FriendlyErrorAlert
          title="No pudimos completar la acción"
          message={errorState.message}
          actionLabel={errorState.context === "generate" ? "Reintentar generación" : "Reintentar guardado"}
          onAction={() => {
            if (errorState.context === "generate" && currentFormData) {
              void handleGenerateReport(currentFormData);
              return;
            }
            if (errorState.context === "save") {
              void handleSaveInforme();
            }
          }}
          onDismiss={() => setErrorState(null)}
        />
      )}

      {/* Mostrar formulario si no hay informe generado */}
      {!generatedReport && (
        <InformeCompletoForm
          onSubmit={handleGenerateReport}
          isLoading={isGenerating}
        />
      )}

      {/* Mostrar informe generado */}
      {generatedReport && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-2xl font-bold">Informe Generado</h2>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                className="transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => {
                  setGeneratedReport(null);
                  setCurrentFormData(null);
                  setErrorState(null);
                  setOptimisticStatus(null);
                }}
              >
                Crear Nuevo
              </Button>
              <Button
                onClick={handleSaveInforme}
                disabled={isSaving}
                size="lg"
                className="transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSaving ? "Guardando..." : "Guardar Informe"}
              </Button>
            </div>
          </div>

          <InformePreview
            report={generatedReport}
            isLoading={false}
            error={errorState?.message ?? null}
          />
        </div>
      )}
    </div>
  );
}
