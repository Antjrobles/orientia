import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Eliminación de Datos de Usuario",
  description:
    "Información sobre cómo eliminar sus datos personales de Orientia.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: "/eliminacion-de-datos-de-usuario" },
};

export default function EliminacionDatosUsuarioPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
          Eliminación de Datos de Usuario
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Última actualización: 22 de mayo de 2024
        </p>

        {/* Índice navegable */}
        <nav aria-label="Tabla de contenidos" className="mb-10">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Contenido
            </p>
            <ul className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
              <li>
                <a href="#sec-1" className="hover:underline">
                  1. Su derecho a la eliminación
                </a>
              </li>
              <li>
                <a href="#sec-2" className="hover:underline">
                  2. Qué datos almacenamos
                </a>
              </li>
              <li>
                <a href="#sec-3" className="hover:underline">
                  3. Proceso de eliminación
                </a>
              </li>
              <li>
                <a href="#sec-4" className="hover:underline">
                  4. Tiempos de procesamiento
                </a>
              </li>
              <li>
                <a href="#sec-5" className="hover:underline">
                  5. Datos que no podemos eliminar
                </a>
              </li>
              <li>
                <a href="#sec-6" className="hover:underline">
                  6. Consecuencias de la eliminación
                </a>
              </li>
              <li>
                <a href="#sec-7" className="hover:underline">
                  7. Eliminación parcial de datos
                </a>
              </li>
              <li>
                <a href="#sec-8" className="hover:underline">
                  8. Verificación de identidad
                </a>
              </li>
              <li>
                <a href="#sec-9" className="hover:underline">
                  9. Datos de terceros
                </a>
              </li>
              <li>
                <a href="#sec-10" className="hover:underline">
                  10. Cómo solicitar la eliminación
                </a>
              </li>
              <li>
                <a href="#sec-11" className="hover:underline">
                  11. Contacto y soporte
                </a>
              </li>
              <li>
                <a href="#preguntas-frecuentes" className="hover:underline">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none">
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 mb-8">
            <strong>Importante:</strong> La eliminación de sus datos es{" "}
            <strong>irreversible</strong>. Una vez procesada su solicitud, no
            podremos recuperar su cuenta, actividades creadas, o cualquier
            contenido asociado. Por favor, lea cuidadosamente esta información
            antes de proceder.
          </div>

          <h2
            id="sec-1"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            1. Su derecho a la eliminación
          </h2>
          <p>
            Conforme al Reglamento General de Protección de Datos (GDPR) y la
            normativa española de protección de datos, usted tiene derecho a
            solicitar la eliminación de sus datos personales de nuestros
            sistemas. Este derecho, también conocido como "derecho al olvido",
            le permite recuperar el control sobre su información personal.
          </p>
          <p>
            En <em>orientia.es</em> respetamos este derecho y hemos establecido
            procedimientos claros para procesar su solicitud de manera eficiente
            y segura.
          </p>

          <h2
            id="sec-2"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            2. Qué datos almacenamos
          </h2>
          <p>
            Antes de solicitar la eliminación, es importante que comprenda qué
            información personal tenemos almacenada:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Datos de cuenta:</strong> Nombre, apellidos, email, centro
              educativo, y preferencias de usuario.
            </li>
            <li>
              <strong>Contenido generado:</strong> Actividades educativas
              creadas, plantillas guardadas, y configuraciones personalizadas.
            </li>
            <li>
              <strong>Datos de suscripción:</strong> Información de facturación,
              historial de pagos (gestionado por Stripe).
            </li>
            <li>
              <strong>Datos de uso:</strong> Registros de actividad,
              estadísticas de uso agregadas, y logs técnicos.
            </li>
            <li>
              <strong>Comunicaciones:</strong> Correos electrónicos
              intercambiados con nuestro soporte.
            </li>
          </ul>

          <h2
            id="sec-3"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            3. Proceso de eliminación
          </h2>
          <p>
            Una vez recibamos su solicitud de eliminación, seguiremos este
            proceso estructurado:
          </p>
          <ol className="list-decimal list-outside ml-5 space-y-4">
            <li>
              <strong>Verificación de identidad:</strong> Confirmaremos su
              identidad para proteger contra solicitudes fraudulentas.
            </li>
            <li>
              <strong>Evaluación de la solicitud:</strong> Revisaremos si
              existen obligaciones legales que requieran conservar ciertos
              datos.
            </li>
            <li>
              <strong>Notificación previa:</strong> Le informaremos sobre qué
              datos se eliminarán y cuáles podrían conservarse por razones
              legales.
            </li>
            <li>
              <strong>Período de gracia:</strong> Dispondrá de 7 días para
              cancelar la solicitud si cambia de opinión.
            </li>
            <li>
              <strong>Eliminación ejecutada:</strong> Procederemos a la
              eliminación irreversible de sus datos personales.
            </li>
            <li>
              <strong>Confirmación:</strong> Le enviaremos una confirmación una
              vez completado el proceso.
            </li>
          </ol>

          <h2
            id="sec-4"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            4. Tiempos de procesamiento
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Respuesta inicial:</strong> Dentro de 72 horas laborables
              desde la recepción de su solicitud.
            </li>
            <li>
              <strong>Verificación de identidad:</strong> Hasta 5 días
              laborables si necesitamos documentación adicional.
            </li>
            <li>
              <strong>Eliminación completa:</strong> Hasta 30 días naturales
              desde la confirmación de su solicitud.
            </li>
            <li>
              <strong>Datos en copias de seguridad:</strong> Hasta 90 días
              adicionales para eliminación completa de backups.
            </li>
          </ul>

          <h2
            id="sec-5"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            5. Datos que no podemos eliminar inmediatamente
          </h2>
          <p>
            Por obligaciones legales y normativas, ciertos datos pueden
            conservarse por períodos específicos:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Datos fiscales y de facturación:</strong> Conservados
              durante 4-6 años según la normativa fiscal española.
            </li>
            <li>
              <strong>Registros de transacciones:</strong> Mantenidos por Stripe
              según sus políticas de retención y normativas financieras.
            </li>
            <li>
              <strong>Logs de seguridad:</strong> Conservados hasta 12 meses
              para investigaciones de seguridad cuando sea necesario.
            </li>
            <li>
              <strong>Datos anonimizados:</strong> Estadísticas agregadas que no
              permiten su identificación personal.
            </li>
          </ul>

          <h2
            id="sec-6"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            6. Consecuencias de la eliminación
          </h2>
          <p>
            Es fundamental que comprenda las implicaciones de eliminar sus
            datos:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Pérdida de acceso permanente:</strong> No podrá acceder a
              su cuenta ni recuperarla en el futuro.
            </li>
            <li>
              <strong>Contenido eliminado:</strong> Todas las actividades,
              plantillas y configuraciones se perderán para siempre.
            </li>
            <li>
              <strong>Suscripción cancelada:</strong> Su suscripción activa será
              cancelada inmediatamente sin reembolso.
            </li>
            <li>
              <strong>Nueva cuenta:</strong> Si desea volver a usar el servicio,
              deberá crear una cuenta completamente nueva.
            </li>
            <li>
              <strong>Soporte limitado:</strong> No podremos proporcionar
              soporte sobre contenido o configuraciones previas.
            </li>
          </ul>

          <h2
            id="sec-7"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            7. Eliminación parcial de datos
          </h2>
          <p>
            En algunos casos, puede solicitar la eliminación de categorías
            específicas de datos en lugar de una eliminación completa:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Solo datos de perfil:</strong> Manteniendo el contenido
              creado pero anonimizado.
            </li>
            <li>
              <strong>Solo actividades específicas:</strong> Eliminación
              selectiva de contenido generado.
            </li>
            <li>
              <strong>Solo datos de comunicación:</strong> Eliminación del
              historial de correos electrónicos.
            </li>
          </ul>
          <p>
            <em>Nota:</em> La eliminación parcial puede no estar disponible en
            todos los casos y dependerá de la viabilidad técnica.
          </p>

          <h2
            id="sec-8"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            8. Verificación de identidad
          </h2>
          <p>
            Para proteger su privacidad y evitar eliminaciones no autorizadas,
            requeriremos:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>Solicitud desde el email registrado en la cuenta.</li>
            <li>
              Confirmación de datos específicos de la cuenta (nombre, centro
              educativo, fecha de registro aproximada).
            </li>
            <li>
              En casos dudosos, copia de documento de identidad (DNI/NIE) que
              será eliminada tras la verificación.
            </li>
          </ul>

          <h2
            id="sec-9"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            9. Datos en servicios de terceros
          </h2>
          <p>
            Algunos de sus datos pueden estar almacenados en servicios de
            terceros que utilizamos:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Clerk (autenticación):</strong> Procederemos a eliminar su
              perfil de usuario y sesiones.
            </li>
            <li>
              <strong>Stripe (pagos):</strong> Los datos de facturación seguirán
              las políticas de retención de Stripe.
            </li>
            <li>
              <strong>Supabase (base de datos):</strong> Eliminación completa de
              registros y archivos asociados.
            </li>
            <li>
              <strong>Vercel (hosting):</strong> Purga de logs y métricas que
              puedan contener datos identificables.
            </li>
          </ul>

          <h2
            id="sec-10"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            10. Cómo solicitar la eliminación
          </h2>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 mb-6">
            <strong>Método principal:</strong> Envíe un correo electrónico a{" "}
            <a
              href="mailto:eliminacion@orientia.es"
              className="font-semibold underline"
            >
              eliminacion@orientia.es
            </a>{" "}
            desde la dirección de email registrada en su cuenta.
          </div>

          <p>
            <strong>Información requerida en su solicitud:</strong>
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              Asunto: "Solicitud de eliminación de datos - [Su nombre completo]"
            </li>
            <li>
              Confirmación de que desea eliminar todos sus datos permanentemente
            </li>
            <li>Nombre completo registrado en la cuenta</li>
            <li>Centro educativo asociado a la cuenta</li>
            <li>Fecha aproximada de registro en la plataforma</li>
            <li>
              Motivo de la eliminación (opcional pero nos ayuda a mejorar)
            </li>
          </ul>

          <p>
            <strong>Métodos alternativos:</strong>
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Formulario web:</strong> Disponible en{" "}
              <Link
                href="/formulario-eliminacion-datos"
                className="text-primary-600 hover:underline"
              >
                nuestro formulario de eliminación
              </Link>
            </li>
            <li>
              <strong>Correo certificado:</strong> Para casos que requieran
              documentación adicional:
              <br />
              Orientia - Eliminación de Datos
              <br />
              C/ [Dirección postal]
              <br />
              [Código Postal] [Ciudad], Andalucía
            </li>
          </ul>

          <h2
            id="sec-11"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            11. Contacto y soporte
          </h2>
          <p>
            Si tiene dudas sobre el proceso de eliminación o necesita
            asistencia:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Email de eliminación:</strong>{" "}
              <a
                href="mailto:eliminacion@orientia.es"
                className="text-primary-600 hover:underline"
              >
                eliminacion@orientia.es
              </a>
            </li>
            <li>
              <strong>Soporte general:</strong>{" "}
              <a
                href="mailto:soporte@orientia.es"
                className="text-primary-600 hover:underline"
              >
                soporte@orientia.es
              </a>
            </li>
            <li>
              <strong>Protección de datos:</strong>{" "}
              <a
                href="mailto:privacidad@orientia.es"
                className="text-primary-600 hover:underline"
              >
                privacidad@orientia.es
              </a>
            </li>
            <li>
              <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 -
              18:00 (CET)
            </li>
          </ul>

          <h2
            id="preguntas-frecuentes"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Puedo recuperar mi cuenta después de la eliminación?
              </h3>
              <p>
                No, la eliminación es completamente irreversible. Una vez
                procesada, no existe manera de recuperar su cuenta, datos o
                contenido.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Qué pasa con mi suscripción activa?
              </h3>
              <p>
                Su suscripción será cancelada inmediatamente sin derecho a
                reembolso del período no utilizado, salvo casos excepcionales
                contemplados en nuestros términos de servicio.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Puedo exportar mis datos antes de eliminarlos?
              </h3>
              <p>
                Sí, recomendamos encarecidamente solicitar una copia de sus
                datos personales antes de proceder con la eliminación. Puede
                hacerlo a través de{" "}
                <a
                  href="mailto:privacidad@orientia.es"
                  className="text-primary-600 hover:underline"
                >
                  privacidad@orientia.es
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Cuánto tiempo tardan en eliminar mis datos de las copias de
                seguridad?
              </h3>
              <p>
                Los datos principales se eliminan en un máximo de 30 días. Las
                copias de seguridad pueden tardar hasta 90 días adicionales en
                purgar completamente sus datos.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Qué datos conservarán por obligación legal?
              </h3>
              <p>
                Principalmente datos fiscales y de facturación (4-6 años),
                registros de transacciones financieras según normativas
                bancarias, y logs de seguridad cuando sean necesarios para
                investigaciones (máximo 12 meses).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Puedo cambiar de opinión después de enviar la solicitud?
              </h3>
              <p>
                Sí, tiene un período de gracia de 7 días desde la confirmación
                de su solicitud para cancelar el proceso de eliminación. Una vez
                transcurrido este período, el proceso será irreversible.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ⚠️ Recordatorio importante
            </h3>
            <p className="text-sm text-gray-600">
              La eliminación de datos es una acción permanente e irreversible.
              Asegúrese de haber exportado cualquier contenido que desee
              conservar antes de proceder. Nuestro equipo está disponible para
              resolver cualquier duda antes de que tome esta decisión.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
