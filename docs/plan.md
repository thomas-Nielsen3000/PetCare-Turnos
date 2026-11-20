# PetCare Turnos — Plan de desarrollo

## 1. Objetivo

Organizar las etapas necesarias para desarrollar, probar y publicar PetCare Turnos, estableciendo un orden de trabajo y los resultados esperados en cada etapa.

## 2. Metodología de trabajo

El proyecto se desarrollará de manera incremental, dividiendo el trabajo en tareas pequeñas y verificables.

Cada tarea deberá:

- Tener un objetivo definido.
- Contar con criterios de aceptación.
- Ser implementada y probada antes de marcarse como terminada.
- Contar con un commit propio en Git.
- Mantener actualizada la documentación cuando corresponda.

## 3. Etapas del proyecto

### Etapa 1 — Preparación y documentación

Objetivo: preparar el entorno de trabajo y definir el funcionamiento del sistema.

Actividades:
- Crear la estructura inicial del proyecto.
- Configurar frontend y backend.
- Crear el repositorio GitHub.
- Documentar la idea del proyecto.
- Definir las reglas de negocio.
- Organizar las tareas de desarrollo.

Resultado esperado: proyecto inicializado y documentación preparada.

### Etapa 2 — Base de datos

Objetivo: diseñar e implementar la estructura de almacenamiento.

Actividades:
- Configurar PostgreSQL.
- Crear las tablas de usuarios, mascotas, servicios y turnos.
- Definir relaciones y restricciones.
- Crear datos iniciales de prueba.
- Verificar las conexiones desde el backend.

Resultado esperado: base de datos funcional y conectada al servidor.

### Etapa 3 — Autenticación y usuarios

Objetivo: permitir el acceso seguro al sistema.

Actividades:
- Implementar registro de clientes.
- Implementar inicio de sesión.
- Proteger contraseñas con bcrypt.
- Generar y verificar tokens JWT.
- Implementar roles de cliente y administrador.
- Proteger rutas según los permisos.

Resultado esperado: usuarios autenticados con permisos diferenciados.

### Etapa 4 — Gestión de mascotas

Objetivo: permitir que los clientes administren sus mascotas.

Actividades:
- Registrar mascotas.
- Consultar mascotas propias.
- Modificar información.
- Eliminar mascotas cuando corresponda.
- Validar la propiedad de cada mascota.

Resultado esperado: gestión de mascotas funcional.

### Etapa 5 — Gestión de servicios

Objetivo: permitir consultar y administrar los servicios ofrecidos.

Actividades:
- Consultar servicios activos.
- Crear nuevos servicios.
- Modificar precios y duraciones.
- Activar y desactivar servicios.
- Restringir las operaciones administrativas.

Resultado esperado: catálogo de servicios funcional.

### Etapa 6 — Sistema de turnos

Objetivo: implementar el núcleo del sistema.

Actividades:
- Consultar disponibilidad.
- Reservar turnos.
- Validar anticipación mínima.
- Controlar horarios de atención.
- Evitar reservas superpuestas.
- Aplicar el límite de turnos activos.
- Calcular precios desde el backend.
- Consultar y cancelar turnos.
- Permitir modificaciones bajo las condiciones establecidas.

Resultado esperado: sistema de reservas funcional y validado.

### Etapa 7 — Panel administrativo

Objetivo: ofrecer herramientas para administrar el establecimiento.

Actividades:
- Consultar todos los turnos.
- Consultar clientes y mascotas.
- Gestionar servicios.
- Administrar horarios de atención.
- Supervisar el estado de las reservas.

Resultado esperado: panel administrativo funcional.

### Etapa 8 — Desarrollo del frontend

Objetivo: conectar las funcionalidades del backend con una interfaz web completa.

Actividades:
- Diseñar la página principal.
- Crear formularios de registro e inicio de sesión.
- Crear el panel del cliente.
- Crear la sección de mascotas.
- Crear el catálogo de servicios.
- Crear el formulario de reservas.
- Crear la sección de turnos.
- Crear el panel administrativo.
- Incorporar validaciones y mensajes de error.
- Adaptar la interfaz a dispositivos móviles.

Resultado esperado: aplicación web completa y conectada con la API.

### Etapa 9 — Pruebas y correcciones

Objetivo: verificar que el sistema funcione correctamente.

Actividades:
- Probar las funcionalidades principales.
- Verificar las reglas de negocio.
- Probar casos válidos e inválidos.
- Comprobar permisos y autenticación.
- Verificar la persistencia de datos.
- Corregir errores encontrados.
- Elaborar el informe de pruebas.

Resultado esperado: sistema probado y corregido.

### Etapa 10 — Despliegue

Objetivo: publicar la aplicación para que pueda utilizarse desde internet.

Actividades:
- Desplegar la base de datos.
- Publicar el backend.
- Publicar el frontend.
- Configurar variables de entorno.
- Configurar la comunicación entre frontend y backend.
- Comprobar el funcionamiento desde la dirección pública.

Resultado esperado: aplicación accesible desde internet.

### Etapa 11 — Revisión final

Objetivo: verificar que el proyecto cumpla con todos los requisitos de la entrega.

Actividades:
- Revisar la documentación.
- Revisar el repositorio público.
- Comprobar que no existan secretos publicados.
- Verificar que las pruebas pasen.
- Actualizar el README.
- Comprobar los enlaces públicos.
- Preparar la presentación final.

Resultado esperado: proyecto completo y listo para entregar.

## 4. Herramientas de desarrollo

- Visual Studio Code: editor de código.
- Git: control de versiones.
- GitHub: alojamiento del repositorio.
- React y TypeScript: frontend.
- Node.js y Express: backend.
- PostgreSQL: base de datos.
- Postman: pruebas de la API.
- Vitest: pruebas automatizadas.
- Netlify: despliegue del frontend.
- Render: despliegue del backend.
- Neon: alojamiento de PostgreSQL.

## 5. Control de versiones

Se utilizará Git para registrar los cambios del proyecto.

Cada tarea completada deberá tener un commit independiente, con un mensaje que permita identificar claramente el trabajo realizado.

No se deberá marcar una tarea como terminada hasta verificar su funcionamiento y sus criterios de aceptación.

## 6. Fecha límite

La fecha límite establecida para la entrega del proyecto es el 31 de diciembre de 2026.