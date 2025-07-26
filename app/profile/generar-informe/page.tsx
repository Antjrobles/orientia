'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { StudentData } from '@/lib/groq/types';
import { GroqTestForm } from '../groq-test/components/GroqTestForm';
import { InformePreview } from '../groq-test/components/InformePreview';
import { Button } from '@/components/ui/button';

export default function GenerarInformePage() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentFormData, setCurrentFormData] = useState<StudentData | null>(null);

  const handleGenerateReport = async (formData: StudentData) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedReport(null);
    setCurrentFormData(formData);

    try {
      const response = await fetch('/api/groq/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.report) {
        setGeneratedReport(data.report);
      } else {
        setError(data.error || 'Error desconocido al generar el informe');
      }
    } catch (err) {
      console.error('Error al generar informe:', err);
      setError('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveInforme = async () => {
    console.log('🔵 Iniciando guardado...');
    console.log('🔵 generatedReport:', !!generatedReport);
    console.log('🔵 currentFormData:', currentFormData);

    if (!generatedReport || !currentFormData) {
      console.log('❌ Faltan datos para guardar');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      console.log('🔵 Enviando datos a API...');
      const response = await fetch('/api/informes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentData: currentFormData,
          generatedReport: generatedReport,
        }),
      });

      console.log('🔵 Respuesta recibida:', response.status);
      const data = await response.json();
      console.log('🔵 Datos de respuesta:', data);

      if (data.success) {
        toast.success('¡Informe guardado exitosamente!', {
          description: 'El informe se ha guardado correctamente en tu base de datos.'
        });
        // Limpiar el formulario
        setGeneratedReport(null);
        setCurrentFormData(null);
      } else {
        console.log('❌ Error en respuesta:', data.error);
        toast.error('Error al guardar', {
          description: data.error || 'Error al guardar el informe'
        });
        setError(data.error || 'Error al guardar el informe');
      }
    } catch (err) {
      console.error('❌ Error al guardar informe:', err);
      toast.error('Error de conexión', {
        description: 'Error de conexión al guardar.'
      });
      setError('Error de conexión al guardar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Generar Informe Psicopedagógico
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Crea informes profesionales con IA y guárdalos en tu base de datos
        </p>
      </div>

      {/* Mostrar formulario si no hay informe generado */}
      {!generatedReport && (
        <GroqTestForm
          onSubmit={handleGenerateReport}
          isLoading={isGenerating}
        />
      )}

      {/* Mostrar informe generado */}
      {generatedReport && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Informe Generado</h2>
            <div className="space-x-2">
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
              <Button
                onClick={handleSaveInforme}
                disabled={isSaving}
                size="lg"
              >
                {isSaving ? 'Guardando...' : 'Guardar Informe'}
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