import { orm } from "../shared/db/orm.js";
import { Turno } from "./turno.entity.js";
import { Medico } from "../medico/medico.entity.js";
import { Paciente } from "../paciente/paciente.entity.js";
import {
  intervalsOverlap,
  startOfDayUTC,
  endOfDayUTC,
  combineDateAndTime,
  addMinutes,
} from "../utils/turnos.helpers.js";

const em = orm.em.fork();

async function getAllTurnos(limit = 5, offset = 0) {
  const [turnos, total] = await em.findAndCount(
    Turno,
    {},
    {
      populate: ["paciente", "medico"],
      limit,
      offset,
      orderBy: { id: "ASC" },
    }
  );

  return { turnos, total };
}

async function getTurnoById(id: number) {
  return await em.findOneOrFail(
    Turno,
    { id },
    { populate: ["medico", "paciente"] }
  );
}

async function createTurno(data: any) {
  const { fecha, hora, estado, descripcion, medicoId, pacienteId } = data;
  const DURACION_MIN = 30;

  const medico = await em.findOne(Medico, { id: medicoId });
  if (!medico) {
    throw new Error("Médico no encontrado");
  }

  const paciente = await em.findOne(Paciente, { id: pacienteId });
  if (!paciente) {
    throw new Error("Paciente no encontrado");
  }

  const inicio = new Date(`${fecha}T${hora}`);
  const fin = new Date(inicio.getTime() + DURACION_MIN * 60 * 1000);

  const turnosExistentes = await em.find(Turno, { medico: medicoId });

  const haySuperposicion = turnosExistentes.some((t) => {
    const tInicio = new Date(`${t.fecha.toISOString().split("T")[0]}T${t.hora}`);
    const tFin = new Date(tInicio.getTime() + DURACION_MIN * 60 * 1000);
    return inicio < tFin && fin > tInicio;
  });

  if (haySuperposicion) {
    throw new Error("El turno se superpone con otro del mismo médico");
  }

  const turno = em.create(Turno, {
    fecha: new Date(fecha),
    hora: String(hora),
    estado: String(estado),
    descripcion: String(descripcion),
    medico,
    paciente,
  });

  await em.persistAndFlush(turno);

  return turno;
}

async function updateTurno(id: number, data: any) {
  const turnoToUpdate = await em.findOne(Turno, { id });

  if (!turnoToUpdate) {
    throw new Error("Turno no encontrado");
  }

  const updateData: any = {};

  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha);
  if (data.hora !== undefined) updateData.hora = String(data.hora);
  if (data.estado !== undefined) updateData.estado = String(data.estado);
  if (data.descripcion !== undefined) {
    updateData.descripcion = String(data.descripcion);
  }

  if (data.medicoId !== undefined) {
    const medico = await em.findOne(Medico, { id: data.medicoId });
    if (!medico) {
      throw new Error("Médico no encontrado");
    }
    updateData.medico = medico;
  }

  if (data.pacienteId !== undefined) {
    const paciente = await em.findOne(Paciente, { id: data.pacienteId });
    if (!paciente) {
      throw new Error("Paciente no encontrado");
    }
    updateData.paciente = paciente;
  }

  em.assign(turnoToUpdate, updateData);
  await em.flush();

  return turnoToUpdate;
}

async function deleteTurno(id: number) {
  const turno = await em.findOne(Turno, { id });

  if (!turno) {
    throw new Error("Turno no encontrado");
  }

  await em.removeAndFlush(turno);
}

async function getTurnosByMedicoId(medicoId: number) {
  const turnos = await em.find(
    Turno,
    { medico: medicoId },
    { populate: ["paciente", "medico"] }
  );

  if (!turnos || turnos.length === 0) {
    throw new Error("No se encontraron turnos para este médico");
  }

  return turnos;
}

async function verifyOverlap(
  medicoId: number,
  inicio?: string,
  fin?: string,
  duracionMin?: string
) {
  const dur = Number(duracionMin ?? 30);

  if (!inicio && !fin) {
    throw new Error("Parámetros inválidos: enviar inicio y fin o inicio+duracionMin");
  }

  const ini = inicio ? new Date(inicio) : undefined;
  const fi = fin ? new Date(fin) : ini ? addMinutes(ini, dur) : undefined;

  if (!ini || !fi) {
    throw new Error("Fechas inválidas");
  }

  const dayStart = startOfDayUTC(ini);
  const dayEnd = endOfDayUTC(ini);

  const turnos = await em.find(Turno, {
    medico: medicoId,
    fecha: { $gte: dayStart, $lte: dayEnd },
  });

  const overlap = turnos.some((t) => {
    const tIni = combineDateAndTime(t.fecha, t.hora);
    const tDur = (t as any).duracionMin ?? 30;
    const tFin = addMinutes(tIni, tDur);
    return intervalsOverlap(ini, fi, tIni, tFin);
  });

  return { overlap };
}

async function getHorariosDisponiblesByMedico(medicoId: number, fechaStr: string) {
  const medico = await em.findOne(Medico, { id: medicoId });

  if (!medico) {
    throw new Error("Médico no encontrado");
  }

  const fechaBase = new Date(fechaStr + "T00:00:00.000Z");

  const dayStart = startOfDayUTC(fechaBase);
  const dayEnd = endOfDayUTC(fechaBase);

  const turnos = await em.find(Turno, {
    medico: medicoId,
    fecha: { $gte: dayStart, $lte: dayEnd },
    estado: { $ne: "cancelado" },
  });

  const DURACION_MIN = 30;
  const inicioJornada = combineDateAndTime(fechaBase, "09:00");
  const finJornada = combineDateAndTime(fechaBase, "17:00");

  const horariosDisponibles: string[] = [];
  let slotInicio = inicioJornada;

  while (slotInicio < finJornada) {
    const slotFin = addMinutes(slotInicio, DURACION_MIN);

    const seSuperpone = turnos.some((t) => {
      const tIni = combineDateAndTime(t.fecha, t.hora);
      const tFin = addMinutes(tIni, DURACION_MIN);
      return intervalsOverlap(slotInicio, slotFin, tIni, tFin);
    });

    if (!seSuperpone) {
      const hh = slotInicio.getUTCHours().toString().padStart(2, "0");
      const mm = slotInicio.getUTCMinutes().toString().padStart(2, "0");
      horariosDisponibles.push(`${hh}:${mm}`);
    }

    slotInicio = slotFin;
  }

  return horariosDisponibles;
}

export {
  getAllTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno,
  getTurnosByMedicoId,
  verifyOverlap,
  getHorariosDisponiblesByMedico,
};