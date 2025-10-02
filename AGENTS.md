# Repository Guidelines

## Estructura del Proyecto

- `app/`: App Router de Next.js. Usa grupos de rutas como `(auth)`, `(legal)` y `(recursos)`. API en `app/api/*`, estilos globales en `app/globals.css`, layout en `app/layout.tsx`.
- `components/`: UI reutilizable (PascalCase) y primitivos en `components/ui/`. Ej.: `LegalHeader.tsx`, `Footer.tsx`.
- `lib/`: Utilidades e integraciones.
- `hooks/`: Hooks React (`use*.ts(x)`). Ej.: `useSessionUser.ts`.
- `types/`: Tipos compartidos.
- `public/`: Activos estáticos.
- `docs/`: Documentación.
- `middleware.ts`: Middleware (auth/SEO/seguridad).

## Comandos de Desarrollo

- `npm run dev` / `pnpm dev`: Levanta el entorno local en `http://localhost:3000`.
- `npm run build` / `pnpm build`: Compila a producción (salida en `.next/`).
- `npm run start` / `pnpm start`: Ejecuta la build de producción.
- `npm run lint` / `pnpm lint`: Linter con la config de Next.js/ESLint.

## Estilo y Convenciones

- TypeScript con `strict` activado.
- Componentes en PascalCase (`Header.tsx`, `LegalHeader.tsx`).
- Hooks en `hooks/` con prefijo `use` (`useAuth.ts`).
- Rutas: carpetas en kebab-case cuando aplique; usa grupos de rutas.
- Estilos con Tailwind; prioriza utilidades y coherencia visual.
- Imports con alias `@/*` (ver `tsconfig.json`).
- App Router: componentes de servidor por defecto; añade `"use client"` cuando sea necesario.

## Pruebas

- No hay runner configurado. Si agregas tests:
  - Ubícalos en `**/__tests__/` o `tests/`.
  - Nómbralos `*.test.ts` / `*.test.tsx`.
  - Añade script `test` (Vitest/Jest) y cobertura mínima acordada con el equipo.

## Commits y Pull Requests

- Sigue Conventional Commits con scopes cuando aplique. Ej.:
  - `feat(ui): Mejora página 404`
  - `fix(auth): corrige redirección tras login`
- PRs: descripción clara, issue enlazado, capturas para cambios de UI y notas sobre migraciones/vars de entorno.
- Mantén PRs pequeños y enfocados; actualiza `docs/` si cambia el comportamiento.

## Seguridad y Configuración

- Variables en `.env.local` (no subir secretos). Claves típicas: `NEXTAUTH_*`, `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_*`, `FACEBOOK_*`, `EMAIL_*`, `PLUNK_API_KEY`, `GROQ_API_KEY`.
- Para desarrollo, define las variables antes de `npm run dev`.
- Revisa `middleware.ts` y `app/api/*` al tocar autenticación o lógica sensible.
- Despliegue: configura variables en tu plataforma (p.ej. Vercel), verifica con `npm run build` y usa `npm run start` para validar.

## VARIOS

- Añadir toast al formulario de contacto
- Añadir validación al formulario de contacto
- Añadir Vercel Analytics y Google Analytics
- Añadir más tests (unitarios y de integración)
