import { orm } from '../shared/db/orm.js'
import { ObraSocial } from '../obraSocial/obrasocial.entity.js'
import { findOneOrNotFound, findPaginated } from '../shared/crud/crudHelpers.js'

const NOT_FOUND_MESSAGE = 'Obra social no encontrada'

async function findAllObrasSociales(page: number, limit: number, offset: number) {
  const em = orm.em
  const { items: obrasSociales, total } = await findPaginated(em, ObraSocial, {}, limit, offset)

  return { obrasSociales, total };
}

async function findOneObraSocial(id: number) {
  const em = orm.em
  return await findOneOrNotFound(em, ObraSocial, { id }, NOT_FOUND_MESSAGE, {
    populate: ['pacientes', 'medicos'],
  })
}

async function addObraSocial(data: any) {
  const em = orm.em
  const obraSocial = em.create(ObraSocial, data)
  await em.flush()
  return obraSocial
}

async function updateObraSocial(id: number, data: any) {
  const em = orm.em
  const obraSocialToUpdate = await findOneOrNotFound(em, ObraSocial, { id }, NOT_FOUND_MESSAGE)
  em.assign(obraSocialToUpdate, data)
  await em.flush()
  return obraSocialToUpdate
}

async function removeObraSocial(id: number) {
  const em = orm.em
  const obraSocial = await findOneOrNotFound(em, ObraSocial, { id }, NOT_FOUND_MESSAGE)
  await em.removeAndFlush(obraSocial)
}

export {
  findAllObrasSociales,
  findOneObraSocial,
  addObraSocial,
  updateObraSocial,
  removeObraSocial,
}
