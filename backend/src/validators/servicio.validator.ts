
import { z } from "zod";

export const crearServicioSchema = z.object({
    nombre: z.string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(120, "El nombre no puede superar los 120 caracteres"),

    descripcion: z.string()
        .trim()
        .max(1000, "La descripción no puede superar los 1000 caracteres")
        .nullable()
        .optional(),

    precio: z.number()
        .finite()
        .min(0, "El precio no puede ser negativo"),

    duracion_minutos: z.number()
        .int("La duración debe ser un número entero")
        .positive("La duración debe ser mayor que cero")
});

export const actualizarServicioSchema = crearServicioSchema;

export const actualizarEstadoServicioSchema = z.object({
    activo: z.boolean()
});
