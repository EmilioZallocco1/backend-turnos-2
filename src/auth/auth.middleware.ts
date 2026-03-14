import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../shared/errors/appError.js";
import { getAuthenticatedPacienteById } from "../paciente/paciente.service.js";
import { readSessionTokenFromRequest, verifySessionToken } from "./auth.utils.js";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = readSessionTokenFromRequest(req);
    if (!token) {
      return next(new UnauthorizedError("Sesion no enviada"));
    }

    const decoded = verifySessionToken(token);
    const userId = Number(decoded.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return next(new UnauthorizedError("Sesion invalida"));
    }

    req.user = await getAuthenticatedPacienteById(userId);
    next();
  } catch {
    return next(new UnauthorizedError("Sesion invalida o expirada"));
  }
}
