-- =============================================================================
-- ROW-LEVEL SECURITY (RLS) — Orientia
-- =============================================================================
-- Ejecuta este script en el SQL Editor de Supabase (una sola vez).
-- El backend usa SERVICE_ROLE_KEY y bypasea RLS intencionadamente.
-- RLS protege frente a accesos directos con la anon/public key,
-- consultas directas desde Supabase Studio con roles no-admin,
-- y cualquier cliente que no sea el backend de Next.js.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- NOTA IMPORTANTE sobre auth.uid() vs columna autor_id
-- -----------------------------------------------------------------------------
-- Next.js usa NextAuth con JWT propio, NO el sistema de auth de Supabase.
-- Por ello auth.uid() siempre es NULL para los usuarios de la app.
-- Las políticas usan (SELECT auth.role()) = 'service_role' para permitir
-- solo al backend (SERVICE_ROLE_KEY) operar sobre los datos.
-- Esto impide que la anon key o cualquier cliente externo lean/escriban datos.
-- -----------------------------------------------------------------------------

-- =============================================================================
-- 1. TABLA: casos_intervencion
-- =============================================================================

ALTER TABLE public.casos_intervencion ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas si existen (idempotente)
DROP POLICY IF EXISTS "casos_intervencion_service_role_all" ON public.casos_intervencion;

-- Solo el service role (backend Next.js) puede hacer cualquier operación
CREATE POLICY "casos_intervencion_service_role_all"
  ON public.casos_intervencion
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

-- =============================================================================
-- 2. TABLA: intervenciones
-- =============================================================================

ALTER TABLE public.intervenciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "intervenciones_service_role_all" ON public.intervenciones;

CREATE POLICY "intervenciones_service_role_all"
  ON public.intervenciones
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

-- =============================================================================
-- 3. TABLA: informes
-- =============================================================================

ALTER TABLE public.informes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "informes_service_role_all" ON public.informes;

CREATE POLICY "informes_service_role_all"
  ON public.informes
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

-- =============================================================================
-- 4. TABLA: users
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_service_role_all" ON public.users;

CREATE POLICY "users_service_role_all"
  ON public.users
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

-- =============================================================================
-- 5. TABLA: trusted_devices
-- =============================================================================

ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trusted_devices_service_role_all" ON public.trusted_devices;

CREATE POLICY "trusted_devices_service_role_all"
  ON public.trusted_devices
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

-- =============================================================================
-- 6. TABLA: device_verification_tokens
-- =============================================================================

ALTER TABLE public.device_verification_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "device_verification_tokens_service_role_all" ON public.device_verification_tokens;

CREATE POLICY "device_verification_tokens_service_role_all"
  ON public.device_verification_tokens
  FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

-- =============================================================================
-- 7. STORAGE: bucket profile-private
-- =============================================================================
-- Las políticas de Storage se gestionan desde Supabase Dashboard > Storage > Policies
-- o mediante la API de administración. El script SQL no puede crearlas directamente.
-- 
-- INSTRUCCIONES MANUALES (Supabase Dashboard > Storage > profile-private > Policies):
--
-- Asegúrate de que el bucket "profile-private" tiene public = false.
-- Elimina cualquier política existente de SELECT/INSERT/UPDATE/DELETE.
-- No añadas ninguna política nueva — sin políticas + RLS activado = acceso denegado
-- por defecto para todos excepto service_role.
--
-- El backend usa SERVICE_ROLE_KEY que bypasea estas restricciones de storage.
-- =============================================================================

-- =============================================================================
-- VERIFICACIÓN — ejecuta estas queries para confirmar que RLS está activo:
-- =============================================================================
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
--   AND tablename IN (
--     'casos_intervencion',
--     'intervenciones',
--     'informes',
--     'users',
--     'trusted_devices',
--     'device_verification_tokens'
--   );
--
-- Resultado esperado: rowsecurity = true para todas las tablas listadas.
--
-- SELECT schemaname, tablename, policyname, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public';
--
-- Resultado esperado: una política "..._service_role_all" por cada tabla.
-- =============================================================================
