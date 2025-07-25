# Plan de Implementación - Mis Informes

-Crear estructura base de la página y tipos de datos

- Crear el directorio `app/profile/informes/` y el archivo `page.tsx` principal
- Definir interfaces TypeScript para `Informe` y `FiltrosState` en un archivo de tipos
- Implementar el layout básico de la página con título y estructura inicial
- _Requisitos: 1.1, 4.1, 4.2_

- [ ] 2. Implementar componente de estado vacío

  - Crear `InformesEmptyState.tsx` con diseño centrado y mensaje informativo
  - Incluir icono, texto descriptivo y botón para crear nuevo informe
  - Aplicar estilos consistentes con el tema de la aplicación
  - _Requisitos: 1.2, 4.3_

- [ ] 3. Crear componente de tarjeta de informe individual

  - Implementar `InformeCard.tsx` con toda la información requerida del informe
  - Mostrar nombre del alumno, centro, curso, estado, fechas y extracto del motivo
  - Aplicar estilos de Card UI existentes con hover effects
  - Incluir badges colorizados para diferentes estados de informe
  - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5, 4.3_

- [ ] 4. Desarrollar sistema de filtros y búsqueda

  - Crear `InformesFilters.tsx` con campo de búsqueda en tiempo real
  - Implementar filtros por estado (todos, borrador, completado, archivado)
  - Añadir filtro de ordenamiento por fecha y nombre
  - Incluir botón para limpiar todos los filtros activos
  - _Requisitos: 2.1, 2.2, 2.3, 2.4_

- [ ] 5. Implementar grid responsivo de informes

  - Crear `InformesGrid.tsx` que renderice las tarjetas en layout responsivo
  - Configurar grid de 1 columna en móvil, 2 en tablet, 3 en desktop
  - Integrar estados de carga con componente Spinner existente
  - Manejar la visualización del estado vacío cuando no hay informes
  - _Requisitos: 1.1, 1.3, 4.4_

- [ ] 6. Crear menú de acciones para cada informe

  - Implementar `InformeActions.tsx` como dropdown menu con todas las acciones
  - Incluir opciones: Ver, Editar, Duplicar y Eliminar informe
  - Añadir iconos apropiados para cada acción usando Lucide React
  - Implementar confirmación modal para la acción de eliminar
  - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 7. Integrar lógica de filtrado y búsqueda en la página principal

  - Conectar los filtros con el estado de la página principal
  - Implementar lógica de filtrado en tiempo real para búsqueda por texto
  - Aplicar filtros combinados (estado + búsqueda + ordenamiento)
  - Añadir debounce a la búsqueda para optimizar rendimiento
  - _Requisitos: 2.1, 2.2, 2.3, 2.4_

- [ ] 8. Implementar navegación y acciones de informe

  - Conectar botón "Ver" para mostrar informe en modo solo lectura
  - Implementar navegación a editor para la acción "Editar"
  - Crear lógica de duplicación de informe con estado "borrador"
  - Implementar eliminación con confirmación y actualización de lista
  - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. Añadir manejo de errores y estados de carga

  - Implementar skeleton loaders durante la carga inicial de datos
  - Crear componentes de error con botones de reintento
  - Añadir toast notifications para feedback de acciones
  - Manejar errores de red y estados de conectividad
  - _Requisitos: 4.4_

- [ ] 10. Activar enlace en sidebar y testing final
  - Modificar `ProfileSidebar.tsx` para habilitar el enlace "Mis Informes"
  - Remover la propiedad `disabled: true` del item de navegación
  - Verificar navegación correcta y estado activo del enlace
  - Realizar testing manual de toda la funcionalidad implementada
  - _Requisitos: 4.1, 4.2_
