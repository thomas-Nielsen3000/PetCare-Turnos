# PetCare Turnos

Sistema web de gestión y reserva de turnos para veterinarias y peluquerías de mascotas.

## Descripción

PetCare Turnos permite que los clientes registren sus mascotas, consulten servicios disponibles y reserven turnos por internet.

También cuenta con funcionalidades administrativas para gestionar servicios, precios, horarios y reservas.

## Tecnologías

### Frontend
- React
- TypeScript
- Vite

### Backend
- Node.js
- Express
- TypeScript

### Base de datos
- PostgreSQL

### Seguridad y validaciones
- JWT
- bcrypt
- Zod

### Pruebas
- Vitest

## Estructura del proyecto

```text
PetCare-Turnos/
├── frontend/
├── backend/
│   ├── src/
│   ├── sql/
│   └── test/
├── docs/
├── AGENTS.md
├── README.md
└── .env.example
```

## Documentación

La documentación técnica y funcional se encuentra en `docs/`.

- [Idea del proyecto](docs/idea.md)
- [Especificación y reglas de negocio](docs/spec.md)
- [Plan de desarrollo](docs/plan.md)
- [Seguimiento de tareas](docs/tasks.md)
- [Decisiones técnicas](docs/decisiones.md)
- [Informe de pruebas](docs/informe-pruebas.md)

## Instalación y ejecución

### Requisitos previos

- Node.js.
- npm.

### Frontend

Desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`.

### Backend

Desde otra terminal:

```bash
cd backend
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:3000/`.

### Comprobación del backend

Abrir en el navegador:

`http://localhost:3000/api/health`

El servidor deberá responder con un mensaje indicando que la API funciona correctamente.

## Variables de entorno

Crear un archivo `.env` dentro de `backend/` para configurar las variables necesarias.

Consultar `.env.example` como referencia.

Nunca subir credenciales reales al repositorio.

## Estado del proyecto

Proyecto en desarrollo.

Fecha límite prevista de entrega: 31 de diciembre de 2026.

## Repositorio

[PetCare Turnos en GitHub](https://github.com/thomas-Nielsen3000/PetCare-Turnos)