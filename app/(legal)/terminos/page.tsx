import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Servicio',
  description: 'Lee los términos y condiciones para el uso de la plataforma Orientia. Entiende tus derechos y responsabilidades como usuario.',
};

export default function TermsPage() {
  return (
    <>
      <h1>Términos y Condiciones de Servicio</h1>
      <p>
        <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <p>
        Bienvenido a Orientia. Estos términos y condiciones describen las reglas y regulaciones para el uso de nuestra plataforma web (la &quot;Plataforma&quot;). Al acceder y utilizar esta Plataforma, aceptas estos términos y condiciones en su totalidad. No continúes usando Orientia si no aceptas todos los términos y condiciones establecidos en esta página.
      </p>

      <h2>1. Aceptación de los Términos</h2>
      <p>
        Al crear una cuenta o utilizar nuestros servicios, confirmas que has leído, entendido y aceptado estar sujeto a estos Términos. Si no estás de acuerdo con los Términos, no debes utilizar la Plataforma.
      </p>

      <h2>2. Descripción del Servicio</h2>
      <p>
        Orientia es una plataforma de software como servicio (SaaS) que utiliza inteligencia artificial para ayudar a los orientadores educativos a generar informes psicopedagógicos. El servicio incluye herramientas para la entrada de datos, procesamiento y generación de informes basados en plantillas profesionales.
      </p>

      <h2>3. Cuentas de Usuario y Responsabilidades</h2>
      <ul>
        <li>Debes ser un profesional de la educación o psicopedagogía para registrarte.</li>
        <li>Eres responsable de mantener la confidencialidad de tu contraseña y cuenta.</li>
        <li>Eres el único responsable de toda la actividad que ocurra bajo tu cuenta.</li>
        <li>Te comprometes a notificarnos inmediatamente cualquier uso no autorizado de tu cuenta.</li>
        <li>Como usuario, eres el responsable de obtener el consentimiento legalmente requerido de los tutores legales de los alumnos para tratar sus datos en la Plataforma.</li>
      </ul>

      <h2>4. Uso Aceptable</h2>
      <p>
        Te comprometes a no utilizar la Plataforma para ningún propósito ilegal o no autorizado. Aceptas cumplir con todas las leyes, normas y reglamentos locales, estatales, nacionales e internacionales aplicables. No debes:
      </p>
      <ul>
        <li>Introducir datos falsos, inexactos o engañosos.</li>
        <li>Intentar obtener acceso no autorizado a nuestros sistemas o redes.</li>
        <li>Utilizar la Plataforma de manera que pueda dañar, deshabilitar, sobrecargar o perjudicar el servicio.</li>
      </ul>

      <h2>5. Propiedad Intelectual</h2>
      <p>
        La Plataforma y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Orientia y sus licenciantes. El servicio está protegido por derechos de autor, marcas registradas y otras leyes tanto de España como de países extranjeros.
      </p>

      <h2>6. Confidencialidad y Protección de Datos</h2>
      <p>
        Tu privacidad y la de los datos que gestionas son de suma importancia para nosotros. Nuestro tratamiento de los datos personales se rige por nuestra <Link href="/privacidad">Política de Privacidad</Link>, que se incorpora por referencia en estos Términos.
      </p>

      <h2>7. Limitación de Responsabilidad</h2>
      <p>
        Orientia proporciona una herramienta de asistencia. La responsabilidad final sobre el contenido y la validez del informe psicopedagógico recae en el profesional que lo emite. En ningún caso Orientia será responsable de daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestro servicio.
      </p>

      <h2>8. Modificaciones del Servicio y Términos</h2>
      <p>
        Nos reservamos el derecho de modificar o descontinuar el Servicio (o cualquier parte del contenido) en cualquier momento sin previo aviso. También nos reservamos el derecho de modificar estos Términos en cualquier momento. La versión más reciente siempre estará disponible en esta página.
      </p>

      <h2>9. Terminación</h2>
      <p>
        Podemos suspender o cancelar tu acceso a la Plataforma inmediatamente, sin previo aviso ni responsabilidad, por cualquier motivo, incluido, entre otros, si incumples los Términos.
      </p>

      <h2>10. Ley Aplicable y Jurisdicción</h2>
      <p>
        Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa que surja de estos términos se someterá a la jurisdicción exclusiva de los tribunales de Sevilla, España.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Si tienes alguna pregunta sobre estos Términos, por favor contáctanos en <a href="mailto:legal@orientia.es">legal@orientia.es</a>.
      </p>
    </>
  );
}

