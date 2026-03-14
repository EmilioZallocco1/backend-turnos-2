import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./medico.controler.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  medicoIdValidator,
  addMedicoValidator,
  updateMedicoValidator,
} from "./medico.validator.js";
import { validateFields } from "../middlewares/validateFields.js";
import { requireAdmin } from "../auth/role.middleware.js";

export const medicoRouter = Router();

medicoRouter.get("/", findAll);
medicoRouter.get("/:id", medicoIdValidator, validateFields, findOne);

medicoRouter.post("/", authMiddleware, requireAdmin, addMedicoValidator, validateFields, add);
medicoRouter.put("/:id", authMiddleware, requireAdmin, updateMedicoValidator, validateFields, update);
medicoRouter.delete("/:id", authMiddleware, requireAdmin, medicoIdValidator, validateFields, remove);
