import { Request, Response } from "express";
import {
  getAllTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno,
  getTurnosByMedicoId,
  verifyOverlap,
  getHorariosDisponiblesByMedico,
} from "./turno.service.js";
import { getPagination, buildPaginationResponse } from "../utils/pagination.js";
import { asyncHandler } from "../shared/errors/asyncHandler.js";
import { UnauthorizedError } from "../shared/errors/appError.js";

function requireAuthenticatedUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError("No autenticado");
  }

  return req.user;
}

const findAll = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPagination(req.query);
  const { turnos, total } = await getAllTurnos(limit, offset);

  res.status(200).json({
    message: "ok",
    ...buildPaginationResponse(turnos, total, page, limit),
  });
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const turno = await getTurnoById(id, requireAuthenticatedUser(req));
  res.status(200).json({ message: "ok", data: turno });
});

const add = asyncHandler(async (req: Request, res: Response) => {
  const turno = await createTurno(req.body, requireAuthenticatedUser(req));
  res.status(201).json({
    message: "Turno creado correctamente",
    data: turno,
  });
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const turnoActualizado = await updateTurno(id, req.body, requireAuthenticatedUser(req));

  res.status(200).json({
    message: "Turno actualizado",
    data: turnoActualizado,
  });
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  await deleteTurno(id, requireAuthenticatedUser(req));

  res.status(200).json({
    message: "Turno eliminado con exito",
  });
});

const findTurnosByMedico = asyncHandler(async (req: Request, res: Response) => {
  const medicoId = Number(req.params.id);
  const turnos = await getTurnosByMedicoId(medicoId);

  res.status(200).json({
    message: "Turnos del medico obtenidos con exito",
    data: turnos,
  });
});

const checkOverlap = asyncHandler(async (req: Request, res: Response) => {
  const medicoId = Number(req.params.id);
  const { inicio, fin, duracionMin } = req.query as {
    inicio?: string;
    fin?: string;
    duracionMin?: string;
  };

  const result = await verifyOverlap(medicoId, inicio, fin, duracionMin);
  res.status(200).json(result);
});

const getHorariosDisponibles = asyncHandler(async (req: Request, res: Response) => {
  const medicoId = Number(req.query.medicoId as string);
  const fechaStr = req.query.fecha as string;
  const horarios = await getHorariosDisponiblesByMedico(medicoId, fechaStr);

  res.status(200).json({
    message: "ok",
    data: horarios,
  });
});

export {
  add,
  remove,
  update,
  findOne,
  findAll,
  findTurnosByMedico,
  checkOverlap,
  getHorariosDisponibles,
};
