'use client';

import React from 'react';
import { useState } from 'react';
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
  UserPlus,
  Lightbulb,
  BarChart2,
  Shield,
  Home,
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('email', {
      email,
      callbackUrl: '/profile',
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('No se pudo enviar el enlace. Intenta de nuevo.');
    } else {
      setSent(true);
    }
  };

  return (
    <div className='h-screen max-h-screen overflow-hidden bg-white font-sans'>
      <Link
        href='/'
        className='absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all duration-200 shadow-sm'>
        <Home className='w-4 h-4 text-emerald-600' />
        <span className='text-sm font-medium text-gray-700'>Inicio</span>
      </Link>

      <div className='flex flex-col lg:flex-row w-full h-full'>
        {/* ========================================================== */}
        {/*           COLUMNA IZQUIERDA - ESTRUCTURA FINAL             */}
        {/* ========================================================== */}
        <div className='w-full lg:w-1/2 flex flex-col h-full pt-20'>


            <div class='h-32 w-full px-80 pt-20'>
              <Image
                src='/icons/orientia.svg'
                alt='Logo Orientia'
                width={0}
                height={0}
                className='w-80 h-10'
                priority
              />
            </div>


          {/* ---- EL FORMULARIO DEBAJO, CON SU PROPIO SCROLL SI ES NECESARIO ---- */}
          <div className='w-full flex-grow overflow-y-auto p-1'>
            <div className='w-full max-w-md mx-auto'>
              <div className='w-full space-y-4'>
                <div className='text-center'>
                  <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight'>
                    Crea tu cuenta profesional
                  </h2>
                  <p className='text-gray-500 mt-2'>Tu aliado en psicopedagogía</p>
                </div>
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                  <div className='space-y-3'>
                    <Button
                      onClick={() => signIn('google', { callbackUrl: '/profile' })}
                      disabled={loading || sent}
                      className='w-full h-10 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium'>
                      <User className='w-5 h-5 text-emerald-600' />
                      <span>Registrarse con Google</span>
                    </Button>
                    <div className='flex items-center'>
                      <div className='flex-grow border-t border-gray-200'></div>
                      <span className='px-3 text-xs text-gray-400'>o con tu correo</span>
                      <div className='flex-grow border-t border-gray-200'></div>
                    </div>
                    <form onSubmit={handleRegister} className='space-y-3'>
                      <div>
                        <Label
                          htmlFor='name'
                          className='text-gray-700 text-sm font-medium flex items-center gap-1.5 mb-1'>
                          <UserPlus className='w-4 h-4 text-emerald-600' /> Nombre completo
                        </Label>
                        <Input
                          id='name'
                          type='text'
                          placeholder='Tu nombre y apellidos'
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={loading || sent}
                          className='h-10 bg-gray-50 border-gray-200 rounded-lg px-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
                        />
                      </div>
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
                          disabled={loading || sent}
                          className='h-10 bg-gray-50 border-gray-200 rounded-lg px-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
                        />
                      </div>
                      <Button
                        type='submit'
                        disabled={loading || sent}
                        className='w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm'>
                        {loading ? (
                          <>
                            <Loader2 className='w-4 h-4 animate-spin' />
                            <span>Creando...</span>
                          </>
                        ) : sent ? (
                          <>
                            <CheckCircle className='w-4 h-4' />
                            <span>Revisa correo</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className='w-4 h-4' />
                            <span>Crear cuenta</span>
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
                    {sent && (
                      <Alert className='bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 px-3 py-2'>
                        <CheckCircle className='h-4 w-4 text-emerald-600' />
                        <AlertDescription className='text-emerald-700 text-sm font-medium'>
                          ¡Revisa tu correo!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                <div className='text-center text-xs text-gray-400 space-x-2'>
                  <Link href='/login' className='text-emerald-600 hover:underline font-medium'>
                    ¿Ya tienes cuenta? Inicia sesión
                  </Link>
                  <span>•</span>
                  <a href='#' className='hover:underline'>
                    Términos
                  </a>
                  <span>•</span>
                  <a href='#' className='hover:underline'>
                    Privacidad
                  </a>
                  <span>•</span>
                  <a href='#' className='hover:underline'>
                    Ayuda
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/*                      COLUMNA DERECHA                       */}
        {/* ========================================================== */}
        <div className='hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 relative h-full'>
          <div className='absolute -top-5 -right-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl'></div>

          <div className='w-full max-w-md space-y-10 z-50 mb-12'>
            <div className='text-center'>
              <Link href='/' aria-label='Volver a la página de inicio' className='inline-block mb-1'>
                <Image
                  src='/icons/logo2.svg'
                  alt='Logo Orientia'
                  width={169}
                  height={46}
                  className='w-[200px] h-auto'
                />
              </Link>
              <p className='text-sm font-medium text-emerald-100'>
                La plataforma definitiva para profesionales de la psicopedagogía.
              </p>
            </div>
            <div className='text-center'>
              <h2 className='text-2xl font-bold leading-tight mb-2'>Transforma tu manera de evaluar y orientar</h2>
              <p className='text-emerald-100/90 text-sm leading-relaxed'>
                Crea reportes psicopedagógicos completos, realiza análisis profundos y sigue el progreso de tus
                estudiantes con herramientas diseñadas para ti.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {[
                {
                  icon: <BookOpen className='w-5 h-5 text-emerald-300' />,
                  title: 'Reportes Inteligentes',
                  description: 'Genera informes completos y personalizados.',
                },
                {
                  icon: <Lightbulb className='w-5 h-5 text-emerald-300' />,
                  title: 'Análisis Profundo',
                  description: 'Obtén insights valiosos para cada estudiante.',
                },
                {
                  icon: <BarChart2 className='w-5 h-5 text-emerald-300' />,
                  title: 'Seguimiento de Progreso',
                  description: 'Visualiza la evolución académica y conductual.',
                },
                {
                  icon: <Shield className='w-5 h-5 text-emerald-300' />,
                  title: 'Seguridad y Privacidad',
                  description: 'Tus datos y los de tus estudiantes, protegidos.',
                },
              ].map(({ icon, title, description }, i) => (
                <div
                  key={i}
                  className='bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 transition-all hover:bg-white/15'>
                  <div className='flex items-center gap-2'>
                    <div className='flex-shrink-0'>{icon}</div>
                    <div>
                      <h3 className='font-medium text-white text-xs'>{title}</h3>
                      <p className='text-emerald-100/80 text-xs mt-1'>{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
