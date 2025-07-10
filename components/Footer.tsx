// src/components/layout/Footer.tsx

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-gray-900 text-white py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna de la Marca */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              {/* Usamos el componente Image de Next.js para optimización */}
              <Image
                src="/icons/logo2.svg" // Asegúrate que la ruta a tu logo es correcta
                alt="Logo de Orientia en versión para fondos oscuros"
                width={110}
                height={110}
              />
              <div>
                <h2 className="text-4xl font-bold">Orientia</h2>
                <p className="text-gray-400 text-sm">Informes Psicopedagógicos</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con asistencia de IA.

            </p>
            <div className="text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Orientia. Todos los derechos reservados.</p>
            </div>
          </div>

          {/* Columna de Enlaces Útiles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Útiles</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/manual" className="hover:text-white transition-colors">
                  Manual de Usuario
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/soporte" className="hover:text-white transition-colors">
                  Soporte Técnico
                </Link>
              </li>
              <li>
                <Link href="/formacion" className="hover:text-white transition-colors">
                  Formación
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna de Contacto y Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto y Legal</h3>
            <address className="space-y-2 text-sm text-gray-400 not-italic">
              <Link href={"mailto:info@orientia.es"} className="hover:text-white transition-colors">Email: info@orientia.es</Link>
              <p>Teléfono: 955 064 000</p>
              <p>Horario: L-V 8:00-15:00</p>
              <p>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}