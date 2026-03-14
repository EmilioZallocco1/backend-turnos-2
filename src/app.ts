import "reflect-metadata";
import "./shared/config/loadEnv.js";
import express from "express";
import cors from "cors";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { authRouter } from "./auth/auth.routes.js";
import { especialidadRouter } from "./especialidad/especialidad.routes.js";
import { medicoRouter } from "./medico/medico.routes.js";
import { turnoRouter } from "./turno/turno.routes.js";
import { pacienteRouter } from "./paciente/paciente.routes.js";
import { obraSocialRouter } from "./obraSocial/obraSocial.routes.js";
import { getAllowedOrigins } from "./auth/auth.config.js";
import {
  errorHandler,
  notFoundHandler,
} from "./shared/errors/errorHandler.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = getAllowedOrigins();

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin no permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use("/api/auth/", authRouter);
app.use("/api/especialidades/", especialidadRouter);
app.use("/api/medicos/", medicoRouter);
app.use("/api/turnos/", turnoRouter);
app.use("/api/pacientes/", pacienteRouter);
app.use("/api/obras-sociales/", obraSocialRouter);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  await syncSchema();
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
