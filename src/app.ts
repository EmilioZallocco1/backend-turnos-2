import "reflect-metadata";
import express from "express";
import cors from "cors";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { especialidadRouter } from "./especialidad/especialidad.routes.js";
import { medicoRouter } from "./medico/medico.routes.js";
import { turnoRouter } from "./turno/turno.routes.js";
import { pacienteRouter } from "./paciente/paciente.routes.js";
import { obraSocialRouter } from "./obraSocial/obraSocial.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./shared/errors/errorHandler.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:4200", "https://turnos-frontend-tau.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

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
