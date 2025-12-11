import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./obraSocial.controler.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { isAdminMiddleware } from "../auth/isAdmin.middleware.js";

export const obraSocialRouter = Router();

//rutas publicas
obraSocialRouter.get("/", findAll);
obraSocialRouter.get("/:id", findOne);

//rutas privadas solo para administradores
obraSocialRouter.use(authMiddleware, isAdminMiddleware);
obraSocialRouter.post("/", add);
obraSocialRouter.put("/:id", update);
obraSocialRouter.delete("/:id", remove);