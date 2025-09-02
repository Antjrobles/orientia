import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Declaración de Accesibilidad',
  description: 'Información detallada sobre el compromiso de Orientia con la accesibilidad web para garantizar que la plataforma sea usable por todas las personas.',
};

export default function AccesibilidadPage() {
  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Declaración de Accesibilidad</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          {/* Índice navegable */}
          <nav aria-label="Tabla de contenidos" className="mb-10">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Contenido</p>
              <ul className="grid gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                <li><a href="#compromiso" className="hover:underline">1. Nuestro Compromiso</a></li>
                <li><a href="#conformidad" className="hover:underline">2. Estado de Conformidad</a></li>
                <li><a href="#medidas" className="hover:underline">3. Medidas de Soporte</a></li>
                <li><a href="#compatibilidad" className="hover:underline">4. Compatibilidad</a></li>
                <li><a href="#especificaciones" className="hover:underline">5. Especificaciones Técnicas</a></li>
                <li><a href="#limitaciones" className="hover:underline">6. Limitaciones y Alternativas</a></li>
                <li><a href="#evaluacion" className="hover:underline">7. Evaluación y Pruebas</a></li>
                <li><a href="#contacto" className="hover:underline">8. Comentarios y Contacto</a></li>
                <li><a href="#aplicacion" className="hover:underline">9. Procedimiento de Aplicación</a></li>
                <li><a href="#faq" className="hover:underline">Preguntas Frecuentes</a></li>
              </ul>
            </div>
          </nav>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300 mb-8">
              <strong>Nuestra Misión:</strong> Creemos que la tecnología educativa debe ser inclusiva y accesible para todos. Trabajamos continuamente para mejorar la experiencia de todos los usuarios, independientemente de sus capacidades.
            </div>

            <h2 id="compromiso" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              1. Nuestro Compromiso con la Accesibilidad
            </h2>
            <p>
              Orientia se ha comprometido a hacer su sitio web accesible de conformidad con el Real Decreto 1112/2018, de 7 de septiembre, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público, que transpone la Directiva (UE) 2016/2102 del Parlamento Europeo y del Consejo.
            </p>
            <p>
              Nuestro objetivo es alcanzar el nivel de conformidad <strong>Doble-A (AA)</strong> de las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, desarrolladas por el World Wide Web Consortium (W3C). Estas pautas son el estándar internacional para crear contenido web accesible.
            </p>

            <h2 id="conformidad" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              2. Estado de Conformidad
            </h2>
            <p>
              Este sitio web está <strong>parcialmente conforme</strong> con el RD 1112/2018 debido a las excepciones y a la falta de conformidad de los aspectos que se indican a continuación.
            </p>
            <p>
              Estamos trabajando activamente para solucionar los problemas de accesibilidad detectados y mejorar la experiencia para todos los usuarios.
            </p>

            <h2 id="medidas" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              3. Medidas para Apoyar la Accesibilidad
            </h2>
            <p>
              En Orientia hemos adoptado las siguientes medidas para garantizar la accesibilidad:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-3">
              <li><strong>Diseño adaptable:</strong> La plataforma se adapta a diferentes tamaños de pantalla y dispositivos.</li>
              <li><strong>Navegación por teclado:</strong> Todas las funcionalidades son accesibles utilizando únicamente el teclado.</li>
              <li><strong>Texto alternativo:</strong> Proporcionamos alternativas textuales para el contenido no textual, como imágenes e iconos.</li>
              <li><strong>Contraste de color:</strong> Aseguramos un contraste suficiente entre el texto y el fondo para facilitar la lectura.</li>
              <li><strong>Estructura semántica:</strong> Utilizamos encabezados (H1, H2, etc.), listas y otros elementos HTML de forma correcta para transmitir la estructura del contenido.</li>
              <li><strong>Formación continua:</strong> Nuestro equipo de desarrollo recibe formación periódica en materia de accesibilidad web.</li>
            </ul>

            <h2 id="compatibilidad" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              4. Compatibilidad con Navegadores y Tecnologías de Apoyo
            </h2>
            <p>
              Orientia está diseñado para ser compatible con las versiones más recientes de los principales navegadores web. Recomendamos utilizar:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-3">
              <li>Google Chrome con NVDA o JAWS en Windows.</li>
              <li>Mozilla Firefox con NVDA o JAWS en Windows.</li>
              <li>Safari con VoiceOver en macOS e iOS.</li>
            </ul>
            <p>
              La plataforma puede no funcionar de manera óptima en navegadores obsoletos o con tecnologías de apoyo no actualizadas.
            </p>

            <h2 id="especificaciones" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              5. Especificaciones Técnicas
            </h2>
            <p>
              La accesibilidad de Orientia se basa en las siguientes tecnologías para funcionar con la combinación particular de navegador web y cualquier tecnología de asistencia o complemento instalado en su ordenador:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-3">
              <li>HTML5</li>
              <li>WAI-ARIA (Web Accessibility Initiative – Accessible Rich Internet Applications)</li>
              <li>CSS3</li>
              <li>JavaScript (ECMAScript)</li>
            </ul>

            <h2 id="limitaciones" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              6. Limitaciones y Alternativas
            </h2>
            <p>
              A pesar de nuestros esfuerzos, pueden existir algunas limitaciones. A continuación, se describen las limitaciones conocidas y las posibles soluciones:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-3">
              <li><strong>Documentos PDF:</strong> Algunos documentos antiguos en formato PDF pueden no ser totalmente accesibles. Estamos trabajando para convertirlos a formatos más accesibles. Si necesita acceso a un documento específico, por favor, <a href="#contacto">contacte con nosotros</a>.</li>
              <li><strong>Contenido de terceros:</strong> Es posible que algún contenido incrustado, como vídeos de YouTube, no cumpla plenamente con los estándares de accesibilidad.</li>
            </ul>
            <p>
              Nos comprometemos a solucionar cualquier problema de accesibilidad que se nos comunique.
            </p>

            <h2 id="evaluacion" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              7. Evaluación y Pruebas
            </h2>
            <p>
              Llevamos a cabo un proceso de evaluación continua para garantizar y mejorar la accesibilidad de la plataforma. Este proceso incluye:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-3">
              <li>Auditorías automáticas con herramientas especializadas.</li>
              <li>Revisiones manuales por parte de nuestro equipo.</li>
              <li>Pruebas con usuarios reales, incluyendo personas con diferentes tipos de discapacidad.</li>
            </ul>

            <h2 id="contacto" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              8. Comentarios y Contacto
            </h2>
            <p>
              Sus comentarios son esenciales para ayudarnos a mejorar. Si encuentra alguna barrera de accesibilidad o tiene alguna sugerencia, no dude en ponerse en contacto con nosotros:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-3">
              <li><strong>Email:</strong> <a href="mailto:accesibilidad@orientia.es" className="text-primary-600 hover:underline">accesibilidad@orientia.es</a></li>
              <li><strong>Formulario de contacto:</strong> <Link href="/contacto" className="text-primary-600 hover:underline">Página de contacto</Link></li>
              <li><strong>Teléfono:</strong> [Número de teléfono de soporte]</li>
            </ul>
            <p>
              Intentamos responder a los comentarios sobre accesibilidad en un plazo de 5 días hábiles.
            </p>

            <h2 id="aplicacion" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              9. Procedimiento de Aplicación
            </h2>
            <p>
              Si una vez realizada una solicitud de información accesible o queja, ésta hubiera sido desestimada, no se estuviera de acuerdo con la decisión adoptada, o la respuesta no cumpliera los requisitos contemplados en el artículo 12.5 del RD 1112/2018, la persona interesada podrá iniciar una reclamación. Igualmente se podrá iniciar una reclamación en el caso de que haya transcurrido el plazo de veinte días hábiles sin haber obtenido respuesta.
            </p>
            <p>
              La reclamación puede ser presentada a través de la instancia de contacto correspondiente.
            </p>

            <h2 id="faq" className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 pb-2 border-b border-primary-200 dark:border-primary-800">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¿Cómo puedo aumentar o disminuir el tamaño del texto?
                </h3>
                <p>
                  Puede utilizar las funciones de zoom de su navegador para ajustar el tamaño del texto. En la mayoría de los navegadores, puede hacerlo manteniendo pulsada la tecla <strong>Ctrl</strong> (o <strong>Cmd</strong> en Mac) y pulsando las teclas <strong>+</strong> (más) o <strong>-</strong> (menos).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¿El sitio es compatible con lectores de pantalla?
                </h3>
                <p>
                  Sí, hemos diseñado Orientia para que sea compatible con los lectores de pantalla más populares, como JAWS, NVDA y VoiceOver. La estructura semántica del sitio ayuda a estos programas a interpretar el contenido correctamente.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¿Qué hago si encuentro un problema de accesibilidad?
                </h3>
                <p>
                  Le agradecemos que nos lo comunique. Por favor, utilice cualquiera de los métodos indicados en la sección de <a href="#contacto">Contacto</a> para informarnos del problema. Intente ser lo más específico posible para que podamos identificarlo y solucionarlo rápidamente.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Mejora Continua
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                La accesibilidad es un viaje, no un destino. Estamos comprometidos con la mejora continua y valoramos su colaboración para hacer de Orientia una herramienta accesible para todos.
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}
