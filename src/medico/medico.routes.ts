import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./medico.controler.js";

export const medicoRouter = Router();

medicoRouter.get("/", findAll);
medicoRouter.get("/:id", findOne);
medicoRouter.post("/", add);
medicoRouter.put("/:id", update);
medicoRouter.delete("/:id", remove);