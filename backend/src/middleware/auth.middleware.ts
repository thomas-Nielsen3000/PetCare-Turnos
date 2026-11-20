
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UsuarioAutenticado {
    id: string;
    rol: "cliente" | "admin";
}

declare global {
    namespace Express {
        interface Request {
            usuario?: UsuarioAutenticado;
        }
    }
}

export function verificarToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const encabezado = req.headers.authorization;

        if (!encabezado || !encabezado.startsWith("Bearer ")) {
            res.status(401).json({
                status: "ERROR",
                message: "No estás autenticado"
            });
            return;
        }

        const token = encabezado.split(" ")[1];

        if (!token || !process.env.JWT_SECRET) {
            res.status(401).json({
                status: "ERROR",
                message: "Token inválido"
            });
            return;
        }

        const datos = jwt.verify(token, process.env.JWT_SECRET) as {
            sub: string;
            rol: "cliente" | "admin";
        };

        req.usuario = {
            id: datos.sub,
            rol: datos.rol
        };

        next();

    } catch {
        res.status(401).json({
            status: "ERROR",
            message: "Token inválido o vencido"
        });
    }
}

export function verificarAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.usuario || req.usuario.rol !== "admin") {
        res.status(403).json({
            status: "ERROR",
            message: "No tenés permisos para realizar esta acción"
        });
        return;
    }

    next();
}
