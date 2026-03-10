import { orm } from "../shared/db/orm.js";
import { Especialidad } from "./especialidad.entity.js";

const em = orm.em.fork();

async function getAllEspecialidades() {
  return await em.find(Especialidad, {});
}

async function getEspecialidadById(id: number) {
  return await em.findOneOrFail(Especialidad, { id });
}

async function createEspecialidad(data: any) {
  const { name, description } = data;

  const existente = await em.findOne(Especialidad, { name });
  if (existente) {
    throw new Error("Ya existe una especialidad con ese nombre");
  }

  const especialidad = em.create(Especialidad, {
    name,
    description,
  });

  await em.persistAndFlush(especialidad);

  return especialidad;
}

async function updateEspecialidad(id: number, data: any) {
  const especialidad = await em.findOne(Especialidad, { id });

  if (!especialidad) {
    throw new Error("Especialidad no encontrada");
  }

  const updateData: any = {};

  if (data.name !== undefined) {
    if (data.name !== especialidad.name) {
      const existente = await em.findOne(Especialidad, { name: data.name });
      if (existente) {
        throw new Error("Ya existe una especialidad con ese nombre");
      }
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
  const especialidad = await em.findOne(Especialidad, { id });

  if (!especialidad) {
    throw new Error("Especialidad no encontrada");
  }

  await em.removeAndFlush(especialidad);
}

export {
  getAllEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
};