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
| CP01 | PENDIENTE | No ejecutada. |
| CP02 | PENDIENTE | No ejecutada. |
| CP03 | PENDIENTE | No ejecutada. |
| CP04 | PENDIENTE | No ejecutada. |
| CP05 | PENDIENTE | No ejecutada. |
| CP06 | PENDIENTE | No ejecutada. |
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

## 6. Herramientas previstas

- Vitest: ejecución de pruebas automatizadas.
- Postman: pruebas manuales de los endpoints de la API.
- Navegador web: comprobación de la interfaz.
- PostgreSQL: verificación de los datos almacenados.

## 7. Criterios de aprobación

El sistema se considerará correctamente probado cuando:

1. Las funcionalidades principales funcionen según lo especificado.
2. Las reglas de negocio se cumplan.
3. Los datos de los usuarios estén protegidos.
4. Los permisos de clientes y administradores sean respetados.
5. Las pruebas automatizadas implementadas finalicen correctamente.
6. No existan errores críticos que impidan utilizar la aplicación.

## 8. Conclusión

Este informe se actualizará durante el desarrollo de PetCare Turnos.

Los resultados definitivos se incorporarán una vez ejecutadas las pruebas, indicando los casos aprobados, los errores encontrados y las soluciones aplicadas.