
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import mascotasRoutes from "./routes/mascotas.routes.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        message: "PetCare Turnos API funcionando correctamente"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/mascotas", mascotasRoutes);

app.get("/api/db-test", async (_req, res) => {
    try {
        const resultado = await pool.query("SELECT NOW()");

        res.status(200).json({
            status: "OK",
            message: "Conexión con PostgreSQL exitosa",
            fecha: resultado.rows[0].now
        });

    } catch (error) {
        console.error("Error al conectar con PostgreSQL:", error);

        res.status(500).json({
            status: "ERROR",
            message: "No se pudo conectar con la base de datos"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
