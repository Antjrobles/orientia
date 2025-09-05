'use client';
import Spinner from '@/components/ui/Spinner';

export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <Spinner />
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">Generando informe...</p>
        <p className="text-xs text-gray-500 mt-1">
          Esto puede tomar unos segundos
        </p>
      </div>
    </div>
  );
}
