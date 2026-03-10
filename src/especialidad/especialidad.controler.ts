import { Request, Response } from "express";
import {
  getAllEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
} from "./especialidad.service.js";

function getStatusCode(errorMessage: string): number {
  if (errorMessage.includes("Ya existe")) {
    return 400;
  }

  if (errorMessage.includes("no encontrada")) {
    return 404;
  }

  return 500;
}

async function findAll(req: Request, res: Response) {
  try {
    const especialidades = await getAllEspecialidades();
    res.status(200).json({ message: "ok", data: especialidades });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const especialidad = await getEspecialidadById(id);

    res.status(200).json({
      message: "found especialidad",
      data: especialidad,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const especialidad = await createEspecialidad(req.body);

    res.status(201).json({
      message: "ok",
      data: especialidad,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const especialidad = await updateEspecialidad(id, req.body);

    res.status(200).json({
      message: "especialidad updated",
      data: especialidad,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    await deleteEspecialidad(id);

    res.status(200).json({
      message: "especialidad deleted",
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

export { add, remove, update, findOne, findAll };