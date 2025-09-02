import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies en la plataforma Orientia. Aprende qué cookies utilizamos y cómo puedes gestionarlas.',
};

export default function CookiesPage() {
  return (
    <>
      <h1>Política de Cookies</h1>
      <p>
        <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Una cookie es un pequeño fichero de texto que un sitio web almacena en el navegador del usuario. Las cookies facilitan el uso y la navegación por una página web y son esenciales para el funcionamiento de internet, aportando innumerables ventajas en la prestación de servicios interactivos.
      </p>

      <h2>2. ¿Qué tipos de cookies utilizamos?</h2>
      <p>
        En Orientia, utilizamos los siguientes tipos de cookies:
      </p>
      <ul>
        <li>
          <strong>Cookies Esenciales:</strong> Son estrictamente necesarias para que la Plataforma funcione correctamente. Se utilizan para gestionar el inicio de sesión, la seguridad de la cuenta y garantizar la integridad de tus acciones. Sin estas cookies, los servicios que has solicitado no pueden proporcionarse.
        </li>
        <li>
          <strong>Cookies de Funcionalidad:</strong> Estas cookies permiten que la Plataforma recuerde las elecciones que haces (como tu nombre de usuario o tus preferencias de configuración) para proporcionar una experiencia más personal y mejorada. No recopilan información que pueda identificarte personalmente.
        </li>
        <li>
          <strong>Cookies de Rendimiento y Analíticas (Anónimas):</strong> Utilizamos cookies para recopilar información anónima sobre cómo los usuarios interactúan con nuestra Plataforma. Esto nos ayuda a entender qué páginas son más visitadas y cómo podemos mejorar el servicio. Todos los datos recogidos son agregados y, por lo tanto, anónimos.
        </li>
      </ul>

      <h2>3. ¿Cómo puedes gestionar las cookies?</h2>
      <p>
        Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador de Internet. A continuación, te ofrecemos enlaces en los que encontrarás información sobre cómo puedes activar tus preferencias en los principales navegadores:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari (Mac)</a></li>
      </ul>
      <p>
        Ten en cuenta que si deshabilitas las cookies, es posible que algunas funcionalidades de nuestra Plataforma, como mantener la sesión iniciada, no funcionen correctamente.
      </p>

      <h2>4. Cambios en la Política de Cookies</h2>
      <p>
        Podemos actualizar nuestra Política de Cookies en cualquier momento. Te recomendamos revisar esta política periódicamente para estar adecuadamente informado sobre cómo y para qué usamos las cookies.
      </p>

      <h2>5. Más Información</h2>
      <p>
        Para obtener más información sobre cómo tratamos tus datos personales, por favor, visita nuestra <Link href="/privacidad">Política de Privacidad</Link>.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Si tienes alguna duda sobre nuestra Política de Cookies, puedes contactarnos en <a href="mailto:legal@orientia.es">legal@orientia.es</a>.
      </p>
    </>
  );
}