
import { Router } from "express";
import { pool } from "../config/database.js";
import {
    verificarToken,
    verificarAdmin
} from "../middleware/auth.middleware.js";
import {
    crearServicioSchema,
    actualizarServicioSchema,
    actualizarEstadoServicioSchema
} from "../validators/servicio.validator.js";

const router = Router();

// Todas las rutas requieren autenticación.
router.use(verificarToken);

// 1. Listar servicios activos.
router.get("/", async (_req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, nombre, descripcion, precio,
                    duracion_minutos, activo, creado_en
             FROM servicios
             WHERE activo = TRUE
             ORDER BY nombre ASC`
        );

        res.status(200).json({
            status: "OK",
            servicios: resultado.rows
        });

    } catch (error) {
        console.error("Error al consultar servicios:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudieron consultar los servicios"
        });
    }
});

// 2. Listar todos los servicios (solo administradores).
router.get("/admin/todos", verificarAdmin, async (_req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, nombre, descripcion, precio,
                    duracion_minutos, activo, creado_en
             FROM servicios
             ORDER BY nombre ASC`
        );

        res.status(200).json({
            status: "OK",
            servicios: resultado.rows
        });

    } catch (error) {
        console.error("Error al consultar todos los servicios:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudieron consultar los servicios"
        });
    }
});

// 3. Consultar un servicio por su ID.
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID del servicio no es válido"
            });
            return;
        }

        const resultado = await pool.query(
            `SELECT id, nombre, descripcion, precio,
                    duracion_minutos, activo, creado_en
             FROM servicios
             WHERE id = $1
             AND (activo = TRUE OR $2 = 'admin')`,
            [id, req.usuario!.rol]
        );

        if (resultado.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Servicio no encontrado"
            });
            return;
        }

        res.status(200).json({
            status: "OK",
            servicio: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al consultar servicio:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo consultar el servicio"
        });
    }
});

// 4. Crear un servicio (solo administradores).
router.post("/", verificarAdmin, async (req, res) => {
    try {
        const validacion = crearServicioSchema.safeParse(req.body);

        if (!validacion.success) {
            res.status(400).json({
                status: "ERROR",
                message: "Los datos del servicio no son válidos",
                errores: validacion.error.flatten().fieldErrors
            });
            return;
        }

        const {
            nombre,
            descripcion,
            precio,
            duracion_minutos
        } = validacion.data;

        const resultado = await pool.query(
            `INSERT INTO servicios
                (nombre, descripcion, precio, duracion_minutos)
             VALUES ($1, $2, $3, $4)
             RETURNING id, nombre, descripcion, precio,
                       duracion_minutos, activo, creado_en`,
            [
                nombre,
                descripcion ?? null,
                precio,
                duracion_minutos
            ]
        );

        res.status(201).json({
            status: "OK",
            message: "Servicio creado correctamente",
            servicio: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al crear servicio:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo crear el servicio"
        });
    }
});

// 5. Actualizar un servicio (solo administradores).
router.put("/:id", verificarAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID del servicio no es válido"
            });
            return;
        }

        const validacion = actualizarServicioSchema.safeParse(req.body);

        if (!validacion.success) {
            res.status(400).json({
                status: "ERROR",
                message: "Los datos del servicio no son válidos",
                errores: validacion.error.flatten().fieldErrors
            });
            return;
        }

        const {
            nombre,
            descripcion,
            precio,
            duracion_minutos
        } = validacion.data;

        const resultado = await pool.query(
            `UPDATE servicios
             SET nombre = $1,
                 descripcion = $2,
                 precio = $3,
                 duracion_minutos = $4
             WHERE id = $5
             RETURNING id, nombre, descripcion, precio,
                       duracion_minutos, activo, creado_en`,
            [
                nombre,
                descripcion ?? null,
                precio,
                duracion_minutos,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Servicio no encontrado"
            });
            return;
        }

        res.status(200).json({
            status: "OK",
            message: "Servicio actualizado correctamente",
            servicio: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al actualizar servicio:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo actualizar el servicio"
        });
    }
});

// 6. Activar o desactivar un servicio (solo administradores).
router.patch("/:id/estado", verificarAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID del servicio no es válido"
            });
            return;
        }

        const validacion = actualizarEstadoServicioSchema.safeParse(req.body);

        if (!validacion.success) {
            res.status(400).json({
                status: "ERROR",
                message: "El estado del servicio no es válido",
                errores: validacion.error.flatten().fieldErrors
            });
            return;
        }

        const resultado = await pool.query(
            `UPDATE servicios
             SET activo = $1
             WHERE id = $2
             RETURNING id, nombre, descripcion, precio,
                       duracion_minutos, activo, creado_en`,
            [validacion.data.activo, id]
        );

        if (resultado.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Servicio no encontrado"
            });
            return;
        }

        res.status(200).json({
            status: "OK",
            message: validacion.data.activo
                ? "Servicio activado correctamente"
                : "Servicio desactivado correctamente",
            servicio: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al cambiar el estado del servicio:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo cambiar el estado del servicio"
        });
    }
});

export default router;
