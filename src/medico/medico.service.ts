import { orm } from "../shared/db/orm.js";
import { Medico } from "./medico.entity.js";
import { Turno } from "../turno/turno.entity.js";
import { Especialidad } from "../especialidad/especialidad.entity.js";
import { ObraSocial } from "../obraSocial/obrasocial.entity.js";

const em = orm.em.fork();

async function getAllMedicos() {
  return await em.find(
    Medico,
    { activo: true },
    { populate: ["especialidad", "obraSocial"] }
  );
}

async function getMedicoById(id: number) {
  return await em.findOneOrFail(
    Medico,
    { id, activo: true },
    { populate: ["especialidad", "obraSocial"] }
  );
}

async function createMedico(data: any) {
  const { nombre, email, telefono, especialidad, obraSocial } = data;

  const especialidadId =
    typeof especialidad === "object" ? especialidad?.id : especialidad;

  if (!especialidadId) {
    throw new Error("Falta el ID de la especialidad");
  }

  const especialidadObj = await em.findOne(Especialidad, { id: especialidadId });
  if (!especialidadObj) {
    throw new Error("La especialidad no existe");
  }

  let obraSocialObj = null;

  if (obraSocial) {
    const obraSocialId =
      typeof obraSocial === "object" ? obraSocial?.id : obraSocial;

    if (obraSocialId) {
      obraSocialObj = await em.findOne(ObraSocial, { id: obraSocialId });

      if (!obraSocialObj) {
        throw new Error("La obra social no existe");
      }
    }
  }

  const medicoExistente = await em.findOne(Medico, { email });
  if (medicoExistente) {
    throw new Error("Ya existe un médico con ese email");
  }

  const datosMedico: any = {
    nombre,
    email,
    telefono,
    especialidad: especialidadObj,
    activo: true,
  };

  if (obraSocialObj) {
    datosMedico.obraSocial = obraSocialObj;
  }

  const medico = em.create(Medico, datosMedico);
  await em.persistAndFlush(medico);

  return medico;
}

async function updateMedico(id: number, data: any) {
  const medicoToUpdate = await em.findOne(Medico, { id });

  if (!medicoToUpdate) {
    throw new Error("Médico no encontrado");
  }

  const updateData: any = {};

  if (data.nombre !== undefined) updateData.nombre = data.nombre;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.telefono !== undefined) updateData.telefono = data.telefono;

  if (data.email && data.email !== medicoToUpdate.email) {
    const medicoExistente = await em.findOne(Medico, { email: data.email });
    if (medicoExistente) {
      throw new Error("Ya existe un médico con ese email");
    }
  }

  if (data.especialidad) {
    const especialidadId =
      typeof data.especialidad === "object"
        ? data.especialidad?.id
        : data.especialidad;

    const especialidadObj = await em.findOne(Especialidad, {
      id: especialidadId,
    });

    if (!especialidadObj) {
      throw new Error("La especialidad no existe");
    }

    updateData.especialidad = especialidadObj;
  }

  if (data.obraSocial) {
    const obraSocialId =
      typeof data.obraSocial === "object"
        ? data.obraSocial?.id
        : data.obraSocial;

    const obraSocialObj = await em.findOne(ObraSocial, { id: obraSocialId });

    if (!obraSocialObj) {
      throw new Error("La obra social no existe");
    }

    updateData.obraSocial = obraSocialObj;
  }

  em.assign(medicoToUpdate, updateData);
  await em.flush();

  return medicoToUpdate;
}

async function deleteMedico(id: number) {
  const medico = await em.findOne(Medico, { id });

  if (!medico) {
    throw new Error("Médico no encontrado");
  }

  const turnosPendientes = await em.count(Turno, {
    medico: medico,
    estado: "pendiente",
  });

  if (turnosPendientes > 0) {
    throw new Error(
      `No se puede eliminar: tiene ${turnosPendientes} turno(s) pendiente(s).`
    );
  }

  medico.activo = false;
  await em.flush();
}

export {
  getAllMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico,
};