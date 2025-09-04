import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RGPD – Cumplimiento y Protección de Datos',
  description:
    'Cumplimiento del RGPD y la LOPDGDD en Orientia: bases legales, acuerdos de encargo, medidas de seguridad, EIPD, derechos, transferencias y conservación.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: '/rgpd' },
};

export default function RGPDPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
          RGPD – Cumplimiento y Protección de Datos
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Última actualización:{' '}
          {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Índice navegable */}
        <nav aria-label="Tabla de contenidos" className="mb-10">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Contenido</p>
            <ul className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
              <li><a href="#marco" className="hover:underline">1. Marco normativo y alcance</a></li>
              <li><a href="#roles" className="hover:underline">2. Roles: Responsable vs. Encargado</a></li>
              <li><a href="#bases" className="hover:underline">3. Bases legales del tratamiento</a></li>
              <li><a href="#categorias" className="hover:underline">4. Categorías de datos tratados</a></li>
              <li><a href="#ropa" className="hover:underline">5. Registros de Actividades (RoPA)</a></li>
              <li><a href="#aet" className="hover:underline">6. Acuerdo de Encargo de Tratamiento (art. 28)</a></li>
              <li><a href="#eipd" className="hover:underline">7. EIPD/DPIA (art. 35)</a></li>
              <li><a href="#minimizacion" className="hover:underline">8. Minimización, exactitud y limitación</a></li>
              <li><a href="#conservacion" className="hover:underline">9. Conservación y supresión</a></li>
              <li><a href="#medidas" className="hover:underline">10. Medidas técnicas y organizativas</a></li>
              <li><a href="#brechas" className="hover:underline">11. Brechas de seguridad (arts. 33–34)</a></li>
              <li><a href="#derechos" className="hover:underline">12. Derechos de las personas (SLA y flujo)</a></li>
              <li><a href="#transferencias" className="hover:underline">13. Transferencias internacionales</a></li>
              <li><a href="#subencargados" className="hover:underline">14. Subencargados y control de proveedores</a></li>
              <li><a href="#menores" className="hover:underline">15. Tratamiento de datos de menores</a></li>
              <li><a href="#diseno" className="hover:underline">16. Privacidad desde el diseño y por defecto</a></li>
              <li><a href="#automatizacion" className="hover:underline">17. Perfiles y decisiones automatizadas</a></li>
              <li><a href="#formacion" className="hover:underline">18. Formación, confidencialidad y auditoría</a></li>
              <li><a href="#documentacion" className="hover:underline">19. Documentación, evidencias y versionado</a></li>
              <li><a href="#contacto" className="hover:underline">20. Contacto, DPO y autoridad de control</a></li>
              <li><a href="#glosario" className="hover:underline">Glosario RGPD</a></li>
            </ul>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 mb-8">
            Esta página explica de forma práctica cómo Orientia cumple el RGPD y la LOPDGDD en el contexto educativo andaluz.
            Completa y complementa la{' '}
            <Link href="/privacidad" className="text-primary-600 hover:underline">Política de Privacidad</Link>, la{' '}
            <Link href="/cookies" className="text-primary-600 hover:underline">Política de Cookies</Link> y los{' '}
            <Link href="/terminos" className="text-primary-600 hover:underline">Términos de Servicio</Link>.
          </div>

          <h2 id="marco" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            1. Marco normativo y alcance
          </h2>
          <p>
            Orientia se rige por el Reglamento (UE) 2016/679 (RGPD), la Ley Orgánica 3/2018 (LOPDGDD), la normativa ePrivacy, así como
            por las directrices y criterios de la Agencia Española de Protección de Datos (AEPD). Este marco se aplica al uso de Orientia
            por parte de docentes y centros educativos en Andalucía para la creación y gestión de informes psicopedagógicos y documentación asociada.
          </p>

          <h2 id="roles" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            2. Roles: Responsable vs. Encargado
          </h2>
          <p>
            <strong>Orientia como Responsable</strong>: respecto a cuentas de usuario, soporte, analítica operativa y facturación (B2B/B2C).
          </p>
          <p>
            <strong>Orientia como Encargado</strong>: respecto a <em>datos de alumnado y familias</em> incorporados en los informes
            y expedientes psicopedagógicos. En este caso, el <strong>Centro educativo</strong> o la Administración titular del fichero
            actúa como <strong>Responsable del tratamiento</strong>, y Orientia ejecuta las instrucciones del Responsable conforme al art. 28 RGPD.
          </p>

          <h2 id="bases" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            3. Bases legales del tratamiento
          </h2>
          <div className="overflow-x-auto not-prose">
            <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Finalidad</th>
                  <th className="p-3">Base jurídica (art. 6)</th>
                  <th className="p-3">Observaciones (art. 9 si aplica)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Gestión de cuentas y prestación del servicio</td>
                  <td className="p-3">Ejecución de contrato (6.1.b)</td>
                  <td className="p-3">Usuarios profesionales autorizados</td>
                </tr>
                <tr>
                  <td className="p-3">Facturación y obligaciones contables</td>
                  <td className="p-3">Obligación legal (6.1.c)</td>
                  <td className="p-3">Normativa fiscal/mercantil</td>
                </tr>
                <tr>
                  <td className="p-3">Mejora y seguridad del servicio</td>
                  <td className="p-3">Interés legítimo (6.1.f)</td>
                  <td className="p-3">Métricas agregadas, detección de abuso</td>
                </tr>
                <tr>
                  <td className="p-3">Datos de alumnado en informes</td>
                  <td className="p-3">Responsable: 6.1.e/6.1.c/6.1.b (según régimen jurídico)</td>
                  <td className="p-3">Si hay datos especiales: art. 9.2 (p.ej., g/h). Orientia: Encargado</td>
                </tr>
                <tr>
                  <td className="p-3">Comunicaciones comerciales (si aplica)</td>
                  <td className="p-3">Consentimiento (6.1.a)</td>
                  <td className="p-3">Revocable en cualquier momento</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="categorias" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            4. Categorías de datos tratados
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Identificativos de cuenta:</strong> nombre, apellidos, email, centro, rol.</li>
            <li><strong>Operativos:</strong> configuración, plantillas, actividad, logs.</li>
            <li><strong>Facturación (Stripe):</strong> datos de pago y facturas.</li>
            <li><strong>Soporte:</strong> comunicaciones y tickets.</li>
            <li><strong>Alumnado (encargo):</strong> identificativos, académicos, <em>y en su caso</em> datos especiales vinculados a valoración psicopedagógica.</li>
          </ul>

          <h2 id="ropa" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            5. Registros de Actividades de Tratamiento (RoPA)
          </h2>
          <p>
            Mantenemos un RoPA actualizado que describe finalidades, categorías, cesiones, transferencias, plazos, medidas y roles.
            El extracto correspondiente puede solicitarse a{' '}
            <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a>.
          </p>

          <h2 id="aet" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            6. Acuerdo de Encargo de Tratamiento (art. 28)
          </h2>
          <p>
            Con los centros educativos formalizamos un <strong>Acuerdo de Encargo de Tratamiento (AET/DPA)</strong> que incluye objeto, duración,
            naturaleza y fines del tratamiento; tipo de datos y categorías de interesados; medidas de seguridad; régimen de subencargados;
            asistencia en el ejercicio de derechos; notificación de brechas; retorno/supresión al finalizar el servicio; y auditorías razonables.
          </p>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 mb-6">
            Si necesita un modelo de AET, solicítelo a <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a>.
          </div>

          <h2 id="eipd" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            7. EIPD/DPIA (Evaluación de Impacto, art. 35)
          </h2>
          <p>
            Trabajamos con los Responsables para valorar si procede una EIPD, especialmente ante tratamiento <em>a gran escala</em> de datos de menores o
            uso de tecnologías nuevas. Cuando aplica, realizamos evaluación de riesgos y plan de mitigación (pseudonimización, controles de acceso reforzados, etc.).
          </p>
          <div className="overflow-x-auto not-prose mt-3">
            <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Riesgo</th>
                  <th className="p-3">Prob.</th>
                  <th className="p-3">Impacto</th>
                  <th className="p-3">Medidas de mitigación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Acceso no autorizado a informes</td>
                  <td className="p-3">Media</td>
                  <td className="p-3">Alto</td>
                  <td className="p-3">Cifrado, RBAC, MFA opcional, registros de acceso y alertas</td>
                </tr>
                <tr>
                  <td className="p-3">Pérdida de disponibilidad</td>
                  <td className="p-3">Baja</td>
                  <td className="p-3">Alto</td>
                  <td className="p-3">Backups, redundancia, plan de continuidad y DR</td>
                </tr>
                <tr>
                  <td className="p-3">Reidentificación tras anonimización</td>
                  <td className="p-3">Baja</td>
                  <td className="p-3">Medio</td>
                  <td className="p-3">Revisión k-anonimato, supresión de cuasi-identificadores</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="minimizacion" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            8. Minimización, exactitud y limitación de la finalidad
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Minimización:</strong> solo datos pertinentes y necesarios para la finalidad educativa.</li>
            <li><strong>Exactitud:</strong> procedimientos para corrección/actualización y control de versiones.</li>
            <li><strong>Limitación:</strong> bloqueos lógicos que evitan usos no previstos (p. ej., exportaciones restringidas).</li>
          </ul>

          <h2 id="conservacion" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            9. Conservación y supresión
          </h2>
          <p>
            Aplicamos periodos de conservación diferenciados y supresión/anonimización al expirar la necesidad. Como Encargado, seguimos
            las instrucciones del Responsable (devolución o borrado al fin del servicio, art. 28.3.g).
          </p>
          <div className="overflow-x-auto not-prose mt-3">
            <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Plazo orientativo</th>
                  <th className="p-3">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Cuenta/servicio</td>
                  <td className="p-3">Vida de la cuenta + bloqueo 3–6 años</td>
                  <td className="p-3">Atención de responsabilidades</td>
                </tr>
                <tr>
                  <td className="p-3">Facturación</td>
                  <td className="p-3">4–6 años</td>
                  <td className="p-3">Normativa fiscal/mercantil</td>
                </tr>
                <tr>
                  <td className="p-3">Logs de seguridad</td>
                  <td className="p-3">Hasta 12 meses</td>
                  <td className="p-3">Ampliable si hay incidentes</td>
                </tr>
                <tr>
                  <td className="p-3">Datos de alumnado</td>
                  <td className="p-3">Según instrucción del Responsable</td>
                  <td className="p-3">Retorno/supresión al finalizar el servicio</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Consulte también:{' '}
            <Link href="/eliminacion-de-datos-de-usuario" className="text-primary-600 hover:underline">Eliminación de Datos de Usuario</Link>.
          </p>

          <h2 id="medidas" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            10. Medidas técnicas y organizativas (art. 32)
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Cifrado:</strong> TLS en tránsito; cifrado en reposo en servicios gestionados; gestión segura de claves.</li>
            <li><strong>Control de acceso:</strong> RBAC, principio de mínimo privilegio, revisión periódica, MFA opcional para usuarios.</li>
            <li><strong>Seguridad de aplicación:</strong> revisiones de código, dependabot/CodeQL, SDLC con pruebas, cabeceras de seguridad.</li>
            <li><strong>Monitorización y registros:</strong> logs con retención limitada, alertas de anomalías, trazabilidad.</li>
            <li><strong>Backups y continuidad:</strong> copias cifradas, pruebas de restauración, plan de continuidad y DR.</li>
            <li><strong>Segregación de entornos:</strong> dev/staging/prod, datos reales no usados en desarrollo.</li>
            <li><strong>Políticas internas:</strong> control de dispositivos, acuerdos de confidencialidad, baja segura de personal.</li>
          </ul>

          <h2 id="brechas" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            11. Brechas de seguridad (arts. 33–34)
          </h2>
          <p>
            Procedimiento de respuesta a incidentes con <strong>evaluación en 24 h</strong>. Notificación a la AEPD <strong>en 72 h</strong> cuando proceda,
            y a las personas afectadas sin dilación si el riesgo es alto. Registro interno de incidentes y medidas correctivas.
          </p>
          <div className="overflow-x-auto not-prose mt-3">
            <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Ejemplo</th>
                  <th className="p-3">Comunicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Confidencialidad</td>
                  <td className="p-3">Acceso indebido a informe</td>
                  <td className="p-3">AEPD & usuarios si riesgo alto</td>
                </tr>
                <tr>
                  <td className="p-3">Integridad</td>
                  <td className="p-3">Alteración de registros</td>
                  <td className="p-3">AEPD si riesgo; aviso a responsables</td>
                </tr>
                <tr>
                  <td className="p-3">Disponibilidad</td>
                  <td className="p-3">Pérdida temporal de acceso</td>
                  <td className="p-3">Información operativa y medidas</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="derechos" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            12. Derechos de las personas (SLA y flujo)
          </h2>
          <p>
            Derechos: acceso, rectificación, supresión, oposición, limitación, portabilidad y no ser objeto de decisiones automatizadas.
            Canal: <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a>.
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li><strong>Ack inicial:</strong> 72 h laborables.</li>
            <li><strong>Resolución:</strong> máximo 30 días naturales (ampliable 60 días en casos complejos).</li>
            <li><strong>Identidad:</strong> verificación desde email registrado y, si procede, documentación mínima.</li>
            <li><strong>Datos de alumnado:</strong> tramitación a través del Responsable (centro); Orientia apoya como Encargado.</li>
          </ul>

          <h2 id="transferencias" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            13. Transferencias internacionales
          </h2>
          <p>
            Cuando intervienen proveedores fuera del EEE, aplicamos <strong>salvaguardas adecuadas</strong> (decisiones de adecuación o CCT/ SCCs de la UE)
            y evaluaciones de impacto de transferencia. Puede solicitar detalle a{' '}
            <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a>.
          </p>

          <h2 id="subencargados" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            14. Subencargados y control de proveedores
          </h2>
          <p>
            Utilizamos subencargados para funciones específicas. Mantenemos acuerdos art. 28, auditorías razonables y cláusulas de seguridad/privacidad.
            La lista vigente puede variar por razones operativas; comunicamos cambios materiales con antelación razonable.
          </p>
          <div className="overflow-x-auto not-prose mt-3">
            <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Proveedor</th>
                  <th className="p-3">Función</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Garantías</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Clerk</td>
                  <td className="p-3">Autenticación/gestión de sesión</td>
                  <td className="p-3">[UE/EE.UU.]</td>
                  <td className="p-3">CCT/adecuación, medidas técnicas</td>
                </tr>
                <tr>
                  <td className="p-3">Supabase</td>
                  <td className="p-3">BBDD/almacenamiento</td>
                  <td className="p-3">[UE/EE.UU.]</td>
                  <td className="p-3">CCT/adecuación, cifrado</td>
                </tr>
                <tr>
                  <td className="p-3">Vercel</td>
                  <td className="p-3">Hosting/CDN/analytics</td>
                  <td className="p-3">[UE/EE.UU.]</td>
                  <td className="p-3">CCT/adecuación, hardening</td>
                </tr>
                <tr>
                  <td className="p-3">Stripe</td>
                  <td className="p-3">Pagos/facturación</td>
                  <td className="p-3">UE/EE.UU.</td>
                  <td className="p-3">CCT/PCI DSS</td>
                </tr>
                <tr>
                  <td className="p-3">[Email transaccional]</td>
                  <td className="p-3">Envíos y métricas</td>
                  <td className="p-3">[UE/EE.UU.]</td>
                  <td className="p-3">CCT/adecuación</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="menores" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            15. Tratamiento de datos de menores
          </h2>
          <p>
            El alumnado <strong>no</strong> se registra en Orientia. Los datos de menores son tratados por Orientia como Encargado para fines educativos
            determinados por el Responsable. Se aplican salvaguardas reforzadas, minimización y restricciones de acceso.
          </p>

          <h2 id="diseno" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            16. Privacidad desde el diseño y por defecto (art. 25)
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>Configuraciones conservadoras por defecto (p. ej., visibilidad limitada, exportaciones deshabilitadas si no se habilitan).</li>
            <li>Revisión de nuevas funcionalidades con checklist RGPD y evaluación de riesgos.</li>
            <li>Pseudonimización y separación lógica de datos sensibles cuando procede.</li>
          </ul>

          <h2 id="automatizacion" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            17. Perfiles y decisiones automatizadas
          </h2>
          <p>
            Orientia <strong>no adopta decisiones con efectos jurídicos basadas exclusivamente en tratamientos automatizados</strong> sobre alumnado.
            Las funcionalidades de ayuda a la redacción u organización <em>no sustituyen</em> el criterio profesional. Cualquier analítica es agregada y
            con fines de mejora del servicio.
          </p>

          <h2 id="formacion" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            18. Formación, confidencialidad y auditoría
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>Cláusulas de confidencialidad para el personal con acceso a datos.</li>
            <li>Formación periódica en protección de datos y seguridad.</li>
            <li>Auditorías internas y revisiones de proveedores con base de riesgo.</li>
          </ul>

          <h2 id="documentacion" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            19. Documentación, evidencias y versionado
          </h2>
          <p>
            Conservamos evidencias de cumplimiento (registros, decisiones, notificaciones, controles, restauraciones de backup, etc.) y versionamos
            políticas y acuerdos. Las versiones vigentes están publicadas en el sitio y disponibles bajo solicitud.
          </p>

          <h2 id="contacto" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            20. Contacto, DPO y autoridad de control
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Responsable (datos de cuenta):</strong> ORIENTIA, [Nombre fiscal], NIF [NIF/CIF], [Dirección], Andalucía (España)</li>
            <li><strong>Email privacidad:</strong> <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a></li>
            <li><strong>DPO (si aplica):</strong> <a href="mailto:dpo@orientia.es" className="text-primary-600 hover:underline">dpo@orientia.es</a></li>
            <li><strong>Autoridad de control:</strong> <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">AEPD</a></li>
          </ul>

          <h2 id="glosario" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b">
            Glosario RGPD
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li><strong>Responsable:</strong> decide fines y medios del tratamiento.</li>
            <li><strong>Encargado:</strong> trata datos por cuenta del Responsable.</li>
            <li><strong>Datos especiales (art. 9):</strong> salud, origen étnico, etc.</li>
            <li><strong>EIPD/DPIA:</strong> evaluación de impacto en protección de datos.</li>
            <li><strong>RoPA:</strong> registro de actividades de tratamiento.</li>
            <li><strong>CCT/SCC:</strong> cláusulas contractuales tipo para transferencias.</li>
          </ul>

          <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumen práctico</h3>
            <p className="text-sm text-gray-600">
              Orientia actúa como Responsable para cuentas y facturación y como Encargado para datos de alumnado.
              Hay AET art. 28, medidas art. 32, respuesta a brechas en 72 h, EIPD cuando procede, RoPA actualizado,
              subencargados controlados, transferencias con garantías, y derechos atendidos con SLA claros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
