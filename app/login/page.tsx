'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
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
    <div className='h-screen bg-gradient-to-br from-gray-50 to-emerald-50 font-sans flex items-center justify-center p-4 overflow-hidden relative'>
      {/* Subtle Background Decorations */}
      <div className='absolute -top-20 -left-20 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl'></div>
      <div className='absolute -bottom-20 -right-20 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl'></div>

      <div className='w-full max-w-md space-y-4 z-10'>
        <div className='flex flex-col items-center mb-4'>
          <Link href='/' aria-label='Volver a la página de inicio' className='inline-block mb-2'>
            <Image
              src='/icons/logo4.svg'
              alt='Logo Orientia'
              width={200}
              height={190}
              className='transform transition-all hover:scale-105 hover:rotate-3 duration-500 ease-in-out drop-shadow-sm animate-pulse-once'
              priority
            />
          </Link>
          <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Orientia</h1>
          <p className='text-xs text-emerald-600 font-medium mt-1'>Tu aliado en psicopedagogía</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative overflow-hidden'>
          {/* Subtle Animated Border */}
          <div className='absolute inset-0 border-2 border-transparent rounded-lg animate-glow'></div>
          <div className='text-center mb-4'>
            <h2 className='text-2xl font-bold text-gray-900 tracking-tight'>Iniciar Sesión</h2>
            <p className='text-gray-500 mt-1 text-sm'>Accede a tu cuenta para continuar</p>
          </div>
          <div className='space-y-3'>
            <Button
              onClick={() => signIn('google', { callbackUrl: '/profile' })}
              disabled={loading || sent}
              className='w-full h-10 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium'>
              <User className='w-5 h-5 text-emerald-600' />
              <span>Continuar con Google</span>
            </Button>

            <div className='flex items-center'>
              <div className='flex-grow border-t border-gray-200'></div>
              <span className='px-3 text-xs text-gray-400'>o con tu correo</span>
              <div className='flex-grow border-t border-gray-200'></div>
            </div>

            <form onSubmit={handleEmailLogin} className='space-y-3'>
              <div>
                <Label htmlFor='email' className='text-gray-700 text-sm font-medium flex items-center gap-1.5 mb-1'>
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
                className='w-full h-resid10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm'>
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Enviando...</span>
                  </>
                ) : sent ? (
                  <>
                    <CheckCircle className='w-4 h-4' />
                    <span>Enlace enviado</span>
                  </>
                ) : (
                  <>
                    <Mail className='w-4 h-4' />
                    <span>Continuar con Email</span>
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
                  Revisa tu correo para continuar.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        <div className='text-center text-xs text-gray-400 space-x-2'>
          <Link href='/register' className='hover:underline text-emerald-600 font-medium'>
            ¿No tienes cuenta? Regístrate
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

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes pulse-once {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pulse-once {
          animation: pulse-once 1s ease-in-out;
        }
        @keyframes glow {
          0% {
            border-color: rgba(16, 185, 129, 0.2);
            box-shadow: 0 0 5px rgba(16, 185, 129, 0.2);
          }
          50% {
            border-color: rgba(16, 185, 129, 0.4);
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
          }
          100% {
            border-color: rgba(16, 185, 129, 0.2);
            box-shadow: 0 0 5px rgba(16, 185, 129, 0.2);
          }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
