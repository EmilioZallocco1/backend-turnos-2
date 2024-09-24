import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { ObraSocial } from './obrasocial.entity.js'


const em = orm.em

async function findAll(req: Request,res: Response) {
    try{
        const obrasSociales = await em.find(ObraSocial, {})
        res.status(200).json({message: 'ok', data: obrasSociales})
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const medico = await em.findOneOrFail(ObraSocial, { id },{ populate: ['pacientes','medicos'] })
        res.status(200).json({message: 'ok', data: medico})

    }catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}

async function add(req: Request, res: Response) {
    
    try {
        const obraSocial = em.create(ObraSocial, req.body)
        await em.flush()
        res.status(201).json({message: 'ok', data: obraSocial})
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}


async function update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const obraSocialToUpdate = await em.findOneOrFail(ObraSocial, { id })
      em.assign(obraSocialToUpdate, req.body.sanitizedInput)
      await em.flush()
      res
        .status(200)
        .json({ message: 'obra social updated', data: obraSocialToUpdate })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  async function remove(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const character = em.getReference(ObraSocial, id)
      await em.removeAndFlush(character)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  






export { add, remove, update, findOne, findAll }