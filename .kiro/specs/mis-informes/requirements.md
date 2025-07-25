# Documento de Requisitos - Mis Informes

## Introducción

La sección "Mis informes" es una funcionalidad clave del sistema que permitirá a los orientadores educativos gestionar, visualizar y organizar todos los informes psicopedagógicos que han creado. Esta página proporcionará una vista centralizada de todos los informes del usuario, con capacidades de filtrado, búsqueda y gestión, manteniendo la consistencia visual y funcional con el resto de la aplicación.

## Requisitos

### Requisito 1

**Historia de Usuario:** Como orientador educativo, quiero ver una lista de todos mis informes creados, para poder acceder rápidamente a cualquier informe anterior.

#### Criterios de Aceptación

1. CUANDO el usuario acceda a la página "Mis informes" ENTONCES el sistema DEBERÁ mostrar una lista de todos los informes creados por el usuario
2. CUANDO no existan informes ENTONCES el sistema DEBERÁ mostrar un estado vacío con mensaje informativo y botón para crear nuevo informe
3. CUANDO existan informes ENTONCES el sistema DEBERÁ mostrar cada informe con título, fecha de creación, estado y acciones disponibles

### Requisito 2

**Historia de Usuario:** Como orientador educativo, quiero filtrar y buscar entre mis informes, para encontrar rápidamente el informe que necesito.

#### Criterios de Aceptación

1. CUANDO el usuario escriba en el campo de búsqueda ENTONCES el sistema DEBERÁ filtrar los informes en tiempo real por título o contenido
2. CUANDO el usuario seleccione un filtro de estado ENTONCES el sistema DEBERÁ mostrar solo los informes que coincidan con ese estado
3. CUANDO el usuario seleccione un filtro de fecha ENTONCES el sistema DEBERÁ mostrar los informes ordenados por fecha de creación
4. CUANDO se apliquen múltiples filtros ENTONCES el sistema DEBERÁ combinar todos los criterios de filtrado

### Requisito 3

**Historia de Usuario:** Como orientador educativo, quiero realizar acciones sobre mis informes (ver, editar, duplicar, eliminar), para gestionar eficientemente mi trabajo.

#### Criterios de Aceptación

1. CUANDO el usuario haga clic en "Ver" ENTONCES el sistema DEBERÁ mostrar el informe en modo de solo lectura
2. CUANDO el usuario haga clic en "Editar" ENTONCES el sistema DEBERÁ redirigir al editor del informe
3. CUANDO el usuario haga clic en "Duplicar" ENTONCES el sistema DEBERÁ crear una copia del informe con estado "borrador"
4. CUANDO el usuario haga clic en "Eliminar" ENTONCES el sistema DEBERÁ solicitar confirmación antes de eliminar permanentemente
5. CUANDO el usuario confirme la eliminación ENTONCES el sistema DEBERÁ eliminar el informe y actualizar la lista

### Requisito 4

**Historia de Usuario:** Como orientador educativo, quiero que la página mantenga la consistencia visual con el resto de la aplicación, para tener una experiencia de usuario coherente.

#### Criterios de Aceptación

1. CUANDO se cargue la página ENTONCES el sistema DEBERÁ usar el mismo layout que otras páginas del perfil
2. CUANDO se muestren los componentes ENTONCES el sistema DEBERÁ usar los mismos estilos y colores del tema existente
3. CUANDO se muestren las tarjetas de informes ENTONCES el sistema DEBERÁ usar componentes UI consistentes con el resto de la aplicación
4. CUANDO se muestren los estados de carga ENTONCES el sistema DEBERÁ usar el componente Spinner existente

### Requisito 5

**Historia de Usuario:** Como orientador educativo, quiero ver información relevante de cada informe en la lista, para poder identificar rápidamente el contenido sin abrirlo.

#### Criterios de Aceptación

1. CUANDO se muestre un informe en la lista ENTONCES el sistema DEBERÁ mostrar el título del informe
2. CUANDO se muestre un informe en la lista ENTONCES el sistema DEBERÁ mostrar la fecha de creación y última modificación
3. CUANDO se muestre un informe en la lista ENTONCES el sistema DEBERÁ mostrar el estado actual (borrador, completado, etc.)
4. CUANDO se muestre un informe en la lista ENTONCES el sistema DEBERÁ mostrar un resumen o extracto del contenido
5. CUANDO se muestre un informe en la lista ENTONCES el sistema DEBERÁ mostrar iconos visuales que representen el tipo de informe
