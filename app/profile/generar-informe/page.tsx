"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { StudentData } from "@/lib/groq/types";
import { InformeCompletoForm } from "@/components/profile/InformeCompletoForm";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

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
  const [error, setError] = useState<string | null>(null);
  const [currentFormData, setCurrentFormData] = useState<StudentData | null>(
    null,
  );

  const handleGenerateReport = async (formData: StudentData) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedReport(null);
    setCurrentFormData(formData);

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
      } else {
        setError(data.error || "Error desconocido al generar el informe");
      }
    } catch (err) {
      console.error("Error al generar informe:", err);
      setError("Error de conexión. Por favor, intenta de nuevo.");
    } finally {
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
    setError(null);

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
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 space-y-4 sm:space-y-6 bg-gray-50 overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Generar Informe Psicopedagógico
        </h1>
        <p className="text-gray-600">
          Complete el formulario para generar un informe
        </p>
      </div>

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
                onClick={() => {
                  setGeneratedReport(null);
                  setCurrentFormData(null);
                  setError(null);
                }}
              >
                Crear Nuevo
              </Button>
              <Button onClick={handleSaveInforme} disabled={isSaving} size="lg">
                {isSaving ? "Guardando..." : "Guardar Informe"}
              </Button>
            </div>
          </div>

          <InformePreview
            report={generatedReport}
            isLoading={false}
            error={error}
          />
        </div>
      )}
    </div>
  );
}
