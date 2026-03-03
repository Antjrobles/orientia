export interface BlogPost {
  slug: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  fechaActualizacion?: string;
  categoria: string;
  tiempoLectura: number; // minutos
  contenido: string; // HTML string
}

export const posts: BlogPost[] = [
  // ─── POST 1 ───────────────────────────────────────────────────────────────
  {
    slug: "informe-psicopedagogico-neae-andalucia",
    titulo: "Cómo elaborar un informe psicopedagógico para NEAE en Andalucía",
    descripcion:
      "Guía práctica para orientadores: estructura, contenidos obligatorios, normativa de la Junta de Andalucía y consejos para redactar informes psicopedagógicos de alumnos con NEAE.",
    fecha: "2026-02-10",
    fechaActualizacion: "2026-03-03",
    categoria: "Guías prácticas",
    tiempoLectura: 9,
    contenido: `
<h2>¿Qué es un informe psicopedagógico y para qué sirve?</h2>
<p>El <strong>informe psicopedagógico</strong> es el documento técnico que recoge los resultados de la evaluación psicopedagógica de un alumno. En Andalucía, su elaboración corresponde al orientador del centro o al Equipo de Orientación Educativa (EOE) y constituye la base para tomar decisiones sobre la respuesta educativa, las adaptaciones curriculares y los recursos de apoyo.</p>
<p>Su función principal es triple: <strong>describir</strong> las características del alumno en los ámbitos cognitivo, comunicativo-lingüístico, emocional y social; <strong>contextualizar</strong> esas características en el entorno escolar y familiar; y <strong>orientar</strong> las actuaciones de los docentes, la familia y los servicios especializados.</p>
<p>Más allá de su utilidad inmediata, el informe es un documento con valor legal y administrativo. En Andalucía, es el requisito previo para que la Comisión de Coordinación Pedagógica pueda aprobar una Adaptación Curricular Significativa (ACS) o para que el alumno acceda a determinados recursos de apoyo específico.</p>

<h2>Marco normativo en Andalucía</h2>
<p>La elaboración de informes psicopedagógicos en Andalucía se rige por las siguientes normas:</p>
<ul>
  <li><strong>Decreto 147/2002</strong>, de 14 de mayo, por el que se establece la ordenación de la atención educativa a los alumnos con necesidades educativas especiales asociadas a sus capacidades personales.</li>
  <li><strong>Orden de 19 de septiembre de 2002</strong>, por la que se regula la realización de la evaluación psicopedagógica y el dictamen de escolarización.</li>
  <li><strong>Instrucciones de la Dirección General de Participación e Inclusión Educativa</strong> sobre la organización y funcionamiento de los departamentos de orientación.</li>
  <li><strong>Ley 9/1999</strong>, de 18 de noviembre, de Solidaridad en la Educación, que establece el marco general de atención a la diversidad en Andalucía.</li>
</ul>
<p>Es fundamental que el informe haga referencia explícita al marco normativo que lo sustenta, especialmente cuando sirve de base para dictámenes de escolarización o para la justificación de recursos ante la Administración.</p>

<h2>¿Cuándo hay que elaborar un informe psicopedagógico?</h2>
<p>Según la normativa andaluza, la evaluación psicopedagógica —y por tanto el informe— es preceptiva en los siguientes casos:</p>
<ul>
  <li>Alumnos para los que se propone una <strong>Adaptación Curricular Significativa</strong> (ACS).</li>
  <li>Alumnos que requieren un <strong>dictamen de escolarización</strong> en centros de educación especial o aulas específicas.</li>
  <li>Alumnos con <strong>altas capacidades intelectuales</strong> para los que se propone flexibilización del período de escolarización obligatoria.</li>
  <li>Alumnos que requieren <strong>medidas de respuesta educativa extraordinarias</strong> no contempladas en el plan de atención a la diversidad del centro.</li>
</ul>
<p>Fuera de estos casos preceptivos, el orientador puede elaborar un informe siempre que lo considere necesario para mejorar la respuesta educativa al alumno.</p>

<h2>Estructura del informe psicopedagógico</h2>
<p>Aunque no existe un modelo único de obligado cumplimiento en toda Andalucía, la práctica consolidada y las instrucciones de la Consejería de Educación establecen los siguientes apartados:</p>

<h3>1. Datos de identificación</h3>
<p>Nombre y apellidos del alumno, fecha de nacimiento, centro educativo, etapa y curso, nombre del tutor/a y fecha de elaboración del informe. Este apartado debe incluir también el nombre del orientador que firma el documento.</p>

<h3>2. Motivo de la evaluación</h3>
<p>Descripción concisa de las razones que han llevado a la realización de la evaluación psicopedagógica: quién la solicitó, cuándo y por qué. Es importante indicar si existe una demanda previa del equipo docente, de la familia o si se trata de una evaluación de seguimiento.</p>

<h3>3. Información relevante del historial académico</h3>
<p>Escolarización previa, repeticiones de curso, asistencia a programas de apoyo o refuerzo, resultados en evaluaciones anteriores y cualquier antecedente relevante para comprender la situación actual del alumno.</p>

<h3>4. Contexto familiar y social</h3>
<p>Estructura familiar, nivel socioeconómico y cultural, actitud de la familia ante la escolarización, apoyos en el entorno familiar y factores de riesgo o protección relevantes. Este apartado debe redactarse con especial sensibilidad, evitando juicios de valor sobre la familia.</p>

<h3>5. Contexto escolar</h3>
<p>Descripción del aula y del grupo-clase, metodología del equipo docente, adaptaciones ya implementadas, actitud del alumno en el aula y relaciones con sus iguales.</p>

<h3>6. Desarrollo y competencia curricular</h3>
<p>Nivel de competencia curricular en las áreas instrumentales y en el resto de materias. Este apartado debe especificar claramente el nivel alcanzado en relación con los objetivos del ciclo o curso correspondiente.</p>

<h3>7. Estilo de aprendizaje y capacidades</h3>
<p>Resultados de las pruebas psicométricas y de las observaciones realizadas: capacidad intelectual general, memoria, atención, procesamiento del lenguaje, habilidades visoespaciales, ritmo de trabajo, motivación y estrategias de aprendizaje.</p>

<h3>8. Desarrollo comunicativo-lingüístico</h3>
<p>Nivel de expresión y comprensión oral y escrita, vocabulario, morfosintaxis, pragmática y, cuando proceda, nivel de adquisición de la lectoescritura.</p>

<h3>9. Desarrollo socioafectivo y emocional</h3>
<p>Autoconcepto, autoestima, habilidades sociales, regulación emocional y relaciones interpersonales tanto con adultos como con iguales.</p>

<h3>10. Conclusiones e identificación de NEAE</h3>
<p>Síntesis de los datos relevantes y determinación de si el alumno presenta o no necesidades específicas de apoyo educativo y, en caso afirmativo, de qué tipo: necesidades educativas especiales, dificultades específicas de aprendizaje, TDAH, altas capacidades, incorporación tardía al sistema educativo o condiciones personales o de historia escolar.</p>

<h3>11. Orientaciones y propuesta de respuesta educativa</h3>
<p>Medidas de respuesta educativa recomendadas: ordinarias, específicas o extraordinarias. Orientaciones para el equipo docente, para la familia y, cuando proceda, para el propio alumno. Si se propone una ACS o un cambio de escolarización, debe quedar explícitamente indicado aquí.</p>

<h2>Pruebas e instrumentos de evaluación más utilizados</h2>
<p>El orientador selecciona los instrumentos de evaluación en función de la demanda y de las características del alumno. Los más utilizados en Andalucía son:</p>
<ul>
  <li><strong>WISC-V</strong> (Escala de Inteligencia de Wechsler para Niños) o <strong>WPPSI-IV</strong> para infantil: evaluación de la capacidad intelectual.</li>
  <li><strong>PROLEC-R / PROLEC-SE-R</strong>: evaluación de los procesos lectores.</li>
  <li><strong>PROESC</strong>: evaluación de los procesos de escritura.</li>
  <li><strong>BECOLE</strong>: batería de evaluación cognitiva de la lectura y la escritura.</li>
  <li><strong>ENFEN</strong>: evaluación neuropsicológica de las funciones ejecutivas en niños.</li>
  <li><strong>BASC-3</strong> o <strong>SENA</strong>: evaluación del comportamiento y la adaptación socioafectiva.</li>
  <li><strong>Cuestionarios CONNERS-3</strong>: evaluación del TDAH.</li>
  <li><strong>ADOS-2 / ADI-R</strong>: evaluación del espectro autista (aplicados generalmente por servicios especializados).</li>
</ul>

<h2>Errores frecuentes en la elaboración del informe</h2>
<p>Los orientadores más experimentados coinciden en señalar los siguientes errores como los más habituales en la elaboración de informes psicopedagógicos:</p>
<ul>
  <li><strong>Exceso de tecnicismo</strong> sin traducción práctica para el docente o la familia.</li>
  <li><strong>Copiar literalmente</strong> los resultados de las pruebas sin interpretarlos en el contexto del alumno.</li>
  <li><strong>Omitir el contexto</strong> familiar y escolar, lo que impide comprender la situación real del alumno.</li>
  <li><strong>Propuestas de intervención vagas</strong> ("refuerzo en matemáticas", "apoyo emocional") sin concreción metodológica.</li>
  <li><strong>No actualizar el informe</strong> cuando cambian las circunstancias del alumno o cuando una medida propuesta no ha resultado eficaz.</li>
</ul>

<h2>Cómo reduce Orientia el tiempo de elaboración</h2>
<p>La redacción de un informe psicopedagógico completo puede llevar entre 3 y 6 horas a un orientador experimentado. Orientia reduce ese tiempo a 20-40 minutos gracias a un proceso estructurado:</p>
<ol>
  <li>El orientador introduce los datos de la evaluación (resultados de pruebas, observaciones, antecedentes).</li>
  <li>La IA genera un borrador completo con la estructura estándar andaluza, terminología técnica precisa y propuestas de intervención coherentes con el perfil del alumno.</li>
  <li>El orientador revisa, ajusta y firma el informe final.</li>
</ol>
<p>El criterio profesional del orientador es siempre la última palabra. Orientia no toma decisiones: facilita la redacción para que el orientador pueda dedicar más tiempo a lo que realmente importa.</p>
    `.trim(),
  },

  // ─── POST 2 ───────────────────────────────────────────────────────────────
  {
    slug: "plantilla-evaluacion-psicopedagogica",
    titulo: "Plantilla de evaluación psicopedagógica: estructura y consejos para 2025-2026",
    descripcion:
      "Descubre cómo estructurar una plantilla de evaluación psicopedagógica adaptada a la normativa andaluza. Apartados obligatorios, instrumentos recomendados y errores a evitar.",
    fecha: "2026-02-18",
    fechaActualizacion: "2026-03-03",
    categoria: "Recursos",
    tiempoLectura: 8,
    contenido: `
<h2>¿Para qué sirve una plantilla de evaluación psicopedagógica?</h2>
<p>Una <strong>plantilla de evaluación psicopedagógica</strong> es una herramienta de trabajo que organiza el proceso de recogida de información sobre un alumno. No es un formulario rígido: es una guía que asegura que ningún apartado relevante quede sin explorar y que facilita la elaboración posterior del informe.</p>
<p>Tener una buena plantilla como base de trabajo tiene varias ventajas prácticas para el orientador:</p>
<ul>
  <li>Garantiza la <strong>coherencia y exhaustividad</strong> de la evaluación.</li>
  <li>Reduce el tiempo de recogida de información y de redacción del informe.</li>
  <li>Facilita el <strong>trabajo colaborativo</strong> entre orientadores del mismo equipo.</li>
  <li>Permite la <strong>comparación longitudinal</strong> cuando el mismo alumno es evaluado en distintos momentos.</li>
  <li>Sirve como base de documentación ante la Administración educativa.</li>
</ul>

<h2>Diferencia entre plantilla de evaluación e informe psicopedagógico</h2>
<p>Es importante no confundir ambos documentos. La <strong>plantilla de evaluación</strong> es el instrumento interno de trabajo del orientador: recoge datos brutos, observaciones, resultados de pruebas y notas. El <strong>informe psicopedagógico</strong> es el documento formal que se entrega a la Administración, al centro y a la familia: interpreta esos datos, los contextualiza y propone medidas de respuesta educativa.</p>
<p>La plantilla es privada y de uso profesional; el informe es un documento oficial con valor legal y administrativo.</p>

<h2>Apartados de una plantilla de evaluación psicopedagógica</h2>

<h3>Bloque 1: Datos de identificación y motivo de la evaluación</h3>
<p>Datos básicos del alumno (nombre, fecha de nacimiento, centro, curso, tutor/a), fecha de inicio de la evaluación, quién la solicita y una descripción breve del motivo. Este bloque debe incluir también el historial de evaluaciones psicopedagógicas anteriores, si las hay.</p>

<h3>Bloque 2: Recogida de información documental</h3>
<p>Revisión del expediente académico, informes previos (médicos, psicológicos, del EOE anterior), registros de asistencia y documentación sobre medidas de atención a la diversidad ya aplicadas. Este bloque es el punto de partida antes de realizar ninguna prueba ni entrevista.</p>

<h3>Bloque 3: Entrevista con la familia</h3>
<p>Registro estructurado de la entrevista familiar: historia evolutiva del alumno (embarazo, parto, hitos del desarrollo), historial de salud relevante, dinámica familiar, expectativas educativas de la familia, actitudes hacia el aprendizaje en casa y apoyos extraescolares.</p>
<p>Se recomienda utilizar un guion semiestructurado que permita explorar estas dimensiones sin condicionar las respuestas de la familia.</p>

<h3>Bloque 4: Entrevista con el equipo docente</h3>
<p>Opinión del tutor y los especialistas sobre el rendimiento académico del alumno, su comportamiento en el aula, las relaciones con sus compañeros, las estrategias que ya se han probado y su eficacia. Este bloque debe incluir también información sobre el estilo de enseñanza predominante en el aula.</p>

<h3>Bloque 5: Observación directa en el aula</h3>
<p>Registro de observación del alumno en situación natural de aula: nivel de atención, participación, interacción con compañeros y docentes, respuesta ante las tareas, uso de materiales de apoyo y conducta general. Se recomienda realizar al menos dos observaciones en contextos diferentes.</p>

<h3>Bloque 6: Evaluación de la competencia curricular</h3>
<p>Evaluación del nivel alcanzado por el alumno en las áreas instrumentales (lengua y matemáticas) y en el resto de materias, con referencia explícita a los criterios de evaluación del curso o ciclo correspondiente. Puede realizarse mediante pruebas de nivel, análisis de producciones del alumno o entrevista con el equipo docente.</p>

<h3>Bloque 7: Aplicación de pruebas psicométricas y de evaluación específica</h3>
<p>Registro de las pruebas aplicadas, fechas de aplicación, condiciones de administración y resultados cuantitativos (puntuaciones directas, centiles, puntuaciones típicas). Este bloque debe indicar también las limitaciones de cada prueba y las condiciones que pudieron afectar a los resultados.</p>

<h3>Bloque 8: Evaluación del desarrollo comunicativo-lingüístico</h3>
<p>Evaluación específica del lenguaje oral y escrito, especialmente relevante en alumnos con sospechas de dislexia, disfasia, TEL o alumnos con incorporación tardía al sistema educativo. Registro de resultados de pruebas específicas de lenguaje (PROLEC-R, PROESC, etc.).</p>

<h3>Bloque 9: Evaluación del desarrollo socioafectivo y emocional</h3>
<p>Resultados de escalas de evaluación del comportamiento (BASC-3, SENA), observaciones sobre habilidades sociales, autoconcepto, autoestima y regulación emocional. En casos de sospecha de TDAH, registro de cuestionarios específicos cumplimentados por la familia y los docentes.</p>

<h3>Bloque 10: Síntesis e hipótesis de trabajo</h3>
<p>Integración de toda la información recogida en una síntesis coherente que sirva de base para la redacción del informe. Formulación de hipótesis sobre las necesidades del alumno y las medidas de respuesta educativa más adecuadas.</p>

<h2>Consejos para usar la plantilla de forma eficiente</h2>
<ul>
  <li><strong>Adapta la plantilla a cada caso.</strong> No todos los alumnos requieren los mismos bloques con el mismo nivel de profundidad. Prioriza en función del motivo de la evaluación.</li>
  <li><strong>Registra en el momento.</strong> No dejes la cumplimentación de la plantilla para después: los detalles se pierden y la fiabilidad de los datos disminuye.</li>
  <li><strong>Usa abreviaturas y códigos propios.</strong> La plantilla es un documento interno; no tiene que ser legible para nadie más que tú.</li>
  <li><strong>Incluye la fecha de cada observación y entrevista.</strong> La temporalidad de los datos es relevante, especialmente en evaluaciones que se prolongan varias semanas.</li>
  <li><strong>Diferencia claramente los datos objetivos de tus interpretaciones.</strong> Esto facilita la redacción del informe y evita sesgos.</li>
</ul>

<h2>Plantilla de evaluación digital con Orientia</h2>
<p>Orientia digitaliza este proceso de recogida de información y lo integra directamente con la generación del informe. El orientador introduce los datos relevantes en cada bloque —resultados de pruebas, observaciones, notas de entrevistas— y la plataforma genera automáticamente el borrador del informe con la estructura estándar de la Junta de Andalucía.</p>
<p>El resultado es un flujo de trabajo completo: desde la primera recogida de datos hasta el informe final listo para firmar, sin duplicar esfuerzos ni reformatear información entre documentos.</p>
    `.trim(),
  },

  // ─── POST 3 ───────────────────────────────────────────────────────────────
  {
    slug: "integracion-seneca-orientadores-educativos",
    titulo: "Séneca para orientadores: gestión de documentación psicopedagógica",
    descripcion:
      "Guía para orientadores educativos sobre el uso de Séneca (Junta de Andalucía) en la gestión de informes, dictámenes y documentación de alumnos con NEAE. Flujos de trabajo recomendados.",
    fecha: "2026-02-25",
    fechaActualizacion: "2026-03-03",
    categoria: "Herramientas",
    tiempoLectura: 7,
    contenido: `
<h2>Séneca y la orientación educativa en Andalucía</h2>
<p><strong>Séneca</strong> es el sistema de gestión educativa de la Junta de Andalucía. Para los orientadores, es la plataforma central donde se gestiona la documentación oficial relacionada con la atención a la diversidad: informes psicopedagógicos, dictámenes de escolarización, adaptaciones curriculares y el seguimiento de alumnos con necesidades específicas de apoyo educativo (NEAE).</p>
<p>Sin embargo, Séneca no está diseñado para facilitar la redacción de documentos: su función es el almacenamiento, la gestión y la tramitación administrativa. Esto genera una brecha entre el proceso de elaboración del documento (que el orientador hace fuera de Séneca, normalmente en Word) y su incorporación al sistema oficial.</p>

<h2>Qué puede gestionar un orientador en Séneca</h2>
<p>Las funciones de Séneca más relevantes para el departamento de orientación son:</p>

<h3>Gestión de alumnos con NEAE</h3>
<p>Séneca permite registrar y actualizar la categoría de NEAE de cada alumno, lo que tiene implicaciones directas en la asignación de recursos de apoyo, en la configuración de las actas de evaluación y en la comunicación con la Administración. Es fundamental mantener este registro actualizado tras cada evaluación psicopedagógica.</p>

<h3>Informes psicopedagógicos</h3>
<p>El informe psicopedagógico puede subirse a Séneca como documento adjunto en el expediente del alumno. Aunque el sistema permite generar ciertos documentos desde la propia plataforma, la mayoría de los orientadores prefieren elaborar el informe externamente y adjuntarlo en formato PDF. Séneca registra la fecha de incorporación y el orientador que lo sube.</p>

<h3>Dictámenes de escolarización</h3>
<p>Los dictámenes de escolarización —necesarios para la escolarización en centros de educación especial, unidades específicas o para la aplicación de ciertas medidas extraordinarias— se tramitan íntegramente a través de Séneca. El sistema tiene módulos específicos para este proceso, con plazos y flujos de aprobación definidos por la Consejería.</p>

<h3>Adaptaciones Curriculares Significativas (ACS)</h3>
<p>Las ACS deben estar documentadas en Séneca y vinculadas al informe psicopedagógico que las justifica. El sistema permite registrar las áreas o materias afectadas, el nivel curricular de referencia y las medidas de acceso al currículo. El seguimiento de las ACS también se gestiona desde Séneca.</p>

<h3>Plan de Atención a la Diversidad</h3>
<p>El Plan de Atención a la Diversidad (PAD) del centro debe registrarse en Séneca anualmente. El departamento de orientación es responsable de su elaboración y actualización, en coordinación con el equipo directivo y el claustro.</p>

<h2>Flujo de trabajo recomendado para el orientador</h2>
<p>El flujo de trabajo más eficiente para gestionar la documentación psicopedagógica en Séneca es el siguiente:</p>
<ol>
  <li><strong>Elaboración del informe</strong> en la herramienta de redacción (Orientia, Word u otra).</li>
  <li><strong>Revisión y validación</strong> del borrador por el orientador.</li>
  <li><strong>Exportación a PDF</strong> con el formato y la estructura adecuados.</li>
  <li><strong>Subida a Séneca</strong> como documento adjunto al expediente del alumno.</li>
  <li><strong>Actualización del registro de NEAE</strong> si la evaluación modifica la categoría del alumno.</li>
  <li><strong>Comunicación a la familia</strong> y entrega de copia del informe.</li>
  <li><strong>Archivo del documento original</strong> en el expediente físico del departamento de orientación.</li>
</ol>

<h2>Problemas frecuentes en el uso de Séneca</h2>

<h3>Pérdida de formato al subir documentos</h3>
<p>Séneca almacena los documentos como adjuntos, lo que preserva el formato del PDF. Sin embargo, si el documento se genera directamente desde los formularios de Séneca, el resultado puede no coincidir con la estructura habitual del informe. La solución más práctica es elaborar siempre el informe externamente y subirlo en PDF.</p>

<h3>Acceso y permisos</h3>
<p>El acceso a los módulos de orientación en Séneca requiere permisos específicos que debe gestionar el equipo directivo del centro. Es habitual que en centros con orientador nuevo o itinerante haya retrasos en la asignación de permisos. Conviene solicitarlos al inicio del curso junto con el resto de accesos al sistema.</p>

<h3>Sincronización con el EOE</h3>
<p>Cuando la evaluación psicopedagógica la realiza el EOE y no el orientador del centro, el informe debe incorporarse igualmente al expediente del alumno en Séneca por parte del centro. La coordinación entre el EOE y el orientador del centro es fundamental para evitar duplicidades o lagunas en la documentación.</p>

<h3>Plazos administrativos</h3>
<p>Algunos trámites en Séneca tienen plazos administrativos estrictos (dictámenes de escolarización para el curso siguiente, actualizaciones de NEAE para las actas de evaluación, etc.). Conviene consultar al inicio de cada curso el calendario de plazos establecido por la Delegación Territorial.</p>

<h2>Cómo Orientia se integra con el flujo de Séneca</h2>
<p>Orientia está diseñada para encajar directamente en el flujo de trabajo con Séneca. Los informes generados con Orientia pueden exportarse en formato PDF con la estructura y el formato que habitualmente se sube a Séneca, sin necesidad de reformateo ni adaptaciones manuales.</p>
<p>El resultado es un flujo continuo: el orientador elabora el informe en Orientia, lo revisa, lo exporta a PDF y lo sube directamente a Séneca. Sin intermediarios, sin conversiones de formato y sin perder tiempo en tareas administrativas que no añaden valor a la orientación.</p>
    `.trim(),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
