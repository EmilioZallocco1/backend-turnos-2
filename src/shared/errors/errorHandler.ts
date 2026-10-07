import { NotFoundError, UniqueConstraintViolationException } from "@mikro-orm/core";
import { ErrorRequestHandler, RequestHandler } from "express";
import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundAppError,
} from "./appError.js";

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof UniqueConstraintViolationException) {
    return new ConflictError("El valor ingresado ya esta en uso.");
  }

  if (error instanceof NotFoundError) {
    return new NotFoundAppError("Resource not found");
  }

  if (error instanceof SyntaxError && "body" in error) {
    return new BadRequestError("JSON invalido");
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
