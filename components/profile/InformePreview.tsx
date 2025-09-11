'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LoadingIndicatorProps {
  message?: string;
}

function LoadingIndicator({ message = 'Generando informe...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">{message}</p>
        <p className="text-xs text-gray-500 mt-1">
          Esto puede tomar unos segundos
        </p>
      </div>
    </div>
  );
}

interface InformePreviewProps {
  report: string | null;
  isLoading: boolean;
  error: string | null;
}

export function InformePreview({ report, isLoading, error }: InformePreviewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!report) return;

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Informe Generado</CardTitle>
          {report && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingIndicator />}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {report && !isLoading && (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-4 text-gray-900">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 mt-6">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-medium mb-2 text-gray-700 mt-4">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-3 text-gray-600 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-600">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-800">{children}</strong>
                ),
              }}
            >
              {report}
            </ReactMarkdown>
          </div>
        )}

        {!report && !isLoading && !error && (
          <div className="text-center py-8 text-gray-500">
            <p>El informe generado aparecerá aquí</p>
            <p className="text-sm mt-2">Completa el formulario y haz clic en "Generar Informe"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}