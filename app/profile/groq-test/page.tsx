'use client';

import { useState } from 'react';
import { StudentData, ApiResponse } from '@/lib/groq/types';
import { GroqTestForm } from './components/GroqTestForm';
import { InformePreview } from './components/InformePreview';

export default function GroqTestPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async (formData: StudentData) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedReport(null);

    try {
      const response = await fetch('/api/groq/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Prueba de API Groq
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Genera informes psicopedagógicos utilizando inteligencia artificial.
          Completa los datos del alumno y obtén un informe profesional en segundos.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <GroqTestForm
            onSubmit={handleGenerateReport}
            isLoading={isGenerating}
          />
        </div>

        <div className="space-y-6">
          <InformePreview
            report={generatedReport}
            isLoading={isGenerating}
            error={error}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">ℹ️ Información sobre esta prueba</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Esta es una página de prueba para validar la integración con la API de Groq</li>
          <li>• Los informes generados son ejemplos y no deben usarse para casos reales</li>
          <li>• La información introducida no se guarda permanentemente</li>
          <li>• El tiempo de generación puede variar según la carga del servidor</li>
        </ul>
      </div>
    </div>
  );
}