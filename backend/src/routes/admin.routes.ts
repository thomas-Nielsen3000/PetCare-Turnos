
import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/database.js";
import {
    verificarToken,
    verificarAdmin
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(verificarToken, verificarAdmin);

const horarioSchema = z.object({
    dia_semana: z.number().int().min(0).max(6),
    hora_apertura: z.string().regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "La hora de apertura debe tener formato HH:mm"
    ),
    hora_cierre: z.string().regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "La hora de cierre debe tener formato HH:mm"
    )
}).refine(
    datos => datos.hora_cierre > datos.hora_apertura,
    {
        message: "La hora de cierre debe ser posterior a la apertura",
        path: ["hora_cierre"]
    }
);

// Comprueba que un horario activo no se superponga
// con otro horario activo del mismo día.
async function horarioDisponible(
    diaSemana: number,
    apertura: string,
    cierre: string,
    excluirId?: number
): Promise<boolean> {
    const resultado = await pool.query(
        `SELECT id
         FROM horarios_atencion
         WHERE dia_semana = $1
           AND activo = TRUE
           AND hora_apertura < $3::time
           AND hora_cierre > $2::time
           AND ($4::INTEGER IS NULL OR id <> $4)
         LIMIT 1`,
        [diaSemana, apertura, cierre, excluirId ?? null]
    );

    return resultado.rows.length === 0;
}

// 1. Listar todos los clientes.
router.get("/clientes", async (_req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT
                u.id,
                u.nombre,
                u.email,
                u.telefono,
                u.creado_en,
                COUNT(DISTINCT m.id)::INTEGER AS total_mascotas,
                COUNT(DISTINCT t.id)::INTEGER AS total_turnos
             FROM usuarios u
             LEFT JOIN mascotas m ON m.usuario_id = u.id
             LEFT JOIN turnos t ON t.mascota_id = m.id
             WHERE u.rol = 'cliente'
             GROUP BY u.id
             ORDER BY u.nombre ASC`
        );

        res.status(200).json({
            status: "OK",
            total: resultado.rows.length,
            clientes: resultado.rows
        });
    } catch (error) {
        console.error("Error al listar clientes:", error);
        res.status(500).json({
            status: "ERROR",
            message: "No se pudieron consultar los clientes"
        });
    }
});

// 2. Consultar un cliente y sus mascotas.
router.get("/clientes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID del cliente no es válido"
            });
            return;
        }

        const cliente = await pool.query(
            `SELECT id, nombre, email, telefono, creado_en
             FROM usuarios
             WHERE id = $1 AND rol = 'cliente'`,
            [id]
        );

        if (cliente.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Cliente no encontrado"
            });
            return;
        }

        const mascotas = await pool.query(
            `SELECT id, nombre, especie, raza,
                    fecha_nacimiento, observaciones, creado_en
             FROM mascotas
             WHERE usuario_id = $1
             ORDER BY nombre ASC`,
            [id]
        );

        res.status(200).json({
            status: "OK",
            cliente: cliente.rows[0],
            mascotas: mascotas.rows
        });
    } catch (error) {
        console.error("Error al consultar cliente:", error);
        res.status(500).json({
            status: "ERROR",
            message: "No se pudo consultar el cliente"
        });
    }
});

// 3. Listar todas las mascotas con sus propietarios.
router.get("/mascotas", async (_req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT
                m.id,
                m.nombre,
                m.especie,
                m.raza,
                m.fecha_nacimiento,
                m.observaciones,
                m.creado_en,
                u.id AS usuario_id,
                u.nombre AS nombre_propietario,
                u.email AS email_propietario
             FROM mascotas m
             INNER JOIN usuarios u ON u.id = m.usuario_id
             ORDER BY m.nombre ASC`
        );

        res.status(200).json({
            status: "OK",
            total: resultado.rows.length,
            mascotas: resultado.rows
        });
    } catch (error) {
        console.error("Error al listar mascotas:", error);
        res.status(500).json({
            status: "ERROR",
            message: "No se pudieron consultar las mascotas"
        });
    }
});

// 4. Consultar todos los horarios.
router.get("/horarios", async (_req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, dia_semana, hora_apertura,
                    hora_cierre, activo
             FROM horarios_atencion
             ORDER BY dia_semana ASC, hora_apertura ASC`
        );

        res.status(200).json({
            status: "OK",
            total: resultado.rows.length,
            horarios: resultado.rows
        });
    } catch (error) {
        console.error("Error al consultar horarios:", error);
        res.status(500).json({
            status: "ERROR",
            message: "No se pudieron consultar los horarios"
        });
    }
});

// 5. Crear un horario.
router.post("/horarios", async (req, res) => {
    try {
        const validacion = horarioSchema.safeParse(req.body);

        if (!validacion.success) {
            res.status(400).json({
                status: "ERROR",
                message: "Los datos del horario no son válidos",
                errores: validacion.error.flatten().fieldErrors
            });
            return;
        }

        const {
            dia_semana,
            hora_apertura,
            hora_cierre
        } = validacion.data;

        const disponible = await horarioDisponible(
            dia_semana,
            hora_apertura,
            hora_cierre
        );

        if (!disponible) {
            res.status(409).json({
                status: "ERROR",
                message: "El horario se superpone con otro horario activo"
            });
            return;
        }

        const resultado = await pool.query(
            `INSERT INTO horarios_atencion
                (dia_semana, hora_apertura, hora_cierre, activo)
             VALUES ($1, $2, $3, TRUE)
             RETURNING *`,
            [dia_semana, hora_apertura, hora_cierre]
        );

        res.status(201).json({
            status: "OK",
            message: "Horario creado correctamente",
            horario: resultado.rows[0]
        });
    } catch (error: any) {
        if (error.code === "23505") {
            res.status(409).json({
                status: "ERROR",
                message: "Ese horario ya existe"
            });
            return;
        }

        console.error("Error al crear horario:", error);
        res.status(500).json({
            status: "ERROR",
            message: "No se pudo crear el horario"
        });
    }
});

// 6. Modificar un horario.
router.put("/horarios/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID del horario no es válido"
            });
            return;
        }

        const validacion = horarioSchema.safeParse(req.body);

        if (!validacion.success) {
            res.status(400).json({
                status: "ERROR",
                message: "Los datos del horario no son válidos",
                errores: validacion.error.flatten().fieldErrors
            });
            return;
        }

        const {
            dia_semana,
            hora_apertura,
            hora_cierre
        } = validacion.data;

        const existente = await pool.query(
            `SELECT activo FROM horarios_atencion WHERE id = $1`,
            [id]
        );

        if (existente.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Horario no encontrado"
            });
            return;
        }

        if (existente.rows[0].activo) {
            const disponible = await horarioDisponible(
                dia_semana,
                hora_apertura,
                hora_cierre,
                id
            );

            if (!disponible) {
                res.status(409).json({
                    status: "ERROR",
                    message: "El horario se superpone con otro horario activo"
                });
                return;
            }
        }

        const resultado = await pool.query(
            `UPDATE horarios_atencion
             SET dia_semana = $1,
                 hora_apertura = $2,
                 hora_cierre = $3
             WHERE id = $4
             RETURNING *`,
            [dia_semana, hora_apertura, hora_cierre, id]
        );

        res.status(200).json({
            status: "OK",
            message: "Horario actualizado correctamente",
            horario: resultado.rows[0]
        });
    } catch (error: any) {
        if (error.code === "23505") {
            res.status(409).json({
                status: "ERROR",
                message: "Ese horario ya existe"
            });
            return;
        }

        console.error("Error al modificar horario:", error);
        res.status(500).json({
            status: "ERROR",
            message: "No se pudo modificar el horario"
        });
    }
});

// 7. Activar o desactivar un horario.
router.patch("/horarios/:id/estado", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const validacion = z.object({
            activo: z.boolean()
        }).safeParse(req.body);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID del horario no es válido"
            });
            return;
        }

        if (!validacion.success) {
            res.status(400).json({
                status: "ERROR",
                message: "El estado del horario no es válido"
            });
            return;
        }

        const existente = await pool.query(
            `SELECT * FROM horarios_atencion WHERE id = $1`,
            [id]
        );

        if (existente.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Horario no encontrado"
            });
            return;
        }

        const horario = existente.rows[0];

        if (validacion.data.activo) {
            const disponible = await horarioDisponible(
                horario.dia_semana,
                horario.hora_apertura,
                horario.hora_cierre,
                id
            );

            if (!disponible) {
                res.status(409).json({
                    status: "ERROR",
                    message: "No se puede activar porque se superpone con otro horario activo"
                });
                return;
            }
        }

        const resultado = await pool.query(
            `UPDATE horarios_atencion
             SET activo = $1
             WHERE id = $2
             RETURNING *`,
            [validacion.data.activo, id]
        );

        res.status(200).json({
            status: "OK",
            message: validacion.data.activo
                ? "Horario activado correctamente"
                : "Horario desactivado correctamente",
            horario: resultado.rows[0]
        });
    } catch (error) {
        console.error("Error al cambiar estado del horario:", error);
        res.status(500).json({
            status: "ERROR",
            message: "No se pudo cambiar el estado del horario"
        });
    }
});

export default router;
