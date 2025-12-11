import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./medico.controler.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { isAdminMiddleware } from "../auth/isAdmin.middleware.js";

export const medicoRouter = Router();


// públicas
medicoRouter.get("/", findAll);
medicoRouter.get("/:id", findOne);

// protegidas solo administradores
medicoRouter.post("/", authMiddleware, isAdminMiddleware, add);
medicoRouter.put("/:id", authMiddleware, isAdminMiddleware, update);
medicoRouter.delete("/:id", authMiddleware, isAdminMiddleware, remove);

