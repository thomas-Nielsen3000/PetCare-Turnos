# PetCare Turnos — Idea del proyecto

## 1. Descripción general

PetCare Turnos es un sistema web diseñado para facilitar la gestión y reserva de turnos en veterinarias y peluquerías de mascotas.

La plataforma permitirá que los clientes creen una cuenta, registren sus mascotas, consulten los servicios disponibles y soliciten turnos de manera online.

Por otro lado, los administradores podrán gestionar los servicios, modificar sus precios, consultar los turnos reservados y administrar la información necesaria para el funcionamiento del establecimiento.

## 2. Problema que busca resolver

Muchos establecimientos que ofrecen servicios para mascotas gestionan sus turnos de manera manual, mediante llamadas telefónicas, mensajes o anotaciones.

Esto puede generar problemas como:

- Reservas duplicadas.
- Errores en los horarios.
- Dificultad para organizar la atención.
- Falta de información sobre las mascotas.
- Problemas para consultar o modificar reservas.
- Pérdida de tiempo en tareas administrativas.

PetCare Turnos busca centralizar esta información y facilitar la organización de los turnos.

## 3. Objetivo principal

Desarrollar una aplicación web funcional que permita administrar y reservar turnos para servicios destinados a mascotas, aplicando reglas de negocio que garanticen una gestión organizada y segura.

## 4. Usuarios del sistema

### 4.1. Clientes

Podrán:

- Registrarse e iniciar sesión.
- Administrar sus datos personales.
- Registrar sus mascotas.
- Consultar los servicios disponibles.
- Consultar precios y duración de los servicios.
- Reservar turnos.
- Consultar sus próximos turnos.
- Cancelar turnos respetando las condiciones establecidas.

### 4.2. Administradores

Podrán:

- Iniciar sesión con una cuenta administrativa.
- Consultar los turnos registrados.
- Consultar información de los clientes y sus mascotas.
- Crear, modificar y desactivar servicios.
- Modificar precios y duración de los servicios.
- Administrar la disponibilidad de atención.

## 5. Funcionalidades principales

1. Registro e inicio de sesión.
2. Gestión de clientes.
3. Registro y administración de mascotas.
4. Consulta de servicios disponibles.
5. Gestión administrativa de servicios.
6. Reserva de turnos.
7. Control de disponibilidad horaria.
8. Prevención de reservas superpuestas.
9. Consulta y cancelación de turnos.
10. Panel administrativo.

## 6. Tecnologías previstas

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

### Seguridad
- Contraseñas protegidas mediante bcrypt.
- Autenticación mediante JWT.
- Validación de datos en el backend.
- Control de permisos según el rol del usuario.

## 7. Alcance del proyecto

El proyecto contempla el desarrollo de una aplicación web con frontend, backend y base de datos conectados y desplegados en internet.

Se implementarán las funcionalidades necesarias para que un cliente pueda gestionar sus mascotas y reservar turnos, mientras que un administrador podrá gestionar los servicios y supervisar las reservas.

## 8. Fuera del alcance inicial

Para mantener un alcance realizable, inicialmente no se incluirán:

- Pagos online.
- Aplicación móvil nativa.
- Videoconsultas veterinarias.
- Historial clínico completo de las mascotas.
- Notificaciones mediante SMS o WhatsApp.

Estas funcionalidades podrían incorporarse en futuras versiones.

## 9. Resultado esperado

Al finalizar el proyecto se espera contar con una aplicación web pública y funcional, con persistencia de datos, validaciones, autenticación, gestión de turnos y documentación técnica.

El sistema deberá contar con pruebas que permitan verificar el cumplimiento de las reglas de negocio.