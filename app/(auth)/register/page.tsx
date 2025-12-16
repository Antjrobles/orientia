"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Key,
  Sparkles,
} from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { AuthProviderButtons } from "@/components/auth/AuthProviderButtons";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthDivider } from "@/components/auth/AuthDivider";
import TurnstileWidget from "@/components/security/TurnstileWidget";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!turnstileToken) {
      setError("Por favor, completa la verificación de seguridad.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, turnstileToken }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
      } else {
        setError(data.error || "Ocurrió un error desconocido.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Crea tu cuenta"
        subtitle="Es rápido, fácil y gratuito para empezar."
      />

      {success ? (
        <Alert
          variant="default"
          className="rounded-lg bg-emerald-50 border-emerald-200"
        >
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <AlertTitle className="font-semibold text-emerald-800">
            ¡Registro Exitoso!
          </AlertTitle>
          <AlertDescription className="text-emerald-700">
            {success}
          </AlertDescription>
          <Button
            asChild
            className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Link href="/login">Ir a Iniciar Sesión</Link>
          </Button>
        </Alert>
      ) : (
        <div className="space-y-4">
          <AuthProviderButtons isLoading={isLoading} callbackUrl="/profile" />

          <AuthDivider>o regístrate con tu correo</AuthDivider>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
              >
                <User className="h-4 w-4 text-emerald-600" /> Nombre completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre y apellidos"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-10 bg-gray-50 border-gray-200"
              />
            </div>
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
                disabled={isLoading}
                className="h-10 bg-gray-50 border-gray-200"
                autoComplete="email"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
              >
                <Key className="h-4 w-4 text-emerald-600" /> Contraseña
              </Label>
              <PasswordInput
                id="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {/* CAPTCHA de seguridad */}
            <TurnstileWidget
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />

            <Button
              type="submit"
              disabled={isLoading || !turnstileToken}
              className="flex w-full h-10 items-center justify-center gap-2 bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" /> Creando cuenta...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Crear mi cuenta gratis
                </>
              )}
            </Button>
          </form>

          {error && (
            <Alert
              variant="destructive"
              className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-600 hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
        <p className="mt-4 px-4 text-xs text-gray-400">
          Al registrarte, aceptas nuestros{" "}
          <Link href="/terminos" className="underline hover:text-gray-600">
            Términos de Servicio
          </Link>{" "}
          y nuestra{" "}
          <Link href="/privacidad" className="underline hover:text-gray-600">
            Política de Privacidad
          </Link>
          .
        </p>
      </div>
    </AuthCard>
  );
}
