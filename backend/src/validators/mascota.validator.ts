
import { z } from "zod";

export const crearMascotaSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede superar los 100 caracteres"),

    especie: z
        .string()
        .trim()
        .min(2, "La especie debe tener al menos 2 caracteres")
        .max(50, "La especie no puede superar los 50 caracteres"),

    raza: z
        .string()
        .trim()
        .max(100, "La raza no puede superar los 100 caracteres")
        .nullable()
        .optional(),

    fecha_nacimiento: z
        .iso
        .date("La fecha de nacimiento debe tener el formato YYYY-MM-DD")
        .nullable()
        .optional(),

    observaciones: z
        .string()
        .trim()
        .max(1000, "Las observaciones no pueden superar los 1000 caracteres")
        .nullable()
        .optional()
});

export const actualizarMascotaSchema = crearMascotaSchema;
