import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Compromiso con el RGPD',
  description: 'Descubre cómo Orientia cumple con el Reglamento General de Protección de Datos (RGPD) para garantizar la máxima seguridad y privacidad de tu información.',
};

export default function RgpdPage() {
  return (
    <>
      <h1>Compromiso con el Reglamento General de Protección de Datos (RGPD)</h1>
      <p>
        <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <p>
        En Orientia, la protección de los datos personales es una prioridad fundamental. Nos comprometemos a cumplir plenamente con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos (RGPD).
      </p>

      <h2>1. Nuestros Principios de Protección de Datos</h2>
      <p>
        Nuestro enfoque para la protección de datos se basa en los siguientes principios del RGPD:
      </p>
      <ul>
        <li><strong>Licitud, lealtad y transparencia:</strong> Tratamos los datos de forma lícita, leal y transparente.</li>
        <li><strong>Limitación de la finalidad:</strong> Recogemos datos con fines determinados, explícitos y legítimos.</li>
        <li><strong>Minimización de datos:</strong> Solo recogemos los datos adecuados, pertinentes y limitados a lo necesario.</li>
        <li><strong>Exactitud:</strong> Mantenemos los datos actualizados y exactos.</li>
        <li><strong>Limitación del plazo de conservación:</strong> No conservamos los datos más tiempo del necesario.</li>
        <li><strong>Integridad y confidencialidad:</strong> Garantizamos la seguridad de los datos mediante medidas técnicas y organizativas apropiadas.</li>
      </ul>

      <h2>2. Roles y Responsabilidades: Orientia como Encargado del Tratamiento</h2>
      <p>
        Es crucial entender los roles bajo el RGPD en el contexto de nuestra plataforma:
      </p>
      <ul>
        <li>
          <strong>Usted (el profesional/centro educativo):</strong> Actúa como <strong>Responsable del Tratamiento</strong> de los datos personales de los alumnos que introduce en la plataforma. Es su responsabilidad garantizar que tiene una base legal para tratar dichos datos, como el consentimiento explícito de los padres o tutores legales.
        </li>
        <li>
          <strong>Orientia:</strong> Actúa como <strong>Encargado del Tratamiento</strong>. Procesamos los datos en su nombre y siguiendo sus instrucciones para prestar el servicio contratado, pero no somos los propietarios ni los responsables finales de dichos datos.
        </li>
      </ul>
      <p>
        Nuestro acuerdo de tratamiento de datos, incluido en nuestros <Link href="/terminos">Términos de Servicio</Link>, detalla nuestras obligaciones como Encargado del Tratamiento.
      </p>

      <h2>3. Medidas de Seguridad</h2>
      <p>
        Hemos implementado un conjunto robusto de medidas de seguridad para proteger los datos, que incluyen cifrado de datos en tránsito y en reposo, servidores en la UE y controles de acceso estrictos. Para más detalles, consulta nuestra <Link href="/privacidad">Política de Privacidad</Link>.
      </p>

      <h2>4. Tus Derechos como Usuario</h2>
      <p>
        El RGPD te otorga una serie de derechos sobre tus datos personales. En nuestra <Link href="/privacidad">Política de Privacidad</Link> detallamos cómo puedes ejercer tus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición.
      </p>
      <p>
        Para cualquier consulta específica sobre el RGPD y cómo se aplica a tu uso de Orientia, no dudes en contactar con nuestro Delegado de Protección de Datos en <a href="mailto:privacidad@orientia.es">privacidad@orientia.es</a>.
      </p>
    </>
  );
}