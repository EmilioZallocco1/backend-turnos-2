import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user; // viene del authMiddleware

  if (!user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "No autorizado (solo administradores)" });
  }

  next();
}
