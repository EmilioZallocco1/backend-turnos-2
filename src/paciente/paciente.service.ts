import { orm } from "../shared/db/orm.js";
import { Paciente } from "./paciente.entity.js";
import { ObraSocial } from "../obraSocial/obrasocial.entity.js";
import { Turno } from "../turno/turno.entity.js";
import bcrypt from "bcrypt";
import { esEmailValido } from "../utils/validarEmail.js";
import { esContraseniaValida } from "../utils/validarContrasenia.js";
import { signSessionToken } from "../auth/auth.utils.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { UnauthorizedError } from "../shared/errors/appError.js";

const em = orm.em.fork();

function toAuthenticatedUser(paciente: Paciente): AuthenticatedUser {
  return {
    id: paciente.id,
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    email: paciente.email,
    role: paciente.role || "paciente",
  };
}

async function registerPaciente(data: any) {
  const { nombre, apellido, email, password, obraSocialId } = data;

  if (!nombre || !apellido || !email || !password || !obraSocialId) {
    throw new Error("Nombre, apellido, email, contrasena y obra social son obligatorios.");
  }

  if (!esEmailValido(email)) {
    throw new Error("El email no tiene un formato valido.");
  }

  if (!esContraseniaValida(password)) {
    throw new Error(
      "La contrasena no es valida. Debe tener al menos 8 caracteres e incluir letras y numeros.",
    );
  }

  const existingPaciente = await em.findOne(Paciente, { email });
  if (existingPaciente) {
    throw new Error("El email ya esta en uso.");
  }

  const obraSocial = await em.findOne(ObraSocial, { id: obraSocialId });
  if (!obraSocial) {
    throw new Error("La obra social proporcionada no existe.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const paciente = em.create(Paciente, {
    nombre,
    apellido,
    email,
    passwordHash,
    obraSocial,
    role: "paciente",
  });

  await em.persistAndFlush(paciente);

  return {
    id: paciente.id,
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    email: paciente.email,
    role: paciente.role || "paciente",
    obraSocial: paciente.obraSocial?.id ?? null,
  };
}

async function registerPacienteByAdmin(data: any) {
  const { nombre, apellido, email, password, obraSocialId, role } = data;

  if (!nombre || !apellido || !email || !password || !obraSocialId) {
    throw new Error("Nombre, apellido, email, contrasena y obra social son obligatorios.");
  }

  if (!esEmailValido(email)) {
    throw new Error("El email no tiene un formato valido.");
  }

  if (!esContraseniaValida(password)) {
    throw new Error(
      "La contrasena no es valida. Debe tener al menos 8 caracteres e incluir letras y numeros.",
    );
  }

  const existingPaciente = await em.findOne(Paciente, { email });
  if (existingPaciente) {
    throw new Error("El email ya esta en uso.");
  }

  const obraSocial = await em.findOne(ObraSocial, { id: obraSocialId });
  if (!obraSocial) {
    throw new Error("La obra social proporcionada no existe.");
  }

  const roleFinal = role === "admin" ? "admin" : "paciente";

  const passwordHash = await bcrypt.hash(password, 10);

  const paciente = em.create(Paciente, {
    nombre,
    apellido,
    email,
    passwordHash,
    obraSocial,
    role: roleFinal,
  });

  await em.persistAndFlush(paciente);

  return {
    id: paciente.id,
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    email: paciente.email,
    role: paciente.role,
    obraSocial: paciente.obraSocial?.id ?? null,
  };
}

async function loginPaciente(data: any) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email y contrasena son obligatorios");
  }

  const usuario = await em.findOne(Paciente, { email }, { populate: ["obraSocial"] });
  if (!usuario) {
    throw new Error("Credenciales invalidas");
  }

  const isMatch = await bcrypt.compare(password, usuario.passwordHash);
  if (!isMatch) {
    throw new Error("Credenciales invalidas");
  }

  return {
    user: toAuthenticatedUser(usuario),
    token: signSessionToken(usuario.id),
  };
}

async function getAuthenticatedPacienteById(id: number) {
  const paciente = await em.findOne(Paciente, { id });

  if (!paciente) {
    throw new UnauthorizedError("Usuario autenticado no encontrado");
  }

  return toAuthenticatedUser(paciente);
}

async function getAllPacientes() {
  return await em.find(Paciente, {}, { populate: ["obraSocial", "turnos"] });
}

async function getPacienteById(id: number) {
  return await em.findOneOrFail(
    Paciente,
    { id },
    { populate: ["turnos", "obraSocial"] },
  );
}

async function updatePaciente(id: number, data: any) {
  const pacienteToUpdate = await em.findOneOrFail(Paciente, { id });

  const { nombre, apellido, email, telefono, obraSocial } = data;
  const updateData: any = { nombre, apellido, email, telefono, obraSocial };

  if (
    updateData.obraSocial &&
    typeof updateData.obraSocial === "object" &&
    updateData.obraSocial.id
  ) {
    updateData.obraSocial = await em.findOneOrFail(ObraSocial, {
      id: updateData.obraSocial.id,
    });
  }

  em.assign(pacienteToUpdate, updateData);
  await em.flush();

  return pacienteToUpdate;
}

async function deletePaciente(id: number) {
  const paciente = await em.findOne(Paciente, { id });

  if (!paciente) {
    throw new Error("Paciente no encontrado");
  }

  await em.removeAndFlush(paciente);
}

async function getTurnosByPacienteId(
  pacienteId: number,
  limit: number,
  offset: number,
) {
  const [turnos, total] = await em.findAndCount(
    Turno,
    { paciente: pacienteId },
    {
      populate: ["paciente", "medico"],
      limit,
      offset,
      orderBy: { id: "ASC" },
    },
  );

  if (total === 0) {
    throw new Error("No se encontraron turnos para este paciente");
  }

  return { turnos, total };
}

export {
  registerPaciente,
  registerPacienteByAdmin,
  loginPaciente,
  getAuthenticatedPacienteById,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
  getTurnosByPacienteId,
};
