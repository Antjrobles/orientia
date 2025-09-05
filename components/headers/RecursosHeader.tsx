'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AuthButtons from '@/components/auth/AuthButtons';
import { cn } from '@/lib/utils';

export default function LegalHeader() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className='bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50' role='banner'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <Link href='/' aria-label='Volver a la página de inicio'>
                <Image
                  src='/icons/logo4.svg'
                  alt='Logo Orientia'
                  width={150}
                  height={40}
                  className='transform transition-transform hover:scale-105 mt-8'
                  priority
                />
              </Link>
            </div>

            {/* Botón menú móvil */}
            <button
              className='md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              aria-label='Abrir menú'
              onClick={() => setMobileMenuOpen(true)}>
              <Menu className='h-6 w-6' />
            </button>

            {/* Navegación desktop */}
            <nav className='hidden md:flex items-center space-x-2' role='navigation' aria-label='Navegación principal'>
              <Link
                href='/'
                className='px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors'
                aria-current='page'>
                Inicio
              </Link>
              <Link
                href='/manual'
                className='px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors'>
                Manual
              </Link>
              <Link
                href='/faq'
                className='px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors'>
                FAQ
              </Link>
              <Link
                href='/soporte'
                className='px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors'>
                Soporte
              </Link>
              <Link
                href='/formacion'
                className='px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors'>
                Formación
              </Link>
            </nav>

            {/* Botones de autenticación desktop */}
            <div className='hidden md:flex items-center'>
              <AuthButtons />
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 z-[100] md:hidden'>
          {/* Overlay oscuro */}
          <div
            className='fixed inset-0 bg-black/60 transition-opacity'
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden='true'
          />

          {/* Panel del menú */}
          <div
            className={cn(
              'fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out',
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            )}>
            <div className='flex flex-col h-full'>
              {/* Header del menú */}
              <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900'>Menú</h2>
                <button
                  className='p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                  aria-label='Cerrar menú'
                  onClick={() => setMobileMenuOpen(false)}>
                  <X className='h-6 w-6 text-gray-600' />
                </button>
              </div>

              {/* Contenido del menú */}
              <div className='flex-1 px-4 py-6 overflow-y-auto'>
                <nav className='space-y-2' role='navigation' aria-label='Navegación móvil'>
                  <Link
                    href='/'
                    className='block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100'
                    aria-current='page'
                    onClick={() => setMobileMenuOpen(false)}>
                    Inicio
                  </Link>
                  <Link
                    href='/manual'
                    className='block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100'
                    onClick={() => setMobileMenuOpen(false)}>
                    Manual
                  </Link>
                  <Link
                    href='/faq'
                    className='block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100'
                    onClick={() => setMobileMenuOpen(false)}>
                    FAQ
                  </Link>
                  <Link
                    href='/soporte'
                    className='block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100'
                    onClick={() => setMobileMenuOpen(false)}>
                    Soporte
                  </Link>
                  <Link
                    href='/formacion'
                    className='block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100'
                    onClick={() => setMobileMenuOpen(false)}>
                    Formación
                  </Link>
                </nav>
              </div>

              {/* Footer del menú con botones de autenticación */}
              <div className='border-t border-gray-200 p-4'>
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
