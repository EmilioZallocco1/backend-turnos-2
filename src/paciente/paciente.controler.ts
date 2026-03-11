import { Request, Response } from "express";
import {
  registerPaciente,
  registerPacienteByAdmin,
  loginPaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
  getTurnosByPacienteId,
} from "./paciente.service.js";
import { getPagination, buildPaginationResponse } from "../utils/pagination.js";
function getStatusCode(errorMessage: string): number {
  if (
    errorMessage.includes("ya está en uso") ||
    errorMessage.includes("inválida") ||
    errorMessage.includes("inválido")
  ) {
    return 400;
  }

  if (errorMessage.includes("Credenciales inválidas")) {
    return 401;
  }

  if (
    errorMessage.includes("no existe") ||
    errorMessage.includes("no encontrado") ||
    errorMessage.includes("No se encontraron")
  ) {
    return 404;
  }

  return 500;
}

async function register(req: Request, res: Response) {
  try {
    const pacienteDTO = await registerPaciente(req.body);
    res.status(201).json({
      message: "Paciente registrado exitosamente",
      data: pacienteDTO,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function registerByAdmin(req: Request, res: Response) {
  try {
    const pacienteDTO = await registerPacienteByAdmin(req.body);
    res.status(201).json({
      message: "Usuario creado exitosamente por un administrador",
      data: pacienteDTO,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function login(req: Request, res: Response) {
  try {
    const result = await loginPaciente(req.body);
    res.status(200).json({
      message: "Login exitoso",
      data: result.paciente,
      token: result.token,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const pacientes = await getAllPacientes();
    res.status(200).json({ message: "ok", data: pacientes });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = (req as any).user?.id;

    if (!id) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const paciente = await getPacienteById(id);
    res.status(200).json({ message: "ok", data: paciente });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = (req as any).user?.id;

    if (!id) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const pacienteActualizado = await updatePaciente(id, req.body);

    res.status(200).json({
      message: "Paciente actualizado",
      data: pacienteActualizado,
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = (req as any).user?.id;

    if (!id) {
      return res.status(401).json({ message: "No autenticado" });
    }

    await deletePaciente(id);

    res.status(200).json({ message: "Paciente eliminado con éxito" });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({ message: error.message });
  }
}

async function findTurnosByPacienteId(req: Request, res: Response) {
  try {
    const pacienteId = (req as any).user?.id;

    if (!pacienteId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { page, limit, offset } = getPagination(req.query);

    const { turnos, total } = await getTurnosByPacienteId(
      pacienteId,
      limit,
      offset
    );

    res.status(200).json({
      message: "Turnos obtenidos con éxito",
      ...buildPaginationResponse(turnos, total, page, limit),
    });
  } catch (error: any) {
    res.status(getStatusCode(error.message)).json({
      message: error.message,
    });
  }
}

export {
  login,
  register,
  registerByAdmin,
  remove,
  update,
  findOne,
  findAll,
  findTurnosByPacienteId,
};