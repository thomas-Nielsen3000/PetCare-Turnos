# PetCare Turnos — Especificación de requisitos y reglas de negocio

## 1. Objetivo del documento

Este documento establece las reglas de negocio y los requisitos funcionales que deberá cumplir PetCare Turnos.

Las reglas aquí definidas serán utilizadas como referencia durante el desarrollo del sistema y la elaboración de las pruebas.

## 2. Tipos de usuarios

El sistema contará con dos roles principales:

### 2.1. Cliente

Es el usuario que utiliza la plataforma para registrar sus mascotas, consultar servicios y reservar turnos.

### 2.2. Administrador

Es el usuario encargado de gestionar los servicios, los precios, los horarios de atención y supervisar los turnos.

## 3. Reglas de negocio

### RN1 — Registro obligatorio

Para reservar un turno, el cliente deberá tener una cuenta registrada e iniciar sesión correctamente.

### RN2 — Propiedad de las mascotas

Cada mascota deberá estar asociada a un único cliente registrado.

Un cliente solamente podrá consultar, modificar o eliminar las mascotas que le pertenecen.

### RN3 — Prevención de turnos superpuestos

Una misma mascota no podrá tener dos turnos activos cuyos horarios se superpongan.

El sistema deberá comprobar la disponibilidad antes de confirmar una reserva.

### RN4 — Anticipación mínima para reservar

Los clientes deberán reservar sus turnos con al menos 3 horas de anticipación respecto del horario de inicio del servicio.

No se permitirán reservas para horarios anteriores a la fecha y hora actuales.

### RN5 — Duración según el servicio

Cada servicio tendrá una duración definida por el administrador.

El sistema utilizará esa duración para calcular el horario de finalización del turno y comprobar la disponibilidad.

### RN6 — Límite de turnos activos

Cada cliente podrá tener un máximo de 4 turnos futuros activos al mismo tiempo.

Una vez que un turno sea cancelado o finalizado, dejará de contar para este límite.

### RN7 — Horarios de atención

Los turnos solamente podrán reservarse dentro de los días y horarios de atención configurados por el administrador.

El horario completo del servicio deberá encontrarse dentro del horario de atención.

### RN8 — Cancelación de turnos

Los clientes podrán cancelar sus turnos siempre que falten al menos 12 horas para el horario de inicio.

Cuando falten menos de 12 horas, solamente el administrador podrá cancelar el turno.

### RN9 — Cálculo del precio

El precio de cada reserva deberá ser calculado y validado por el backend utilizando el precio vigente del servicio al momento de confirmar la reserva.

El frontend no podrá establecer libremente el precio final.

El turno deberá conservar el precio registrado al momento de su confirmación, aunque posteriormente el administrador modifique el precio del servicio.

### RN10 — Administración de servicios y precios

Solamente los administradores podrán crear, modificar, activar o desactivar servicios y cambiar sus precios y duraciones.

Los clientes únicamente podrán consultar los servicios disponibles.

### RN11 — Privacidad de los turnos

Los clientes solamente podrán consultar y administrar sus propios turnos.

Los administradores podrán consultar todos los turnos registrados en el sistema.

### RN12 — Modificación de turnos confirmados

Un cliente podrá solicitar modificaciones de su turno siempre que falten al menos 12 horas para su inicio.

Toda modificación deberá volver a comprobar la disponibilidad, la duración, el horario de atención y las demás reglas de reserva.

Si faltan menos de 12 horas, el cliente no podrá modificar directamente el turno.

### RN13 — Servicios desactivados

Los servicios desactivados no podrán recibir nuevas reservas.

Los turnos que ya hayan sido confirmados conservarán la información y el precio registrados al momento de la reserva.

## 4. Requisitos funcionales

El sistema deberá permitir:

- RF1: Registrar nuevos clientes.
- RF2: Iniciar y cerrar sesión.
- RF3: Consultar y modificar los datos personales del cliente.
- RF4: Registrar, consultar, modificar y eliminar mascotas propias.
- RF5: Consultar los servicios disponibles.
- RF6: Consultar el precio y la duración de cada servicio.
- RF7: Reservar turnos para mascotas registradas.
- RF8: Consultar los turnos propios.
- RF9: Cancelar turnos respetando las condiciones establecidas.
- RF10: Modificar turnos cuando esté permitido.
- RF11: Consultar todos los turnos desde el panel administrativo.
- RF12: Crear, modificar, activar y desactivar servicios desde el panel administrativo.
- RF13: Modificar precios y duraciones de los servicios.
- RF14: Configurar los días y horarios de atención.

## 5. Requisitos no funcionales

- RNF1: La aplicación deberá contar con una interfaz clara y adaptable a distintos tamaños de pantalla.
- RNF2: Las contraseñas deberán almacenarse de forma segura utilizando bcrypt.
- RNF3: La autenticación deberá realizarse mediante tokens JWT.
- RNF4: El backend deberá validar los datos recibidos antes de procesarlos.
- RNF5: El sistema deberá controlar los permisos según el rol del usuario.
- RNF6: La información deberá almacenarse en una base de datos PostgreSQL.
- RNF7: La aplicación deberá estar disponible mediante una dirección web pública.
- RNF8: El backend deberá impedir reservas duplicadas o superpuestas incluso cuando se realicen solicitudes simultáneas.

## 6. Estados de los turnos

Los turnos podrán tener los siguientes estados:

- Pendiente: turno solicitado que todavía no fue confirmado.
- Confirmado: turno reservado correctamente.
- Cancelado: turno anulado.
- Finalizado: servicio realizado.

Los turnos cancelados y finalizados no se considerarán turnos activos para el límite de reservas.

## 7. Validaciones generales

Antes de confirmar una reserva, el backend deberá comprobar:

1. Que el cliente esté autenticado.
2. Que la mascota exista y pertenezca al cliente.
3. Que el servicio esté activo.
4. Que la fecha y hora cumplan la anticipación mínima.
5. Que el horario se encuentre dentro de la atención habilitada.
6. Que la mascota no tenga otro turno activo superpuesto.
7. Que el cliente no supere el máximo de turnos activos.
8. Que el precio y la duración sean los vigentes.
9. Que la reserva se guarde correctamente en la base de datos.

## 8. Consideraciones de implementación

Las reglas de negocio deberán validarse principalmente en el backend para evitar que puedan ser omitidas mediante modificaciones en el frontend.

Las operaciones que puedan generar reservas duplicadas deberán contar con mecanismos de protección ante solicitudes simultáneas.

Las fechas y horarios se manejarán utilizando la zona horaria configurada para el establecimiento. Inicialmente se utilizará `America/Argentina/Buenos_Aires`.

## 9. Criterio de cumplimiento

Una regla de negocio se considerará implementada cuando:

- Exista una validación correspondiente en el sistema.
- Se haya comprobado su funcionamiento mediante pruebas.
- Se hayan verificado tanto los casos válidos como los casos que deben rechazarse.
- La documentación y las pruebas reflejen el comportamiento implementado.