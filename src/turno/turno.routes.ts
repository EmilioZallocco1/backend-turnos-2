import { Router } from "express";
import { findAll, findOne, add, update, remove, findTurnosByMedico, checkOverlap, getHorariosDisponibles } from "./turno.controler.js";

export const turnoRouter = Router();



turnoRouter.get('/disponibles', getHorariosDisponibles);
turnoRouter.get("/", findAll);
turnoRouter.get("/:id", findOne);
turnoRouter.post("/", add);
turnoRouter.put("/:id", update);
turnoRouter.delete("/:id", remove);
turnoRouter.get('/medico/:id', findTurnosByMedico);
turnoRouter.get('/medicos/:id/turnos/overlap', checkOverlap); 
