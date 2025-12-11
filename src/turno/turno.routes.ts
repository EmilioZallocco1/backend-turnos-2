import { Router } from "express";
import { authMiddleware } from '../auth/auth.middleware.js';
import { findAll, findOne, add, update, remove, findTurnosByMedico, checkOverlap, getHorariosDisponibles } from "./turno.controler.js";

export const turnoRouter = Router();


turnoRouter.use(authMiddleware);  //todo lo de turnos requiere login

turnoRouter.get('/disponibles', getHorariosDisponibles);
turnoRouter.get("/", findAll);
turnoRouter.get("/:id", findOne);
turnoRouter.post("/", add);
turnoRouter.put("/:id", update);
turnoRouter.delete("/:id", remove);
turnoRouter.get('/medico/:id', findTurnosByMedico);
turnoRouter.get('/medicos/:id/turnos/overlap', checkOverlap); 
