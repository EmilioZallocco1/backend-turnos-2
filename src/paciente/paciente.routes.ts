import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { requireAdmin } from "../auth/role.middleware.js";
import {
  findAll,
  findOne,
  update,
  remove,
  register,
  login,
  findTurnosByPacienteId,
  registerByAdmin,
} from "../paciente/paciente.controler.js";
import {
  registerPacienteValidator,
  registerByAdminValidator,
  loginPacienteValidator,
  updatePacienteValidator,
} from "./paciente.validator.js";
import { validateFields } from "../middlewares/validateFields.js";

export const pacienteRouter = Router();

// Login y register son públicos
pacienteRouter.post("/login",loginPacienteValidator, validateFields, login);
pacienteRouter.post("/register", registerPacienteValidator, validateFields, register);

//  Todas las rutas de abajo requieren JWT válido
pacienteRouter.use(authMiddleware);

pacienteRouter.get("/me", findOne);
pacienteRouter.put("/me", updatePacienteValidator, validateFields, update);
pacienteRouter.delete("/me", remove);
pacienteRouter.get("/:me/turnos", findTurnosByPacienteId);

pacienteRouter.get("/", findAll);
pacienteRouter.get("/:id", requireAdmin, findOne);
pacienteRouter.put("/:id", requireAdmin, update);
pacienteRouter.delete("/:id", requireAdmin, remove);

// ruta solo para admin
pacienteRouter.post(
  "/admin/create",
  registerByAdminValidator,
  validateFields,
  authMiddleware,
  requireAdmin,
  registerByAdmin,
);
