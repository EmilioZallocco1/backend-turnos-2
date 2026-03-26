import { Request, Response } from "express";
import { asyncHandler } from "../shared/errors/asyncHandler.js";
import { loginPaciente } from "../servicios/paciente.service.js";
import { clearSessionCookie, setSessionCookie } from "./auth.utils.js";

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

const me = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    message: "ok",
    data: req.user,
  });
});

export { login, logout, me };
