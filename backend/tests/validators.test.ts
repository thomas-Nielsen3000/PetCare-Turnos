import test from "node:test";
import assert from "node:assert/strict";

import { registroSchema, loginSchema } from "../src/validators/auth.validator.js";
import { crearMascotaSchema } from "../src/validators/mascota.validator.js";
import {
    crearServicioSchema,
    actualizarEstadoServicioSchema
} from "../src/validators/servicio.validator.js";
import {
    crearTurnoSchema,
    modificarTurnoSchema
} from "../src/validators/turno.validator.js";

test("Registro: acepta datos válidos y normaliza el email", () => {
    const resultado = registroSchema.safeParse({
        nombre: "  Thomas  ",
        email: "  PRUEBA@CORREO.COM ",
        password: "clave-segura-123"
    });

    assert.equal(resultado.success, true);

    if (resultado.success) {
        assert.equal(resultado.data.nombre, "Thomas");
        assert.equal(resultado.data.email, "prueba@correo.com");
    }
});

test("Registro: rechaza nombres demasiado cortos", () => {
    const resultado = registroSchema.safeParse({
        nombre: "T",
        email: "prueba@correo.com",
        password: "clave-segura"
    });

    assert.equal(resultado.success, false);
});

test("Registro: rechaza emails inválidos", () => {
    const resultado = registroSchema.safeParse({
        nombre: "Thomas",
        email: "correo-invalido",
        password: "clave-segura"
    });

    assert.equal(resultado.success, false);
});

test("Registro: rechaza contraseñas menores a 8 caracteres", () => {
    const resultado = registroSchema.safeParse({
        nombre: "Thomas",
        email: "prueba@correo.com",
        password: "1234567"
    });

    assert.equal(resultado.success, false);
});

test("Login: acepta credenciales con email normalizado", () => {
    const resultado = loginSchema.safeParse({
        email: " PRUEBA@CORREO.COM ",
        password: "12345678"
    });

    assert.equal(resultado.success, true);

    if (resultado.success) {
        assert.equal(resultado.data.email, "prueba@correo.com");
    }
});

test("Login: rechaza contraseñas vacías", () => {
    const resultado = loginSchema.safeParse({
        email: "prueba@correo.com",
        password: ""
    });

    assert.equal(resultado.success, false);
});

test("Mascotas: acepta datos válidos", () => {
    const resultado = crearMascotaSchema.safeParse({
        nombre: "Luna",
        especie: "Perro",
        raza: "Labrador",
        fecha_nacimiento: "2022-05-10",
        observaciones: "Vacunas al día"
    });

    assert.equal(resultado.success, true);
});

test("Mascotas: rechaza fechas de nacimiento inválidas", () => {
    const resultado = crearMascotaSchema.safeParse({
        nombre: "Luna",
        especie: "Perro",
        fecha_nacimiento: "10/05/2022"
    });

    assert.equal(resultado.success, false);
});

test("Mascotas: rechaza nombres demasiado cortos", () => {
    const resultado = crearMascotaSchema.safeParse({
        nombre: "L",
        especie: "Perro"
    });

    assert.equal(resultado.success, false);
});

test("Servicios: acepta datos válidos", () => {
    const resultado = crearServicioSchema.safeParse({
        nombre: "Consulta veterinaria",
        descripcion: "Consulta general",
        precio: 15000,
        duracion_minutos: 30
    });

    assert.equal(resultado.success, true);
});

test("Servicios: rechaza precios negativos", () => {
    const resultado = crearServicioSchema.safeParse({
        nombre: "Consulta",
        precio: -100,
        duracion_minutos: 30
    });

    assert.equal(resultado.success, false);
});

test("Servicios: rechaza duraciones que no sean enteros positivos", () => {
    const resultado = crearServicioSchema.safeParse({
        nombre: "Consulta",
        precio: 15000,
        duracion_minutos: 30.5
    });

    assert.equal(resultado.success, false);
});

test("Servicios: acepta estados booleanos", () => {
    assert.equal(
        actualizarEstadoServicioSchema.safeParse({ activo: true }).success,
        true
    );

    assert.equal(
        actualizarEstadoServicioSchema.safeParse({ activo: "sí" }).success,
        false
    );
});

test("Turnos: acepta datos con formato de fecha válido", () => {
    const resultado = crearTurnoSchema.safeParse({
        mascota_id: 1,
        servicio_id: 2,
        fecha_inicio: "2026-12-15T10:00"
    });

    assert.equal(resultado.success, true);
});

test("Turnos: rechaza identificadores no positivos", () => {
    const resultado = crearTurnoSchema.safeParse({
        mascota_id: 0,
        servicio_id: 2,
        fecha_inicio: "2026-12-15T10:00"
    });

    assert.equal(resultado.success, false);
});

test("Turnos: rechaza fechas con formato incorrecto", () => {
    const resultado = crearTurnoSchema.safeParse({
        mascota_id: 1,
        servicio_id: 2,
        fecha_inicio: "15/12/2026 10:00"
    });

    assert.equal(resultado.success, false);
});

test("Modificar turno: acepta una fecha con formato correcto", () => {
    const resultado = modificarTurnoSchema.safeParse({
        fecha_inicio: "2026-12-15T11:00"
    });

    assert.equal(resultado.success, true);
});

test("Modificar turno: rechaza una fecha con formato incorrecto", () => {
    const resultado = modificarTurnoSchema.safeParse({
        fecha_inicio: "mañana a las 11"
    });

    assert.equal(resultado.success, false);
});
