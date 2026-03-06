-- =============================================================================
-- SOFT DELETE — Orientia
-- =============================================================================
-- Ejecuta este script en el SQL Editor de Supabase (una sola vez).
-- Añade la columna deleted_at a las tres tablas principales.
-- Los registros con deleted_at IS NOT NULL se consideran eliminados.
-- =============================================================================

-- 1. casos_intervencion
ALTER TABLE public.casos_intervencion
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

CREATE INDEX IF NOT EXISTS casos_intervencion_idx_deleted_at
  ON public.casos_intervencion (deleted_at)
  WHERE deleted_at IS NULL;

-- 2. intervenciones
ALTER TABLE public.intervenciones
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

CREATE INDEX IF NOT EXISTS intervenciones_idx_deleted_at
  ON public.intervenciones (deleted_at)
  WHERE deleted_at IS NULL;

-- 3. informes
ALTER TABLE public.informes
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

CREATE INDEX IF NOT EXISTS informes_idx_deleted_at
  ON public.informes (deleted_at)
  WHERE deleted_at IS NULL;

-- =============================================================================
-- VERIFICACIÓN
-- =============================================================================
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND column_name = 'deleted_at'
--   AND table_name IN ('casos_intervencion', 'intervenciones', 'informes');
--
-- Resultado esperado: 3 filas, una por tabla.
-- =============================================================================
