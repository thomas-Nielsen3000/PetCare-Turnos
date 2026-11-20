# AGENTS.md — Instrucciones del proyecto

## 1. Descripción del proyecto

PetCare Turnos es una aplicación web para gestionar y reservar turnos en veterinarias y peluquerías de mascotas.

El proyecto está dividido en frontend, backend y documentación.

## 2. Tecnologías

### Frontend
- React.
- TypeScript.
- Vite.
- CSS.

### Backend
- Node.js.
- Express.
- TypeScript.
- API REST.

### Base de datos
- PostgreSQL.

### Herramientas adicionales
- Git y GitHub.
- Zod.
- bcrypt.
- JWT.
- Vitest.

## 3. Estructura del proyecto

- `frontend/`: aplicación web.
- `backend/`: servidor y API.
- `backend/src/`: código fuente del backend.
- `backend/sql/`: scripts de base de datos.
- `backend/test/`: pruebas automatizadas.
- `docs/`: documentación técnica y funcional.
- `AGENTS.md`: instrucciones para trabajar en el proyecto.

## 4. Reglas para modificar el código

1. Mantener separadas las responsabilidades del frontend y backend.
2. Utilizar TypeScript en el código de ambas partes.
3. Mantener nombres de variables, funciones y clases claros.
4. Evitar duplicar código cuando pueda reutilizarse.
5. No agregar dependencias sin una necesidad concreta.
6. No modificar funcionalidades existentes sin comprobar su funcionamiento.
7. Mantener actualizada la documentación cuando se modifiquen reglas o funcionalidades.
8. No marcar una tarea como terminada hasta verificar sus criterios de aceptación.

## 5. Reglas de negocio obligatorias

Las reglas de negocio oficiales del sistema se encuentran en `docs/spec.md`.

Toda implementación deberá respetarlas, especialmente:

- Evitar turnos superpuestos para una misma mascota.
- Exigir al menos 3 horas de anticipación para reservar.
- Respetar el máximo de 4 turnos futuros activos por cliente.
- Validar los horarios de atención.
- Permitir cancelar a los clientes únicamente con al menos 12 horas de anticipación.
- Calcular los precios desde el backend.
- Restringir las operaciones según el rol del usuario.
- Impedir reservas para servicios desactivados.

Las validaciones importantes deberán realizarse en el backend.

## 6. Seguridad

- Nunca almacenar contraseñas sin protección.
- Utilizar bcrypt para proteger las contraseñas.
- Utilizar JWT para autenticar las solicitudes.
- Proteger las rutas privadas.
- Validar los permisos de cada usuario.
- No confiar en los datos enviados por el frontend.
- No subir archivos `.env` ni credenciales al repositorio.
- Utilizar `.env.example` para documentar las variables necesarias.

## 7. Base de datos

- Utilizar PostgreSQL.
- Definir claves primarias y foráneas.
- Mantener la integridad de los datos.
- Utilizar transacciones cuando una operación requiera varias modificaciones relacionadas.
- Evitar inconsistencias y reservas duplicadas.

## 8. Pruebas

Antes de considerar terminada una funcionalidad:

1. Comprobar su funcionamiento.
2. Probar datos válidos e inválidos.
3. Verificar las reglas de negocio relacionadas.
4. Ejecutar las pruebas automatizadas disponibles.
5. Corregir los errores encontrados.

## 9. Control de versiones

- Utilizar Git para registrar los cambios.
- Realizar un commit por tarea completada.
- Utilizar mensajes de commit claros.
- No incluir `node_modules`, carpetas `dist` ni credenciales.
- Mantener el repositorio actualizado.

## 10. Documentación

Consultar los siguientes documentos antes de modificar aspectos importantes:

- `docs/idea.md`: descripción del proyecto.
- `docs/spec.md`: reglas de negocio y requisitos.
- `docs/plan.md`: planificación.
- `docs/tasks.md`: seguimiento de tareas.
- `docs/decisiones.md`: decisiones técnicas.
- `docs/informe-pruebas.md`: registro de pruebas.

## 11. Criterio general

Las modificaciones deberán priorizar la claridad, seguridad, mantenibilidad y cumplimiento de los requisitos de PetCare Turnos.