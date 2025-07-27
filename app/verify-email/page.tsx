'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, AlertCircle, Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

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
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 3000);
        } else {
          setStatus(data.expired ? 'expired' : 'error');
          setMessage(data.message || 'Error al verificar el email');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error de conexión');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className='min-h-screen bg-white font-sans flex items-center justify-center p-4'>
      <Link
        href='/'
        className='absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all duration-200 shadow-sm'>
        <Home className='w-4 h-4 text-emerald-600' />
        <span className='text-sm font-medium text-gray-700'>Inicio</span>
      </Link>

      <div className='w-full max-w-md mx-auto text-center'>
        <div className='mb-8'>
          <Image
            src='/icons/orientia.svg'
            alt='Logo Orientia'
            width={180}
            height={28}
            className='w-40 h-auto mx-auto mb-4'
            priority
          />
        </div>

        <div className='bg-white p-8 rounded-xl shadow-lg border border-gray-100'>
          {status === 'loading' && (
            <div className='space-y-4'>
              <Loader2 className='w-12 h-12 animate-spin text-emerald-600 mx-auto' />
              <h2 className='text-xl font-bold text-gray-900'>Verificando tu email...</h2>
              <p className='text-gray-600'>Por favor espera mientras verificamos tu cuenta.</p>
            </div>
          )}

          {status === 'success' && (
            <div className='space-y-4'>
              <CheckCircle className='w-12 h-12 text-green-600 mx-auto' />
              <h2 className='text-xl font-bold text-gray-900'>¡Email verificado!</h2>
              <p className='text-gray-600'>
                Tu cuenta ha sido verificada correctamente. Serás redirigido al login en unos segundos.
              </p>
              <Alert className='bg-green-50 border border-green-200'>
                <CheckCircle className='h-4 w-4 text-green-600' />
                <AlertDescription className='text-green-700'>
                  Ya puedes iniciar sesión con tu cuenta
                </AlertDescription>
              </Alert>
            </div>
          )}

          {status === 'error' && (
            <div className='space-y-4'>
              <AlertCircle className='w-12 h-12 text-red-600 mx-auto' />
              <h2 className='text-xl font-bold text-gray-900'>Error de verificación</h2>
              <p className='text-gray-600'>{message}</p>
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  El enlace de verificación no es válido o ha ocurrido un error.
                </AlertDescription>
              </Alert>
              <Link href='/register'>
                <Button className='w-full'>Volver al registro</Button>
              </Link>
            </div>
          )}

          {status === 'expired' && (
            <div className='space-y-4'>
              <AlertCircle className='w-12 h-12 text-orange-600 mx-auto' />
              <h2 className='text-xl font-bold text-gray-900'>Enlace expirado</h2>
              <p className='text-gray-600'>
                El enlace de verificación ha expirado. Puedes solicitar uno nuevo.
              </p>
              <Alert className='bg-orange-50 border border-orange-200'>
                <AlertCircle className='h-4 w-4 text-orange-600' />
                <AlertDescription className='text-orange-700'>
                  Los enlaces de verificación expiran después de 24 horas por seguridad.
                </AlertDescription>
              </Alert>
              <Button className='w-full' onClick={() => {/* TODO: Reenviar email */ }}>
                Solicitar nuevo enlace
              </Button>
            </div>
          )}
        </div>

        <div className='mt-6 text-center text-sm text-gray-500'>
          <Link href='/login' className='text-emerald-600 hover:underline'>
            ¿Ya tienes tu cuenta verificada? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}