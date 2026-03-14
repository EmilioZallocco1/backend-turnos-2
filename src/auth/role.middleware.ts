import { Request, Response, NextFunction } from "express";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../shared/errors/appError.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (!user) {
    return next(new UnauthorizedError("No autenticado"));
  }

  if (user.role !== "admin") {
    return next(new ForbiddenError("No autorizado (solo administradores)"));
  }

  next();
}
