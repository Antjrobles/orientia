"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle, Key, LogIn } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { AuthProviderButtons } from "@/components/auth/AuthProviderButtons";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthDivider } from "@/components/auth/AuthDivider";
import TurnstileWidget from "@/components/security/TurnstileWidget";
import { DEVICE_COOKIE_NAME, DEVICE_STORAGE_KEY } from "@/lib/device";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? match.substring(name.length + 1) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);
  const [verificationSent, setVerificationSent] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const isDeviceVerificationError = error.includes("verificar este dispositivo");
  const autoResendAttempted = useRef(false);

  useEffect(() => {
    if (searchParams?.get("registered") === "true") {
      setJustRegistered(true);
      router.replace("/login", { scroll: false });
    }

    const errorParam = searchParams?.get("error");
    const errorDescription = searchParams?.get("error_description");
    if (errorParam) {
      const map: Record<string, string> = {
        OAuthAccountNotLinked:
          "Esa cuenta de proveedor ya está vinculada a otro email. Inicia sesión con ese proveedor.",
        AccessDenied: "Acceso denegado.",
        Configuration: "Error de configuración de autenticación.",
        DeviceVerificationRequired:
          "Hemos enviado un email para verificar este dispositivo. Revisa tu bandeja.",
        CredentialsSignin: "No se pudo iniciar sesi¢n.",
      };
      if (
        errorParam === "CredentialsSignin" &&
        errorDescription === "DeviceVerificationRequired"
      ) {
        setError(
          "Hemos enviado un email para verificar este dispositivo. Revisa tu bandeja.",
        );
        return;
      }
      setError(map[errorParam] || "No se pudo iniciar sesión.");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromStorage = window.localStorage.getItem(DEVICE_STORAGE_KEY);
    if (fromStorage) {
      setDeviceId(fromStorage);
      return;
    }
    const cookieId = getCookie(DEVICE_COOKIE_NAME);
    if (cookieId) {
      window.localStorage.setItem(DEVICE_STORAGE_KEY, cookieId);
      setDeviceId(cookieId);
      return;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(DEVICE_STORAGE_KEY, id);
    setCookie(DEVICE_COOKIE_NAME, id);
    setDeviceId(id);
  }, []);

  useEffect(() => {
    if (!isDeviceVerificationError || status !== "authenticated") return;
    const sessionEmail = session?.user?.email;
    if (!sessionEmail || !deviceId || autoResendAttempted.current) return;
    autoResendAttempted.current = true;
    if (!email) {
      setEmail(sessionEmail);
    }
    const resend = async () => {
      setResendStatus(null);
      try {
        const res = await fetch("/api/resend-device-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: sessionEmail, deviceId }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setResendStatus(
            data.message ?? "Hemos reenviado el email de verificacion.",
          );
        } else {
          setResendStatus(
            data.error ??
              "No se pudo enviar el email de verificacion. Intentalo de nuevo.",
          );
        }
      } catch {
        setResendStatus(
          "No se pudo enviar el email de verificacion. Intentalo de nuevo.",
        );
      }
    };
    resend();
  }, [
    isDeviceVerificationError,
    status,
    session?.user?.email,
    deviceId,
    email,
  ]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const errorParam = searchParams?.get("error");
    const errorDescription = searchParams?.get("error_description");
    if (
      errorParam === "DeviceVerificationRequired" ||
      (errorParam === "CredentialsSignin" &&
        errorDescription === "DeviceVerificationRequired")
    ) {
      return;
    }
    const callbackUrl = searchParams?.get("callbackUrl") || "/profile";
    router.replace(callbackUrl);
  }, [status, searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationSent(null);
    setResendStatus(null);

    if (!turnstileToken) {
      setError("Por favor, completa la verificación de seguridad.");
      setLoading(false);
      return;
    }

    const callbackUrl = searchParams?.get("callbackUrl") || "/profile";
    const result = await signIn("credentials", {
      redirect: true,
      email,
      password,
      deviceId: deviceId ?? undefined,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      try {
        const resp = await fetch("/api/auth/check-email-verified", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.exists && !data.verified) {
            setError(
              "Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.",
            );
            return;
          }
        }
      } catch {}
      setError("Email o contraseña incorrectos. Por favor, verifica tus datos.");
    }
  };

  return (
    <AuthCard>
      <AuthHeader title="Accede a tu cuenta" subtitle="Bienvenido/a de nuevo" />

      <div className="space-y-4">
        {isDeviceVerificationError && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-emerald-100 p-2">
                <CheckCircle className="h-5 w-5 text-emerald-700" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-emerald-800">
                  Verificaci¢n de dispositivo requerida
                </p>
                <p className="text-sm text-emerald-700">
                  {error} Si no lo ves, revisa Spam/Promociones.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                  disabled={loading || !email}
                  onClick={async () => {
                    setResendStatus(null);
                    try {
                      const res = await fetch("/api/resend-device-verification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, deviceId }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok) {
                        setResendStatus(
                          data.message ??
                            "Hemos reenviado el email de verificaci¢n.",
                        );
                      } else {
                        setResendStatus(
                          data.error ??
                            "No se pudo reenviar. Int‚ntalo de nuevo.",
                        );
                      }
                    } catch {
                      setResendStatus(
                        "No se pudo reenviar. Int‚ntalo de nuevo.",
                      );
                    }
                  }}
                >
                  Reenviar verificaci¢n
                </Button>
                {resendStatus && (
                  <p className="text-xs text-emerald-700">{resendStatus}</p>
                )}
                {!email && (
                  <p className="text-xs text-emerald-700">
                    Escribe tu email abajo para reenviar la verificaci¢n.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <AuthProviderButtons
          isLoading={loading}
          callbackUrl={searchParams?.get("callbackUrl") || "/profile"}
        />
        <AuthDivider>o con tu correo</AuthDivider>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          {justRegistered && (
            <Alert className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 px-3 py-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700 text-sm font-medium">
                ¡Registro completado! Ahora puedes iniciar sesión.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-gray-700 text-sm font-medium flex items-center gap-1.5 mb-1.5"
                >
                  <Mail className="w-4 h-4 text-emerald-600" /> Correo
                  electrónico
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
                  className="h-10 bg-gray-50 border-gray-200 rounded-lg px-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-gray-700 text-sm font-medium flex items-center gap-1.5 mb-1.5"
                >
                  <Key className="w-4 h-4 text-emerald-600" /> Contraseña
                </Label>
                <PasswordInput
                  id="password"
                  placeholder="Tu contraseña"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-emerald-600 hover:underline"
                  >
                    ¿Has olvidado tu contraseña?
                  </Link>
                </div>
              </div>

              <TurnstileWidget
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
              />

              <Button
                type="submit"
                disabled={loading || !turnstileToken}
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-1.5" />
                    <span>Iniciando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar sesión</span>
                  </>
                )}
              </Button>
            </form>

            {error && (
              <div className="space-y-2">
                <Alert
                  variant="destructive"
                  className="rounded-lg flex items-center gap-2 px-3 py-2"
                >
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-sm font-medium">
                    {error}
                  </AlertDescription>
                </Alert>

                {error.includes("verificar tu email") && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading || !email}
                    onClick={async () => {
                      setVerificationSent(null);
                      try {
                        const res = await fetch("/api/resend-verification", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email }),
                        });
                        if (res.ok) {
                          setVerificationSent(
                            "Hemos reenviado el email de verificación. Revisa tu bandeja.",
                          );
                        }
                      } catch {}
                    }}
                  >
                    Reenviar verificación
                  </Button>
                )}

                {verificationSent && (
                  <Alert className="rounded-lg flex items-center gap-2 px-3 py-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-700 text-sm font-medium">
                      {verificationSent}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-600 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
