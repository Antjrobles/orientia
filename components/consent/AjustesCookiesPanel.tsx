'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useConsent } from '@/components/consent/ConsentProvider';

export default function AjustesCookiesPanel() {
  const { consent, save, rejectNonEssential, acceptAll, loaded } = useConsent();
  const [local, setLocal] = useState(consent);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Sync local UI state with global consent when it changes (e.g., after accept/reject)
    setLocal(consent);
  }, [consent]);

  if (!loaded) return null;

  const update = (k: keyof typeof local, v: boolean) => setLocal({ ...local, [k]: k === 'necessary' ? true : v });

  const onSave = () => {
    save({
      preferences: local.preferences,
      analytics: local.analytics,
      performance: local.performance,
      ads: local.ads,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="not-prose">
      <div className="grid gap-4 sm:grid-cols-2">
        {([
          { key: 'necessary', label: 'Necesarias', desc: 'Esenciales para el funcionamiento del sitio (no configurables).', disabled: true },
          { key: 'preferences', label: 'Preferencias', desc: 'Recuerdan idioma u otras opciones de interfaz.' },
          { key: 'analytics', label: 'Analítica', desc: 'Ayudan a entender el uso de la plataforma de forma agregada.' },
          { key: 'performance', label: 'Rendimiento', desc: 'Mejoran velocidad y experiencia.' },
          { key: 'ads', label: 'Publicidad (si aplica)', desc: 'Muestran contenido más relevante.' },
        ] as const).map((cat) => (
          <label key={cat.key} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300"
              checked={(local as any)[cat.key] as boolean}
              onChange={(e) => update(cat.key, e.target.checked)}
              disabled={cat.disabled}
            />
            <span>
              <span className="block text-sm font-semibold text-gray-900">{cat.label} {cat.disabled && <em className="ml-1 text-xs font-normal text-gray-500">(obligatorias)</em>}</span>
              <span className="block text-sm text-gray-600">{cat.desc}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row">
        <button onClick={rejectNonEssential} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
          Rechazar no necesarias
        </button>
        <button onClick={acceptAll} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          Aceptar todas
        </button>
        <button onClick={onSave} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200">
          Guardar preferencias
        </button>
        {saved && (
          <span className="sm:ml-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 border border-emerald-200">
            Preferencias guardadas
          </span>
        )}
        <Link href="/" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-center">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
