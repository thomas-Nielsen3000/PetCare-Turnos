
import { z } from "zod";

export const crearTurnoSchema = z.object({
    mascota_id: z.number()
        .int("El ID de la mascota debe ser un número entero")
        .positive("La mascota seleccionada no es válida"),

    servicio_id: z.number()
        .int("El ID del servicio debe ser un número entero")
        .positive("El servicio seleccionado no es válido"),

    fecha_inicio: z.string()
        .regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
            "La fecha debe tener el formato AAAA-MM-DDTHH:mm"
        )
});

export const modificarTurnoSchema = z.object({
    fecha_inicio: z.string()
        .regex(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
            "La fecha debe tener el formato AAAA-MM-DDTHH:mm"
        )
});
