import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Conoce cómo Orientia protege y gestiona tus datos personales y los de tus informes psicopedagógicos. Cumplimiento RGPD garantizado.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Política de Privacidad</h1>
      <p>
        <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <p>
        En Orientia (&quot;nosotros&quot;, &quot;nuestro&quot;), nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos tu información cuando utilizas nuestra plataforma web (la &quot;Plataforma&quot;).
      </p>

      <h2>1. Responsable del Tratamiento</h2>
      <p>
        El responsable del tratamiento de tus datos personales es Orientia, con domicilio en Sevilla, España. Para cualquier consulta relacionada con la protección de datos, puedes contactarnos en <a href="mailto:privacidad@orientia.es">privacidad@orientia.es</a>.
      </p>

      <h2>2. Información que Recopilamos</h2>
      <p>
        Recopilamos información sobre ti de varias maneras cuando utilizas nuestra Plataforma:
      </p>
      <h3>Datos que nos proporcionas directamente:</h3>
      <ul>
        <li>
          <strong>Datos de Registro:</strong> Cuando creas una cuenta, recopilamos tu nombre, dirección de correo electrónico y contraseña (cifrada).
        </li>
        <li>
          <strong>Datos de los Informes:</strong> Para generar los informes psicopedagógicos, la Plataforma procesa la información que introduces sobre los alumnos. Tú, como usuario, eres el responsable de haber obtenido el consentimiento legalmente requerido para tratar dichos datos. Orientia actúa como encargado del tratamiento.
        </li>
      </ul>
      <h3>Datos que recopilamos automáticamente:</h3>
      <ul>
        <li>
          <strong>Datos de Uso:</strong> Recopilamos información sobre cómo utilizas la Plataforma, como las funciones que usas y el tiempo que pasas en ella, para mejorar nuestro servicio.
        </li>
        <li>
          <strong>Datos del Dispositivo:</strong> Información sobre tu dispositivo, como la dirección IP, el tipo de navegador y el sistema operativo.
        </li>
      </ul>

      <h2>3. Cómo Utilizamos tu Información</h2>
      <p>
        Usamos la información que recopilamos para:
      </p>
      <ul>
        <li>Proporcionar, operar y mantener nuestra Plataforma.</li>
        <li>Generar los informes psicopedagógicos solicitados.</li>
        <li>Mejorar, personalizar y ampliar nuestra Plataforma.</li>
        <li>Comunicarnos contigo, ya sea directamente o a través de uno de nuestros socios, incluso para el servicio de atención al cliente, para proporcionarte actualizaciones y otra información relacionada con la Plataforma.</li>
        <li>Cumplir con nuestras obligaciones legales y resolver disputas.</li>
      </ul>

      <h2>4. Base Legal para el Tratamiento</h2>
      <p>
        Tratamos tus datos personales basándonos en las siguientes bases legales:
      </p>
      <ul>
        <li>
          <strong>Ejecución de un contrato:</strong> El tratamiento es necesario para cumplir con nuestros <Link href="/terminos">Términos de Servicio</Link>.
        </li>
        <li>
          <strong>Consentimiento:</strong> Para el tratamiento de los datos de los alumnos, confíamos en que has obtenido el consentimiento explícito de los tutores legales.
        </li>
        <li>
          <strong>Interés legítimo:</strong> Para mejorar nuestra plataforma y para fines de seguridad.
        </li>
      </ul>

      <h2>5. Seguridad de los Datos</h2>
      <p>
        Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos. Todos los datos se almacenan en servidores seguros ubicados en la Unión Europea y se cifran tanto en tránsito como en reposo. Cumplimos estrictamente con el Reglamento General de Protección de Datos (RGPD).
      </p>

      <h2>6. Tus Derechos de Protección de Datos</h2>
      <p>
        De acuerdo con el RGPD, tienes los siguientes derechos:
      </p>
      <ul>
        <li><strong>Derecho de acceso:</strong> Puedes solicitar una copia de los datos personales que tenemos sobre ti.</li>
        <li><strong>Derecho de rectificación:</strong> Puedes solicitar que corrijamos cualquier información que consideres inexacta.</li>
        <li><strong>Derecho de supresión (al olvido):</strong> Puedes solicitar que eliminemos tus datos personales, bajo ciertas condiciones.</li>
        <li><strong>Derecho a la limitación del tratamiento:</strong> Puedes solicitar que restrinjamos el tratamiento de tus datos.</li>
        <li><strong>Derecho a la portabilidad de los datos:</strong> Puedes solicitar que transfiramos los datos que hemos recopilado a otra organización, o directamente a ti.</li>
      </ul>
      <p>
        Para ejercer cualquiera de estos derechos, por favor, contáctanos en <a href="mailto:privacidad@orientia.es">privacidad@orientia.es</a>.
      </p>

      <h2>7. Política de Cookies</h2>
      <p>
        Utilizamos cookies para mejorar tu experiencia en nuestra Plataforma. Para más información, por favor, consulta nuestra <Link href="/cookies">Política de Cookies</Link>.
      </p>

      <h2>8. Cambios en esta Política de Privacidad</h2>
      <p>
        Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de &quot;Última actualización&quot;.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos en:
        <br />
        Orientia
        <br />
        Email: <a href="mailto:privacidad@orientia.es">privacidad@orientia.es</a>
      </p>
    </>
  );
}