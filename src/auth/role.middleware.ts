import { Request, Response, NextFunction } from "express";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../shared/errors/appError.js";

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("No autenticado"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError("No autorizado"));
    }

    next();
  };
}

export const requireAdmin = requireRole("admin");
