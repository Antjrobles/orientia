import ErrorView from '@/components/errors/ErrorView';

export default function NotFound() {
  return (
    <ErrorView
      code="404 – Not Found"
      title="Esta página no existe"
      description="La ruta solicitada no está disponible. Vuelve al inicio o visita soporte."
      icon="home"
      primaryAction={{ type: 'link', label: 'Ir al inicio', href: '/' }}
      secondaryAction={{ type: 'link', label: 'Soporte', href: '/soporte' }}
    />
  );
}
