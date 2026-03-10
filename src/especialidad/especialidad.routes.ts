 import { Router } from "express";
 import { findAll, findOne, add, update, remove } from "./especialidad.controler.js";
 import { authMiddleware } from "../auth/auth.middleware.js";
 import { requireAdmin } from "../auth/role.middleware.js";


 export const especialidadRouter = Router();


especialidadRouter.use(authMiddleware,requireAdmin );

 especialidadRouter.get("/", findAll);
 especialidadRouter.get("/:id", findOne);
 especialidadRouter.post("/", add);
 especialidadRouter.put("/:id", update);
 especialidadRouter.delete("/:id", remove);