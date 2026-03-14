import { Router } from "express";
import { loginPacienteValidator } from "../paciente/paciente.validator.js";
import { validateFields } from "../middlewares/validateFields.js";
import { authMiddleware } from "./auth.middleware.js";
import { login, logout, me } from "./auth.controler.js";

export const authRouter = Router();

authRouter.post("/login", loginPacienteValidator, validateFields, login);
authRouter.post("/logout", logout);
authRouter.get("/me", authMiddleware, me);
