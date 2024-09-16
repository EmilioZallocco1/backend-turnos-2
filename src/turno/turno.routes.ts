import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./turno.controler.js";

export const turnoRouter = Router();

turnoRouter.get("/", findAll);
turnoRouter.get("/:id", findOne);
turnoRouter.post("/", add);
turnoRouter.put("/:id", update);
turnoRouter.delete("/:id", remove);