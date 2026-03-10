 import { Router } from "express";
 import { findAll, findOne, add, update, remove } from "./especialidad.controler.js";
 import { authMiddleware } from "../auth/auth.middleware.js";
 import { requireAdmin } from "../auth/role.middleware.js";
import {
  especialidadIdValidator,
  addEspecialidadValidator,
  updateEspecialidadValidator,
} from "./especialidad.validator.js";
import { validateFields } from "../middlewares/validateFields.js";


 export const especialidadRouter = Router();

 especialidadRouter.get("/", findAll);


 especialidadRouter.get("/:id",especialidadIdValidator, validateFields, findOne);
 especialidadRouter.post("/",authMiddleware, requireAdmin, addEspecialidadValidator, validateFields, add);
 especialidadRouter.put("/:id", authMiddleware, requireAdmin, updateEspecialidadValidator, validateFields, update);
 especialidadRouter.delete("/:id", authMiddleware, requireAdmin, especialidadIdValidator, validateFields, remove);