import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Turno } from './turno.entity.js'

const em = orm.em

async function findAll(req: Request,res: Response) {
    try{
        const turnos = await em.find(Turno, {},{ populate: ['paciente', 'medico'] })
        res.status(200).json({message: 'ok', data: turnos})
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const medico = await em.findOneOrFail(Turno, { id },{ populate: ['medico','paciente'] })
        res.status(200).json({message: 'ok', data: medico})

    }catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}

async function add(req: Request, res: Response) {
    const medico = req.body.medicoId
    const paciente = req.body.pacienteId
    const turnoAux = { ...req.body, medico, paciente }
    delete turnoAux.medicoId
    delete turnoAux.pacienteId
    try {
        const turno = em.create(Turno, turnoAux)
        await em.flush()
        res.status(201).json({message: 'ok', data: turno})
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}

async function update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const turnoToUpdate = await em.findOneOrFail(Turno, { id })
      em.assign(turnoToUpdate, req.body.sanitizedInput)
      await em.flush()
      res
        .status(200)
        .json({ message: 'turno updated', data: turnoToUpdate })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }


  async function remove(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const turno = em.getReference(Turno, id)
      await em.removeAndFlush(turno)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }





export { add, remove, update, findOne, findAll }