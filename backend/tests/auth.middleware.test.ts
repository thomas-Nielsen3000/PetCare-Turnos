import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

import {
    verificarToken,
    verificarAdmin
} from "../src/middleware/auth.middleware.js";

const SECRET = "clave-de-prueba-para-tests";

process.env.JWT_SECRET = SECRET;

function crearRespuesta() {
    return {
        statusCode: 200,
        body: undefined as any,

        status(codigo: number) {
            this.statusCode = codigo;
            return this;
        },

        json(datos: any) {
            this.body = datos;
            return this;
        }
    };
}

function crearToken(rol: "cliente" | "admin") {
    return jwt.sign({ rol }, SECRET, {
        subject: "12",
        expiresIn: "1h"
    });
}

test("Autenticación: rechaza solicitudes sin token", () => {
    const req = { headers: {} } as any;
    const res = crearRespuesta();
    let continuo = false;

    verificarToken(req, res as any, () => {
        continuo = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(continuo, false);
});

test("Autenticación: rechaza tokens inválidos", () => {
    const req = {
        headers: { authorization: "Bearer token-invalido" }
    } as any;

    const res = crearRespuesta();
    let continuo = false;

    verificarToken(req, res as any, () => {
        continuo = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(continuo, false);
});

test("Autenticación: acepta un token válido de cliente", () => {
    const req = {
        headers: { authorization: `Bearer ${crearToken("cliente")}` }
    } as any;

    const res = crearRespuesta();
    let continuo = false;

    verificarToken(req, res as any, () => {
        continuo = true;
    });

    assert.equal(continuo, true);
    assert.equal(req.usuario.id, "12");
    assert.equal(req.usuario.rol, "cliente");
});

test("Autenticación: acepta un token válido de administrador", () => {
    const req = {
        headers: { authorization: `Bearer ${crearToken("admin")}` }
    } as any;

    const res = crearRespuesta();
    let continuo = false;

    verificarToken(req, res as any, () => {
        continuo = true;
    });

    assert.equal(continuo, true);
    assert.equal(req.usuario.rol, "admin");
});

test("Permisos: rechaza usuarios sin autenticación", () => {
    const req = {} as any;
    const res = crearRespuesta();
    let continuo = false;

    verificarAdmin(req, res as any, () => {
        continuo = true;
    });

    assert.equal(res.statusCode, 403);
    assert.equal(continuo, false);
});

test("Permisos: rechaza a los clientes en rutas de administrador", () => {
    const req = {
        usuario: { id: "12", rol: "cliente" }
    } as any;

    const res = crearRespuesta();
    let continuo = false;

    verificarAdmin(req, res as any, () => {
        continuo = true;
    });

    assert.equal(res.statusCode, 403);
    assert.equal(continuo, false);
});

test("Permisos: permite el acceso a administradores", () => {
    const req = {
        usuario: { id: "1", rol: "admin" }
    } as any;

    const res = crearRespuesta();
    let continuo = false;

    verificarAdmin(req, res as any, () => {
        continuo = true;
    });

    assert.equal(continuo, true);
});
