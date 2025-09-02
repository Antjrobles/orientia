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
import {
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Key,
  LogIn,
  Lightbulb,
  BarChart2,
  Shield,
  Home,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Comprobar si el usuario viene de la página de registro
    if (searchParams.get('registered') === 'true') {
      setJustRegistered(true);
      // Opcional: limpiar el parámetro de la URL para que el mensaje no persista si se recarga la página
      router.replace('/login', { scroll: false });
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === 'EMAIL_NOT_VERIFIED') {
        setError('Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
      } else {
        setError('Email o contraseña incorrectos. Por favor, verifica tus datos.');
      }
    } else if (result?.ok) {
      // El inicio de sesión fue exitoso, redirigir al perfil.
      router.push('/profile');
    }
  };

  return (
    <div className='min-h-screen bg-white font-sans'>
      <Link
        href='/'
        className='absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-md transition-all duration-300 shadow-sm group'>
        <Home className='w-4 h-4 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300' />
        <span className='text-sm font-medium text-gray-700 group-hover:text-emerald-800 transition-colors duration-300'>Inicio</span>
      </Link>

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
                  <div className='flex flex-wrap justify-center gap-8 sm:gap-8'>
                    <Button
                      onClick={() => signIn('google', { callbackUrl: '/profile' })}
                      disabled={loading}
                      className='h-7 sm:h-8 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium'>
                      <Image
                        src="/icons/google.svg"
                        alt="Google"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </Button>

                    <Button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const result = await signIn('facebook', {
                            callbackUrl: '/profile',
                            redirect: false
                          });

                          if (result?.ok) {
                            router.push('/profile');
                          } else if (result?.error) {
                            setError('Error al iniciar sesión con Facebook. Inténtalo de nuevo.');
                          }
                        } catch (error) {
                          setError('Error al conectar con Facebook.');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className='h-7 sm:h-8 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium'>
                      <Image
                        src="/icons/facebook.svg"
                        alt="Facebook"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </Button>

                    <Button
                      onClick={() => signIn('apple', { callbackUrl: '/profile' })}
                      disabled={loading}
                      className='h-7 sm:h-8 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium'>
                      <Image
                        src="/icons/apple.svg"
                        alt="Apple"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </Button>
                  </div>
                  <div className='flex items-center'>
                    <div className='flex-grow border-t border-gray-200'></div>
                    <span className='px-3 text-xs text-gray-400'>o con tu correo</span>
                    <div className='flex-grow border-t border-gray-200'></div>
                  </div>
                  <form onSubmit={handleLogin} className='space-y-3'>
                    <div>
                      <Label
                        htmlFor='email'
                        className='text-gray-700 text-sm font-medium flex items-center gap-1.5 mb-1'>
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
                        className='h-10 bg-gray-50 border-gray-200 rounded-lg px-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor='password'
                        className='text-gray-700 text-sm font-medium flex items-center gap-1.5 mb-1'>
                        <Key className='w-4 h-4 text-emerald-600' /> Contraseña
                      </Label>
                      <div className="relative">
                        <Input
                          id='password'
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Tu contraseña'
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          className='h-10 bg-gray-50 border-gray-200 rounded-lg px-3 pr-10 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type='submit'
                      disabled={loading}
                      className='w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm'>
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
                    <Alert variant='destructive' className='rounded-lg flex items-center gap-2 px-3 py-2'>
                      <AlertCircle className='h-4 w-4 text-red-600' />
                      <AlertDescription className='text-red-700 text-sm font-medium'>{error}</AlertDescription>
                    </Alert>
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
