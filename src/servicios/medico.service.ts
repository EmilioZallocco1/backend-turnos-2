import { orm } from "../shared/db/orm.js";
import { Medico } from "../medico/medico.entity.js";
import { Turno } from "../turno/turno.entity.js";
import { Especialidad } from "../especialidad/especialidad.entity.js";
import { ObraSocial } from "../obraSocial/obrasocial.entity.js";
import { BadRequestError, ConflictError } from "../shared/errors/appError.js";
import { assertUnique, findOneOrNotFound, findPaginated } from "../shared/crud/crudHelpers.js";

const NOT_FOUND_MESSAGE = "Médico no encontrado";

async function getAllMedicos(limit = 10, offset = 0) {
  const em = orm.em;
  const { items: medicos, total } = await findPaginated(
    em,
    Medico,
    { activo: true },
    limit,
    offset,
    { populate: ["especialidad", "obraSocial"] },
  );

  return { medicos, total };
}

async function getMedicoById(id: number) {
  const em = orm.em;
  return await findOneOrNotFound(em, Medico, { id, activo: true }, NOT_FOUND_MESSAGE, {
    populate: ["especialidad", "obraSocial"],
  });
}

async function createMedico(data: any) {
  const em = orm.em;
  const { nombre, email, telefono, especialidad, obraSocial } = data;

  const especialidadId =
    typeof especialidad === "object" ? especialidad?.id : especialidad;

  if (!especialidadId) {
    throw new BadRequestError("Falta el ID de la especialidad");
  }

  const especialidadObj = await em.findOne(Especialidad, { id: especialidadId });
  if (!especialidadObj) {
    throw new BadRequestError("La especialidad no existe");
  }

  let obraSocialObj = null;

  if (obraSocial) {
    const obraSocialId =
      typeof obraSocial === "object" ? obraSocial?.id : obraSocial;

    if (obraSocialId) {
      obraSocialObj = await em.findOne(ObraSocial, { id: obraSocialId });

      if (!obraSocialObj) {
        throw new BadRequestError("La obra social no existe");
      }
    }
  }

  await assertUnique(em, Medico, { email }, "Ya existe un médico con ese email");

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
  const em = orm.em;
  const medicoToUpdate = await findOneOrNotFound(em, Medico, { id }, NOT_FOUND_MESSAGE);

  const updateData: any = {};

  if (data.nombre !== undefined) updateData.nombre = data.nombre;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.telefono !== undefined) updateData.telefono = data.telefono;

  if (data.email && data.email !== medicoToUpdate.email) {
    await assertUnique(em, Medico, { email: data.email }, "Ya existe un médico con ese email");
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
      throw new BadRequestError("La especialidad no existe");
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
      throw new BadRequestError("La obra social no existe");
    }

    updateData.obraSocial = obraSocialObj;
  }

  em.assign(medicoToUpdate, updateData);
  await em.flush();

  return medicoToUpdate;
}

async function deleteMedico(id: number) {
  const em = orm.em;
  const medico = await findOneOrNotFound(em, Medico, { id }, NOT_FOUND_MESSAGE);

  const turnosPendientes = await em.count(Turno, {
    medico: medico,
    estado: "pendiente",
  });

  if (turnosPendientes > 0) {
    throw new ConflictError(
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
