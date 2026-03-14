import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../shared/errors/appError.js";

interface JwtPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Token no enviado"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    const decoded = jwt.verify(token, secret) as JwtPayload;

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Error verificando JWT:", error);
    return next(new UnauthorizedError("Token inválido o expirado"));
  }
}
