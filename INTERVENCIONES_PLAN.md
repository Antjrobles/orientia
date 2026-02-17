# Plan de Implementación: Módulo `Intervenciones`

## 1. Objetivo
Convertir Orientia en una suite de seguimiento de casos, no solo un generador de informes.  
Nuevo módulo: `Intervenciones`, para registrar evidencias, reuniones y notas del caso en línea temporal, con apoyo de IA para redacción técnica y salida en PDF.

## 2. Alcance Inicial (MVP)
- Nueva sección en perfil: `Intervenciones`.
- Alta de caso por:
  - Iniciales del alumno (ej: `JBL`)
  - Nombre del centro
- Subida de notas/documentos (`.txt`, `.pdf`, `.docx`).
- Clasificación obligatoria:
  - Ámbito: `escolar` | `sociocultural`
  - Subámbito inicial: `familia`, `tutoría`, `profesorado`, `claustro`, `servicios_sociales`, `otros`
- Extracción y normalización con IA:
  - `texto_original` (sin alterar)
  - `texto_redactado_ia` (lenguaje profesional)
- Vista cronológica por caso (fecha + tipo de intervención + origen del documento).
- Búsqueda por `iniciales + centro`.
- Exportación PDF de intervenciones (plantilla inicial).

## 3. Modelo de Datos (propuesta)
## 3.1 Tabla `casos_intervencion`
- `id` (uuid, pk)
- `autor_id` (uuid, fk -> users.id)
- `iniciales_alumno` (text, uppercase)
- `centro_nombre` (text)
- `slug_busqueda` (text) -> normalizado: `JBL|IES_X`
- `created_at` (timestamp)
- `updated_at` (timestamp)
- Índice único recomendado: (`autor_id`, `iniciales_alumno`, `centro_nombre`)

## 3.2 Tabla `intervenciones`
- `id` (uuid, pk)
- `caso_id` (uuid, fk -> casos_intervencion.id)
- `autor_id` (uuid, fk -> users.id)
- `fecha_intervencion` (date)
- `ambito` (enum: escolar, sociocultural)
- `subambito` (enum inicial)
- `tipo_origen` (enum: nota_manual, docx, pdf, txt)
- `titulo` (text)
- `texto_original` (text)
- `texto_redactado_ia` (text)
- `resumen_ia` (text, opcional)
- `archivo_url` (text, opcional)
- `archivo_nombre` (text, opcional)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- Índices: (`caso_id`, `fecha_intervencion` desc), (`autor_id`, `created_at` desc)

## 3.3 Tabla `informes_generados` (fase 2)
- `id`, `caso_id`, `tipo` (seguimiento|psicopedagogico), `pdf_url`, `metadata_json`, timestamps

## 4. Flujo Funcional
1. Usuario entra en `Intervenciones`.
2. Busca caso por iniciales + centro o crea uno nuevo.
3. Sube archivo o pega nota rápida.
4. Selecciona ámbito/subámbito y fecha.
5. Backend extrae texto (si hay archivo) y llama IA.
6. Usuario revisa `texto_redactado_ia` y guarda.
7. Caso se actualiza en timeline.
8. Usuario puede exportar PDF del caso.
9. En fase posterior, IA usa intervenciones + PDF para informe psicopedagógico.

## 5. API (App Router)
## 5.1 Casos
- `GET /api/intervenciones/casos?query=JBL&centro=...`
- `POST /api/intervenciones/casos`
- `GET /api/intervenciones/casos/:id`

## 5.2 Intervenciones
- `GET /api/intervenciones?casoId=...`
- `POST /api/intervenciones`
- `PATCH /api/intervenciones/:id`
- `DELETE /api/intervenciones/:id` (soft delete recomendado)

## 5.3 IA
- `POST /api/intervenciones/redactar`
  - input: texto + metadata
  - output: texto técnico + resumen

## 5.4 PDF
- `POST /api/intervenciones/:casoId/export-pdf`
  - genera PDF de seguimiento
  - devuelve `pdf_url`

## 6. UI (estructura propuesta)
- `app/profile/intervenciones/page.tsx`: listado de casos + buscador.
- `app/profile/intervenciones/[casoId]/page.tsx`: timeline del caso.
- `components/intervenciones/case-search.tsx`
- `components/intervenciones/intervencion-form.tsx`
- `components/intervenciones/intervencion-timeline.tsx`
- `components/intervenciones/export-pdf-button.tsx`

## 7. IA: Reglas de Redacción (MVP)
- Mantener hechos, no inventar datos.
- Corregir ortografía y sintaxis.
- Transformar estilo telegráfico a profesional.
- Etiquetar incertidumbres con “pendiente de verificación”.
- Mantener trazabilidad:
  - siempre guardar `texto_original`
  - guardar versión redactada separada

## 8. Seguridad y Cumplimiento
- Validar MIME + tamaño de archivo + extensión permitida.
- Antivirus/escaneo de archivos (fase 2 si no existe aún).
- RLS por `autor_id` en tablas nuevas.
- Auditoría mínima: `created_at`, `updated_at`, `autor_id`.
- No exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente.
- Enmascarar PII en logs de errores.

## 9. Roadmap por Fases
## Fase 1 (1-2 semanas)
- Modelo BD + migraciones.
- CRUD casos/intervenciones.
- Subida de notas + clasificación.
- Búsqueda `iniciales + centro`.
- Timeline básico.

## Fase 2 (1 semana)
- Integración IA redacción.
- Revisión manual antes de guardar.
- Exportación PDF seguimiento (v1).

## Fase 3 (1 semana)
- Uso de intervenciones y PDF para alimentar informe psicopedagógico.
- Filtros avanzados por subámbito/fecha.
- Mejoras UX (autosave, duplicar intervención, etiquetas).

## 10. Criterios de Aceptación (MVP)
- Se puede crear un caso con `iniciales + centro`.
- Se puede subir una nota/documento y clasificar en ámbito/subámbito.
- IA devuelve texto redactado y se guarda junto al original.
- Búsqueda por `iniciales + centro` devuelve el caso correcto.
- Timeline muestra intervenciones ordenadas por fecha.
- Exportación PDF de caso funciona.

## 11. Riesgos y Mitigación
- Colisión de iniciales: mitigado con `centro_nombre` + índice compuesto.
- OCR/parse de PDF irregular: fallback a pegado manual + revisión humana.
- Coste IA: usar resumen y redacción bajo demanda, no en background masivo.
- Calidad documental: mantener doble versión (original + redactada).

## 12. Decisiones Pendientes
- Naming final de subámbitos.
- Plantilla oficial del PDF (campos exactos).
- Política de retención/versionado de intervenciones.
- Si el informe psicopedagógico consumirá:
  - solo texto redactado
  - o redactado + original + metadatos.
