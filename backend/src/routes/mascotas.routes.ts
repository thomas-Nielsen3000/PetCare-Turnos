
import { Router } from "express";
import { pool } from "../config/database.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import {
    crearMascotaSchema,
    actualizarMascotaSchema
} from "../validators/mascota.validator.js";

const router = Router();

// Todas las rutas requieren autenticación.
router.use(verificarToken);

// 1. Listar las mascotas del cliente autenticado.
router.get("/", async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, nombre, especie, raza, fecha_nacimiento,
                    observaciones, creado_en
             FROM mascotas
             WHERE usuario_id = $1
             ORDER BY id DESC`,
            [req.usuario!.id]
        );

        res.status(200).json({
            status: "OK",
            mascotas: resultado.rows
        });

    } catch (error) {
        console.error("Error al consultar mascotas:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudieron consultar las mascotas"
        });
    }
});

// 2. Consultar una mascota por su ID.
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID de la mascota no es válido"
            });
            return;
        }

        const resultado = await pool.query(
            `SELECT id, nombre, especie, raza, fecha_nacimiento,
                    observaciones, creado_en
             FROM mascotas
             WHERE id = $1 AND usuario_id = $2`,
            [id, req.usuario!.id]
        );

        if (resultado.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Mascota no encontrada"
            });
            return;
        }

        res.status(200).json({
            status: "OK",
            mascota: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al consultar mascota:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo consultar la mascota"
        });
    }
});

// 3. Registrar una mascota.
router.post("/", async (req, res) => {
    try {
        const validacion = crearMascotaSchema.safeParse(req.body);

        if (!validacion.success) {
            res.status(400).json({
                status: "ERROR",
                message: "Los datos de la mascota no son válidos",
                errores: validacion.error.flatten().fieldErrors
            });
            return;
        }

        const {
            nombre,
            especie,
            raza,
            fecha_nacimiento,
            observaciones
        } = validacion.data;

        const resultado = await pool.query(
            `INSERT INTO mascotas
                (usuario_id, nombre, especie, raza, fecha_nacimiento, observaciones)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, nombre, especie, raza, fecha_nacimiento,
                       observaciones, creado_en`,
            [
                req.usuario!.id,
                nombre,
                especie,
                raza ?? null,
                fecha_nacimiento ?? null,
                observaciones ?? null
            ]
        );

        res.status(201).json({
            status: "OK",
            message: "Mascota registrada correctamente",
            mascota: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al registrar mascota:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo registrar la mascota"
        });
    }
});

// 4. Actualizar una mascota.
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID de la mascota no es válido"
            });
            return;
        }

        const validacion = actualizarMascotaSchema.safeParse(req.body);

        if (!validacion.success) {
            res.status(400).json({
                status: "ERROR",
                message: "Los datos de la mascota no son válidos",
                errores: validacion.error.flatten().fieldErrors
            });
            return;
        }

        const {
            nombre,
            especie,
            raza,
            fecha_nacimiento,
            observaciones
        } = validacion.data;

        const resultado = await pool.query(
            `UPDATE mascotas
             SET nombre = $1,
                 especie = $2,
                 raza = $3,
                 fecha_nacimiento = $4,
                 observaciones = $5
             WHERE id = $6 AND usuario_id = $7
             RETURNING id, nombre, especie, raza, fecha_nacimiento,
                       observaciones, creado_en`,
            [
                nombre,
                especie,
                raza ?? null,
                fecha_nacimiento ?? null,
                observaciones ?? null,
                id,
                req.usuario!.id
            ]
        );

        if (resultado.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Mascota no encontrada"
            });
            return;
        }

        res.status(200).json({
            status: "OK",
            message: "Mascota actualizada correctamente",
            mascota: resultado.rows[0]
        });

    } catch (error) {
        console.error("Error al actualizar mascota:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo actualizar la mascota"
        });
    }
});

// 5. Eliminar una mascota.
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                status: "ERROR",
                message: "El ID de la mascota no es válido"
            });
            return;
        }

        const resultado = await pool.query(
            `DELETE FROM mascotas
             WHERE id = $1 AND usuario_id = $2
             RETURNING id`,
            [id, req.usuario!.id]
        );

        if (resultado.rows.length === 0) {
            res.status(404).json({
                status: "ERROR",
                message: "Mascota no encontrada"
            });
            return;
        }

        res.status(200).json({
            status: "OK",
            message: "Mascota eliminada correctamente"
        });

    } catch (error: any) {
        if (error.code === "23503") {
            res.status(409).json({
                status: "ERROR",
                message: "No se puede eliminar esta mascota porque tiene turnos asociados"
            });
            return;
        }

        console.error("Error al eliminar mascota:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo eliminar la mascota"
        });
    }
});

export default router;
