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

turnoRouter.get("/disponibles", horariosDisponiblesValidator, validateFields, getHorariosDisponibles);

turnoRouter.use(authMiddleware);

turnoRouter.get("/medico/:id", requireAdmin, turnosByMedicoValidator, validateFields, findTurnosByMedico);
turnoRouter.get(
  "/medicos/:id/turnos/overlap",
  requireAdmin,
  checkOverlapValidator,
  validateFields,
  checkOverlap,
);
turnoRouter.get("/", requireAdmin, findAll);
turnoRouter.get("/:id", turnoIdValidator, validateFields, findOne);
turnoRouter.post("/", addTurnoValidator, validateFields, add);
turnoRouter.put("/:id", updateTurnoValidator, validateFields, update);
turnoRouter.delete("/:id", turnoIdValidator, validateFields, remove);
