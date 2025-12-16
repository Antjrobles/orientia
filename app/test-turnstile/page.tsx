"use client";

import { useState } from "react";
import TurnstileWidget from "@/components/security/TurnstileWidget";

export default function TestTurnstilePage() {
  const [token, setToken] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">🔍 Test de Turnstile</h1>

        {/* Diagnóstico de Variables */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h2 className="font-bold text-lg mb-2">Variables de Entorno:</h2>
          <p className="mb-1">
            <strong>NEXT_PUBLIC_TURNSTILE_SITE_KEY:</strong>{" "}
            {siteKey ? (
              <span className="text-green-600">✓ Configurada ({siteKey.substring(0, 10)}...)</span>
            ) : (
              <span className="text-red-600">✗ NO configurada</span>
            )}
          </p>
        </div>

        {/* Widget de Turnstile */}
        <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded">
          <h2 className="font-bold text-lg mb-4">Widget de Turnstile:</h2>
          <TurnstileWidget
            onSuccess={(t) => {
              setToken(t);
              console.log("✓ Token recibido:", t);
            }}
            onError={() => {
              console.error("✗ Error en Turnstile");
            }}
            onExpire={() => {
              console.log("⏱ Token expirado");
              setToken(null);
            }}
          />
        </div>

        {/* Estado del Token */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <h2 className="font-bold text-lg mb-2">Estado del Token:</h2>
          {token ? (
            <div className="text-green-600">
              <p>✓ Token recibido exitosamente</p>
              <p className="text-xs mt-2 break-all font-mono">{token}</p>
            </div>
          ) : (
            <p className="text-gray-500">Esperando verificación...</p>
          )}
        </div>
      </div>
    </div>
  );
}
