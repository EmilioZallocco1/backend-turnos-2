import { orm } from '../shared/db/orm.js'
import { ObraSocial } from '../obraSocial/obrasocial.entity.js'

const em = orm.em

async function findAllObrasSociales(page: number, limit: number, offset: number) {
  const [obrasSociales, total] = await em.findAndCount(
    ObraSocial,
    {},
    {
      limit,
      offset,
    }
  );

  return { obrasSociales, total };
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
