
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
