import { orm } from "../shared/db/orm.js";
import { Especialidad } from "../especialidad/especialidad.entity.js";
import { assertUnique, findOneOrNotFound, findPaginated } from "../shared/crud/crudHelpers.js";

const NOT_FOUND_MESSAGE = "Especialidad no encontrada";

async function getAllEspecialidades(limit = 10, offset = 0) {
  const em = orm.em;
  const { items: especialidades, total } = await findPaginated(em, Especialidad, {}, limit, offset);

  return { especialidades, total };
}

async function getEspecialidadById(id: number) {
  const em = orm.em;
  return await findOneOrNotFound(em, Especialidad, { id }, NOT_FOUND_MESSAGE);
}

async function createEspecialidad(data: any) {
  const em = orm.em;
  const { name, description } = data;

  await assertUnique(em, Especialidad, { name }, "Ya existe una especialidad con ese nombre");

  const especialidad = em.create(Especialidad, {
    name,
    description,
  });

  await em.persistAndFlush(especialidad);

  return especialidad;
}

async function updateEspecialidad(id: number, data: any) {
  const em = orm.em;
  const especialidad = await findOneOrNotFound(em, Especialidad, { id }, NOT_FOUND_MESSAGE);

  const updateData: any = {};

  if (data.name !== undefined) {
    if (data.name !== especialidad.name) {
      await assertUnique(em, Especialidad, { name: data.name }, "Ya existe una especialidad con ese nombre");
    }
    updateData.name = data.name;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  em.assign(especialidad, updateData);
  await em.flush();

  return especialidad;
}

async function deleteEspecialidad(id: number) {
  const em = orm.em;
  const especialidad = await findOneOrNotFound(em, Especialidad, { id }, NOT_FOUND_MESSAGE);

  await em.removeAndFlush(especialidad);
}

export {
  getAllEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
};
