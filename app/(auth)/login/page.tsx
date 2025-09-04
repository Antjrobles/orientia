'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle, Loader2, Key, LogIn } from 'lucide-react';
import { AuthProviderButtons } from '@/components/auth/AuthProviderButtons';
import { PasswordInput } from '@/components/auth/PasswordInput';

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
    <div className='min-h-screen bg-white font-sans'>
      {/* El botón de volver al inicio lo aporta el layout de (auth) */}

      <div className='flex flex-col lg:flex-row w-full min-h-screen'>
        <div className='pt-16 lg:hidden'></div>

        <div className='w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 flex-1'>
          <div className='w-full max-w-md mx-auto'>
            <div className='w-full px-4 sm:px-0 mb-8 flex justify-center'>
              <Image
                src='/icons/orientia.svg'
                alt='Logo Orientia'
                width={240}
                height={40}
                className='w-60 h-auto'
                priority
              />
            </div>

            <div className='w-full space-y-4'>
              <div className='text-center'>
                <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight'>Accede a tu cuenta</h2>
                <p className='text-gray-500 mt-2'>Bienvenido/a de nuevo</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                {justRegistered && (
                  <Alert className='mb-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 px-3 py-2'>
                    <CheckCircle className='h-4 w-4 text-emerald-600' />
                    <AlertDescription className='text-emerald-700 text-sm font-medium'>
                      ¡Registro completado! Ahora puedes iniciar sesión.
                    </AlertDescription>
                  </Alert>
                )}
                <div className='space-y-3'>
                  <AuthProviderButtons isLoading={loading} callbackUrl={searchParams.get('callbackUrl') || '/profile'} />
                  <div className='flex items-center'>
                    <div className='flex-grow border-t border-gray-200'></div>
                    <span className='px-3 text-xs text-gray-400'>o con tu correo</span>
                    <div className='flex-grow border-t border-gray-200'></div>
                  </div>
                  <form onSubmit={handleLogin} className='space-y-3'>
                    <div>
                      <Label
                        htmlFor='email'
                        className='text-gray-700 text-sm font-medium flex items-center gap-1.5 mb-1'
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
                        className='h-10 bg-gray-50 border-gray-200 rounded-lg px-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor='password'
                        className='text-gray-700 text-sm font-medium flex items-center gap-1.5 mb-1'
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
                      className='w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm'
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
                        <AlertDescription className='text-red-700 text-sm font-medium'>{error}</AlertDescription>
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
                          <AlertDescription className='text-emerald-700 text-sm font-medium'>{verificationSent}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className='text-center text-xs text-gray-400 flex flex-wrap justify-center items-center gap-x-2 gap-y-1'>
                <Link href='/register' className='text-emerald-600 hover:underline font-medium'>
                  ¿No tienes cuenta? Regístrate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

