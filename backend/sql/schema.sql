
-- Extensión necesaria para controlar turnos superpuestos.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    telefono VARCHAR(30),
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente'
        CHECK (rol IN ('cliente', 'admin')),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Mascotas
CREATE TABLE mascotas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL
        REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(100),
    fecha_nacimiento DATE,
    observaciones TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Servicios
CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Horarios de atención
-- dia_semana: 0 = domingo, 1 = lunes, ..., 6 = sábado.
CREATE TABLE horarios_atencion (
    id SERIAL PRIMARY KEY,
    dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (hora_cierre > hora_apertura),
    UNIQUE (dia_semana, hora_apertura, hora_cierre)
);

-- 5. Turnos
CREATE TABLE turnos (
    id SERIAL PRIMARY KEY,
    mascota_id INTEGER NOT NULL
        REFERENCES mascotas(id) ON DELETE RESTRICT,
    servicio_id INTEGER NOT NULL
        REFERENCES servicios(id) ON DELETE RESTRICT,
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_fin TIMESTAMPTZ NOT NULL,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    nombre_servicio VARCHAR(120) NOT NULL,
    duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (
            estado IN (
                'pendiente',
                'confirmado',
                'cancelado',
                'finalizado'
            )
        ),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (fecha_fin > fecha_inicio),

    -- Impide que una mascota tenga dos turnos activos
    -- en horarios que se superponen.
    CONSTRAINT turnos_sin_superposicion
    EXCLUDE USING gist (
        mascota_id WITH =,
        tstzrange(fecha_inicio, fecha_fin, '[)') WITH &&
    )
    WHERE (estado IN ('pendiente', 'confirmado'))
);

-- Índices para agilizar las consultas habituales.
CREATE INDEX idx_mascotas_usuario
    ON mascotas(usuario_id);

CREATE INDEX idx_turnos_mascota
    ON turnos(mascota_id);

CREATE INDEX idx_turnos_fecha
    ON turnos(fecha_inicio);

CREATE INDEX idx_turnos_estado
    ON turnos(estado);
