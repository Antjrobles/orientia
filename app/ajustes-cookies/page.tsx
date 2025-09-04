import { Metadata } from 'next';
import Link from 'next/link';

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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
          Ajustes de Cookies
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Desde aquí puedes revisar la información sobre el uso de cookies y gestionar tus preferencias por categorías.
        </p>

        <div className="prose prose-lg max-w-none">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 mb-6">
            Para conocer más detalles sobre cada categoría y cookies empleadas, consulta la{' '}
            <Link href="/cookies" className="text-primary-600 hover:underline">Política de Cookies</Link>.
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-primary-200">Categorías</h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Necesarias:</strong> esenciales para el funcionamiento del sitio (no configurables).</li>
            <li><strong>Preferencias:</strong> recuerdan opciones como idioma o tema.</li>
            <li><strong>Analítica:</strong> ayudan a entender el uso de la plataforma de forma agregada.</li>
            <li><strong>Rendimiento:</strong> mejoran velocidad y experiencia.</li>
            <li><strong>Publicidad (si aplica):</strong> muestran contenido más relevante.</li>
          </ul>

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              Nota: Este panel centraliza la información y preferencias. La activación real por categorías depende de la configuración técnica de la aplicación.
              Si cambias de opinión más tarde, vuelve a esta página desde el enlace del pie de página.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
