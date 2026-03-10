import { Request, Response } from "express";
import {
  getAllMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico,
} from "./medico.service.js";

function getStatusCode(errorMessage: string): number {
  if (
    errorMessage.includes("Falta") ||
    errorMessage.includes("Ya existe")
  ) {
    return 400;
  }

  if (
    errorMessage.includes("no existe") ||
    errorMessage.includes("no encontrado")
  ) {
    return 404;
  }

  if (errorMessage.includes("No se puede eliminar")) {
    return 409;
  }

  return 500;
}

async function findAll(req: Request, res: Response) {
  try {
    const medicos = await getAllMedicos();
    res.status(200).json({ message: "ok", data: medicos });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const medico = await getMedicoById(id);
    res.status(200).json({ message: "ok", data: medico });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const medico = await createMedico(req.body);
    res.status(201).json({ message: "ok", data: medico });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const medicoActualizado = await updateMedico(id, req.body);

    res.status(200).json({
      message: "Médico actualizado",
      data: medicoActualizado,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    await deleteMedico(id);

    res.status(200).json({
      message: "Médico dado de baja correctamente",
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

export { add, remove, update, findOne, findAll };