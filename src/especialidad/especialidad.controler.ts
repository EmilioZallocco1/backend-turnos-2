import { Request, Response } from "express";
import {
  getAllEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
} from "../servicios/especialidad.service.js";
import { getPagination, buildPaginationResponse } from "../utils/pagination.js";
import { asyncHandler } from "../shared/errors/asyncHandler.js";

const findAll = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPagination(req.query);
  const { especialidades, total } = await getAllEspecialidades(limit, offset);

  res.status(200).json({
    message: "ok",
    ...buildPaginationResponse(especialidades, total, page, limit),
  });
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const especialidad = await getEspecialidadById(id);

  res.status(200).json({
    message: "found especialidad",
    data: especialidad,
  });
});

const add = asyncHandler(async (req: Request, res: Response) => {
  const especialidad = await createEspecialidad(req.body);

  res.status(201).json({
    message: "ok",
    data: especialidad,
  });
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const especialidad = await updateEspecialidad(id, req.body);

  res.status(200).json({
    message: "especialidad updated",
    data: especialidad,
  });
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  await deleteEspecialidad(id);

  res.status(200).json({
    message: "especialidad deleted",
  });
});

export { add, remove, update, findOne, findAll };
