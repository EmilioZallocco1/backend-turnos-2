import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../shared/errors/appError.js";

export function validateFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new BadRequestError("Errores de validación", errors.array()));
  }

  next();
}
