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

          <div className="not-prose grid gap-4 sm:grid-cols-2">
            {[{
              key: 'necessary', label: 'Necesarias', desc: 'Esenciales para el funcionamiento del sitio (no configurables).', disabled: true
            }, {
              key: 'preferences', label: 'Preferencias', desc: 'Recuerdan idioma u otras opciones de interfaz.', disabled: true
            }, {
              key: 'analytics', label: 'Analítica', desc: 'Ayudan a entender el uso de la plataforma de forma agregada.', disabled: true
            }, {
              key: 'performance', label: 'Rendimiento', desc: 'Mejoran velocidad y experiencia.', disabled: true
            }, {
              key: 'ads', label: 'Publicidad (si aplica)', desc: 'Muestran contenido más relevante.', disabled: true
            }].map(cat => (
              <label key={cat.key} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300" defaultChecked={cat.key==='necessary'} disabled={cat.disabled} />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{cat.label} {cat.disabled && <em className="ml-1 text-xs font-normal text-gray-500">(próximamente)</em>}</span>
                  <span className="block text-sm text-gray-600">{cat.desc}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 not-prose">
            <button
              disabled
              className="w-full sm:w-auto rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 cursor-not-allowed"
              title="Próximamente"
            >
              Guardar preferencias
            </button>
            <Link href="/cookies" className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-center">
              Ver Política de Cookies
            </Link>
            <Link href="/" className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 text-center">
              Volver al inicio
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg not-prose">
            <p className="text-sm text-gray-700">
              Nota: Esta página es el panel centralizado para tus preferencias. La activación real por categorías se habilitará próximamente.
              Mientras tanto, puedes aceptar o rechazar categorías desde el banner de cookies cuando aparezca.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

