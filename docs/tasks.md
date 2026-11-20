# PetCare Turnos — Seguimiento de tareas

## Estado de las tareas

- [x] T01 — Preparación inicial del proyecto.
- [x] T02 — Documentación y especificación.
- [x] T03 — Diseño y configuración de la base de datos.
- [x] T04 — Registro, autenticación y autorización.
- [x] T05 — Gestión de mascotas.
- [x] T06 — Gestión de servicios.
- [x] T07 — Sistema de reservas y turnos.
- [ ] T08 — Panel administrativo.
- [ ] T09 — Desarrollo e integración del frontend.
- [ ] T10 — Pruebas y corrección de errores.
- [ ] T11 — Despliegue de la aplicación.
- [ ] T12 — Revisión y preparación de la entrega final.

## Detalle de las tareas

### T01 — Preparación inicial del proyecto

Estado: COMPLETADA.

Actividades:
- Crear el repositorio del proyecto.
- Configurar React, TypeScript y Vite.
- Configurar Node.js, Express y TypeScript.
- Crear el endpoint inicial de salud del servidor.
- Configurar Git y GitHub.
- Crear los archivos iniciales del proyecto.

Criterio de aceptación:
- Frontend y backend inicializados.
- Endpoint `/api/health` funcionando.
- Repositorio público disponible.

### T02 — Documentación y especificación

Estado: COMPLETADA.

Actividades:
- [x] Crear `docs/idea.md`.
- [x] Crear `docs/spec.md`.
- [x] Crear `docs/plan.md`.
- [x] Crear `docs/tasks.md`.
- [x] Crear `docs/decisiones.md`.
- [x] Crear `docs/informe-pruebas.md`.
- [x] Crear `AGENTS.md`.
- [x] Revisar y actualizar el README.

Criterio de aceptación:
- Documentación completa.
- Reglas de negocio numeradas.
- Plan de desarrollo definido.
- Instrucciones para trabajar en el proyecto documentadas.

### T03 — Base de datos

Estado: COMPLETADA.

Actividades:
- Configurar PostgreSQL.
- Crear las tablas necesarias.
- Definir relaciones y restricciones.
- Crear datos iniciales.
- Conectar PostgreSQL con el backend.

Criterio de aceptación:
- Base de datos accesible desde el backend.
- Tablas y relaciones creadas correctamente.

### T04 — Registro, autenticación y autorización

Estado: COMPLETADA.

Actividades:
- Implementar registro de clientes.
- Implementar inicio de sesión.
- Incorporar bcrypt.
- Incorporar JWT.
- Implementar roles.
- Proteger rutas.

Criterio de aceptación:
- Registro e inicio de sesión funcionando.
- Contraseñas protegidas.
- Permisos según el rol.

### T05 — Gestión de mascotas

Estado: COMPLETADA.

Actividades:
- Registrar mascotas.
- Consultar mascotas.
- Modificar mascotas.
- Eliminar mascotas.
- Validar la propiedad de las mascotas.

Criterio de aceptación:
- Cada cliente puede administrar únicamente sus propias mascotas.

### T06 — Gestión de servicios

Estado: COMPLETADA.

Actividades:
- Consultar servicios.
- Crear servicios.
- Modificar servicios.
- Modificar precios y duraciones.
- Activar y desactivar servicios.

Criterio de aceptación:
- Los clientes consultan servicios activos.
- Los administradores gestionan el catálogo.

### T07 — Sistema de reservas y turnos

Estado: COMPLETADA.

Actividades:
- Validar la disponibilidad según los horarios de atención.
- Crear reservas.
- Validar anticipación mínima.
- Validar horarios de atención.
- Evitar superposición de turnos.
- Aplicar límite de turnos activos.
- Calcular precios desde el backend.
- Consultar y cancelar reservas.
- Modificar turnos según las reglas.

Criterio de aceptación:
- Las reservas cumplen todas las reglas de negocio.
- No se permiten reservas inválidas o duplicadas.

### T08 — Panel administrativo

Estado: PENDIENTE.

Actividades:
- Consultar todos los turnos.
- Consultar clientes y mascotas.
- Gestionar servicios.
- Administrar horarios.
- Supervisar reservas.

Criterio de aceptación:
- Las funcionalidades administrativas están protegidas y funcionan correctamente.

### T09 — Desarrollo e integración del frontend

Estado: PENDIENTE.

Actividades:
- Crear página principal.
- Crear registro e inicio de sesión.
- Crear panel del cliente.
- Crear gestión de mascotas.
- Crear catálogo de servicios.
- Crear reserva de turnos.
- Crear consulta de reservas.
- Crear panel administrativo.
- Integrar el frontend con el backend.
- Adaptar la interfaz a dispositivos móviles.

Criterio de aceptación:
- Las funcionalidades principales pueden utilizarse desde la interfaz web.

### T10 — Pruebas y corrección de errores

Estado: PENDIENTE.

Actividades:
- Crear pruebas automatizadas.
- Probar reglas de negocio.
- Probar autenticación y permisos.
- Probar reservas válidas e inválidas.
- Corregir errores.
- Completar el informe de pruebas.

Criterio de aceptación:
- Las pruebas implementadas pasan correctamente.
- Los resultados quedan documentados.

### T11 — Despliegue

Estado: PENDIENTE.

Actividades:
- Configurar la base de datos en la nube.
- Desplegar el backend.
- Desplegar el frontend.
- Configurar variables de entorno.
- Verificar la conexión entre servicios.

Criterio de aceptación:
- La aplicación funciona desde una dirección pública.

### T12 — Revisión y entrega final

Estado: PENDIENTE.

Actividades:
- Revisar README y documentación.
- Verificar el repositorio público.
- Revisar que no haya secretos publicados.
- Comprobar las pruebas.
- Comprobar los enlaces de despliegue.
- Preparar la presentación final.

Criterio de aceptación:
- Proyecto completo, documentado, probado y publicado.