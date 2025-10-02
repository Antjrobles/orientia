import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Servicio",
  description:
    "Condiciones que regulan el uso de Orientia, obligaciones de las partes, licencias, limitaciones y política de uso aceptable.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: "/terminos" },
};

export default function TerminosCondicionesPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
          Términos y Condiciones de Servicio
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Última actualización:{" "}
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Índice navegable */}
        <nav aria-label="Tabla de contenidos" className="mb-10">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Contenido
            </p>
            <ul className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
              <li>
                <a href="#objeto" className="hover:underline">
                  1. Objeto y aceptación
                </a>
              </li>
              <li>
                <a href="#definiciones" className="hover:underline">
                  2. Definiciones
                </a>
              </li>
              <li>
                <a href="#cuenta" className="hover:underline">
                  3. Registro y cuenta
                </a>
              </li>
              <li>
                <a href="#licencia" className="hover:underline">
                  4. Licencia de uso
                </a>
              </li>
              <li>
                <a href="#uso-aceptable" className="hover:underline">
                  5. Uso aceptable
                </a>
              </li>
              <li>
                <a href="#contenido-usuario" className="hover:underline">
                  6. Contenido del usuario
                </a>
              </li>
              <li>
                <a href="#propiedad-intelectual" className="hover:underline">
                  7. Propiedad intelectual
                </a>
              </li>
              <li>
                <a href="#servicio" className="hover:underline">
                  8. Servicio, disponibilidad y mantenimiento
                </a>
              </li>
              <li>
                <a href="#terceros" className="hover:underline">
                  9. Integraciones y terceros
                </a>
              </li>
              <li>
                <a href="#pagos" className="hover:underline">
                  10. Planes, facturación y pagos
                </a>
              </li>
              <li>
                <a href="#prueba-desistimiento" className="hover:underline">
                  11. Prueba y derecho de desistimiento
                </a>
              </li>
              <li>
                <a href="#suspension" className="hover:underline">
                  12. Suspensión y cancelación
                </a>
              </li>
              <li>
                <a href="#seguridad" className="hover:underline">
                  13. Seguridad y confidencialidad
                </a>
              </li>
              <li>
                <a href="#proteccion-datos" className="hover:underline">
                  14. Protección de datos
                </a>
              </li>
              <li>
                <a href="#educativo" className="hover:underline">
                  15. Uso educativo y contenido sensible
                </a>
              </li>
              <li>
                <a href="#responsabilidad" className="hover:underline">
                  16. Exclusiones y limitación de responsabilidad
                </a>
              </li>
              <li>
                <a href="#indemnizacion" className="hover:underline">
                  17. Indemnización
                </a>
              </li>
              <li>
                <a href="#cambios" className="hover:underline">
                  18. Cambios en el servicio y en los términos
                </a>
              </li>
              <li>
                <a href="#enlaces" className="hover:underline">
                  19. Enlaces externos
                </a>
              </li>
              <li>
                <a href="#comunicaciones" className="hover:underline">
                  20. Comunicaciones y notificaciones
                </a>
              </li>
              <li>
                <a href="#cesion" className="hover:underline">
                  21. Cesión y subcontratación
                </a>
              </li>
              <li>
                <a href="#fuerza-mayor" className="hover:underline">
                  22. Fuerza mayor
                </a>
              </li>
              <li>
                <a href="#nulidad" className="hover:underline">
                  23. Nulidad parcial
                </a>
              </li>
              <li>
                <a href="#ley" className="hover:underline">
                  24. Ley aplicable y jurisdicción
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:underline">
                  25. Contacto
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="prose prose-lg max-w-none">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 mb-8">
            Al registrarse y utilizar Orientia, usted acepta íntegramente estos
            Términos y Condiciones de Servicio. Si no está de acuerdo, no
            utilice la plataforma.
          </div>

          <h2
            id="objeto"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            1. Objeto y aceptación
          </h2>
          <p>
            Estos Términos regulan el acceso y uso de la plataforma Orientia (
            <em>“Servicio”</em>), destinada a profesionales de la educación para
            la creación y gestión de informes psicopedagógicos. El uso del
            Servicio implica la aceptación de estos Términos y de la{" "}
            <Link
              href="/privacidad"
              className="text-primary-600 hover:underline"
            >
              Política de Privacidad
            </Link>
            , así como de la{" "}
            <Link href="/cookies" className="text-primary-600 hover:underline">
              Política de Cookies
            </Link>
            .
          </p>

          <h2
            id="definiciones"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            2. Definiciones
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Orientia:</strong> ORIENTIA, [Nombre fiscal o persona
              jurídica], NIF [NIF/CIF].
            </li>
            <li>
              <strong>Usuario:</strong> Docente o personal autorizado que accede
              al Servicio.
            </li>
            <li>
              <strong>Centro Responsable:</strong> Centro educativo que
              determina los fines del tratamiento de datos de alumnado; Orientia
              actúa como Encargado.
            </li>
            <li>
              <strong>Contenido del Usuario:</strong> Datos, textos, documentos,
              plantillas y materiales cargados o generados por el Usuario.
            </li>
            <li>
              <strong>Plan:</strong> Modalidad de suscripción con prestaciones y
              precios específicos.
            </li>
          </ul>

          <h2
            id="cuenta"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            3. Registro y cuenta
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Exactitud:</strong> Debe aportar información veraz y
              mantenerla actualizada.
            </li>
            <li>
              <strong>Credenciales:</strong> Usted es responsable de la
              confidencialidad de sus credenciales y de las acciones realizadas
              con su cuenta.
            </li>
            <li>
              <strong>Elegibilidad:</strong> El Servicio está dirigido a
              profesionales autorizados. No se permite el registro directo de
              alumnado o familias.
            </li>
            <li>
              <strong>Organizaciones:</strong> Si usa el Servicio en nombre de
              un centro, declara contar con autoridad suficiente.
            </li>
          </ul>

          <h2
            id="licencia"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            4. Licencia de uso
          </h2>
          <p>
            Orientia concede al Usuario una licencia limitada, no exclusiva, no
            transferible y revocable para usar el Servicio de acuerdo con estos
            Términos y el Plan contratado. Queda prohibida la reventa,
            ingeniería inversa, extracción masiva, scraping sistemático o uso
            con fines distintos a los educativos/administrativos del centro.
          </p>

          <h2
            id="uso-aceptable"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            5. Uso aceptable
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              No cargar contenidos ilícitos, difamatorios, discriminatorios o
              que vulneren derechos de terceros.
            </li>
            <li>
              No introducir datos personales fuera de la finalidad
              educativa/administrativa legítima del centro.
            </li>
            <li>
              No intentar eludir medidas de seguridad, ni afectar la
              disponibilidad del Servicio (DoS, spam, malware).
            </li>
            <li>
              No utilizar el Servicio para crear una plataforma competidora ni
              para benchmarking no autorizado.
            </li>
            <li>
              Respetar límites técnicos razonables (p. ej., tasa de peticiones,
              almacenamiento) del Plan contratado.
            </li>
          </ul>

          <h2
            id="contenido-usuario"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            6. Contenido del usuario
          </h2>
          <p>
            Usted conserva la titularidad del Contenido del Usuario. Nos otorga
            una licencia limitada para alojar, procesar y visualizar dicho
            contenido exclusivamente para prestar el Servicio. Usted garantiza
            contar con legitimación para tratar los datos, especialmente los de
            alumnado, y se compromete a no introducir datos innecesarios o
            excesivos.
          </p>

          <h2
            id="propiedad-intelectual"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            7. Propiedad intelectual
          </h2>
          <p>
            El Servicio, su software, diseños, marcas y contenidos de Orientia
            están protegidos por derechos de propiedad intelectual. Salvo la
            licencia limitada de uso, no se confiere ningún otro derecho. Queda
            prohibida la copia, modificación o creación de obras derivadas del
            Servicio.
          </p>

          <h2
            id="servicio"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            8. Servicio, disponibilidad y mantenimiento
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Disponibilidad:</strong> Orientia persigue una alta
              disponibilidad razonable del Servicio (objetivo indicativo p. ej.
              99,5%).
            </li>
            <li>
              <strong>Mantenimiento:</strong> Podemos realizar mantenimientos
              programados; de ser posible, se comunicarán con antelación.
            </li>
            <li>
              <strong>Actualizaciones:</strong> Podemos introducir mejoras,
              nuevas funciones o cambios que no disminuyan sustancialmente el
              valor del Plan.
            </li>
          </ul>

          <h2
            id="terceros"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            9. Integraciones y terceros
          </h2>
          <p>
            El Servicio puede interoperar con herramientas de terceros, p. ej.{" "}
            <strong>Clerk</strong> (autenticación), <strong>Supabase</strong>{" "}
            (BBDD/archivos),
            <strong>Vercel</strong> (hosting), <strong>Stripe</strong> (pagos) y
            proveedores de email transaccional (p. ej. Resend/SendGrid). El uso
            de dichos servicios puede estar sujeto a sus condiciones. Orientia
            no es responsable del funcionamiento de servicios ajenos.
          </p>

          <h2
            id="pagos"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            10. Planes, facturación y pagos
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Suscripción:</strong> Los Planes se renuevan
              automáticamente salvo cancelación previa al siguiente ciclo.
            </li>
            <li>
              <strong>Precios e impuestos:</strong> Los precios pueden mostrarse
              sin impuestos; se aplicarán los que correspondan según normativa.
            </li>
            <li>
              <strong>Facturación:</strong> La gestión de cobros se realiza a
              través de Stripe. Debe mantener un método de pago válido.
            </li>
            <li>
              <strong>Impagos:</strong> El impago puede conllevar suspensión o
              limitación de acceso hasta regularización.
            </li>
            <li>
              <strong>Cambios de Plan:</strong> Las modificaciones se prorratean
              cuando aplique.
            </li>
          </ul>

          <h2
            id="prueba-desistimiento"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            11. Prueba y derecho de desistimiento
          </h2>
          <p>
            Si existe periodo de prueba, su alcance y duración se comunicarán en
            el proceso de alta. En relaciones con <em>consumidores</em>, el
            derecho de desistimiento aplicará según la normativa; puede no
            aplicar o quedar excluido al tratarse de servicios digitales
            prestados íntegramente antes de finalizar el plazo, con
            consentimiento previo informado. En relaciones B2B
            (centros/administración), rigen las condiciones contractuales
            pactadas.
          </p>

          <h2
            id="suspension"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            12. Suspensión y cancelación
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              <strong>Por causa:</strong> Podemos suspender o cancelar el acceso
              por incumplimiento material de estos Términos.
            </li>
            <li>
              <strong>Por el Usuario:</strong> Puede cancelar en cualquier
              momento desde su cuenta o contactando con soporte.
            </li>
            <li>
              <strong>Efectos:</strong> Tras la cancelación, su acceso cesa.
              Consulte la página de{" "}
              <Link
                href="/eliminacion-de-datos-de-usuario"
                className="text-primary-600 hover:underline"
              >
                Eliminación de Datos
              </Link>{" "}
              para la supresión de datos.
            </li>
          </ul>

          <h2
            id="seguridad"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            13. Seguridad y confidencialidad
          </h2>
          <p>
            Implementamos medidas técnicas y organizativas razonables (cifrado
            en tránsito, controles de acceso, backups, registros de actividad).
            Usted debe aplicar buenas prácticas (no compartir credenciales,
            dispositivos protegidos, uso de redes seguras).
          </p>

          <h2
            id="proteccion-datos"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            14. Protección de datos
          </h2>
          <p>
            El tratamiento de datos personales se rige por la{" "}
            <Link
              href="/privacidad"
              className="text-primary-600 hover:underline"
            >
              Política de Privacidad
            </Link>
            . Respecto a datos de alumnado, Orientia actúa como{" "}
            <em>Encargado del Tratamiento</em> y el centro como{" "}
            <em>Responsable</em>; el tratamiento se sujeta al acuerdo de encargo
            de tratamiento conforme al art. 28 GDPR. El Usuario se compromete a
            introducir únicamente datos pertinentes y necesarios.
          </p>

          <h2
            id="educativo"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            15. Uso educativo y contenido sensible
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
            <li>
              Las funcionalidades y orientaciones generadas por el Servicio no
              sustituyen el juicio profesional del docente/orientación.
            </li>
            <li>
              El Usuario garantiza base jurídica adecuada para tratar datos de
              menores y aplicar salvaguardas reforzadas.
            </li>
            <li>
              Está prohibido usar el Servicio para diagnósticos médicos o
              finalidades ajenas al contexto educativo legalmente previsto.
            </li>
          </ul>

          <h2
            id="responsabilidad"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            16. Exclusiones y limitación de responsabilidad
          </h2>
          <p>
            En la máxima medida permitida por la ley, Orientia no será
            responsable de: (a) daños indirectos, incidentales, emergentes,
            lucro cesante, pérdida de datos o de negocio; (b) interrupciones por
            causas de terceros, fuerza mayor o mantenimientos anunciados; (c)
            uso indebido del Servicio. La responsabilidad total agregada de
            Orientia por todas las reclamaciones relacionadas con el Servicio no
            excederá, en su caso, el importe pagado por el Usuario en los 12
            meses anteriores al hecho que dio lugar a la responsabilidad.
          </p>

          <h2
            id="indemnizacion"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            17. Indemnización
          </h2>
          <p>
            Usted mantendrá indemne a Orientia frente a reclamaciones de
            terceros derivadas del uso del Servicio que infrinja estos Términos,
            la ley o derechos de terceros, incluyendo costes razonables de
            defensa.
          </p>

          <h2
            id="cambios"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            18. Cambios en el servicio y en los términos
          </h2>
          <p>
            Podemos modificar el Servicio y estos Términos para reflejar
            mejoras, requisitos legales o cambios operativos. Publicaremos la
            versión vigente en esta página, indicando la fecha de actualización.
            Si una modificación reduce sustancialmente el valor del Plan, podrá
            cancelar antes del siguiente ciclo sin penalización.
          </p>

          <h2
            id="enlaces"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            19. Enlaces externos
          </h2>
          <p>
            El Servicio puede contener enlaces a sitios de terceros. Orientia no
            controla ni responde por sus contenidos o prácticas. El acceso a
            dichos sitios es bajo su propia responsabilidad.
          </p>

          <h2
            id="comunicaciones"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            20. Comunicaciones y notificaciones
          </h2>
          <p>
            Podemos enviar comunicaciones operativas relacionadas con el
            Servicio a la dirección de email asociada a su cuenta. Para
            cuestiones de privacidad contacte en{" "}
            <a
              href="mailto:privacidad@orientia.es"
              className="text-primary-600 hover:underline"
            >
              privacidad@orientia.es
            </a>
            . Para soporte general:{" "}
            <a
              href="mailto:soporte@orientia.es"
              className="text-primary-600 hover:underline"
            >
              soporte@orientia.es
            </a>
            .
          </p>

          <h2
            id="cesion"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            21. Cesión y subcontratación
          </h2>
          <p>
            Usted no puede ceder sus derechos/obligaciones sin consentimiento
            escrito de Orientia. Podemos subcontratar funciones (p. ej.,
            hosting, autenticación, pagos) manteniendo responsabilidad frente al
            Usuario.
          </p>

          <h2
            id="fuerza-mayor"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            22. Fuerza mayor
          </h2>
          <p>
            Orientia no será responsable por incumplimientos causados por
            acontecimientos fuera de su control razonable (p. ej., desastres
            naturales, fallos generalizados de Internet, cortes eléctricos,
            conflictos laborales, actos gubernamentales).
          </p>

          <h2
            id="nulidad"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            23. Nulidad parcial
          </h2>
          <p>
            Si alguna disposición se considera inválida o inaplicable, las
            restantes continuarán en vigor. La disposición afectada se
            interpretará de forma que refleje lo más fielmente posible la
            intención original y sea válida.
          </p>

          <h2
            id="ley"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            24. Ley aplicable y jurisdicción
          </h2>
          <p>
            Estos Términos se rigen por la legislación española. Salvo norma
            imperativa en contrario, las partes se someten a los juzgados y
            tribunales de [Málaga] para la resolución de conflictos. Si actúa
            como consumidor, podrá acudir a los tribunales de su domicilio.
          </p>

          <h2
            id="contacto"
            className="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-primary-200"
          >
            25. Contacto
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-3">
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
              <strong>Privacidad y protección de datos:</strong>{" "}
              <a
                href="mailto:privacidad@orientia.es"
                className="text-primary-600 hover:underline"
              >
                privacidad@orientia.es
              </a>
            </li>
            <li>
              <strong>Dirección postal:</strong> [Dirección], [CP] [Ciudad],
              Andalucía, España
            </li>
          </ul>

          <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Resumen práctico
            </h3>
            <p className="text-sm text-gray-600">
              Uso profesional, licencia limitada, seguridad razonable, datos
              personales conforme a GDPR/LOPDGDD y encargo art. 28;
              integraciones con terceros; suscripción renovable; limitación de
              responsabilidad; posibilidad de cancelación; supresión de datos
              según la página de Eliminación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
