import { Request, Response, NextFunction } from "express";

export function isAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user; // lo agrega authMiddleware

  if (!user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: solo administradores" });
  }

  next();
}
