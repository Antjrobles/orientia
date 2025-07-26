'use client';

import { Loader2 } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">Generando informe...</p>
        <p className="text-xs text-gray-500 mt-1">
          Esto puede tomar unos segundos
        </p>
      </div>
    </div>
  );
}