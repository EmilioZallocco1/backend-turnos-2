import { Request, Response } from "express";
import {
  getAllMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico,
} from "./medico.service.js";
import { getPagination, buildPaginationResponse } from "../utils/pagination.js";
import { asyncHandler } from "../shared/errors/asyncHandler.js";

const findAll = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPagination(req.query);
  const { medicos, total } = await getAllMedicos(limit, offset);

  res.status(200).json({
    message: "ok",
    ...buildPaginationResponse(medicos, total, page, limit),
  });
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const medico = await getMedicoById(id);
  res.status(200).json({ message: "ok", data: medico });
});

const add = asyncHandler(async (req: Request, res: Response) => {
  const medico = await createMedico(req.body);
  res.status(201).json({ message: "ok", data: medico });
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const medicoActualizado = await updateMedico(id, req.body);

  res.status(200).json({
    message: "Médico actualizado",
    data: medicoActualizado,
  });
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  await deleteMedico(id);

  res.status(200).json({
    message: "Médico dado de baja correctamente",
  });
});

export { add, remove, update, findOne, findAll };
