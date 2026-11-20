
import { z } from "zod";

export const registroSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede superar los 100 caracteres"),

    email: z
        .string()
        .trim()
        .email("Ingresá un correo electrónico válido")
        .max(255)
        .transform((email) => email.toLowerCase()),

    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(72, "La contraseña no puede superar los 72 caracteres"),

    telefono: z
        .string()
        .trim()
        .max(30, "El teléfono es demasiado largo")
        .optional()
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Ingresá un correo electrónico válido")
        .transform((email) => email.toLowerCase()),

    password: z
        .string()
        .min(1, "La contraseña es obligatoria")
        .max(72)
});
