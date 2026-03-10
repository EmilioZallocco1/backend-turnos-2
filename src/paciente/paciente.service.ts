import { orm } from "../shared/db/orm.js";
import { Paciente } from "./paciente.entity.js";
import { ObraSocial } from "../obraSocial/obrasocial.entity.js";
import { Turno } from "../turno/turno.entity.js";
import bcrypt from "bcrypt";
import { esEmailValido } from "../utils/validarEmail.js";
import { esContraseniaValida } from "../utils/validarContrasenia.js";
import jwt from "jsonwebtoken";

const em = orm.em.fork();

function generarToken(paciente: Paciente) {
  const payload = {
    id: paciente.id,
    role: paciente.role || "paciente",
  };

  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

async function registerPaciente(data: any) {
  const { nombre, apellido, email, password, obraSocialId } = data;

  if (!nombre || !apellido || !email || !password || !obraSocialId) {
    throw new Error("Nombre, apellido, email, contraseña y obra social son obligatorios.");
  }

  if (!esEmailValido(email)) {
    throw new Error("El email no tiene un formato válido.");
  }

  if (!esContraseniaValida(password)) {
    throw new Error(
      "La contraseña no es válida. Debe tener al menos 8 caracteres e incluir letras y números."
    );
  }

  const existingPaciente = await em.findOne(Paciente, { email });
  if (existingPaciente) {
    throw new Error("El email ya está en uso.");
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

  const token = generarToken(paciente);

  return {
    id: paciente.id,
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    email: paciente.email,
    role: paciente.role || "paciente",
    obraSocial: paciente.obraSocial?.id ?? null,
    token,
  };
}

async function registerPacienteByAdmin(data: any) {
  const { nombre, apellido, email, password, obraSocialId, role } = data;

  if (!nombre || !apellido || !email || !password || !obraSocialId) {
    throw new Error("Nombre, apellido, email, contraseña y obra social son obligatorios.");
  }

  if (!esEmailValido(email)) {
    throw new Error("El email no tiene un formato válido.");
  }

  if (!esContraseniaValida(password)) {
    throw new Error(
      "La contraseña no es válida. Debe tener al menos 8 caracteres e incluir letras y números."
    );
  }

  const existingPaciente = await em.findOne(Paciente, { email });
  if (existingPaciente) {
    throw new Error("El email ya está en uso.");
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
    throw new Error("Email y contraseña son obligatorios");
  }

  const usuario = await em.findOne(Paciente, { email }, { populate: ["obraSocial"] });
  if (!usuario) {
    throw new Error("Credenciales inválidas");
  }

  const isMatch = await bcrypt.compare(password, usuario.passwordHash);
  if (!isMatch) {
    throw new Error("Credenciales inválidas");
  }

  const token = generarToken(usuario);

  return {
    paciente: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      role: usuario.role || "paciente",
      telefono: (usuario as any).telefono ?? null,
      obraSocial: (usuario as any).obraSocial ?? null,
    },
    token,
  };
}

async function getAllPacientes() {
  return await em.find(Paciente, {}, { populate: ["obraSocial", "turnos"] });
}

async function getPacienteById(id: number) {
  return await em.findOneOrFail(
    Paciente,
    { id },
    { populate: ["turnos", "obraSocial"] }
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

async function getTurnosByPacienteId(pacienteId: number) {
  const turnos = await em.find(
    Turno,
    { paciente: pacienteId },
    { populate: ["paciente", "medico"] }
  );

  if (turnos.length === 0) {
    throw new Error("No se encontraron turnos para este paciente");
  }

  return turnos;
}

export {
  registerPaciente,
  registerPacienteByAdmin,
  loginPaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
  getTurnosByPacienteId,
};