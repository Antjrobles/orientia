import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Información sobre cómo tratamos los datos personales en Orientia y cómo protegemos su privacidad.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center sm:text-left">
          Política de Privacidad
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Índice navegable */}
        <nav aria-label="Tabla de contenidos" className="mb-10">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Contenido</p>
            <ul className="grid gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
              <li><a href="#quien" className="hover:underline">1. Quién es el responsable</a></li>
              <li><a href="#alcance" className="hover:underline">2. Alcance y usuarios</a></li>
              <li><a href="#datos" className="hover:underline">3. Datos que tratamos</a></li>
              <li><a href="#finalidades" className="hover:underline">4. Finalidades y bases legales</a></li>
              <li><a href="#plazos" className="hover:underline">5. Plazos de conservación</a></li>
              <li><a href="#destinatarios" className="hover:underline">6. Destinatarios y subencargados</a></li>
              <li><a href="#transferencias" className="hover:underline">7. Transferencias internacionales</a></li>
              <li><a href="#derechos" className="hover:underline">8. Sus derechos</a></li>
              <li><a href="#seguridad" className="hover:underline">9. Seguridad</a></li>
              <li><a href="#menores" className="hover:underline">10. Menores</a></li>
              <li><a href="#cookies" className="hover:underline">11. Cookies</a></li>
              <li><a href="#cambios" className="hover:underline">12. Cambios en la política</a></li>
              <li><a href="#contacto" className="hover:underline">13. Contacto y reclamaciones</a></li>
            </ul>
          </div>
        </nav>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300 mb-8">
            <strong>Transparencia:</strong> En Orientia protegemos su información personal y cumplimos con el Reglamento (UE) 2016/679 (GDPR) y la LOPDGDD (Ley Orgánica 3/2018).
          </div>

          <h2 id="quien" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            1. Quién es el responsable del tratamiento
          </h2>
          <p>
            <strong>Responsable:</strong> ORIENTIA, [Nombre fiscal o persona jurídica] (<em>“Orientia”</em>)<br />
            <strong>NIF/CIF:</strong> [NIF/CIF]<br />
            <strong>Domicilio:</strong> [Dirección postal], [CP] [Ciudad], Andalucía, España<br />
            <strong>Email privacidad:</strong> <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a><br />
            <strong>Delegado/a de Protección de Datos (si aplica):</strong> <a href="mailto:dpo@orientia.es" className="text-primary-600 hover:underline">dpo@orientia.es</a>
          </p>
          <p>
            <strong>Importante (doble rol):</strong> Orientia actúa como <em>Responsable</em> respecto de los datos de su cuenta, facturación y soporte.
            Respecto de los <em>datos de alumnado</em> incluidos en los informes psicopedagógicos, Orientia actúa como <em>Encargado del Tratamiento</em>
            por cuenta del centro educativo o docente (que es el <em>Responsable</em>). Este tratamiento se sujeta a un <strong>acuerdo de encargo</strong> conforme al art. 28 GDPR.
          </p>

          <h2 id="alcance" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            2. Alcance y usuarios
          </h2>
          <p>
            Esta política aplica a usuarios docentes y personal autorizado que utiliza Orientia para crear informes psicopedagógicos en el contexto educativo de Andalucía,
            así como a quienes visitan <em>orientia.es</em> y áreas autenticadas de la plataforma.
          </p>

          <h2 id="datos" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            3. Datos que tratamos
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Cuenta:</strong> nombre, apellidos, email, centro educativo, rol, preferencias.</li>
            <li><strong>Uso del servicio:</strong> configuración, plantillas, informes creados, registros de actividad y métricas técnicas (logs).</li>
            <li><strong>Facturación (Stripe):</strong> datos de pago y facturación necesarios para la gestión de suscripciones.</li>
            <li><strong>Soporte:</strong> comunicaciones con el equipo de atención (emails, tickets).</li>
            <li><strong>Datos de alumnado (encargo):</strong> datos identificativos y académicos; en su caso, <em>datos especiales</em> vinculados a valoración psicopedagógica (art. 9 GDPR) tratados <strong>exclusivamente</strong> bajo instrucciones del centro docente Responsable.</li>
          </ul>

          <h2 id="finalidades" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            4. Finalidades y bases legales
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Provisión del servicio</strong> (gestión de cuentas, autenticación, generación de informes): <em>ejecución de contrato</em> (art. 6.1.b GDPR).</li>
            <li><strong>Facturación y contabilidad:</strong> <em>obligación legal</em> (art. 6.1.c GDPR).</li>
            <li><strong>Soporte y comunicaciones operativas:</strong> <em>interés legítimo</em> (art. 6.1.f) y/o <em>contrato</em>.</li>
            <li><strong>Mejora del producto y seguridad:</strong> <em>interés legítimo</em> (monitorización, prevención de fraude/abuso).</li>
            <li><strong>Comunicaciones comerciales</strong> (si las hubiera): <em>consentimiento</em> (art. 6.1.a), revocable en cualquier momento.</li>
            <li><strong>Datos de alumnado (encargo):</strong> prestación de servicios educativos por el centro (art. 6.1.e o 6.1.c/6.1.b según el caso) y, si hay datos especiales, amparo en art. 9.2 (por ejemplo 9.2.g/h); Orientia no decide fines ni medios, solo los ejecuta por cuenta del centro Responsable.</li>
          </ul>

          <h2 id="plazos" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            5. Plazos de conservación
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Cuenta/servicio:</strong> mientras esté activa y, tras baja, bloqueados el tiempo necesario para atender responsabilidades (p.ej., 3–6 años).</li>
            <li><strong>Facturación:</strong> 4–6 años según normativa fiscal/mercantil.</li>
            <li><strong>Logs de seguridad:</strong> hasta 12 meses, salvo incidencias.</li>
            <li><strong>Datos de alumnado (encargo):</strong> según instrucción del centro Responsable; a la finalización del servicio, <em>supresión o devolución</em> (art. 28.3.g GDPR).</li>
          </ul>

          <h2 id="destinatarios" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            6. Destinatarios y subencargados
          </h2>
          <p>
            Compartimos datos solo cuando es necesario para prestar el servicio o por obligación legal. Proveedores principales (subencargados) habituales:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Clerk</strong> (autenticación/gestión de usuarios).</li>
            <li><strong>Supabase</strong> (base de datos y almacenamiento).</li>
            <li><strong>Vercel</strong> (hosting y entrega de contenidos).</li>
            <li><strong>Stripe</strong> (pagos y facturación).</li>
            <li>[Proveedor de email transaccional, p.ej. <strong>Resend</strong>/<strong>SendGrid</strong>].</li>
          </ul>
          <p>
            Mantenemos acuerdos de tratamiento con estos proveedores conforme al art. 28 GDPR. La lista actualizada puede solicitarse a{' '}
            <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a>.
          </p>

          <h2 id="transferencias" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            7. Transferencias internacionales
          </h2>
          <p>
            Si algún proveedor trata datos fuera del EEE, garantizamos salvaguardas adecuadas (decisiones de adecuación o <em>Cláusulas Contractuales Tipo</em> de la UE).
            Puede consultar las garantías aplicables contactando con <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a>.
          </p>

          <h2 id="derechos" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            8. Sus derechos
          </h2>
          <p>
            Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación, portabilidad y a no ser objeto de decisiones automatizadas,
            enviando un email a <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a> desde la dirección asociada a su cuenta.
          </p>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-300 mb-6">
            <strong>Nota sobre datos de alumnado:</strong> si su solicitud afecta a datos incluidos en informes escolares, debe dirigirse al <strong>centro educativo Responsable</strong>,
            que es quien determina los fines del tratamiento. Orientia, como Encargado, trasladará y apoyará dicha solicitud.
          </div>

          <h2 id="seguridad" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            9. Seguridad
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>Cifrado en tránsito (HTTPS/TLS) y, cuando procede, cifrado en reposo.</li>
            <li>Controles de acceso basados en roles y registros de actividad.</li>
            <li>Backups y planes de continuidad/recuperación.</li>
            <li>Formación y procedimientos internos de confidencialidad.</li>
          </ul>

          <h2 id="menores" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            10. Menores
          </h2>
          <p>
            El registro de cuentas está dirigido a profesionales autorizados. El alumnado no debe registrarse directamente en Orientia.
            Los datos de menores se tratan únicamente en el marco del encargo con el centro educativo Responsable.
          </p>

          <h2 id="cookies" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            11. Cookies
          </h2>
          <p>
            Consulte la <Link href="/cookies" className="text-primary-600 hover:underline">Política de Cookies</Link> para conocer el detalle sobre cookies propias y de terceros,
            fines y opciones de configuración.
          </p>

          <h2 id="cambios" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            12. Cambios en esta política
          </h2>
          <p>
            Podemos actualizar esta política para reflejar mejoras o cambios normativos. Publicaremos la versión vigente en esta página, indicando la fecha de última actualización.
          </p>

          <h2 id="contacto" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
            13. Contacto y reclamaciones
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Privacidad:</strong> <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a></li>
            <li><strong>DPO (si aplica):</strong> <a href="mailto:dpo@orientia.es" className="text-primary-600 hover:underline">dpo@orientia.es</a></li>
            <li><strong>Autoridad de control:</strong> Puede reclamar ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">AEPD</a>.</li>
            <li><strong>Dirección postal:</strong> [Dirección postal], [CP] [Ciudad], Andalucía, España.</li>
          </ul>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Resumen rápido</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Tratamos los datos necesarios para prestar Orientia y cumplir la ley; con datos de alumnado actuamos como Encargado, siguiendo instrucciones del centro.
              Puede ejercer sus derechos escribiendo a privacidad@orientia.es.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
