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
import { clearSessionCookie, setSessionCookie } from "../auth/auth.utils.js";

function requireAuthenticatedUserId(req: Request) {
  const id = req.user?.id;

  if (!id) {
    throw new UnauthorizedError("No autenticado");
  }

  return id;
}

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
  setSessionCookie(res, result.token);

  res.status(200).json({
    message: "Login exitoso",
    data: result.user,
  });
});

const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearSessionCookie(res);
  res.status(200).json({ message: "Logout exitoso" });
});

const findAll = asyncHandler(async (_req: Request, res: Response) => {
  const pacientes = await getAllPacientes();
  res.status(200).json({ message: "ok", data: pacientes });
});

const findOwn = asyncHandler(async (req: Request, res: Response) => {
  const paciente = await getPacienteById(requireAuthenticatedUserId(req));
  res.status(200).json({ message: "ok", data: paciente });
});

const findById = asyncHandler(async (req: Request, res: Response) => {
  const paciente = await getPacienteById(Number.parseInt(req.params.id));
  res.status(200).json({ message: "ok", data: paciente });
});

const updateOwn = asyncHandler(async (req: Request, res: Response) => {
  const pacienteActualizado = await updatePaciente(requireAuthenticatedUserId(req), req.body);

  res.status(200).json({
    message: "Paciente actualizado",
    data: pacienteActualizado,
  });
});

const updateById = asyncHandler(async (req: Request, res: Response) => {
  const pacienteActualizado = await updatePaciente(Number.parseInt(req.params.id), req.body);

  res.status(200).json({
    message: "Paciente actualizado",
    data: pacienteActualizado,
  });
});

const removeOwn = asyncHandler(async (req: Request, res: Response) => {
  await deletePaciente(requireAuthenticatedUserId(req));
  clearSessionCookie(res);

  res.status(200).json({ message: "Paciente eliminado con exito" });
});

const removeById = asyncHandler(async (req: Request, res: Response) => {
  await deletePaciente(Number.parseInt(req.params.id));

  res.status(200).json({ message: "Paciente eliminado con exito" });
});

const findTurnosByCurrentPaciente = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPagination(req.query);
  const { turnos, total } = await getTurnosByPacienteId(
    requireAuthenticatedUserId(req),
    limit,
    offset,
  );

  res.status(200).json({
    message: "Turnos obtenidos con exito",
    ...buildPaginationResponse(turnos, total, page, limit),
  });
});

export {
  login,
  logout,
  register,
  registerByAdmin,
  removeOwn,
  removeById,
  updateOwn,
  updateById,
  findOwn,
  findById,
  findAll,
  findTurnosByCurrentPaciente,
};
