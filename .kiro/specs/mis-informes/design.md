# Documento de Diseño - Mis Informes

## Visión General

La página "Mis informes" será una interfaz de gestión de informes que permitirá a los orientadores educativos visualizar, filtrar, buscar y gestionar todos sus informes psicopedagógicos. La página seguirá el patrón de diseño establecido en la aplicación, utilizando el layout de perfil existente y manteniendo la consistencia visual con el resto del sistema.

## Arquitectura

### Estructura de Componentes

```
app/profile/informes/
├── page.tsx (Página principal)
├── components/
│   ├── InformesGrid.tsx (Grid de informes)
│   ├── InformeCard.tsx (Tarjeta individual de informe)
│   ├── InformesFilters.tsx (Filtros y búsqueda)
│   ├── InformesEmptyState.tsx (Estado vacío)
│   └── InformeActions.tsx (Menú de acciones)
```

### Layout y Navegación

La página utilizará el `ProfileLayout` existente que incluye:

- `ProfileHeader` en la parte superior
- `ProfileSidebar` en el lado izquierdo (donde se activará el enlace "Mis Informes")
- Área de contenido principal para la funcionalidad de informes

## Componentes e Interfaces

### 1. Página Principal (`page.tsx`)

**Responsabilidades:**

- Gestionar el estado global de la página (filtros, búsqueda, datos)
- Coordinar la comunicación entre componentes
- Manejar la carga de datos y estados de loading
- Implementar la lógica de filtrado y búsqueda

**Estructura:**

```tsx
export default function InformesPage() {
  // Estados para filtros, búsqueda y datos
  // Lógica de carga de datos
  // Handlers para acciones

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1>Mis Informes</h1>
        <Button>Nuevo Informe</Button>
      </div>

      <InformesFilters />
      <InformesGrid />
    </div>
  );
}
```

### 2. Filtros y Búsqueda (`InformesFilters.tsx`)

**Funcionalidades:**

- Campo de búsqueda en tiempo real
- Filtro por estado (Todos, Borradores, Completados)
- Filtro por fecha (Más recientes, Más antiguos)
- Botón para limpiar filtros

**Diseño:**

- Barra horizontal con controles de filtrado
- Input de búsqueda con icono de lupa
- Select dropdowns para filtros
- Indicadores visuales de filtros activos

### 3. Grid de Informes (`InformesGrid.tsx`)

**Responsabilidades:**

- Renderizar la lista de informes en formato grid
- Manejar estados de carga y vacío
- Implementar paginación si es necesario

**Layout:**

- Grid responsivo (1 columna en móvil, 2-3 en desktop)
- Cada informe representado por una `InformeCard`

### 4. Tarjeta de Informe (`InformeCard.tsx`)

**Información mostrada:**

- Título del informe (nombre del alumno)
- Fecha de creación y última modificación
- Estado del informe (badge colorizado)
- Extracto del motivo de consulta
- Iconos representativos del tipo/estado
- Menú de acciones (dropdown)

**Diseño visual:**

```tsx
<Card className='hover:shadow-md transition-shadow'>
  <CardHeader>
    <div className='flex justify-between items-start'>
      <div>
        <CardTitle>{alumno.nombre}</CardTitle>
        <CardDescription>
          {centro} - {curso}
        </CardDescription>
      </div>
      <InformeActions />
    </div>
  </CardHeader>
  <CardContent>
    <div className='space-y-2'>
      <Badge variant={estadoVariant}>{estado}</Badge>
      <p className='text-sm text-muted-foreground line-clamp-2'>{motivoConsulta}</p>
      <div className='flex justify-between text-xs text-muted-foreground'>
        <span>Creado: {fechaCreacion}</span>
        <span>Modificado: {fechaModificacion}</span>
      </div>
    </div>
  </CardContent>
</Card>
```

### 5. Menú de Acciones (`InformeActions.tsx`)

**Acciones disponibles:**

- Ver informe (icono de ojo)
- Editar informe (icono de lápiz)
- Duplicar informe (icono de copia)
- Eliminar informe (icono de papelera)

**Implementación:**

- Dropdown menu con iconos y texto
- Confirmación modal para eliminación
- Navegación programática para ver/editar

### 6. Estado Vacío (`InformesEmptyState.tsx`)

**Casos de uso:**

- No hay informes creados
- No hay resultados de búsqueda/filtros
- Error en la carga de datos

**Diseño:**

- Ilustración o icono central
- Mensaje descriptivo
- Botón de acción (crear nuevo informe)

## Modelos de Datos

### Interfaz de Informe

```typescript
interface Informe {
  id: string;
  titulo: string;
  autor_id: string;
  estado: 'borrador' | 'completado' | 'archivado';
  fecha_creacion: Date;
  fecha_modificacion: Date;
  datos_identificativos: {
    alumno: {
      nombre: string;
      fecha_nacimiento: string;
      nie: string;
      curso: string;
    };
    centro: {
      nombre: string;
      localidad: string;
    };
    tutores: string[];
    etapa_escolar: string;
  };
  evaluacion_psicopedagogica: {
    motivo: string;
    // Otros campos del informe...
  };
}
```

### Estados de Filtros

```typescript
interface FiltrosState {
  busqueda: string;
  estado: 'todos' | 'borrador' | 'completado' | 'archivado';
  ordenamiento: 'fecha_desc' | 'fecha_asc' | 'nombre_asc' | 'nombre_desc';
}
```

## Gestión de Errores

### Estrategias de Error Handling

1. **Errores de Carga:**

   - Mostrar skeleton loaders durante la carga
   - Mensaje de error con botón de reintento
   - Fallback a estado vacío si no hay datos

2. **Errores de Acciones:**

   - Toast notifications para feedback inmediato
   - Confirmaciones para acciones destructivas
   - Rollback de estado en caso de fallo

3. **Errores de Red:**
   - Indicadores de conectividad
   - Retry automático con backoff
   - Modo offline básico (mostrar datos cacheados)

## Estrategia de Testing

### Tests Unitarios

1. **Componentes:**

   - Renderizado correcto con diferentes props
   - Manejo de eventos de usuario
   - Estados de loading y error

2. **Lógica de Filtrado:**

   - Filtros individuales y combinados
   - Búsqueda en tiempo real
   - Ordenamiento de resultados

3. **Acciones de Informe:**
   - Navegación correcta
   - Confirmaciones de eliminación
   - Duplicación de informes

### Tests de Integración

1. **Flujo Completo:**

   - Carga de página → Filtrado → Acción
   - Navegación entre páginas
   - Persistencia de filtros

2. **Interacciones de Usuario:**
   - Búsqueda y filtrado combinados
   - Acciones en lote (si se implementan)
   - Responsive behavior

## Consideraciones de Rendimiento

### Optimizaciones

1. **Carga de Datos:**

   - Paginación para listas grandes
   - Lazy loading de imágenes/contenido
   - Debounce en búsqueda en tiempo real

2. **Renderizado:**

   - Memoización de componentes pesados
   - Virtualización para listas muy largas
   - Optimistic updates para acciones rápidas

3. **Caching:**
   - Cache de resultados de búsqueda
   - Invalidación inteligente de cache
   - Prefetch de datos relacionados

## Accesibilidad

### Estándares WCAG

1. **Navegación por Teclado:**

   - Tab order lógico
   - Shortcuts para acciones comunes
   - Focus management en modals

2. **Screen Readers:**

   - ARIA labels descriptivos
   - Live regions para updates dinámicos
   - Semantic HTML structure

3. **Contraste y Visibilidad:**
   - Colores accesibles para badges de estado
   - Iconos con texto alternativo
   - Indicadores visuales claros

## Responsive Design

### Breakpoints

1. **Mobile (< 768px):**

   - Grid de 1 columna
   - Filtros colapsables
   - Acciones en drawer/modal

2. **Tablet (768px - 1024px):**

   - Grid de 2 columnas
   - Filtros en barra horizontal
   - Hover states reducidos

3. **Desktop (> 1024px):**
   - Grid de 3 columnas
   - Todos los controles visibles
   - Hover effects completos
