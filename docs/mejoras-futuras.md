# Mejoras Futuras - Orientia

## UX/UI Mejoras

- [ ] **"Recordar sesión"** - Checkbox en login para mantener sesión activa
- [ ] **"Olvidé mi contraseña"** - Link para recuperar contraseña
- [ ] **Indicador de fuerza de contraseña** - Barra visual en registro
- [ ] **Auto-focus** - Cursor automático en primer campo
- [ ] **Loading states** - Spinners en botones durante acciones

## Funcionalidad

- [ ] **Rate limiting** - Limitar intentos de login fallidos
- [ ] **Reenviar email** - Botón para reenviar verificación
- [ ] **Logout automático** - Por inactividad
- [ ] **Breadcrumbs** - Navegación visual en páginas internas
- [ ] **Confirmación de acciones** - Modales para eliminar, etc.

## Accesibilidad

- [ ] **Navegación por teclado** - Tab order correcto
- [ ] **Screen reader** - Labels y ARIA apropiados
- [ ] **Contraste mejorado** - Para mejor legibilidad

## Sistema de Informes

- [ ] **Ver informe** - Funcionalidad completa para visualizar informes
- [ ] **Editar informe** - Permitir modificar informes existentes
- [ ] **Eliminar informe** - Con confirmación y API endpoint
- [ ] **Exportar a PDF** - Descargar informes como PDF
- [ ] **Mejorar formulario de generación** - Más campos específicos del informe psicopedagógico

## Otras Mejoras

- [ ] **Cache de informes generados** - Evitar regenerar informes similares
- [ ] **Rate limiting en API de Groq** - Limitar generaciones por usuario
- [ ] **Validación de roles y permisos** - Diferentes límites según plan
- [ ] **Backup automático** - Respaldo de informes críticos
- [ ] **Logs de auditoría** - Registro de acciones importantes

## Arquitectura de Datos
Normalización vs JSONB: ahora mezclas tablas normalizadas (e.g., datos_*, determinacion_*, propuesta_*) con campos JSONB en informes (e.g., datos_identificativos, evaluacion_psicopedagogica). Decide una estrategia:
Opción A (recomendada): Mantener tablas normalizadas y usar vistas/materialized views para componer “Informe completo”.
Opción B: Usar JSONB en informes para todo y eliminar tablas 1-1/1-N específicas.
Transacciones: crear función SQL (RPC) para “crear informe completo” que inserte en informes y sus tablas hijas atómicamente. Mejora la consistencia y simplifica API.
Índices y claves: añadir índices en informes(autor_id), datos_* (informe_id), *_id foráneos; ya hay UNIQUE en 1-1, bien.
Timestamps: añadir trigger updated_at para actualizado_en en todas las tablas que lo tengan.


## Seguridad y Acceso a Datos
Service role en servidor: el cliente Supabase con SUPABASE_SERVICE_ROLE_KEY debe quedar estricto a servidor. Centraliza en un helper “server-only”.
Revisar lib/supabase.ts:1 y usos; evitar cualquier import desde componentes cliente.
Políticas RLS: si mantienes RLS activas, define políticas por autor_id en tablas hijas (y usa el JWT de usuario); si no, valida autoría siempre del lado servidor con service role (lo haces en /api/informes/list y /api/informes/create → seguir ese patrón estrictamente).
NextAuth Adapter: tienes tablas de NextAuth (accounts, sessions, verification_tokens) pero la sesión es jwt y no usas Adapter. Decide:
O bien activar el SupabaseAdapter (y usar accounts/sessions), o
Eliminar accounts/sessions si no se van a usar y quedarte con el flujo custom actual.

## Tipos y Validación
Tipos raíz de Informe: falta el tipo Informe (tabla informes) que describa estado, datos_identificativos, evaluacion_psicopedagogica, etc., y sus relaciones. Añadir en types/informe.ts.
Esquemas Zod: definir Zod por sección (datos personales, escolares, evaluación, NEAE, propuestas) y uno compuesto para “Informe completo”. Reutilizar tanto en UI como en API.
Cohesión de nombres: alinear claves del frontend con columnas reales (e.g., motivoConsulta vs motivo).

## API y Capa de Datos
Capa repositorio: crear lib/db/informes.ts con funciones server-only:
createInformeDraft(input), getInformeById(id), listInformesByUser(userId), updateInformeSection(id, section, payload), deleteInforme(id).
Internamente, orquestra inserts/updates en tablas hijas o invoca RPC.
Endpoints:
Unificar generación IA: tienes /api/generate-report (mock) y /api/groq/generate-report (real). Borra el mock o redirígelo al real.
Borrar: app/api/generate-report/route.ts.
Añadir endpoints por sección (/api/informes/[id]/secciones/...) o uno PATCH general con section + payload validado por Zod.
Añadir /api/informes/[id]/pdf para exportación (ver más abajo).
Errores y logs: centralizar manejo de errores (helpers) y respuestas consistentes { success, data|error }.
UI/UX del Flujo de Informes

Wizard por secciones: la página app/profile/generar-informe/page.tsx ahora solo genera y guarda un borrador. Crear un wizard de 5–7 pasos (datos, contexto, evaluación, diagnóstico/NEAE, propuestas, orientaciones) con autosave.
Vista de detalle/edición: añadir app/profile/informes/[id]/page.tsx con tabs por sección y InformePreview.
Duplicar/Borrar: implementar acciones en la lista actual app/profile/informes/page.tsx (botones Copy/Trash ahora sin handler).
PDF/Exportación: añadir export a PDF:
Opción SSR HTML → PDF con puppeteer/playwright (mejor calidad), o con @react-pdf/renderer.
Guardar fichero_url donde aplica en tablas (info_relevante_alumno, propuesta_atencion_educativa, etc.).
Accesibilidad y i18n: hay rutas legales; cuida copy y encoding (ver apartado abajo).

## Groq/IA
Prompts: lib/groq/prompts.ts está bien para un MVP; parametriza secciones visibles según edad/etapa y añade instrucciones de formato Markdown consistente.
Trazabilidad: guardar también prompt + parámetros en BD (útil para reproducibilidad).
Manejo de límites: en lib/groq/client.ts ya capturas 429/401; añade reintentos con backoff para 429.

## Calidad de Código y Organización
Duplicidad Supabase: creas clientes en lib/supabase.ts, lib/auth.ts, y en páginas (app/admin/page.tsx). Centraliza:
lib/supabaseServer.ts (service role, server-only)
Si alguna vez necesitas cliente “anon” para edge/SSR, lib/supabaseAnon.ts.
Estructura de dominios: agrupar “informes” en app/(profile)/informes/... y lib/db/informes.ts, types/informe.ts, app/api/informes/....
Nombres consistentes: usa snake_case en BD y camelCase en TS; añade mappers.
Tests ligeros de server (si procede): para repositorio de informes (creación, fetch, actualización de secciones).

## Rendimiento
Selects: para listados usa select con columnas necesarias (evitar *), como ya haces en admin para algunas columnas.
Paginación: añadir query params en /api/informes/list (limit, offset o range) y filtros por estado.
Índices sugeridos:
create index on informes (autor_id, creado_en desc);
create index on datos_evaluacion_psicopedagogica (informe_id); y equivalentes en tablas hijas.

## Codificación y Contenido
Encoding: hay caracteres acentuados corrompidos en varias fuentes (probablemente guardados como ANSI/Windows-1252).
Revisar y guardar como UTF-8: ejemplos
app/profile/generar-informe/page.tsx:15
lib/groq/prompts.ts:3
app/api/generate-report/route.ts:12
lib/auth.ts:23 (cadenas con “contraseña”, “verificación”)
Esto afecta a la experiencia y a los emails renderizados.

## Qué Borrar
Mock duplicado de IA: app/api/generate-report/route.ts si ya usas /api/groq/generate-report.
Tablas NextAuth no usadas:
Si no vas a usar Adapter: accounts, sessions son redundantes con session.strategy='jwt'.
Código muerto: buscar componentes o hooks no referenciados; mantener liviano.

## Qué Crear
types/informe.ts: añadir tipo Informe raíz (tabla informes) y tipos compuestos para “informe completo”.
lib/db/informes.ts: capa repositorio con funciones CRUD y ensamblado de informe completo.
Endpoints para edición de secciones y exportación PDF.
SQL RPC transaccional para “crear informe completo” (y opcional para “duplicar informe”).
Vistas SQL para “informe_compuesto” (join de tablas 1-1/1-N a JSON), si eliges la opción normalizada.
Qué Mover/Refactorizar

Centralizar Supabase server-only en lib/supabaseServer.ts y usarlo en:
app/api/* y app/admin/page.tsx:28.
Agrupar APIs de informes bajo un módulo/handler común y compartir validaciones (Zod).
Unificar nombres entre formulario (GroqTestForm) y el modelo final; mapear en una función clara (DTO → dominio).
Prioridad (Propuesta Paso a Paso)

P1: Arreglar encoding a UTF-8 en archivos con texto español y borrar el endpoint mock duplicado.
P2: Definir Informe y Zod por secciones en types/informe.ts + lib/validation/informe.ts.
P3: Crear lib/db/informes.ts y migrar /api/informes/* a usarlo; añadir índice autor_id.
P4: Decidir modelo (normalizado vs JSONB). Si normalizado, crear RPC transaccional y vistas de “informe completo”.
P5: Implementar página de detalle/edición app/profile/informes/[id] con tabs por sección y autosave.
P6: Exportación a PDF y guardado de fichero_url.
P7: Políticas RLS o validación de autoría exhaustiva si mantienes service role.
¿Quieres que empecemos por P1 (corregir encoding y eliminar el endpoint mock) o prefieres que definamos primero los tipos Informe + Zod (P2) para consolidar el contrato de datos?
---