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

function getStatusCode(errorMessage: string): number {
  if (
    errorMessage.includes("inválido") ||
    errorMessage.includes("inválidos")
  ) {
    return 400;
  }

  if (
    errorMessage.includes("no encontrado") ||
    errorMessage.includes("No se encontraron")
  ) {
    return 404;
  }

  if (errorMessage.includes("superpone")) {
    return 409;
  }

  return 500;
}

async function findAll(req: Request, res: Response) {
  try {
    const turnos = await getAllTurnos();
    res.status(200).json({ message: "ok", data: turnos });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const turno = await getTurnoById(id);
    res.status(200).json({ message: "ok", data: turno });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const turno = await createTurno(req.body);
    res.status(201).json({
      message: "Turno creado correctamente",
      data: turno,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const turnoActualizado = await updateTurno(id, req.body);

    res.status(200).json({
      message: "Turno actualizado",
      data: turnoActualizado,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    await deleteTurno(id);

    res.status(200).json({
      message: "Turno eliminado con éxito",
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function findTurnosByMedico(req: Request, res: Response) {
  try {
    const medicoId = Number(req.params.id);
    const turnos = await getTurnosByMedicoId(medicoId);

    res.status(200).json({
      message: "Turnos del médico obtenidos con éxito",
      data: turnos,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function checkOverlap(req: Request, res: Response) {
  try {
    const medicoId = Number(req.params.id);
    const { inicio, fin, duracionMin } = req.query as {
      inicio?: string;
      fin?: string;
      duracionMin?: string;
    };

    const result = await verifyOverlap(medicoId, inicio, fin, duracionMin);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function getHorariosDisponibles(req: Request, res: Response) {
  try {
    const medicoId = Number(req.query.medicoId as string);
    const fechaStr = req.query.fecha as string;

    const horarios = await getHorariosDisponiblesByMedico(medicoId, fechaStr);

    res.status(200).json({
      message: "ok",
      data: horarios,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

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