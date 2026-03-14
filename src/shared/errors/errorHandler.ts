import { NotFoundError } from "@mikro-orm/core";
import { ErrorRequestHandler, RequestHandler } from "express";
import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundAppError,
  UnauthorizedError,
} from "./appError.js";

function mapMessageToAppError(message: string): AppError {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("token no enviado") ||
    normalizedMessage.includes("falta token") ||
    normalizedMessage.includes("token inválido") ||
    normalizedMessage.includes("token invalido") ||
    normalizedMessage.includes("credenciales inválidas") ||
    normalizedMessage.includes("credenciales invalidas") ||
    normalizedMessage.includes("no autenticado")
  ) {
    return new UnauthorizedError(message);
  }

  if (normalizedMessage.includes("no autorizado")) {
    return new ForbiddenError(message);
  }

  if (
    normalizedMessage.includes("ya existe") ||
    normalizedMessage.includes("obligatorio") ||
    normalizedMessage.includes("obligatorios") ||
    normalizedMessage.includes("falta") ||
    normalizedMessage.includes("inválid") ||
    normalizedMessage.includes("invalid")
  ) {
    return new BadRequestError(message);
  }

  if (
    normalizedMessage.includes("no encontrado") ||
    normalizedMessage.includes("no encontrada") ||
    normalizedMessage.includes("no existe") ||
    normalizedMessage.includes("no se encontraron") ||
    normalizedMessage.includes("resource not found")
  ) {
    return new NotFoundAppError(message);
  }

  if (
    normalizedMessage.includes("superpone") ||
    normalizedMessage.includes("no se puede eliminar")
  ) {
    return new ConflictError(message);
  }

  return new AppError(500, "Internal server error");
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof NotFoundError) {
    return new NotFoundAppError("Resource not found");
  }

  if (error instanceof SyntaxError && "body" in error) {
    return new BadRequestError("JSON inválido");
  }

  if (error instanceof Error) {
    return mapMessageToAppError(error.message);
  }

  return new AppError(500, "Internal server error");
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new NotFoundAppError("Resource not found"));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const appError = normalizeError(error);

  if (appError.statusCode >= 500) {
    console.error(error);
  }

  res.status(appError.statusCode).json({
    message: appError.message,
    ...(appError.details !== undefined ? { details: appError.details } : {}),
  });
};
