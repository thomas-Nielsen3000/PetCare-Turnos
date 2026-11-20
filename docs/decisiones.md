# PetCare Turnos — Registro de decisiones técnicas

## 1. Objetivo

Este documento registra las decisiones técnicas y arquitectónicas tomadas durante el desarrollo de PetCare Turnos, incluyendo sus motivos y las alternativas consideradas.

## 2. Decisiones tecnológicas

### DEC-001 — Uso de React para el frontend

**Decisión:** utilizar React con TypeScript y Vite.

**Motivo:** React permite desarrollar interfaces organizadas mediante componentes reutilizables. TypeScript facilita detectar errores y mantener el código. Vite proporciona un entorno de desarrollo rápido.

**Alternativas consideradas:** Angular y Vue.

### DEC-002 — Uso de Node.js y Express para el backend

**Decisión:** utilizar Node.js con Express y TypeScript.

**Motivo:** permite desarrollar una API REST utilizando JavaScript y TypeScript, manteniendo un lenguaje común entre frontend y backend.

**Alternativas consideradas:** Spring Boot y Django.

### DEC-003 — Uso de PostgreSQL

**Decisión:** utilizar PostgreSQL como sistema de gestión de base de datos.

**Motivo:** permite almacenar información relacionada mediante tablas, claves primarias y foráneas, restricciones y transacciones.

Es adecuado para administrar clientes, mascotas, servicios y turnos.

**Alternativas consideradas:** MySQL y MongoDB.

### DEC-004 — Arquitectura frontend y backend separados

**Decisión:** mantener el frontend y el backend en carpetas independientes dentro del mismo repositorio.

**Motivo:** permite separar las responsabilidades de la interfaz y la lógica del servidor, facilitando el mantenimiento y las pruebas.

### DEC-005 — API REST

**Decisión:** utilizar una API REST para comunicar el frontend con el backend mediante solicitudes HTTP.

**Motivo:** permite intercambiar información en formato JSON y mantener una comunicación organizada entre ambas partes.

### DEC-006 — Autenticación mediante JWT

**Decisión:** utilizar JSON Web Tokens para autenticar las solicitudes de los usuarios.

**Motivo:** permite verificar la identidad del usuario y proteger las rutas de la API.

### DEC-007 — Protección de contraseñas con bcrypt

**Decisión:** utilizar bcrypt para generar hashes seguros de las contraseñas.

**Motivo:** evita almacenar las contraseñas originales y permite comprobarlas durante el inicio de sesión.

### DEC-008 — Validación con Zod

**Decisión:** utilizar Zod para validar los datos recibidos por el backend.

**Motivo:** permite definir esquemas de validación y rechazar información incorrecta antes de procesarla.

### DEC-009 — Pruebas automatizadas

**Decisión:** utilizar Vitest para realizar pruebas automatizadas.

**Motivo:** permite verificar el comportamiento del sistema y comprobar que las reglas de negocio se cumplan.

### DEC-010 — Despliegue en servicios externos

**Decisión:** utilizar servicios de alojamiento en la nube para publicar la aplicación.

Servicios previstos:
- Netlify para el frontend.
- Render para el backend.
- Neon para PostgreSQL.

**Motivo:** permiten publicar los componentes del sistema sin administrar servidores propios.

## 3. Decisiones de seguridad

### DEC-011 — Variables de entorno

**Decisión:** utilizar variables de entorno para configurar información sensible y parámetros del sistema.

**Motivo:** evita publicar contraseñas, claves de acceso y otros datos privados en el repositorio.

El archivo `.env.example` contendrá únicamente ejemplos de las variables necesarias, sin credenciales reales.

### DEC-012 — Validación de reglas de negocio en el backend

**Decisión:** implementar las reglas de negocio principalmente en el servidor.

**Motivo:** evita depender exclusivamente de las validaciones del frontend, que pueden ser modificadas o evitadas por el usuario.

### DEC-013 — Control de acceso por roles

**Decisión:** diferenciar los permisos de clientes y administradores.

**Motivo:** permite restringir las operaciones administrativas y proteger la información de cada cliente.

## 4. Actualización del documento

Este registro podrá actualizarse durante el desarrollo cuando se incorporen nuevas tecnologías, se modifiquen decisiones existentes o se identifiquen nuevas necesidades técnicas.

Cada decisión importante deberá contar con un identificador único y una justificación.