import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eliminación de Datos de Usuario',
  description: 'Instrucciones sobre cómo solicitar la eliminación completa de tus datos de usuario y de los informes generados en la plataforma Orientia.',
};

export default function UserDataDeletionPage() {
  return (
    <>
      <h1>Eliminación de Datos de Usuario</h1>
      <p>
        <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <p>
        En Orientia, respetamos tu derecho a la privacidad y al control sobre tus datos personales. De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes el derecho a solicitar la supresión de tus datos personales (el &quot;derecho al olvido&quot;).
      </p>

      <h2>1. ¿Qué datos se eliminarán?</h2>
      <p>
        Al procesar tu solicitud de eliminación, se borrarán de forma permanente los siguientes datos asociados a tu cuenta:
      </p>
      <ul>
        <li><strong>Datos de tu cuenta:</strong> Nombre, dirección de correo electrónico y cualquier otra información de perfil que hayas proporcionado.</li>
        <li><strong>Informes generados:</strong> Todos los informes psicopedagógicos que hayas creado y almacenado en la plataforma.</li>
        <li><strong>Datos de uso:</strong> Cualquier registro de actividad asociado directamente a tu cuenta.</li>
      </ul>
      <p>
        Ten en cuenta que la eliminación de tu cuenta es un proceso irreversible. Una vez completado, no podrás recuperar tu cuenta ni los datos asociados a ella.
      </p>

      <h2>2. ¿Cómo solicitar la eliminación de tus datos?</h2>
      <p>
        Para solicitar la eliminación de tu cuenta y todos tus datos asociados, por favor, sigue estos pasos:
      </p>
      <ol>
        <li>Envía un correo electrónico a nuestra dirección de soporte dedicada a la privacidad: <a href="mailto:privacidad@orientia.es">privacidad@orientia.es</a>.</li>
        <li>En el asunto del correo, indica: &quot;Solicitud de Eliminación de Datos de Usuario&quot;.</li>
        <li>En el cuerpo del mensaje, por favor, incluye el correo electrónico asociado a la cuenta que deseas eliminar para que podamos verificar tu identidad.</li>
      </ol>
      <p>
        Por motivos de seguridad, la solicitud debe ser enviada desde la misma dirección de correo electrónico registrada en tu cuenta de Orientia.
      </p>

      <h2>3. Proceso y plazos</h2>
      <p>
        Una vez recibamos tu solicitud, nuestro equipo la procesará en un plazo máximo de 30 días, tal y como estipula el RGPD. Te enviaremos una confirmación por correo electrónico una vez que el proceso de eliminación se haya completado.
      </p>

      <h2>4. Más información</h2>
      <p>
        Para más detalles sobre tus derechos y cómo gestionamos tus datos, puedes consultar nuestra <Link href="/privacidad">Política de Privacidad</Link>.
      </p>
    </>
  );
}