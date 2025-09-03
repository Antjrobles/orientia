import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Mail, Phone, Clock, MapPin, ExternalLink } from 'lucide-react';
import BackToTopButton from './BackToTopButton';

// 1. SEO: Datos Estructurados (JSON-LD) para la organización
const OrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Orientia',
  url: 'https://www.orientia.es', // Reemplazar con la URL real del sitio
  logo: 'https://www.orientia.es/icons/logo2.svg', // Reemplazar con la URL completa al logo
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+34-955-064-000',
    contactType: 'customer support',
    email: 'info@orientia.es',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. de la Innovación, s/n', // Dirección de ejemplo
    addressLocality: 'Sevilla',
    postalCode: '41020',
    addressRegion: 'Andalucía',
    addressCountry: 'ES',
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
    <footer id="contacto" className="bg-gray-900 text-white py-8" role="contentinfo">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganizationSchema) }}
      />
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
                {/* 2. Accesibilidad: Jerarquía de encabezados correcta (p en lugar de h2) */}
                <p className="text-xl font-bold text-green-500">Orientia</p>
                <p className="text-gray-400 text-xs">Informes Psicopedagógicos</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Plataforma para orientadores educativos. Genera informes psicopedagógicos profesionales con IA.
            </p>
          </div>

          {/* Columna de Recursos */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Recursos</h3>
            <nav aria-label="Recursos">
              <ul className="space-y-2">
                {[
                  { href: '/manual', label: 'Manual', external: false },
                  { href: '/faq', label: 'FAQ', external: false },
                  { href: '/soporte', label: 'Soporte', external: false },
                  { href: '/formacion', label: 'Formación', external: false },
                  { href: 'https://www.juntadeandalucia.es/educacion', label: 'Consejería Educación', external: true },
                  { href: 'https://www.boe.es', label: 'BOE', external: true },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-gray-300 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className={cn(
                        "w-3 h-3 ml-1.5 transition-opacity",
                        // El icono es visible para enlaces externos, y aparece en hover para los internos
                        link.external ? "opacity-75" : "opacity-0 group-hover:opacity-100"
                      )} />
                      {/* Accesibilidad: Añadir contexto para lectores de pantalla en enlaces externos */}
                      {link.external && <span className="sr-only">(enlace externo)</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Columna Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Legal</h3>
            <nav aria-label="Legal">
              <ul className="space-y-2">
                {[
                  { href: "/privacidad", label: "Privacidad" },
                  { href: "/terminos", label: "Términos" },
                  { href: "/cookies", label: "Cookies" },
                  { href: "/accesibilidad", label: "Accesibilidad" },
                  { href: "/rgpd", label: "RGPD" },
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

          {/* Columna de Contacto (NAP para SEO) */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Contacto</h3>
            {/* 2. SEO y Semántica: Usar <address> para información de contacto */}
            <address className="not-italic space-y-2">
              <a href="mailto:info@orientia.es" className="flex items-center space-x-2 text-gray-300 text-sm hover:text-green-500 transition-colors">
                <Mail className="w-3 h-3 text-green-500" />
                <span>info@orientia.es</span>
              </a>
              {/* 3. Accesibilidad: Enlace de teléfono clicable */}
              <a href="tel:+34955064000" className="flex items-center space-x-2 text-gray-300 text-sm hover:text-green-500 transition-colors">
                <Phone className="w-3 h-3 text-green-500" />
                <span>955 064 000</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Clock className="w-3 h-3 text-green-500" />
                <span>L-V: 8:00-15:00</span>
              </div>
              {/* 2. SEO: Añadir dirección para consistencia NAP */}
              <p className="flex items-start space-x-2 text-gray-300 text-sm pt-2"><MapPin className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" /><span>Av. de la Innovación, s/n<br/>41020, Sevilla, España</span></p>
            </address>
          </div>
        </div>

        {/* Barra inferior compacta */}
        <div className="border-t border-gray-700 mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-xs text-gray-400">
              © {currentYear} Orientia. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Hecho con ❤️ para Orientadores</span>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Andalucía</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
   <BackToTopButton />
   </>
  );
}