"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect } from "react";

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

/**
 * Componente de seguridad: CAPTCHA invisible de Cloudflare Turnstile.
 *
 * Protege formularios contra bots y scripts automatizados.
 * Es invisible para usuarios normales y solo muestra desafío si detecta comportamiento sospechoso.
 *
 * @param onSuccess - Función que se ejecuta cuando se completa el CAPTCHA exitosamente (recibe el token)
 * @param onError - Función opcional que se ejecuta si hay un error
 * @param onExpire - Función opcional que se ejecuta cuando el token expira (después de 5 minutos)
 */
export default function TurnstileWidget({
  onSuccess,
  onError,
  onExpire,
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const e2eMode = process.env.NEXT_PUBLIC_E2E_TEST_MODE === "1";
  const devBypass = process.env.NODE_ENV === "development";
  const bypassMode = e2eMode || devBypass;

  useEffect(() => {
    if (!bypassMode) return;
    onSuccess(devBypass ? "dev-bypass" : "e2e-bypass");
  }, [bypassMode, devBypass, onSuccess]);

  if (bypassMode) {
    return (
      <div className="my-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">
        Verificacion de seguridad simulada{e2eMode ? " para E2E" : " en desarrollo"}
      </div>
    );
  }

  if (!siteKey) {
    console.error(
      "NEXT_PUBLIC_TURNSTILE_SITE_KEY no está configurada en .env.local"
    );
    return null;
  }

  return (
    <div className="flex justify-center my-4">
      <Turnstile
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        options={{
          theme: "light",
          size: "normal",
        }}
      />
    </div>
  );
}
