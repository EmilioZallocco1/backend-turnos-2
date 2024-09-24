import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Especialidad } from './especialidad.entity.js'

const em = orm.em

async function findAll(req: Request,res: Response) {
    try{
        const especialidades = await em.find(Especialidad, {})
        res.status(200).json({message: 'ok', data: especialidades})
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const item = await em.findOneOrFail(Especialidad, { id })
      res.status(200).json({ message: 'found especialidad', data: item })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

async function add(req: Request, res: Response) {
    
    try {
        const especialidad = em.create(Especialidad, req.body)
        await em.flush()
        res.status(201).json({message: 'ok', data: especialidad})
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}

async function update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const especialidad = em.getReference(Especialidad, id)
      em.assign(especialidad, req.body)
      await em.flush()
      res.status(200).json({ message: 'especialidad updated' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }


async function remove(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const especialidad = em.getReference(Especialidad, id)
      await em.removeAndFlush(especialidad)
      res.status(200).send({ message: 'especialidad deleted' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }


export { add, remove, update, findOne, findAll }