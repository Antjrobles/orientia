# PRD - Orientia Plataforma de Intervenciones y Gestión Psicopedagógica

## 1. Resumen Ejecutivo

Orientia evoluciona desde una herramienta de generación de informes hacia una suite de trabajo para orientadores educativos.  
El objetivo es centralizar casos, intervenciones y documentación contextual para reducir carga administrativa, mejorar trazabilidad y preparar informes de forma más rápida, consistente y auditada.

Este PRD define el alcance funcional y técnico del núcleo de producto para:

- Gestión de casos por iniciales del alumno y centro.
- Registro y edición completa de intervenciones.
- Clasificación por ámbitos y contextos (multi-selección y multi-ámbito).
- Biblioteca personal de documentos del orientador.
- Asistencia IA para redacción de notas y soporte a informes.
- Base de datos explotable para generar informes psicopedagógicos.

## 2. Contexto y Problema

El orientador trabaja con múltiples reuniones y actores (familia, claustro, tutoría, servicios sociales, etc.) en ventanas de tiempo largas.  
Hoy el proceso suele estar fragmentado entre notas sueltas, documentos dispersos y reconstrucción manual de historial, lo que genera:

- Pérdida de tiempo en organización.
- Riesgo de omisiones en seguimiento.
- Dificultad para mantener consistencia documental.
- Escasa trazabilidad por caso y por contexto.

## 3. Objetivos de Producto

## 3.1 Objetivos principales

- Consolidar toda la información de un alumno en un espacio único.
- Permitir registro rápido y flexible de intervenciones con clasificación útil.
- Mejorar calidad de redacción de notas sin perder texto original.
- Facilitar recuperación de información por búsqueda y filtros combinados.
- Preparar terreno para generación de informes PDF y psicopedagógicos.

## 3.2 Objetivos medibles (KPIs)

- Reducir tiempo medio de alta de intervención en un 40%.
- Reducir tiempo de preparación de informe en un 50%.
- Alcanzar tasa de éxito de guardado > 99%.
- Alcanzar uso recurrente semanal en > 70% de orientadores activos.
- Reducir incidencias de “dato no localizado” en casos activos en > 60%.

## 4. Usuarios y Roles

- Orientador/a (usuario principal): crea casos, registra intervenciones, sube documentos y genera informes.
- Equipo directivo o coordinación (rol colaborador futuro): consulta o recibe informes.
- Administrador plataforma: gestión técnica y soporte.

## 5. Alcance (In Scope)

## 5.1 Módulo Intervenciones

- Crear caso con:
  - Iniciales del alumno.
  - Nombre del centro.
- Buscar casos por:
  - Iniciales.
  - Centro.
  - Ámbito.
  - Contexto.
  - Texto libre combinado.
- Ordenar listados de casos por:
  - Actividad.
  - Fecha creación.
  - Iniciales.
  - Centro.
  - Ascendente/descendente.
- Registrar intervención con:
  - Fecha.
  - Uno o varios ámbitos.
  - Uno o varios contextos específicos.
  - Título.
  - Nota original.
- Guardar intervención en múltiples contextos dentro de un mismo flujo.
- Historial cronológico por caso con enfoque temporal.
- Edición completa de intervención:
  - Fecha.
  - Ámbitos.
  - Contextos.
  - Título.
  - Nota.
- Eliminación de intervención.
- Edición y eliminación de caso.
- Prefill del espacio de trabajo con la última intervención del caso seleccionado.

## 5.2 Taxonomía inicial de clasificación

- Ámbitos:
  - Escolar.
  - Sociocultural.
- Contextos específicos (extensibles):
  - Escolar: tutoría, profesorado, claustro, equipo directivo, orientación, convivencia, evaluación, otros.
  - Sociocultural: familia, servicios sociales, entorno comunitario, salud mental/sanidad, protección de menores, otros.
- Reglas:
  - Contextos mostrados/validables dependen de ámbitos seleccionados.
  - Debe existir consistencia ámbito-contexto al guardar y editar.

## 5.3 Módulo Ajustes de perfil profesional

- Guardado real de ajustes (persistencia estable).
- Datos profesionales:
  - Nombre.
  - Teléfono.
  - Número colegiado.
  - Centro.
  - Cargo.
  - Especialidad.
  - Ubicación.
  - Firma profesional.
- Preferencias de informes:
  - Tono de redacción.
  - Incluir firma.
  - Incluir pie de confidencialidad.
  - Reescritura asistida por IA.
- Notificaciones:
  - Email.
  - Recordatorios de borradores.
  - Resumen semanal.
- Selector de centro desde catálogo Andalucía con autocompletado de:
  - Centro.
  - Ubicación.

## 5.4 Módulo Documentos personales

- Subida de documentos privados del orientador:
  - PDF, DOCX, DOC, TXT, ODT, RTF, MD.
- Límite por archivo (actual: 10MB).
- Listado con:
  - Nombre.
  - Tamaño.
  - Fecha.
- Búsqueda por nombre.
- Ordenación por nombre, fecha y tamaño (asc/desc).
- Vista previa inline:
  - PDF embebido.
  - TXT/MD/RTF como texto.
  - DOCX convertido a HTML.
- Apertura en nueva pestaña.
- Impresión:
  - Nativa en PDF.
  - Vista imprimible para DOCX/TXT/MD/RTF.
- Renombrado de documento.
- Eliminación de documento.

## 5.5 Base para generación de informes

- Los datos de intervenciones deben poder usarse para:
  - Generación de informe PDF compartible.
  - Alimentación del flujo de informe psicopedagógico IA.

## 6. Fuera de alcance actual (Out of Scope)

- Colaboración multiusuario en un mismo caso en tiempo real.
- Motor avanzado de permisos por registro.
- Versionado histórico completo por diff de cada campo.
- Firma electrónica legal avanzada.
- Integración con sistemas externos de centros (ERP/gestión académica).

## 7. Requisitos Funcionales Detallados

## 7.1 Casos

- RF-01: Crear caso válido solo con iniciales normalizadas y centro no vacío.
- RF-02: Impedir duplicados exactos por usuario cuando aplique la regla de negocio.
- RF-03: Permitir actualizar iniciales y centro sin perder historial.
- RF-04: Eliminar caso con confirmación explícita.

## 7.2 Intervenciones

- RF-10: No permitir guardar intervención sin caso activo.
- RF-11: Permitir multi-ámbito y multi-contexto.
- RF-12: Validar consistencia entre ámbitos y contextos.
- RF-13: Mantener texto original y versión redactada.
- RF-14: Edición completa de todos los campos.
- RF-15: Eliminación individual de intervención.

## 7.3 Búsqueda y filtros

- RF-20: Búsqueda flexible por texto sobre caso e intervenciones relacionadas.
- RF-21: Filtros combinables (centro + ámbito + contexto + texto).
- RF-22: Mantener UX clara con limpieza de filtros.

## 7.4 Ajustes

- RF-30: Persistir ajustes de forma confiable entre sesiones.
- RF-31: Reflejar valores guardados al recargar pantalla.
- RF-32: Mostrar estado de cambios (dirty/clean) y feedback de guardado.

## 7.5 Documentos

- RF-40: Subir y listar documentos privados por usuario autenticado.
- RF-41: Nombrar archivo con nombre limpio, sufijo incremental solo si colisiona.
- RF-42: Renombrar conservando extensión.
- RF-43: Eliminar documento.
- RF-44: Visualizar inline según tipo.
- RF-45: Imprimir contenido visualizado cuando sea aplicable.

## 8. Requisitos No Funcionales

## 8.1 Rendimiento

- RNF-01: Tiempo de respuesta en operaciones CRUD < 1.5s p95.
- RNF-02: Carga inicial de listados paginados y/o acotados.
- RNF-03: Evitar bloqueos UI en operaciones de previsualización.

## 8.2 Seguridad y privacidad

- RNF-10: Acceso autenticado obligatorio a datos de perfil y documentos.
- RNF-11: Aislamiento estricto por `user_id` en rutas y recursos.
- RNF-12: Documentos en storage privado con acceso controlado por backend.
- RNF-13: Validación de tipo/extensión/tamaño en subida.
- RNF-14: No exponer secretos ni rutas ajenas en cliente.

## 8.3 Accesibilidad

- RNF-20: Controles con etiquetas y navegación por teclado.
- RNF-21: Contraste visual consistente con sistema de diseño.
- RNF-22: Componentes dialog/sheet accesibles (título obligatorio, etc.).

## 8.4 Responsividad

- RNF-30: Diseño mobile-first.
- RNF-31: Páginas clave a ancho completo con paddings adaptativos.
- RNF-32: Flujos críticos de navegación funcionales en móvil.

## 9. Modelo de Datos (alto nivel)

## 9.1 Entidades principales

- `casos_intervencion`
  - `id`
  - `autor_id`
  - `iniciales_alumno`
  - `centro_nombre`
  - `created_at`
  - `updated_at`

- `intervenciones`
  - `id`
  - `autor_id`
  - `caso_id`
  - `fecha_intervencion`
  - `ambito`
  - `subambito`
  - `titulo`
  - `texto_original`
  - `texto_redactado_ia`
  - `created_at`
  - `updated_at`

- `profile settings` (persistencia híbrida actual)
  - base en `users` + almacenamiento privado JSON por usuario.

- `documentos personales`
  - almacenamiento en bucket privado por carpeta de usuario.

## 10. API (alto nivel)

- `GET/PUT /api/profile/settings`
- `GET/POST/PATCH/DELETE /api/profile/personal-docs`
- `GET /api/profile/personal-docs/file`
- `GET /api/profile/personal-docs/preview` (DOCX -> HTML)
- `GET/POST/PATCH/DELETE /api/intervenciones`
- `GET/POST/PATCH/DELETE /api/intervenciones/casos`

## 11. UX y Diseño

- Consistencia visual con paleta verde de la app.
- Jerarquía clara:
  - Cabecera de contexto.
  - Área de trabajo principal.
  - Acciones persistentes al final.
- Feedback inmediato:
  - Toasts de éxito/error.
  - Estados de carga con spinner unificado.
- Evitar layouts desbalanceados o densidad irregular.

## 12. Observabilidad y Calidad

- Logs de error en backend sin exponer datos sensibles.
- Mensajes de error descriptivos para usuario final.
- Monitoreo de fallos de:
  - Guardado de ajustes.
  - Carga de documentos.
  - Conversión DOCX.
- Pruebas recomendadas:
  - Unitarias para validaciones de formato/contexto.
  - Integración para flujos CRUD.
  - E2E para móvil y desktop en rutas críticas.

## 13. Roadmap Propuesto

## Fase 1 (completada / en curso)

- Base de casos e intervenciones.
- Ajustes con persistencia.
- Documentos personales con preview y gestión.

## Fase 2

- Generador PDF configurable por plantilla.
- Constructor de informe psicopedagógico alimentado por historial.
- Etiquetado avanzado de intervenciones.

## Fase 3

- Colaboración por roles.
- Flujo de aprobaciones y compartición con implicados.
- Integraciones externas (opcional).

## 14. Riesgos y Mitigaciones

- Riesgo: inconsistencias de esquema en base de datos.
  - Mitigación: validación robusta y fallback controlado.
- Riesgo: rendimiento en previews de DOCX grandes.
  - Mitigación: límites de tamaño, caché corto, timeout.
- Riesgo: complejidad creciente de taxonomía de contextos.
  - Mitigación: tabla de configuración versionada.

## 15. Criterios de Aceptación (MVP operativo)

- CA-01: Un orientador puede crear caso, registrar intervención multi-contexto y editarla completamente.
- CA-02: Puede buscar y filtrar casos por combinación de criterios.
- CA-03: Ajustes guardan y se recuperan al recargar.
- CA-04: Puede subir, previsualizar, imprimir, renombrar y eliminar documentos personales.
- CA-05: DOCX se visualiza inline sin descarga obligatoria.
- CA-06: Flujo completo es usable en móvil y escritorio.

## 16. Preguntas Abiertas

- ¿Cuál será la estructura definitiva de subámbitos por ámbito en fase 2?
- ¿Se exigirá plantilla oficial de informe por comunidad/autonomía?
- ¿Qué política de retención se aplicará a documentos personales?
- ¿Habrá exportación masiva por caso (zip/pdf bundle)?

## 17. Definición de Éxito

El producto se considera exitoso cuando el orientador puede trabajar de forma continua en un único espacio, sin depender de documentos dispersos ni reprocesado manual, y puede generar entregables consistentes y trazables con menor esfuerzo operativo.
