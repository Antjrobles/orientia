'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, CornerDownRight, Timer } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [redirectSeconds, setRedirectSeconds] = useState<number | null>(null);
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState(true);

  const track = (event: string, props?: Record<string, any>) => {
    try {
      (window as any)?.plausible?.(event, { props });
      (window as any)?.gtag?.('event', event, props ?? {});
    } catch {}
  };

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('¡Email verificado correctamente!');
          setRedirectSeconds(3);
          track('verify_email_success');
        } else {
          setStatus(data.expired ? 'expired' : 'error');
          setMessage(data.message || 'Error al verificar el email');
          track('verify_email_error', { reason: data.expired ? 'expired' : 'invalid' });
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error de conexión');
        track('verify_email_error', { reason: 'network' });
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const handleResend = async () => {
    if (!resendEmail || resendLoading) return;
    setResendLoading(true);
    setResendNotice(null);
    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      if (res.ok) {
        setResendNotice('Hemos enviado un nuevo enlace de verificación. Revisa tu bandeja.');
        track('resend_verification_success');
      } else {
        setResendNotice('No se pudo reenviar el correo. Comprueba el email.');
        track('resend_verification_error');
      }
    } catch {
      setResendNotice('Error de conexión al reenviar el correo.');
      track('resend_verification_error', { reason: 'network' });
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'success' || !autoRedirectEnabled) return;
    setRedirectSeconds(3);
    const interval = setInterval(() => {
      setRedirectSeconds((s) => (typeof s === 'number' && s > 0 ? s - 1 : s));
    }, 1000);
    const timeout = setTimeout(() => {
      router.push('/login?verified=true');
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [status, autoRedirectEnabled, router]);

  return (
    <div>
        <AuthCard>
        <AuthHeader title="Verificación de email" subtitle="Procesando tu solicitud de verificación" />
        {status === 'loading' && (
            <div className="space-y-3 sm:space-y-4 text-center">
              <Spinner variant="centered" />
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Verificando tu email...</h2>
              <p className="text-sm text-gray-600">Por favor, espera mientras verificamos tu cuenta.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-3 sm:space-y-4 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-emerald-600 sm:h-12 sm:w-12" />
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">¡Email verificado!</h2>
              <p className="text-sm text-gray-600">Tu cuenta ha sido verificada. Te redirigimos al acceso.</p>
              <Alert className="rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700 text-sm">
                  Ya puedes iniciar sesión con tu cuenta
                </AlertDescription>
              </Alert>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild variant="outline" className="w-full">
                <Link href="/login">Ir a iniciar sesión ahora</Link>
                </Button>
                {autoRedirectEnabled && (
                  <Button variant="ghost" className="w-full" onClick={() => setAutoRedirectEnabled(false)}>
                    Cancelar redirección
                  </Button>
                )}
              </div>
              {autoRedirectEnabled && typeof redirectSeconds === 'number' && (
                <p className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Timer className="h-3.5 w-3.5" /> Redirigiendo en {redirectSeconds}s
                </p>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3 sm:space-y-4 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-600 sm:h-12 sm:w-12" />
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Error de verificación</h2>
              <p className="text-sm text-gray-600">{message}</p>
              <Alert variant="destructive" className="rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  El enlace de verificación no es válido o ha ocurrido un error.
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                <Link href="/register">Volver al registro</Link>
              </Button>
            </div>
          )}

          {status === 'expired' && (
            <div className="space-y-3 sm:space-y-4 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-orange-600 sm:h-12 sm:w-12" />
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Enlace expirado</h2>
              <p className="text-sm text-gray-600">El enlace ha expirado. Solicita uno nuevo.</p>
              <Alert className="rounded-lg bg-orange-50 border border-orange-200">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-sm text-orange-700">
                  Los enlaces de verificación expiran tras 24h por seguridad.
                </AlertDescription>
              </Alert>
              <div className="space-y-2 text-left">
                <label htmlFor="resend-email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Introduce tu correo para reenviar <CornerDownRight className="h-4 w-4 text-emerald-600" />
                </label>
                <div className="flex gap-2">
                  <Input id="resend-email" type="email" placeholder="tu@institucion.edu" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)} disabled={resendLoading} className="h-10 bg-gray-50 border-gray-200" />
                  <Button onClick={handleResend} disabled={resendLoading || !resendEmail} className="bg-emerald-600 text-white hover:bg-emerald-700">
                    {resendLoading ? <Spinner size="sm" /> : 'Reenviar'}
                  </Button>
                </div>
                {resendNotice && (
                  <Alert className="mt-2 rounded-lg">
                    <AlertDescription className="text-sm">{resendNotice}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
            ¿Ya tienes tu cuenta verificada? Inicia sesión
          </Link>
        </div>
        </AuthCard>
    </div>
  );
}
