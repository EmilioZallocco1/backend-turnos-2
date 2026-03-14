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
import { asyncHandler } from "../shared/errors/asyncHandler.js";
import { UnauthorizedError } from "../shared/errors/appError.js";

const register = asyncHandler(async (req: Request, res: Response) => {
  const pacienteDTO = await registerPaciente(req.body);
  res.status(201).json({
    message: "Paciente registrado exitosamente",
    data: pacienteDTO,
  });
});

const registerByAdmin = asyncHandler(async (req: Request, res: Response) => {
  const pacienteDTO = await registerPacienteByAdmin(req.body);
  res.status(201).json({
    message: "Usuario creado exitosamente por un administrador",
    data: pacienteDTO,
  });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginPaciente(req.body);
  res.status(200).json({
    message: "Login exitoso",
    data: result.paciente,
    token: result.token,
  });
});

const findAll = asyncHandler(async (_req: Request, res: Response) => {
  const pacientes = await getAllPacientes();
  res.status(200).json({ message: "ok", data: pacientes });
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const id = (req as any).user?.id;

  if (!id) {
    throw new UnauthorizedError("No autenticado");
  }

  const paciente = await getPacienteById(id);
  res.status(200).json({ message: "ok", data: paciente });
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const id = (req as any).user?.id;

  if (!id) {
    throw new UnauthorizedError("No autenticado");
  }

  const pacienteActualizado = await updatePaciente(id, req.body);

  res.status(200).json({
    message: "Paciente actualizado",
    data: pacienteActualizado,
  });
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = (req as any).user?.id;

  if (!id) {
    throw new UnauthorizedError("No autenticado");
  }

  await deletePaciente(id);

  res.status(200).json({ message: "Paciente eliminado con éxito" });
});

const findTurnosByPacienteId = asyncHandler(async (req: Request, res: Response) => {
  const pacienteId = (req as any).user?.id;

  if (!pacienteId) {
    throw new UnauthorizedError("No autenticado");
  }

  const { page, limit, offset } = getPagination(req.query);
  const { turnos, total } = await getTurnosByPacienteId(
    pacienteId,
    limit,
    offset,
  );

  res.status(200).json({
    message: "Turnos obtenidos con éxito",
    ...buildPaginationResponse(turnos, total, page, limit),
  });
});

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
