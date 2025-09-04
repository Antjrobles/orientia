'use client';

import ErrorView from '@/components/ErrorView';

export default function NotPermittedPage() {
  return (
    <ErrorView
      code="403 – Forbidden"
      title="Acceso restringido"
      description="No tienes permisos para acceder a este recurso. Si crees que es un error, contacta al administrador."
      icon="shield"
      secondaryAction={{ type: 'back', label: 'Volver' }}
      primaryAction={{ type: 'link', label: 'Mi Cuenta', href: '/profile' }}
    />
  );
}

