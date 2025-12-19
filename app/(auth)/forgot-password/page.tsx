"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TurnstileWidget from "@/components/security/TurnstileWidget";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!turnstileToken) {
      setError("Por favor, completa la verificación de seguridad.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(
          data.message ??
            "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.",
        );
      } else {
        setError(data.error ?? "No se pudo procesar la solicitud.");
      }
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Recupera tu contraseña"
        subtitle="Te enviaremos un enlace para crear una nueva contraseña."
      />

      {success ? (
        <Alert className="rounded-lg bg-emerald-50 border-emerald-200">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <AlertTitle className="font-semibold text-emerald-800">
            Solicitud enviada
          </AlertTitle>
          <AlertDescription className="text-emerald-700">
            {success}
          </AlertDescription>
          <Button asChild className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700">
            <Link href="/login">Volver a iniciar sesión</Link>
          </Button>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <Mail className="h-4 w-4 text-emerald-600" /> Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@institucion.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              className="h-10 bg-gray-50 border-gray-200"
            />
          </div>

          <TurnstileWidget
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken(null)}
            onExpire={() => setTurnstileToken(null)}
          />

          <Button
            type="submit"
            disabled={loading || !turnstileToken}
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar enlace
          </Button>

          {error && (
            <Alert variant="destructive" className="flex items-center gap-2 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <p className="text-center text-sm text-gray-500">
            ¿Ya la recuerdas?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}

