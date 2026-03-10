import { orm } from '../shared/db/orm.js'
import { ObraSocial } from './obrasocial.entity.js'

const em = orm.em

async function findAllObrasSociales() {
  const obrasSociales = await em.find(ObraSocial, {})
  return obrasSociales
}

async function findOneObraSocial(id: number) {
  const obraSocial = await em.findOneOrFail(
    ObraSocial,
    { id },
    { populate: ['pacientes', 'medicos'] }
  )
  return obraSocial
}

async function addObraSocial(data: any) {
  const obraSocial = em.create(ObraSocial, data)
  await em.flush()
  return obraSocial
}

async function updateObraSocial(id: number, data: any) {
  const obraSocialToUpdate = await em.findOneOrFail(ObraSocial, { id })
  em.assign(obraSocialToUpdate, data)
  await em.flush()
  return obraSocialToUpdate
}

async function removeObraSocial(id: number) {
  const obraSocial = em.getReference(ObraSocial, id)
  await em.removeAndFlush(obraSocial)
}

export {
  findAllObrasSociales,
  findOneObraSocial,
  addObraSocial,
  updateObraSocial,
  removeObraSocial,
}