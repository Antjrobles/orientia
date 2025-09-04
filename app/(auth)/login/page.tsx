'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle, Loader2, Key, LogIn } from 'lucide-react';
import { AuthProviderButtons } from '@/components/auth/AuthProviderButtons';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthDivider } from '@/components/auth/AuthDivider';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const [verificationSent, setVerificationSent] = useState<string | null>(null);

  useEffect(() => {
    // Mensaje tras registro
    if (searchParams.get('registered') === 'true') {
      setJustRegistered(true);
      router.replace('/login', { scroll: false });
    }
    // Errores de NextAuth en query
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const map: Record<string, string> = {
        OAuthAccountNotLinked: 'Esa cuenta de proveedor ya está vinculada a otro email. Inicia sesión con ese proveedor.',
        AccessDenied: 'Acceso denegado.',
        Configuration: 'Error de configuración de autenticación.',
      };
      setError(map[errorParam] || 'No se pudo iniciar sesión.');
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const callbackUrl = searchParams.get('callbackUrl') || '/profile';
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === 'EMAIL_NOT_VERIFIED') {
        setError('Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
      } else {
        setError('Email o contraseña incorrectos. Por favor, verifica tus datos.');
      }
    } else if (result?.ok) {
      router.push(callbackUrl);
    }
  };

  return (
    <AuthCard>
      {/* El layout de (auth) aporta el botón de volver */}
      <AuthHeader title="Accede a tu cuenta" subtitle="Bienvenido/a de nuevo" />
      <div className="space-y-4">
        <AuthProviderButtons isLoading={loading} callbackUrl={searchParams.get('callbackUrl') || '/profile'} />
        <AuthDivider>o con tu correo</AuthDivider>

        <div className='bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
                {justRegistered && (
                  <Alert className='mb-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 px-3 py-2 dark:bg-emerald-900/20 dark:border-emerald-700'>
                    <CheckCircle className='h-4 w-4 text-emerald-600' />
                    <AlertDescription className='text-emerald-700 text-sm font-medium dark:text-emerald-300'>
                      ¡Registro completado! Ahora puedes iniciar sesión.
                    </AlertDescription>
                  </Alert>
                )}
                <div className='space-y-4'>
                  <form onSubmit={handleLogin} className='space-y-4'>
                    <div>
                      <Label
                        htmlFor='email'
                        className='text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-1.5 mb-1.5'
                      >
                        <Mail className='w-4 h-4 text-emerald-600' /> Correo electrónico
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='tu@institucion.edu'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        autoComplete='email'
                        className='h-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-lg px-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor='password'
                        className='text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-1.5 mb-1.5'
                      >
                        <Key className='w-4 h-4 text-emerald-600' /> Contraseña
                      </Label>
                      <PasswordInput
                        id='password'
                        placeholder='Tu contraseña'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        autoComplete='current-password'
                      />
                    </div>
                    <Button
                      type='submit'
                      disabled={loading}
                      className='w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm'
                    >
                      {loading ? (
                        <>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          <span>Iniciando...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className='w-4 h-4' />
                          <span>Iniciar sesión</span>
                        </>
                      )}
                    </Button>
                  </form>
                  {error && (
                    <div className='space-y-2'>
                      <Alert variant='destructive' className='rounded-lg flex items-center gap-2 px-3 py-2'>
                        <AlertCircle className='h-4 w-4 text-red-600' />
                        <AlertDescription className='text-red-700 dark:text-red-300 text-sm font-medium'>{error}</AlertDescription>
                      </Alert>
                      {error.includes('verificar tu email') && (
                        <Button
                          variant='outline'
                          size='sm'
                          disabled={loading || !email}
                          onClick={async () => {
                            setVerificationSent(null);
                            try {
                              const res = await fetch('/api/resend-verification', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email }),
                              });
                              if (res.ok) {
                                setVerificationSent('Hemos reenviado el email de verificación. Revisa tu bandeja.');
                              }
                            } catch {}
                          }}
                        >
                          Reenviar verificación
                        </Button>
                      )}
                      {verificationSent && (
                        <Alert className='rounded-lg flex items-center gap-2 px-3 py-2'>
                          <CheckCircle className='h-4 w-4 text-emerald-600' />
                          <AlertDescription className='text-emerald-700 dark:text-emerald-300 text-sm font-medium'>{verificationSent}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>
              </div>
      </div>

      <div className='mt-6 text-center text-sm'>
        <p className='text-gray-500 dark:text-gray-400'>
          ¿No tienes cuenta?{' '}
          <Link href='/register' className='font-semibold text-emerald-600 hover:underline'>Regístrate</Link>
        </p>
      </div>
    </AuthCard>
  );
}
