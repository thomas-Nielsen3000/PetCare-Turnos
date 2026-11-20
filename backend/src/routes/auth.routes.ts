
import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import { registroSchema, loginSchema } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/registro", async (req, res) => {
    try {
        const resultado = registroSchema.safeParse(req.body);

        if (!resultado.success) {
            res.status(400).json({
                status: "ERROR",
                message: "Los datos ingresados no son válidos",
                errores: resultado.error.flatten().fieldErrors
            });
            return;
        }

        const { nombre, email, password, telefono } = resultado.data;

        const passwordHash = await bcrypt.hash(password, 12);

        const consulta = await pool.query(
            `INSERT INTO usuarios (nombre, email, password_hash, telefono, rol)
             VALUES ($1, $2, $3, $4, 'cliente')
             RETURNING id, nombre, email, telefono, rol, creado_en`,
            [nombre, email, passwordHash, telefono ?? null]
        );

        res.status(201).json({
            status: "OK",
            message: "Usuario registrado correctamente",
            usuario: consulta.rows[0]
        });

    } catch (error: any) {
        if (error.code === "23505") {
            res.status(409).json({
                status: "ERROR",
                message: "Ya existe una cuenta con ese correo electrónico"
            });
            return;
        }

        console.error("Error al registrar usuario:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo registrar el usuario"
        });
    }
});


router.post("/login", async (req, res) => {
    try {
        const resultado = loginSchema.safeParse(req.body);

        if (!resultado.success) {
            res.status(400).json({
                status: "ERROR",
                message: "Los datos ingresados no son válidos",
                errores: resultado.error.flatten().fieldErrors
            });
            return;
        }

        const { email, password } = resultado.data;

        const consulta = await pool.query(
            `SELECT id, nombre, email, password_hash, telefono, rol
             FROM usuarios
             WHERE email = $1`,
            [email]
        );

        if (consulta.rows.length === 0) {
            res.status(401).json({
                status: "ERROR",
                message: "Correo electrónico o contraseña incorrectos"
            });
            return;
        }

        const usuario = consulta.rows[0];

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password_hash
        );

        if (!passwordValida) {
            res.status(401).json({
                status: "ERROR",
                message: "Correo electrónico o contraseña incorrectos"
            });
            return;
        }

        const token = jwt.sign(
            {
                rol: usuario.rol
            },
            process.env.JWT_SECRET as string,
            {
                subject: String(usuario.id),
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            status: "OK",
            message: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo iniciar sesión"
        });
    }
});

router.get("/perfil", verificarToken, (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Acceso autorizado",
        usuario: req.usuario
    });
});


export default router;
