# Errors Components

Vistas y utilidades para páginas de error.

- `ErrorView.tsx`: Componente reutilizable para renderizar páginas de error (códigos, títulos, descripción y acciones). Usado por `app/not-found.tsx` (404) y `app/(errors)/not-permitted/page.tsx` (403).

Uso rápido:
- Propiedades principales: `code`, `title`, `description`, `icon` (`'shield' | 'home' | 'none'`), `primaryAction`/`secondaryAction` (link o back).
- Mantiene un diseño coherente con el resto del sitio (colores y accesibilidad).

Extensión:
- Puedes crear variantes (p. ej., 500/maintenance) en `app/(errors)/...` reutilizando `ErrorView` y añadiendo metadatos/SEO específicos.

