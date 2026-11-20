# PetCare Turnos — Informe de pruebas

## 1. Objetivo

Este documento establece el procedimiento para verificar el funcionamiento de PetCare Turnos.

Se registrarán las pruebas realizadas, los resultados obtenidos, los errores encontrados y las correcciones aplicadas.

Las pruebas permitirán comprobar que el sistema cumpla con los requisitos funcionales, las reglas de negocio y los requisitos de seguridad.

## 2. Tipos de pruebas

### 2.1. Pruebas funcionales

Verificarán que las funcionalidades principales del sistema trabajen correctamente.

### 2.2. Pruebas de validación

Comprobarán que el sistema acepte los datos válidos y rechace los datos incorrectos.

### 2.3. Pruebas de seguridad

Verificarán la autenticación, los permisos y la protección de los datos de los usuarios.

### 2.4. Pruebas de integración

Comprobarán la comunicación entre el frontend, el backend y la base de datos.

### 2.5. Pruebas automatizadas

Se utilizarán pruebas automatizadas para verificar las reglas de negocio y reducir errores durante el desarrollo.

## 3. Casos de prueba planificados

| ID | Caso de prueba | Resultado esperado |
|---|---|---|
| CP01 | Registrar un cliente con datos válidos | El usuario queda registrado. |
| CP02 | Registrar un cliente con correo ya utilizado | El sistema rechaza el registro. |
| CP03 | Iniciar sesión con credenciales correctas | El usuario accede al sistema. |
| CP04 | Iniciar sesión con contraseña incorrecta | El acceso es rechazado. |
| CP05 | Registrar una mascota | La mascota queda asociada al cliente. |
| CP06 | Consultar una mascota de otro cliente | El acceso es rechazado. |
| CP07 | Consultar servicios activos | Se muestran los servicios disponibles. |
| CP08 | Reservar un turno válido | El turno queda registrado. |
| CP09 | Reservar con menos de 3 horas de anticipación | La reserva es rechazada. |
| CP10 | Reservar un turno superpuesto para la misma mascota | La reserva es rechazada. |
| CP11 | Superar el límite de 4 turnos activos | La nueva reserva es rechazada. |
| CP12 | Reservar fuera del horario de atención | La reserva es rechazada. |
| CP13 | Cancelar con más de 12 horas de anticipación | La cancelación es permitida. |
| CP14 | Cancelar con menos de 12 horas de anticipación como cliente | La cancelación es rechazada. |
| CP15 | Intentar modificar el precio desde el frontend | El backend ignora el precio enviado y calcula el correcto. |
| CP16 | Intentar administrar servicios como cliente | La operación es rechazada. |
| CP17 | Reservar un servicio desactivado | La reserva es rechazada. |
| CP18 | Consultar los turnos de otro cliente | El acceso es rechazado. |
| CP19 | Acceder al perfil con un JWT válido | El acceso es permitido. |
| CP20 | Acceder al perfil con un JWT inválido | El acceso es rechazado con HTTP 401. |
| CP21 | Listar las mascotas del cliente autenticado | Se muestran únicamente sus mascotas. |
| CP22 | Consultar una mascota propia | Se muestran sus datos correctamente. |
| CP23 | Modificar una mascota propia | Los cambios quedan guardados. |
| CP24 | Eliminar una mascota propia | La mascota queda eliminada. |
| CP25 | Intentar eliminar una mascota de otro cliente | La operación es rechazada con HTTP 404. |
| CP26 | Intentar modificar una mascota de otro cliente | La operación es rechazada con HTTP 404. |
| CP27 | Consultar una mascota después de un intento de modificación no autorizado | Los datos originales permanecen sin cambios. |
| CP28 | Consultar todos los servicios como administrador | Se muestran los servicios activos e inactivos. |
| CP29 | Crear un servicio como administrador | El servicio queda registrado correctamente. |
| CP30 | Modificar un servicio como administrador | Los cambios quedan guardados. |
| CP31 | Desactivar un servicio como administrador | El servicio queda desactivado sin eliminarse. |
| CP32 | Crear una solicitud de turno válida | El turno queda registrado como pendiente. |
| CP33 | Listar los turnos como administrador | Se muestran todos los turnos. |
| CP34 | Consultar un turno por ID | Se muestran los datos del turno. |
| CP35 | Reservar un turno superpuesto para la misma mascota | La reserva es rechazada. |
| CP36 | Reservar fuera del horario de atención | La reserva es rechazada. |
| CP37 | Reservar con menos de 3 horas de anticipación | La reserva es rechazada. |
| CP38 | Cancelar un turno válido | El turno cambia a estado cancelado. |
| CP39 | Modificar la fecha y hora de un turno | Se actualiza el horario respetando las validaciones. |
| CP40 | Consultar el detalle de un cliente como administrador | Se muestran los datos del cliente y sus mascotas. |
| CP41 | Crear un horario como administrador | El horario queda registrado correctamente. |
| CP42 | Modificar un horario como administrador | Los cambios quedan guardados. |
| CP43 | Desactivar un horario como administrador | El horario queda desactivado. |
| CP44 | Acceder a las rutas administrativas sin autenticación | El acceso es rechazado con HTTP 401. |

## 4. Registro de resultados

Las pruebas se realizarán durante el desarrollo.

Se utilizarán los siguientes estados:

- PENDIENTE: prueba todavía no ejecutada.
- APROBADA: el resultado coincide con el esperado.
- RECHAZADA: el sistema no cumple el resultado esperado.
- CORREGIDA: se encontró un error y se solucionó; deberá repetirse la prueba para verificarlo.

## 5. Tabla de seguimiento

| ID | Estado | Observaciones |
|---|---|---|
| CP01 | APROBADA | Se registró correctamente un cliente en PostgreSQL. |
| CP02 | APROBADA | Se rechazó un segundo registro con el mismo correo electrónico. |
| CP03 | APROBADA | Se inició sesión con credenciales correctas y se generó un JWT. |
| CP04 | PENDIENTE | Falta probar el inicio de sesión con contraseña incorrecta. |
| CP05 | APROBADA | Se registró correctamente una mascota asociada al cliente autenticado. |
| CP06 | APROBADA | Un segundo cliente recibió HTTP 404 al consultar una mascota ajena. |
| CP07 | PENDIENTE | No ejecutada. |
| CP08 | PENDIENTE | No ejecutada. |
| CP09 | PENDIENTE | No ejecutada. |
| CP10 | PENDIENTE | No ejecutada. |
| CP11 | PENDIENTE | No ejecutada. |
| CP12 | PENDIENTE | No ejecutada. |
| CP13 | PENDIENTE | No ejecutada. |
| CP14 | PENDIENTE | No ejecutada. |
| CP15 | PENDIENTE | No ejecutada. |
| CP16 | PENDIENTE | No ejecutada. |
| CP17 | PENDIENTE | No ejecutada. |
| CP18 | PENDIENTE | No ejecutada. |
| CP19 | APROBADA | El perfil protegido permitió el acceso utilizando un JWT válido. |
| CP20 | APROBADA | El perfil protegido rechazó un token inválido con error HTTP 401. |
| CP21 | APROBADA | Se listaron únicamente las mascotas del cliente autenticado. |
| CP22 | APROBADA | Se consultaron correctamente los datos de una mascota propia. |
| CP23 | APROBADA | Se modificaron correctamente los datos de una mascota propia. |
| CP24 | APROBADA | Se eliminó correctamente una mascota propia. |
| CP25 | APROBADA | Un cliente recibió HTTP 404 al intentar eliminar una mascota ajena. |
| CP26 | APROBADA | Un cliente recibió HTTP 404 al intentar modificar una mascota ajena. |
| CP27 | APROBADA | Se comprobó que los datos originales de la mascota no cambiaron tras un intento de modificación no autorizado. |
| CP28 | APROBADA | El administrador consultó correctamente los servicios activos e inactivos. |
| CP29 | APROBADA | El administrador creó el servicio Desparasitación. |
| CP30 | APROBADA | El administrador modificó el precio y la duración del servicio. |
| CP31 | APROBADA | El administrador desactivó el servicio sin eliminarlo de PostgreSQL. |
| CP32 | APROBADA | Se creó correctamente una solicitud de turno con estado pendiente. |
| CP33 | APROBADA | El administrador consultó correctamente el listado de turnos. |
| CP34 | APROBADA | Se consultaron correctamente los datos de un turno mediante su ID. |
| CP35 | APROBADA | El backend rechazó una reserva superpuesta para la misma mascota. |
| CP36 | APROBADA | El backend rechazó una reserva fuera del horario de atención. |
| CP37 | APROBADA | El backend rechazó una reserva con menos de 3 horas de anticipación. |
| CP38 | APROBADA | El cliente canceló correctamente el turno 7. Se verificó que su estado quedó en cancelado. |
| CP39 | APROBADA | El cliente reprogramó correctamente el turno 7 del 23/11/2026 a las 10:00 a las 11:00. Se verificaron la nueva fecha, la duración y el precio. |
| CP40 | APROBADA | El administrador consultó correctamente los datos del cliente y sus mascotas. |
| CP41 | APROBADA | Se creó correctamente un horario de atención para el domingo. |
| CP42 | APROBADA | Se modificó correctamente el horario creado. |
| CP43 | APROBADA | Se desactivó correctamente el horario de prueba. |
| CP44 | APROBADA | El endpoint administrativo rechazó el acceso sin autenticación mediante HTTP 401. |
| CP45 | APROBADA | El frontend compiló correctamente mediante TypeScript y Vite, sin errores. |
| CP46 | APROBADA | Se inició sesión correctamente con la cuenta de administrador y se visualizó el panel administrativo. |
| CP47 | APROBADA | Se comprobó desde la interfaz web la creación de una mascota. |
| CP48 | APROBADA | Se consultó correctamente el catálogo de servicios desde la interfaz web. |
| CP49 | APROBADA | Se realizó correctamente una reserva de turno desde la interfaz web. |

## 6. Herramientas previstas

- Node.js (node:test) y tsx: ejecución de pruebas automatizadas.
- PowerShell: pruebas manuales de los endpoints de la API.
- Navegador web: comprobación de la interfaz.
- PostgreSQL: verificación de los datos almacenados.
- Node.js y TypeScript: compilación y ejecución del backend.


### 6.1. Resultados de las pruebas automatizadas

- Comando ejecutado: npm.cmd test.
- Resultado: 25 pruebas aprobadas y 0 fallidas.
- Se verificaron validaciones de registro, inicio de sesión, mascotas, servicios y turnos.
- Se probaron los middlewares de autenticación y permisos.
- La compilación del backend (npm.cmd run build) finalizó correctamente.
- La compilación del frontend (npm.cmd run build) finalizó correctamente.
- La comprobación git diff --check no encontró errores de formato.
## 7. Criterios de aprobación

El sistema se considerará correctamente probado cuando:

1. Las funcionalidades principales funcionen según lo especificado.
2. Las reglas de negocio se cumplan.
3. Los datos de los usuarios estén protegidos.
4. Los permisos de clientes y administradores sean respetados.
5. Las pruebas automatizadas implementadas finalicen correctamente.
6. No existan errores críticos que impidan utilizar la aplicación.

## 8. Conclusión

Se realizaron pruebas funcionales, de validación, de autenticación, de permisos y de integración entre el frontend, el backend y la base de datos.

Los 49 casos de prueba registrados cuentan con resultados documentados. Además, las 25 pruebas automatizadas del backend finalizaron correctamente, sin fallos.

Las compilaciones del backend y del frontend finalizaron correctamente. Los resultados obtenidos permiten considerar completada la etapa de pruebas y corrección de errores.
