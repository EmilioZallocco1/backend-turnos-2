import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

// MANEJO DE ERRORES DE MANERA CENTRAL - PARA NO REPETIR TRY CATCH EN CADA CONTROLADOR,
// SE ENVUELVE LA LOGICA DE CADA CONTROLADOR EN ESTA FUNCION QUE SE ENCARGA
// DE CAPTURAR ERRORES Y PASARLOS AL MIDDLEWARE DE ERRORES
export function asyncHandler(fn: AsyncHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next) as unknown as void;
  };
} 