import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./medico.controler.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { isAdminMiddleware } from "../auth/isAdmin.middleware.js";
import { medicoIdValidator, addMedicoValidator, updateMedicoValidator } from "./medico.validator.js";
import { validateFields } from "../middlewares/validateFields.js";
import { requireAdmin } from "../auth/role.middleware.js";

export const medicoRouter = Router();


// públicas
medicoRouter.get("/", findAll);
medicoRouter.get("/:id", medicoIdValidator, validateFields, findOne);

// protegidas solo administradores
medicoRouter.post("/", authMiddleware, isAdminMiddleware,addMedicoValidator, validateFields ,add);
medicoRouter.put("/:id", authMiddleware, isAdminMiddleware, updateMedicoValidator, validateFields, update);
medicoRouter.delete("/:id", authMiddleware, isAdminMiddleware, medicoIdValidator, validateFields, remove);

