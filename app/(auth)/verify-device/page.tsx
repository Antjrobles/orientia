"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function VerifyDevicePage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("Token requerido");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/verify-device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setSuccess(data.message || "Dispositivo verificado");
        } else {
          setError(data.error || "No se pudo verificar el dispositivo");
        }
      } catch {
        setError("No se pudo conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  return (
    <AuthCard>
      <AuthHeader
        title="Verificacion de dispositivo"
        subtitle="Confirma este dispositivo para continuar."
      />

      {loading ? (
        <p className="text-sm text-gray-500">Verificando...</p>
      ) : success ? (
        <Alert className="rounded-lg bg-emerald-50 border-emerald-200">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <AlertTitle className="font-semibold text-emerald-800">
            Verificacion completada
          </AlertTitle>
          <AlertDescription className="text-emerald-700">
            {success}
          </AlertDescription>
          <Button asChild className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700">
            <Link href="/login?callbackUrl=/profile">Ir a iniciar sesion</Link>
          </Button>
        </Alert>
      ) : (
        <Alert variant="destructive" className="rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm font-medium">
            {error || "No se pudo verificar el dispositivo"}
          </AlertDescription>
        </Alert>
      )}
    </AuthCard>
  );
}
