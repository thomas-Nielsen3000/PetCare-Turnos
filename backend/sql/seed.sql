
-- ==========================================
-- DATOS INICIALES DE PETCARE TURNOS
-- ==========================================

-- 1. Servicios iniciales
-- Los precios son valores de prueba y podrán
-- modificarse posteriormente desde el administrador.

INSERT INTO servicios (
    nombre,
    descripcion,
    precio,
    duracion_minutos,
    activo
)
SELECT datos.nombre, datos.descripcion, datos.precio,
       datos.duracion, TRUE
FROM (
    VALUES
        (
            'Consulta veterinaria',
            'Consulta general para evaluar la salud de la mascota.',
            15000.00,
            30
        ),
        (
            'Vacunación',
            'Aplicación de vacunas para mascotas.',
            12000.00,
            20
        ),
        (
            'Baño',
            'Servicio de baño e higiene para mascotas.',
            10000.00,
            45
        ),
        (
            'Peluquería',
            'Corte de pelo y arreglo estético de la mascota.',
            18000.00,
            60
        )
) AS datos(nombre, descripcion, precio, duracion)
WHERE NOT EXISTS (
    SELECT 1
    FROM servicios existentes
    WHERE existentes.nombre = datos.nombre
);

-- 2. Horarios de atención
-- Lunes a viernes: 09:00 a 18:00.
-- Sábado: 09:00 a 13:00.
-- Domingo: cerrado.

INSERT INTO horarios_atencion (
    dia_semana,
    hora_apertura,
    hora_cierre,
    activo
)
SELECT
    dias.dia_semana,
    dias.hora_apertura,
    dias.hora_cierre,
    TRUE
FROM (
    SELECT
        generate_series(1, 5) AS dia_semana,
        TIME '09:00' AS hora_apertura,
        TIME '18:00' AS hora_cierre

    UNION ALL

    SELECT
        6,
        TIME '09:00',
        TIME '13:00'
) AS dias
ON CONFLICT (dia_semana, hora_apertura, hora_cierre)
DO NOTHING;
