import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Falta token (Bearer)" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "dev-secret";

    const payload = jwt.verify(token, secret) as { id: number; role: string };

    // CLAVE: guardamos info para usar en controllers
    (req as any).user = { id: payload.id, role: payload.role };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}