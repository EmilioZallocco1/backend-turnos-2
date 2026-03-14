import { Request, Response } from "express";
import {
  getAllEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
} from "./especialidad.service.js";
import { asyncHandler } from "../shared/errors/asyncHandler.js";

const findAll = asyncHandler(async (_req: Request, res: Response) => {
  const especialidades = await getAllEspecialidades();
  res.status(200).json({ message: "ok", data: especialidades });
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
