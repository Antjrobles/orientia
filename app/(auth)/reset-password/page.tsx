"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, Key, Sparkles } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Spinner from "@/components/ui/Spinner";

const passwordRequirements = [
  { regex: /.{8,}/ },
  { regex: /[A-Z]/ },
  { regex: /[a-z]/ },
  { regex: /[0-9]/ },
  { regex: /[^A-Za-z0-9]/ },
];

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(
    () => searchParams?.get("token") || "",
    [searchParams],
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = passwordRequirements.every((req) =>
    req.regex.test(password),
  );

  useEffect(() => {
    setError(null);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Falta el token. Solicita un enlace nuevo.");
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccess(
          data.message ??
            "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
        );
      } else {
        setError(data.error ?? "No se pudo restablecer la contraseña.");
      }
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Crea una nueva contraseña"
        subtitle="Elige una contraseña segura para tu cuenta."
      />

      {!token ? (
        <Alert variant="destructive" className="rounded-lg flex items-center gap-2 px-3 py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm font-medium">
            Este enlace no es válido. Solicita uno nuevo desde{" "}
            <Link href="/forgot-password" className="underline">
              recuperar contraseña
            </Link>
            .
          </AlertDescription>
        </Alert>
      ) : success ? (
        <Alert className="rounded-lg bg-emerald-50 border-emerald-200">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <AlertTitle className="font-semibold text-emerald-800">
            Contraseña actualizada
          </AlertTitle>
          <AlertDescription className="text-emerald-700">
            {success}
          </AlertDescription>
          <Button asChild className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700">
            <Link href="/login?callbackUrl=/profile">Ir a iniciar sesión</Link>
          </Button>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="password"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <Key className="h-4 w-4 text-emerald-600" /> Nueva contraseña
            </Label>
            <PasswordInput
              id="password"
              placeholder="Mínimo 8 caracteres, mayúscula, número y símbolo"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-gray-500">
              Debe contener: mínimo 8 caracteres, una mayúscula, una minúscula,
              un número y un símbolo.
            </p>
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <Key className="h-4 w-4 text-emerald-600" /> Confirmar contraseña
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Repite la contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex w-full h-10 items-center justify-center gap-2 bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" /> Guardando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Guardar nueva contraseña
              </>
            )}
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
            <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
              Volver a iniciar sesión
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
