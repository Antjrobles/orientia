'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
  Key,
  UserPlus,
  Lightbulb,
  BarChart2,
  Shield,
  Home,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!passwordMatch) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setError('');
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 2000);
      } else {
        const errorText = await res.text();
        setError(errorText || 'Ocurrió un error durante el registro.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen bg-white font-sans overflow-hidden'>
      <Link
        href='/'
        className='absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all duration-200 shadow-sm'>
        <Home className='w-4 h-4 text-emerald-600' />
        <span className='text-sm font-medium text-gray-700'>Inicio</span>
      </Link>

      <div className='flex flex-col lg:flex-row w-full h-full'>
        <div className='pt-16 lg:hidden'></div>

        {/* COLUMNA IZQUIERDA */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center items-center p-1 sm:p-2 lg:p-4 flex-1'>
          <div className='w-full max-w-md mx-auto'>
            <div className='w-full px-4 sm:px-0 mb-4 sm:mb-2 flex justify-center'>
              <Image
                src='/icons/orientia.svg'
                alt='Logo Orientia'
                width={180}
                height={28}
                className='w-32 sm:w-40 h-auto'
                priority
              />
            </div>

            <div className='w-full space-y-1 sm:space-y-2 transition-all duration-300'>
              <div className='text-center'>
                <h2 className='text-lg lg:text-xl font-bold text-gray-900 tracking-tight'>
                  Crea tu cuenta profesional
                </h2>
                <p className='text-gray-500 mt-0.5 text-sm'>Tu aliado en psicopedagogía</p>
              </div>

              <div className='bg-white/90 p-2 sm:p-3 rounded-xl shadow-md border border-gray-100 ring-1 ring-transparent hover:ring-emerald-100 focus-within:ring-emerald-200 transition-all'>
                <div className='space-y-1 sm:space-y-2'>
                  <Button
                    onClick={() => signIn('google', { callbackUrl: '/profile' })}
                    disabled={loading || success}
                    className='w-full h-7 sm:h-8 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium'>
                    <User className='w-4 h-4 text-emerald-600' />
                    <span>Registrarse con Google</span>
                  </Button>

                  <div className='flex items-center'>
                    <div className='flex-grow border-t border-gray-200'></div>
                    <span className='px-3 text-xs text-gray-400'>o con tu correo</span>
                    <div className='flex-grow border-t border-gray-200'></div>
                  </div>

                  <form onSubmit={handleRegister} className='space-y-1 sm:space-y-1.5'>
                    <div>
                      <Label
                        htmlFor='name'
                        className='text-gray-900 text-sm font-bold flex items-center gap-1.5 mb-0.5'>
                        <UserPlus className='w-4 h-4 text-emerald-600' /> Nombre completo
                      </Label>
                      <Input
                        id='name'
                        type='text'
                        placeholder='Escribe tu nombre...'
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading || success}
                        className='h-9 sm:h-10 bg-gray-50 border-gray-200 rounded-lg px-3 text-gray-800 placeholder-gray-400/50 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='email'
                        className='text-gray-900 text-sm font-bold flex items-center gap-1.5 mb-0.5'>
                        <Mail className='w-4 h-4 text-emerald-600' /> Correo electrónico
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='ejemplo@correo.com'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading || success}
                        className='h-9 sm:h-10 bg-gray-50 border-gray-200 rounded-lg px-3 text-gray-800 placeholder-gray-400/50 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor='password'
                        className='text-gray-900 text-sm font-bold flex items-center gap-1.5 mb-0.5'>
                        <Key className='w-4 h-4 text-emerald-600' /> Contraseña
                      </Label>
                      <div className="relative">
                        <Input
                          id='password'
                          type={showPassword ? 'text' : 'password'}
                          placeholder='••••••••'
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (confirmPassword) {
                              setPasswordMatch(e.target.value === confirmPassword);
                            }
                          }}
                          disabled={loading || success}
                          className='h-9 sm:h-10 bg-gray-50 border-gray-200 rounded-lg px-3 pr-10 text-gray-800 placeholder-gray-400/50 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm'
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

                    <div>
                      <Label
                        htmlFor='confirmPassword'
                        className='text-gray-900 text-sm font-bold flex items-center gap-1.5 mb-0.5'>
                        <Key className='w-4 h-4 text-emerald-600' /> Confirmar contraseña
                      </Label>
                      <div className="relative">
                        <Input
                          id='confirmPassword'
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='••••••••'
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordMatch(password === e.target.value);
                          }}
                          disabled={loading || success}
                          className={`h-9 sm:h-10 bg-gray-50 border-gray-200 rounded-lg px-3 pr-10 text-gray-800 placeholder-gray-400/50 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm ${confirmPassword && !passwordMatch ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPassword && !passwordMatch && (
                        <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                      )}
                    </div>

                    <Button
                      type='submit'
                      disabled={loading || success}
                      className='w-full h-9 sm:h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm'>
                      {loading ? (
                        <>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          <span>Creando...</span>
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle className='w-4 h-4' />
                          <span>¡Registrado!</span>
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

                  {success && (
                    <Alert className='bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 px-3 py-2'>
                      <CheckCircle className='h-4 w-4 text-emerald-600' />
                      <AlertDescription className='text-emerald-700 text-sm font-medium'>
                        ¡Registro completado! Redirigiendo al login...
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className='text-center text-xs text-gray-400 flex flex-wrap justify-center items-center gap-x-1 gap-y-1'>
                <Link href='/login' className='text-emerald-600 hover:underline font-medium'>
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
                <span className='hidden sm:inline'>•</span>
                <a href='#' className='hover:underline'>
                  Términos
                </a>
                <span>•</span>
                <a href='#' className='hover:underline'>
                  Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - SOLO EN DESKTOP */}
        <div className='hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 relative h-full'>
          <Image
            src='/images/background.jpg'
            alt='Fondo de la plataforma de psicopedagogía'
            fill
            className='object-cover z-0 opacity-40 blur-xs'
          />
          <div className='absolute -top-5 -right-20 w-64 h-64 bg-teal-500/20 rounded-full blur-xs'></div>
          <div className='relative z-10 w-full max-w-md space-y-6'>
            <div className='text-center'>
              <Link href='/' aria-label='Volver a la página de inicio' className='inline-block mb-1'>
                <Image
                  src='/icons/logo2.svg'
                  alt='Logo Orientia'
                  width={169}
                  height={46}
                  className='w-[180px] h-auto mx-auto'
                />
              </Link>
              <p className='text-sm font-medium text-emerald-100'>
                La plataforma definitiva para profesionales de la psicopedagogía.
              </p>
            </div>
            <div className='text-center'>
              <h2 className='text-xl font-bold leading-tight mb-2'>Transforma tu manera de evaluar y orientar</h2>
              <p className='text-emerald-100/90 text-sm leading-relaxed'>
                Crea reportes psicopedagógicos completos, realiza análisis profundos y sigue el progreso de tus
                estudiantes con herramientas diseñadas para ti.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {[{
                icon: <BookOpen className='w-5 h-5 text-emerald-300' />,
                title: 'Reportes Inteligentes',
                description: 'Genera informes completos y personalizados.',
              }, {
                icon: <Lightbulb className='w-5 h-5 text-emerald-300' />,
                title: 'Análisis Profundo',
                description: 'Obtén insights valiosos para cada estudiante.',
              }, {
                icon: <BarChart2 className='w-5 h-5 text-emerald-300' />,
                title: 'Seguimiento de Progreso',
                description: 'Visualiza la evolución académica y conductual.',
              }, {
                icon: <Shield className='w-5 h-5 text-emerald-300' />,
                title: 'Seguridad y Privacidad',
                description: 'Tus datos y los de tus estudiantes, protegidos.',
              }].map(({ icon, title, description }, i) => (
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