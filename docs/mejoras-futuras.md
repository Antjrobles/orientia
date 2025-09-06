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

- [x] **Navegación por teclado** - Tab order correcto
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

- [ ] **Estrategia de datos** - Decidir entre normalización (mantener tablas normalizadas con vistas/materialized views para "Informe completo") o usar JSONB en informes para todo, eliminando tablas 1-1/1-N específicas
- [ ] **Transacciones** - Crear función SQL (RPC) para “crear informe completo” que inserte en informes y tablas hijas atómicamente
- [ ] **Índices y claves** - Añadir índices en informes(autor_id), datos_* (informe_id), y *_id foráneos; verificar UNIQUE en relaciones 1-1
- [ ] **Timestamps** - Añadir trigger updated_at para actualizado_en en todas las tablas que lo tengan

## Seguridad y Acceso a Datos

- [ ] **Service role en servidor** - Centralizar SUPABASE_SERVICE_ROLE_KEY en un helper “server-only” y revisar lib/supabase.ts:1 para evitar imports desde componentes cliente
- [ ] **Políticas RLS** - Definir políticas por autor_id en tablas hijas con JWT de usuario, o validar autoría en servidor con service role (mantener patrón de /api/informes/list y /api/informes/create)
- [ ] **NextAuth Adapter** - Decidir entre activar SupabaseAdapter (usar accounts/sessions) o eliminar tablas accounts/sessions si se mantiene el flujo custom con JWT

## Tipos y Validación

- [ ] **Tipos raíz de Informe** - Añadir tipo Informe (tabla informes) con estado, datos_identificativos, evaluacion_psicopedagogica, etc., en types/informe.ts
- [ ] **Esquemas Zod** - Definir esquemas Zod por sección (datos personales, escolares, evaluación, NEAE, propuestas) y uno compuesto para “Informe completo” reutilizable en UI y API
- [ ] **Cohesión de nombres** - Alinear claves del frontend (e.g., motivoConsulta) con columnas reales (e.g., motivo)

## API y Capa de Datos

- [ ] **Capa repositorio** - Crear lib/db/informes.ts con funciones server-only: createInformeDraft(input), getInformeById(id), listInformesByUser(userId), updateInformeSection(id, section, payload), deleteInforme(id)
- [ ] **Unificar generación IA** - Eliminar /api/generate-report (mock) o redirigirlo a /api/groq/generate-report (real)
- [ ] **Borrar mock** - Eliminar app/api/generate-report/route.ts si no se usa
- [ ] **Endpoints por sección** - Añadir /api/informes/[id]/secciones/... o un PATCH general con section + payload validado por Zod
- [ ] **Exportación PDF** - Añadir /api/informes/[id]/pdf para exportación
- [ ] **Errores y logs** - Centralizar manejo de errores (helpers) y respuestas consistentes { success, data|error }

## UI/UX del Flujo de Informes

- [ ] **Wizard por secciones** - Crear wizard de 5–7 pasos (datos, contexto, evaluación, diagnóstico/NEAE, propuestas, orientaciones) con autosave en app/profile/generar-informe/page.tsx
- [ ] **Vista de detalle/edición** - Añadir app/profile/informes/[id]/page.tsx con tabs por sección y InformePreview
- [ ] **Duplicar/Borrar** - Implementar acciones Copy/Trash en app/profile/informes/page.tsx
- [ ] **PDF/Exportación** - Implementar exportación a PDF con SSR HTML → PDF (puppeteer/playwright) o @react-pdf/renderer, guardando fichero_url en tablas relevantes
- [ ] **Accesibilidad y i18n** - Revisar copy y encoding para rutas legales

## Groq/IA

- [ ] **Prompts** - Parametrizar secciones visibles según edad/etapa en lib/groq/prompts.ts y añadir instrucciones de formato Markdown consistente
- [ ] **Trazabilidad** - Guardar prompt + parámetros en BD para reproducibilidad
- [ ] **Manejo de límites** - Añadir reintentos con backoff para errores 429 en lib/groq/client.ts

## Calidad de Código y Organización

- [ ] **Centralizar Supabase** - Crear lib/supabaseServer.ts (service role, server-only) y, si es necesario, lib/supabaseAnon.ts para edge/SSR
- [ ] **Estructura de dominios** - Agrupar “informes” en app/(profile)/informes/..., lib/db/informes.ts, types/informe.ts, app/api/informes/...
- [ ] **Nombres consistentes** - Usar snake_case en BD y camelCase en TS; añadir mappers
- [ ] **Tests ligeros** - Implementar tests para repositorio de informes (creación, fetch, actualización de secciones)

## Rendimiento

- [ ] **Selects** - Usar select con columnas necesarias (evitar *) en listados
- [ ] **Paginación** - Añadir query params (limit, offset o range) y filtros por estado en /api/informes/list
- [ ] **Índices** - Crear índices en informes (autor_id, creado_en desc) y datos_evaluacion_psicopedagogica (informe_id) para tablas hijas

## Codificación y Contenido

- [ ] **Encoding** - Corregir caracteres acentuados corrompidos (guardar como UTF-8) en:
  - app/profile/generar-informe/page.tsx:15
  - lib/groq/prompts.ts:3
  - app/api/generate-report/route.ts:12
  - lib/auth.ts:23 (cadenas con “contraseña”, “verificación”)
- [ ] **Revisión de copy** - Asegurar que el copy no afecte emails renderizados ni la experiencia

## Qué Borrar

- [ ] **Mock duplicado de IA** - Eliminar app/api/generate-report/route.ts si se usa /api/groq/generate-report
- [ ] **Tablas NextAuth no usadas** - Eliminar accounts, sessions si no se usa SupabaseAdapter y se mantiene session.strategy='jwt'
- [ ] **Código muerto** - Buscar y eliminar componentes o hooks no referenciados

## Qué Crear

- [ ] **Tipos** - Crear types/informe.ts con tipo Informe raíz y tipos compuestos para “informe completo”
- [ ] **Capa repositorio** - Crear lib/db/informes.ts con funciones CRUD y ensamblado de informe completo
- [ ] **Endpoints** - Añadir endpoints para edición de secciones y exportación PDF
- [ ] **SQL RPC** - Crear RPC transaccional para “crear informe completo” y opcional para “duplicar informe”
- [ ] **Vistas SQL** - Crear vistas para “informe_compuesto” (join de tablas 1-1/1-N a JSON) si se elige normalización

## Qué Mover/Refactorizar

- [ ] **Centralizar Supabase** - Mover lógica a lib/supabaseServer.ts y usarlo en app/api/* y app/admin/page.tsx:28
- [ ] **APIs de informes** - Agrupar bajo un módulo/handler común y compartir validaciones Zod
- [ ] **Nombres unificados** - Unificar nombres entre formulario (GroqTestForm) y modelo final con una función DTO → dominio

## Prioridad (Propuesta Paso a Paso)

- [ ] **P1** - Arreglar encoding a UTF-8 en archivos con texto español y eliminar el endpoint mock duplicado
- [ ] **P2** - Definir Informe y Zod por secciones en types/informe.ts + lib/validation/informe.ts
- [ ] **P3** - Crear lib/db/informes.ts y migrar /api/informes/* a usarlo; añadir índice autor_id
- [ ] **P4** - Decidir modelo (normalizado vs JSONB); si normalizado, crear RPC transaccional y vistas de “informe completo”
- [ ] **P5** - Implementar página de detalle/edición app/profile/informes/[id] con tabs por sección y autosave
- [ ] **P6** - Implementar exportación a PDF y guardado de fichero_url
- [ ] **P7** - Implementar políticas RLS o validación de autoría exhaustiva con service role

## Varios
- [ ] Añadir toast al formulario de contacto
- [ ] Añadir validación al formulario de contacto
- [ ] Añadir Vercel Analytics y Google Analytics
- [ ] Añadir más tests (unitarios y de integración)
