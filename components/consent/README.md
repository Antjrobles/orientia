# Consent Components

Componentes relacionados con el consentimiento de cookies y privacidad.

- `ConsentProvider.tsx`: Contexto React (client) que gestiona el estado de consentimiento por categorías, persistencia en cookie (`consent_status`), respeto a GPC y broadcast de cambios.
- `CookieBanner.tsx`: Banner inferior para primera visita o sin elección previa. Permite aceptar/rechazar todo y configurar categorías rápidas.
- `AjustesCookiesPanel.tsx`: Panel de toggles para la página `/ajustes-cookies`, sincronizado con el provider.

Notas:

- Las categorías actuales: `necessary`, `preferences`, `analytics`, `performance`, `ads`.
- El provider emite `window.__consent__` y el evento `consent:updated` para que integraciones externas puedan reaccionar.
- Si añades integraciones (analytics/SDKs), cárgalas condicionalmente según el estado del provider.

Extensión:

- Ajusta la lista de cookies a purgar en `lib/consent.ts` (`removeNonEssentialCookies`).
- Añade loaders condicionales por categoría (helpers) si integras proveedores reales.
