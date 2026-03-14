import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { requireAdmin } from "../auth/role.middleware.js";
import {
  findAll,
  findOwn,
  findById,
  updateOwn,
  updateById,
  removeOwn,
  removeById,
  register,
  login,
  logout,
  findTurnosByCurrentPaciente,
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

pacienteRouter.post("/login", loginPacienteValidator, validateFields, login);
pacienteRouter.post("/logout", logout);
pacienteRouter.post("/register", registerPacienteValidator, validateFields, register);

pacienteRouter.use(authMiddleware);

pacienteRouter.get("/me", findOwn);
pacienteRouter.put("/me", updatePacienteValidator, validateFields, updateOwn);
pacienteRouter.delete("/me", removeOwn);
pacienteRouter.get("/me/turnos", findTurnosByCurrentPaciente);

pacienteRouter.post(
  "/admin/create",
  requireAdmin,
  registerByAdminValidator,
  validateFields,
  registerByAdmin,
);

pacienteRouter.get("/", requireAdmin, findAll);
pacienteRouter.get("/:id", requireAdmin, findById);
pacienteRouter.put("/:id", requireAdmin, updatePacienteValidator, validateFields, updateById);
pacienteRouter.delete("/:id", requireAdmin, removeById);
