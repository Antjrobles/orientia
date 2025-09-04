import { Metadata } from 'next';
import Link from 'next/link';
import AjustesCookiesPanel from '@/components/consent/AjustesCookiesPanel';

export const metadata: Metadata = {
  title: 'Ajustes de Cookies',
  description: 'Gestiona tus preferencias de cookies por categorías en Orientia.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: '/ajustes-cookies' },
};

export default function AjustesCookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center sm:text-left">
              Ajustes de Cookies
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Revisa la información y, próximamente, gestiona tus preferencias por categorías.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Inicio</Link>
            <Link href="/cookies" className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700">Política de Cookies</Link>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 mb-6">
            Para detalles sobre categorías, finalidades y duración, consulta la{' '}
            <Link href="/cookies" className="text-primary-600 hover:underline">Política de Cookies</Link>.
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-primary-200">Categorías</h2>
          <AjustesCookiesPanel />

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg not-prose">
            <p className="text-sm text-gray-700">
              Nota: Este panel controla tus preferencias y las sincroniza con el banner. Algunas integraciones pueden requerir recargar la página para aplicar cambios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
