import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description:
    'Información detallada sobre el uso de cookies y tecnologías similares en Orientia: tipos, finalidades, duración, gestión del consentimiento y cómo configurarlas.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: '/cookies' },
};

export default function PoliticaCookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
          Política de Cookies
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
              <li><a href="#que-son" className="hover:underline">1. ¿Qué son las cookies?</a></li>
              <li><a href="#tecnologias" className="hover:underline">2. Tecnologías similares</a></li>
              <li><a href="#tipos" className="hover:underline">3. Tipos de cookies</a></li>
              <li><a href="#bases-legales" className="hover:underline">4. Bases legales y obtención del consentimiento</a></li>
              <li><a href="#como-usamos" className="hover:underline">5. Cómo usamos las cookies en Orientia</a></li>
              <li><a href="#lista" className="hover:underline">6. Listado orientativo de cookies</a></li>
              <li><a href="#gestionar" className="hover:underline">7. Cómo gestionar o revocar el consentimiento</a></li>
              <li><a href="#navegadores" className="hover:underline">8. Configuración en navegadores</a></li>
              <li><a href="#retencion" className="hover:underline">9. Duración y retención</a></li>
              <li><a href="#terceros" className="hover:underline">10. Cookies de terceros e integraciones</a></li>
              <li><a href="#transferencias" className="hover:underline">11. Transferencias internacionales</a></li>
              <li><a href="#gpc-dnt" className="hover:underline">12. Señales GPC y Do Not Track</a></li>
              <li><a href="#cambios" className="hover:underline">13. Cambios en esta política</a></li>
              <li><a href="#contacto" className="hover:underline">14. Contacto y reclamaciones</a></li>
            </ul>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 mb-8">
            En Orientia utilizamos cookies y tecnologías similares para garantizar el funcionamiento del servicio, recordar sus preferencias,
            mejorar la experiencia, obtener estadísticas de uso y, cuando lo consienta, ofrecer funcionalidades avanzadas. Esta política
            complementa la <Link href="/privacidad" className="text-primary-600 hover:underline">Política de Privacidad</Link> y los{' '}
            <Link href="/terminos" className="text-primary-600 hover:underline">Términos de Servicio</Link>.
          </div>

          <h2 id="que-son" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            1. ¿Qué son las cookies?
          </h2>
          <p>
            Las cookies son pequeños archivos de texto que el sitio web coloca en su dispositivo (ordenador, tablet, móvil) cuando lo visita.
            Permiten almacenar y recuperar información para reconocer su navegador, mantener la sesión iniciada, recordar preferencias,
            o medir el uso del servicio. Pueden ser <strong>de sesión</strong> (se borran al cerrar el navegador) o <strong>persistentes</strong>
            (permanecen durante un tiempo definido).
          </p>

          <h2 id="tecnologias" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            2. Tecnologías similares
          </h2>
          <p>
            Además de cookies, usamos (o podemos usar) tecnologías equivalentes con objetivos similares:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>LocalStorage y SessionStorage:</strong> almacenamiento del navegador para preferencias/configuración.</li>
            <li><strong>IndexedDB:</strong> almacenamiento local de datos para mejorar rendimiento offline/online.</li>
            <li><strong>Web Beacons / Pixel tags:</strong> pequeñas imágenes o fragmentos de código para métricas agregadas.</li>
            <li><strong>SDKs de terceros:</strong> bibliotecas que añaden autenticación, pagos, analítica, etc.</li>
          </ul>
          <p>
            <em>No empleamos técnicas de “fingerprinting” con fines publicitarios</em>. Si en algún momento resultara necesario para seguridad/fraude,
            lo indicaríamos expresamente y lo limitaríamos a intereses legítimos estrictos.
          </p>

          <h2 id="tipos" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            3. Tipos de cookies (clasificación)
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Estrictamente necesarias:</strong> imprescindibles para la operativa del sitio (autenticación, seguridad, balanceo).</li>
            <li><strong>Preferencias o funcionales:</strong> recuerdan ajustes (idioma, vista, últimas selecciones).</li>
            <li><strong>Analíticas o de medición:</strong> nos ayudan a entender el uso del servicio de forma agregada.</li>
            <li><strong>Rendimiento:</strong> optimizan la carga, caché y calidad de la experiencia.</li>
            <li><strong>Seguridad/Anti-fraude:</strong> detectan actividad anómala, accesos no autorizados o abuso.</li>
            <li><strong>Publicidad/remarketing (si aplica):</strong> no las empleamos por defecto; solo con consentimiento explícito.</li>
          </ul>

          <h2 id="bases-legales" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            4. Bases legales y obtención del consentimiento
          </h2>
          <p>
            Conforme a la normativa ePrivacy y al GDPR, instalamos sin necesidad de consentimiento las cookies <strong>estrictamente necesarias</strong>.
            Para el resto (preferencias, analítica, rendimiento, publicidad), <strong>solicitamos su consentimiento</strong> a través del banner/centro de preferencias,
            que puede aceptar, rechazar o configurar por categorías.
          </p>
          <p>
            Puede retirar su consentimiento en cualquier momento desde{' '}
            <Link href="/ajustes-cookies" className="text-primary-600 hover:underline">Ajustes de Cookies</Link> (enlace también disponible en el pie de página).
          </p>

          <h2 id="como-usamos" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            5. Cómo usamos las cookies en Orientia
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Autenticación y sesión:</strong> mantenerle identificado de forma segura y gestionar caducidad de sesión.</li>
            <li><strong>Preferencias:</strong> recordar idioma (<em>es-ES</em>), vista de tablas, filtros recientes, tema claro/oscuro.</li>
            <li><strong>Analítica agregada:</strong> medir uso global de funcionalidades para mejorar el producto (sin identificarle personalmente).</li>
            <li><strong>Rendimiento:</strong> cachear recursos y acelerar navegación entre páginas (Next.js/Vercel, estrategias de caché).</li>
            <li><strong>Seguridad:</strong> detectar accesos sospechosos y mitigar abusos.</li>
          </ul>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 mb-6">
            Nota: los nombres y duraciones exactos de cookies pueden variar según versiones de nuestros proveedores (Clerk, Supabase, Vercel, Stripe).
            La lista siguiente es orientativa y se actualiza periódicamente.
          </div>

          <h2 id="lista" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            6. Listado orientativo de cookies y almacenamiento local
          </h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">6.1. Cookies propias (first-party)</h3>
          <div className="overflow-x-auto not-prose">
            <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Finalidad</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Duración</th>
                  <th className="p-3">Categoría</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">orientia_session</td>
                  <td className="p-3">Mantener la sesión iniciada y asegurar el enrutado autenticado.</td>
                  <td className="p-3">HTTP cookie</td>
                  <td className="p-3">Sesión</td>
                  <td className="p-3">Necesaria</td>
                </tr>
                <tr>
                  <td className="p-3">locale</td>
                  <td className="p-3">Recordar el idioma de la interfaz.</td>
                  <td className="p-3">LocalStorage</td>
                  <td className="p-3">Persistente (12 meses)</td>
                  <td className="p-3">Preferencias</td>
                </tr>
                <tr>
                  <td className="p-3">theme</td>
                  <td className="p-3">Recordar tema claro/oscuro.</td>
                  <td className="p-3">LocalStorage</td>
                  <td className="p-3">Persistente (12 meses)</td>
                  <td className="p-3">Preferencias</td>
                </tr>
                <tr>
                  <td className="p-3">consent_status</td>
                  <td className="p-3">Almacenar las opciones de consentimiento por categorías.</td>
                  <td className="p-3">HTTP cookie</td>
                  <td className="p-3">6–12 meses</td>
                  <td className="p-3">Necesaria</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-8">6.2. Cookies de terceros (third-party)</h3>
          <p className="text-sm text-gray-700">
            Los siguientes proveedores pueden establecer cookies cuando están habilitadas sus integraciones. Ajusta esta lista según tu stack real.
          </p>
          <div className="overflow-x-auto not-prose mt-3">
            <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Proveedor</th>
                  <th className="p-3">Ejemplos de cookies</th>
                  <th className="p-3">Finalidad</th>
                  <th className="p-3">Duración</th>
                  <th className="p-3">Categoría</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Clerk (autenticación)</td>
                  <td className="p-3">__client, __session, clerk_session_id</td>
                  <td className="p-3">Gestión de sesión segura, detección de estado autenticado.</td>
                  <td className="p-3">Sesión / 30 días</td>
                  <td className="p-3">Necesaria</td>
                </tr>
                <tr>
                  <td className="p-3">Supabase (BBDD/archivos)</td>
                  <td className="p-3">sb-access-token, sb-refresh-token</td>
                  <td className="p-3">Tokens de acceso/renovación para APIs seguras.</td>
                  <td className="p-3">Sesión / persistente</td>
                  <td className="p-3">Necesaria</td>
                </tr>
                <tr>
                  <td className="p-3">Vercel (hosting/analytics)</td>
                  <td className="p-3">vercel-analytics, __vercel</td>
                  <td className="p-3">Métricas de rendimiento y uso agregadas.</td>
                  <td className="p-3">Sesión / 6 meses</td>
                  <td className="p-3">Analítica/Rendimiento</td>
                </tr>
                <tr>
                  <td className="p-3">Stripe (pagos)</td>
                  <td className="p-3">__stripe_mid, __stripe_sid</td>
                  <td className="p-3">Prevención de fraude y operación del checkout.</td>
                  <td className="p-3">1 año / 30 min</td>
                  <td className="p-3">Seguridad/Necesaria</td>
                </tr>
                <tr>
                  <td className="p-3">Email transaccional (p. ej., Resend/SendGrid)</td>
                  <td className="p-3">_ga-like / tracking pixel</td>
                  <td className="p-3">Métricas de entrega y fiabilidad del correo.</td>
                  <td className="p-3">Sesión / 6 meses</td>
                  <td className="p-3">Analítica</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-8">6.3. Almacenamiento local (ejemplos)</h3>
          <div className="overflow-x-auto not-prose">
            <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Clave</th>
                  <th className="p-3">Ámbito</th>
                  <th className="p-3">Finalidad</th>
                  <th className="p-3">Retención</th>
                  <th className="p-3">Categoría</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">filters:lastUsed</td>
                  <td className="p-3">LocalStorage</td>
                  <td className="p-3">Recordar filtros de búsqueda en informes.</td>
                  <td className="p-3">Hasta limpieza manual</td>
                  <td className="p-3">Preferencias</td>
                </tr>
                <tr>
                  <td className="p-3">draft:informe-*</td>
                  <td className="p-3">IndexedDB</td>
                  <td className="p-3">Guardar borradores offline y sincronizar después.</td>
                  <td className="p-3">Hasta envío/borrado</td>
                  <td className="p-3">Rendimiento/Funcional</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="gestionar" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            7. Cómo gestionar o revocar el consentimiento
          </h2>
          <p>
            Puede ajustar sus preferencias en cualquier momento desde{' '}
            <Link href="/ajustes-cookies" className="text-primary-600 hover:underline">Ajustes de Cookies</Link> o mediante el enlace
            permanente en el pie de página. Las categorías disponibles son: Necesarias (no configurables), Preferencias, Analítica, Rendimiento y, en su caso, Publicidad.
          </p>
          <p>
            Al rechazar categorías no necesarias, desactivamos su carga y borramos cookies previamente instaladas de esas categorías en la medida técnicamente posible.
          </p>

          <h2 id="navegadores" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            8. Configuración en navegadores
          </h2>
          <p>
            Además del panel de preferencias, puede configurar cookies desde su navegador. Estos pasos pueden variar según la versión:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Chrome:</strong> Ajustes &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
            <li><strong>Firefox:</strong> Preferencias &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.</li>
            <li><strong>Safari (macOS/iOS):</strong> Preferencias &gt; Privacidad &gt; Gestionar datos de sitios web.</li>
            <li><strong>Edge:</strong> Configuración &gt; Cookies y permisos del sitio.</li>
          </ul>
          <p>
            Tenga en cuenta que bloquear todas las cookies puede afectar al funcionamiento del servicio (por ejemplo, no podrá iniciar sesión).
          </p>

          <h2 id="retencion" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            9. Duración y retención
          </h2>
          <p>
            Las cookies de sesión se eliminan al cerrar el navegador. Las persistentes tienen una fecha de caducidad predeterminada;
            revisamos periódicamente su necesidad y la renovamos solo cuando es imprescindible para la finalidad declarada.
          </p>

          <h2 id="terceros" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            10. Cookies de terceros e integraciones
          </h2>
          <p>
            Algunas funcionalidades dependen de terceras partes (p. ej., Clerk, Supabase, Stripe, Vercel). Estos proveedores pueden establecer
            sus propias cookies. Controlamos su carga en función de su consentimiento cuando no son estrictamente necesarias y mantenemos
            acuerdos adecuados para su uso conforme a la normativa aplicable.
          </p>

          <h2 id="transferencias" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            11. Transferencias internacionales
          </h2>
          <p>
            Si una cookie o SDK implica tratamiento fuera del EEE, aplicamos salvaguardas adecuadas (decisiones de adecuación o Cláusulas Contractuales Tipo).
            Para más información consulte la <Link href="/privacidad" className="text-primary-600 hover:underline">Política de Privacidad</Link> o contáctenos.
          </p>

          <h2 id="gpc-dnt" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            12. Señales Global Privacy Control (GPC) y Do Not Track (DNT)
          </h2>
          <p>
            Orientia <strong>respeta las señales GPC</strong> en navegadores compatibles para restringir categorías no necesarias cuando corresponda.
            En cuanto a <em>Do Not Track</em>, la industria no ha adoptado un estándar común; no obstante, aplicamos una aproximación conservadora
            y priorizamos sus elecciones explícitas en nuestro panel de consentimiento.
          </p>

          <h2 id="cambios" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            13. Cambios en esta política
          </h2>
          <p>
            Podemos actualizar esta política por razones legales, técnicas u operativas. Publicaremos la versión vigente en esta página e indicaremos
            la fecha de última actualización. En caso de cambios sustanciales, mostraremos un aviso destacado y/o solicitaremos nuevamente su consentimiento.
          </p>

          <h2 id="contacto" className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200">
            14. Contacto y reclamaciones
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li><strong>Privacidad:</strong> <a href="mailto:privacidad@orientia.es" className="text-primary-600 hover:underline">privacidad@orientia.es</a></li>
            <li><strong>Soporte:</strong> <a href="mailto:soporte@orientia.es" className="text-primary-600 hover:underline">soporte@orientia.es</a></li>
            <li><strong>Autoridad de control (AEPD):</strong> <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">www.aepd.es</a></li>
          </ul>

          <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumen operativo</h3>
            <p className="text-sm text-gray-600">
              Usamos cookies necesarias sin consentimiento; para el resto pedimos su permiso por categorías. Puede cambiar su elección en cualquier momento
              desde <Link href="/ajustes-cookies" className="text-primary-600 hover:underline">Ajustes de Cookies</Link>. Respetamos GPC y aplicamos salvaguardas
              para terceros y transferencias internacionales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
