
import { Router } from "express";
import { pool } from "../config/database.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import {crearTurnoSchema, modificarTurnoSchema} from "../validators/turno.validator.js";

const router = Router();

router.use(verificarToken);

// Crear una solicitud de turno
router.post("/", async (req, res) => {
    const resultado = crearTurnoSchema.safeParse(req.body);

    if (!resultado.success) {
        res.status(400).json({
            status: "ERROR",
            message: "Los datos del turno no son válidos",
            errores: resultado.error.flatten().fieldErrors
        });
        return;
    }

    const usuarioId = Number(req.usuario!.id);
    const { mascota_id, servicio_id, fecha_inicio } = resultado.data;

    const cliente = await pool.connect();
    let transaccionIniciada = false;

    try {
        await cliente.query("BEGIN");
        transaccionIniciada = true;

        // Bloquea al usuario para evitar superar el límite
        // de turnos al realizar solicitudes simultáneas.
        await cliente.query(
            "SELECT id FROM usuarios WHERE id = $1 FOR UPDATE",
            [usuarioId]
        );

        // Comprobar que la mascota pertenece al cliente.
        const mascota = await cliente.query(
            `SELECT id, nombre
             FROM mascotas
             WHERE id = $1 AND usuario_id = $2`,
            [mascota_id, usuarioId]
        );

        if (mascota.rows.length === 0) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(404).json({
                status: "ERROR",
                message: "No se encontró la mascota o no te pertenece"
            });
            return;
        }

        // Obtener los datos reales del servicio.
        const servicio = await cliente.query(
            `SELECT id, nombre, precio, duracion_minutos
             FROM servicios
             WHERE id = $1 AND activo = TRUE`,
            [servicio_id]
        );

        if (servicio.rows.length === 0) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(404).json({
                status: "ERROR",
                message: "El servicio no existe o está desactivado"
            });
            return;
        }

        const datosServicio = servicio.rows[0];

        // Interpretar la fecha en la zona horaria de Argentina.
        const fechas = await cliente.query(
            `SELECT
                $1::timestamp AS fecha_local_inicio,
                ($1::timestamp + ($2 * INTERVAL '1 minute'))
                    AS fecha_local_fin,
                ($1::timestamp AT TIME ZONE 'America/Argentina/Buenos_Aires')
                    AS fecha_inicio,
                (($1::timestamp + ($2 * INTERVAL '1 minute'))
                    AT TIME ZONE 'America/Argentina/Buenos_Aires')
                    AS fecha_fin,
                EXTRACT(DOW FROM $1::timestamp)::INTEGER AS dia_semana,
                ($1::timestamp)::time AS hora_inicio,
                (($1::timestamp + ($2 * INTERVAL '1 minute'))::time)
                    AS hora_fin,
                (($1::timestamp)::date =
                    ($1::timestamp + ($2 * INTERVAL '1 minute'))::date)
                    AS mismo_dia`,
            [fecha_inicio, datosServicio.duracion_minutos]
        );

        const datosFecha = fechas.rows[0];

        // Comprobar anticipación mínima de tres horas.
        const anticipacion = await cliente.query(
            `SELECT $1::timestamptz >= NOW() + INTERVAL '3 hours'
                AS valido`,
            [datosFecha.fecha_inicio]
        );

        if (!anticipacion.rows[0].valido) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(400).json({
                status: "ERROR",
                message: "El turno debe reservarse con al menos 3 horas de anticipación"
            });
            return;
        }

        // El servicio debe terminar el mismo día.
        if (!datosFecha.mismo_dia) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(400).json({
                status: "ERROR",
                message: "El servicio debe finalizar dentro del mismo día"
            });
            return;
        }

        // Comprobar que todo el servicio entre en el horario de atención.
        const horario = await cliente.query(
            `SELECT id
             FROM horarios_atencion
             WHERE dia_semana = $1
               AND activo = TRUE
               AND hora_apertura <= $2::time
               AND hora_cierre >= $3::time
             LIMIT 1`,
            [
                datosFecha.dia_semana,
                datosFecha.hora_inicio,
                datosFecha.hora_fin
            ]
        );

        if (horario.rows.length === 0) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(400).json({
                status: "ERROR",
                message: "El horario seleccionado está fuera del horario de atención"
            });
            return;
        }

        // Comprobar que el cliente no supere cuatro turnos futuros activos.
        const cantidadTurnos = await cliente.query(
            `SELECT COUNT(*)::INTEGER AS cantidad
             FROM turnos t
             INNER JOIN mascotas m ON m.id = t.mascota_id
             WHERE m.usuario_id = $1
               AND t.estado IN ('pendiente', 'confirmado')
               AND t.fecha_inicio > NOW()`,
            [usuarioId]
        );

        if (cantidadTurnos.rows[0].cantidad >= 4) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(409).json({
                status: "ERROR",
                message: "Ya alcanzaste el límite de 4 turnos futuros activos"
            });
            return;
        }

        // Crear el turno como pendiente.
        const nuevoTurno = await cliente.query(
            `INSERT INTO turnos (
                mascota_id,
                servicio_id,
                fecha_inicio,
                fecha_fin,
                precio,
                nombre_servicio,
                duracion_minutos,
                estado
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pendiente')
             RETURNING *`,
            [
                mascota_id,
                servicio_id,
                datosFecha.fecha_inicio,
                datosFecha.fecha_fin,
                datosServicio.precio,
                datosServicio.nombre,
                datosServicio.duracion_minutos
            ]
        );

        await cliente.query("COMMIT");
        transaccionIniciada = false;

        res.status(201).json({
            status: "OK",
            message: "Solicitud de turno creada correctamente. Está pendiente de confirmación.",
            turno: nuevoTurno.rows[0]
        });

    } catch (error: any) {
        if (transaccionIniciada) {
            await cliente.query("ROLLBACK");
        }

        if (error.code === "23P01") {
            res.status(409).json({
                status: "ERROR",
                message: "La mascota ya tiene un turno reservado en ese horario"
            });
            return;
        }

        if (error.code === "22007" || error.code === "22008") {
            res.status(400).json({
                status: "ERROR",
                message: "La fecha ingresada no es válida"
            });
            return;
        }

        console.error("Error al crear turno:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo crear el turno"
        });

    } finally {
        cliente.release();
    }
});


// Listar turnos propios o todos los turnos para administradores.
router.get("/", async (req, res) => {
    try {
        const usuarioId = Number(req.usuario!.id);
        const esAdmin = req.usuario!.rol === "admin";

        const consulta = await pool.query(
            `SELECT
                t.*,
                m.nombre AS nombre_mascota,
                m.usuario_id
             FROM turnos t
             INNER JOIN mascotas m ON m.id = t.mascota_id
             WHERE ($1::BOOLEAN = TRUE OR m.usuario_id = $2)
             ORDER BY t.fecha_inicio DESC`,
            [esAdmin, usuarioId]
        );

        res.status(200).json({
            status: "OK",
            total: consulta.rows.length,
            turnos: consulta.rows
        });

    } catch (error) {
        console.error("Error al listar turnos:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudieron consultar los turnos"
        });
    }
});


// Consultar un turno específico.
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID del turno no es válido"
            });
            return;
        }

        const usuarioId = Number(req.usuario!.id);
        const esAdmin = req.usuario!.rol === "admin";

        const consulta = await pool.query(
            `SELECT
                t.*,
                m.nombre AS nombre_mascota,
                m.usuario_id
             FROM turnos t
             INNER JOIN mascotas m ON m.id = t.mascota_id
             WHERE t.id = $1
               AND ($2::BOOLEAN = TRUE OR m.usuario_id = $3)`,
            [id, esAdmin, usuarioId]
        );

        if (consulta.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "No se encontró el turno o no tenés permiso para consultarlo"
            });
            return;
        }

        res.status(200).json({
            status: "OK",
            turno: consulta.rows[0]
        });

    } catch (error) {
        console.error("Error al consultar turno:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo consultar el turno"
        });
    }
});

// Cancelar un turno.
router.patch("/:id/cancelar", async (req, res) => {
    const cliente = await pool.connect();
    let transaccionIniciada = false;

    try {
        const id = Number(req.params.id);
        const usuarioId = Number(req.usuario!.id);
        const esAdmin = req.usuario!.rol === "admin";

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID del turno no es válido"
            });
            return;
        }

        await cliente.query("BEGIN");
        transaccionIniciada = true;

        const consulta = await cliente.query(
            `SELECT t.*, m.usuario_id
             FROM turnos t
             INNER JOIN mascotas m ON m.id = t.mascota_id
             WHERE t.id = $1
               AND ($2::BOOLEAN = TRUE OR m.usuario_id = $3)
             FOR UPDATE OF t`,
            [id, esAdmin, usuarioId]
        );

        if (consulta.rows.length === 0) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(404).json({
                status: "ERROR",
                message: "No se encontró el turno o no tenés permiso para cancelarlo"
            });
            return;
        }

        const turno = consulta.rows[0];

        if (!["pendiente", "confirmado"].includes(turno.estado)) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(400).json({
                status: "ERROR",
                message: "El turno no se puede cancelar porque ya no está activo"
            });
            return;
        }

        if (!esAdmin) {
            const anticipacion = await cliente.query(
                `SELECT $1::timestamptz >= NOW() + INTERVAL '12 hours'
                 AS valido`,
                [turno.fecha_inicio]
            );

            if (!anticipacion.rows[0].valido) {
                await cliente.query("ROLLBACK");
                transaccionIniciada = false;

                res.status(400).json({
                    status: "ERROR",
                    message: "Solo podés cancelar turnos con al menos 12 horas de anticipación"
                });
                return;
            }
        }

        const actualizacion = await cliente.query(
            `UPDATE turnos
             SET estado = 'cancelado'
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        await cliente.query("COMMIT");
        transaccionIniciada = false;

        res.status(200).json({
            status: "OK",
            message: "Turno cancelado correctamente",
            turno: actualizacion.rows[0]
        });

    } catch (error) {
        if (transaccionIniciada) {
            await cliente.query("ROLLBACK");
        }

        console.error("Error al cancelar turno:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo cancelar el turno"
        });

    } finally {
        cliente.release();
    }
});

// Modificar la fecha y hora de un turno.
router.put("/:id", async (req, res) => {
    const resultado = modificarTurnoSchema.safeParse(req.body);

    if (!resultado.success) {
        res.status(400).json({
            status: "ERROR",
            message: "Los datos del turno no son válidos",
            errores: resultado.error.flatten().fieldErrors
        });
        return;
    }

    const id = Number(req.params.id);
    const usuarioId = Number(req.usuario!.id);
    const esAdmin = req.usuario!.rol === "admin";
    const { fecha_inicio } = resultado.data;

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            status: "ERROR",
            message: "El ID del turno no es válido"
        });
        return;
    }

    const cliente = await pool.connect();
    let transaccionIniciada = false;

    try {
        await cliente.query("BEGIN");
        transaccionIniciada = true;

        const consulta = await cliente.query(
            `SELECT t.*, m.usuario_id
             FROM turnos t
             INNER JOIN mascotas m ON m.id = t.mascota_id
             WHERE t.id = $1
               AND ($2::BOOLEAN = TRUE OR m.usuario_id = $3)
             FOR UPDATE OF t`,
            [id, esAdmin, usuarioId]
        );

        if (consulta.rows.length === 0) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(404).json({
                status: "ERROR",
                message: "No se encontró el turno o no tenés permiso para modificarlo"
            });
            return;
        }

        const turno = consulta.rows[0];

        if (!["pendiente", "confirmado"].includes(turno.estado)) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(400).json({
                status: "ERROR",
                message: "El turno no se puede modificar porque ya no está activo"
            });
            return;
        }

        // El cliente debe modificar con al menos 12 horas de anticipación.
        if (!esAdmin) {
            const anticipacionModificacion = await cliente.query(
                `SELECT $1::timestamptz >= NOW() + INTERVAL '12 hours'
                 AS valido`,
                [turno.fecha_inicio]
            );

            if (!anticipacionModificacion.rows[0].valido) {
                await cliente.query("ROLLBACK");
                transaccionIniciada = false;

                res.status(400).json({
                    status: "ERROR",
                    message: "Solo podés modificar turnos con al menos 12 horas de anticipación"
                });
                return;
            }
        }

        // Calcular la nueva fecha de finalización usando
        // la duración original del servicio.
        const fechas = await cliente.query(
            `SELECT
                $1::timestamp AS fecha_local_inicio,
                ($1::timestamp + ($2 * INTERVAL '1 minute'))
                    AS fecha_local_fin,
                ($1::timestamp AT TIME ZONE 'America/Argentina/Buenos_Aires')
                    AS fecha_inicio,
                (($1::timestamp + ($2 * INTERVAL '1 minute'))
                    AT TIME ZONE 'America/Argentina/Buenos_Aires')
                    AS fecha_fin,
                EXTRACT(DOW FROM $1::timestamp)::INTEGER AS dia_semana,
                ($1::timestamp)::time AS hora_inicio,
                (($1::timestamp + ($2 * INTERVAL '1 minute'))::time)
                    AS hora_fin,
                (($1::timestamp)::date =
                    ($1::timestamp + ($2 * INTERVAL '1 minute'))::date)
                    AS mismo_dia`,
            [fecha_inicio, turno.duracion_minutos]
        );

        const datosFecha = fechas.rows[0];

        // Exigir tres horas de anticipación para la nueva fecha.
        const anticipacion = await cliente.query(
            `SELECT $1::timestamptz >= NOW() + INTERVAL '3 hours'
             AS valido`,
            [datosFecha.fecha_inicio]
        );

        if (!anticipacion.rows[0].valido) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(400).json({
                status: "ERROR",
                message: "El nuevo horario debe respetar las 3 horas de anticipación"
            });
            return;
        }

        if (!datosFecha.mismo_dia) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(400).json({
                status: "ERROR",
                message: "El servicio debe finalizar dentro del mismo día"
            });
            return;
        }

        // Comprobar el horario de atención.
        const horario = await cliente.query(
            `SELECT id
             FROM horarios_atencion
             WHERE dia_semana = $1
               AND activo = TRUE
               AND hora_apertura <= $2::time
               AND hora_cierre >= $3::time
             LIMIT 1`,
            [
                datosFecha.dia_semana,
                datosFecha.hora_inicio,
                datosFecha.hora_fin
            ]
        );

        if (horario.rows.length === 0) {
            await cliente.query("ROLLBACK");
            transaccionIniciada = false;

            res.status(400).json({
                status: "ERROR",
                message: "El nuevo horario está fuera del horario de atención"
            });
            return;
        }

        // Actualizar solamente las fechas.
        const actualizacion = await cliente.query(
            `UPDATE turnos
             SET fecha_inicio = $1,
                 fecha_fin = $2
             WHERE id = $3
             RETURNING *`,
            [
                datosFecha.fecha_inicio,
                datosFecha.fecha_fin,
                id
            ]
        );

        await cliente.query("COMMIT");
        transaccionIniciada = false;

        res.status(200).json({
            status: "OK",
            message: "Turno modificado correctamente",
            turno: actualizacion.rows[0]
        });

    } catch (error: any) {
        if (transaccionIniciada) {
            await cliente.query("ROLLBACK");
        }

        if (error.code === "23P01") {
            res.status(409).json({
                status: "ERROR",
                message: "La mascota ya tiene un turno reservado en ese horario"
            });
            return;
        }

        if (error.code === "22007" || error.code === "22008") {
            res.status(400).json({
                status: "ERROR",
                message: "La fecha ingresada no es válida"
            });
            return;
        }

        console.error("Error al modificar turno:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo modificar el turno"
        });

    } finally {
        cliente.release();
    }
});

export default router;
