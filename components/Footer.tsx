import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Clock, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-gray-900 text-white py-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Columna de la Marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/icons/logo2.svg"
                alt="Logo de Orientia"
                width={48}
                height={48}
                className="drop-shadow-lg"
              />
              <div>
                <h2 className="text-xl font-bold text-green-500">Orientia</h2>
                <p className="text-gray-400 text-xs">Informes Psicopedagógicos</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con IA.
            </p>

            {/* Información de contacto compacta */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail className="w-3 h-3 text-green-500" />
                <Link
                  href="mailto:info@orientia.es"
                  className="hover:text-green-500 transition-colors"
                >
                  info@orientia.es
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Phone className="w-3 h-3 text-green-500" />
                <span>955 064 000</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Clock className="w-3 h-3 text-green-500" />
                <span>L-V: 8:00-15:00</span>
              </div>
            </div>
          </div>

          {/* Columna de Recursos */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Recursos</h3>
            <nav>
              <ul className="space-y-2">
                {[
                  { href: "/manual", label: "Manual" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/soporte", label: "Soporte" },
                  { href: "/formacion", label: "Formación" }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Columna Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Legal</h3>
            <nav>
              <ul className="space-y-2">
                {[
                  { href: "/privacidad", label: "Privacidad" },
                  { href: "/terminos", label: "Términos" },
                  { href: "/cookies", label: "Cookies" },
                  { href: "/accesibilidad", label: "Accesibilidad" },
                  { href: "/eliminacion-de-datos-de-usuario", label: "Eliminación de datos de usuario" }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Columna CTA */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Comenzar</h3>
            <p className="text-gray-300 text-sm mb-3">
              Únete a orientadores que confían en Orientia.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Empezar ahora
            </Link>
          </div>
        </div>

        {/* Barra inferior compacta */}
        <div className="border-t border-gray-700 mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-xs text-gray-400">
              © {currentYear} Orientia. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Hecho con ❤️ para educadores</span>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>España</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}