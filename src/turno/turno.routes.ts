import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  findTurnosByMedico,
  checkOverlap,
  getHorariosDisponibles,
} from "./turno.controler.js";

import {
  addTurnoValidator,
  turnoIdValidator,
  updateTurnoValidator,
  turnosByMedicoValidator,
  checkOverlapValidator,
  horariosDisponiblesValidator,
} from "./turno.validator.js";
import { validateFields } from "../middlewares/validateFields.js";
import { requireAdmin } from "../auth/role.middleware.js";

export const turnoRouter = Router();

turnoRouter.use(authMiddleware); //todo lo de turnos requiere login

turnoRouter.get("/disponibles", getHorariosDisponibles); // esta ruta no requiere auth porque se usa para mostrar horarios disponibles antes de loguearse
turnoRouter.get("/", authMiddleware, findAll);
turnoRouter.get("/:id",authMiddleware, turnoIdValidator, validateFields, findOne);
turnoRouter.post("/", authMiddleware, addTurnoValidator, validateFields, add);
turnoRouter.put("/:id", authMiddleware, updateTurnoValidator, validateFields, update);
turnoRouter.delete("/:id", authMiddleware, turnoIdValidator, validateFields, remove);
turnoRouter.get("/medico/:id", authMiddleware, turnosByMedicoValidator, validateFields, findTurnosByMedico);
turnoRouter.get("/medicos/:id/turnos/overlap", authMiddleware, checkOverlapValidator, validateFields, checkOverlap);
