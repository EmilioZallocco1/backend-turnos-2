import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./obraSocial.controler.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createObraSocialValidator,
  updateObraSocialValidator,
} from "./obrasocial.validator.js";
import { requireAdmin } from "../auth/role.middleware.js";

export const obraSocialRouter = Router();

obraSocialRouter.get("/", findAll);
obraSocialRouter.get("/:id", findOne);

obraSocialRouter.use(authMiddleware, requireAdmin);
obraSocialRouter.post("/", createObraSocialValidator, validate, add);
obraSocialRouter.put("/:id", updateObraSocialValidator, validate, update);
obraSocialRouter.delete("/:id", remove);
